// Content registry. To add a new lesson: write a data file in ./lessons and add it to LESSON_LIST.
// No UI code needs to change. This file also derives each exercise's required vocabulary from its model answer.

import { UNIT, SKILLS, OVERVIEW_COLUMNS, ERROR_TAGS } from './skills.js';
import { WORDS, VOCAB_SETS, THEMES, FUNCTION_WORDS, NAMES, GRAMMAR_WORDS } from './vocabulary.js';
import { TOOLBOX } from './toolbox.js';
import { REVIEWS } from './modules/reviews.js';
import { EXPLAINERS } from './explainers.js';
import lessonA from './lessons/lesson_a_s_ing_progressive.js';
import lessonB from './lessons/lesson_b_negatives_questions.js';
import lessonC from './lessons/lesson_c_wh_questions.js';

export { UNIT, SKILLS, OVERVIEW_COLUMNS, ERROR_TAGS, WORDS, VOCAB_SETS, THEMES, FUNCTION_WORDS, NAMES, GRAMMAR_WORDS, TOOLBOX };

// To add a lesson: write a data file in ./lessons and list it here. No UI code changes.
const LESSON_LIST = [lessonA, lessonB, lessonC];

export const WORD_BY_ID = Object.fromEntries(WORDS.map((w) => [w.id, w]));
export const SKILL_BY_ID = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
export const SET_BY_ID = Object.fromEntries(VOCAB_SETS.map((s) => [s.id, s]));

// ---------- surface form → word id index ----------
export const FORM_INDEX = (() => {
  const idx = new Map();
  const add = (form, id) => { if (form && !idx.has(form.toLowerCase())) idx.set(form.toLowerCase(), id); };
  for (const w of WORDS) {
    add(w.en, w.id);
    for (const f of Object.values(w.forms || {})) add(f, w.id);
    for (const a of w.alt || []) add(a, w.id);
  }
  return idx;
})();

export const VERB_FORMS = (() => {
  // every known verb: base → {s, ing}
  const out = {};
  for (const w of WORDS) if (w.kind === 'verb') out[w.en] = { base: w.en, s: w.forms?.s, ing: w.forms?.ing, id: w.id };
  return out;
})();

