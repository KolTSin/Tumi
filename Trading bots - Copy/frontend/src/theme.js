document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
  
    if (saved) root.setAttribute('data-theme', saved);
  
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });
  