export const BOT_CONFIGS = {
    Momentum: [
      { key: 'window', label: 'Window Size', type: 'number', min: 1, max: 50, default: 5 },
      { key: 'threshold', label: 'Threshold', type: 'number', step: 0.1, default: 1.0 }
    ],
    'Mean Reversion': [
      { key: 'entry_threshold', label: 'Entry Threshold', type: 'number', step: 0.1, default: 1.0 },
      { key: 'exit_threshold', label: 'Exit Threshold', type: 'number', step: 0.1, default: 0.5 }
    ],
    Random: [] // No params
  };
  