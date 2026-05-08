/* ============================================================
   FANCY — UI Layer
   ============================================================ */

/* ── State ── */
let currentStatus = 'owned';
let currentCat    = 'all';
let currentETab   = 'bags';

/* ── Toast ── */
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Scroll to section ── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Animate number ── */
function animateNum(el, target) {
  if (!el) return;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 24));
  const iv = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n;
    if (n >= target) clearInterval(iv);
  }, 36);
}

/* ── Update stats ── */
function updateStats() {
  const items = DB.items;
  const owned   = items.filter(i => i.status === 'owned').length;
  const desire  = items.filter(i => i.status === 'desire').length;
  const planned = Object.keys(DB.weekPlan).filter(d => DB.weekPlan[d]).length;

  animateNum(document.getElementById('stat-owned'), owned);
  animateNum(document.getElementById('stat-wish'),  desire);
  animateNum(document.getElementById('stat-ess'),   DB.essentials.length);
  animateNum(document.getElementById('stat-week'),  planned);
}

/* ─────────────────────────────────────────────
   WARDROBE
───────────────────────────────────────────── */
function updateTabCounts() {
  const items = DB.items;
  ['owned','arriving','desire','vault'].forEach(s => {
    const el = document.getElementById('cnt-' + s);
    if (el) el.textContent = items.filter(i => i.status === s).length;
  });
}

function renderWardrobe() {
  updateTabCounts();
  const grid = document.getElementById('wardrobeGrid');
  if (!grid) return;

  let filtered = DB.items.filter(i => i.status === currentStatus);
  if (currentCat !== 'all') filtered = filtered.filter(i => i.cat === currentCat);

  let html = filtered.map((item, idx) => `
    <div class="w-card" style="animation-delay:${idx * 0.04}s" data-id="${item.id}">
      <div class="w-card-img">
        ${item.img
          ? `<img src="${item.img}" alt="${item.name}" loading="lazy">`
          : `<div class="w-card-placeholder">
               <div class="w-card-ph-icon">${CAT_ICON[item.cat] || '👗'}</div>
               <div class="w-card-ph-label">No image</div>
             </div>`
        }
        <div class="w-card-overlay">
          <button class="ov-view" onclick="toast('${item.name}')">View</button>
          <button class="ov-move" onclick="cycleStatus(${item.id})">Move</button>
        </div>
      </div>
      <div class="w-status-dot dot-${item.status}"></div>
      <div class="w-card-body">
        <div class="w-card-name">${item.name}</div>
        <div class="w-card-cat">${CAT_LABEL[item.cat] || item.cat}</div>
      </div>
    </div>
  `).join('');

  html += `
    <button class="w-card-add" onclick="document.getElementById('addItemModal').classList.add('open')">
      <div class="w-card-add-plus">+</div>
      <span>Archive a piece</span>
    </button>
  `;

  grid.innerHTML = html;
}

function cycleStatus(id) {
  const items = DB.items;
  const item  = items.find(i => i.id === id);
  if (!item) return;
  const cycle = ['owned', 'arriving', 'desire', 'vault'];
  item.status = cycle[(cycle.indexOf(item.status) + 1) % cycle.length];
  DB.items = items;
  renderWardrobe();
  updateStats();
  toast(`${item.name} — moved to ${item.status}`);
}

/* Tab switches */
document.getElementById('statusTabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('#statusTabs .tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentStatus = btn.dataset.status;
  renderWardrobe();
});

