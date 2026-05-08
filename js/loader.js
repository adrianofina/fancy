window.addEventListener('load', () => {

  const intro = document.getElementById('intro');
  const bar   = document.getElementById('introBar');
  const app   = document.getElementById('app');

  let p = 0;

  const tick = setInterval(() => {

    const increment =
      p < 25 ? Math.random() * 3 + 1.5 :
      p < 60 ? Math.random() * 5 + 2 :
               Math.random() * 2 + 0.8;

    p = Math.min(p + increment, 100);

    if (bar) {
      bar.style.width = p + '%';
      bar.style.opacity = 0.85 + Math.random() * 0.15;
    }

    if (p >= 100) {

      clearInterval(tick);

      setTimeout(() => {

        intro.classList.add('exit');

        app.style.display = 'block';

        requestAnimationFrame(() => {
          app.classList.add('visible');
        });

        setTimeout(() => {
          intro.remove();
        }, 900);

        initApp();

      }, 280);
    }

  }, 50);

});


/* ─────  APP INIT ──── */

function initApp() {

  if (typeof renderWardrobe === 'function') {
    renderWardrobe();
  }

  if (typeof renderMustHaves === 'function') {
    renderMustHaves();
  }

  if (typeof renderEssentials === 'function') {
    renderEssentials();
  }

  if (typeof renderWeekOutput === 'function') {
    renderWeekOutput();
  }

  if (typeof updateStats === 'function') {
    updateStats();
  }

  if (typeof revealAtelier === 'function') {
    revealAtelier();
  }

}