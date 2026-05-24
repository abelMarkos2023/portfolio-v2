"use client";
import { useEffect, useState, useMemo } from "react";

type CommitEvent = { repo: string; message: string; date: number; url: string };

function formatRelativeDate(timestamp: number) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return "just now";
}

function generateHeatmap() {
  const weeks = 52;
  const days = 7;
  const data: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      week.push(rand > 0.45 ? Math.floor(rand * 8) : 0);
    }
    data.push(week);
  }
  return data;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function GitHubActivity() {
  const heatmap = useMemo(generateHeatmap, []);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; val: number } | null>(null);
  const [commits, setCommits] = useState<CommitEvent[]>([]);
  const [stats, setStats] = useState({ public_repos: 0, total_contribs: 0, streak: 14 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/github');
        const data = await res.json();
        console.log('github',data)
        
        // Try to get custom overrides from site-data
        const sd = (window as any).__SITE_DATA__;
        
        if (data.commits) {
          if (sd && sd.commits && sd.commits.length > 0) {
            // Convert dashboard format (string dates) to numeric timestamps if possible
            // or just use as is if formatRelativeDate can handle it.
            // Actually, dashboard uses string dates like "2 hours ago".
            // Let's adapt the display.
            setCommits(sd.commits.map((c: any) => ({
              ...c,
              date: isNaN(Date.parse(c.date)) ? Date.now() : Date.parse(c.date),
              displayDate: c.date // New property for manual display
            })));
          } else {
            setCommits(data.commits);
          }
        }
        
        if (data.stats) {
          setStats(prev => ({
            ...prev,
            public_repos: (sd && sd.ghStats && sd.ghStats.repos) || data.stats.public_repos,
            streak: (sd && sd.ghStats && sd.ghStats.streak) || prev.streak,
            total_contribs: (sd && sd.ghStats && sd.ghStats.totalContribs) || prev.total_contribs,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch GitHub data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalContribs = heatmap.flat().reduce((a, b) => a + b, 0);

  const cellColor = (v: number) => {
    if (v === 0) return "var(--border)";
    if (v <= 2) return "rgba(110,231,183,0.25)";
    if (v <= 4) return "rgba(110,231,183,0.5)";
    if (v <= 6) return "rgba(110,231,183,0.75)";
    return "var(--accent)";
  };

  return (
    <section id="github" style={{ padding: "100px 24px", background: "var(--bg-2)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", marginBottom: 12 }}>PROOF OF WORK</p>
        <h2 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 8 }}>GitHub Activity</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 40 }}>I ship consistently — here's the evidence.</p>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32, maxWidth: 480 }} className="gh-stats">
          {[
            { label: "Contributions this year", val: stats.total_contribs || totalContribs },
            { label: "Day streak", val: stats.streak },
            { label: "Public repos", val: stats.public_repos },
          ].map(s => (
            <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px" }}>
              <div style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                {loading ? "..." : s.val}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 24, overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {MONTHS.map((m, i) => (
              <div key={m} style={{ flex: i === MONTHS.length - 1 ? 1 : "0 0 calc(100%/12)", fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-display)" }}>{m}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 3, position: "relative" }}>
            {heatmap.map((week, wi) => (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {week.map((val, di) => (
                  <div
                    key={di}
                    onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, val })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ width: 12, height: 12, borderRadius: 2, background: cellColor(val), cursor: "default", transition: "transform 0.1s" }}
                    onMouseOver={e => (e.currentTarget.style.transform = "scale(1.3)")}
                    onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, justifyContent: "flex-end" }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Less</span>
            {[0,1,3,5,7].map(v => (
              <div key={v} style={{ width: 12, height: 12, borderRadius: 2, background: cellColor(v) }} />
            ))}
            <span style={{ fontSize: 11, color: "var(--muted)" }}>More</span>
          </div>
        </div>

        {/* Recent commits */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "var(--muted)" }}>
            RECENT COMMITS
          </div>
          {loading ? (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>Loading activity...</div>
          ) : commits.length > 0 ? (
            commits.map((c, i) => (
              <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" 
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderBottom: i < commits.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--accent-2)", flexShrink: 0, minWidth: 120 }}>{c.repo}</span>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</span>
                <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>
                  {(c as any).displayDate || formatRelativeDate(c.date)}
                </span>
              </a>
            ))
          ) : (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--muted)" }}>No recent public commits found.</div>
          )}
        </div>
      </div>
    </section>
  );
}
