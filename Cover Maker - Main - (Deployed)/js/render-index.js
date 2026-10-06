function hasIndexPage() {
  return state.docType === 'lab' && state.needIndex;
}
function getIndexTheme() {
  const pal = getPalette();
  if (state.template === 'emblem') {
    return { primary: pal.embPrimary, secondary: pal.embSecondary, tint: pal.cardTint, tintRow: pal.cardTintRow };
  }
  return { primary: pal.cardBar, secondary: pal.cardAccent, tint: pal.cardTint, tintRow: pal.cardTintRow };
}
function indexThemeStyle() {
  const th = getIndexTheme();
  return `--ixp:${th.primary};--ixs:${th.secondary};--ixtint:${th.tint};--ixtintrow:${th.tintRow};--ixtintrowa:${hexToRgba(th.tintRow, 0.35)};`;
}
// In Bangla mode, ASCII digits in row numbers / page numbers are shown as
// Bengali numerals. Stored values stay as typed (nextLabNo() in sidebar.js
// parses them with parseInt, which only understands ASCII digits).
function ixNum(v) {
  return state.language === 'bn' ? toBnDigits(v == null ? '' : v) : v;
}
function buildIndexSubtitle() {
  if (state.indexSubtitle && state.indexSubtitle.trim()) return state.indexSubtitle.trim();
  const parts = [];
  const course = [state.courseCode, state.courseTitle].filter(v => v && String(v).trim()).join(' — ');
  if (course) parts.push(course);
  const by = state.byName || state.studentName;
  if (by && state.toName) parts.push(tf('ixSubBoth', { by, to: state.toName }));
  else if (by) parts.push(tf('ixSubBy', { by }));
  else if (state.toName) parts.push(tf('ixSubTo', { to: state.toName }));
  return parts.join(' · ');
}
// Teacher's name (+ designation) printed under a bottom signature line.
// Returns '' when no teacher's name has been entered, so the signature area
// looks exactly as it did before in that case.
function ixTeacherLines() {
  const name = (state.toName || '').trim();
  if (!name) return '';
  const desig = (state.toDesignation || '').trim();
  return `<span class="ix-signee-name">${esc(name)}</span>${desig ? `<span class="ix-signee-desig">${esc(desig)}</span>` : ''}`;
}
function ixHeaderBlock() {
  return `<div class="ix-uni">${esc(or(state.universityName, t('ixUniversityFallback')))}</div>
    <div class="ix-dept">${esc(or(state.deptTitle, t('departmentFallback')))}</div>`;
}
function ixEntries() {
  return state.labEntries.filter(e => (e.no && String(e.no).trim()) || (e.name && e.name.trim()) || (e.date && e.date.trim()));
}
function ixEntriesWithIndex() {
  return state.labEntries
    .map((e, idx) => ({ ...e, _originalIndex: idx }))
    .filter(e => (e.no && String(e.no).trim()) || (e.name && e.name.trim()) || (e.date && e.date.trim()));
}
function renderIndexTabular(entries, opts = {}) {
  const { continuation = false } = opts;
  const rows = entries.map((e, i) => `
    <tr class="${i % 2 ? 'alt' : ''}" data-original-index="${e._originalIndex}">
      <td class="no">${esc(ixNum(or(e.no, String(i + 1).padStart(2, '0'))))}</td>
      <td>${esc(or(e.name, '—'))}</td>
      <td class="date">${esc(or(fmtDate(e.date), '—'))}</td>
      <td class="page">${esc(ixNum(or(e.page, '')))}</td>
      <td class="sign"></td>
    </tr>`).join('');
  const band = continuation ? '' : `
    <div class="ix-abstract-band" aria-hidden="true">
      ${ABSTRACT_SVG.replace('<svg ', '<svg preserveAspectRatio="none" ')}
    </div>`;
  const head = continuation ? '' : `
    <div class="ix-head">
      ${ixHeaderBlock()}
      <div class="ix-title">${esc(or(state.indexTitle, t('ixDefaultTitle')))}</div>
      <div class="ix-subtitle">${esc(buildIndexSubtitle())}</div>
    </div>`;
  return `
  <div class="tpl-index-tabular${continuation ? ' ix-continuation' : ''}" style="${indexThemeStyle()}">
    <div class="ix-topbar"></div>
    <div class="ix-botbar"></div>
    ${band}
    ${head}
    <table>
      <thead><tr><th>${esc(t('ixColNo'))}</th><th>${esc(t('ixColLabName'))}</th><th>${esc(t('ixColDate'))}</th><th>${esc(t('ixColPage'))}</th><th>${esc(t('ixColSignature'))}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="ix-foot">
      <span>${esc([state.courseCode, state.courseTitle].filter(v => v && v.trim()).join(' · '))}</span>
      <span>${esc(or(state.byName || state.studentName, ''))}</span>
    </div>
  </div>`;
}
function renderIndexRuled(entries, opts = {}) {
  const { continuation = false, last = !continuation } = opts;
  const listHtml = entries.length ? entries.map((e, i) => `
    <div class="ix-row" data-original-index="${e._originalIndex}">
      <span class="ix-no">${esc(ixNum(or(e.no, String(i + 1).padStart(2, '0'))))}</span>
      <span class="ix-name">${esc(or(e.name, t('ixUntitledLab')))}</span>
      <span class="ix-dots"></span>
      <span class="ix-date">${esc(or(fmtDate(e.date), '—'))}</span>
    </div>`).join('') : `<div class="ix-empty">${esc(t('ixEmpty'))}</div>`;
  const head = continuation ? '' : `
    ${ixHeaderBlock()}
    <div class="ix-rule"></div>
    <div class="ix-eyebrow">${esc(t('ixEyebrow'))}</div>
    <div class="ix-title">${esc(or(state.indexTitle, t('ixDefaultTitle')))}</div>
    <div class="ix-subtitle">${esc(buildIndexSubtitle())}</div>`;
  return `
  <div class="tpl-index-ruled${continuation ? ' ix-continuation' : ''}" style="${indexThemeStyle()}">
    ${head}
    <div class="ix-list">${listHtml}</div>
    ${last ? `
    <div class="ix-signrow">
      <div class="sign-block">${esc(t('ixCheckedBy'))}${ixTeacherLines()}</div>
      <div class="sign-block">${esc(t('ixColDate'))}</div>
    </div>` : ''}
  </div>`;
}
function renderIndexBordered(entries, opts = {}) {
  const { continuation = false } = opts;
  const boxes = entries.length ? entries.map((e, i) => `
    <div class="ix-box" data-original-index="${e._originalIndex}">
      <div class="ix-box-no">${esc(ixNum(or(e.no, String(i + 1).padStart(2, '0'))))}</div>
      <div class="ix-box-name">${esc(or(e.name, t('ixUntitledLab')))}</div>
      <div class="ix-box-date"><i class="fa-regular fa-calendar" aria-hidden="true"></i>&nbsp; ${esc(or(fmtDate(e.date), t('ixDateNotSet')))}</div>
      <div class="ix-box-sign">${esc(t('ixColSignature'))}</div>
    </div>`).join('') : `<div class="ix-empty">${esc(t('ixEmpty'))}</div>`;
  const band = continuation ? '' : `
    <div class="ix-abstract-band" aria-hidden="true">
      ${ABSTRACT_SVG.replace('<svg ', '<svg preserveAspectRatio="none" ')}
    </div>`;
  const head = continuation ? '' : `
    <div class="ix-head">
      ${ixHeaderBlock()}
      <div class="ix-title">${esc(or(state.indexTitle, t('ixDefaultTitle')))}</div>
      <div class="ix-subtitle">${esc(buildIndexSubtitle())}</div>
    </div>`;
  return `
  <div class="tpl-index-bordered${continuation ? ' ix-continuation' : ''}" style="${indexThemeStyle()}">
    <div class="ix-topbar"></div>
    ${band}
    ${head}
    <div class="ix-grid">${boxes}</div>
  </div>`;
}
function renderIndexwatermark(entries, opts = {}) {
  const { continuation = false, last = !continuation } = opts;
  const rows = entries.map((e, i) => `
    <tr data-original-index="${e._originalIndex}">
      <td class="no">${esc(ixNum(or(e.no, String(i + 1).padStart(2, '0'))))}</td>
      <td class="date">${esc(or(fmtDate(e.date), ''))}</td>
      <td class="name">${esc(or(e.name, ''))}</td>
      <td class="page">${esc(ixNum(or(e.page, '')))}</td>
      <td class="remarks"></td>
    </tr>`).join('');
  const watermark = state.logoDataUrl
    ? `<div class="ix-vs-watermark" aria-hidden="true"><img src="${state.logoDataUrl}" alt=""></div>`
    : '';
  const head = continuation ? '' : `
    <div class="ix-vs-head">
      ${state.logoDataUrl
        ? `<div class="ix-vs-logo-slot"><img class="ix-vs-logo" src="${state.logoDataUrl}" alt="${esc(t('ixLogoAlt'))}"></div>`
        : `<div class="ix-uni">${esc(or(state.universityName, t('ixUniversityFallback')))}</div>`}
      <div class="ix-vs-title">${esc(or(state.indexTitle, t('ixDefaultTitle')))}</div>
    </div>`;
  return `
  <div class="tpl-index-watermark${continuation ? ' ix-continuation' : ''}" style="${indexThemeStyle()}">
    ${watermark}
    ${head}
    <table>
      <thead>
        <tr>
          <th>${esc(t('ixColExpNo'))}</th>
          <th>${esc(t('ixColDate'))}</th>
          <th>${esc(t('ixColExpName'))}</th>
          <th>${esc(t('ixColPageNo'))}</th>
          <th>${esc(t('ixColRemarks'))}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    ${last ? `
    <div class="ix-vs-signrow${ixTeacherLines() ? ' has-signee' : ''}">
      <div class="ix-vs-signline">
        <span class="ix-vs-sign-line"></span>
        <span class="ix-vs-sign-label">${esc(t('ixColSignature'))}</span>
      </div>
      ${ixTeacherLines() ? `<div class="ix-vs-signee">${ixTeacherLines()}</div>` : ''}
    </div>` : ''}
  </div>`;
}
const INDEX_RENDERERS = { tabular: renderIndexTabular, ruled: renderIndexRuled, bordered: renderIndexBordered, watermark: renderIndexwatermark };
const IX_MIN_BOTTOM_MARGIN = 60; 
function measureIndexOverflow(html) {
  let probe = document.getElementById('ixMeasureProbe');
  if (!probe) {
    probe = document.createElement('div');
    probe.id = 'ixMeasureProbe';
    probe.style.cssText = 'position:fixed; left:-9999px; top:0; width:210mm; height:297mm; visibility:hidden; pointer-events:none;';
    document.body.appendChild(probe);
  }
  // Measure with the same font the visible page uses, otherwise wider fonts
  // paginate as if they were Times and rows overflow the real page.
  probe.style.setProperty('--paper-font', currentPaperFontCss());
  probe.innerHTML = html;
  bumpBanglaFontSizes(probe);
  const pageEl = probe.firstElementChild;
  if (!pageEl) return 999;
  pageEl.style.overflow = 'visible';
  const signEl = pageEl.querySelector('.ix-signrow, .ix-vs-signrow');
  if (signEl) signEl.style.marginTop = '0';
  const contentEl = signEl || pageEl.querySelector('table, .ix-list, .ix-grid');
  if (!contentEl) return 999;
  return pageEl.getBoundingClientRect().bottom - contentEl.getBoundingClientRect().bottom;
}
function paginateIndex(rendererFn, allEntries) {
  const pages = [];
  let remaining = allEntries.slice();
  let guard = 0;
  while (remaining.length && guard++ < 200) {
    const continuation = pages.length > 0;
    const totalRemaining = remaining.length;
    const fits = n => measureIndexOverflow(
      rendererFn(remaining.slice(0, n), { continuation, last: n === totalRemaining })
    ) >= IX_MIN_BOTTOM_MARGIN;
    // Largest row count that still fits (min 1). Binary search: far fewer
    // layout measurements than shrinking one row at a time.
    let count;
    if (fits(totalRemaining)) {
      count = totalRemaining;
    } else {
      count = 1;
      let lo = 1, hi = totalRemaining - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (fits(mid)) { count = mid; lo = mid + 1; } else { hi = mid - 1; }
      }
    }
    const last = count === totalRemaining;
    pages.push(rendererFn(remaining.slice(0, count), { continuation, last }));
    remaining = remaining.slice(count);
  }
  return pages.length ? pages : [rendererFn([], { continuation: false, last: true })];
}
function ensureIndexPageSlot(n) {
  const id = n === 1 ? 'paperWrapIndex' : `paperWrapIndex${n}`;
  let wrap = document.getElementById(id);
  if (!wrap) {
    const first = document.getElementById('paperWrapIndex');
    wrap = first.cloneNode(true);
    wrap.id = id;
    wrap.querySelector('[id^="paperIndex"]').id = n === 1 ? 'paperIndex' : `paperIndex${n}`;
    const tag = wrap.querySelector('.page-tag');
    if (tag) tag.textContent = `Index ${n}`;
    const prevId = n <= 2 ? 'paperWrapIndex' : `paperWrapIndex${n - 1}`;
    const prev = document.getElementById(prevId) || first;
    prev.after(wrap);
  }
  return wrap;
}
function renderIndexPage() {
  const firstWrap = document.getElementById('paperWrapIndex');
  if (!firstWrap) return;
  if (!hasIndexPage()) {
    firstWrap.style.display = 'none';
    document.querySelectorAll('[id^="paperWrapIndex"]').forEach((w, i) => { if (i > 0) w.remove(); });
    return;
  }
  firstWrap.style.display = '';
  const fn = INDEX_RENDERERS[state.indexTemplate] || INDEX_RENDERERS.tabular;
  const pages = paginateIndex(fn, ixEntriesWithIndex());
  document.querySelectorAll('[id^="paperWrapIndex"]').forEach((w, i) => { if (i >= pages.length) w.remove(); });
  pages.forEach((html, i) => {
    const wrap = ensureIndexPageSlot(i + 1);
    wrap.style.display = '';
    wrap.querySelector('[id^="paperIndex"]').innerHTML = html;
  });
  applyPaperFont();
}
function refreshIndexPreview() {
  renderIndexPage();
  updateStageLayout({ autoFit: false });
}