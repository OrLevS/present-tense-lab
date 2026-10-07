// One entry point for checking any exercise type. Used by the student UI and by the seed script.
// New exercise types: add a case here + a renderer in ui/exercises.js.

import { evaluateChoice, evaluateSentence, evaluateFree, evaluateMulti } from './evaluate.js';
import { setsForWords } from '../content/index.js';
import { STAGE_BUCKET } from './mastery.js';

// The concrete exercise for a level.
//  • item.difficultyConfig → written by hand per level
//  • item.kind === 'sentence' → the three levels are generated automatically (same target, different scaffolding)
//  • anything else → level-free (check, exit, warm-up, sort, match …)
// k / n = position of the item in its practice round (support is reduced toward the end of a round).
export function resolveConfig(item, level, k = 0, n = 1) {
  if (item.difficultyConfig) {
    const cfg = item.difficultyConfig[level];
    return cfg ? { ...cfg } : null;
  }
  if (item.kind === 'sentence') return autoLevels(item, level || 'medium', k, n);
  const { type, stage, frame, options, answer, base, parts, wrong, showRule, subjectHint, ruleKey, showOrder, distractors, wordBank, verbSupplied, source, instruction, audio } = item;
  return { type, stage, frame, options, answer, base, parts, wrong, showRule, subjectHint, ruleKey, showOrder, distractors, wordBank, verbSupplied, source, instruction, audio };
}

function autoLevels(item, level, k, n) {
  const f = item.focus;
  const late = n > 3 && k >= n - 2;
  const distractors = item.distractors || (f?.options || []).filter((o) => o !== f.answer).slice(0, 1);
  const rule = { showRule: true, ruleKey: item.rule };
  if (level === 'easy') {
    if (late) return { type: 'translate', stage: 'D', wordBank: 'shown', subjectHint: item.subjectHint };
    const c = k % 3;
    if (c === 0 && f?.options) return { type: 'multiple_choice', stage: 'A', frame: f.frame, options: f.options, answer: f.answer, subjectHint: item.subjectHint, ...rule };
    if (c === 2 && f?.base) return { type: 'fill_blank', stage: 'B', frame: f.frame, base: f.base, answer: f.answer, subjectHint: item.subjectHint, ...rule };
    return { type: 'sentence_builder', stage: 'C', distractors, ...rule };
  }
  if (level === 'medium') {
    if (k % 2 === 0 && !late) return { type: 'sentence_builder', stage: 'C', distractors };
    return { type: 'translate', stage: late ? 'E' : 'D', wordBank: 'optional', verbSupplied: late ? undefined : item.target?.verb };
  }
  if (item.wrong && k % 3 === 2) return { type: 'error_correction', stage: 'E', wrong: item.wrong };
  return { type: 'translate', stage: 'E' };
}

// several small sentences checked together (pair_fill, text_gaps)
function gapParts(item, cfg) {
  const lines = (cfg.frames || item.frames || (item.chat || []).map((c) => c.text)).map((text, i) => ({ text, i }));
  const answers = cfg.answers || item.answers || (item.chat || []).map((c) => c.answer);
  return lines.filter((l) => l.text.includes('___')).map((l) => ({
    frame: l.text,
    acceptedAnswers: [].concat(answers[l.i]).map((a) => l.text.replace('___', a)),
    target: item.targets?.[l.i] || { structure: item.target?.structure || 'ps', ...(item.target || {}) },
  }));
}

export function scoreAttempt(item, cfg, answer) {
  switch (cfg.type) {
    case 'multiple_choice':
    case 'choose_sentence':
      return evaluateChoice(answer, { ...item, ...cfg });
    case 'fill_blank': {
      const full = cfg.frame.replace('___', String(answer || '').trim());
      const right = cfg.frame.replace('___', cfg.answer);
      return evaluateSentence(full, { acceptedAnswers: [right], target: item.target });
    }
    case 'sentence_builder':
    case 'translate':
    case 'error_correction':
    case 'transform':
      return evaluateSentence(answer, { acceptedAnswers: item.acceptedAnswers, target: item.target });
    case 'listen_choose':
      return evaluateChoice(answer, { ...item, ...cfg, type: 'choose_sentence' });
    case 'pair_fill':
    case 'text_gaps': {
      const parts = gapParts(item, cfg);
      const filled = parts.map((p, i) => p.frame.replace('___', String((answer || [])[i] || '').trim()));
      return evaluateMulti(filled, parts);
    }
    case 'sort':
    case 'match': {
      const cards = item.cards || item.pairs.map((p) => ({ text: p.left, bucket: p.right }));
      const wrongIdx = cards.map((c, i) => ((answer || {})[i] === c.bucket ? -1 : i)).filter((i) => i >= 0);
      const ok = wrongIdx.length === 0;
      const tag = item.errorTag || 'TENSE_SELECTION';
      return { correct: ok, grammarCorrect: ok, spellingCorrect: true, vocabularyCorrect: true, wordOrderCorrect: true, complete: true,
        errorTags: ok ? [] : [tag], primaryTag: ok ? null : 'SORT', wrongIdx, wrongCount: wrongIdx.length, details: {} };
    }
    case 'wh_scaffold':
      return evaluateFree(answer, { target: item.target });
    case 'translate_multi':
      return evaluateMulti(Array.isArray(answer) ? answer : [answer], cfg.parts);
    case 'free_production': {
      // several sentences (e.g. "write 2 questions") → every sentence is checked
      const parts = String(answer || '').split(/(?<=[.?!])\s+/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length >= 3);
      if (parts.length <= 1) return evaluateFree(answer, { target: item.target });
      const evs = parts.map((p) => evaluateFree(p, { target: item.target }));
      const bad = evs.find((e) => !e.correct) || evs[0];
      return { ...bad, correct: evs.every((e) => e.correct), grammarCorrect: evs.every((e) => e.grammarCorrect), spellingCorrect: evs.every((e) => e.spellingCorrect),
        errorTags: [...new Set(evs.flatMap((e) => e.errorTags))], needsTeacherReview: evs.some((e) => e.needsTeacherReview),
        details: { ...bad.details, unknownWords: [...new Set(evs.flatMap((e) => e.details?.unknownWords || []))] } };
    }
    default:
      throw new Error(`Unknown exercise type: ${cfg.type}`);
  }
}

