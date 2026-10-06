let renderTimer = null;
function showLoader(opts = {}) {
  const x = document.getElementById('appLoader');
  if (!x) return;
  if (typeof opts === 'string') opts = { text: opts };
  const iconEl  = x.querySelector('#appLoaderIcon');
  const titleEl = x.querySelector('#appLoaderTitle');
  const textEl  = x.querySelector('#appLoaderText');
  if (iconEl && opts.icon !== undefined)  iconEl.innerHTML  = `<i class="${opts.icon}"></i>`;
  if (titleEl && opts.title !== undefined) titleEl.textContent = opts.title;
  if (textEl  && opts.text  !== undefined) textEl.textContent  = opts.text;
  x.dataset.loaderMode = opts.mode || 'default';
  x.classList.add('show');
  x.setAttribute('aria-hidden', 'false');
  if (opts.duration) {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(hideLoader, opts.duration);
  }
}
function hideLoader() {
  const x = document.getElementById('appLoader');
  if (!x) return;
  x.classList.remove('show');
  x.setAttribute('aria-hidden', 'true');
}
// ---- Preview placeholders --------------------------------------------------
// When a required field is still empty, the cover shows sample placeholder text
// (Student Name, 000000, dd/mm/yyyy ...) instead of a blank gap or a dash, so
// someone just browsing templates sees how a filled-in cover will look.
// Optional fields (section/batch, experiment date, guest-teacher university,
// logo) get NO placeholder and keep their normal "skip it" behaviour.
// Implemented as a temporary overlay on `state` for the duration of one
// renderer call, so no template needs to change and nothing placeholder-ish is
// ever written to state, localStorage (persist.js) or the sidebar inputs.
const PREVIEW_PLACEHOLDERS = {
  en: {
    universityName: 'University Name', deptTitle: 'Department Name',
    studentName: 'Student Name', studentId: '000000000', roll: '00', semester: '0th',
    courseTitle: 'Course Title', courseCode: '000000',
    assignmentNo: '00', assignmentTitle: '{word} Name',
    toName: "Teacher's Name", toDesignation: 'Designation',
    dateSubmission: 'dd/mm/yyyy', groupName: 'Group Name'
  },
  bn: {
    universityName: 'বিশ্ববিদ্যালয়ের নাম', deptTitle: 'বিভাগের নাম',
    studentName: 'শিক্ষার্থীর নাম', studentId: '০০০০০০০০০', roll: '০০', semester: '০ম',
    courseTitle: 'কোর্সের নাম', courseCode: '০০০০০০',
    assignmentNo: '০০', assignmentTitle: '{word} এর নাম',
    toName: 'শিক্ষকের নাম', toDesignation: 'পদবি',
    dateSubmission: 'দিন/মাস/বছর', groupName: 'গ্রুপের নাম'
  }
};
const PREVIEW_FILL_KEYS = ['universityName', 'deptTitle', 'studentName', 'studentId', 'roll', 'semester',
  'courseTitle', 'courseCode', 'assignmentNo', 'assignmentTitle', 'toName', 'toDesignation', 'dateSubmission'];
