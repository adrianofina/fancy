/* ============================================================
   FANCY — Data Layer
   ============================================================ */

const DB = {
  get items()      { return JSON.parse(localStorage.getItem('fancy-items') || '[]'); },
  set items(v)     { localStorage.setItem('fancy-items', JSON.stringify(v)); },

  get essentials() { return JSON.parse(localStorage.getItem('fancy-ess') || '[]'); },
  set essentials(v){ localStorage.setItem('fancy-ess', JSON.stringify(v)); },

  get weekPlan()   { return JSON.parse(localStorage.getItem('fancy-week') || '{}'); },
  set weekPlan(v)  { localStorage.setItem('fancy-week', JSON.stringify(v)); },

  get mustStatus() { return JSON.parse(localStorage.getItem('fancy-must') || '{}'); },
  set mustStatus(v){ localStorage.setItem('fancy-must', JSON.stringify(v)); },

  get history()    { return JSON.parse(localStorage.getItem('fancy-history') || '[]'); },
  set history(v)   { localStorage.setItem('fancy-history', JSON.stringify(v)); },
};

/* ── Seed data on first visit ── */
(function seedIfEmpty() {
  if (!DB.items.length) {
    DB.items = [
      { id: 1, name: 'The Ivory Blazer',    cat: 'old-money', status: 'owned',    img: null },
      { id: 2, name: 'Cashmere Column',      cat: 'old-money', status: 'owned',    img: null },
      { id: 3, name: 'The Silk Slip',        cat: 'evening',   status: 'owned',    img: null },
      { id: 4, name: 'Cream Trousers',       cat: 'old-money', status: 'owned',    img: null },
      { id: 5, name: 'Scarlet Shift',        cat: 'evening',   status: 'owned',    img: null },
      { id: 6, name: 'Black Wrap Dress',     cat: 'evening',   status: 'owned',    img: null },
      { id: 7, name: 'Linen Day Set',        cat: 'casual',    status: 'arriving', img: null },
      { id: 8, name: 'The Trench',           cat: 'outerwear', status: 'desire',   img: null },
      { id: 9, name: 'Floral Tea Dress',     cat: 'day-dress', status: 'desire',   img: null },
    ];
  }
  if (!DB.essentials.length) {
    DB.essentials = [
      { id: 1, name: 'Lady Tote',           type: 'bags',        notes: 'Everyday staple', img: null },
      { id: 2, name: 'Evening Clutch',      type: 'bags',        notes: 'Evenings only',   img: null },
      { id: 3, name: 'Mary Jane Heels',     type: 'shoes',       notes: 'Old money staple',img: null },
      { id: 4, name: 'Gold Stacked Rings',  type: 'accessories', notes: 'Every day',       img: null },
      { id: 5, name: 'Black Velvet Ribbon', type: 'accessories', notes: 'Choker or band',  img: null },
      { id: 6, name: "Jour d'Hermes",       type: 'scents',      notes: 'Daytime, floral', img: null },
    ];
  }
})();

/* ── Capsule must-haves (static) ── */
const MUST_HAVES = [
  { id: 'mh1',  name: 'The Trench Coat',          desc: 'The eternal outerwear',           icon: '🧥' },
  { id: 'mh2',  name: 'White Button Shirt',        desc: 'Crisp, clean, always right',      icon: '👕' },
  { id: 'mh3',  name: 'Black Tailored Trousers',   desc: 'Day to night effortlessly',       icon: '🖤' },
  { id: 'mh4',  name: 'Silk Slip Dress',           desc: 'The old money evening staple',    icon: '👗' },
  { id: 'mh5',  name: 'Cashmere Knit',             desc: 'Quiet luxury essential',          icon: '🧶' },
  { id: 'mh6',  name: 'Pointed-Toe Heels',         desc: 'Elevate any outfit',              icon: '👠' },
  { id: 'mh7',  name: 'Structured Tote',           desc: 'Arm candy, every day',            icon: '👜' },
  { id: 'mh8',  name: 'Gold Jewellery Set',         desc: 'Delicate, stackable, always on', icon: '✨' },
  { id: 'mh9',  name: 'Wide-Leg Trousers',          desc: 'The Clueless power move',         icon: '🌿' },
  { id: 'mh10', name: 'Little Black Dress',         desc: 'The archive non-negotiable',      icon: '🖤' },
  { id: 'mh11', name: 'Statement Coat',             desc: 'Let it speak before you do',      icon: '🧣' },
  { id: 'mh12', name: 'A Signature Scent',          desc: 'The final detail',                icon: '🌸' },
];

/* ── Category helpers ── */
const CAT_LABEL = {
  'old-money': 'Old Money',
  'casual':    'Effortless Casual',
  'evening':   'Evening Silhouette',
  'day-dress': 'Day Dress',
  'outerwear': 'Outerwear',
};
const CAT_ICON = {
  'old-money': '🧥', 'casual': '👕', 'evening': '👗',
  'day-dress': '🌸', 'outerwear': '🧣',
};
const ESS_ICON = { bags: '👜', shoes: '👠', accessories: '💍', scents: '🌸' };

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const OCCASIONS = ['— Skip —','Work','College','Date Night','Friends','Chill Day','Night Out','Event','Rest Day'];