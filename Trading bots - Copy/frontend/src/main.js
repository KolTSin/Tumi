import { fetchSimulations } from './api.js';
import { renderTrajectoryChart } from './chart.js';
import { updateMetrics } from './metrics.js';
import { BOT_CONFIGS } from './config.js';
import './theme.js';

document.addEventListener('DOMContentLoaded', () => {
  const simulateButton = document.querySelector('.simulate-btn');
  const botSelect = document.getElementById('bot-select');
  const runsInput = document.getElementById('runs');
  // const botConfigPanel = document.getElementById('bot-config-panel');  

  botSelect.addEventListener('change', () => {
    const selectedBots = Array.from(botSelect.selectedOptions).map(opt => opt.value);
    console.log(selectedBots)
    renderBotConfigs(selectedBots);
  });

  function renderBotConfigs(selectedBots) {
    botConfigPanel.innerHTML = '';
    selectedBots.forEach(bot => {
      const configFields = BOT_CONFIGS[bot] || [];
      if (!configFields.length) return;

      // const section = document.createElement('div');
      // section.className = 'bot-config-section';
      // section.innerHTML = `<h4>${bot} Settings</h4>`;

      // configFields.forEach(field => {
      //   const input = document.createElement('input');
      //   input.type = field.type;
      //   input.id = `${bot}-${field.key}`;
      //   input.name = field.key;
      //   input.value = field.default;
      //   input.step = field.step || 1;
      //   input.min = field.min || '';
      //   input.max = field.max || '';

      //   const label = document.createElement('label');
      //   label.htmlFor = input.id;
      //   label.textContent = field.label;

      //   section.appendChild(label);
      //   section.appendChild(input);
      // });

      // botConfigPanel.appendChild(section);
    });
  }

  simulateButton.addEventListener('click', async () => {
    const selectedBots = Array.from(botSelect.selectedOptions).map(opt => opt.value);
    const runs = parseInt(runsInput.value) || 10;
    if (!selectedBots.length) return;

    const botsWithParams = selectedBots.map(bot => {
      const configFields = BOT_CONFIGS[bot] || [];
      const params = {};
      configFields.forEach(field => {
        const input = document.getElementById(`${bot}-${field.key}`);
        if (input) params[field.key] = parseFloat(input.value);
      });
      return {
        name: bot,
        params
      };
    });

    const result = await fetchSimulations(botsWithParams, runs);
    if (!result) return;

    renderTrajectoryChart(result, selectedBots);
    updateMetrics(result, selectedBots);
  });
});
