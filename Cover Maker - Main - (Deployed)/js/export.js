function ensurePrintStyles() {
  if (document.getElementById('a4-print-styles')) return;
  const style = document.createElement('style');
  style.id = 'a4-print-styles';
  style.textContent = `
    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      html, body {
        width: 210mm !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        overflow: visible !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      /* Hide all UI panels, controls, sidebars, headers, and modals.
         Scoped with :not(#paper *):not([id^="paperIndex"] *) so a bare
         <header> tag used inside a cover/index template's own markup
         is never caught by this rule — only the app's own chrome is. */
      body > header:not(#paper):not(#paper *),
      nav, .sidebar, .sidebar-wrap, .topbar, .app-header,
      .no-print, .thanks-modal, .btn, .stage-controls, .zoom-controls, 
      .stage-header, .toast, #browserWarnModal, #dlChoiceModal, #thanksModal,
      .pill-thanks, .theme-toggle, .github-link {
        display: none !important;
      }
      /* Reset stage viewport transforms & containers */
      .stage-scroll, .stage-container, #pagesViewportSizer, #pagesViewport {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm !important;
        height: auto !important;
        transform: none !important;
        box-shadow: none !important;
        border: none !important;
        background: transparent !important;
        overflow: visible !important;
        display: block !important;
      }
      /* A4 page containers */
      #paper, [id^="paperIndex"] {
        width: 210mm !important;
        height: 297mm !important;
        max-width: 210mm !important;
        max-height: 297mm !important;
        min-width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: none !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        position: relative !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      /* Prevent trailing blank page when printing single page or last page */
      .printing-single-page #paper {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      [id^="paperIndex"]:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
  `;
  document.head.appendChild(style);
}
async function waitForFonts() {
  if (!(document.fonts && document.fonts.ready)) return;
  await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]);
}
async function withNativeScale(fn) {
  const viewport = document.getElementById('pagesViewport');
  const sizer = document.getElementById('pagesViewportSizer');
  const prevTransform = viewport ? viewport.style.transform : '';
  const prevMargin = viewport ? viewport.style.marginBottom : '';
  const prevSizerWidth = sizer ? sizer.style.width : '';
  const prevSizerHeight = sizer ? sizer.style.height : '';
  await waitForFonts();
  showLoader('Preparing full-resolution page…');
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise(r => setTimeout(r, 220));
  if (viewport && sizer) {
    sizer.style.width = viewport.offsetWidth + 'px';
    sizer.style.height = viewport.offsetHeight + 'px';
    viewport.style.transform = 'none';
    viewport.style.marginBottom = '0';
  }
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  try {
    return await fn();
  } finally {
    if (viewport && sizer) {
      viewport.style.transform = prevTransform;
      viewport.style.marginBottom = prevMargin;
      sizer.style.width = prevSizerWidth;
      sizer.style.height = prevSizerHeight;
    }
    hideLoader();
  }
}
// ---- Dotted / Grid page texture, baked for html2canvas ----
// style.css paints the texture with CSS-variable gradients under
// html[data-page-bg=...]. html2canvas can't reliably reproduce tiled gradients
// (and re-resolves the selector in its own iframe), so the texture came out
// missing in PNG/PDF. Here we draw one tile onto a canvas and hand it to the
// cloned page as a plain PNG background. Keep values in sync with the
// html[data-page-bg] rules in style.css.
function makePageTextureTile(mode, scale) {
  const size = mode === 'grid' ? 24 : 20;
  const c = document.createElement('canvas');
  c.width = c.height = size * scale;
  const ctx = c.getContext('2d');
  ctx.scale(scale, scale);
  if (mode === 'grid') {
    ctx.fillStyle = 'rgba(0,0,0,.06)';
    ctx.fillRect(0, 0, size, 1);
    ctx.fillRect(0, 0, 1, size);
  } else {
    const m = size / 2;
    const g = ctx.createRadialGradient(m, m, 0, m, m, 1.6);
    g.addColorStop(0, 'rgba(0,0,0,.14)');
    g.addColorStop(1 / 1.6, 'rgba(0,0,0,.14)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return { url: c.toDataURL('image/png'), size };
}
function splitTopLevelCommas(str) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function bakePageTexture(liveRoot, clonedRoot) {
  const mode = document.documentElement.getAttribute('data-page-bg');
  if (!liveRoot || !clonedRoot || (mode !== 'dotted' && mode !== 'grid')) return;
  const tile = makePageTextureTile(mode, 3);
  const texLayers = mode === 'grid' ? 2 : 1; // gradients the CSS rule stacks on top
  const pairs = [[liveRoot, clonedRoot]];
  const n = Math.min(liveRoot.children.length, clonedRoot.children.length);
  for (let i = 0; i < n; i++) pairs.push([liveRoot.children[i], clonedRoot.children[i]]);
  pairs.forEach(([live, clone]) => {
    const cs = getComputedStyle(live);
    const imgs = splitTopLevelCommas(cs.backgroundImage);
    if (imgs.length < texLayers || imgs[0] === 'none') return; // texture not applied here
    const cycle = (list, count) => Array.from({ length: count }, (_, i) => list[i % list.length]);
    const total = imgs.length;
    const sizes = cycle(splitTopLevelCommas(cs.backgroundSize), total);
    const repeats = cycle(splitTopLevelCommas(cs.backgroundRepeat), total);
    const poss = cycle(splitTopLevelCommas(cs.backgroundPosition), total);
    clone.style.backgroundImage = ['url("' + tile.url + '")'].concat(imgs.slice(texLayers)).join(', ');
    clone.style.backgroundSize = [tile.size + 'px ' + tile.size + 'px'].concat(sizes.slice(texLayers)).join(', ');
    clone.style.backgroundRepeat = ['repeat'].concat(repeats.slice(texLayers)).join(', ');
    clone.style.backgroundPosition = ['0px 0px'].concat(poss.slice(texLayers)).join(', ');
  });
}
async function renderCanvasFor(paperId) {
  const liveEl = document.getElementById(paperId);
  return await html2canvas(liveEl, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      const el = clonedDoc.getElementById(paperId);
      if (el) {
        el.style.borderRadius = '0';
        el.style.overflow = 'visible';
        bakePageTexture(liveEl, el);
      }
    }
  });
}
async function captureAll() {
  return await withNativeScale(async () => {
    const coverCanvas = await renderCanvasFor('paper');
    const indexCanvases = [];
    if (hasIndexPage()) {
      const indexEls = Array.from(document.querySelectorAll('[id^="paperIndex"]'));
      for (const el of indexEls) indexCanvases.push(await renderCanvasFor(el.id));
    }
    return { coverCanvas, indexCanvases };
  });
}
function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function downloadCanvasAsPng(canvas, filename) {
  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (!blob) { triggerDownload(canvas.toDataURL('image/png'), filename); return; }
      const url = URL.createObjectURL(blob);
      triggerDownload(url, filename);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  } else {
    triggerDownload(canvas.toDataURL('image/png'), filename);
  }
}
function downloadPdfBlob(pdf, filename) {
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
function stackCanvasesVertically(canvases) {
  const width = Math.max(...canvases.map(c => c.width));
  const height = canvases.reduce((sum, c) => sum + c.height, 0);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  let y = 0;
  canvases.forEach(c => { ctx.drawImage(c, 0, y); y += c.height; });
  return canvas;
}
function isChromeBrowser() {
  const ua = navigator.userAgent;
  const isChromiumEngine = /Chrome\//.test(ua) || /CriOS\//.test(ua);
  const isOtherChromiumBrowser = /Edg\/|OPR\/|SamsungBrowser\//.test(ua) || !!navigator.brave;
  return isChromiumEngine && !isOtherChromiumBrowser;
}
function openInChrome() {
  const url = window.location.href;
  const ua = navigator.userAgent;
  if (/Android/.test(ua)) {
    const withoutScheme = url.replace(/^https?:\/\//, '');
    window.location.href = `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;end`;
    return;
  }
  if (/iPhone|iPad|iPod/.test(ua)) {
    window.location.href = url.replace(/^https:\/\//, 'googlechromes://').replace(/^http:\/\//, 'googlechrome://');
    return;
  }
  if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
}
let browserWarnModalEl = null;
function createBrowserWarnModal() {
  if (browserWarnModalEl) return browserWarnModalEl;
  const el = document.createElement('div');
  el.className = 'thanks-modal';
  el.id = 'browserWarnModal';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="thanks-backdrop" data-close></div>
    <div class="thanks-card dl-choice-card" role="dialog" aria-modal="true" aria-labelledby="browserWarnTitle">
      <button type="button" class="thanks-close" data-close aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <h2 class="thanks-title" id="browserWarnTitle">You're not in Chrome</h2>
      <p class="thanks-sub">Downloads render most reliably in Chrome. Other browsers can occasionally shift fonts or shadows, or produce a blank file.</p>
      <div class="dl-choice-options">
        <button type="button" class="dl-choice-btn" data-choice="chrome">
          <i class="fa-brands fa-chrome" aria-hidden="true"></i>
          <span class="dl-choice-title">Open in Chrome</span>
          <span class="dl-choice-note" id="browserWarnChromeNote">Best results</span>
        </button>
        <button type="button" class="dl-choice-btn" data-choice="continue">
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          <span class="dl-choice-title">Continue here</span>
          <span class="dl-choice-note">Download anyway</span>
        </button>
      </div>
      <button type="button" class="btn btn-ghost" data-close style="width:100%;">Cancel</button>
    </div>`;
  document.body.appendChild(el);
  function resolveAndClose(value) {
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKey);
    if (el._pending) { const p = el._pending; el._pending = null; p(value); }
  }
  function onKey(e) { if (e.key === 'Escape') resolveAndClose(null); }
  el.querySelectorAll('[data-close]').forEach(node => {
    node.addEventListener('click', () => resolveAndClose(null));
  });
  el.addEventListener('click', (e) => { if (e.target === el) resolveAndClose(null); });
  el.querySelectorAll('.dl-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => resolveAndClose(btn.dataset.choice));
  });
  browserWarnModalEl = el;
  browserWarnModalEl._onKey = onKey;
  return el;
}
function askBrowserWarning() {
  return new Promise(resolve => {
    const el = createBrowserWarnModal();
    const ua = navigator.userAgent;
    const canRelaunch = /Android|iPhone|iPad|iPod/.test(ua);
    el.querySelector('#browserWarnChromeNote').textContent = canRelaunch ? 'Best results' : 'Copies the link to paste into Chrome';
    el._pending = resolve;
    el.classList.add('show');
    el.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', el._onKey);
  });
}
let browserWarningAcknowledged = false;
async function ensureChromeOrProceed() {
  if (browserWarningAcknowledged || isChromeBrowser()) return true;
  const choice = await askBrowserWarning();
  if (choice === 'chrome') { openInChrome(); return false; }
  if (choice !== 'continue') return false;
  browserWarningAcknowledged = true;
  return true;
}
async function printA4(presetChoice) {
  // presetChoice is a string only when called from the PDF fallback (already confirmed);
  // the button click passes an Event instead.
  if (typeof presetChoice !== 'string' && !(await confirmMissingFields())) return;
  ensurePrintStyles();
  const withIndex = hasIndexPage();
  let choice = 'single';
  if (withIndex) {
    // presetChoice lets the PDF fallback skip a second prompt.
    choice = presetChoice || await askDownloadChoice('print');
    if (!choice) return; 
  }
  const indexEls = Array.from(document.querySelectorAll('[id^="paperIndex"]'));
  const hiddenEls = [];
  checkRequiredFieldsBeforeExport();
  if (withIndex && choice === 'separate') {
    document.body.classList.add('printing-single-page');
    indexEls.forEach(el => {
      hiddenEls.push({ el, display: el.style.display });
      el.style.display = 'none';
    });
  } else {
    document.body.classList.remove('printing-single-page');
  }
  window.print();
  document.body.classList.remove('printing-single-page');
  hiddenEls.forEach(({ el, display }) => {
    el.style.display = display;
  });
}
async function exportPdf() {
  if (!(await confirmMissingFields())) return;
  if (!(await ensureChromeOrProceed())) return;
  const withIndex = hasIndexPage();
  let choice = 'single';
  if (withIndex) {
    choice = await askDownloadChoice('pdf');
    if (!choice) return;
  }
  const btn = document.getElementById('printBtn');
  const hint = document.getElementById('exportHint');
  const original = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-pen-ruler" aria-hidden="true"></i><span>Rendering…</span>';
    btn.disabled = true;
  }
  if (hint) { hint.textContent = ''; hint.className = 'hint'; }
  const allRequiredFilled = checkRequiredFieldsBeforeExport();
  try {
    if (typeof html2canvas !== 'function' || !window.jspdf) { throw new Error('lib-missing'); }
    const { jsPDF } = window.jspdf;
    if (!withIndex) {
      const canvas = await withNativeScale(() => renderCanvasFor('paper'));
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      downloadPdfBlob(pdf, `${safeName()}-cover-page.pdf`);
      if (hint && allRequiredFilled) { hint.textContent = 'Downloaded a single-page 210×297mm PDF at 3× resolution.'; hint.className = 'hint ok'; }
      showThanksModal(`${safeName()}-cover-page.pdf`);
    } else if (choice === 'together') {
      const { coverCanvas, indexCanvases } = await captureAll();
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      pdf.addImage(coverCanvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      indexCanvases.forEach(c => {
        pdf.addPage('a4', 'portrait');
        pdf.addImage(c.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      });
      downloadPdfBlob(pdf, `${safeName()}-cover-index.pdf`);
      if (hint && allRequiredFilled) { hint.textContent = `Downloaded one ${indexCanvases.length + 1}-page PDF — cover + index — at 3× resolution.`; hint.className = 'hint ok'; }
      showThanksModal(`${safeName()}-cover-index.pdf`);
    } else {
      const { coverCanvas, indexCanvases } = await captureAll();
      const pdf1 = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      pdf1.addImage(coverCanvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      downloadPdfBlob(pdf1, `${safeName()}-cover-page.pdf`);
      for (let i = 0; i < indexCanvases.length; i++) {
        await new Promise(r => setTimeout(r, 350));
        const p = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        p.addImage(indexCanvases[i].toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
        const suffix = indexCanvases.length > 1 ? `-index-page-${i + 1}` : '-index-page';
        downloadPdfBlob(p, `${safeName()}${suffix}.pdf`);
      }
      if (hint && allRequiredFilled) { hint.textContent = `Downloaded ${indexCanvases.length + 1} separate PDF files — cover page and index page(s).`; hint.className = 'hint ok'; }
      showThanksModal(`${safeName()}-cover-page.pdf + ${indexCanvases.length} index page(s)`);
    }
  } catch (err) {
    console.error('PDF export failed, falling back to direct print dialog:', err);
    if (hint) { hint.textContent = 'Direct PDF export unavailable — opened the print dialog instead.'; hint.className = 'hint warn'; }
    await printA4(withIndex ? 'together' : 'single');
  } finally {
    if (btn) {
      btn.innerHTML = original;
      btn.disabled = false;
    }
  }
}
async function exportPng() {
  if (!(await confirmMissingFields())) return;
  if (!(await ensureChromeOrProceed())) return;
  const withIndex = hasIndexPage();
  let choice = 'single';
  if (withIndex) {
    choice = await askDownloadChoice('png');
    if (!choice) return;
  }
  const btn = document.getElementById('pngBtn');
  const pngHint = document.getElementById('exportHint');
  const original = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-pen-ruler" aria-hidden="true"></i><span>Rendering…</span>';
    btn.disabled = true;
  }
  checkRequiredFieldsBeforeExport();
  try {
    if (!withIndex) {
      const canvas = await withNativeScale(() => renderCanvasFor('paper'));
      downloadCanvasAsPng(canvas, `${safeName()}-cover-page.png`);
      showThanksModal(`${safeName()}-cover-page.png`);
    } else if (choice === 'together') {
      const { coverCanvas, indexCanvases } = await captureAll();
      const combined = stackCanvasesVertically([coverCanvas, ...indexCanvases]);
      downloadCanvasAsPng(combined, `${safeName()}-cover-index.png`);
      showThanksModal(`${safeName()}-cover-index.png`);
    } else {
      const { coverCanvas, indexCanvases } = await captureAll();
      downloadCanvasAsPng(coverCanvas, `${safeName()}-cover-page.png`);
      for (let i = 0; i < indexCanvases.length; i++) {
        await new Promise(r => setTimeout(r, 350));
        const suffix = indexCanvases.length > 1 ? `-index-page-${i + 1}` : '-index-page';
        downloadCanvasAsPng(indexCanvases[i], `${safeName()}${suffix}.png`);
      }
      showThanksModal(`${safeName()}-cover-page.png + ${indexCanvases.length} index page(s)`);
    }
  } catch (err) {
    console.error('PNG export failed:', err);
    if (pngHint) {
      pngHint.textContent = 'PNG export failed. Try Chrome, or use Download PDF / Print A4 instead.';
      pngHint.className = 'hint warn';
    }
  } finally {
    if (btn) {
      btn.innerHTML = original;
      btn.disabled = false;
    }
  }
}
function setupExport() {
  ensurePrintStyles();
  const pdfBtn = document.getElementById('printBtn');
  const pngBtn = document.getElementById('pngBtn');
  let directPrintBtn = document.getElementById('directPrintBtn') || document.getElementById('printA4Btn');
  if (!directPrintBtn && (pngBtn || pdfBtn)) {
    const anchorBtn = pngBtn || pdfBtn;
    if (anchorBtn && anchorBtn.parentElement) {
      directPrintBtn = document.createElement('button');
      directPrintBtn.type = 'button';
      directPrintBtn.id = 'directPrintBtn';
      directPrintBtn.className = anchorBtn.className;
      directPrintBtn.innerHTML = '<i class="fa-solid fa-print" aria-hidden="true"></i><span>Print A4</span>';
      anchorBtn.parentElement.appendChild(directPrintBtn);
    }
  } else if (directPrintBtn && pngBtn) {
    directPrintBtn.className = pngBtn.className;
  }
  if (directPrintBtn) {
    directPrintBtn.style.padding = '13px';
    directPrintBtn.style.fontSize = '13px';
  }
  if (pdfBtn) pdfBtn.addEventListener('click', exportPdf);
  if (pngBtn) pngBtn.addEventListener('click', exportPng);
  if (directPrintBtn) directPrintBtn.addEventListener('click', printA4);
  window.printA4 = printA4;
}
let dlChoiceModalEl = null;
function createDownloadChoiceModal() {
  if (dlChoiceModalEl) return dlChoiceModalEl;
  const el = document.createElement('div');
  el.className = 'thanks-modal';
  el.id = 'dlChoiceModal';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="thanks-backdrop" data-close></div>
    <div class="thanks-card dl-choice-card" role="dialog" aria-modal="true" aria-labelledby="dlChoiceTitle">
      <button type="button" class="thanks-close" data-close aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <h2 class="thanks-title" id="dlChoiceTitle">How would you like your pages?</h2>
      <p class="thanks-sub" id="dlChoiceSub">You have a cover page and index page(s) ready.</p>
      <div class="dl-choice-options">
        <button type="button" class="dl-choice-btn" data-choice="together">
          <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
          <span class="dl-choice-title" id="dlChoiceTogetherTitle">All pages together</span>
          <span class="dl-choice-note" id="dlChoiceTogetherNote">One file, multiple pages</span>
        </button>
        <button type="button" class="dl-choice-btn" data-choice="separate">
          <i class="fa-solid fa-file-arrow-down" id="dlChoiceSeparateIcon" aria-hidden="true"></i>
          <span class="dl-choice-title" id="dlChoiceSeparateTitle">One by one</span>
          <span class="dl-choice-note" id="dlChoiceSeparateNote">Two separate files</span>
        </button>
      </div>
      <button type="button" class="btn btn-ghost" data-close style="width:100%;">Cancel</button>
    </div>`;
  document.body.appendChild(el);
  function resolveAndClose(value) {
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKey);
    if (el._pending) { const p = el._pending; el._pending = null; p(value); }
  }
  function onKey(e) { if (e.key === 'Escape') resolveAndClose(null); }
  el.querySelectorAll('[data-close]').forEach(node => {
    node.addEventListener('click', () => resolveAndClose(null));
  });
  el.addEventListener('click', (e) => { if (e.target === el) resolveAndClose(null); });
  el.querySelectorAll('.dl-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => resolveAndClose(btn.dataset.choice));
  });
  dlChoiceModalEl = el;
  dlChoiceModalEl._onKey = onKey;
  return el;
}
function askDownloadChoice(kind) {
  return new Promise(resolve => {
    const el = createDownloadChoiceModal();
    const togetherTitle = el.querySelector('#dlChoiceTogetherTitle');
    const togetherNote = el.querySelector('#dlChoiceTogetherNote');
    const separateTitle = el.querySelector('#dlChoiceSeparateTitle');
    const separateNote = el.querySelector('#dlChoiceSeparateNote');
    const separateIcon = el.querySelector('#dlChoiceSeparateIcon');
    if (kind === 'print') {
      togetherTitle.textContent = 'All pages (Cover + Index)';
      togetherNote.textContent = 'Print cover and index pages in order';
      separateTitle.textContent = 'Cover page only';
      separateNote.textContent = 'Print single cover page';
      if (separateIcon) separateIcon.className = 'fa-solid fa-file';
    } else {
      togetherTitle.textContent = 'All pages together';
      togetherNote.textContent = kind === 'pdf' ? 'One PDF, multiple pages' : 'One tall PNG image';
      separateTitle.textContent = 'One by one';
      separateNote.textContent = kind === 'pdf' ? 'Separate PDF files' : 'Separate PNG files';
      if (separateIcon) separateIcon.className = 'fa-solid fa-file-arrow-down';
    }
    el._pending = resolve;
    el.classList.add('show');
    el.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', el._onKey);
  });
}
let thanksModalEl = null;
function createThanksModal() {
  if (thanksModalEl) return thanksModalEl;
  const thanksHref = document.querySelector('.pill-thanks')?.getAttribute('href')
    || 'mailto:dev.kasfiya.upoma@gmail.com?subject=Thanks%20genie%20for%20Coverworks!';
  const el = document.createElement('div');
  el.className = 'thanks-modal';
  el.id = 'thanksModal';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="thanks-backdrop" data-close></div>
    <div class="thanks-card" role="dialog" aria-modal="true" aria-labelledby="thanksTitle">
      <div class="thanks-confetti">
        <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
      <button type="button" class="thanks-close" data-close aria-label="Close"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <div class="thanks-icon-wrap">
        <div class="thanks-icon"><i class="fa-solid fa-check" aria-hidden="true"></i></div>
        <i class="fa-solid fa-sparkles thanks-sparkle s1" aria-hidden="true"></i>
        <i class="fa-solid fa-sparkles thanks-sparkle s2" aria-hidden="true"></i>
        <i class="fa-solid fa-sparkles thanks-sparkle s3" aria-hidden="true"></i>
      </div>
      <h2 class="thanks-title" id="thanksTitle">Cover page downloaded!</h2>
      <p class="thanks-sub">Straight off the press, ready to staple on. Good luck with the submission.</p>
      <div class="thanks-file" id="thanksFile"></div>
      <div class="thanks-actions">
        <a class="btn btn-primary thanks-thanks-btn" id="thanksSayThanks" href="${thanksHref}"><span class="heart"><i class="fa-solid fa-hand-holding-heart" aria-hidden="true"></i></span><span>Say thanks to the dev</span></a>
        <button type="button" class="btn btn-ghost" data-close>Keep editing</button>
      </div>
      <p class="thanks-foot">COVER GENIE · A4 · 210×297MM</p>
    </div>`;
  document.body.appendChild(el);
  function close() {
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  el.querySelectorAll('[data-close]').forEach(node => {
    node.addEventListener('click', close);
  });
  el.addEventListener('click', (e) => { if (e.target === el) close(); });
  thanksModalEl = el;
  thanksModalEl._close = close;
  thanksModalEl._onKey = onKey;
  return el;
}
function showThanksModal(filename) {
  const el = createThanksModal();
  const fileEl = el.querySelector('#thanksFile');
  if (fileEl) fileEl.textContent = filename || '';
  el.classList.add('show');
  el.setAttribute('aria-hidden', 'false');
  document.addEventListener('keydown', el._onKey);
}

// ---- "Required fields are empty" confirmation (animated modal) ----
let missingModalEl = null;
function createMissingFieldsModal() {
  if (missingModalEl) return missingModalEl;
  const el = document.createElement('div');
  el.className = 'thanks-modal mf-modal';
  el.id = 'missingFieldsModal';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="thanks-backdrop" data-close></div>
    <div class="thanks-card mf-card" role="alertdialog" aria-modal="true" aria-labelledby="mfTitle" aria-describedby="mfSub">
      <button type="button" class="thanks-close" data-close id="mfCloseBtn"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <div class="thanks-icon-wrap mf-icon-wrap">
        <div class="thanks-icon mf-icon"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i></div>
      </div>
      <h2 class="thanks-title" id="mfTitle"></h2>
      <p class="thanks-sub" id="mfSub"></p>
      <div class="mf-list-label" id="mfListLabel"></div>
      <div class="mf-list" id="mfList"></div>
      <div class="thanks-actions">
        <button type="button" class="btn btn-primary" data-choice="fill" id="mfFillBtn"><i class="fa-solid fa-pen" aria-hidden="true"></i>&nbsp; <span></span></button>
        <button type="button" class="btn btn-ghost" data-choice="continue" id="mfAnywayBtn"><span></span></button>
      </div>
    </div>`;
  document.body.appendChild(el);
  function resolveAndClose(value) {
    el.classList.remove('show');
    el.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKey);
    if (el._pending) { const p = el._pending; el._pending = null; p(value); }
  }
  function onKey(e) { if (e.key === 'Escape') resolveAndClose('fill'); }
  el.querySelectorAll('[data-close]').forEach(n => n.addEventListener('click', () => resolveAndClose('fill')));
  el.addEventListener('click', e => { if (e.target === el) resolveAndClose('fill'); });
  el.querySelectorAll('[data-choice]').forEach(b => b.addEventListener('click', () => resolveAndClose(b.dataset.choice)));
  missingModalEl = el;
  el._onKey = onKey;
  return el;
}
function askMissingFields(missing) {
  return new Promise(resolve => {
    const el = createMissingFieldsModal();
    const n = missing.length;
    const MAX = 6;
    el.querySelector('.mf-card').classList.toggle('mf-bn', state.language === 'bn');
    el.querySelector('#mfTitle').textContent = t('mfTitle');
    el.querySelector('#mfSub').textContent = tf(n === 1 ? 'mfSubOne' : 'mfSubMany', { n: numL(n) });
    el.querySelector('#mfListLabel').textContent = t('mfListLabel');
    el.querySelector('#mfCloseBtn').setAttribute('aria-label', t('mfClose'));
    el.querySelector('#mfFillBtn span').textContent = t('mfFill');
    el.querySelector('#mfAnywayBtn span').textContent = t('mfAnyway');
    const list = el.querySelector('#mfList');
    list.innerHTML = '';
    missing.slice(0, MAX).forEach((m, i) => {
      const chip = document.createElement('span');
      chip.className = 'mf-chip';
      chip.style.setProperty('--i', i);
      chip.textContent = m.label;
      list.appendChild(chip);
    });
    if (n > MAX) {
      const more = document.createElement('span');
      more.className = 'mf-chip mf-chip-more';
      more.style.setProperty('--i', MAX);
      more.textContent = tf('mfMore', { n: numL(n - MAX) });
      list.appendChild(more);
    }
    // Restart the entrance animations every time the modal opens.
    const card = el.querySelector('.mf-card');
    card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
    el._pending = resolve;
    el.classList.add('show');
    el.setAttribute('aria-hidden', 'false');
    document.addEventListener('keydown', el._onKey);
    setTimeout(() => { const b = el.querySelector('#mfFillBtn'); if (b) b.focus({ preventScroll: true }); }, 60);
  });
}
// Returns true when it's OK to go ahead with the download / print.
async function confirmMissingFields() {
  const missing = getMissingRequiredFields();
  if (!missing.length) return true;
  const choice = await askMissingFields(missing);
  if (choice === 'continue') return true;
  // "Go back": flag the empty fields, open their section and jump to the first one.
  missing.forEach(({ el }) => { el.dataset.touched = '1'; el.classList.add('field-missing'); });
  const first = missing[0].el;
  const group = first.closest('.group');
  if (group && !group.classList.contains('open')) {
    const title = group.querySelector(':scope > .group-title');
    if (title) title.click(); else group.classList.add('open');
  }
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 760 && !sidebar.classList.contains('open')) {
    const seg = document.querySelector('#fabToggle .fab-seg[data-mode="customize"]');
    if (seg) seg.click();
  }
  setTimeout(() => {
    first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    try { first.focus({ preventScroll: true }); } catch (e) { }
    first.classList.add('hint-shake');
    setTimeout(() => first.classList.remove('hint-shake'), 600);
  }, 380);
  return false;
}