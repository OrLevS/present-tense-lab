// Structure-aware checking for: Present Progressive, negatives, Yes/No questions and WH questions.
// The student's sentence and the expected sentence are both split into "slots"
// (question word · helper (do/does/am/is/are) · not · subject · main verb) and compared slot by slot.
// Each mismatch becomes an error tag about the grammar CONCEPT — never only "wrong answer".

import { VERB_FORMS, FORM_INDEX, WORD_BY_ID, NAMES } from '../content/index.js';

const CONTRACTIONS = {
  "don't": ['do', 'not'], "doesn't": ['does', 'not'], "isn't": ['is', 'not'], "aren't": ['are', 'not'],
  "i'm": ['i', 'am'], "he's": ['he', 'is'], "she's": ['she', 'is'], "it's": ['it', 'is'], "we're": ['we', 'are'], "they're": ['they', 'are'], "you're": ['you', 'are'],
  dont: ['do', 'not'], doesnt: ['does', 'not'], isnt: ['is', 'not'], arent: ['are', 'not'], im: ['i', 'am'],
};
export const DO = new Set(['do', 'does']);
export const BE = new Set(['am', 'is', 'are']);
export const WH = ['how often', 'what time', 'what', 'where', 'when', 'who', 'why', 'how'];
const PRON = { i: 'first', you: 'plural', we: 'plural', they: 'plural', he: 'third', she: 'third', it: 'third' };
const BE_FOR = { first: 'am', third: 'is', plural: 'are' };
const DO_FOR = { first: 'do', third: 'does', plural: 'do' };

export function expandTokens(tokens) {
  return tokens.flatMap((t) => CONTRACTIONS[t.toLowerCase()] || [t.toLowerCase()]);
}

const lev = (a, b) => {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
};
const close = (a, b) => a && b && a[0] === b[0] && lev(a, b) <= (b.length > 5 ? 2 : 1);

export function verbInfo(t) {
  for (const v of Object.values(VERB_FORMS)) {
    if (t === v.base) return { base: v.base, form: 'base' };
    if (t === v.s) return { base: v.base, form: 's' };
    if (t === v.ing) return { base: v.base, form: 'ing' };
  }
  for (const v of Object.values(VERB_FORMS)) {
    if (t.endsWith('ing') && v.ing && (close(t, v.ing) || t === v.base + 'ing')) return { base: v.base, form: 'ing', misspelled: true, expected: v.ing };
    if (t.endsWith('s') && v.s && (close(t, v.s) || t === v.base + 's' || t === v.base + 'es')) return { base: v.base, form: 's', misspelled: true, expected: v.s };
    if (!t.endsWith('s') && !t.endsWith('ing') && close(t, v.base)) return { base: v.base, form: 'base', misspelled: true, expected: v.base };
  }
  return null;
}

function personOf(words) {
  const w = words.filter((x) => !['every', 'day', 'morning', 'after', 'school', 'at', 'night', 'on', 'weekends', 'now', 'right', 'today', 'usually', 'always', 'sometimes'].includes(x));
  if (!w.length) return null;
  const head = w[w.length - 1];
  if (PRON[head]) return PRON[head];
  if (w.includes('and')) return 'plural';
  if (NAMES[head]) return 'third';
  const id = FORM_INDEX.get(head);
  const word = id && WORD_BY_ID[id];
  if (word?.kind === 'noun') return word.forms?.plural === head && head !== word.en ? 'plural' : 'third';
  return head.endsWith('s') ? 'plural' : 'third';
}