/* Category filters */
document.getElementById('catFilters').addEventListener('click', e => {
  const btn = e.target.closest('.pill');
  if (!btn) return;
  document.querySelectorAll('#catFilters .pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCat = btn.dataset.cat;
  renderWardrobe();
});

/* ── Add item ── */
document.getElementById('openAddItem').addEventListener('click', () => {
  document.getElementById('addItemModal').classList.add('open');
});

document.getElementById('addImgFile').addEventListener('change', function () {
  handleImageUpload(this, 'addImgPreview', 'addUploadPrompt');
});

document.getElementById('submitAddItem').addEventListener('click', () => {
  const name   = document.getElementById('addItemName').value.trim();
  const cat    = document.getElementById('addItemCat').value;
  const status = document.getElementById('addItemStatus').value;
  const prev   = document.getElementById('addImgPreview');
  if (!name) { toast('Please name the piece'); return; }

  const items = DB.items;
  items.push({ id: Date.now(), name, cat, status, img: prev.src || null });
  DB.items = items;

  closeModal('addItemModal');
  resetForm('addItemName', 'addImgPreview', 'addUploadPrompt');
  renderWardrobe();
  updateStats();
  toast(`${name} archived`);
});

/* ─────────────────────────────────────────────
   ESSENTIALS
───────────────────────────────────────────── */
function renderMustHaves() {
  const car = document.getElementById('mustCarousel');
  if (!car) return;
  const ms = DB.mustStatus;
  car.innerHTML = MUST_HAVES.map(m => `
    <div class="must-card">
      <div class="must-card-art">${m.icon}</div>
      <div class="must-card-body">
        <div class="must-card-name">${m.name}</div>
        <div class="must-card-desc">${m.desc}</div>
        <div class="must-status-row">
          <button class="mst-btn ${ms[m.id] === 'own' ? 'own' : ''}"
            onclick="toggleMust('${m.id}','own',this)">I Own It</button>
          <button class="mst-btn ${ms[m.id] === 'want' ? 'want' : ''}"
            onclick="toggleMust('${m.id}','want',this)">I Want It</button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleMust(id, state, btn) {
  const ms  = DB.mustStatus;
  const cur = ms[id];
  ms[id] = cur === state ? 'none' : state;
  DB.mustStatus = ms;
  const row  = btn.closest('.must-status-row');
  const btns = row.querySelectorAll('.mst-btn');
  btns[0].className = `mst-btn${ms[id] === 'own'  ? ' own'  : ''}`;
  btns[1].className = `mst-btn${ms[id] === 'want' ? ' want' : ''}`;
}

function renderEssentials() {
  const grid = document.getElementById('essGrid');
  if (!grid) return;
  const filtered = DB.essentials.filter(e => e.type === currentETab);

  let html = filtered.map((e, i) => `
    <div class="ess-card${e.type === 'scents' ? ' scent' : ''}" style="animation-delay:${i*0.04}s">
      ${e.img
        ? `<img class="ess-card-img" src="${e.img}" alt="${e.name}" loading="lazy">`
        : `<div class="ess-card-icon">${ESS_ICON[e.type] || '✨'}</div>`
      }
      <div class="ess-card-name">${e.name}</div>
      ${e.notes ? `<div class="ess-card-note">${e.notes}</div>` : ''}
    </div>
  `).join('');

  html += `
    <button class="ess-card-add"
      onclick="document.getElementById('addEssModal').classList.add('open')">
      <span style="font-size:20px;color:var(--blush)">+</span>
      <span>Add one</span>
    </button>
  `;
  grid.innerHTML = html;
}

/* Carousel arrows */
document.getElementById('carLeft').addEventListener('click',  () => {
  document.getElementById('mustCarousel').scrollBy({ left: -200, behavior: 'smooth' });
});
document.getElementById('carRight').addEventListener('click', () => {
  document.getElementById('mustCarousel').scrollBy({ left: 200, behavior: 'smooth' });
});

/* Essential tabs */
document.getElementById('essTabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('#essTabs .tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentETab = btn.dataset.etab;
  renderEssentials();
});

/* Add essential */
document.getElementById('openAddEss').addEventListener('click', () => {
  document.getElementById('addEssModal').classList.add('open');
});

document.getElementById('essImgFile').addEventListener('change', function () {
  handleImageUpload(this, 'essImgPreview', 'essUploadPrompt');
});

document.getElementById('submitAddEss').addEventListener('click', () => {
  const name  = document.getElementById('essItemName').value.trim();
  const type  = document.getElementById('essItemType').value;
  const notes = document.getElementById('essItemNotes').value.trim();
  const prev  = document.getElementById('essImgPreview');
  if (!name) { toast('Please name the essential'); return; }

  const ess = DB.essentials;
  ess.push({ id: Date.now(), name, type, notes, img: prev.src || null });
  DB.essentials = ess;

  closeModal('addEssModal');
  resetForm('essItemName', 'essImgPreview', 'essUploadPrompt');
  renderEssentials();
  updateStats();
  toast(`${name} added`);
});

/* ─────────────────────────────────────────────
   MODALS
───────────────────────────────────────────── */
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.querySelectorAll('.modal-bg').forEach(bg => {
  bg.addEventListener('click', e => {
    if (e.target === bg) bg.classList.remove('open');
  });
});

/* ─────────────────────────────────────────────
   IMAGE UPLOAD
───────────────────────────────────────────── */
function handleImageUpload(input, previewId, promptId) {
  if (!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById(previewId);
    const prompt  = document.getElementById(promptId);
    preview.src = e.target.result;
    preview.style.display = 'block';
    if (prompt) prompt.style.display = 'none';
  };
  reader.readAsDataURL(input.files[0]);
}

function resetForm(nameId, previewId, promptId) {
  const nameEl   = document.getElementById(nameId);
  const preview  = document.getElementById(previewId);
  const prompt   = document.getElementById(promptId);
  if (nameEl)  nameEl.value = '';
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  if (prompt)  prompt.style.display = 'block';
}

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */
/* Smooth scroll for nav links */
document.querySelectorAll('.nav-link, .mob-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.dataset.section || link.getAttribute('href').replace('#','');
    scrollToSection(id);
    // close mobile drawer
    document.getElementById('mobDrawer').classList.remove('open');
    document.getElementById('ham').classList.remove('open');
  });
});

/* Scroll-to buttons in hero */
document.querySelectorAll('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', () => scrollToSection(btn.dataset.scroll));
});

/* Active nav on scroll */
const SECTIONS = ['atelier','wardrobe','generator','week','essentials'];
const ioOptions = { rootMargin: '-40% 0px -55% 0px' };
const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.section === id);
      });
    }
  });
}, ioOptions);
SECTIONS.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionIO.observe(el);
});

/* ─────────────────────────────────────────────
   CINEMATIC REVEAL - what ? i love drama
───────────────────────────────────────────── */

window.revealAtelier = function () {

  const tl = document.querySelector('.hero-eyebrow');
  const title = document.querySelector('.hero-title');
  const body = document.querySelector('.hero-body');
  const actions = document.querySelector('.hero-actions');
  const stats = document.querySelector('.stats-cluster');

  if (tl) {
    setTimeout(() => {
      tl.classList.add('revealed');
    }, 180);
  }

  if (title) {
    setTimeout(() => {
      title.classList.add('revealed');
    }, 520);
  }

  if (body) {
    setTimeout(() => {
      body.classList.add('revealed');
    }, 1050);
  }

  if (actions) {
    setTimeout(() => {
      actions.classList.add('revealed');
    }, 1450);
  }

  if (stats) {
    setTimeout(() => {
      stats.classList.add('revealed');
    }, 1900);
  }
}

/* other sections */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.section').forEach(s => {
  if (s.id !== 'atelier') {
    revealIO.observe(s);
  }
});
/* Top bar shadow on scroll */
window.addEventListener('scroll', () => {
  document.getElementById('topBar').classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* Hamburger */
document.getElementById('ham').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('mobDrawer').classList.toggle('open');
});

/* ─────────────────────────────────────────────
   CURSOR (desktop)
───────────────────────────────────────────── */
(function initCursor() {
  if (window.matchMedia('(pointer: fine)').matches) {
    const cur  = document.createElement('div'); cur.id  = 'fancy-cursor';
    const ring = document.createElement('div'); ring.id = 'fancy-cursor-ring';
    document.body.append(cur, ring);
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left  = mx + 'px'; cur.style.top  = my + 'px';
      ring.style.left = mx + 'px'; ring.style.top = my + 'px';
    });
  }
})();