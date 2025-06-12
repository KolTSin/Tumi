import { BOT_CONFIGS } from './config.js';
import { renderDistributionChart  } from './chart.js';
import { updateMetrics } from './metrics.js';

document.addEventListener('DOMContentLoaded', () => {
    // addBotBtn, runScenarioBtn, etc. logic here

  
const botList = document.getElementById('bot-list');
const addBotBtn = document.getElementById('add-bot');
const runScenarioBtn = document.getElementById('run-scenario');
const chartCanvas = document.getElementById('scenarioChart');
const metricsPanel = document.getElementById('scenario-metrics');

let botCounter = 0;

function createBotCard() {
  const id = `bot-${botCounter++}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'bot-config-section';
  wrapper.dataset.botId = id;

  const select = document.createElement('select');
  select.innerHTML = Object.keys(BOT_CONFIGS).map(bot => `<option value="${bot}">${bot}</option>`).join('');

  const configFields = document.createElement('div');
  configFields.className = 'bot-fields';

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.placeholder = 'Label (optional)';
  labelInput.className = 'bot-label';

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'simulate-btn';
  removeBtn.onclick = () => wrapper.remove();

  select.onchange = () => renderFields(select.value, configFields, id);

  wrapper.append(select, configFields, labelInput, removeBtn);
  botList.appendChild(wrapper);

  renderFields(select.value, configFields, id);
}

function renderFields(botName, container, id) {
  container.innerHTML = '';
  const fields = BOT_CONFIGS[botName] || [];
  fields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.label;
    const input = document.createElement('input');
    input.type = field.type;
    input.step = field.step || 1;
    input.min = field.min || '';
    input.max = field.max || '';
    input.value = field.default;
    input.name = `${id}-${field.key}`;
    container.append(label, input);
  });
}

addBotBtn.addEventListener('click', createBotCard);

document.getElementById('save-scenario').addEventListener('click', () => {
  const steps = parseInt(document.getElementById('steps').value);
  const trend = parseFloat(document.getElementById('trend').value);
  const volatility = parseFloat(document.getElementById('volatility').value);

  const bots = Array.from(botList.children).map(section => {
    const botName = section.querySelector('select').value;
    const label = section.querySelector('.bot-label').value || botName;
    const fields = BOT_CONFIGS[botName] || [];
    const params = {};

    fields.forEach(field => {
      const input = section.querySelector(`[name="${section.dataset.botId}-${field.key}"]`);
      if (input) params[field.key] = parseFloat(input.value);
    });

    return { name: botName, label, params };
  });

  localStorage.setItem('scenario', JSON.stringify({ market: { steps, trend, volatility }, bots }));
  alert('Scenario saved!');
});

document.getElementById('load-scenario').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('scenario') || '{}');
  if (!data.market || !data.bots) return alert('No scenario found');

  document.getElementById('steps').value = data.market.steps;
  document.getElementById('trend').value = data.market.trend;
  document.getElementById('volatility').value = data.market.volatility;

  botList.innerHTML = '';
  data.bots.forEach(bot => {
    createBotCard();
    const lastCard = botList.lastElementChild;
    const select = lastCard.querySelector('select');
    select.value = bot.name;
    select.dispatchEvent(new Event('change'));

    const labelInput = lastCard.querySelector('.bot-label');
    labelInput.value = bot.label;

    const fields = BOT_CONFIGS[bot.name] || [];
    fields.forEach(field => {
      const input = lastCard.querySelector(`[name="${lastCard.dataset.botId}-${field.key}"]`);
      if (input) input.value = bot.params[field.key];
    });
  });
});

runScenarioBtn.addEventListener('click', async () => {
    const steps = parseInt(document.getElementById('steps').value);
    const trend = parseFloat(document.getElementById('trend').value);
    const volatility = parseFloat(document.getElementById('volatility').value);
    const runs = parseInt(document.getElementById('runs').value); // new
    
    const bots = Array.from(botList.children).map(section => {
      const botName = section.querySelector('select').value;
      const label = section.querySelector('.bot-label').value || botName;
      const fields = BOT_CONFIGS[botName] || [];
      const params = {};
    
      fields.forEach(field => {
        const input = section.querySelector(`[name="${section.dataset.botId}-${field.key}"]`);
        if (input) params[field.key] = parseFloat(input.value);
      });
    
      return { name: botName, label, params };
    });
    
    const response = await fetch('/api/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        market: { steps, trend, volatility, runs },
        bots
      })
    });

    const result = await response.json();
    console.log(result)

    renderDistributionChart(result, bots.map(b => b.label));
    updateMetrics(result, bots.map(b => b.label));
});

});