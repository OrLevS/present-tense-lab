// Deterministic answer checking + error tagging.
// Grammar, spelling and vocabulary are judged SEPARATELY:
//   "My brother watchs videos" → grammar ✓ (he added S), spelling ✗.
//   "She looks at her phone"   → grammar ✓, vocabulary differs from the prompt.

import { tokenize, VERB_FORMS, FORM_INDEX, NAMES, FUNCTION_WORDS, WORD_BY_ID, GRAMMAR_WORDS } from '../content/index.js';
import { expandTokens, checkStructure } from './structure.js';

const DETERMINERS = new Set(['the', 'a', 'an', 'my', 'his', 'her', 'their', 'our', 'your']);
const BE = new Set(['am', 'is', 'are', "i'm", "he's", "she's", "it's", "we're", "they're", "you're"]);
const PRONOUN_PERSON = { i: 'first', you: 'plural', we: 'plural', they: 'plural', he: 'third', she: 'third', it: 'third' };

// lowercase, no punctuation, contractions expanded (doesn't → does not), so both spellings are accepted
export function normalize(s) {
  return expandTokens(tokenize(s)).join(' ');
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

const close = (a, b) => a && b && a[0] === b[0] && levenshtein(a, b) <= (b.length > 5 ? 2 : 1);

// ---------- verb recognition ----------
// Returns { base, form: 'base'|'s'|'ing'|'s_misspelled'|'base_misspelled'|'ing_misspelled', token, index }
function analyzeVerbToken(tok) {
  const t = tok.toLowerCase();
  for (const v of Object.values(VERB_FORMS)) {
    if (t === v.base) return { base: v.base, form: 'base' };
    if (t === v.s) return { base: v.base, form: 's' };
    if (t === v.ing) return { base: v.base, form: 'ing' };
  }
  // misspellings
  for (const v of Object.values(VERB_FORMS)) {
    if (t.endsWith('ing') && v.ing && close(t, v.ing)) return { base: v.base, form: 'ing_misspelled' };
    if (t.endsWith('s') && v.s && (close(t, v.s) || t === v.base + 's' || t === v.base + 'es')) return { base: v.base, form: 's_misspelled' };
    if (close(t, v.base) && !t.endsWith('s')) return { base: v.base, form: 'base_misspelled' };
  }
  return null;
}

// Find the subject phrase and its person in a token list, before index `verbIdx`.
function analyzeSubject(toks, verbIdx) {
  const subj = toks.slice(0, verbIdx).map((t) => t.toLowerCase());
  const words = subj.filter((t) => !['every', 'day', 'morning', 'after', 'school', 'at', 'night', 'on', 'weekends', 'usually', 'always', 'sometimes', 'often', 'never', 'now', 'right', 'today', 'but', 'so'].includes(t));
  if (!words.length) return { phrase: '', person: null };
  const head = words[words.length - 1];
  const phrase = words.join(' ');
  if (PRONOUN_PERSON[head]) return { phrase, person: PRONOUN_PERSON[head], pronoun: head };
  if (words.includes('and')) return { phrase, person: 'plural' };
  if (NAMES[head]) return { phrase, person: 'third', name: head };
  const wid = FORM_INDEX.get(head);
  const w = wid && WORD_BY_ID[wid];
  if (w && w.kind === 'noun') {
    const plural = w.forms?.plural && head === w.forms.plural && head !== w.en;
    return { phrase, person: plural ? 'plural' : 'third' };
  }
  // Unknown capitalised word → treat as a name (he/she).
  const original = toks.slice(0, verbIdx).find((t) => t.toLowerCase() === head);
  if (original && /^[A-Z]/.test(original)) return { phrase, person: 'third', name: head };
  return { phrase, person: head.endsWith('s') ? 'plural' : 'third' };
}

function expectedForm(target, person) {
  if (!target?.verb) return null;
  const v = VERB_FORMS[WORD_BY_ID[target.verb]?.en || target.verb];
  if (!v) return null;
  return person === 'third' ? v.s : v.base;
}

// Locate the main verb: first token that is a known verb form (skipping obvious nouns like "message(s)" after a determiner).
function findVerb(toks, preferredBase) {
  let fallback = null;
  for (let i = 0; i < toks.length; i++) {
    const prev = (toks[i - 1] || '').toLowerCase();
    if (DETERMINERS.has(prev)) continue; // "her messages" → noun
    const a = analyzeVerbToken(toks[i]);
    if (!a) continue;
    const hit = { ...a, token: toks[i], index: i };
    if (!preferredBase || a.base === preferredBase) return hit;
    if (!fallback) fallback = hit;
  }
  return fallback;
}

// ---------- main sentence evaluator ----------
/**
 * evaluateSentence(answer, { acceptedAnswers, target })
 * target: { person: 'third'|'first'|'plural', verb: wordId, form }
 * returns {
 *   correct, grammarCorrect, spellingCorrect, vocabularyCorrect, wordOrderCorrect, complete,
 *   errorTags: [], primaryTag, details: { verbToken, expectedVerb, subject, misspelled: [[wrote, expected]], missing: [], extra: [] },
 *   bestMatch
 * }
 */
export function evaluateSentence(answer, { acceptedAnswers = [], target = {} } = {}) {
  const res = {
    correct: false, grammarCorrect: false, spellingCorrect: true, vocabularyCorrect: true,
    wordOrderCorrect: true, complete: true, errorTags: [], primaryTag: null,
    details: { misspelled: [], missing: [], extra: [] }, bestMatch: acceptedAnswers[0] || '',
  };
  const ans = normalize(answer);
  if (!ans) { res.complete = false; res.errorTags.push('MISSING_WORDS'); res.primaryTag = 'MISSING_WORDS'; return res; }

  const normAccepted = acceptedAnswers.map(normalize);
  const detFlex = (s) => s.split(' ').map((t) => (DETERMINERS.has(t) ? '·' : t)).join(' ');
  if (normAccepted.includes(ans) || normAccepted.some((a) => detFlex(a) === detFlex(ans))) {
    res.correct = true; res.grammarCorrect = true;
    res.bestMatch = acceptedAnswers[normAccepted.findIndex((a) => a === ans || detFlex(a) === detFlex(ans))];
    return res;
  }

  // closest accepted answer by token edit distance
  const aToks = tokenize(answer);
  let best = 0, bestScore = Infinity;
  normAccepted.forEach((acc, i) => {
    const score = tokenDistance(ans.split(' '), acc.split(' '));
    if (score < bestScore) { bestScore = score; best = i; }
  });
  res.bestMatch = acceptedAnswers[best] || '';
  const expToks = normAccepted[best] ? normAccepted[best].split(' ') : [];
  if (target.structure && target.structure !== 'ps') return evaluateStructured(res, ans.split(' '), expToks, target, normAccepted);

  // --- grammar target: subject + verb form ---
  const preferredBase = target.verb ? (WORD_BY_ID[target.verb]?.en || target.verb) : null;
  const verb = findVerb(aToks, preferredBase);
  const lowered = aToks.map((t) => t.toLowerCase());
  const tags = new Set();

  if (!verb) {
    res.grammarCorrect = false;
    tags.add(expToks.length && lowered.length < expToks.length - 1 ? 'MISSING_WORDS' : 'VOCABULARY');
    res.vocabularyCorrect = false;
  } else {
    const subject = analyzeSubject(aToks, verb.index);
    res.details.subject = subject.phrase;
    res.details.verbToken = verb.token;
    const person = subject.person || target.person;
    const needS = person === 'third';
    res.details.expectedVerb = expectedForm({ verb: target.verb || verb.base }, person) || verb.base;
    const prevTok = lowered[verb.index - 1];

    if (verb.form === 'ing' || verb.form === 'ing_misspelled') {
      tags.add(BE.has(prevTok) ? 'TENSE_SELECTION' : 'AM_IS_ARE');
      res.grammarCorrect = false;
    } else if (BE.has(prevTok)) {
      tags.add('TENSE_SELECTION'); // "She is use…"
      res.grammarCorrect = false;
    } else {
      const hasS = verb.form === 's' || verb.form === 's_misspelled';
      res.grammarCorrect = hasS === needS;
      if (!res.grammarCorrect) tags.add('THIRD_PERSON_S');
      if (verb.form === 's_misspelled' || verb.form === 'base_misspelled') {
        res.spellingCorrect = false; tags.add('SPELLING');
        const v = VERB_FORMS[verb.base];
        res.details.misspelled.push([verb.token, hasS ? v.s : v.base]);
      }
    }

    // subject pronoun: expected she, wrote he (or expected third, wrote plural pronoun)
    if (target.person && subject.person && target.person !== 'mixed') {
      const expSubj = expToks.slice(0, Math.max(1, expToks.indexOf(expectedForm(target, target.person)))).join(' ');
      const expPron = expSubj.split(' ').pop();
      if (PRONOUN_PERSON[expPron] && subject.pronoun && subject.pronoun !== expPron) tags.add('SUBJECT_PRONOUN');
    }

    // vocabulary: a different verb than the prompt asked for
    if (preferredBase && verb.base !== preferredBase) { res.vocabularyCorrect = false; tags.add('VOCABULARY'); }
  }

  // --- the rest of the sentence: spelling, vocabulary, missing words, order ---
  const verbIdx = verb ? verb.index : -1;
  const rest = lowered.filter((_, i) => i !== verbIdx);
  const expVerbIdx = verb ? expToks.findIndex((t) => analyzeVerbToken(t)?.base === verb.base) : -1;
  const expRest = expToks.filter((_, i) => i !== expVerbIdx);
  const unmatchedExp = [...expRest];
  const extras = [];
  for (const t of rest) {
    const exact = unmatchedExp.indexOf(t);
    if (exact >= 0) { unmatchedExp.splice(exact, 1); continue; }
    const near = unmatchedExp.findIndex((e) => close(t, e));
    if (near >= 0) { res.details.misspelled.push([t, unmatchedExp[near]]); unmatchedExp.splice(near, 1); res.spellingCorrect = false; tags.add('SPELLING'); continue; }
    const detSwap = DETERMINERS.has(t) && unmatchedExp.findIndex((e) => DETERMINERS.has(e));
    if (detSwap !== false && detSwap >= 0) { unmatchedExp.splice(detSwap, 1); continue; }
    extras.push(t);
  }
  const missing = unmatchedExp.filter((t) => !DETERMINERS.has(t));
  res.details.missing = missing;
  res.details.extra = extras;
  if (extras.length && missing.length) { res.vocabularyCorrect = false; tags.add('VOCABULARY'); }
  else if (missing.length) { res.complete = false; tags.add('MISSING_WORDS'); }
  else if (extras.length && !extras.every((t) => FUNCTION_WORDS.includes(t))) { res.vocabularyCorrect = false; tags.add('VOCABULARY'); }

  // word order: same words, different order
  if (!missing.length && !extras.length && res.details.misspelled.length === 0) {
    const sortedA = [...lowered].sort().join(' ');
    const sortedE = [...expToks].sort().join(' ');
    if (sortedA === sortedE || res.grammarCorrect) {
      const orderOk = normAccepted.some((acc) => acc === lowered.join(' '));
      if (!orderOk && sortedA === sortedE) { res.wordOrderCorrect = false; tags.add('WORD_ORDER'); }
    }
  }
  // subject must come before the verb
  if (verb && verb.index === 0 && lowered.length > 1 && !tags.has('WORD_ORDER')) { res.wordOrderCorrect = false; tags.add('WORD_ORDER'); }

  res.errorTags = [...tags];
  res.primaryTag = pickPrimary(res.errorTags);
  res.correct = res.grammarCorrect && res.spellingCorrect && res.vocabularyCorrect && res.wordOrderCorrect && res.complete;
  if (res.correct) { res.errorTags = []; res.primaryTag = null; }
  return res;
}

// ---------- Progressive / negatives / questions / WH ----------
function evaluateStructured(res, stud, exp, target, normAccepted) {
  const c = checkStructure(stud, exp, target.structure);
  const tags = new Set(c.tags);
  res.details = { ...res.details, ...c.details, misspelled: [...c.spelling] };
  if (c.spelling.length) { res.spellingCorrect = false; tags.add('SPELLING'); }
  if (c.vocab) { res.vocabularyCorrect = false; tags.add('VOCABULARY'); }
  // the rest of the sentence (everything that is not a grammar slot)
  const rest = c.studentTokens.filter((_, i) => !c.grammarIdx.includes(i));
  const unmatched = c.expectedTokens.filter((_, i) => !c.expectedGrammarIdx.includes(i));
  const extras = [];
  for (const t of rest) {
    const k = unmatched.indexOf(t);
    if (k >= 0) { unmatched.splice(k, 1); continue; }
    const near = unmatched.findIndex((e) => close(t, e));
    if (near >= 0) { res.details.misspelled.push([t, unmatched[near]]); unmatched.splice(near, 1); res.spellingCorrect = false; tags.add('SPELLING'); continue; }
    const det = DETERMINERS.has(t) ? unmatched.findIndex((e) => DETERMINERS.has(e)) : -1;
    if (det >= 0) { unmatched.splice(det, 1); continue; }
    if (['do', 'does', 'am', 'is', 'are', 'not'].includes(t)) continue; // already judged as grammar
    extras.push(t);
  }
  const missing = unmatched.filter((t) => !DETERMINERS.has(t) && !['do', 'does', 'am', 'is', 'are', 'not'].includes(t));
  res.details.missing = missing;
  res.details.extra = extras;
  if (extras.length && missing.length) { res.vocabularyCorrect = false; tags.add('VOCABULARY'); }
  else if (missing.length) { res.complete = false; tags.add('MISSING_WORDS'); }
  else if (extras.length && !extras.every((t) => FUNCTION_WORDS.includes(t))) { res.vocabularyCorrect = false; tags.add('VOCABULARY'); }
  // same words, different order
  if (!tags.size || [...tags].every((t) => t === 'BE_QUESTION' || t === 'DO_DOES_QUESTION' || t === 'WH_QUESTION')) {
    if ([...stud].sort().join(' ') === [...exp].sort().join(' ') && !normAccepted.includes(stud.join(' ')) && !tags.size) tags.add('WORD_ORDER');
  }
  const GRAMMAR = ['AM_IS_ARE', 'ING_FORM', 'TENSE_SELECTION', 'DONT_DOESNT', 'DOES_BASE_VERB', 'PROGRESSIVE_NEGATIVE', 'DO_DOES_QUESTION', 'BE_QUESTION', 'WH_QUESTION', 'WORD_ORDER', 'SUBJECT_PRONOUN', 'THIRD_PERSON_S'];
  res.grammarCorrect = !GRAMMAR.some((g) => tags.has(g));
  res.wordOrderCorrect = !tags.has('WORD_ORDER');
  res.errorTags = [...tags];
  res.primaryTag = pickPrimary(res.errorTags);
  res.correct = res.grammarCorrect && res.spellingCorrect && res.vocabularyCorrect && res.complete;
  if (res.correct) { res.errorTags = []; res.primaryTag = null; }
  return res;
}

const PRIORITY = ['WH_QUESTION', 'DO_DOES_QUESTION', 'BE_QUESTION', 'DONT_DOESNT', 'PROGRESSIVE_NEGATIVE', 'DOES_BASE_VERB', 'THIRD_PERSON_S', 'TENSE_SELECTION', 'AM_IS_ARE', 'ING_FORM', 'SUBJECT_PRONOUN', 'WORD_ORDER', 'VOCABULARY', 'MISSING_WORDS', 'SPELLING'];
function pickPrimary(tags) {
  return PRIORITY.find((p) => tags.includes(p)) || tags[0] || null;
}

function tokenDistance(a, b) {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : close(a[i - 1], b[j - 1]) ? 0.5 : 1));
    prev = cur;
  }
  return prev[n];
}

