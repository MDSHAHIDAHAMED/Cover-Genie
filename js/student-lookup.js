function readStore() {
  try { return JSON.parse(localStorage.getItem('coverworks_students') || '{}'); }
  catch (e) { return {}; }
}
function writeStore(obj) {
  try { localStorage.setItem('coverworks_students', JSON.stringify(obj)); } catch (e) { }
}
function normalizeKey(val) {
  return (val || '').toString().trim().toUpperCase().replace(/[-\s]+/g, '');
}
function normalizeRoll(val) {
  const norm = normalizeKey(val);
  return /^\d+$/.test(norm) ? norm.replace(/^0+(?=\d)/, '') : norm;
}
// Seeded students live in an encrypted vault (seeded.js). A record is only
// decrypted when the visitor types that student's full ID, so nothing can be listed.
const UNLOCKED = new Map();
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function unlockSeed(rawId) {
  const nk = normalizeKey(rawId);
  const V = window.SEED_VAULT;
  if (!V || nk.length < 8 || !window.crypto || !crypto.subtle) return [];
  if (UNLOCKED.has(nk)) return UNLOCKED.get(nk);
  let out = [];
  try {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(nk), 'PBKDF2', false, ['deriveBits']);
    const bits = new Uint8Array(await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: b64(V.salt), iterations: V.iter, hash: 'SHA-256' }, base, 384));
    const tag = Array.from(bits.slice(0, 16), b => b.toString(16).padStart(2, '0')).join('');
    const blob = V.rec[tag];
    if (blob) {
      const raw = b64(blob);
      const key = await crypto.subtle.importKey('raw', bits.slice(16, 48), 'AES-GCM', false, ['decrypt']);
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, key, raw.slice(12));
      out = JSON.parse(new TextDecoder().decode(pt)).map(r => ({ id: r.id, data: r.data, seeded: true }));
    }
  } catch (e) { out = []; }
  UNLOCKED.set(nk, out);
  return out;
}
// ---- Class vault: a whole class unlocks when university + department + batch are filled in ----
const CLASS_ENTRIES = [];
let classSigDone = '', classTimer = null;
function classCandidates() {
  const u = Array.from(universityIdentity(state.universityName));
  const abbr = universityAbbreviation(state.universityName);
  if (abbr) u.push('abbr:' + abbr);
  const d = Array.from(deptIdentity(state.department));
  const b = batchKey(state.section);
  const out = [];
  if (!b) return out;
  u.forEach(x => d.forEach(y => out.push(x + '|' + y + '|' + b)));
  return out;
}
async function unlockClass() {
  const V = window.SEED_CLASSES;
  const cands = classCandidates();
  const sig = cands.join('##');
  if (!V || !sig || sig === classSigDone || !window.crypto || !crypto.subtle) return false;
  classSigDone = sig;
  let added = false;
  for (const c of cands) {
    try {
      const base = await crypto.subtle.importKey('raw', new TextEncoder().encode('class:' + c), 'PBKDF2', false, ['deriveBits']);
      const bits = new Uint8Array(await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: b64(V.salt), iterations: V.iter, hash: 'SHA-256' }, base, 384));
      const tag = Array.from(bits.slice(0, 16), b => b.toString(16).padStart(2, '0')).join('');
      const blob = V.rec[tag];
      if (!blob) continue;
      const raw = b64(blob);
      const key = await crypto.subtle.importKey('raw', bits.slice(16, 48), 'AES-GCM', false, ['decrypt']);
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, key, raw.slice(12));
      JSON.parse(new TextDecoder().decode(pt)).forEach(r => {
        const k = seedDedupeKey(r.id, r.data);
        if (!CLASS_ENTRIES.some(e => e.k === k)) { CLASS_ENTRIES.push({ k, id: r.id, data: r.data }); added = true; }
      });
      break;
    } catch (e) { /* wrong key for this combination */ }
  }
  return added;
}
let activeSuggestRefresh = null;
// Bumped every time a suggestion is picked. Lets a pending kickClassUnlock
// timer (below) notice that the field it was scheduled for has since been
// resolved by a real selection, so it can skip reopening a panel that was
// deliberately just closed.
let suggestPickGen = 0;
// Called (debounced) whenever the group pool is read; reopens the list once the class unlocks.
function kickClassUnlock() {
  if (!window.SEED_CLASSES) return;
  const refreshFn = activeSuggestRefresh;
  const genAtCall = suggestPickGen;
  clearTimeout(classTimer);
  classTimer = setTimeout(async () => {
    if (await unlockClass()) {
      if (typeof updateGroupSuggestHint === 'function') updateGroupSuggestHint();
      // Skip if the user picked a suggestion (in this or another field) since
      // this timer was scheduled - reopening now would resurrect a panel the
      // user already closed by making a choice.
      if (refreshFn && suggestPickGen === genAtCall) refreshFn();
    }
  }, 400);
}
function seedDedupeKey(id, data) {
  return normalizeKey(id) + '|' + uniKey(data.universityName) + '|' + batchKey(data.section);
}
function seedEntries() {
  const seen = new Set(), out = [];
  Array.from(UNLOCKED.values()).flat().concat(CLASS_ENTRIES.map(e => ({ id: e.id, data: e.data, seeded: true })))
    .forEach(e => { const k = seedDedupeKey(e.id, e.data); if (!seen.has(k)) { seen.add(k); out.push(e); } });
  return out;
}
function localEntries() {
  const store = readStore();
  const out = [];
  for (const key in store) {
    const data = store[key];
    if (data && typeof data === 'object') out.push({ id: data.regId || key, data, storeKey: key });
  }
  return out;
}
function sameOrBothEmpty(a, b, same) {
  const ea = !String(a || '').trim(), eb = !String(b || '').trim();
  if (ea || eb) return ea && eb;
  return same(a, b);
}
function sameRecordIdentity(x, y) {
  return normalizeKey(x.id) === normalizeKey(y.id)
    && sameOrBothEmpty(x.data.universityName, y.data.universityName, universitiesMatch)
    && sameOrBothEmpty(x.data.department, y.data.department,
      (p, q) => identitiesOverlap(deptIdentity(p), deptIdentity(q)))
    && batchKey(x.data.section) === batchKey(y.data.section);
}
// Seeded entries first; a local entry that is the very same record as a seeded one
// (same ID + university + department + batch) is a stale copy and is dropped.
function allStudentEntries() {
  const seeds = seedEntries();
  const locals = localEntries().filter(l => !seeds.some(sd => sameRecordIdentity(sd, l)));
  return seeds.concat(locals);
}
function findStudentRecord(query, batch, university, department) {
  const normQuery = normalizeKey(query);
  if (!normQuery) return null;
  const wantBatch = batchKey(batch);
  const wantUni = (university || '').trim();
  const wantDept = (department || '').trim();
  // University is a hard filter, not just a scoring nudge: without it, an ID/roll
  // (which can repeat across institutions) would surface a record from any
  // seeded or saved university, not just the caller's own.
  const hits = allStudentEntries().filter(e => normalizeKey(e.id) === normQuery
    && (!wantBatch || batchKey(e.data.section) === wantBatch)
    && (!wantUni || universitiesMatch(wantUni, e.data.universityName))
    && (!wantDept || identitiesOverlap(deptIdentity(wantDept), deptIdentity(e.data.department))));
  if (!hits.length) return null;
  const score = e => {
    let n = 0;
    if ((state.universityName || '').trim() && universitiesMatch(state.universityName, e.data.universityName)) n += 4;
    if ((state.department || '').trim() && identitiesOverlap(deptIdentity(state.department), deptIdentity(e.data.department))) n += 2;
    if (batchKey(state.section) && batchKey(state.section) === batchKey(e.data.section)) n += 1;
    return n;
  };
  let best = hits[0];
  hits.forEach(e => { if (score(e) > score(best)) best = e; });
  return { id: best.id, data: best.data, count: hits.length, hits };
}
const STUDENT_RECORD_FIELDS = ['studentName', 'roll', 'department', 'section', 'semester', 'universityName'];
// Clears everything a previous fetch (or manual entry) put into the student
// fields, so a new fetch can never inherit a leftover semester, roll, section,
// "Submitted by" name or dept title from the last student.
function resetStudentRecordFields() {
  STUDENT_RECORD_FIELDS.forEach(key => { state[key] = ''; });
  state.studentId = '';
  state.byName = '';
  state.byId = '';
  state.deptTitle = '';
  state._byNameTouched = false;
  state._byIdTouched = false;
  state._deptTitleTouched = false;
}
function applyStudentRecord(id, data) {
  resetStudentRecordFields();
  STUDENT_RECORD_FIELDS.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(data, key)) state[key] = data[key];
  });
  state.studentId = id;
  state.byName = data.studentName || '';
  state.byId = id;
  state.deptTitle = deriveDeptTitle(data.department);
  refreshAutoLogo();
}
// A logo that was auto-picked for the previous university must not linger if
// the new one has none. A logo the user chose or uploaded themselves is kept.
function refreshAutoLogo() {
  if (state.logoAutoMatched && typeof findLogoKeyForUniversity === 'function'
    && !findLogoKeyForUniversity(state.universityName)) {
    const clearBtn = document.getElementById('logoClear');
    if (clearBtn) clearBtn.click();
  }
  if (typeof autoMatchUniversityLogo === 'function') autoMatchUniversityLogo(state.universityName);
}
function setupLookup() {
  const hint = document.getElementById('lookupHint');
  document.getElementById('lookupBtn').addEventListener('click', () => {
    const idVal = document.getElementById('lookupId').value.trim();
    const batchEl = document.getElementById('lookupBatch');
    const batchVal = batchEl ? batchEl.value.trim() : '';
    const uniEl = document.getElementById('lookupUniversity');
    const uniVal = uniEl ? uniEl.value.trim() : '';
    const deptEl = document.getElementById('lookupDepartment');
    const deptVal = deptEl ? deptEl.value.trim() : '';
    // Only the ID is required. University, department and batch are optional
    // filters and are filled in from the saved record on a match. The exception
    // is a bare number: roll numbers repeat across universities and batches, so
    // a roll lookup needs the university to know whose "13" it is.
    if (!idVal) {
      hint.textContent = 'Enter a Registration ID to look up.';
      hint.className = 'hint warn';
      return;
    }
    if (/^\d+$/.test(idVal) && !uniVal) {
      hint.textContent = 'Roll numbers repeat across universities \u2014 add your university to look up by roll, or use your full Registration ID.';
      hint.className = 'hint warn';
      return;
    }
    showLoader({
      icon: 'fa-solid fa-magnifying-glass',
      title: 'Searching the archives',
      text: 'Matching your ID\u2026',
      mode: 'fetch'
    });
    setTimeout(async () => {
      await unlockSeed(idVal);
      const found = findStudentRecord(idVal, batchVal, uniVal, deptVal);
      // Same ID in several records and nothing entered to tell them apart:
      // ask instead of guessing the wrong student.
      const uniqueOf = (key) => new Set((found ? found.hits : []).map(e => String(key(e.data) || '').trim().toLowerCase())).size;
      const needMore = [];
      if (found && found.count > 1) {
        if (!uniVal && uniqueOf(d => uniKey(d.universityName)) > 1) needMore.push('university');
        if (!deptVal && uniqueOf(d => d.department) > 1) needMore.push('department');
        if (!batchVal && uniqueOf(d => batchKey(d.section)) > 1) needMore.push('batch');
      }
      if (found && needMore.length) {
        hint.textContent = `${found.count} saved records share this ID \u2014 add your ${needMore.join(' or ')} to pick the right one.`;
        hint.className = 'hint warn';
      } else if (found) {
        applyStudentRecord(found.id, found.data);
        syncInputs();
        render();
        document.getElementById('lookupId').value = found.id;
        if (batchEl) batchEl.value = found.data.section || batchVal;
        if (deptEl && found.data.department) deptEl.value = found.data.department;
        if (uniEl && found.data.universityName) uniEl.value = found.data.universityName;
        hint.textContent = `Matched saved record for ${found.data.studentName} (${found.id}).` +
          (found.count > 1 ? ` ${found.count} records share this ID \u2014 showing the one closest to the university, department and batch filled in.` : '');
        hint.className = 'hint ok';
      } else {
        // Nothing matched: wipe everything the previous fetch (or manual typing)
        // left in the student fields, then carry over only what was typed above.
        resetStudentRecordFields();
        if (uniVal) state.universityName = uniVal;
        if (batchVal) state.section = batchVal;
        if (deptVal) {
          state.department = deptVal;
          state.deptTitle = deriveDeptTitle(deptVal);
        }
        // A purely numeric entry is far more likely a roll number than a
        // Reg ID, so route it to the field it actually matches below.
        if (/^\d+$/.test(idVal)) {
          state.roll = idVal;
        } else {
          state.studentId = idVal;
          state.byId = idVal;
        }
        refreshAutoLogo();
        syncInputs();
        render();
        hint.textContent = `No saved record for that ID${uniVal ? ` at "${uniVal}"` : ''}${batchVal ? ` in batch "${batchVal}"` : ''}. Carried those details down below, fill in the rest then you may \u201cSave this student\u201d.`;
        hint.className = 'hint warn';
      }
      hideLoader();
    }, 600);
  });
  const saveHint = document.getElementById('saveHint');
  document.getElementById('saveRecordBtn').addEventListener('click', () => {
    if (!state.studentId) {
      if (saveHint) { saveHint.textContent = 'Add a Student / Reg ID first, then save.'; saveHint.className = 'hint warn'; }
      return;
    }
    const regId = state.studentId.trim().toUpperCase();
    const fields = {
      studentName: state.studentName, roll: state.roll, department: state.department,
      section: state.section, semester: state.semester, universityName: state.universityName
    };
    const candidate = { id: regId, data: fields };
    const dupSeed = seedEntries().find(e => sameRecordIdentity(e, candidate));
    const dupLocal = localEntries().find(e => sameRecordIdentity(e, candidate));
    if (dupSeed || dupLocal) {
      if (saveHint) {
        saveHint.textContent = dupSeed
          ? `A seeded record already exists for ${dupSeed.id} with this university, department and batch — not saving over it.`
          : `You already saved a record for ${dupLocal.id} with this university, department and batch — not overwriting it.`;
        saveHint.className = 'hint warn';
      }
      return;
    }
    const sameIdElsewhere = allStudentEntries().some(e => normalizeKey(e.id) === normalizeKey(regId))
      || localEntries().some(e => normalizeKey(e.id) === normalizeKey(regId));
    const store = readStore();
    let key = regId, n = 2;
    while (Object.prototype.hasOwnProperty.call(store, key)) key = `${regId}#${n++}`;
    store[key] = Object.assign({}, fields, { regId });
    writeStore(store);
    if (saveHint) {
      saveHint.textContent = sameIdElsewhere
        ? 'Saved successfully. Fetch this ID/roll anytime on this device. (Stored locally in your browser)'
        : `Saved successfully. Fetch this ID/roll anytime on this device. (Stored locally in your browser)`;
      saveHint.className = 'hint ok';
    }
  });
  document.getElementById('sampleBtn').addEventListener('click', () => {
    // Show the loader first, then fill in the demo data once it is on screen.
    showLoader({
      icon: 'fa-solid fa-pen-ruler',
      title: 'Painting your cover',
      text: 'Loading demo\u2026',
      mode: 'render'
    });
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      const isBangla = state.language === 'bn';
      const demo = state.docType === 'lab' 
        ? (isBangla ? SAMPLE_LAB_BN : SAMPLE_LAB)
        : (isBangla ? SAMPLE_BN : SAMPLE);
      Object.assign(state, demo);
      state.docType = document.getElementById('docTypeSelect').value;
      state.demoLoaded = true;
      state._byNameTouched = false; state._byIdTouched = false; state._deptTitleTouched = false;
      syncInputs();
      applyDocTypeCopy();
      render();
      saveHint.textContent = `Demo ${getDocType().word.toLowerCase()} loaded \u2014 replace it with your own details.`;
      saveHint.className = 'hint demo';
      hideLoader();
    }, 600);
  });
  attachStudentSuggest(document.getElementById('lookupUniversity'), {
    staticList: UNIVERSITIES, minChars: 1, max: 4
  });
  attachStudentSuggest(document.getElementById('lookupDepartment'), {
    staticList: DEPARTMENTS, minChars: 1, max: 4
  });
  // The lookup Batch field, like lookupId above, intentionally has NO autosuggest:
  // this panel only ever appears for an individual (Assignment/Lab) doc — see
  // toggleGroupUI — where the person typing is identifying themselves, not
  // browsing a class roster. Showing a dropdown of other students' batches as
  // soon as a few characters are typed would leak which batches exist in the
  // saved roster to someone who hasn't proven they belong to it. Matching still
  // works via the "Fetch" button, which requires the full ID/roll.
  setupManualAutofill();
  setupStudentSuggestions();
}
function sortByRelevance(items, norm, getKey) {
  items.sort((a, b) => {
    const ka = getKey(a), kb = getKey(b);
    const scoreOf = (k) => k === norm ? 0 : k.startsWith(norm) ? 1 : 2;
    const sa = scoreOf(ka), sb = scoreOf(kb);
    if (sa !== sb) return sa - sb;
    if (ka.length !== kb.length) return ka.length - kb.length;
    return ka.localeCompare(kb);
  });
  return items;
}
const UNIVERSITY_SCOPE_MIN_CHARS = 3;
// A deliberately hard gate on the browse-style (partial, substring) lookups below.
// There's no backend here to enforce real access control, so the only client-side
// lever available is to never hand back matches from the whole seeded/saved
// roster until the caller has committed to a specific university — that keeps a
// blank or single-character query from paging through everyone's name/ID.
// It's a UX speed bump, not a security boundary: the underlying data still ships
// to the browser (see the note in seeded.js), so treat this as reducing casual
// enumeration, not preventing a determined scrape.
function universityScopeMatches(typedUniversity, recordUniversity) {
  const typed = String(typedUniversity || '').trim();
  if (typed.length < UNIVERSITY_SCOPE_MIN_CHARS) return false;
  return universitiesMatch(typed, recordUniversity);
}
function matchStudentsByIdOrRoll(query, max, uniScope) {
  const normQuery = normalizeKey(query);
  if (!normQuery) return [];
  const idHits = [];
  allStudentEntries().forEach(e => {
    if (!universityScopeMatches(uniScope, e.data.universityName)) return;
    const normId = normalizeKey(e.id);
    if (normId.includes(normQuery)) idHits.push({ id: e.id, data: e.data, normId });
  });
  sortByRelevance(idHits, normQuery, h => h.normId);
  return idHits.slice(0, max).map(h => ({ id: h.id, data: h.data }));
}
function matchStudentsByRoll(query, max) {
  const normRollQuery = normalizeRoll(query);
  if (!normRollQuery) return [];
  const exact = [], prefix = [];
  allStudentEntries().forEach(e => {
    if (!e.data.roll) return;
    const nr = normalizeRoll(e.data.roll);
    if (nr === normRollQuery) exact.push({ id: e.id, data: e.data, normId: nr });
    else if (nr.startsWith(normRollQuery)) prefix.push({ id: e.id, data: e.data, normId: nr });
  });
  sortByRelevance(prefix, normRollQuery, h => h.normId);
  return exact.concat(prefix).slice(0, max).map(h => ({ id: h.id, data: h.data }));
}
function matchStudentsByName(query, max, uniScope) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out = [];
  const seen = new Set();
  allStudentEntries().forEach(e => {
    const rec = e.data;
    if (!universityScopeMatches(uniScope, rec.universityName)) return;
    if (!rec.studentName || !rec.studentName.toLowerCase().includes(q)) return;
    const nameKey = rec.studentName.trim().toLowerCase();
    const dedupeKey = [nameKey, uniKey(rec.universityName), String(rec.department || '').toLowerCase(), batchKey(rec.section)].join('|');
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    out.push({ id: e.id, data: rec, normId: nameKey });
  });
  sortByRelevance(out, q, h => h.normId);
  return out.slice(0, max).map(h => ({ id: h.id, data: h.data }));
}
function identitiesOverlap(a, b) {
  for (const v of a) if (b.has(v)) return true;
  return false;
}
const UNI_WORD_ALIASES = { int: 'international', intl: 'international', univ: 'university', uni: 'university' };
function uniTokens(v) {
  return String(v || '').toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ').trim().split(' ')
    .filter(Boolean)
    .map(t => UNI_WORD_ALIASES[t] || t)
    .filter(t => t !== 'of' && t !== 'the');
}
function uniKey(v) { return uniTokens(v).join(''); }
function universityIdentity(name) {
  const out = new Set();
  const raw = String(name || '').trim();
  if (!raw) return out;
  out.add(uniKey(raw));
  const paren = raw.match(/\(([^)]+)\)\s*$/);
  const noParen = raw.replace(/\([^)]*\)\s*$/, '');
  if (paren) out.add(uniKey(paren[1]));
  out.add(uniKey(noParen));
  out.add(uniKey(noParen.split(/[,;\u2013\u2014]|\s-\s/)[0]));
  out.delete('');
  return out;
}
function universityInitials(name) {
  const first = String(name || '').replace(/\([^)]*\)\s*$/, '').split(/[,;\u2013\u2014]|\s-\s/)[0];
  return uniTokens(first).filter(t => t !== 'and').map(t => t[0]).join('');
}
function universityAbbreviation(name) {
  const raw = String(name || '').trim();
  return /^[A-Za-z](\.?[A-Za-z]){1,7}\.?$/.test(raw) ? raw.replace(/[^A-Za-z]/g, '').toLowerCase() : '';
}
function universitiesMatch(typed, recorded) {
  if (identitiesOverlap(universityIdentity(typed), universityIdentity(recorded))) return true;
  const abbr = universityAbbreviation(typed);
  if (abbr && universityInitials(recorded) === abbr) return true;
  const recAbbr = universityAbbreviation(recorded);
  return !!recAbbr && universityInitials(typed) === recAbbr;
}
function deptIdentity(dept) {
  const out = new Set();
  const raw = String(dept || '').trim();
  if (!raw) return out;
  const flat = v => String(v).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  const key = findDeptKey(raw);
  if (key) out.add(key.toLowerCase());
  const paren = raw.match(/\(([^)]+)\)\s*$/);
  if (paren) out.add(flat(paren[1]));
  const bare = raw
    .replace(/\([^)]*\)\s*$/, '')
    .replace(/^(department|dept)\.?\s+of\s+/i, '')
    .replace(/\s+(department|dept)\.?$/i, '');
  out.add(flat(bare));
  out.delete('');
  return out;
}
function batchKey(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
function groupMatchPoolUniDept() {
  const dept = deptIdentity(state.department);
  if (!uniTokens(state.universityName).length || !dept.size) return [];
  return allStudentEntries()
    .filter(e => universitiesMatch(state.universityName, e.data.universityName)
      && identitiesOverlap(dept, deptIdentity(e.data.department)))
    .map(e => ({ id: e.id, data: e.data }));
}
function groupMatchPool() {
  kickClassUnlock();
  const batch = batchKey(state.section);
  if (!batch) return [];
  return groupMatchPoolUniDept().filter(item => batchKey(item.data.section) === batch);
}
function matchGroupStudents(query, field, max, memberId) {
  const q = field === 'id' ? normalizeKey(query) : String(query || '').trim().toLowerCase();
  if (!q) return [];
  const taken = new Set(state.groupMembers
    .filter(m => m.id !== memberId && m.studentId)
    .map(m => normalizeKey(m.studentId)));
  const hits = [];
  groupMatchPool().forEach(item => {
    if (taken.has(normalizeKey(item.id))) return;
    const hay = field === 'id' ? normalizeKey(item.id) : String(item.data.studentName || '').toLowerCase();
    if (hay.includes(q)) hits.push({ id: item.id, data: item.data, sortKey: hay });
  });
  sortByRelevance(hits, q, h => h.sortKey);
  return hits.slice(0, max).map(h => ({ id: h.id, data: h.data }));
}
function ambiguousSubText(item, mainField) {
  // No subtitles - show main field only
  return '';
}
function attachStudentSuggest(inputEl, opts) {
  if (!inputEl) return;
  const wrap = inputEl.closest('.field-suggest') || inputEl.parentElement;
  // Stop the browser's own autofill/history dropdown from covering ours.
  inputEl.setAttribute('autocomplete', 'off');
  const panel = document.createElement('div');
  panel.className = 'sugg-panel';
  panel.setAttribute('role', 'listbox');
  wrap.appendChild(panel);
  const minChars = opts.minChars || 1;
  const max = opts.max || 5;
  let items = [];       
  let activeIndex = -1;
  let closeCount = 0;
  function close() {
    closeCount++;
    panel.classList.remove('open');
    panel.innerHTML = '';
    items = [];
    activeIndex = -1;
  }
  function pickStudentItem(item) {
    const mode = opts.fillMode || 'full';
    if (mode === 'full') {
      applyStudentRecord(item.id, item.data);
      syncInputs();
      render();
      const hint = document.getElementById('lookupHint');
      if (hint) {
        hint.textContent = `Matched saved record for ${item.data.studentName} (${item.id}).`;
        hint.className = 'hint ok';
      }
    } else if (mode === 'id-only') {
      inputEl.value = item.id;
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (mode === 'name') {
      inputEl.value = item.data.studentName || '';
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (mode === 'roll') {
      inputEl.value = item.data.roll || '';
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
    close();
  }
  function pickStaticItem(value) {
    inputEl.value = value;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    close();
  }
  function pick(item) {
    if (typeof item === 'string') { pickStaticItem(item); }
    else if (opts.onPick) { opts.onPick(item); close(); }
    else { pickStudentItem(item); }
    // Bump AFTER the pick work: anything that scheduled a kickClassUnlock while
    // the pick was running must see a stale generation, and any pending unlock
    // timer is dropped so it can't reopen the panel we just closed.
    suggestPickGen++;
    clearTimeout(classTimer);
    // A pick finishes the field: drop the cursor (also dismisses the mobile keyboard).
    inputEl.blur();
  }
  function highlight(text, query) {
  const t = String(text || '');
  if (!query) return esc(t);
  const tNorm = t.replace(/[-\s]+/g, '').toLowerCase();
  const qNorm = query.replace(/[-\s]+/g, '').toLowerCase();
  if (qNorm && tNorm.includes(qNorm)) {
    const normStart = tNorm.indexOf(qNorm);
    const normEnd   = normStart + qNorm.length;
    let ni = 0, origStart = -1, origEnd = -1;
    for (let oi = 0; oi < t.length; oi++) {
      const ch = t[oi];
      if (/[-\s]/.test(ch)) continue; 
      if (ni === normStart) origStart = oi;
      ni++;
      if (ni === normEnd) { origEnd = oi + 1; break; }
    }
    if (origStart !== -1 && origEnd !== -1) {
      return esc(t.slice(0, origStart))
           + '<mark>' + esc(t.slice(origStart, origEnd)) + '</mark>'
           + esc(t.slice(origEnd));
    }
  }
  const i = t.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return esc(t);
  return esc(t.slice(0, i))
       + '<mark>' + esc(t.slice(i, i + query.length)) + '</mark>'
       + esc(t.slice(i + query.length));
}
  function renderPanel(query) {
    if (!items.length) {
      panel.innerHTML = '<div class="sugg-empty">No matches</div>';
      panel.classList.add('open');
      return;
    }
    panel.innerHTML = '';
    items.forEach((item, idx) => {
      const opt = document.createElement('div');
      opt.className = 'sugg-option' + (idx === activeIndex ? ' active' : '');
      opt.setAttribute('role', 'option');
      if (typeof item === 'string') {
        opt.innerHTML = `<div class="sugg-option-main">${highlight(item, query)}</div>`;
        opt.addEventListener('mousedown', (e) => { e.preventDefault(); pick(item); });
        panel.appendChild(opt);
        return;
      }
      const mainText = opts.mainField === 'name' ? item.data.studentName
        : opts.mainField === 'roll' ? item.data.roll
          : item.id;
      const subText = opts.getSubText ? opts.getSubText(item) : ambiguousSubText(item, opts.mainField);
      const subHtml = subText ? `<div class="sugg-option-sub">${esc(subText)}</div>` : '';
      opt.innerHTML = `<div class="sugg-option-main">${highlight(mainText, query)}</div>${subHtml}`;
      opt.addEventListener('mousedown', (e) => { e.preventDefault(); pick(item); });
      panel.appendChild(opt);
    });
    panel.classList.add('open');
  }
  function refresh() {
    // Late callers (e.g. the class-vault unlock timer) must never reopen a list
    // whose field the user has already left.
    if (document.activeElement !== inputEl) { close(); return; }
    activeSuggestRefresh = refresh;
    const q = inputEl.value.trim();
    if (q.length < minChars) { close(); return; }
    if (opts.staticList) {
      const flat = v => String(v).toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();
      const lq = flat(q);
      items = opts.staticList.filter(s => flat(s).includes(lq)).slice(0, max);
    } else {
      items = opts.getMatches(q, max);
    }
    activeIndex = -1;
    if (items.length === 0) {
      // Opt-in: some fields (group members) explain why nothing was found.
      const emptyMsg = opts.getEmptyMessage ? opts.getEmptyMessage(q) : '';
      if (emptyMsg) {
        panel.innerHTML = `<div class="sugg-empty">${esc(emptyMsg)}</div>`;
        panel.classList.add('open');
      } else {
        close();
      }
      return;
    }
    renderPanel(q);
  }
  inputEl.addEventListener('input', (e) => {
    // Programmatic input events (fired by pick() after filling the value) must
    // not reopen the list.
    if (e && e.isTrusted === false) return;
    refresh();
  });
  // Seeded records unlock only when a complete ID is typed (never on partial text).
  if (opts.mainField !== 'name') {
    let unlockTimer;
    inputEl.addEventListener('input', (e) => {
      if (e && e.isTrusted === false) return;          // ignore programmatic input events (after picking)
      clearTimeout(unlockTimer);
      const closedAt = closeCount;
      unlockTimer = setTimeout(async () => {
        if (normalizeKey(inputEl.value).length < 10) return;
        await unlockSeed(inputEl.value);
        // Only reopen if the user is still typing here and hasn't picked/closed meanwhile.
        if (closeCount === closedAt && document.activeElement === inputEl) refresh();
      }, 350);
    });
  }
  inputEl.addEventListener('focus', refresh);
  inputEl.addEventListener('keydown', (e) => {
    if (!panel.classList.contains('open') || !items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      renderPanel(inputEl.value.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderPanel(inputEl.value.trim());
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && items[activeIndex] !== undefined) { e.preventDefault(); pick(items[activeIndex]); }
    } else if (e.key === 'Escape') {
      close();
    }
  });
  let blurTimer = null;
  inputEl.addEventListener('focus', () => clearTimeout(blurTimer));
  inputEl.addEventListener('input', () => clearTimeout(blurTimer));
  inputEl.addEventListener('blur', () => {
    clearTimeout(blurTimer);
    if (activeSuggestRefresh === refresh) activeSuggestRefresh = null;
    // Suggestion rows use mousedown + preventDefault, so a real pick never blurs the
    // input; closing right away is safe and avoids the list lingering on screen.
    close();
  });
}