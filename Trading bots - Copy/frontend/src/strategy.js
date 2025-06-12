import Chart from 'chart.js/auto';

const chartConfigs = {
  momentumChart: {
    label: 'Momentum Performance',
    data: [10000, 10200, 10800, 11500, 11300, 12000],
    color: '#0ea5e9'
  },
  meanReversionChart: {
    label: 'Mean Reversion Performance',
    data: [10000, 9950, 10050, 10100, 9950, 10150],
    color: '#6366f1'
  },
  randomChart: {
    label: 'Random Performance',
    data: [10000, 10020, 9970, 10100, 9900, 10050],
    color: '#9ca3af'
  }
};

Object.entries(chartConfigs).forEach(([id, config]) => {
  const ctx = document.getElementById(id);
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: config.data.map((_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: config.label,
            data: config.data,
            fill: false,
            borderColor: config.color,
            backgroundColor: config.color,
            tension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }
});
