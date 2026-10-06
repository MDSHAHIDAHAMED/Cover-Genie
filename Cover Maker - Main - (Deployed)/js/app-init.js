function applyDocTypeCopy() {
  const dt = getDocType();
  document.getElementById('docInfoGroupTitle').textContent = dt.groupTitle;
  document.querySelector('#docNoLabel .lbl-text').textContent = dt.noLabel;
  document.getElementById('docNoInput').placeholder = dt.noPlaceholder;
  document.querySelector('#docTitleLabel .lbl-text').textContent = dt.titleLabel;
  document.getElementById('docTitleInput').placeholder = dt.titlePlaceholder;
}

function setupDocType() {
  const sel = document.getElementById('docTypeSelect');
  sel.value = state.docType;
  applyDocTypeCopy();
  sel.addEventListener('change', () => {
    const nextType = sel.value;
    const prevType = state.docType;

    showLoader("Switching document type…");
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      state.docType = nextType;
      resetDocTypeFields(prevType, nextType);
      if (state.demoLoaded) {
        const isBangla = state.language === 'bn';
        const demo = state.docType === 'lab' 
          ? (isBangla ? SAMPLE_LAB_BN : SAMPLE_LAB)
          : (isBangla ? SAMPLE_BN : SAMPLE);
        state.assignmentNo = demo.assignmentNo;
        state.assignmentTitle = demo.assignmentTitle;
      }
      applyDocTypeCopy();
      syncInputs();
      toggleIndexUI();
      toggleGroupUI();
      render();
      hideLoader();
    }, 450);
  });
}

// Keeps the docType <select>'s option text (and its custom-dropdown display)
// in sync with the current language, since those are set once as static
// HTML/JS at setup time rather than re-read from getDocType() on every render.
function syncDocTypeSelectLabels() {
  const sel = document.getElementById('docTypeSelect');
  if (!sel) return;
  const lang = (state.language === 'bn') ? 'bn' : 'en';
  Array.from(sel.options).forEach(opt => {
    const entry = DOC_TYPES[opt.value];
    if (entry && entry.word) opt.textContent = entry.word[lang] || entry.word.en;
  });
  if (typeof sel.__cselSyncLabels === 'function') sel.__cselSyncLabels();
}

function setupLanguageToggle() {
  const ctl = document.getElementById('langCtl');
  if (!ctl) return;
  function reflect() {
    ctl.querySelectorAll('button[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === state.language);
    });
    document.documentElement.lang = state.language === 'bn' ? 'bn' : 'en';
    // Add is-bangla class to sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('is-bangla', state.language === 'bn');
    }
  }
  ctl.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.language === btn.dataset.lang) return;
      state.language = btn.dataset.lang;
      // Wipe every user-entered field on a language switch (see resetAllFields
      // in sidebar.js for why) before anything else re-renders off the new
      // language, so nothing briefly flashes stale-language content.
      if (typeof resetAllFields === 'function') resetAllFields();
      if (state.language === 'bn') loadPaperFont(getBanglaFont());
      reflect();
      syncDocTypeSelectLabels();
      if (typeof applyStaticI18n === 'function') applyStaticI18n();
      if (typeof syncFontSelectForLanguage === 'function') syncFontSelectForLanguage();
      applyDocTypeCopy();
      // Re-label the custom date pickers (month/weekday names, digits, placeholder).
      document.dispatchEvent(new Event('cg:langchange'));
      // downloadSummary's text is built from t() at call time (not a static
      // data-i18n node, since it also carries the needIndex-dependent
      // "both files" copy) — applyStaticI18n() above never touches it, so
      // rebuild it explicitly or it stays in the previous language.
      if (typeof toggleIndexDetails === 'function') toggleIndexDetails();
      render();
      if (typeof persistState === 'function') persistState();
    });
  });
  reflect();
}

// NOTE: sidebar label translation used to live here as a hardcoded key→text
// map keyed by data-bind name. It's been superseded by the generic
// data-i18n / data-i18n-placeholder / data-i18n-title system (see i18n.js's
// applyStaticI18n() and the STRINGS entries it reads from) — every sidebar
// label, placeholder, button, hint, and group title now carries its own
// data-i18n attribute directly in covermaker.html, translated in one pass by
// applyStaticI18n(). This covers the fields the old map handled (name, ID,
// roll, department, section, semester, course title/code, teacher's name,
// designation, deptTitle, group name) plus everything the old map left
// untranslated (group titles, descriptions, hints, buttons, checkboxes…).
// Doc-type-dependent labels (Assignment No. vs Lab Report No. / Sub-title,
// etc.) are still handled separately by applyDocTypeCopy() via getDocType(),
// same as before — applyStaticI18n() does not touch #docNoLabel/#docTitleLabel.

