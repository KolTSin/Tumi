export function updateMetrics(result, selectedBots) {
  const panel = document.getElementById('metrics-panel');
  panel.innerHTML = ''; // Clear previous metrics

  selectedBots.forEach(bot => {
    const metrics = result[bot]?.metrics;
    if (!metrics) return;

    const card = document.createElement('div');
    card.className = 'metric-card';

    card.innerHTML = `
  <h3>${bot}</h3>
  <p><span class="label">Final:</span> <span class="value">$${parseFloat(metrics.mean_final).toLocaleString()}</span></p>
  <p><span class="label">Sharpe:</span> <span class="value">${metrics.mean_sharpe.toFixed(2)}</span></p>
  <p><span class="label">Drawdown:</span> <span class="value ${metrics.mean_drawdown > 0.01 ? 'loss' : ''}">-${(metrics.mean_drawdown * 100).toFixed(1)}%</span></p>
  <p><span class="label">Volatility:</span> <span class="value">${(metrics.mean_volatility * 100).toFixed(1)}%</span></p>
`;


    panel.appendChild(card);
  });
}