export function tokenize(sentence) {
  return String(sentence || '')
    .replace(/[’`]/g, "'")
    .replace(/[.,!?;:"“”()=→←·/…]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// Returns { words: [wordId], unknown: [token] } for an English sentence.
export function vocabularyOf(sentence) {
  const toks = tokenize(sentence).map((t) => t.toLowerCase());
  const words = new Set();
  const unknown = [];
  for (let i = 0; i < toks.length; i++) {
    let matched = false;
    for (const n of [3, 2]) {
      const phrase = toks.slice(i, i + n).join(' ');
      if (toks.length >= i + n && FORM_INDEX.has(phrase)) { words.add(FORM_INDEX.get(phrase)); i += n - 1; matched = true; break; }
    }
    if (matched) continue;
    const t = toks[i];
    if (FUNCTION_WORDS.includes(t) || NAMES[t] || t in GRAMMAR_WORDS) continue;
    if (FORM_INDEX.has(t)) words.add(FORM_INDEX.get(t));
    else unknown.push(t);
  }
  return { words: [...words], unknown };
}

// Model sentence(s) an item is built on (used for vocabulary derivation and teacher preview).
export function modelSentences(item, cfg = {}) {
  const fill = (frame, ans) => frame.replace('___', [].concat(ans)[0] ?? '');
  if (cfg.parts || item.parts) return (cfg.parts || item.parts).map((p) => p.acceptedAnswers[0]);
  if (item.frames) return item.frames.map((f, i) => fill(f, item.answers[i]));
  if (item.chat) return item.chat.map((c) => (c.text.includes('___') ? fill(c.text, c.answer) : c.text));
  if (item.cards) return item.cards.map((c) => c.text);
  if (item.pairs) return item.pairs.flatMap((p) => [p.left, p.right]);
  if (item.acceptedAnswers?.length) return [item.acceptedAnswers[0]];
  if (cfg.frame || item.frame) return [fill(cfg.frame || item.frame, cfg.answer || item.answer || '')];
  if (item.answer) return [item.answer];
  return [];
}

function deriveRequirements(item, ctx) {
  const configs = item.difficultyConfig ? Object.values(item.difficultyConfig).filter(Boolean) : [item];
  const words = new Set(item.requiredVocabulary || []);
  if (!item.requiredVocabulary) {
    for (const cfg of configs) for (const s of modelSentences(item, cfg)) vocabularyOf(s).words.forEach((w) => words.add(w));
    if ((item.type === 'free_production' || item.type === 'wh_scaffold') && item.target?.verbs?.length) words.add(item.target.verbs[0]);
  }
  const grammarSkill = item.grammarSkill || ctx.skill;
  return {
    ...item,
    grammarSkill,
    theme: item.theme || ctx.theme,
    requiredSkills: item.requiredSkills || [...new Set([...(ctx.requiredSkills || []), grammarSkill].filter(Boolean))],
    requiredVocabulary: [...words],
  };
}

// ---------- lessons ----------
// A lesson = parts (one skill each) → steps. Flattened here so the player sees one ordered list of steps.
function prepareLesson(lesson) {
  const steps = [];
  const explained = new Set();
  for (const part of lesson.parts) {
    // animated explanation right after the guess: first part of each skill that has a guess + learn
    let partSteps = part.steps;
    const ex = EXPLAINERS[part.skill];
    if (ex && !explained.has(part.skill) && partSteps.some((s) => s.type === 'learn') && !partSteps.some((s) => s.type === 'explain')) {
      const gi = partSteps.findIndex((s) => s.type === 'guess');
      const at = gi >= 0 ? gi + 1 : partSteps.findIndex((s) => s.type === 'learn'); // after the guess, or else right before "learn"
      partSteps = [...partSteps.slice(0, at), { type: 'explain', explain: ex }, ...partSteps.slice(at)];
      explained.add(part.skill);
    }
    partSteps.forEach((st, i) => {
      const skill = st.skill || part.skill || null;
      const ctx = { skill, theme: lesson.theme, requiredSkills: st.requiredSkills || part.requiredSkills };
      steps.push({
        ...st,
        id: st.id || `${part.id}.${st.type}.${i}`,
        partId: part.id, partTitle: part.title, partSkill: part.skill || null, skill,
        items: st.items ? st.items.map((it) => deriveRequirements(it, ctx)) : undefined,
      });
    });
  }
  const remediation = Object.fromEntries(Object.entries(lesson.remediation || {}).map(([tag, list]) => [tag, list.map((it) => deriveRequirements(it, { skill: it.grammarSkill, theme: lesson.theme }))]));
  // the lesson's own skills (the warm-up only reviews earlier skills)
  const skills = [...new Set(lesson.parts.filter((p) => p.id !== 'warm').map((p) => p.skill).filter(Boolean))];
  return { ...lesson, kind: lesson.kind || 'lesson', steps, remediation, skills, grammarSkill: lesson.grammarSkill || skills[skills.length - 1] };
}

// Older single-skill modules (reviews) → the same lesson shape.
function moduleToLesson(m) {
  const data = { words: { words: m.focusWords }, guess: { guess: m.guess }, learn: { learn: m.learn }, examples: { examples: m.examples },
    check: { items: m.check }, choose: {}, practice: { items: m.practice }, produce: { items: m.produce }, exit: { items: m.exitTicket } };
  return {
    ...m,
    parts: [{ id: 'main', skill: m.grammarSkill, title: m.title, requiredSkills: m.requiredSkills, steps: m.steps.map((type) => ({ type, ...data[type] })) }],
  };
}
export const toLesson = (m) => prepareLesson(m.parts ? m : moduleToLesson(m));

export const LESSONS = LESSON_LIST.map(prepareLesson).sort((a, b) => (a.order || 0) - (b.order || 0));
export const MODULES = LESSONS; // assignable activities
export const REVIEW_MODULES = REVIEWS.map(toLesson);
const ALL = [...LESSONS, ...REVIEW_MODULES];
export const MODULE_BY_ID = Object.fromEntries(ALL.map((m) => [m.id, m]));

export function allItems(lesson) {
  return [...lesson.steps.flatMap((s) => s.items || []), ...Object.values(lesson.remediation || {}).flat()];
}

export function findItem(itemId) {
  for (const m of ALL) {
    const it = allItems(m).find((i) => i.id === itemId);
    if (it) return { module: m, item: it };
  }
  return null;
}

// Vocabulary-set ids an item's words belong to (for response records).
export function setsForWords(wordIds) {
  return VOCAB_SETS.filter((s) => s.words.some((w) => wordIds.includes(w))).map((s) => s.id);
}
