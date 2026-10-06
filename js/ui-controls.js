function enhanceSelect(selectEl) {
  if (!selectEl || selectEl.dataset.cselReady) return;
  selectEl.dataset.cselReady = '1';
  selectEl.classList.add('csel-native');
  const wrap = document.createElement('div');
  wrap.className = 'csel';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'csel-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = '<span class="csel-value"></span><i class="fa-solid fa-chevron-down csel-chevron" aria-hidden="true"></i>';
  const panel = document.createElement('div');
  panel.className = 'csel-panel';
  panel.setAttribute('role', 'listbox');
  panel.tabIndex = -1;
  let optionEls = Array.from(selectEl.options).map(opt => {
    const el = document.createElement('div');
    el.className = 'csel-option';
    el.setAttribute('role', 'option');
    el.dataset.value = opt.value;
    el.innerHTML = `<span>${opt.textContent}</span><i class="fa-solid fa-check csel-check" aria-hidden="true"></i>`;
    el.addEventListener('click', () => { selectOption(el.dataset.value); close(); });
    panel.appendChild(el);
    return el;
  });
  wrap.appendChild(trigger);
  wrap.appendChild(panel);
  selectEl.insertAdjacentElement('afterend', wrap);
  const valueEl = trigger.querySelector('.csel-value');
  const proto = Object.getPrototypeOf(selectEl);
  const nativeValueDesc = Object.getOwnPropertyDescriptor(proto, 'value') || Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  const nativeDisabledDesc = Object.getOwnPropertyDescriptor(proto, 'disabled') || Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'disabled');
  function refresh() {
    const current = Array.from(selectEl.options).find(o => o.value === selectEl.value) || selectEl.options[0];
    valueEl.textContent = current ? current.textContent : '';
    valueEl.classList.toggle('is-placeholder', !!current && current.value === '');
    optionEls.forEach(el => el.classList.toggle('active', el.dataset.value === selectEl.value));
    const isDisabled = !!selectEl.disabled;
    wrap.classList.toggle('is-disabled', isDisabled);
    trigger.disabled = isDisabled;
    if (isDisabled) close();
  }
  function open() {
    if (selectEl.disabled) return;
    wrap.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('keydown', onKey, true);
  }
  function close() {
    wrap.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('keydown', onKey, true);
  }
  function onOutside(e) { if (!wrap.contains(e.target)) close(); }
  function onKey(e) {
    if (e.key === 'Escape') { close(); trigger.focus(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = optionEls.findIndex(el => el.dataset.value === selectEl.value);
      const dir = e.key === 'ArrowDown' ? 1 : -1;
      const next = optionEls[(idx + dir + optionEls.length) % optionEls.length];
      if (next) selectOption(next.dataset.value);
    }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); trigger.focus(); }
  }
  function selectOption(value) {
    if (value === selectEl.value) { return; }
    nativeValueDesc.set.call(selectEl, value);
    refresh();
    selectEl.dispatchEvent(new Event('change', { bubbles: true }));
  }
  trigger.addEventListener('click', () => {
    if (wrap.classList.contains('open')) close(); else open();
  });
  Object.defineProperty(selectEl, 'value', {
    get() { return nativeValueDesc.get.call(selectEl); },
    set(v) { nativeValueDesc.set.call(selectEl, v); refresh(); },
    configurable: true
  });
  Object.defineProperty(selectEl, 'disabled', {
    get() { return nativeDisabledDesc.get.call(selectEl); },
    set(v) { nativeDisabledDesc.set.call(selectEl, v); refresh(); },
    configurable: true
  });
  // Lets callers relabel the real <option>s (e.g. for a language switch) and
  // have the custom dropdown's trigger + open panel pick up the new text
  // without rebuilding the whole widget.
  selectEl.__cselSyncLabels = function () {
    Array.from(selectEl.options).forEach((opt, i) => {
      const span = optionEls[i] && optionEls[i].querySelector('span');
      if (span) span.textContent = opt.textContent;
    });
    refresh();
  };
  // Swaps in a whole new option set (e.g. Latin fonts <-> Bangla fonts on a
  // language switch), rebuilding both the real <select> and the custom
  // panel. `options` is [{ value, label }]; the previous value is kept if it
  // still exists in the new set, otherwise the first option is selected.
  selectEl.__cselSetOptions = function (options) {
    const keepValue = options.some(o => o.value === selectEl.value) ? selectEl.value : (options[0] && options[0].value);
    selectEl.innerHTML = '';
    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      selectEl.appendChild(opt);
    });
    panel.innerHTML = '';
    optionEls = Array.from(selectEl.options).map(opt => {
      const el = document.createElement('div');
      el.className = 'csel-option';
      el.setAttribute('role', 'option');
      el.dataset.value = opt.value;
      el.innerHTML = `<span>${opt.textContent}</span><i class="fa-solid fa-check csel-check" aria-hidden="true"></i>`;
      el.addEventListener('click', () => { selectOption(el.dataset.value); close(); });
      panel.appendChild(el);
      return el;
    });
    if (keepValue !== undefined) nativeValueDesc.set.call(selectEl, keepValue);
    refresh();
  };
  refresh();
}
function setupCustomSelects() {
  enhanceSelect(document.getElementById('docTypeSelect'));
  enhanceSelect(document.getElementById('logoDirectorySelect'));
  enhanceSelect(document.getElementById('fontSelect'));
}
// The "Cover font" dropdown lists Latin fonts (FONTS) normally, but swaps to
// the Bangla font list (BANGLA_FONTS) whenever state.language is 'bn', since
// none of the Latin fonts carry Bengali glyphs. Called on init and again on
// every language toggle.
function syncFontSelectForLanguage() {
  const sel = document.getElementById('fontSelect');
  if (!sel) return;
  const isBn = state.language === 'bn';
  const list = isBn ? BANGLA_FONTS : FONTS;
  const options = list.map(f => ({ value: f.id, label: f.label }));
  if (typeof sel.__cselSetOptions === 'function') {
    sel.__cselSetOptions(options);
  } else {
    sel.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  }
  sel.value = isBn ? state.banglaFont : state.paperFont;
}
function setupFontSelect() {
  const sel = document.getElementById('fontSelect');
  if (!sel) return;
  syncFontSelectForLanguage();
  sel.addEventListener('change', () => {
    if (state.language === 'bn') state.banglaFont = sel.value;
    else state.paperFont = sel.value;
    loadPaperFont(state.language === 'bn' ? getBanglaFont() : getFont());
    // Full render (not just applyPaperFont): re-applies the font variable and
    // re-paginates the index page, which is measured with the chosen font.
    render();
    if (typeof persistState === 'function') persistState();
  });
}
function enhanceDateInput(inputEl, opts = {}) {
  if (!inputEl || inputEl.dataset.cdateReady) return;
  inputEl.dataset.cdateReady = '1';
  inputEl.classList.add('cdate-native');
  const pad = n => String(n).padStart(2, '0');
  const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const parseISO = s => {
    if (!s) return null;
    const dt = new Date(s + 'T00:00:00');
    return isNaN(dt) ? null : dt;
  };
  const todayDate = new Date();
  const todayISO = toISO(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const isBn = () => typeof state !== 'undefined' && state.language === 'bn';
  const EN_WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthName = m => isBn() ? BN_MONTHS[m] : EN_MONTHS[m];
  const numFmt = n => isBn() ? toBnDigits(n) : String(n);
  const weekdays = () => isBn() ? BN_WEEKDAYS : EN_WEEKDAYS;
  const todayLabel = () => isBn() ? 'আজ' : 'Today';
  const placeholderText = () => isBn() ? 'দিন মাস বছর' : (opts.placeholder || '');
  const wrap = document.createElement('div');
  wrap.className = 'cdate';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'cdate-trigger';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = '<span class="cdate-value"></span><i class="fa-solid fa-calendar-days cdate-cal-icon" aria-hidden="true"></i>';
  const panel = document.createElement('div');
  panel.className = 'cdate-panel';
  panel.setAttribute('role', 'dialog');
  panel.innerHTML = `
    <div class="cdate-head">
      <div class="cdate-nav"><button type="button" class="cdate-prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button></div>
      <div class="cdate-my"></div>
      <div class="cdate-nav"><button type="button" class="cdate-next" aria-label="Next month"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></div>
    </div>
    <div class="cdate-weekdays">${weekdays().map(w => `<span>${w}</span>`).join('')}</div>
    <div class="cdate-grid"></div>
    <div class="cdate-foot"><button type="button" class="cdate-today-btn">${todayLabel()}</button></div>
  `;
  wrap.appendChild(trigger);
  wrap.appendChild(panel);
  inputEl.insertAdjacentElement('afterend', wrap);
  const valueEl = trigger.querySelector('.cdate-value');
  const myEl = panel.querySelector('.cdate-my');
  const gridEl = panel.querySelector('.cdate-grid');
  const proto = Object.getPrototypeOf(inputEl);
  const nativeValueDesc = Object.getOwnPropertyDescriptor(proto, 'value') || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  let viewYear, viewMonth;
  function setView(d) { viewYear = d.getFullYear(); viewMonth = d.getMonth(); }
  setView(parseISO(inputEl.value) || todayDate);
  function renderGrid() {
    myEl.textContent = `${monthName(viewMonth)} ${numFmt(viewYear)}`;
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(viewYear, viewMonth, 1 - startOffset);
    const selectedISO = inputEl.value || '';
    let html = '';
    for (let i = 0; i < 42; i++) {
      const cell = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const iso = toISO(cell.getFullYear(), cell.getMonth(), cell.getDate());
      const muted = cell.getMonth() !== viewMonth;
      const isToday = iso === todayISO;
      const isSelected = iso === selectedISO;
      const afterMax = opts.maxDate && iso > opts.maxDate;
      const beforeMin = opts.getMinDate && iso < opts.getMinDate();
      const isDisabled = afterMax || beforeMin;
      html += `<button type="button" class="cdate-day${muted ? ' is-muted' : ''}${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}${isDisabled ? ' is-disabled' : ''}" data-iso="${iso}"${isDisabled ? ' disabled' : ''}>${numFmt(cell.getDate())}</button>`;
    }
    gridEl.innerHTML = html;
    gridEl.querySelectorAll('.cdate-day').forEach(btn => {
      btn.addEventListener('click', () => { selectDate(btn.dataset.iso); });
    });
  }
  function refresh() {
    const dt = parseISO(inputEl.value);
    valueEl.textContent = dt ? fmtDate(inputEl.value) : placeholderText();
    // Re-label the static parts of the calendar for the current language.
    panel.querySelectorAll('.cdate-weekdays span').forEach((s, i) => { s.textContent = weekdays()[i]; });
    panel.querySelector('.cdate-today-btn').textContent = todayLabel();
    if (wrap.classList.contains('open')) renderGrid(); else myEl.textContent = `${monthName(viewMonth)} ${numFmt(viewYear)}`;
    valueEl.classList.toggle('is-placeholder', !dt);
    const isDisabled = !!inputEl.disabled;
    wrap.classList.toggle('is-disabled', isDisabled);
    trigger.disabled = isDisabled;
    if (isDisabled) close();
  }
  // Keeps the calendar inside the visible part of the scrolling sidebar:
  // opens upward when there is no room below (e.g. the last lab-report row),
  // and nudges it sideways so it is never clipped by the sidebar edge.
  function placePanel() {
    wrap.classList.remove('drop-up');
    panel.style.removeProperty('--cdate-tx');
    const scroller = wrap.closest('.sidebar') || document.documentElement;
    const sr = scroller.getBoundingClientRect();
    const tr = trigger.getBoundingClientRect();
    const ph = panel.offsetHeight + 7, pw = panel.offsetWidth;
    const bottomLimit = Math.min(sr.bottom, window.innerHeight) - 8;
    const topLimit = Math.max(sr.top, 0) + 8;
    const roomBelow = bottomLimit - tr.bottom;
    const roomAbove = tr.top - topLimit;
    if (roomBelow < ph && roomAbove > roomBelow) wrap.classList.add('drop-up');
    const mobile = window.matchMedia('(max-width:760px)').matches;
    const left = mobile ? tr.left + tr.width / 2 - pw / 2 : tr.left;
    const minL = Math.max(sr.left, 0) + 8;
    const maxL = Math.min(sr.right, window.innerWidth) - pw - 8;
    const dx = Math.round(Math.max(minL, Math.min(left, Math.max(minL, maxL))) - left);
    if (dx) panel.style.setProperty('--cdate-tx', mobile ? `calc(-50% + ${dx}px)` : `${dx}px`);
  }
  function open() {
    if (inputEl.disabled) return;
    setView(parseISO(inputEl.value) || todayDate);
    renderGrid();
    placePanel();
    wrap.classList.add('open');
    // Lift the whole sidebar group above the groups after it while the calendar is open
    // (later groups have positioned titles / animated wrappers that would paint over it).
    const grp = wrap.closest('.group'); if (grp) grp.classList.add('cdate-open');
    // if it still doesn't fit either way, bring it into view
    setTimeout(() => { if (wrap.classList.contains('open')) panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 200);
    trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('keydown', onKey, true);
  }
  function close() {
    wrap.classList.remove('open');
    const grp = wrap.closest('.group'); if (grp) grp.classList.remove('cdate-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('keydown', onKey, true);
  }
  function onOutside(e) { if (!wrap.contains(e.target)) close(); }
  function onKey(e) { if (e.key === 'Escape') { close(); trigger.focus(); } }
  function selectDate(iso) {
    nativeValueDesc.set.call(inputEl, iso);
    refresh();
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
    close();
  }
  trigger.addEventListener('click', () => {
    if (wrap.classList.contains('open')) close(); else open();
  });
  panel.querySelector('.cdate-prev').addEventListener('click', () => {
    viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderGrid();
  });
  panel.querySelector('.cdate-next').addEventListener('click', () => {
    viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderGrid();
  });
  panel.querySelector('.cdate-today-btn').addEventListener('click', () => { selectDate(todayISO); });
  Object.defineProperty(inputEl, 'value', {
    get() { return nativeValueDesc.get.call(inputEl); },
    set(v) { nativeValueDesc.set.call(inputEl, v); refresh(); },
    configurable: true
  });
  Object.defineProperty(inputEl, 'disabled', {
    get() { return Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'disabled').get.call(inputEl); },
    set(v) { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'disabled').set.call(inputEl, v); refresh(); },
    configurable: true
  });
  // Language toggle fires this so the trigger text and calendar re-label immediately.
  // Lab-entry rows are rebuilt often; drop the listener once its calendar is gone.
  const onLang = () => {
    if (!wrap.isConnected) { document.removeEventListener('cg:langchange', onLang); return; }
    refresh();
  };
  document.addEventListener('cg:langchange', onLang);
  refresh();
}
function setupCustomDateInputs() {
  enhanceDateInput(document.getElementById('dateSubmissionInput'), {
  getMinDate: () => document.getElementById('dateExperimentInput').value || null,
  placeholder: 'DD MM YYYY'
});
  enhanceDateInput(document.getElementById('dateExperimentInput'), {
    maxDate: new Date().toLocaleDateString('en-CA'),
    placeholder: 'DD MM YYYY'
  });
  document.getElementById('dateExperimentInput').addEventListener('change', () => {
    const expVal = document.getElementById('dateExperimentInput').value;
    const subInput = document.getElementById('dateSubmissionInput');
    if (expVal && subInput.value && subInput.value < expVal) {
      subInput.value = '';
    }
  });
}