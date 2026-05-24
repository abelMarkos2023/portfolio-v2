async function testApi() {
  const url = 'http://localhost:3000/api/github';
  try {
    console.log('Testing GitHub API route...');
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error('Body:', text);
      return;
    }
    const data = await res.json();
    console.log('API Response received:');
    console.log('Stats:', data.stats);
    console.log('Commits count:', data.commits ? data.commits.length : 0);
    if (data.commits && data.commits.length > 0) {
      console.log('First commit:', data.commits[0]);
    }
  } catch (err) {
    console.error('Error testing API:', err);
  }
}

testApi();