function withPreviewPlaceholders(fn) {
  const P = PREVIEW_PLACEHOLDERS[state.language === 'bn' ? 'bn' : 'en'];
  const saved = {};
  const put = (k, v) => { if (!(k in saved)) saved[k] = state[k]; state[k] = v; };
  const isEmpty = k => !String(state[k] == null ? '' : state[k]).trim();
  try {
    PREVIEW_FILL_KEYS.forEach(k => {
      if (!isEmpty(k)) return;
      put(k, k === 'assignmentTitle' ? P.assignmentTitle.replace('{word}', getDocType().word) : P[k]);
    });
    if (state.docType === 'group') {
      if (isEmpty('groupName')) put('groupName', P.groupName);
      if (typeof groupMembersData === 'function' && !groupMembersData().length) {
        put('groupMembers', [1, 2, 3].map(() => ({ name: P.studentName, studentId: P.studentId, roll: P.roll, isLeader: false })));
      }
    }
    return fn();
  } finally {
    Object.keys(saved).forEach(k => { state[k] = saved[k]; });
  }
}
function render(opts = {}) {
  document.getElementById('paper').innerHTML = withPreviewPlaceholders(RENDERERS[state.template]);
  applyPaperFont();
  if (state.template === 'spring') adjustSpringGroupLayout();
  const t = TEMPLATES.find(t => t.id === state.template);
  document.getElementById('tplLabel').textContent = t ? t.name : '';
  renderIndexPage();
  updateStageLayout();
  if (typeof persistState === 'function') persistState();
  if (opts.loading) {
    showLoader({
      icon: 'fa-solid fa-pen-ruler',
      title: opts.title || 'Painting your cover',
      text: opts.text || 'Updating cover…',
      mode: 'render'
    });
    clearTimeout(renderTimer);
    renderTimer = setTimeout(hideLoader, 1000);
  }
}
function syncInputs() {
  document.querySelectorAll('[data-bind]').forEach(el => {
    const key = el.dataset.bind;
    if (el.type === 'file') return;
    el.value = state[key] ?? "";
  });
}
const NAME_CAP_FIELDS = new Set(['studentName', 'byName', 'toName']);
function capitalizeName(str) {
  return (str || "").replace(/(^|\s)(\S)/g, (m, sep, ch) => sep + ch.toUpperCase());
}
function applyNameCap(el) {
  if (!NAME_CAP_FIELDS.has(el.dataset.bind)) return;
  const capitalized = capitalizeName(el.value);
  if (capitalized === el.value) return;
  const start = el.selectionStart, end = el.selectionEnd;
  el.value = capitalized;
  if (start !== null && start !== undefined) el.setSelectionRange(start, end);
}
let __renderQueued = false;
function scheduleRender() {
  // Coalesce bursts of input events into one render per frame.
  if (__renderQueued) return;
  __renderQueued = true;
  requestAnimationFrame(() => { __renderQueued = false; render(); });
}
function bindInputs() {
  document.querySelectorAll('[data-bind]').forEach(el => {
    const handler = (ev) => {
      applyNameCap(el);
      // 'input' already applied this value; skip the redundant 'change' pass.
      if (ev && ev.type === 'change' && state[el.dataset.bind] === el.value) return;
      state[el.dataset.bind] = el.value;
      if (el.dataset.bind === 'studentName' && !state._byNameTouched) {
        state.byName = el.value;
      }
      if (el.dataset.bind === 'studentId' && !state._byIdTouched) {
        state.byId = el.value;
      }
      if (el.dataset.bind === 'byName') state._byNameTouched = true;
      if (el.dataset.bind === 'byId') state._byIdTouched = true;
      if (el.dataset.bind === 'department' && !state._deptTitleTouched) {
        state.deptTitle = deriveDeptTitle(el.value);
      }
      if (el.dataset.bind === 'department' && typeof autoMatchUniversityLogo === 'function') {
        autoMatchUniversityLogo(state.universityName);
      }
      if (el.dataset.bind === 'deptTitle') state._deptTitleTouched = true;
      scheduleRender();
      syncByFields();
    };
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  });
    const rollEl = document.querySelector('[data-bind="roll"]');
  if (rollEl) {
    rollEl.addEventListener('blur', () => {
      const v = rollEl.value.trim();
      if (v && /^\d$/.test(v)) {
        rollEl.value = '0' + v;
        state.roll = rollEl.value;
        render();
      }
    });
  }
}
function requiredFieldEls() {
  return Array.from(document.querySelectorAll('[data-bind][required]'));
}
function isFieldEmpty(el) { return !String(el.value ?? "").trim(); }
function setupRequiredFieldHints() {
  requiredFieldEls().forEach(el => {
    const check = () => el.classList.toggle('field-missing', el.dataset.touched === '1' && isFieldEmpty(el));
    el.addEventListener('blur', () => { el.dataset.touched = '1'; check(); });
    el.addEventListener('input', check);
    el.addEventListener('change', check);
  });
}
// Required fields that are actually on screen. The sidebar holds duplicate /
// mode-specific inputs (individual vs group, lab-only, ...); those inside a
// display:none section can't be filled by the user, so they never count.
function isFieldInLiveSection(el) {
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    if (getComputedStyle(n).display === 'none') return false;
  }
  return true;
}
function requiredFieldLabel(el) {
  const grab = lab => {
    const first = lab.querySelector(':scope > span:not(.req):not(.opt)');
    return ((first || lab).textContent || '').replace('*', '').trim();
  };
  const own = el.parentElement && el.parentElement.querySelector(':scope > label');
  if (own) return grab(own);
  for (let n = el; n && n.tagName !== 'BODY'; n = n.parentElement) {
    for (let s = n.previousElementSibling; s; s = s.previousElementSibling) {
      if (s.tagName === 'LABEL') return grab(s);
      if (s.classList && s.classList.contains('group-title')) break;
    }
    if (n.parentElement && n.parentElement.classList.contains('group-body')) break;
  }
  return (el.getAttribute('placeholder') || el.dataset.bind || '').replace(/^Enter\s+(your\s+)?/i, '').trim();
}
function getMissingRequiredFields() {
  const seen = new Set();
  return requiredFieldEls()
    .filter(el => isFieldEmpty(el) && isFieldInLiveSection(el))
    .map(el => ({ el, label: requiredFieldLabel(el) }))
    .filter(m => {
      const k = m.el.dataset.bind + '|' + m.label;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
}
function checkRequiredFieldsBeforeExport() {
  const missing = getMissingRequiredFields();
  missing.forEach(({ el }) => { el.dataset.touched = '1'; el.classList.add('field-missing'); });
  const hint = document.getElementById('exportHint');
  if (missing.length && hint) {
    hint.textContent = `Heads up — ${missing.length} required field${missing.length > 1 ? 's are' : ' is'} still empty. Exporting anyway.`;
    hint.className = 'hint warn';
  }
  return missing.length === 0;
}
function syncByFields() {
  const byN = document.querySelector('[data-bind="byName"]');
  const byI = document.querySelector('[data-bind="byId"]');
  const deptT = document.querySelector('[data-bind="deptTitle"]');
  if (byN && !state._byNameTouched) byN.value = state.byName;
  if (byI && !state._byIdTouched) byI.value = state.byId;
  if (deptT && !state._deptTitleTouched) deptT.value = state.deptTitle;
}