const today = new Date().toISOString().slice(0, 10);
const state = {
  docType: "assignment",
  language: "en", // 'en' | 'bn' — see i18n.js
  studentName: "", studentId: "", roll: "", department: "", section: "", semester: "",
  courseTitle: "", courseCode: "", assignmentNo: "", assignmentTitle: "",
  byName: "", byId: "",
  dateSubmission: '',
  universityName: "", deptTitle: "",
  logoDataUrl: "",
  logoSource: "",
  autoPaletteMatch: false,
  template: "cards",
  palette: "navy",
  paperFont: "times",
  banglaFont: "adornoirrit",
  demoLoaded: false,
  customPalettes: [],
  needIndex: false,
  indexTitle: "",
  indexSubtitle: "",
  indexTemplate: "tabular",
  labEntries: [],
  pageLayout: "row",
  pageBg: "plain", // "plain" | "dotted" | "grid"
  groupName: "",
  hasGroupLeader: false,
  groupMembers: []
};
let labEntrySeq = 1;
let groupMemberSeq = 1;
const SAMPLE = {
  studentName: "Kasfiya Rab Bin Noor", studentId: "CS-E-247-..-....", roll: "48",
  department: "CSE", section: "E-247", semester: "4th",
  courseTitle: "Algorithms", courseCode: "0613-205", assignmentNo: "01",
  assignmentTitle: "Implementation of Heap Sort & Graph Operations",
  toName: "Paritosh Chandra Ray", toDesignation: "Lecturer",
  byName: "", byId: "", dateSubmission: '',
  universityName: "Dhaka International University", deptTitle: "Department of CSE"
};
const SAMPLE_LAB = { ...SAMPLE, assignmentNo: "01", assignmentTitle: "Determining the Refractive Index of a Prism" };

// Bengali samples (Bangla mode)
const SAMPLE_BN = {
  studentName: "কাসফিয়া রাব বিন নূর", studentId: "সিএসই-ই-২৪৭-..-....", roll: "৪৮",
  department: "কম্পিউটার বিজ্ঞান", section: "ই-২৪৭", semester: "৪র্থ",
  courseTitle: "ডেটা স্ট্রাকচার", courseCode: "০৬১৩-২০৫", assignmentNo: "০১",
  assignmentTitle: "হিপ সর্ট এবং গ্রাফ অপারেশনের বাস্তবায়ন",
  toName: "পরিতোষ চন্দ্র রয়", toDesignation: "লেকচারার",
  byName: "", byId: "", dateSubmission: '',
  universityName: "ঢাকা ইন্টারন্যাশনাল ইউনিভার্সিটি", deptTitle: "কম্পিউটার বিজ্ঞান বিভাগ"
};