// A model answer to show after the feedback ladder / in teacher views.
export function modelAnswer(item, cfg) {
  if (cfg?.type === 'pair_fill' || cfg?.type === 'text_gaps') return gapParts(item, cfg).map((p) => p.acceptedAnswers[0]).join(' / ');
  if (cfg?.type === 'sort' || cfg?.type === 'match') return (item.cards || item.pairs.map((p) => ({ text: p.left, bucket: p.right }))).map((c) => `${c.text} → ${bucketLabel(item, c.bucket)}`).join(' · ');
  if (cfg?.type === 'listen_choose') return cfg.answer;
  if (cfg?.type === 'translate_multi') return cfg.parts.map((p) => p.acceptedAnswers[0]).join(' / ');
  if (cfg?.type === 'multiple_choice' || cfg?.type === 'fill_blank') return cfg.frame ? cfg.frame.replace('___', cfg.answer) : cfg.answer;
  if (cfg?.type === 'choose_sentence') return cfg.answer;
  if (item.models) return item.models[0];
  return (item.acceptedAnswers || [])[0] || cfg?.answer || '';
}

// Stage can move with support actually used: a "translate" item answered with the word bank open is supported (D), not independent (E).
export function effectiveStage(cfg, supportUsed, hintsUsed) {
  const stage = cfg.stage || 'D';
  if (STAGE_BUCKET[stage] === 'independent' && (supportUsed?.wordBank || supportUsed?.verbSupplied || supportUsed?.starter)) return 'D';
  return stage;
}

function bucketLabel(item, id) {
  const b = (item.buckets || []).find((x) => x.id === id);
  return b ? (typeof b.label === 'string' ? b.label : b.label.en) : id;
}

const answerText = (a) => (Array.isArray(a) ? a.join(' / ') : a && typeof a === 'object' ? Object.values(a).join(', ') : String(a ?? ''));

/** Build the stored response record (see README → "Data stored per response"). */
export function buildResponse({ studentId, module, item, cfg, level, stepType, attempts, hintsUsed = 0, supportUsed = {}, toolboxOpened = false, revealed = false, startedAt, endedAt = Date.now(), aiEvaluation = null }) {
  const last = attempts[attempts.length - 1];
  const ev = last.ev;
  const allTags = [...new Set(attempts.flatMap((a) => a.ev.errorTags || []))];
  return {
    id: `r_${endedAt.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    studentId,
    moduleId: module.id,
    activityId: item.id,
    grammarSkill: item.grammarSkill || module.grammarSkill,
    vocabularySets: setsForWords(item.requiredVocabulary || []),
    theme: item.theme || module.theme,
    difficulty: level || null,
    stepType,
    exerciseType: cfg.type,
    stage: stepType === 'exit' ? 'E' : effectiveStage(cfg, supportUsed, hintsUsed),
    originalResponse: answerText(attempts[0].answer),
    finalResponse: answerText(last.answer),
    correctedResponse: ev.correct ? answerText(last.answer) : modelAnswer(item, cfg),
    correct: !!ev.correct,
    grammarCorrect: !!ev.grammarCorrect,
    vocabularyCorrect: ev.vocabularyCorrect !== false,
    spellingCorrect: ev.spellingCorrect !== false,
    firstTryCorrect: !!attempts[0].ev.correct,
    attempts: attempts.length,
    attemptLog: attempts.map((a) => ({ answer: answerText(a.answer), tags: a.ev.errorTags || [], feedbackLevel: a.feedbackLevel ?? null })),
    hintsUsed,
    supportUsed,
    toolboxOpened,
    revealed,
    errorTags: allTags,
    firstErrorTag: attempts[0].ev.primaryTag || null,
    needsTeacherReview: !!ev.needsTeacherReview,
    unknownWords: ev.details?.unknownWords || [],
    aiEvaluation,
    isExitTicket: stepType === 'exit',
    timestamp: new Date(endedAt).toISOString(),
    timeSpentSec: startedAt ? Math.max(1, Math.round((endedAt - startedAt) / 1000)) : null,
    teacherOverride: null,
    teacherFeedback: null,
  };
}
