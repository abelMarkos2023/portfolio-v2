import { NextResponse } from 'next/server';

export async function GET() {
  const username = 'abelMarkos2023';
  
  try {
    // Fetch user profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}` // Optional: if token is available
      },
      next: { revalidate: 60 } // Cache for 1 minute during debug
    });
    
    if (!profileRes.ok) {
      throw new Error(`GitHub profile fetch failed: ${profileRes.statusText}`);
    }
    
    const profileData = await profileRes.json();
    
    // Fetch user events (recent activity) - requesting more per page
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 60 }
    });
    
    if (!eventsRes.ok) {
      throw new Error(`GitHub events fetch failed: ${eventsRes.statusText}`);
    }
    
    const eventsData = await eventsRes.json();
    
    // Fetch user repos to supplement activity if events are sparse
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 60 }
    });
    
    let reposData = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }
    
    // Filter for events to get activity
    const activity: any[] = [];
    const seenRepos = new Set();
    
    // 1. Process real events first
    for (const event of eventsData) {
      if (activity.length >= 10) break;

      const repoName = event.repo.name.split('/')[1];
      const date = new Date(event.created_at).getTime();
      seenRepos.add(repoName);

      if (event.type === 'PushEvent') {
        if (event.payload.commits && event.payload.commits.length > 0) {
          for (const commit of event.payload.commits) {
            if (activity.length >= 10) break;
            activity.push({
              repo: repoName,
              message: commit.message,
              date: date,
              url: `https://github.com/${event.repo.name}/commit/${commit.sha}`
            });
          }
        } else if (event.payload.head) {
          activity.push({
            repo: repoName,
            message: `Pushed to ${event.payload.ref.split('/').pop()}`,
            date: date,
            url: `https://github.com/${event.repo.name}/commit/${event.payload.head}`
          });
        }
      } else if (event.type === 'CreateEvent') {
        activity.push({
          repo: repoName,
          message: `Created ${event.payload.ref_type} ${event.payload.ref || ''}`,
          date: date,
          url: `https://github.com/${event.repo.name}`
        });
      } else if (event.type === 'PullRequestEvent') {
        activity.push({
          repo: repoName,
          message: `${event.payload.action} pull request: ${event.payload.pull_request.title}`,
          date: date,
          url: event.payload.pull_request.html_url
        });
      } else if (event.type === 'WatchEvent') {
        activity.push({
          repo: repoName,
          message: `Starred repository`,
          date: date,
          url: `https://github.com/${event.repo.name}`
        });
      } else if (event.type === 'ForkEvent') {
        activity.push({
          repo: repoName,
          message: `Forked repository`,
          date: date,
          url: event.payload.forkee.html_url
        });
      }
    }

    // 2. Supplement with latest updated repos if we have less than 10 items
    if (activity.length < 10) {
      const backfillRepos = [];
      for (const repo of reposData) {
        if (activity.length + backfillRepos.length >= 10) break;
        if (seenRepos.has(repo.name)) continue;
        backfillRepos.push(repo);
      }

      // Fetch latest commit for each backfill repo in parallel
      const commitPromises = backfillRepos.map(async (repo) => {
        try {
          const commitRes = await fetch(`https://api.github.com/users/${username}/events/public`, {
            // Re-using events if possible, but events only go back 90 days.
            // For older repos, we fetch the latest commit message.
          });
          
          // Actually, the most reliable way to get the LATEST commit message for an OLD repo 
          // is to hit the /commits endpoint for that specific repo.
          const repoCommitsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=1`, {
            headers: { 'Accept': 'application/vnd.github.v3+json' },
            next: { revalidate: 3600 }
          });

          if (repoCommitsRes.ok) {
            const commits = await repoCommitsRes.json();
            if (commits && commits.length > 0) {
              return {
                repo: repo.name,
                message: commits[0].commit.message,
                date: new Date(commits[0].commit.author.date).getTime(),
                url: commits[0].html_url
              };
            }
          }
        } catch (e) {
          console.error(`Failed to fetch commit for ${repo.name}:`, e);
        }

        // Fallback if commit fetch fails
        return {
          repo: repo.name,
          message: `Updated repository: ${repo.description || 'No description'}`,
          date: new Date(repo.updated_at).getTime(),
          url: repo.html_url
        };
      });

      const backfillActivity = await Promise.all(commitPromises);
      activity.push(...backfillActivity);
    }

    // Sort combined activity by date descending
    activity.sort((a, b) => b.date - a.date);

    // Prepare response
    const response = NextResponse.json({
      stats: {
        public_repos: profileData.public_repos,
        followers: profileData.followers,
        following: profileData.following,
      },
      commits: activity
    });

    // Disable caching for verification
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
    
  } catch (error: any) {
    console.error('Error fetching GitHub data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
