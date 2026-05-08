/* ============================================================
   FANCY — Weekly Planner
   ============================================================ */

/* ── Build day input grid ── */
function buildWeekInputs() {
  const grid = document.getElementById('weekDayGrid');
  if (!grid) return;
  const plan = DB.weekPlan;

  grid.innerHTML = DAYS.map(day => `
    <div class="day-input-cell">
      <div class="day-input-label">${day}</div>
      <select class="day-select" id="occ-${day}">
        ${OCCASIONS.map(o => `
          <option value="${o}" ${plan[day]?.occ === o ? 'selected' : ''}>${o}</option>
        `).join('')}
      </select>
    </div>
  `).join('');
}

/* ── Plan week ── */
document.getElementById('planWeekBtn').addEventListener('click', () => {
  const moods = ['old-money','casual','evening','old-money','casual','old-money','evening'];
  const plan  = {};

  DAYS.forEach((day, i) => {
    const sel = document.getElementById('occ-' + day);
    const occ = sel?.value;
    if (occ && occ !== '— Skip —') {
      const data = OUTFIT_DATA[moods[i]] || OUTFIT_DATA['old-money'];
      plan[day]  = { occ, pieces: data.pieces };
    }
  });

  DB.weekPlan = plan;
  updateStats();
  renderWeekOutput();
  toast('Your week is planned');
});

/* ── Workweek preset ── */
document.getElementById('workweekBtn').addEventListener('click', () => {
  const workOcc = 'Work';
  ['Monday','Tuesday','Wednesday','Thursday','Friday'].forEach(day => {
    const sel = document.getElementById('occ-' + day);
    if (sel) sel.value = workOcc;
  });
  toast('Weekdays set to Work');
});

/* ── Clear week ── */
document.getElementById('clearWeekBtn').addEventListener('click', () => {
  DB.weekPlan = {};
  updateStats();
  renderWeekOutput();
  buildWeekInputs();
  const drama = document.getElementById('weekDrama');
  drama.style.display = 'none';
  toast('Week cleared');
});

/* ── Render output ── */
function renderWeekOutput() {
  const plan    = DB.weekPlan;
  const planned = DAYS.filter(d => plan[d]).length;
  const pct     = Math.round((planned / 7) * 100);

  /* Drama */
  const drama = document.getElementById('weekDrama');
  if (planned > 0) {
    drama.style.display = 'flex';
    const pctEl = document.getElementById('dramaPct');
    const bar   = document.getElementById('dramaBar');

    let n = 0;
    const step = Math.max(1, Math.ceil(pct / 28));
    const iv = setInterval(() => {
      n = Math.min(n + step, pct);
      pctEl.innerHTML = `${n}<span>%</span>`;
      if (n >= pct) clearInterval(iv);
    }, 32);

    requestAnimationFrame(() => {
      setTimeout(() => { bar.style.width = pct + '%'; }, 60);
    });
  } else {
    drama.style.display = 'none';
  }

  /* Grid */
  const output = document.getElementById('weekOutput');
  output.innerHTML = DAYS.map(day => {
    const entry = plan[day];
    if (entry) {
      return `
        <div class="week-day-card planned">
          <div class="wdc-day">${day}</div>
          <div class="wdc-occ">${entry.occ}</div>
          <div>
            ${entry.pieces.slice(0, 3).map(p =>
              `<div class="wdc-piece">${p.type}: ${p.name}</div>`
            ).join('')}
          </div>
        </div>
      `;
    }
    return `
      <div class="week-empty-card">
        <span>${day}<br>Unplanned</span>
      </div>
    `;
  }).join('');
}

/* ── Init ── */
buildWeekInputs();
renderWeekOutput();