const SAMPLE_LAB_BN = { 
  ...SAMPLE_BN, 
  assignmentNo: "০১", 
  assignmentTitle: "প্রিজমের প্রতিসরাঙ্ক নির্ণয় পরীক্ষা",
  courseTitle: "পদার্থবিজ্ঞান পরীক্ষাগার",
  courseCode: "০৬১০-১০১"
};
const SEED_STUDENTS = window.SEED_STUDENTS || {};
const TEMPLATES = [
  { id: "cards", name: "The Noir", note: "Corner Bars + Info Cards", maxMembers: 6 },
  { id: "emblem", name: "Crest", note: "Blue Swoosh Emblem Art", maxMembers: 5 },
  { id: "spring", name: "Aurum", note: "Geometric Academic Layout", maxMembers: 8 },
  { id: "dusk", name: "Evening Dusk", note: "Sunset Skyline Side Panel", maxMembers: 10 },
  { id: "circles", name: "Eclipse", note: "Bordered Box + Red Rings", maxMembers: 5 },
  { id: "brief", name: "Folio", note: "Ledgered Geometric Art", maxMembers: 5 },
  { id: "ledger", name: "Ledger", note: "Ruled Academic Field Sheet", maxMembers: 5 },
  { id: "sigil", name: "Sigil", note: "Watermarked & Framed", maxMembers: 6 },
  { id: "voltalic", name: "Voltaic", note: "Diagonal Shards", maxMembers: 6 },
  { id: "obliqua", name: "Obliqua", note: "Diagonal Sash Bands", maxMembers: 6 },
  { id: "banner", name: "Banner", note: "Frame + Round Bars", maxMembers: 6 },
  { id: "formal", name: "Chancery", note: "Centered Formal Classic", maxMembers: 5 },
  { id: "halo", name: "Halo", note: "Corner Arcs + Info Card", maxMembers: 8 },
  { id: "spectrum", name: "Spectrum", note: "Bar-Chart Skyline Minimal", maxMembers: 5 },
  { id: "brutalist", name: "Brutalist", note: "Giant Number + Watermark", maxMembers: 10 }
];
// Templates with no maxMembers entry have no hard cap on group members.
function getTemplateMaxMembers(templateId) {
  const t = TEMPLATES.find(t => t.id === (templateId || state.template));
  return (t && t.maxMembers) || Infinity;
}
const INDEX_TEMPLATES = [
  { id: "tabular", name: "Tabular Index", note: "Numbered table, ruled rows" },
  { id: "ruled", name: "Ruled List", note: "Minimal underline rows" },
  { id: "bordered", name: "Bordered Grid", note: "Boxed card per entry" },
  { id: "watermark", name: "Watermark", note: "Watermarked table" }
];
const PALETTES = [
  {
    id: "navy", name: "Navy Classic",   
    cardBar: "#1e5993", cardAccent: "#6b1d52", cardTint: "#ebf3f9", cardTintRow: "#a4c4df",
    embPrimary: "#273797", embSecondary: "#479dce"
  },
  {
    id: "maroon", name: "Maroon & Gold",
    cardBar: "#7a1f2b", cardAccent: "#8a5a1e", cardTint: "#f7ece7", cardTintRow: "#e3c6a9",
    embPrimary: "#7a1f2b", embSecondary: "#c99a57"
  },
  {
    id: "forest", name: "Forest Scholar",
    cardBar: "#1f6f4a", cardAccent: "#1f4e8c", cardTint: "#eaf5ef", cardTintRow: "#bfe3cf",
    embPrimary: "#1f6f4a", embSecondary: "#5cae79"
  },
  {
    id: "slate", name: "Slate Modern",
    cardBar: "#2b3a55", cardAccent: "#8a5a1e", cardTint: "#eef1f5", cardTintRow: "#c7d2e0",
    embPrimary: "#2b3a55", embSecondary: "#5c7a99"
  },
  {
    id: "crimson", name: "Crimson Formal",
    cardBar: "#7a1f2b", cardAccent: "#1f4e8c", cardTint: "#fbecee", cardTintRow: "#e3aab0",
    embPrimary: "#7a1f2b", embSecondary: "#b25868"
  },
  {
    id: "mono", name: "Monochrome",
    cardBar: "#1a1a1a", cardAccent: "#5b5b5b", cardTint: "#f2f2f2", cardTintRow: "#d9d9d9",
    embPrimary: "#1a1a1a", embSecondary: "#5b5b5b"
  },
  {
    id: "diu", name: "Verdant",
    cardBar: "#08783B", cardAccent: "#C62828", cardTint: "#EEF8F1", cardTintRow: "#BFE2CC",
    embPrimary: "#08783B", embSecondary: "#C62828"
  },
  {
    id: "amber", name: "Amber Glow",
    cardBar: "#EE8B2B", cardAccent: "#1F2937", cardTint: "#FEF3E6", cardTintRow: "#F8CF9E",
    embPrimary: "#EE8B2B", embSecondary: "#1F2937"
  },
  {
    id: "spring", name: "Spring",
    cardBar: "#D59B00", cardAccent: "#153C50", cardTint: "#F4F6F7", cardTintRow: "#E5BD55",
    embPrimary: "#D59B00", embSecondary: "#153C50"
  }
];
function getPalette() {
  return PALETTES.find(p => p.id === state.palette)
    || state.customPalettes.find(p => p.id === state.palette)
    || PALETTES[0];
}
function hexToRgba(hex, alpha) {
  const h = String(hex || '').replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(v, 16);
  if (Number.isNaN(n)) return `rgba(235,243,249,${alpha})`;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}
