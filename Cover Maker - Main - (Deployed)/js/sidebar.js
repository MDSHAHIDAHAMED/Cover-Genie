const CORNER_CHECK_SVG = '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>';
// Template picker is split into collapsible categories (flat, borderless sub-accordions).
// Ids not listed here fall into a trailing "More" group so a new template never disappears.
const TEMPLATE_CATEGORIES = [
  { key: 'minimal', label: 'Clean & Minimal',    ids: ['cards', 'spectrum', 'spring'] },
  { key: 'formal',  label: 'Formal & Framed',    ids: ['ledger', 'formal', 'sigil', 'banner', 'brief'] },
  { key: 'bold',    label: 'Bold & Geometric',   ids: ['brutalist', 'voltalic', 'obliqua'] },
  { key: 'soft',    label: 'Atmospheric & Soft', ids: [ 'circles', 'emblem', 'halo', 'dusk'] }
];
// Label comes from i18n.js (tplCat_formal, tplCat_minimal, tplCat_bold, tplCat_soft, tplCat_more)
// and falls back to the English label above if the string hasn't been added yet.
function templateCategoryLabel(cat) {
  const key = 'tplCat_' + cat.key;
  const v = (typeof t === 'function') ? t(key) : key;
  return (v && v !== key) ? v : cat.label;
}
function buildTemplatePicker() {
  const grid = document.getElementById('tplGrid');
  const cardHtml = tpl => `
    <div class="tpl-card ${tpl.id === state.template ? 'active' : ''}" data-tpl="${tpl.id}">
      <span class="tpl-check" aria-hidden="true">${CORNER_CHECK_SVG}</span>
      <div class="tpl-swatch" id="sw-${tpl.id}"></div>
      <span>${tpl.name}</span>
      <small>${tpl.note}</small>
    </div>`;
  const placed = new Set();
  const cats = TEMPLATE_CATEGORIES.map(c => {
    const items = c.ids.map(id => TEMPLATES.find(x => x.id === id)).filter(Boolean);
    items.forEach(x => placed.add(x.id));
    return { key: c.key, label: c.label, items };
  });
  const rest = TEMPLATES.filter(x => !placed.has(x.id));
  if (rest.length) cats.push({ key: 'more', label: 'More', items: rest });
  const visible = cats.filter(c => c.items.length);
  const openCat = visible.find(c => c.items.some(x => x.id === state.template)) || visible[0];
  grid.innerHTML = visible.map(c => {
    const open = c === openCat;
    return `
    <div class="tpl-sub${open ? ' open' : ''}">
      <button type="button" class="tpl-sub-head" aria-expanded="${open}">
        <span class="tpl-sub-name">${templateCategoryLabel(c)}</span>
        <span class="tpl-sub-count">${c.items.length}</span>
        <i class="fa-solid fa-chevron-down tpl-sub-chev" aria-hidden="true"></i>
      </button>
      <div class="tpl-sub-body"><div class="tpl-sub-inner"><div class="tpl-grid">${c.items.map(cardHtml).join('')}</div></div></div>
    </div>`;
  }).join('');
  // One sub-accordion open at a time keeps the panel calm; clicking the open one collapses it.
  grid.querySelectorAll('.tpl-sub-head').forEach(head => {
    head.addEventListener('click', () => {
      const sub = head.parentElement;
      const willOpen = !sub.classList.contains('open');
      grid.querySelectorAll('.tpl-sub.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.tpl-sub-head').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        sub.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
  grid.querySelectorAll('.tpl-card').forEach(card => {
    card.addEventListener('click', () => {
      state.template = card.dataset.tpl;
      grid.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const trimmed = enforceGroupMemberCap();
      if (trimmed) updateGroupLimitHint({ trimmed: true });
      // enforceGroupMemberCap() only re-renders (which refreshes the "Add
      // member" button's capped look + the limit hint) when it actually had
      // to trim members. Switching to a template with a HIGHER cap while
      // already at the old cap trims nothing, so without this the button
      // stays stuck showing "disabled" even though there's room again.
      else renderGroupMembers();
      render();
    });
  });
  paintSwatches();
}
let _idxTplGridBound = false;
function buildIndexTemplatePicker() {
  const grid = document.getElementById('idxTplGrid');
  if (!grid) return;
  grid.innerHTML = INDEX_TEMPLATES.map(t => `
    <div class="tpl-card ${t.id === state.indexTemplate ? 'active' : ''}" data-idxtpl="${t.id}">
      <span class="tpl-check" aria-hidden="true">${CORNER_CHECK_SVG}</span>
      <div class="tpl-swatch" id="idxsw-${t.id}"></div>
      <span>${t.name}</span>
      <small>${t.note}</small>
    </div>`).join('');
  if (!_idxTplGridBound) {
    _idxTplGridBound = true;
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.tpl-card[data-idxtpl]');
      if (!card) return;
      const tplId = card.dataset.idxtpl;
      state.indexTemplate = tplId;
      grid.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      refreshIndexPreview();
    });
  }
  paintIndexSwatches();
}
function paintIndexSwatches() {
  const defs = {
    tabular: `<div style="position:absolute;top:8px;left:8px;right:8px;height:5px;background:#1e5993;border-radius:2px;"></div><div style="position:absolute;top:18px;left:8px;right:8px;bottom:10px;display:flex;flex-direction:column;gap:4px;">${[0, 1, 2].map(() => '<div style="flex:1;border-bottom:1px solid rgba(0,0,0,0.18);"></div>').join('')}</div>`,
    ruled: `<div style="position:absolute;top:10px;left:8px;right:8px;bottom:10px;display:flex;flex-direction:column;justify-content:space-between;">${[0, 1, 2, 3].map(() => '<div style="height:2px;background:#c9ccd4;border-radius:2px;"></div>').join('')}</div>`,
    bordered: `<div style="position:absolute;inset:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px;">${[0, 1, 2, 3].map(() => '<div style="border:1.5px solid #6b1d52;border-radius:3px;"></div>').join('')}</div>`,
    watermark: `<div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);width:13px;height:13px;border-radius:50%;background:#1e5993;"></div><div style="position:absolute;top:23px;left:22%;right:22%;height:3px;background:#555;border-radius:2px;"></div><div style="position:absolute;top:31px;left:8px;right:8px;bottom:8px;border:1.5px solid #1e5993;border-radius:2px;display:flex;flex-direction:column;">${[0, 1, 2].map(() => '<div style="flex:1;border-bottom:1px solid rgba(30,89,147,0.35);"></div>').join('')}</div>`
  };
  INDEX_TEMPLATES.forEach(t => {
    const el = document.getElementById('idxsw-' + t.id);
    if (el) el.innerHTML = defs[t.id] || '';
  });
}
function addLabEntry() {
  addLabEntries(1);
}
function nextLabNo() {
  const nums = state.labEntries.map(e => parseInt(e.no, 10)).filter(Number.isFinite);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return String(Math.max(next, state.labEntries.length + 1)).padStart(2, '0');
}
function addLabEntries(count) {
  const n = Math.floor(count);
  if (!n || n < 1) return;
  for (let i = 0; i < n; i++) {
    state.labEntries.push({ id: labEntrySeq++, no: nextLabNo(), name: "", date: "", page: "" });
  }
  renderLabEntries();
  refreshIndexPreview();
}
function removeLabEntry(id) {
  state.labEntries = state.labEntries.filter(e => e.id !== id);
  renderLabEntries();
  refreshIndexPreview();
}
function bulkAddLabEntries(count) {
  const n = Math.floor(count);
  if (!n || n < 1) return;
  state.labEntries = state.labEntries.filter(e =>
    (e.name && e.name.trim()) || (e.date && e.date.trim()) || (e.page && String(e.page).trim())
  );
  addLabEntries(n);
}
function renderLabEntries() {
  const list = document.getElementById('labEntriesList');
  if (!list) return;
  if (!state.labEntries.length) {
    list.innerHTML = `<p class="le-empty">${esc(t('leEmpty'))}</p>`;
    return;
  }
  list.innerHTML = state.labEntries.map(e => `
    <div class="lab-entry-row" data-id="${e.id}">
      <div class="le-fields">
        <div class="le-fields-inline">
          <input type="text" class="le-no" data-field="no" value="${esc(e.no)}" placeholder="${esc(t('leNoPlaceholder'))}">
          <input type="text" class="le-name" data-field="name" value="${esc(e.name)}" placeholder="${esc(t('leNamePlaceholder'))}">
        </div>
        <div class="le-fields-inline">
          <input type="date" class="le-date" data-field="date" value="${esc(e.date)}">
          <input type="text" class="le-page" data-field="page" value="${esc(e.page || '')}" placeholder="${esc(t('lePagePlaceholder'))}">
        </div>
      </div>
      <button type="button" class="le-remove" aria-label="${esc(t('leRemoveAria'))}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    </div>`).join('');
  list.querySelectorAll('.le-date').forEach(enhanceDateInput);
  list.querySelectorAll('.lab-entry-row').forEach(row => {
    const id = Number(row.dataset.id);
    row.querySelectorAll('input[data-field]').forEach(inp => {
      inp.addEventListener('input', () => {
        const entry = state.labEntries.find(e => e.id === id);
        if (entry) entry[inp.dataset.field] = inp.value;
        renderIndexPage();
      });
      inp.addEventListener('change', () => {
        const isLastRow = state.labEntries.length && state.labEntries[state.labEntries.length - 1].id === id;
        const entry = state.labEntries.find(e => e.id === id);
        const isFilled = entry && entry.no && entry.name && entry.date && entry.page;
        if (isLastRow && isFilled) addLabEntry();
      });
    });
    row.querySelector('.le-remove').addEventListener('click', () => removeLabEntry(id));
  });
}
function addGroupMembers(count) {
  const n = Math.floor(count);
  if (!n || n < 1) return;
  const max = getTemplateMaxMembers();
  const room = Math.max(0, max - state.groupMembers.length);
  const toAdd = Math.min(n, room);
  for (let i = 0; i < toAdd; i++) {
    state.groupMembers.push({ id: groupMemberSeq++, name: "", roll: "", studentId: "", isLeader: false });
  }
  renderGroupMembers();
  scheduleRender();
}
function addGroupMember() { addGroupMembers(1); }
function removeGroupMember(id) {
  state.groupMembers = state.groupMembers.filter(m => m.id !== id);
  renderGroupMembers();
}
// Trims the roster down to the current template's cap (dropping members from
// the end) and refreshes the sidebar. Used when switching to a template that
// supports fewer members than are currently filled in.
function enforceGroupMemberCap() {
  const max = getTemplateMaxMembers();
  if (state.groupMembers.length <= max) return false;
  state.groupMembers = state.groupMembers.slice(0, max);
  renderGroupMembers();
  return true;
}
function updateGroupLimitHint(opts = {}) {
  const el = document.getElementById('groupLimitHint');
  if (!el) return;
  const max = getTemplateMaxMembers();
  if (opts.trimmed) {
    const tplName = (TEMPLATES.find(t => t.id === state.template) || {}).name || 'This template';
    el.textContent = max === 1 ? tf('gmLimitTrimmedOne', { tpl: tplName }) : tf('gmLimitTrimmed', { tpl: tplName, max: numL(max) });
    el.className = 'hint warn';
    return;
  }
  if (!Number.isFinite(max)) {
    el.textContent = '';
    el.style.display = 'none';
    return;
  }
  el.style.display = '';
  el.textContent = tf('gmLimitHint', { max: numL(max) });
  el.className = 'hint';
}
// Flashes the group-limit hint when "Add member" is clicked at max capacity.
function showGroupCapMessage() {
  const el = document.getElementById('groupLimitHint');
  if (!el) return;
  const max = getTemplateMaxMembers();
  const tplName = (TEMPLATES.find(t => t.id === state.template) || {}).name || 'This template';
  el.textContent = max === 1 ? tf('gmLimitCapOne', { tpl: tplName }) : tf('gmLimitCap', { tpl: tplName, max: numL(max) });
  el.className = 'hint warn';
  el.classList.remove('hint-shake');
  void el.offsetWidth; // restart animation
  el.classList.add('hint-shake');
}
function setGroupLeader(id) {
  state.groupMembers.forEach(m => { m.isLeader = (m.id === id); });
  renderGroupMembers();
}
function renderGroupMembers() {
  const list = document.getElementById('groupMembersList');
  const addBtn = document.getElementById('addGroupMemberBtn');
  if (addBtn) {
    addBtn.classList.toggle('is-capped', state.groupMembers.length >= getTemplateMaxMembers());
  }
  updateGroupLimitHint();
  if (!list) return;
  if (!state.groupMembers.length) {
    list.innerHTML = `<p class="le-empty">${esc(t('gmNoMembers'))}</p>`;
    return;
  }
  list.innerHTML = state.groupMembers.map((m, idx) => {
    const isRequired = idx < 2;
    const reqAttr = isRequired ? ' required aria-required="true"' : '';
    const reqLabel = isRequired ? ' <span class="req">*</span>' : '';
    return `
    <div class="lab-entry-row gm-row" data-id="${m.id}">
      <div class="gm-header">
        <span class="gm-idx"><i class="fa-solid fa-user" aria-hidden="true"></i> ${esc(tf('memberFallback', { n: numL(idx + 1) }))}${reqLabel}</span>
        <span class="gm-header-right">
          ${m.isLeader ? `<span class="gm-leader-badge"><i class="fa-solid fa-crown" aria-hidden="true"></i> ${t('leaderBadge')}</span>` : ''}
          <button type="button" class="le-remove" aria-label="${esc(t('gmRemoveAria'))}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        </span>
      </div>
      <div class="le-fields">
        <div class="le-fields-inline">
          <div class="field-suggest"><input type="text" class="gm-name" data-field="name" value="${esc(m.name)}" placeholder="${esc(t('gmFullNamePh'))}" autocomplete="off"${reqAttr}></div>
        </div>
        <div class="le-fields-inline">
          <input type="text" class="gm-roll" data-field="roll" value="${esc(m.roll || '')}" placeholder="${esc(t('gmRollPh'))}">
          <div class="field-suggest"><input type="text" class="gm-id" data-field="studentId" value="${esc(m.studentId)}" placeholder="${esc(t('gmIdPh'))}" autocomplete="off"${reqAttr}></div>
        </div>
        ${state.hasGroupLeader ? `
        <label class="checkbox-label gm-leader-label">
          <input type="radio" name="groupLeaderRadio" class="gm-leader" ${m.isLeader ? 'checked' : ''}>
          ${esc(t('gmLeaderLabel'))}
        </label>` : ''}
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('.lab-entry-row').forEach(row => {
    const id = Number(row.dataset.id);
    row.querySelectorAll('input[data-field]').forEach(inp => {
      inp.addEventListener('input', () => {
        const m = state.groupMembers.find(x => x.id === id);
        if (m) m[inp.dataset.field] = inp.value;
        scheduleRender();
      });
    });
    const leaderRadio = row.querySelector('.gm-leader');
    if (leaderRadio) leaderRadio.addEventListener('change', () => { setGroupLeader(id); scheduleRender(); });
    row.querySelector('.le-remove').addEventListener('click', () => { removeGroupMember(id); scheduleRender(); });
    attachGroupMemberSuggest(row, id);
  });
}
// Name / ID suggestions for a member row. Only offers saved students whose
// university, department and batch match the ones filled in above (see groupMatchPool).
function attachGroupMemberSuggest(row, id) {
  const nameEl = row.querySelector('.gm-name');
  const idEl = row.querySelector('.gm-id');
  const rollEl = row.querySelector('.gm-roll');
  const onPick = (item) => {
    const m = state.groupMembers.find(x => x.id === id);
    if (!m) return;
    m.name = item.data.studentName || '';
    m.studentId = item.id;
    nameEl.value = m.name;
    idEl.value = m.studentId;
    if (item.data.roll) { m.roll = item.data.roll; rollEl.value = m.roll; }
    scheduleRender();
  };
  attachStudentSuggest(nameEl, {
    mainField: 'name', getSubText: it => it.id, minChars: 1, max: 5, onPick,
    getMatches: (q, max) => matchGroupStudents(q, 'name', max, id)
  });
  attachStudentSuggest(idEl, {
    mainField: 'id', getSubText: it => it.data.studentName, minChars: 1, max: 5, onPick,
    getMatches: (q, max) => matchGroupStudents(q, 'id', max, id)
  });
}
// Success-only hint: shown when saved students match the university, department
// and batch entered above. Nothing is shown when there is no match.
function updateGroupSuggestHint() {
  const el = document.getElementById('groupSuggestHint');
  if (!el) return;
  const n = groupMatchPool().length;
  if (!n) {
    el.textContent = '';
    el.style.display = 'none';
    return;
  }
  el.textContent = `${n} saved student${n === 1 ? '' : 's'} match this university, department and batch \u2014 start typing a name or ID.`;
  el.className = 'hint ok';
  el.style.display = '';
}
function setupGroupControls() {
  const addBtn = document.getElementById('addGroupMemberBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (state.groupMembers.length >= getTemplateMaxMembers()) {
        showGroupCapMessage();
        return;
      }
      addGroupMember();
    });
  }
  const leaderCheck = document.getElementById('groupHasLeaderCheck');
  if (leaderCheck) {
    leaderCheck.checked = state.hasGroupLeader;
    leaderCheck.addEventListener('change', () => {
      state.hasGroupLeader = leaderCheck.checked;
      if (!state.hasGroupLeader) state.groupMembers.forEach(m => { m.isLeader = false; });
      renderGroupMembers();
      scheduleRender();
    });
  }
  if (!state.groupMembers.length) addGroupMembers(2);
  renderGroupMembers();
  document.querySelectorAll('[data-bind="universityName"], [data-bind="department"], [data-bind="section"]').forEach(el => {
    const onChange = () => updateGroupSuggestHint();
    el.addEventListener('input', onChange);
    el.addEventListener('change', onChange);
  });
  updateGroupSuggestHint();
}
// Clears fields whose meaning is tied to the doc type, so switching (say)
// Assignment -> Lab Report -> Group Assignment doesn't leave stale values
// sitting under a label that no longer matches them.
function resetDocTypeFields(prevType, nextType) {
  if (!state.demoLoaded) {
    state.assignmentNo = '';
    state.assignmentTitle = '';
  }
  if (prevType === nextType) return;
  const wasGroup = prevType === 'group';
  const isGroup = nextType === 'group';
  if (wasGroup || isGroup) {
    state.groupName = '';
    state.hasGroupLeader = false;
    state.groupMembers = [];
    const leaderCheck = document.getElementById('groupHasLeaderCheck');
    if (leaderCheck) leaderCheck.checked = false;
    if (isGroup) addGroupMembers(2);
    else renderGroupMembers();
  }
}
function toggleGroupUI() {
  const isGroup = state.docType === 'group';
  const lookupGroup = document.getElementById('lookupGroup');
  const studentIdGroup = document.getElementById('studentIdGroup');
  const groupDetailsGroup = document.getElementById('groupDetailsGroup');
  if (lookupGroup) lookupGroup.style.display = isGroup ? 'none' : 'block';
  if (studentIdGroup) studentIdGroup.style.display = isGroup ? 'none' : 'block';
  if (groupDetailsGroup) groupDetailsGroup.style.display = isGroup ? 'block' : 'none';
  updateGroupSuggestHint();
}
function toggleIndexUI() {
  const isLab = state.docType === 'lab';
  document.getElementById('needIndexWrap').style.display = isLab ? 'block' : 'none';
  document.getElementById('dateExpWrap').style.display = isLab ? 'block' : 'none';
  if (!isLab) {
    state.needIndex = false;
    state.dateExperiment = '';
    const expInput = document.getElementById('dateExperimentInput');
    if (expInput) expInput.value = '';
    render();
  } else {
    state.dateSubmission = '';
    const subInput = document.getElementById('dateSubmissionInput');
    if (subInput) subInput.value = '';
    render();
  }
  syncDocCheckStates();
  syncIndexGroupVisibility();
  toggleIndexDetails();
}
function syncDocCheckStates() {
  document.getElementById('needIndexCheck').checked = state.needIndex;
  document.getElementById('checkIndexWrap').classList.toggle('active', state.needIndex);
}
const INDEX_ACCORDION_GROUP_IDS = ['idxTplGroup', 'indexDetailsWrap', 'labEntriesWrap'];
function syncIndexGroupVisibility() {
  const shouldShow = state.docType === 'lab' && state.needIndex;
  INDEX_ACCORDION_GROUP_IDS.forEach(id => {
    const group = document.getElementById(id);
    if (!group) return;
    group.style.display = shouldShow ? 'block' : 'none';
    if (!shouldShow && group.querySelector(':scope > .group-body')) {
      closeAccordionGroup(group);
    }
  });
}
function toggleIndexDetails() {
  const dlGroup = document.getElementById('downloadSelectGroup');
  const summary = document.getElementById('downloadSummary');
  if (dlGroup && summary) {
    dlGroup.style.display = state.docType === 'lab' ? 'block' : 'none';
    const msg = state.needIndex ? t('downloadNoticeBothText') : t('downloadNoticeText');
    summary.innerHTML = `<i class="fa-solid fa-circle-info download-notice-icon" aria-hidden="true"></i> ${msg}`;
  }
}
// Language switch is a hard reset, not a translation-in-place: text typed
// under one script is meaningless (often literally unreadable, e.g. Latin
// input alongside Bangla labels) once the other language's fonts/labels take
// over, so every user-entered field is cleared rather than carried across.
// App-level choices (doc type, template, palette, fonts, layout, saved custom
// palettes) are left alone — those aren't "fields" the person typed data into.
function resetAllFields() {
  const preserved = {
    docType: state.docType, language: state.language, template: state.template,
    palette: state.palette, paperFont: state.paperFont, banglaFont: state.banglaFont,
    autoPaletteMatch: state.autoPaletteMatch, indexTemplate: state.indexTemplate,
    pageLayout: state.pageLayout, pageBg: state.pageBg, customPalettes: state.customPalettes
  };
  Object.assign(state, {
    studentName: "", studentId: "", roll: "", department: "", section: "", semester: "",
    courseTitle: "", courseCode: "", assignmentNo: "", assignmentTitle: "",
    byName: "", byId: "",
    dateSubmission: "", dateExperiment: "",
    universityName: "", deptTitle: "",
    toName: "", toDesignation: "", toUniversity: "", isGuestTeacher: false,
    demoLoaded: false,
    needIndex: false, indexTitle: "", indexSubtitle: "", labEntries: [],
    groupName: "", hasGroupLeader: false, groupMembers: [],
    _byNameTouched: false, _byIdTouched: false, _deptTitleTouched: false
  }, preserved);

  labEntrySeq = 1;
  groupMemberSeq = 1;

  // Logo: reuse the existing "clear logo" button's own click handler instead
  // of duplicating its DOM bookkeeping (locked upload/directory state, the
  // preview placeholder text).
  const logoClearBtn = document.getElementById('logoClear');
  if (logoClearBtn) logoClearBtn.click();

  // Rebuild the default two blank group-member rows; clear typed lab entries
  // back to the empty-state placeholder.
  if (typeof addGroupMembers === 'function') addGroupMembers(2);
  if (typeof renderLabEntries === 'function') renderLabEntries();

  // Reset checkboxes and re-fire their own change handlers so dependent UI
  // (guest-university field, index accordion groups, download notice) falls
  // back in line without duplicating that logic here.
  ['needIndexCheck', 'groupHasLeaderCheck', 'guestTeacherCheck'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.checked = false;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  if (typeof syncDocCheckStates === 'function') syncDocCheckStates();
  if (typeof syncIndexGroupVisibility === 'function') syncIndexGroupVisibility();
  if (typeof toggleIndexDetails === 'function') toggleIndexDetails();
  if (typeof refreshIndexPreview === 'function') refreshIndexPreview();

  syncInputs();
  syncByFields();
}
function setupIndexControls() {
  document.getElementById('needIndexCheck').addEventListener('change', e => {
    state.needIndex = e.target.checked;
    if (state.needIndex && !state.labEntries.length) addLabEntry();
    syncDocCheckStates();
    syncIndexGroupVisibility();
    toggleIndexDetails();
    refreshIndexPreview();
  });
  document.getElementById('indexTitleInput').addEventListener('input', e => { state.indexTitle = e.target.value; renderIndexPage(); });
  document.getElementById('indexSubtitleInput').addEventListener('input', e => { state.indexSubtitle = e.target.value; renderIndexPage(); });
  document.getElementById('addLabEntryBtn').addEventListener('click', addLabEntry);
  const bulkBtn = document.getElementById('labBulkAddBtn');
  const bulkInput = document.getElementById('labBulkCount');
  if (bulkBtn && bulkInput) {
    const runBulkAdd = () => {
      const n = Math.floor(Number(bulkInput.value));
      if (!n || n < 1) return;
      bulkAddLabEntries(Math.min(n, 50));
      bulkInput.value = '';
    };
    bulkBtn.addEventListener('click', runBulkAdd);
    bulkInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); runBulkAdd(); }
    });
  }
  renderLabEntries();
  toggleIndexUI();
}
let _guestTeacherToggleInit = false;
function setupGuestTeacherToggle() {
  if (_guestTeacherToggleInit) return;
  const check = document.getElementById('guestTeacherCheck');
  const wrap = document.getElementById('guestUniversityWrap');
  const uniInput = document.getElementById('toUniversityInput');
  if (!check || !wrap) return;
  _guestTeacherToggleInit = true;
  function sync() {
    state.isGuestTeacher = check.checked;
    wrap.style.display = check.checked ? 'block' : 'none';
    if (!check.checked) {
      state.toUniversity = '';
      if (uniInput) uniInput.value = '';
    }
    render();
  }
  check.addEventListener('change', sync);
  sync();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupGuestTeacherToggle);
} else {
  setupGuestTeacherToggle();
}
const TEMPLATE_DEFAULT_PALETTE_ID = {
  cards: "navy",
  emblem: "navy",
  spring: "spring",
  dusk: "navy",
  circles: "diu",
  brief: "maroon",
  ledger: "navy",
  sigil: "navy",
  voltalic: "spring",
  obliqua: "forest",
  banner: "navy",
  formal: "navy",
  halo: "amber",
  spectrum: "amber",
  brutalist: "amber"
};
function getTemplateDefaultPalette(tplId) {
  const id = TEMPLATE_DEFAULT_PALETTE_ID[tplId] || "navy";
  return PALETTES.find(p => p.id === id) || PALETTES[0];
}
function paintSwatches() {
  // Site theme: black + brass. Every swatch is drawn from these tokens only.
  const BRASS = '#D6A24A';   // --brass
  const BRASS_2 = '#F0C378';   // --brass-2
  const BRASS_D = '#8a6a2c';   // deep brass
  const INK = '#14110a';   // near-black (warm)
  const INK_2 = '#2a2418';   // softer black
  const MID = '#8d846f';   // mid warm grey
  const LINE = '#cfc6b2';   // light rule / placeholder line
  const LINE_2 = '#e6dfcf';   // hairline
  const PAPER = '#fbf8f2';   // paper
  const PAPER_2 = '#f1eadb';   // tinted paper block
  const B = a => hexToRgba(BRASS, a);

  const defs = {
    cards: `<div style="position:absolute;top:0;left:0;width:60%;height:9px;background:${BRASS};border-radius:0 0 8px 0;"></div><div style="position:absolute;bottom:0;right:0;width:60%;height:9px;background:${BRASS};border-radius:8px 0 0 0;"></div><div style="position:absolute;top:14px;left:8px;right:8px;bottom:14px;display:flex;gap:4px;"><div style="flex:1;background:${PAPER_2};border-radius:4px;"></div><div style="flex:1;background:${PAPER_2};border-radius:4px;"></div></div>`,
    spring: `<div style="position:absolute;top:0;left:0;right:0;height:8px;background:${BRASS};"></div><div style="position:absolute;top:22px;left:8px;width:16px;height:16px;border:2px solid ${BRASS};border-radius:50%;"></div><div style="position:absolute;top:22px;left:32px;right:8px;height:6px;background:${INK};border-radius:2px;"></div><div style="position:absolute;top:34px;left:32px;right:18px;height:4px;background:${LINE};border-radius:2px;"></div><div style="position:absolute;bottom:9px;left:8px;right:8px;height:2px;background:${BRASS};"></div>`,
    emblem: `<div style="position:absolute;inset:0;background:radial-gradient(circle at 60% 40%, ${B(0.30)}, transparent 60%);"></div><div style="position:absolute;top:5px;right:7px;width:38px;height:38px;overflow:hidden;display:flex;align-items:center;justify-content:center;opacity:.95;filter:grayscale(1) sepia(1) saturate(2.2) brightness(.85);"><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">${EMBLEM_ART_SVG.replace('<svg ', '<svg style="width:100%;height:100%;display:block;" ')}</div></div><div style="position:absolute;bottom:8px;left:8px;right:8px;height:2px;background:${INK};"></div>`,
    dusk: `<div style="position:absolute;top:0;left:0;bottom:0;width:34%;background:linear-gradient(180deg,#0c0a06 0%,#4a3615 45%,${BRASS_D} 78%,${INK} 100%);"></div><div style="position:absolute;top:6px;left:22%;width:1px;height:1px;border-radius:50%;background:#fff;opacity:.8;"></div><div style="position:absolute;top:16px;left:4%;width:1px;height:1px;border-radius:50%;background:#fff;opacity:.6;"></div><div style="position:absolute;top:28px;left:26%;width:1px;height:1px;border-radius:50%;background:#fff;opacity:.75;"></div><div style="position:absolute;top:38px;left:11%;width:1px;height:1px;border-radius:50%;background:#fff;opacity:.55;"></div><div style="position:absolute;top:46px;left:29%;width:1px;height:1px;border-radius:50%;background:#fff;opacity:.7;"></div><div style="position:absolute;top:4px;left:30%;width:1px;height:1px;border-radius:50%;background:#fff;opacity:.5;"></div><div style="position:absolute;top:53px;left:6%;width:1px;height:1px;border-radius:50%;background:#fff;opacity:.6;"></div><div style="position:absolute;top:9px;left:9%;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff6df,${BRASS_2} 60%,transparent 76%);box-shadow:0 0 8px 2px ${B(0.5)};"></div><div style="position:absolute;top:22px;left:42%;right:8px;height:6px;background:${INK_2};border-radius:2px;"></div><div style="position:absolute;top:34px;left:42%;right:16px;height:4px;background:${LINE};border-radius:2px;"></div><div style="position:absolute;bottom:9px;left:42%;right:8px;height:6px;display:flex;gap:3px;"><div style="flex:1;background:${PAPER_2};border-radius:2px;"></div><div style="flex:1;background:${PAPER_2};border-radius:2px;"></div></div>`,
    circles: `<div style="position:absolute;top:13px;left:7px;right:15px;height:26px;border:1.5px solid ${INK};border-radius:7px; margin-left:8px;"></div><svg style="position:absolute;top:-20px;right:-16px;width:52px;height:52px;" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="26" r="26" fill="${BRASS}"/><circle cx="26" cy="26" r="17" fill="${PAPER}"/><rect x="26" y="0" width="26" height="26" fill="${PAPER}"/></svg><div style="position:absolute;bottom:10px;left:18px;right:15px;height:1.5px;background:${LINE};border-radius:2px;"></div><div style="position:absolute;bottom:4px;left:22px;right:20px;height:2px;background:${BRASS};border-radius:2px;"></div><svg style="position:absolute;bottom:-14px;left:-12px;width:36px;height:36px;" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><circle cx="0" cy="36" r="34" fill="${PAPER}" stroke="${PAPER}" stroke-width="2"/><circle cx="0" cy="36" r="30" fill="${BRASS}" opacity="0.75"/></svg>`,
    brief: `
    <div style="position:absolute;inset:4px;border:1px solid ${INK_2};"></div>
    <div style="position:absolute;top:4px;left:4px;width:0;height:0;border-style:solid;border-width:15px 15px 0 0;border-color:${INK_2} transparent transparent transparent;"></div>
    <div style="position:absolute;top:4px;left:4px;width:0;height:0;border-style:solid;border-width:12px 12px 0 0;border-color:${BRASS} transparent transparent transparent;"></div>
    <div style="position:absolute;top:16px;left:11px;width:24px;height:8px;background:${INK};border-radius:1px;"></div>
    <div style="position:absolute;top:27px;left:11px;width:20px;height:2px;background:${BRASS};"></div>
    <div style="position:absolute;bottom:14px;left:11px;right:11px;height:1px;background:${LINE};"></div>
    <div style="position:absolute;bottom:9px;left:11px;right:11px;height:1px;background:${LINE};"></div>`,
    ledger: `
    <div style="position:absolute;top:4px;inset:3px;border:1.5px solid ${LINE};border-radius:2px;"></div>
    <div style="position:absolute;top:8px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:3px;">
    <div style="width:6px;height:6px;border-radius:50%;background:${BRASS};"></div>
    <div style="width:22px;height:2.5px;background:${BRASS};border-radius:1px;"></div>
    </div>
    <div style="position:absolute;top:16px;left:14px;right:14px;height:7px;border:1.5px solid ${INK};border-radius:2px;display:flex;align-items:center;justify-content:center;"></div>
    <div style="position:absolute;top:27px;left:50%;transform:translateX(-50%);width:26px;height:5px;background:${PAPER_2};border:1px solid ${MID};border-radius:6px;"></div>
    <div style="position:absolute;bottom:6px;left:8px;right:8px;height:18px;display:flex;gap:4px;"><div style="flex:1;border:1px solid ${MID};border-radius:3px;padding:3px;display:flex;flex-direction:column;gap:2px;box-sizing:border-box;">
    <div style="width:70%;height:2px;background:${BRASS};border-radius:1px;"></div>
    <div style="width:50%;height:1.2px;background:${LINE};border-radius:1px;"></div>
    <div style="width:55%;height:1.2px;background:${LINE};border-radius:1px;"></div>
    </div>
    <div style="position:relative;flex:1;border:1px solid ${MID};border-radius:3px;padding:3px;box-sizing:border-box;">
    <div style="position:absolute; top:8px; left:24px;width:50%;height:1.2px;background:${LINE};border-radius:1px;"></div>
    <div style="position:absolute; top:11px; left:24px;width:50%;height:1.2px;background:${LINE};border-radius:1px;"></div>
    <div style="width:70%;height:2px;background:${BRASS};border-radius:1px; margin-left:14px;"></div>
    </div>
    </div>`,
    sigil: `<div style="position:absolute; top:3px;left:3px;padding:10px;border:1px solid ${INK_2};border-radius:2px; height:90%; width:95%; overflow:hidden;">
    <div style="position:absolute;top:22px;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;background:${BRASS};opacity:0.14;"></div>
    <div style="position:absolute;top:4px;left:50%;transform:translateX(-50%);width:7px;height:7px;border-radius:50%;background:${BRASS};"></div>
    <div style="position:absolute;top:13px;left:22%;right:22%;height:1.5px;background:${BRASS};border-radius:1px;"></div>
    <div style="position:absolute;top:18px;left:30%;right:30%;height:2px;background:${INK};border-radius:1px;"></div>
    <div style="position:absolute;top:24px;left:10px;width:16px;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;top:28px;left:10px;width:24px;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;top:34px;left:44px;right:44px;width:30px;height:5px;background:${PAPER_2};border:1px solid ${MID};border-radius:6px;"></div>
    <div style="position:absolute;top:41px;left:10px;width:14px;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;top:45px;left:10px;width:20px;height:1.5px;background:${LINE};"></div>
    </div>`,
    voltalic: `
    <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};">
    <div style="position:absolute;top:6px;left:7px;width:16px;height:2.5px;background:${INK};"></div>
    <div style="position:absolute;top:13px;left:7px;width:26px;height:5px;background:${BRASS};"></div>
    <div style="position:absolute;top:23px;left:7px;width:22px;height:5px;background:${INK};"></div>
    <div style="position:absolute;top:34px;left:7px;width:16px;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;top:38px;left:7px;width:22px;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;bottom:-16px;right:-16px;width:46px;height:46px;background:${INK};transform:rotate(45deg);"></div>
    <div style="position:absolute;bottom:-6px;right:10px;width:34px;height:16px;background:${BRASS};transform:rotate(45deg);opacity:.95;"></div>
    </div>`,
    obliqua: `
    <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};">
    <div style="position:absolute;top:4px;left:7px;width:18px;height:2px;background:${MID};"></div>
    <div style="position:absolute;top:8.5px;left:7px;width:26px;height:4.5px;background:${BRASS};"></div>
    <div style="position:absolute;top:15px;left:7px;width:19px;height:4.5px;background:${INK};"></div>
    <div style="position:absolute;top:23px;left:-14px;right:-14px;height:7.5px;background:${BRASS};transform:rotate(-10deg);"></div>
    <div style="position:absolute;top:14.5px;left:22px;right:-14px;height:2px;background:${BRASS_2};transform:rotate(-10deg);"></div>
    <div style="position:absolute;top:38px;left:-14px;right:26px;height:2px;background:${BRASS_2};transform:rotate(-10deg);"></div>
    <div style="position:absolute;bottom:7px;left:7px;width:22px;height:2.5px;background:${INK};"></div>
    <div style="position:absolute;bottom:3px;left:7px;width:16px;height:1.5px;background:${LINE};"></div>
    </div>`,
    banner: `
    <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};">
    <div style="position:absolute;inset:3px;border:2px solid ${INK};"></div>
    <div style="position:absolute;top:9px;left:9px;width:7px;height:7px;border-radius:50%;background:${BRASS};"></div>
    <div style="position:absolute;top:10px;left:19px;width:24px;height:4px;background:${INK};"></div>
    <div style="position:absolute;top:18px;left:9px;right:9px;height:8px;background:${INK};border-radius:0px 4px 0 4px;"></div>
    <div style="position:absolute;top:31px;left:9px;width:36px;height:9px;border:1px solid ${BRASS};border-radius:4px 0 4px 0;"></div>
    <div style="position:absolute;top:40px;right:9px;width:36px;height:9px;border:1px solid ${BRASS};border-radius:4px 0 4px 0;"></div>
    <div style="position:absolute;bottom:7px;left:9px;right:9px;height:4px;background:${BRASS};border-radius:0px 2px 0px 2px;"></div>
    </div>`,
    formal: `
    <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};">
    <div style="position:absolute;top:5px;left:50%;margin-left:-5px;width:10px;height:10px;border-radius:50%;background:${BRASS};"></div>
    <div style="position:absolute;top:19px;left:16%;right:16%;height:3px;background:${INK};"></div>
    <div style="position:absolute;top:25px;left:26%;right:26%;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;top:33px;left:36%;right:36%;height:1.5px;background:${MID};"></div>
    <div style="position:absolute;top:36px;left:14%;right:14%;height:3px;background:${INK};"></div>
    <div style="position:absolute;bottom:16px;left:12%;width:34%;height:2px;background:${BRASS};box-shadow:0 4px 0 ${LINE},0 7px 0 ${LINE};"></div>
    <div style="position:absolute;bottom:16px;right:12%;width:34%;height:2px;background:${BRASS};box-shadow:0 4px 0 ${LINE},0 7px 0 ${LINE};"></div>
    <div style="position:absolute;bottom:4px;left:38%;right:38%;height:2px;background:${INK_2};"></div>
    </div>`,
    halo: `
    <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};">
    <div style="position:absolute;top:-22px;left:-22px;width:44px;height:44px;border-radius:50%;background:${BRASS};opacity:.22;"></div>
    <div style="position:absolute;top:-22px;left:-22px;width:30px;height:30px;border-radius:50%;background:${BRASS};opacity:.22;"></div>
    <div style="position:absolute;bottom:-20px;right:-20px;width:34px;height:34px;border-radius:50%;background:${BRASS};opacity:.22;"></div>
    <div style="position:absolute;top:5px;left:50%;margin-left:-4px;width:8px;height:8px;border-radius:50%;background:${BRASS};"></div>
    <div style="position:absolute;top:15px;left:30%;right:30%;height:2px;background:${INK_2};"></div>
    <div style="position:absolute;top:20px;left:40%;right:40%;height:4px;background:${INK};"></div>
    <div style="position:absolute;top:29px;left:8px;right:8px;height:17px;border:1px solid ${LINE};border-radius:4px;"></div>
    <div style="position:absolute;top:33px;left:13px;width:14px;height:1.5px;background:${MID};"></div>
    <div style="position:absolute;top:38px;left:13px;width:20px;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;bottom:4px;left:38%;right:38%;height:1.5px;background:${MID};"></div>
    </div>`,
    spectrum: `
    <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};">
    <div style="position:absolute;top:6px;left:9px;width:9px;height:9px;border-radius:50%;background:${BRASS};"></div>
    <div style="position:absolute;top:7px;left:22px;width:34%;height:2px;background:${INK_2};"></div>
    <div style="position:absolute;top:11px;left:22px;width:22%;height:1.5px;background:${LINE};"></div>
    <div style="position:absolute;top:19px;left:9px;right:9px;height:1px;background:${LINE_2};"></div>
    <div style="position:absolute;top:23px;left:9px;width:20%;height:1.5px;background:${MID};"></div>
    <div style="position:absolute;top:27px;left:9px;width:40%;height:7px;background:${INK};border-radius:1px;"></div>
    <div style="position:absolute;top:38px;left:9px;width:30%;height:1.5px;background:${INK_2};box-shadow:0 4px 0 ${LINE};"></div>
    <div style="position:absolute;top:38px;left:54%;width:30%;height:1.5px;background:${INK_2};box-shadow:0 4px 0 ${LINE},0 8px 0 ${LINE};"></div>
    ${[[3, 13], [15, 8], [27, 16], [39, 11], [51, 18], [63, 12], [75, 15], [87, 9]].map(([l, h]) =>
      `<div style="position:absolute;bottom:0;left:${l}%;width:9%;height:${h}px;background:${B(0.2)};border-top:2px solid ${BRASS};"></div>`).join('\n    ')}
    </div>`,
    brutalist: `
    <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};">
    <div style="position:absolute;top:0;right:0;width:56%;height:30%;background:${B(0.16)};clip-path:polygon(14% 0,100% 0,100% 100%,3% 74%);"></div>
    <div style="position:absolute;top:6px;left:9px;width:24%;height:1.5px;background:${MID};"></div>
    <div style="position:absolute;top:11px;left:9px;right:15px;height:3px;background:${B(0.55)};"></div>
    <div style="position:absolute;top:18px;left:9px;width:4px;height:4px;background:${BRASS};"></div>
    <div style="position:absolute;top:19px;left:16px;width:9%;height:1.5px;background:${MID};"></div>
    <div style="position:absolute;top:22px;left:8px;font:800 21px/1 Arial,sans-serif;letter-spacing:-1px;color:${INK};">01</div>
    <div style="position:absolute;top:10px;right:5px;width:1px;height:16px;background:${B(0.4)};"></div>
    <div style="position:absolute;top:30px;right:1px;width:3px;height:28px;background:${B(0.2)};"></div>
    <div style="position:absolute;bottom:20px;left:9px;right:15px;height:1px;background:${LINE};"></div>
    <div style="position:absolute;bottom:14px;left:9px;width:20%;height:1.5px;background:${INK};"></div>
    <div style="position:absolute;bottom:14px;left:50%;width:22%;height:1.5px;background:${INK};"></div>
    <div style="position:absolute;bottom:9px;left:9px;width:30%;height:1.2px;background:${LINE};"></div>
    <div style="position:absolute;bottom:9px;left:50%;width:34%;height:1.2px;background:${LINE};"></div>
    <div style="position:absolute;bottom:3px;left:9px;width:18%;height:1.5px;background:${INK_2};"></div>
    <div style="position:absolute;bottom:2px;right:16px;width:6px;height:6px;border-radius:50%;background:${BRASS};"></div>
    <div style="position:absolute;bottom:3px;right:6px;width:8px;height:1.5px;background:${INK_2};"></div>
    </div>`
  };
  TEMPLATES.forEach(t => {
    const el = document.getElementById('sw-' + t.id);
    if (el) el.innerHTML = defs[t.id];
  });
}
function buildPalettes() {
  const grid = document.getElementById('paletteGrid');
  const allPalettes = [...PALETTES, ...state.customPalettes];
  grid.innerHTML = allPalettes.map(p => `
    <div class="palette-swatch ${p.id === state.palette ? 'active' : ''}" data-pal="${p.id}">
      <span class="pal-check" aria-hidden="true">${CORNER_CHECK_SVG}</span>
      ${p.custom ? '<span class="pal-del" data-pal-del="' + p.id + '" title="Delete palette" aria-label="Delete palette"><i class="fa-solid fa-xmark" aria-hidden="true"></i></span>' : ''}
      <div class="palette-dot" style="background:linear-gradient(90deg, ${p.cardBar} 0 50%, ${p.cardAccent} 50% 100%);"></div>
      <span>${esc(p.name)}</span>
    </div>`).join('')
    + `<div class="palette-swatch pal-add" id="palAddTile" title="Add a custom palette">
         <span class="pal-add-icon"><i class="fa-solid fa-plus" aria-hidden="true"></i></span>
         <span>Custom</span>
       </div>`;
  grid.querySelectorAll('.palette-swatch[data-pal]').forEach(sw => {
    sw.addEventListener('click', (e) => {
      if (e.target.closest('[data-pal-del]')) return;
      state.palette = sw.dataset.pal;
      grid.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      closeCustomPaletteForm();
      render();
      paintSwatches();
    });
  });
  grid.querySelectorAll('[data-pal-del]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCustomPalette(btn.dataset.palDel);
    });
  });
  const addTile = document.getElementById('palAddTile');
  if (addTile) {
    addTile.addEventListener('click', () => toggleCustomPaletteForm());
  }
}
function deleteCustomPalette(id) {
  const wasActive = state.palette === id;
  state.customPalettes = state.customPalettes.filter(p => p.id !== id);
  persistCustomPalettes();
  if (wasActive) state.palette = PALETTES[0].id;
  buildPalettes();
  if (wasActive) render();
}
function toggleCustomPaletteForm() {
  const form = document.getElementById('customPalForm');
  const isOpen = form.style.display !== 'none';
  if (isOpen) { closeCustomPaletteForm(); return; }
  document.getElementById('cpHint').textContent = '';
  document.getElementById('cpHint').className = 'hint';
  document.getElementById('cpName').value = '';
  form.style.display = 'block';
  document.getElementById('cpName').focus();
}
function closeCustomPaletteForm() {
  const form = document.getElementById('customPalForm');
  if (form) form.style.display = 'none';
}
// ---- Logo -> palette color matching ----
// Samples the logo's pixels on an offscreen canvas and picks the two most
// prominent, reasonably saturated colors to use as a starting "Bar"/"Accent"
// pair. Background pixels (transparent, near-white, near-black, low-saturation
// gray) are excluded so a logo on a white/transparent background doesn't just
// hand back "white" as the dominant color.
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return { h, s, l };
}
function hslToRgbTriple(h, s, l) {
  h = ((h % 360) + 360) % 360;
  if (s <= 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;
  const chan = t => {
    let tc = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (tc < 1 / 6) return p + (q - p) * 6 * tc;
    if (tc < 1 / 2) return q;
    if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6;
    return p;
  };
  return {
    r: Math.round(chan(hk + 1 / 3) * 255),
    g: Math.round(chan(hk) * 255),
    b: Math.round(chan(hk - 1 / 3) * 255)
  };
}
// Nudges a sampled color into a range that still reads as a deliberate brand
// color once it's used as heading/bar text on the cream paper - a pale pixel
// pulled off a logo (a light shield-blue, a soft highlight) is a legitimate
// "prominent color" by pixel count, but is illegible as text color as-is, and
// an over-saturated or near-gray pixel looks like noise rather than a chosen
// color. This keeps the hue the logo actually has, only correcting lightness
// and saturation into a professional, legible range.
function toProfessionalHex(r, g, b) {
  const { h, s, l } = rgbToHsl(r, g, b);
  let s2 = s, l2 = l;
  if (l2 > 0.5) l2 = 0.38;
  else if (l2 < 0.22) l2 = 0.3;
  if (s2 < 0.3) s2 = 0.42;
  else if (s2 > 0.85) s2 = 0.8;
  const rgb = hslToRgbTriple(h, s2, l2);
  return '#' + [rgb.r, rgb.g, rgb.b].map(v => v.toString(16).padStart(2, '0')).join('');
}
function sampleLogoPixels(imgSrc, callback, opts) {
  const minSat = (opts && opts.minSat !== undefined) ? opts.minSat : 0.12;
  const minShareFactor = (opts && opts.minShareFactor !== undefined) ? opts.minShareFactor : 0.02;
  const img = new Image();
  img.onload = () => {
    try {
      const SIZE = 48;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
      const STEP = 24; // quantization bucket size per channel
      const buckets = new Map();
      let totalCounted = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 200) continue;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const lightness = (max + min) / 2;
        if (lightness > 240 || lightness < 15) continue;
        const sat = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
        if (sat < minSat) continue; // near-gray background/shading, not a brand color
        const key = [Math.round(r / STEP), Math.round(g / STEP), Math.round(b / STEP)].join(',');
        const entry = buckets.get(key) || { r: 0, g: 0, b: 0, count: 0, weight: 0 };
        entry.r += r; entry.g += g; entry.b += b; entry.count++;
        entry.weight += 1 + sat * 3; // more saturated pixels count for more
        buckets.set(key, entry);
        totalCounted++;
      }
      // Drop clusters that are too small a share of the logo to be a real brand
      // color - a handful of anti-aliased edge pixels can otherwise outrank the
      // logo's actual second color just for being unusually saturated.
      const minShare = Math.max(3, totalCounted * minShareFactor);
      const clusters = Array.from(buckets.values())
        .filter(e => e.count >= minShare)
        .map(e => ({ r: Math.round(e.r / e.count), g: Math.round(e.g / e.count), b: Math.round(e.b / e.count), weight: e.weight }))
        .sort((a, b) => b.weight - a.weight);
      if (!clusters.length) { callback(null); return; }
      const dist = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
      const primary = clusters[0];
      const primaryHue = rgbToHsl(primary.r, primary.g, primary.b).h;
      // Prefer a genuinely different second color over just "the next bucket":
      // a flat one-color logo otherwise hands back the same hex twice, which
      // looks like the tool did nothing. Require it to actually be a different
      // hue family too, not just a lighter/darker sample of the same color.
      const distinctAccent = clusters.find(c => {
        if (dist(c, primary) <= 60) return false;
        const hueDelta = Math.abs(rgbToHsl(c.r, c.g, c.b).h - primaryHue);
        return Math.min(hueDelta, 360 - hueDelta) > 20;
      });
      const accentHex = distinctAccent
        ? toProfessionalHex(distinctAccent.r, distinctAccent.g, distinctAccent.b)
        // Falling short of a clean second cluster, derive a visibly distinct
        // accent by rotating the hue rather than just shading toward black/white,
        // so the pair reads as a designed two-tone instead of one flat color.
        : (() => {
          const rgb = hslToRgbTriple(primaryHue + 35, 0.55, 0.34);
          return '#' + [rgb.r, rgb.g, rgb.b].map(v => v.toString(16).padStart(2, '0')).join('');
        })();
      callback({ primaryHex: toProfessionalHex(primary.r, primary.g, primary.b), accentHex });
    } catch (err) {
      // Canvas security error - the image ended up "tainted" (cross-origin,
      // or a browser treating a local file:// path as its own origin) so
      // pixel data can't be read back out.
      callback(null, err);
    }
  };
  img.onerror = () => callback(null, new Error('load-failed'));
  img.src = imgSrc;
}
function extractLogoColors(src, callback, opts) {
  // Data URLs (uploaded logos) are same-document already and never taint a
  // canvas, so sample them directly.
  if (/^data:/.test(src)) { sampleLogoPixels(src, callback, opts); return; }
  // Everything else (directory logo paths like "img/xyz.png") is fetched and
  // re-encoded as a data URL first. A canvas painted from a data URL is never
  // considered cross-origin, so this sidesteps tainting that can otherwise
  // happen depending on how/where the page is being served from - the exact
  // case the try/catch above exists to catch.
  fetch(src)
    .then(res => { if (!res.ok) throw new Error('fetch-failed'); return res.blob(); })
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('read-failed'));
      reader.readAsDataURL(blob);
    }))
    .then(dataUrl => sampleLogoPixels(dataUrl, callback, opts))
    .catch(() => sampleLogoPixels(src, callback, opts)); // last resort: try the original path directly
}
function applyExtractedPaletteToForm(colors) {
  const primary = colors.primaryHex;
  const accent = colors.accentHex;
  document.getElementById('cpBar').value = primary;
  document.getElementById('cpAccent').value = accent;
  document.getElementById('cpTint').value = shadeHex(primary, 92);
  document.getElementById('cpTintRow').value = shadeHex(primary, 55);
  document.getElementById('cpEmbPrimary').value = primary;
  document.getElementById('cpEmbSecondary').value = shadeHex(accent, 25);
}
// The button exists in two places in the sidebar - Institution & Logo (next to
// where the logo itself is set) and Color Palette (since a logo is often
// already set by the time someone opens that accordion, and they'd otherwise
// never see the feature). Both trigger the exact same flow; only the button
// actually clicked shows its own "reading colors…" status.
const LOGO_PALETTE_MATCH_TRIGGERS = [
  { btnId: 'matchLogoPaletteBtn', hintId: 'logoMatchHint' },
  { btnId: 'matchLogoPaletteBtnPalette', hintId: 'logoMatchHintPalette' }
];
function runLogoPaletteMatch(activeBtn, activeHint) {
  if (!state.logoDataUrl) return;
  const allBtns = LOGO_PALETTE_MATCH_TRIGGERS
    .map(t => document.getElementById(t.btnId))
    .filter(Boolean);
  allBtns.forEach(b => { b.disabled = true; });
  if (activeHint) { activeHint.textContent = 'Reading colors from your logo…'; activeHint.className = 'hint'; }
  extractLogoColors(state.logoDataUrl, (colors) => {
    allBtns.forEach(b => { b.disabled = !state.logoDataUrl; });
    if (!colors) {
      if (activeHint) { activeHint.textContent = 'Couldn\u2019t pick colors out of that logo \u2014 try a different image, or set colors manually below.'; activeHint.className = 'hint warn'; }
      return;
    }
    if (activeHint) activeHint.textContent = '';
    applyExtractedPaletteToForm(colors);
    const palGroup = document.getElementById('customPalForm').closest('.group');
    if (palGroup) openAccordionGroup(palGroup);
    const form = document.getElementById('customPalForm');
    if (form.style.display === 'none') toggleCustomPaletteForm();
    document.getElementById('cpName').value = 'Logo Match';
    const cpHint = document.getElementById('cpHint');
    if (cpHint) { cpHint.textContent = 'Colors pulled from your logo \u2014 tweak anything below, then Save palette.'; cpHint.className = 'hint ok'; }
    if (palGroup) palGroup.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
function setupLogoPaletteMatch() {
  LOGO_PALETTE_MATCH_TRIGGERS.forEach(({ btnId, hintId }) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const hint = document.getElementById(hintId);
    btn.addEventListener('click', () => runLogoPaletteMatch(btn, hint));
  });
  setupAutoPaletteMatchToggle();
}
// Builds the same palette shape the manual "Save palette" button would, from
// extracted logo colors.
function buildPaletteFromColors(colors, name, id) {
  const primary = colors.primaryHex;
  const accent = colors.accentHex;
  return {
    id, name, custom: true,
    cardBar: primary,
    cardAccent: accent,
    cardTint: shadeHex(primary, 92),
    cardTintRow: shadeHex(primary, 55),
    embPrimary: primary,
    embSecondary: shadeHex(accent, 25)
  };
}
// Fixed id for the auto-matched palette: re-used (not re-created) every time
// the logo changes, so switching logos doesn't pile up a fresh "Logo Match"
// entry in the palette list on every edit.
const AUTO_MATCH_PALETTE_ID = 'auto-logo-match';
// Unlike the manual "Match Palette to Logo" button (which only pre-fills the
// custom-palette form so the person can tweak and explicitly save it), the
// automatic version has no one there to click "Save" — so it builds the
// palette from the extracted colors and applies it directly. Logos that are
// mostly white/gray (a building icon, a monochrome crest) can come back with
// nothing usable on the first, stricter pass, so a second, more lenient pass
// is tried before giving up — auto-match has no form for someone to tweak
// afterwards, so it's better to land on an imperfect palette than none.
function autoApplyLogoPalette() {
  if (!state.autoPaletteMatch || !state.logoDataUrl) return;
  const hint = document.getElementById('logoMatchHint');
  const logoAtStart = state.logoDataUrl;
  if (hint) { hint.textContent = 'Auto-matching palette to your logo…'; hint.className = 'hint'; }
  const applyColors = (colors) => {
    const pal = buildPaletteFromColors(colors, 'Logo Match', AUTO_MATCH_PALETTE_ID);
    const idx = state.customPalettes.findIndex(p => p.id === AUTO_MATCH_PALETTE_ID);
    if (idx >= 0) state.customPalettes[idx] = pal; else state.customPalettes.push(pal);
    persistCustomPalettes();
    state.palette = AUTO_MATCH_PALETTE_ID;
    buildPalettes();
    render();
    if (hint) { hint.textContent = 'Palette auto-matched to your logo.'; hint.className = 'hint ok'; }
  };
  extractLogoColors(state.logoDataUrl, (colors) => {
    if (!state.autoPaletteMatch || state.logoDataUrl !== logoAtStart) return;
    if (colors) { applyColors(colors); return; }
    // Relaxed retry: allow near-gray pixels through, and accept a smaller
    // cluster as "real", for logos too muted to clear the default bar.
    extractLogoColors(logoAtStart, (looseColors) => {
      if (!state.autoPaletteMatch || state.logoDataUrl !== logoAtStart) return;
      if (looseColors) { applyColors(looseColors); return; }
      if (hint) { hint.textContent = 'Auto-match couldn\u2019t pick colors out of this logo \u2014 try a different image, or set colors with Match Palette to Logo below.'; hint.className = 'hint warn'; }
    }, { minSat: 0.04, minShareFactor: 0.008 });
  });
}
// Whenever a logo becomes available (uploaded, picked from the directory, an
// auto-matched-by-university-name pick, or one restored from a previous
// visit) and this preference is on, apply a palette matched to it right
// away instead of waiting for a click.
function maybeAutoMatchPalette() {
  autoApplyLogoPalette();
}
function setupAutoPaletteMatchToggle() {
  const check = document.getElementById('autoPaletteMatchCheck');
  if (!check) return;
  check.checked = !!state.autoPaletteMatch;
  check.addEventListener('change', () => {
    state.autoPaletteMatch = check.checked;
    if (typeof persistState === 'function') persistState();
    maybeAutoMatchPalette();
  });
}
function setupCustomPaletteForm() {
  document.getElementById('cpCancelBtn').addEventListener('click', closeCustomPaletteForm);
  document.getElementById('cpSaveBtn').addEventListener('click', () => {
    const hint = document.getElementById('cpHint');
    const nameInput = document.getElementById('cpName');
    let name = nameInput.value.trim();
    if (!name) name = `Custom ${state.customPalettes.length + 1}`;
    const pal = {
      id: `custom-${Date.now().toString(36)}`,
      name,
      custom: true,
      cardBar: document.getElementById('cpBar').value,
      cardAccent: document.getElementById('cpAccent').value,
      cardTint: document.getElementById('cpTint').value,
      cardTintRow: document.getElementById('cpTintRow').value,
      embPrimary: document.getElementById('cpEmbPrimary').value,
      embSecondary: document.getElementById('cpEmbSecondary').value
    };
    state.customPalettes.push(pal);
    persistCustomPalettes();
    state.palette = pal.id;
    buildPalettes();
    closeCustomPaletteForm();
    render();
    hint.textContent = `Saved “${name}” — it’ll stay in this browser for next time.`;
    hint.className = 'hint ok';
  });
}
const LOGO_DIRECTORY = {
  'diu-cse': { label: 'Dhaka Int. University - Department of CSE', path: 'img/DIU_CSE_logo.png' },
  'diu-right': { label: 'Dhaka Int. University', path: 'img/DIU_logo_right.png' },
  'diu-center': { label: 'Dhaka Int. University', path: 'img/DIU_logo_center.png' },
  'diu-tagline': { label: 'DIU', path: 'img/DIU_logo_withTagline.png' },
  'nsu-logo': { label: 'North South University', path: 'img/nsu.png' },
  'city': { label: 'City University', path: 'img/city.png' },
  'bangladesh': { label: 'Bangladesh University', path: 'img/bd.png' },
  'canadian': { label: 'Canadian University of Bangladesh', path: 'img/cub.png' },
  'brac': { label: 'BRAC University', path: 'img/brac.png' },
  'uiu': { label: 'United International University', path: 'img/uiu.png' },
  'du-logo': { label: 'Dhaka University', path: 'img/du.png' },
  'daffodilv1': { label: 'Daffodil International University', path: 'img/daffodilv1.png' },
  'daffodilv2': { label: 'Daffodil International University', path: 'img/daffodilv2.png' },
  'daffodilv0': { label: 'Daffodil International University', path: 'img/daffodilv0.png' },
  'seu': { label: 'Southeast University', path: 'img/seu.png' },
  'uoda': { label: 'University of Development Alternative', path: 'img/uoda.png' },
  'nub': { label: 'Northern University of Bangladesh', path: 'img/nubv1.png' },
  'ewu': { label: 'East West University', path: 'img/ewu.png' },
  'sipi': { label: 'Shyamoli Ideal Polytechnic Institute', path: 'img/sipi.png' },
  'bubt': { label: 'Bangladesh University of Business and Technology', path: 'img/bubt.png' },
  'titumir': { label: 'Government Titumir College', path: 'img/titumir.png' },
  'gub': { label: 'Green University of Bangladesh', path: 'img/gub.png' },
  'uu': { label: 'Uttara University', path: 'img/uu.png' },
};
function normalizeUniversityName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s*[-–]\s*(v0|v1|v2|cse)\s*$/i, '')
    .replace(/international/g, 'int')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildLogoMatchIndex() {
  const select = document.getElementById('logoDirectorySelect');
  const groups = {};
  if (!select) return groups;
  Array.from(select.options).forEach(opt => {
    if (!opt.value) return; // skip the "-- Select a logo --" placeholder
    const norm = normalizeUniversityName(opt.textContent);
    (groups[norm] = groups[norm] || []).push({ key: opt.value, label: opt.textContent });
  });
  return groups;
}
function pickBestLogoKey(matches) {
  // Prefer the department (CSE) logo when the department is CSE.
  const dept = (state.department || state.deptTitle || '').toLowerCase();
  if (/\bcse\b/.test(dept)) {
    const cse = matches.find(m => /-\s*cse\s*$/i.test(m.label));
    if (cse) return cse.key;
  }
  const v0 = matches.find(m => /-\s*v0\s*$/i.test(m.label));
  return (v0 || matches[0]).key;
}

function findLogoKeyForUniversity(universityName, logoIndex) {
  const norm = normalizeUniversityName(universityName);
  const matches = (logoIndex || buildLogoMatchIndex())[norm];
  return matches && matches.length ? pickBestLogoKey(matches) : null;
}
let autoMatchUniversityLogo = () => false;
let restoreSavedLogo = () => false;

function setupLogo() {
  const input = document.getElementById('logoInput');
  const drop = document.getElementById('logoDrop');
  const wrap = document.getElementById('logoPreviewWrap');
  const dirSelect = document.getElementById('logoDirectorySelect');
  const uploadBtn = document.getElementById('logoBtn');
  const matchBtn = document.getElementById('matchLogoPaletteBtn');
  // Same feature, second entry point: a copy of the button lives in the Color
  // Palette group too, since a logo is often already set (default/auto-matched)
  // by the time someone opens that accordion, and they'd otherwise have no way
  // to know this exists without first stumbling into Institution & Logo.
  const matchBtnPalette = document.getElementById('matchLogoPaletteBtnPalette');
  function setLockState(source) {
    state.logoSource = source;
    const uploadLocked = source === 'directory';
    const directoryLocked = source === 'upload';
    uploadBtn.disabled = uploadLocked;
    drop.classList.toggle('is-disabled', uploadLocked);
    dirSelect.disabled = directoryLocked;
    // Every logo state change (upload, directory pick, restore, clear) already
    // routes through here with state.logoDataUrl already up to date, so this
    // is the one place that needs to keep both "Match Palette to Logo" buttons
    // in sync rather than re-checking it at every call site above.
    if (matchBtn) matchBtn.disabled = !state.logoDataUrl;
    if (matchBtnPalette) matchBtnPalette.disabled = !state.logoDataUrl;
    maybeAutoMatchPalette();
  }
  function applyDirectoryLogo(key, opts) {
    const auto = !!(opts && opts.auto);
    const entry = LOGO_DIRECTORY[key];
    if (!entry) return false;
    dirSelect.value = key;
    state.logoDataUrl = entry.path;
    wrap.innerHTML = `<img src="${entry.path}" alt="${entry.label} logo" onerror="this.parentElement.textContent='Could not load ${entry.label} logo — check that ${entry.path} exists.';">`;
    setLockState('directory');
    state.logoAutoMatched = auto;
    return true;
  }
  uploadBtn.addEventListener('click', () => { if (!uploadBtn.disabled) input.click(); });
  drop.addEventListener('click', () => { if (!uploadBtn.disabled) input.click(); });
  document.getElementById('logoClear').addEventListener('click', (e) => {
    e.stopPropagation();
    state.logoDataUrl = "";
    state.logoAutoMatched = false;
    wrap.innerHTML = "No logo uploaded — that space will stay blank.";
    dirSelect.value = "";
    input.value = "";
    setLockState("");
    render();
  });
  const LOGO_MAX_BYTES = 8 * 1024 * 1024;
  const LOGO_MAX_DIM = 600;
  function useUploadedLogo(dataUrl) {
    state.logoDataUrl = dataUrl;
    state.logoAutoMatched = false;
    wrap.innerHTML = `<img src="${dataUrl}" alt="Uploaded logo preview">`;
    setLockState('upload');
    render();
  }
  function logoError(msg) {
    wrap.textContent = msg;
    input.value = '';
  }
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) { logoError('That file isn\u2019t an image \u2014 choose a PNG, JPG, SVG or WebP.'); return; }
    if (file.size > LOGO_MAX_BYTES) { logoError('That image is over 8 MB \u2014 choose a smaller logo.'); return; }
    const reader = new FileReader();
    reader.onerror = () => logoError('Could not read that file \u2014 try another image.');
    reader.onload = () => {
      const dataUrl = reader.result;
      // SVG stays as-is (already small and resolution-independent).
      if (file.type === 'image/svg+xml') { useUploadedLogo(dataUrl); return; }
      // Raster logos are downscaled: the data URL gets re-inlined into the page
      // on every keystroke and every pagination probe, so size matters.
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, LOGO_MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
        if (scale >= 1 && file.size < 400 * 1024) { useUploadedLogo(dataUrl); return; }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const keepAlpha = /png|webp|gif/.test(file.type);
        useUploadedLogo(keepAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => logoError('Could not open that image \u2014 try a different file.');
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
  dirSelect.addEventListener('change', () => {
    const key = dirSelect.value;
    if (!key) {
      return;
    }
    if (!applyDirectoryLogo(key, { auto: false })) return;
    render();
  });

  restoreSavedLogo = function (source, dataUrl, auto) {
    if (source === 'directory') {
      const key = Object.keys(LOGO_DIRECTORY).find(k => LOGO_DIRECTORY[k].path === dataUrl);
      return key ? applyDirectoryLogo(key, { auto: !!auto }) : false;
    }
    if (source === 'upload' && /^data:image\//.test(dataUrl)) {
      state.logoDataUrl = dataUrl;
      state.logoAutoMatched = false;
      wrap.innerHTML = `<img src="${dataUrl}" alt="Uploaded logo preview">`;
      setLockState('upload');
      return true;
    }
    return false;
  };

  autoMatchUniversityLogo = function (universityName) {
    // An uploaded file is a deliberate, custom asset - never swap it out.
    if (state.logoSource === 'upload') return false;
    // A logo the person picked by hand from the directory dropdown is deliberate
    // too: it must not be wiped just because the University Name field holds
    // something the directory doesn't list (or is still empty), and a chosen
    // variant (V1/V2/CSE...) must not be flipped back to the default variant of
    // the same university. It only yields when the typed name clearly matches a
    // DIFFERENT university in the directory (handled below).
    const manualDirectoryPick = state.logoSource === 'directory' && !state.logoAutoMatched;
    if (manualDirectoryPick) {
      const picked = dirSelect.selectedOptions && dirSelect.selectedOptions[0];
      const pickedNorm = picked && picked.value ? normalizeUniversityName(picked.textContent) : '';
      const typedNorm = normalizeUniversityName(universityName);
      if (!typedNorm || pickedNorm === typedNorm) return false;
    }
    const key = findLogoKeyForUniversity(universityName);
    if (!key) {
      // No directory match for the typed name. Only an AUTO-matched logo is a
      // stand-in for the typed university and should clear when that name stops
      // matching; a manual pick is kept (returned above for the non-empty case).
      if (state.logoDataUrl && state.logoSource === 'directory' && state.logoAutoMatched) {
        state.logoDataUrl = "";
        state.logoAutoMatched = false;
        wrap.innerHTML = "No logo uploaded — that space will stay blank.";
        dirSelect.value = "";
        setLockState("");
        render();
        return true;
      }
      return false;
    }
    if (dirSelect.value === key) return false;
    if (!applyDirectoryLogo(key, { auto: true })) return false;
    render();
    return true;
  };

  // Rather than listening for input/change/blur on the University Name
  // field — which misses any pathway that sets state.universityName
  // programmatically without firing a real DOM event (autocomplete
  // suggestion clicks, "Load sample", a saved student lookup, etc.) —
  // watch the state property itself. Every one of those pathways still has
  // to assign state.universityName somewhere, so this catches all of them
  // uniformly instead of chasing each entry point individually.
  if (!Object.getOwnPropertyDescriptor(state, '__universityNameWatched')) {
    let currentUniversityName = state.universityName;
    Object.defineProperty(state, 'universityName', {
      configurable: true,
      enumerable: true,
      get() { return currentUniversityName; },
      set(value) {
        currentUniversityName = value;
        autoMatchUniversityLogo(value);
      }
    });
    Object.defineProperty(state, '__universityNameWatched', {
      value: true, enumerable: false
    });
  }

  setLockState("");
}
const INFO_TAB_META = {
  about: { icon: 'fa-hat-wizard', title: 'About Cover Genie', sub: 'Modern academic cover & index builder' },
  privacy: { icon: 'fa-shield-halved', title: 'Privacy Policy', sub: 'What Cover Genie does (and doesn\u2019t) with your data' },
  contact: { icon: 'fa-envelope', title: 'Contact', sub: 'Bugs, ideas, and thank- you are always welcome' }
};
function openInfoModal(tab) {
  const modal = document.getElementById('infoModal');
  if (!modal) return;
  showInfoTab(tab || 'about');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}
function closeInfoModal() {
  const modal = document.getElementById('infoModal');
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}
function showInfoTab(tab) {
  document.querySelectorAll('.info-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  document.querySelectorAll('.info-panel').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === tab));
  const meta = INFO_TAB_META[tab] || INFO_TAB_META.about;
  const icon = document.getElementById('infoHeadIcon');
  const title = document.getElementById('infoModalTitle');
  const sub = document.getElementById('infoHeadSub');
  if (icon) icon.innerHTML = `<img src="img/fav.svg" alt="Cover Genie" style="width:22px;height:22px;">`;
  if (title) title.textContent = meta.title;
  if (sub) sub.textContent = meta.sub;
  const body = document.getElementById('infoBody');
  if (body) body.scrollTop = 0;
}
function setupLegalModal() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  document.querySelectorAll('.footer-link[data-info]').forEach(btn => {
    btn.addEventListener('click', () => openInfoModal(btn.dataset.info));
  });
  document.querySelectorAll('.info-tab[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => showInfoTab(btn.dataset.tab));
  });
  document.querySelectorAll('.info-tablink[data-goto]').forEach(link => {
    link.addEventListener('click', () => showInfoTab(link.dataset.goto));
  });
  const closeBtn = document.getElementById('infoClose');
  const backdrop = document.getElementById('infoBackdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeInfoModal);
  if (backdrop) backdrop.addEventListener('click', closeInfoModal);
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('infoModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) closeInfoModal();
  });
  setupContactForm();
}
function setupContactForm() {
  const sendBtn = document.getElementById('contactSendBtn');
  if (!sendBtn) return;
  const nameInput = document.getElementById('contactNameInput');
  const emailInput = document.getElementById('contactEmailInput');
  const msgInput = document.getElementById('contactMessageInput');
  const hint = document.getElementById('contactSendHint');
  sendBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();
    if (!message) {
      hint.textContent = 'Add a quick message before sending.';
      hint.className = 'hint warn';
      msgInput.focus();
      return;
    }
    const subject = `Cover Genie — message from ${name || 'a visitor'}`;
    const bodyLines = [message, '', `— ${name || 'Anonymous'}${email ? ' (' + email + ')' : ''}`];
    const mailto = `mailto:dev.kasfiya.upoma@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    const a = document.createElement('a');
    a.href = mailto;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    hint.textContent = 'Opening your email app…';
    hint.className = 'hint ok';
    setTimeout(() => {
      closeInfoModal();
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  });
}
function setupSidebarAccordion() {
  const groups = Array.from(document.querySelectorAll('#sidebar > .group'));
  if (!groups.length) return;
  groups.forEach((group, i) => {
    if (group.querySelector(':scope > .group-body')) return;
    const title = group.querySelector(':scope > .group-title');
    if (!title) return;
    const body = document.createElement('div');
    body.className = 'group-body';
    body.id = `groupBody${i}`;
    Array.from(group.children).forEach(el => { if (el !== title) body.appendChild(el); });
    group.appendChild(body);
    const chevronWrap = document.createElement('span');
    chevronWrap.className = 'group-chevron-wrap';
    const chevron = document.createElement('i');
    chevron.className = 'fa-solid fa-chevron-down group-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevronWrap.appendChild(chevron);
    title.appendChild(chevronWrap);
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-controls', body.id);
    title.setAttribute('aria-expanded', 'false');
    title.addEventListener('click', () => toggleAccordionGroup(group));
    title.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordionGroup(group);
      }
    });
  });
  groups.filter(isPinnedAccordionGroup).forEach(g => openAccordionGroup(g));
}
function isPinnedAccordionGroup(group) {
  return group.dataset.accordionPinned === 'true';
}
function openAccordionGroup(group) {
  if (!isPinnedAccordionGroup(group)) {
    document.querySelectorAll('#sidebar > .group.open').forEach(g => {
      if (g !== group && !isPinnedAccordionGroup(g)) closeAccordionGroup(g);
    });
  }
  const wasAlreadyOpen = group.classList.contains('open');
  group.classList.add('open');
  const title = group.querySelector(':scope > .group-title');
  const body = group.querySelector(':scope > .group-body');
  if (title) title.setAttribute('aria-expanded', 'true');
  if (!body) return;
  clearMaxHeightHandler(body);
  // Re-opening a group that's already fully open - e.g. calling this again
  // right as new content (like the custom palette form) is about to be
  // revealed inside it - has nothing to actually animate: max-height can't
  // transition from "none", so the browser never fires transitionend and the
  // group gets stuck pinned at whatever (smaller, stale) height it measured
  // just now, clipping everything revealed afterward. Skip straight to
  // "auto" instead so the body always sizes to whatever it actually contains.
  if (wasAlreadyOpen && body.style.maxHeight === 'none') {
    body.style.overflow = 'visible';
    return;
  }
  body.style.overflow = 'hidden';
  body.style.maxHeight = body.scrollHeight + 'px';
  const onEnd = (e) => {
    if (e.target !== body || e.propertyName !== 'max-height') return;
    body.style.maxHeight = 'none';
    body.style.overflow = 'visible';
    body.removeEventListener('transitionend', onEnd);
    body._mhHandler = null;
  };
  body._mhHandler = onEnd;
  body.addEventListener('transitionend', onEnd);
}
function closeAccordionGroup(group) {
  const title = group.querySelector(':scope > .group-title');
  const body = group.querySelector(':scope > .group-body');
  if (body) {
    clearMaxHeightHandler(body);
    body.style.maxHeight = body.scrollHeight + 'px';
    body.style.overflow = 'hidden';
    void body.offsetHeight;
  }
  group.classList.remove('open');
  if (title) title.setAttribute('aria-expanded', 'false');
  if (body) {
    requestAnimationFrame(() => { body.style.maxHeight = '0px'; });
  }
}
function clearMaxHeightHandler(body) {
  if (body._mhHandler) {
    body.removeEventListener('transitionend', body._mhHandler);
    body._mhHandler = null;
  }
}
function toggleAccordionGroup(group) {
  if (group.classList.contains('open')) { closeAccordionGroup(group); return; }
  openAccordionGroup(group);
}