/** Split a sentence (lowercased, contractions expanded) into grammar slots. */
export function slots(tokens) {
  const t = expandTokens(tokens);
  const out = { tokens: t, wh: null, whIdx: -1, aux: null, auxIdx: -1, not: -1, verb: null, verbIdx: -1, subjectWords: [], person: null };
  let i = 0;
  for (const w of WH) {
    const parts = w.split(' ');
    if (parts.every((p, k) => t[k] === p)) { out.wh = w; out.whIdx = 0; i = parts.length; break; }
  }
  // helper verb: first do/does/am/is/are that is followed (later) by a main verb, or a be-verb anywhere
  for (let k = 0; k < t.length; k++) {
    // do/does is a helper when another verb follows — including "do" as a main verb: What do you do?
    if (DO.has(t[k]) && t.slice(k + 1).some((x) => verbInfo(x) || DO.has(x))) { out.aux = t[k]; out.auxIdx = k; break; }
    if (BE.has(t[k])) { out.aux = t[k]; out.auxIdx = k; break; }
  }
  out.not = t.indexOf('not');
  for (let k = 0; k < t.length; k++) {
    if (k === out.auxIdx || BE.has(t[k])) continue;
    if (DO.has(t[k])) { out.verb = { base: 'do', form: t[k] === 'does' ? 's' : 'base', token: t[k] }; out.verbIdx = k; break; } // main verb "do"

    if (['the', 'a', 'an', 'my', 'his', 'her', 'their', 'our', 'your'].includes(t[k - 1])) continue; // "her messages" = noun
    const v = verbInfo(t[k]);
    if (v) { out.verb = { ...v, token: t[k] }; out.verbIdx = k; break; }
  }
  // subject: in a question it sits between helper and verb; in a statement before helper/verb
  const isQ = out.auxIdx >= 0 && out.auxIdx <= i && out.verbIdx > out.auxIdx;
  out.question = isQ || out.wh != null;
  const from = isQ ? out.auxIdx + 1 : i;
  const to = isQ ? (out.not >= 0 && out.not < out.verbIdx ? out.not : out.verbIdx) : [out.auxIdx, out.not, out.verbIdx].filter((x) => x >= 0).reduce((a, b) => Math.min(a, b), t.length);
  out.subjectWords = t.slice(from, Math.max(from, to)).filter((x) => x !== 'not');
  out.person = personOf(out.subjectWords);
  return out;
}

/**
 * Grammar check for one target structure. Returns { tags:[], spelling:[[wrote, expected]], details }.
 * structure: 'pp' | 'ps_neg' | 'pp_neg' | 'ps_q' | 'pp_q' | 'wh_ps' | 'wh_pp'
 */