function applyLandingHandoff() {
  const params = new URLSearchParams(window.location.search);
  let data = null;

  if (params.has('docType') || params.has('universityName') || params.has('studentName') || params.has('courseTitle')) {
    data = {
      docType: params.get('docType') || '',
      university: params.get('universityName') || '',
      studentName: params.get('studentName') || '',
      courseTitle: params.get('courseTitle') || '',
      autoPaletteMatch: params.get('autoPaletteMatch') === '1'
    };
  } else {
    try {
      const saved = localStorage.getItem('coverGenieLanding');
      if (saved) {
        const parsed = JSON.parse(saved);
        data = {
          docType: parsed.docType || '',
          university: parsed.university || '',
          studentName: parsed.studentName || '',
          courseTitle: parsed.courseTitle || '',
          autoPaletteMatch: !!parsed.autoPaletteMatch
        };
      }
    } catch (e) {
      data = null;
    }
  }

  // The landing handoff is one-shot: clear it as soon as it has been read so it
  // can never re-populate the form on a later visit (shared lab / cafe PCs).
  try { localStorage.removeItem('coverGenieLanding'); } catch (e) { }

  if (!data) return null;

  if (data.docType === 'lab' || data.docType === 'assignment' || data.docType === 'group') {
    state.docType = data.docType;
    const docTypeSel = document.getElementById('docTypeSelect');
    if (docTypeSel) docTypeSel.value = data.docType;
  }
  if (data.university) state.universityName = data.university;
  if (data.studentName) state.studentName = data.studentName;
  if (data.courseTitle) state.courseTitle = data.courseTitle;
  if (data.autoPaletteMatch) state.autoPaletteMatch = true;

  // Drop the handoff params so a refresh doesn't keep re-applying stale values.
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  return data;
}

function init() {
  try { if (typeof restoreSaved === 'function') restoreSaved(); } catch (e) { console.warn('Could not restore saved data:', e); }
  const landingData = applyLandingHandoff();
  setupCustomSelects();       
  setupCustomDateInputs();    
  syncInputs();               
  bindInputs();               
  buildTemplatePicker();      
  buildIndexTemplatePicker(); 
  setupIndexControls();       
  loadCustomPalettes();       
  buildPalettes();            
  setupCustomPaletteForm();   
  setupLogo();                
  setupLogoPaletteMatch();    
  // A saved logo from a *previous* session is about to be replaced below if
  // the landing page handed off a university — so suppress auto-palette-match
  // while restoring it, or it fires once against a logo that's immediately
  // discarded, then again against the real one (visible as a palette that
  // "matches, then reverts"). Restore the preference right after and run the
  // match exactly once, against whichever logo actually ends up set.
  const landingWillOverrideLogo = !!(landingData && landingData.university);
  const autoMatchPref = state.autoPaletteMatch;
  if (landingWillOverrideLogo) state.autoPaletteMatch = false;
  try { if (typeof applySavedLogo === 'function') applySavedLogo(); } catch (e) { console.warn('Could not restore saved logo:', e); }
  if (landingWillOverrideLogo) {
    state.autoPaletteMatch = autoMatchPref;
    if (typeof autoMatchUniversityLogo === 'function') autoMatchUniversityLogo(landingData.university);
    // autoMatchUniversityLogo() only runs the match itself when the logo
    // actually changes — if the restored logo already matched the landing
    // university, it's a no-op, so trigger the match once here as well.
    if (typeof maybeAutoMatchPalette === 'function') maybeAutoMatchPalette();
  }
  setupLookup();              
  setupGroupControls();       
  setupDocType();
  syncDocTypeSelectLabels();
  setupLanguageToggle();
  if (typeof applyStaticI18n === 'function') applyStaticI18n();
  toggleGroupUI();
  setupFontSelect();          
  setupZoom();                
  setupPageLayoutToggle();    
  setupExport();              
  setupDrawer();              
  setupRequiredFieldHints();  
  setupLegalModal();          
  preloadFonts();             

  setupSidebarAccordion();    

  render();

  const bootLines = [
    'Summoning your cover page…',
    'Polishing the ink…',
    'Warming up the press…',
    'Almost ready for you…'
  ];
  let bootIdx = 0;
  const bootCycle = setInterval(() => {
    bootIdx = (bootIdx + 1) % bootLines.length;
    const el = document.getElementById('appLoaderText');
    if (el) el.textContent = bootLines[bootIdx];
  }, 750);

  // Hide the boot loader once fonts are ready (never before a short minimum so it
  // doesn't flash, and never later than a hard cap on slow connections).
  const bootStart = Date.now();
  const BOOT_MIN_MS = 900, BOOT_MAX_MS = 3200;
  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, BOOT_MAX_MS))]).then(() => {
    const wait = Math.max(0, BOOT_MIN_MS - (Date.now() - bootStart));
    setTimeout(() => {
      clearInterval(bootCycle);
      hideLoader();
    }, wait);
  });

  // Index pagination is measured with whatever fonts are loaded at the time, so
  // re-measure once web fonts finish arriving.
  if (document.fonts && document.fonts.addEventListener) {
    let fontRepaginate = null;
    document.fonts.addEventListener('loadingdone', () => {
      clearTimeout(fontRepaginate);
      fontRepaginate = setTimeout(() => {
        if (typeof hasIndexPage === 'function' && hasIndexPage()) refreshIndexPreview();
        if (typeof fitCirclesGroupLayout === 'function') fitCirclesGroupLayout();
      }, 120);
    });
  }
}

// Never leave the boot loader stuck: if anything in init() throws, report it and reveal the app.
// Let the browser paint the loader (and start its CSS animation) BEFORE the
// heavy synchronous init() work blocks the main thread.
function startApp() {
  try {
    init();
  } catch (err) {
    console.error('Cover Genie failed to start:', err);
    hideLoader();
  }
}
requestAnimationFrame(() => setTimeout(startApp, 0));

if (document.fonts) {
  ['600 16px "Space Grotesk"', '16px "Inter"', '16px "JetBrains Mono"']
    .forEach(f => document.fonts.load(f).catch(() => { }));
}