import Chart from 'chart.js/auto';

let lineChart;
let histChart;

export function renderTrajectoryChart(result, selectedBots) {
  const canvas = document.getElementById('scenarioChart');
  if (!canvas) return console.warn('⚠️ #scenarioChart not found.');

  const ctx = canvas.getContext('2d');
  if (!ctx) return console.warn('⚠️ getContext() failed on #scenarioChart.');

  if (lineChart) lineChart.destroy();

  const colors = ['#0ea5e9', '#22c55e', '#ef4444', '#a855f7'];

  const datasets = selectedBots.map((bot, i) => ({
    label: bot,
    data: result[bot]?.trajectory || [],
    borderColor: colors[i % colors.length],
    backgroundColor: colors[i % colors.length] + '33',
    tension: 0.3
  }));

  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datasets[0]?.data.map((_, i) => i + 1),
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Portfolio Value Over Time' }
      }
    }
  });
}

export function renderDistributionChart(result, selectedBots) {
  const canvas = document.getElementById('distributionChart');
  if (!canvas) return console.warn('⚠️ #distributionChart not found.');

  const ctx = canvas.getContext('2d');
  if (!ctx) return console.warn('⚠️ getContext() failed on #distributionChart.');

  if (histChart) histChart.destroy();

  const colors = ['#0ea5e9', '#22c55e', '#ef4444', '#a855f7'];

  console.log(result)
  const datasets = selectedBots.map((bot, i) => {
    const returns = result[bot]?.returns || [];
    const bins = 30;
    const min = Math.min(...returns);
    const max = Math.max(...returns);
    const step = (max - min) / bins;
    const hist = Array(bins).fill(0);
    for (let r of returns) {
      const bin = Math.min(bins - 1, Math.floor((r - min) / step));
      hist[bin]++;
    }
    const labels = hist.map((_, j) => (min + j * step).toFixed(2));
    if (i === 0) window.histogramLabels = labels;

    return {
      label: bot,
      data: hist,
      backgroundColor: colors[i % colors.length] + '66'
    };
  });

  histChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: window.histogramLabels,
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Return Distribution (Monte Carlo)' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
