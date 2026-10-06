let __lastPageCount = null;
let __lastEffectiveLayout = null;
function countVisiblePages() {
  const viewport = document.getElementById('pagesViewport');
  if (!viewport) return 1;
  return Array.from(viewport.children).filter(el => el.style.display !== 'none').length;
}
// The toolbar is absolutely positioned over the top of the stage, and on a phone
// it wraps to a variable number of rows (the Side-by-side / Top-to-bottom
// switch only appears when the lab has an index, making it ~45px taller).
// A fixed CSS padding-top can't know that, so the top of the cover slid under
// the toolbar and couldn't be scrolled into view. Keep the scroll area's top
// padding in step with the toolbar's real height instead.
function syncStageInset() {
  const stage = document.querySelector('.stage-scroll');
  const toolbar = document.querySelector('.stage-toolbar');
  if (!stage || !toolbar) return;
  const want = Math.max(66, toolbar.offsetHeight + 14);
  const cur = parseFloat(stage.style.paddingTop) || 0;
  if (Math.abs(cur - want) > 0.5) stage.style.paddingTop = want + 'px';
}
function rowFitScale() {
  const viewport = document.getElementById('pagesViewport');
  const stage = document.querySelector('.stage-scroll');
  if (!viewport || !stage || !viewport.classList.contains('layout-row')) return Infinity;
  const isMobile = window.innerWidth <= 760;
  const sideMargin = isMobile ? 20 : 60;
  const gap = 30;
  const neededW = Math.min(countVisiblePages(), 2) * 793 + gap;
  const widthBudget = stage.clientWidth - sideMargin;
  return widthBudget / neededW;
}
function setupZoom() {
  const range = document.getElementById('zoomRange');
  const val = document.getElementById('zoomVal');
  function apply() {
    const z = range.value;
    const viewport = document.getElementById('pagesViewport');
    const sizer = document.getElementById('pagesViewportSizer');
    const scale = Math.min(z / 100, rowFitScale());
    viewport.style.transform = `scale(${scale})`;
    sizer.style.width = (viewport.offsetWidth * scale) + 'px';
    sizer.style.height = (viewport.offsetHeight * scale) + 'px';
    val.textContent = Math.round(scale * 100) + '%';
  }
  range.addEventListener('input', apply);
  window.__applyZoomTransform = apply;
  function autoFit() {
    const stage = document.querySelector('.stage-scroll');
    const toolbar = document.querySelector('.stage-toolbar');
    const isMobile = window.innerWidth <= 760;
    const toolbarH = toolbar ? toolbar.offsetHeight : 60;
    const reserve = isMobile ? 28 : 40;
    const sideMargin = isMobile ? 20 : 60;
    const availH = window.innerHeight - toolbarH - reserve;
    const showingIndex = hasIndexPage();
    const isRow = showingIndex && resolveEffectiveLayout() === 'row';
    const gap = 30;
    const neededH = 1122;
    const neededW = isRow
      ? Math.min(countVisiblePages(), 2) * 793 + gap
      : 793;
    const widthBudget = isMobile ? window.innerWidth * 0.88 : (stage.clientWidth - sideMargin);
    const scale = Math.min(availH / neededH, widthBudget / neededW, 1);
    const zoomMin = parseInt(range.min, 10) || 20;
    const zoomMax = parseInt(range.max, 10) || 100;
    range.value = Math.max(zoomMin, Math.min(zoomMax, Math.round(scale * 100)));
    apply();
  }
  window.addEventListener('resize', () => { updateStageLayout(); });
  syncStageInset();
  const tbEl = document.querySelector('.stage-toolbar');
  if (tbEl && window.ResizeObserver) new ResizeObserver(syncStageInset).observe(tbEl);
  window.__autoFitStage = autoFit;
  autoFit();
}
function resolveEffectiveLayout() {
  if (!hasIndexPage()) return 'col';
  if (state.pageLayout === 'col') return 'col';
  const stage = document.querySelector('.stage-scroll');
  const range = document.getElementById('zoomRange');
  if (!stage || !range) return state.pageLayout;
  const isMobile = window.innerWidth <= 760;
  const sideMargin = isMobile ? 20 : 60;
  const gap = 30;
  const neededW = 793 * 2 + gap;
  const zoomMin = parseInt(range.min, 10) || 40;
  const rowFitPct = ((stage.clientWidth - sideMargin) / neededW) * 100;
  return rowFitPct < zoomMin ? 'col' : 'row';
}
function setupPageLayoutToggle() {
  const ctl = document.getElementById('pageLayoutCtl');
  if (!ctl) return;
  ctl.querySelectorAll('button[data-layout]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.pageLayout === btn.dataset.layout) return;
      state.pageLayout = btn.dataset.layout;
      updateStageLayout({ autoFit: true });
    });
  });
}
function visiblePageWraps(viewport) {
  return Array.from(viewport.children).filter(el => el.style.display !== 'none');
}
function applyOddPageCentering(viewport, effective, wraps) {
  wraps.forEach(w => w.classList.remove('pv-last-centered'));
  if (effective === 'row' && wraps.length % 2 === 1) {
    wraps[wraps.length - 1].classList.add('pv-last-centered');
  }
}
function revealNewlyAddedPage(wraps) {
  const last = wraps[wraps.length - 1];
  if (last) last.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
}
function updateStageLayout(opts = {}) {
  const { autoFit = true } = opts;
  const viewport = document.getElementById('pagesViewport');
  const ctl = document.getElementById('pageLayoutCtl');
  if (!viewport) return;
  const show = hasIndexPage();
  if (ctl) ctl.style.display = show ? 'flex' : 'none';
  syncStageInset();
  const effective = resolveEffectiveLayout();
  const layoutChanged = __lastEffectiveLayout !== null && __lastEffectiveLayout !== effective;
  const shouldAutoFit = autoFit && (layoutChanged || __lastEffectiveLayout === null);
  viewport.classList.toggle('layout-col', effective === 'col');
  viewport.classList.toggle('layout-row', effective === 'row');
  if (ctl) {
    const forcedStack = show && state.pageLayout === 'row' && effective === 'col';
    const rowBtn = ctl.querySelector('button[data-layout="row"]');
    const colBtn = ctl.querySelector('button[data-layout="col"]');
    if (rowBtn) {
      rowBtn.classList.toggle('active', state.pageLayout === 'row' && !forcedStack);
      rowBtn.classList.toggle('layout-btn-forced-off', forcedStack);
      rowBtn.title = forcedStack ? 'Side by side (too narrow right now — stacking instead)' : 'Side by side';
    }
    if (colBtn) colBtn.classList.toggle('active', state.pageLayout === 'col' || forcedStack);
  }
  const wraps = visiblePageWraps(viewport);
  applyOddPageCentering(viewport, effective, wraps);
  const totalPages = wraps.length;
  const grew = __lastPageCount !== null && totalPages > __lastPageCount;
  __lastPageCount = totalPages;
  __lastEffectiveLayout = effective;
  requestAnimationFrame(() => {
    if (shouldAutoFit) {
      if (window.__autoFitStage) window.__autoFitStage();
    } else {
      if (window.__applyZoomTransform) window.__applyZoomTransform();
      if (grew) revealNewlyAddedPage(wraps);
    }
  });
}
function setupDrawer() {
  const sidebar = document.getElementById('sidebar');
  const fab = document.getElementById('fabToggle');
  const segs = fab.querySelectorAll('.fab-seg');
  if (window.innerWidth <= 760) sidebar.classList.add('open');
  function syncFab(animate = false) {
    const isOpen = sidebar.classList.contains('open');
    fab.classList.toggle('is-preview', !isOpen);
    const eye = fab.querySelector('.eye-icon');
    if (eye) {
      eye.innerHTML = isOpen
        ? '<svg viewBox="0 0 640 512" aria-hidden="true"><path d="M150.7 92.77C195 58.27 251.8 32 320 32C400.8 32 465.5 68.84 512.6 112.6C559.4 156 590.7 207.1 605.5 243.7C608.8 251.6 608.8 260.4 605.5 268.3C592.1 300.6 565.2 346.1 525.6 386.7L630.8 469.1C641.2 477.3 643.1 492.4 634.9 502.8C626.7 513.2 611.6 515.1 601.2 506.9L9.196 42.89C-1.236 34.71-3.065 19.63 5.112 9.196C13.29-1.236 28.37-3.065 38.81 5.112L150.7 92.77zM223.1 149.5L313.4 220.3C317.6 211.8 320 202.2 320 191.1C320 180.5 316.1 169.7 311.6 160.4C314.4 160.1 317.2 159.1 320 159.1C373 159.1 416 202.1 416 255.1C416 269.7 413.1 282.7 407.1 294.5L446.6 324.7C457.7 304.3 464 280.9 464 255.1C464 176.5 399.5 111.1 320 111.1C282.7 111.1 248.6 126.2 223.1 149.5zM320 480C239.2 480 174.5 443.2 127.4 399.4C80.62 355.1 49.34 304 34.46 268.3C31.18 260.4 31.18 251.6 34.46 243.7C44 220.8 60.29 191.2 83.09 161.5L177.4 235.8C176.5 242.4 176 249.1 176 255.1C176 335.5 240.5 400 320 400C338.7 400 356.6 396.4 373 389.9L446.2 447.5C409.9 467.1 367.8 480 320 480H320z"/></svg>'
        : '<svg viewBox="0 0 576 512" aria-hidden="true"><path d="M279.6 160.4C282.4 160.1 285.2 160 288 160C341 160 384 202.1 384 256C384 309 341 352 288 352C234.1 352 192 309 192 256C192 253.2 192.1 250.4 192.4 247.6C201.7 252.1 212.5 256 224 256C259.3 256 288 227.3 288 192C288 180.5 284.1 169.7 279.6 160.4zM480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6V112.6zM288 112C208.5 112 144 176.5 144 256C144 335.5 208.5 400 288 400C367.5 400 432 335.5 432 256C432 176.5 367.5 112 288 112z"/></svg>';
    }
    if (animate) {
      fab.classList.remove('mode-changing');
      void fab.offsetWidth;
      fab.classList.add('mode-changing');
      window.setTimeout(() => fab.classList.remove('mode-changing'), 450);
    }
    segs.forEach(seg => {
      const active = (seg.dataset.mode === 'customize') === isOpen;
      seg.setAttribute('aria-selected', active ? 'true' : 'false');
      seg.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }
  segs.forEach(seg => {
    seg.addEventListener('click', () => {
      const wantOpen = seg.dataset.mode === 'customize';
      const alreadyOpen = sidebar.classList.contains('open');
      if (wantOpen === alreadyOpen) {
        syncFab(true);
        return;
      }
      sidebar.classList.toggle('open', wantOpen);
      if (!wantOpen) {
        render();
      }
      syncFab(true);
    });
  });
  syncFab(false);
}