// ---------- choice items ----------
export function evaluateChoice(answer, item) {
  const correct = String(answer).trim() === String(item.answer).trim();
  // A choice inside a sentence frame is judged as the full sentence → the error is tagged by concept
  if (item.frame && !correct) {
    const ev = evaluateSentence(item.frame.replace('___', answer), { acceptedAnswers: [item.frame.replace('___', item.answer)], target: item.target || {} });
    if (!ev.correct) {
      if (item.errorTag) { ev.errorTags = [item.errorTag]; ev.primaryTag = item.errorTag; }
      if (!ev.errorTags.length) { ev.errorTags = [item.errorTag || 'THIRD_PERSON_S']; ev.primaryTag = ev.errorTags[0]; }
      return ev;
    }
  }
  if (!correct && item.errorTag) return { correct: false, grammarCorrect: false, spellingCorrect: true, vocabularyCorrect: true, wordOrderCorrect: true, complete: true, errorTags: [item.errorTag], primaryTag: item.errorTag, details: { verbToken: answer, expectedVerb: item.answer } };
  if (correct) return { correct: true, grammarCorrect: true, spellingCorrect: true, vocabularyCorrect: true, wordOrderCorrect: true, complete: true, errorTags: [], primaryTag: null, details: {} };
  // What did choosing this option mean?
  let tag = null;
  const chosen = analyzeVerbToken(String(answer).split(' ').find((t) => analyzeVerbToken(t)) || answer);
  const right = analyzeVerbToken(String(item.answer).split(' ').find((t) => analyzeVerbToken(t)) || item.answer);
  if (chosen && right && chosen.base === right.base) {
    if (chosen.form === 's_misspelled' || chosen.form === 'base_misspelled') tag = 'SPELLING';
    else tag = 'THIRD_PERSON_S';
  } else if (item.target?.skill === 'subject_pronouns') tag = 'SUBJECT_PRONOUN';
  else if (item.type === 'choose_sentence') tag = (item.errorTags || ['THIRD_PERSON_S'])[0];
  else tag = item.target?.skill === 'time_words' ? 'VOCABULARY' : 'THIRD_PERSON_S';
  const spellingOnly = tag === 'SPELLING';
  return {
    correct: false, grammarCorrect: spellingOnly, spellingCorrect: !spellingOnly, vocabularyCorrect: tag !== 'VOCABULARY',
    wordOrderCorrect: true, complete: true, errorTags: [tag], primaryTag: tag,
    details: { verbToken: answer, expectedVerb: item.answer, subject: subjectFromFrame(item.frame) },
  };
}