function shadeHex(hex, percent) {
  const h = String(hex || '').replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(v, 16);
  if (Number.isNaN(n)) return hex;
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = percent < 0 ? 0 : 255, p = Math.abs(percent) / 100;
  r = Math.round((t - r) * p) + r;
  g = Math.round((t - g) * p) + g;
  b = Math.round((t - b) * p) + b;
  return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function rgbTriple(hex) {
  const h = String(hex || '').replace('#', '');
  const v = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(v, 16);
  if (Number.isNaN(n)) return '235,243,249';
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
const FONTS = [
  { id: "times", label: "Times New Roman (Classic)", cssValue: "'Times New Roman', Times, serif", webFamily: null },
  { id: "georgia", label: "Georgia", cssValue: "Georgia, 'Times New Roman', serif", webFamily: null },
  { id: "cambria", label: "Cambria", cssValue: "Cambria, Georgia, serif", webFamily: null },
  { id: "garamond", label: "EB Garamond", cssValue: "'EB Garamond', Garamond, serif", webFamily: "EB Garamond" },
  { id: "merriweather", label: "Merriweather", cssValue: "'Merriweather', Georgia, serif", webFamily: "Merriweather" },
  { id: "lora", label: "Lora", cssValue: "'Lora', Georgia, serif", webFamily: "Lora" },
  { id: "playfair", label: "Playfair Display", cssValue: "'Playfair Display', Georgia, serif", webFamily: "Playfair Display" },
  { id: "ptserif", label: "PT Serif", cssValue: "'PT Serif', Georgia, serif", webFamily: "PT Serif" },
  { id: "inter", label: "Inter (Modern Sans)", cssValue: "'Inter', Arial, sans-serif", webFamily: "Inter" }
];
function getFont() { return FONTS.find(f => f.id === state.paperFont) || FONTS[0]; }
// Li Ador Noirrit runs visually small next to the Latin paper fonts, so in
// Bangla mode with that font every piece of text on the paper is drawn 1px
// larger. The Cards template is skipped on the cover: it already carries its own
// hand-tuned adornoirrit sizes in style.css (those include the +1).
//
// Each text-bearing element gets an explicit size (its computed size + 1px).
// All sizes are read BEFORE anything is changed, so nested elements that
// inherit a size can't compound to +2. The original inline value is kept in
// data-bn-bump so switching font/language (or re-running) restores it first.
function bumpBanglaFontSizes(root, opts = {}) {
  if (!root) return;
  root.querySelectorAll('[data-bn-bump]').forEach(el => {
    el.style.fontSize = el.dataset.bnBump === '-' ? '' : el.dataset.bnBump;
    delete el.dataset.bnBump;
  });
  if (state.language !== 'bn' || state.banglaFont !== 'adornoirrit') return;
  if (opts.skipCards && state.template === 'cards') return;
  // +1px everywhere, +2px on phones (max-width:760px).
  const bump = window.matchMedia('(max-width:760px)').matches ? 2 : 1;
  const targets = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(el) {
      if (el.closest('svg') || el.matches('i, [class*="fa-"], .bf-art-mono, script, style')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  for (let el = walker.nextNode(); el; el = walker.nextNode()) {
    const hasText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.nodeValue.trim());
    if (!hasText) continue;
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px) targets.push([el, px]);
  }
  targets.forEach(([el, px]) => {
    el.dataset.bnBump = el.style.fontSize || '-';
    el.style.fontSize = (px + bump) + 'px';
  });
}
function applyPaperFont() {
  const paper = document.getElementById('paper');
  const fontCss = currentPaperFontCss();
  if (paper) paper.style.setProperty('--paper-font', fontCss);
  const isBn = state.language === 'bn';
  if (paper) paper.classList.toggle('is-bangla', isBn);
  if (paper) paper.dataset.bnFont = state.banglaFont;
  document.querySelectorAll('[id^="paperIndex"]').forEach(el => {
    el.style.setProperty('--paper-font', fontCss);
    el.classList.toggle('is-bangla', isBn);
    el.dataset.bnFont = state.banglaFont;
  });
  bumpBanglaFontSizes(paper, { skipCards: true });
  document.querySelectorAll('[id^="paperIndex"]').forEach(el => bumpBanglaFontSizes(el));
  if (typeof fitCirclesGroupLayout === 'function') fitCirclesGroupLayout();
}
// Re-run the Bangla bump (and index pagination) when crossing the phone breakpoint.
if (window.matchMedia) {
  const __mq = window.matchMedia('(max-width:760px)');
  const __onMq = () => { if (typeof render === 'function' && typeof state !== 'undefined' && state.language === 'bn') render(); };
  if (__mq.addEventListener) __mq.addEventListener('change', __onMq); else if (__mq.addListener) __mq.addListener(__onMq);
}
function loadPaperFont(font) {
  if (!document.fonts || !font || !font.webFamily) return;
  [400, 700].forEach(w => {
    document.fonts.load(`${w} 18px "${font.webFamily}"`).then(faces => {
      if (!faces || !faces.length) console.warn(`[fonts] "${font.webFamily}" ${w} did not load (check the @font-face url / file path)`);
    }).catch(err => console.warn(`[fonts] "${font.webFamily}" ${w} failed:`, err));
  });
}
// Only the selected font is fetched up front; the rest load when chosen
// (the dropdown was previously triggering ~30 font requests on every visit).
// Bangla mode overrides the visible font with the chosen BANGLA_FONTS entry
// (see i18n.js / state.banglaFont), so
// fetch that one too whenever we're booting straight into Bangla.
function preloadFonts() {
  loadPaperFont(getFont());
  if (state.language === 'bn') loadPaperFont(getBanglaFont());
}
const CUSTOM_PAL_KEY = "coverworks.customPalettes";
function loadCustomPalettes() {
  try {
    const raw = localStorage.getItem(CUSTOM_PAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const isHex = v => /^#[0-9a-fA-F]{3,8}$/.test(String(v || ''));
    // Ignore anything that isn't a well-formed palette (corrupted or hand-edited storage).
    state.customPalettes = Array.isArray(parsed)
      ? parsed.filter(p => p && typeof p.id === 'string' && typeof p.name === 'string'
          && isHex(p.cardBar) && isHex(p.cardAccent) && isHex(p.cardTint) && isHex(p.cardTintRow)
          && isHex(p.embPrimary) && isHex(p.embSecondary))
      : [];
  } catch (err) {
    console.warn("Could not load custom palettes:", err);
    state.customPalettes = [];
  }
}
function persistCustomPalettes() {
  try { localStorage.setItem(CUSTOM_PAL_KEY, JSON.stringify(state.customPalettes)); }
  catch (err) { console.warn("Could not save custom palettes:", err); }
}
// Every field is {en, bn} so getDocType() can hand back plain strings in
// whichever language state.language is currently set to — callers don't
// need to know i18n exists. bn values marked DRAFT want a native-speaker
// pass (word/groupTitle/noLabel are the ones that actually show up).
const DOC_TYPES = {
  assignment: {
    word: { en: "Assignment", bn: "অ্যাসাইনমেন্ট" },
    groupTitle: { en: "Assignment Information", bn: "অ্যাসাইনমেন্টের তথ্য" }, // DRAFT
    noLabel: { en: "Assignment No.", bn: "অ্যাসাইনমেন্ট নং" }, // DRAFT
    noPlaceholder: { en: "Enter number", bn: "নম্বর লিখুন" }, // DRAFT
    titleLabel: { en: "Assignment / Topic Title", bn: "অ্যাসাইনমেন্ট/বিষয়ের শিরোনাম" }, // DRAFT
    titlePlaceholder: { en: "Enter your assignment or topic title", bn: "আপনার অ্যাসাইনমেন্ট বা বিষয়ের শিরোনাম লিখুন" } // DRAFT
  },
  lab: {
    word: { en: "Lab Report", bn: "ল্যাব রিপোর্ট" },
    groupTitle: { en: "Lab Report Information", bn: "ল্যাব রিপোর্ট এর তথ্য" }, // DRAFT
    noLabel: { en: "Lab Report No. / Sub-title", bn: "ল্যাব রিপোর্ট নং / উপ-শিরোনাম" }, // DRAFT
    noPlaceholder: { en: "Enter number", bn: "নম্বর লিখুন" }, // DRAFT
    titleLabel: { en: "Lab Report Name / Title", bn: "ল্যাব রিপোর্টের নাম/শিরোনাম" }, // DRAFT
    titlePlaceholder: { en: "Enter your lab report name or title", bn: "আপনার ল্যাব রিপোর্টের নাম বা শিরোনাম লিখুন" } // DRAFT
  },
  group: {
    word: { en: "Group Assignment", bn: "গ্রুপ অ্যাসাইনমেন্ট" },
    groupTitle: { en: "Group Assignment Information", bn: "গ্রুপ অ্যাসাইনমেন্টের তথ্য" }, // DRAFT
    noLabel: { en: "Assignment No.", bn: "অ্যাসাইনমেন্ট নং" }, // DRAFT
    noPlaceholder: { en: "Enter number", bn: "নম্বর লিখুন" }, // DRAFT
    titleLabel: { en: "Assignment / Topic Title", bn: "অ্যাসাইনমেন্ট/বিষয়ের শিরোনাম" }, // DRAFT
    titlePlaceholder: { en: "Enter your assignment or topic title", bn: "আপনার অ্যাসাইনমেন্ট বা বিষয়ের শিরোনাম লিখুন" } // DRAFT
  }
};
function getDocType() {
  const raw = DOC_TYPES[state.docType] || DOC_TYPES.assignment;
  const lang = (state.language === 'bn') ? 'bn' : 'en';
  const out = {};
  Object.keys(raw).forEach(k => { out[k] = raw[k][lang] || raw[k].en; });
  return out;
}