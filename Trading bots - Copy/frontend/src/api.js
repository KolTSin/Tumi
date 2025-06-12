export async function fetchSimulations(botsWithParams, runs) {
  try {
    const response = await fetch('http://localhost:5000/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bots: botsWithParams,
        config: { steps: 100, runs }
      })
    });
    return await response.json();
  } catch (err) {
    alert("API request failed: " + err.message);
    return null;
  }
}
