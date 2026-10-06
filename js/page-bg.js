// Style > Background: plain / dotted / grid texture over the cover (and index) page.
// The choice lives in state.pageBg, is saved by persist.js, and is applied as
// <html data-page-bg="..."> so it survives every re-render (see style.css).
(function () {
  const VALID = ['plain', 'dotted', 'grid', 'lined', 'diagonal', 'cross', 'vlined', 'graph', 'plus', 'grain'];
  const grid = document.getElementById('pageBgGrid');
  if (!VALID.includes(state.pageBg)) state.pageBg = 'plain';

  function apply() {
    document.documentElement.setAttribute('data-page-bg', state.pageBg);
    if (!grid) return;
    grid.querySelectorAll('.bg-card').forEach(c => {
      const on = c.dataset.bg === state.pageBg;
      c.classList.toggle('active', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  function choose(card) {
    state.pageBg = card.dataset.bg;
    apply();
    if (typeof persistState === 'function') persistState(); // keyboard picks fire no click/change
  }

  if (grid) {
    grid.querySelectorAll('.bg-card').forEach(card => {
      card.addEventListener('click', () => choose(card));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(card); }
      });
    });
  }
  apply();
  window.applyPageBg = apply;
})();