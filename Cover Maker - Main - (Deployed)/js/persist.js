// Remembers commonly reused choices across page refreshes (localStorage).
// Saved: doc type (assignment/lab), template, palette, font, university, department,
// student name/ID/roll/section/semester, course, "to"/"by" details, index style, logo.
// NOT saved: assignment no/title, dates, group data, lab entries, untouched sample data.
//
// Self-contained: restores itself when this file loads (before app-init.js runs),
// saves on every input/change/render, and re-applies the saved logo after setupLogo().
const PERSIST_KEY = 'coverGenie.saved.v1';
const PERSIST_FIELDS = [
  'docType', 'language', 'template', 'palette', 'paperFont', 'banglaFont',
  'universityName', 'deptTitle', 'department',
  'studentName', 'studentId', 'roll', 'section', 'semester',
  'courseTitle', 'courseCode',
  'toName', 'toDesignation', 'byName', 'byId',
  'indexTemplate', 'pageLayout', 'pageBg', 'autoPaletteMatch',
  '_byNameTouched', '_byIdTouched', '_deptTitleTouched'
];
let __savedLogo = null;
let __persistRestored = false;
// Tracks the `updatedAt` of the payload this tab last read or wrote, so a
// backgrounded tab can tell whether some OTHER tab has saved something newer
// since (see saveIfNotStale below).
let __syncedAt = 0;

function readPersisted() {
  try {
    const v = JSON.parse(localStorage.getItem(PERSIST_KEY) || 'null');
    return v && typeof v === 'object' ? v : null;
  } catch (e) { return null; }
}

function restoreSaved() {
  if (__persistRestored) return;
  __persistRestored = true;
  const saved = readPersisted();
  if (!saved) return;
  __syncedAt = saved.updatedAt || 0;

  PERSIST_FIELDS.forEach(k => {
    if (saved[k] !== undefined && saved[k] !== null) state[k] = saved[k];
  });

  // Guard against stale ids. Group is not restored: it needs member rows that aren't saved.
  if (state.docType !== 'lab') state.docType = 'assignment';
  if (state.language !== 'bn') state.language = 'en';
  if (!TEMPLATES.some(t => t.id === state.template)) state.template = 'cards';
  if (!FONTS.some(f => f.id === state.paperFont)) state.paperFont = 'times';
  if (!BANGLA_FONTS.some(f => f.id === state.banglaFont)) state.banglaFont = 'adornoirrit';
  if (!INDEX_TEMPLATES.some(t => t.id === state.indexTemplate)) state.indexTemplate = 'tabular';

  // One-time migration: before the cover-font fix, the Bangla font picker had no
  // visible effect, so a stray 'Noto Serif Bengali' choice may be saved. Reset it
  // to Li Ador Noirrit once; the picker still works normally afterwards.
  if (saved.fontFixV !== 2) state.banglaFont = 'adornoirrit';
  if (state.pageLayout !== 'row' && state.pageLayout !== 'col') state.pageLayout = 'row';
  if (['plain', 'dotted', 'grid'].indexOf(state.pageBg) === -1) state.pageBg = 'plain';
  // state.palette stays as-is: getPalette() falls back to the first palette,
  // and custom palettes are loaded later in init().

  // The logo needs the sidebar UI to exist, so it is applied after setupLogo().
  if (saved.logoSource && saved.logoDataUrl) {
    __savedLogo = { source: saved.logoSource, dataUrl: saved.logoDataUrl, auto: !!saved.logoAutoMatched };
  }
}

function applySavedLogo() {
  if (!__savedLogo || typeof restoreSavedLogo !== 'function') return;
  try { restoreSavedLogo(__savedLogo.source, __savedLogo.dataUrl, __savedLogo.auto); } catch (e) { }
  __savedLogo = null;
}

function savePersisted() {
  try {
    const prev = readPersisted() || {};
    const out = {};
    // After "Load sample", fields still holding sample values are not saved; anything
    // the user has typed over the sample (or filled in) is.
    const isUntouchedSample = k => state.demoLoaded && typeof SAMPLE !== 'undefined'
      && ((SAMPLE[k] !== undefined && SAMPLE[k] !== '' && state[k] === SAMPLE[k])
        || (typeof SAMPLE_LAB !== 'undefined' && SAMPLE_LAB[k] !== undefined && SAMPLE_LAB[k] !== '' && state[k] === SAMPLE_LAB[k]));
    PERSIST_FIELDS.forEach(k => { out[k] = isUntouchedSample(k) ? (prev[k] !== undefined ? prev[k] : '') : state[k]; });
    out.logoSource = state.logoSource || '';
    out.logoDataUrl = state.logoDataUrl || '';
    out.logoAutoMatched = !!state.logoAutoMatched;
    out.fontFixV = 2;
    out.updatedAt = Date.now();
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(out));
    } catch (e) {
      // Most likely quota (big uploaded logo): retry without it.
      out.logoSource = ''; out.logoDataUrl = ''; out.logoAutoMatched = false;
      localStorage.setItem(PERSIST_KEY, JSON.stringify(out));
    }
    __syncedAt = out.updatedAt;
  } catch (e) {
    console.warn('[persist] could not save:', e);
  }
}

let __persistTimer = null;
function persistState() {
  clearTimeout(__persistTimer);
  __persistTimer = setTimeout(savePersisted, 300);
}

// Used only for the "quiet" triggers below (tab losing focus / closing), never
// for a real edit. With more than one tab of the app open, a tab you've
// switched away from and forgotten about still fires these on every tab
// switch — and since localStorage is shared, whichever tab saves LAST wins,
// not whichever one you actually meant to keep. If some other, more recently
// active tab has already saved something newer than what this tab last saw,
// this tab's own in-memory state is the stale one here, so skip the write
// instead of clobbering the newer data with it.
function saveIfNotStale() {
  const current = readPersisted();
  if (current && (current.updatedAt || 0) > __syncedAt) return;
  savePersisted();
}

function clearSaved() {
  try { localStorage.removeItem(PERSIST_KEY); } catch (e) { }
}

// Restore now, before app-init.js calls init().
try { restoreSaved(); } catch (e) { console.warn('[persist] could not restore:', e); }

// Re-apply the saved logo right after the sidebar's logo controls exist.
if (typeof setupLogo === 'function' && !setupLogo.__persistWrapped) {
  const __origSetupLogo = setupLogo;
  setupLogo = function () {
    const r = __origSetupLogo.apply(this, arguments);
    applySavedLogo();
    return r;
  };
  setupLogo.__persistWrapped = true;
}

// Save on any edit, independent of render(), and when the tab is hidden or closed.
document.addEventListener('input', persistState, true);
document.addEventListener('change', persistState, true);
document.addEventListener('click', persistState, true);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveIfNotStale(); });
window.addEventListener('pagehide', saveIfNotStale);

// Handy from the browser console: coverGeniePersist.show() / .save() / .clear()
window.coverGeniePersist = {
  key: PERSIST_KEY,
  show: () => readPersisted(),
  save: savePersisted,
  clear: clearSaved
};