function subjectFromFrame(frame) {
  if (!frame) return '';
  return frame.split('___')[0].trim();
}

// ---------- open production (no single right answer) ----------
/**
 * evaluateFree(answer, { target: { person, verbs:[wordId], subject } })
 * Checks the TARGET STRUCTURE, not an exact sentence.
 */
export function evaluateFree(answer, { target = {} } = {}) {
  const toks = tokenize(answer);
  const res = {
    correct: false, grammarCorrect: false, spellingCorrect: true, vocabularyCorrect: true, wordOrderCorrect: true, complete: true,
    errorTags: [], primaryTag: null, details: { misspelled: [], unknownWords: [] }, needsTeacherReview: false,
  };
  if (toks.length < 3) { res.complete = false; res.errorTags = ['MISSING_WORDS']; res.primaryTag = 'MISSING_WORDS'; return res; }
  const verb = findVerb(toks, null);
  const tags = new Set();
  if (target.structure && target.structure !== 'ps') {
    // Progressive / negative / question: judge the structure of the student's own sentence
    const low = expandTokens(toks);
    const c = checkStructure(low, low, target.structure);
    c.tags.forEach((x) => tags.add(x));
    if (c.spelling.length) { res.spellingCorrect = false; tags.add('SPELLING'); res.details.misspelled.push(...c.spelling); }
    if (!c.details.verbToken) { tags.add('VOCABULARY'); res.vocabularyCorrect = false; res.needsTeacherReview = true; }
    Object.assign(res.details, c.details);
    res.grammarCorrect = !['AM_IS_ARE', 'ING_FORM', 'TENSE_SELECTION', 'DONT_DOESNT', 'DOES_BASE_VERB', 'PROGRESSIVE_NEGATIVE', 'DO_DOES_QUESTION', 'BE_QUESTION', 'WH_QUESTION', 'WORD_ORDER'].some((g) => tags.has(g)) && !!c.details.verbToken;
  } else if (!verb) {
    tags.add('VOCABULARY'); res.vocabularyCorrect = false; res.needsTeacherReview = true;
  } else {
    const subject = analyzeSubject(toks, verb.index);
    res.details.subject = subject.phrase; res.details.verbToken = verb.token;
    const wantPerson = target.person;
    const person = subject.person;
    if (wantPerson === 'third' && person && person !== 'third') tags.add('SUBJECT_PRONOUN');
    if (wantPerson === 'first' && person && person !== 'first') tags.add('SUBJECT_PRONOUN');
    const needS = person === 'third';
    const prev = (toks[verb.index - 1] || '').toLowerCase();
    if (verb.form.startsWith('ing')) tags.add(BE.has(prev) ? 'TENSE_SELECTION' : 'AM_IS_ARE');
    else if (BE.has(prev)) tags.add('TENSE_SELECTION');
    else {
      const hasS = verb.form === 's' || verb.form === 's_misspelled';
      if (hasS !== needS) tags.add('THIRD_PERSON_S');
      if (verb.form.endsWith('misspelled')) { tags.add('SPELLING'); res.spellingCorrect = false; const v = VERB_FORMS[verb.base]; res.details.misspelled.push([verb.token, hasS ? v.s : v.base]); }
    }
    res.details.expectedVerb = expectedForm({ verb: verb.base }, person);
    if (verb.index === 0) tags.add('WORD_ORDER');
    res.grammarCorrect = !['THIRD_PERSON_S', 'AM_IS_ARE', 'TENSE_SELECTION', 'SUBJECT_PRONOUN', 'WORD_ORDER'].some((t) => tags.has(t));
  }
  // words the platform does not know: not an error — the teacher reviews them
  for (const [i, t] of toks.entries()) {
    const l = t.toLowerCase();
    // part of a known multi-word expression (how often, what time, at the moment …)
    if (FORM_INDEX.has(`${(toks[i - 1] || '').toLowerCase()} ${l}`) || FORM_INDEX.has(`${l} ${(toks[i + 1] || '').toLowerCase()}`)) continue;
    if (FORM_INDEX.has(l) || FUNCTION_WORDS.includes(l) || NAMES[l] || BE.has(l) || l in GRAMMAR_WORDS || /^[A-Z]/.test(t)) continue;
    if (['every', 'day', 'morning', 'after', 'school', 'night', 'weekends', 'weekend'].includes(l)) continue;
    const near = [...FORM_INDEX.keys()].find((k) => !k.includes(' ') && close(l, k));
    if (near) { res.details.misspelled.push([l, near]); res.spellingCorrect = false; tags.add('SPELLING'); }
    else { res.details.unknownWords.push(l); res.needsTeacherReview = true; }
  }
  res.errorTags = [...tags];
  res.wordOrderCorrect = !tags.has('WORD_ORDER');
  res.primaryTag = pickPrimary(res.errorTags);
  res.correct = res.grammarCorrect && res.spellingCorrect;
  return res;
}

export function evaluateMulti(answers, parts) {
  const results = parts.map((p, i) => evaluateSentence(answers[i] || '', { acceptedAnswers: p.acceptedAnswers, target: p.target }));
  const all = (k) => results.every((r) => r[k]);
  const tags = [...new Set(results.flatMap((r) => r.errorTags))];
  return {
    correct: all('correct'), grammarCorrect: all('grammarCorrect'), spellingCorrect: all('spellingCorrect'),
    vocabularyCorrect: all('vocabularyCorrect'), wordOrderCorrect: all('wordOrderCorrect'), complete: all('complete'),
    errorTags: tags, primaryTag: pickPrimary(tags), parts: results,
    details: results.find((r) => !r.correct)?.details || {},
  };
}