export function checkStructure(studentTokens, expectedTokens, structure) {
  const S = slots(studentTokens);
  const E = slots(expectedTokens);
  const tags = new Set();
  const spelling = [];
  const person = S.person || E.person;
  const vb = S.verb;
  if (vb?.misspelled) spelling.push([vb.token, vb.expected]);

  const progressive = structure === 'pp' || structure === 'pp_neg' || structure === 'pp_q' || structure === 'wh_pp';
  const simple = structure === 'ps_neg' || structure === 'ps_q' || structure === 'wh_ps';

  // --- WH word ---
  if (structure.startsWith('wh_')) {
    if (!S.wh) tags.add('WH_QUESTION');
    else if (E.wh && S.wh !== E.wh) tags.add('WH_QUESTION');
    if (S.wh && S.auxIdx < 0) tags.add('WH_QUESTION'); // "Where she lives?"
  }

  // --- tense family: did they use the right kind of helper? ---
  if (progressive) {
    if (S.aux && DO.has(S.aux)) tags.add(structure === 'pp_neg' ? 'PROGRESSIVE_NEGATIVE' : structure === 'pp' ? 'TENSE_SELECTION' : 'BE_QUESTION');
    else if (!S.aux) tags.add(structure === 'pp_neg' && S.not >= 0 ? 'PROGRESSIVE_NEGATIVE' : vb?.form === 'ing' ? 'AM_IS_ARE' : 'TENSE_SELECTION');
    else if (person && S.aux !== BE_FOR[person]) tags.add(structure === 'pp_q' || structure === 'wh_pp' ? 'BE_QUESTION' : 'AM_IS_ARE');
    if (S.aux && BE.has(S.aux) && vb && vb.form !== 'ing') tags.add('ING_FORM');
    if (structure === 'pp_neg' && S.not < 0 && !tags.has('PROGRESSIVE_NEGATIVE')) tags.add('PROGRESSIVE_NEGATIVE');
    if (structure === 'pp_neg' && S.not >= 0 && S.auxIdx >= 0 && S.not < S.auxIdx) tags.add('PROGRESSIVE_NEGATIVE'); // "She not is…"
    if ((structure === 'pp_q' || structure === 'wh_pp') && S.aux && !S.question) tags.add('BE_QUESTION'); // "She is using?"
  }
  if (simple) {
    const isNeg = structure === 'ps_neg';
    if (!S.aux) tags.add(isNeg ? 'DONT_DOESNT' : structure === 'ps_q' ? 'DO_DOES_QUESTION' : 'WH_QUESTION');
    else if (BE.has(S.aux)) tags.add(vb?.form === 'ing' ? 'TENSE_SELECTION' : isNeg ? 'DONT_DOESNT' : structure === 'ps_q' ? 'DO_DOES_QUESTION' : 'WH_QUESTION');
    else if (person && S.aux !== DO_FOR[person]) tags.add(isNeg ? 'DONT_DOESNT' : 'DO_DOES_QUESTION');
    if (S.aux && DO.has(S.aux) && vb && vb.form === 's') tags.add('DOES_BASE_VERB');
    if (S.aux && DO.has(S.aux) && vb && vb.form === 'ing') tags.add('TENSE_SELECTION');
    if (isNeg && S.not < 0 && !tags.has('DONT_DOESNT')) tags.add('DONT_DOESNT');
    if (!isNeg && S.aux && DO.has(S.aux) && !S.question) tags.add(structure === 'ps_q' ? 'DO_DOES_QUESTION' : 'WH_QUESTION'); // "She does play?"
  }
  // -ing spelling ("use → using"): the -ing word itself is the grammar target
  if (structure === 'ing') {
    const sw = S.tokens[S.tokens.length - 1], ew = E.tokens[E.tokens.length - 1];
    if (sw !== ew) tags.add('ING_FORM');
    return { tags: [...tags], spelling: [], vocab: false, details: { verbToken: sw, expectedVerb: ew }, grammarIdx: [S.tokens.length - 1], expectedGrammarIdx: [E.tokens.length - 1], studentTokens: S.tokens, expectedTokens: E.tokens };
  }
  // plain "be" sentences: She is my sister. / They are my friends.
  if (structure === 'be') {
    if (!S.aux || !BE.has(S.aux)) tags.add('AM_IS_ARE');
    else if (person && S.aux !== BE_FOR[person]) tags.add('AM_IS_ARE');
  }
  // affirmative progressive must NOT have "not"; questions must not be negative unless expected
  if (S.not >= 0 && E.not < 0) tags.add('WORD_ORDER');

  // subject pronoun mismatch (she ↔ he)
  const sp = S.subjectWords[S.subjectWords.length - 1];
  const ep = E.subjectWords[E.subjectWords.length - 1];
  if (sp && ep && PRON[sp] && PRON[ep] && sp !== ep) tags.add('SUBJECT_PRONOUN');

  // vocabulary: different main verb than expected
  const vocab = !!(vb && E.verb && vb.base !== E.verb.base);

  return {
    tags: [...tags], spelling, vocab,
    details: {
      subject: S.subjectWords.join(' '), verbToken: vb?.token, helper: S.aux, wh: S.wh,
      expectedHelper: E.aux, expectedVerb: E.verb?.token, expectedWh: E.wh,
      expectedBe: person ? BE_FOR[person] : null, expectedDo: person ? DO_FOR[person] : null,
    },
    grammarIdx: [S.whIdx >= 0 ? [...Array(S.wh.split(' ').length).keys()] : [], S.auxIdx, S.not, S.verbIdx].flat().filter((x) => x >= 0),
    expectedGrammarIdx: [E.whIdx >= 0 ? [...Array(E.wh.split(' ').length).keys()] : [], E.auxIdx, E.not, E.verbIdx].flat().filter((x) => x >= 0),
    studentTokens: S.tokens, expectedTokens: E.tokens,
  };
}
