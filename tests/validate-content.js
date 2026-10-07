// npm run validate-content — checks every lesson before students see it:
//   • every word in a model answer exists in the vocabulary (so it can be gated by "taught")
//   • every prompt / instruction exists in all support languages (he / ru / ar / en)
//   • exercise types are known, skills exist
//   • SELF-CHECK: the model answer of every item is accepted by the checker, at every help level
import { LESSONS, REVIEW_MODULES, SKILL_BY_ID, allItems, vocabularyOf, modelSentences } from '../public/js/content/index.js';
import { resolveConfig, scoreAttempt } from '../public/js/logic/score.js';

const TYPES = new Set(['multiple_choice', 'choose_sentence', 'fill_blank', 'sentence_builder', 'translate', 'translate_multi', 'error_correction', 'free_production',
  'transform', 'sort', 'match', 'pair_fill', 'text_gaps', 'listen_choose', 'wh_scaffold']);
const STEP_TYPES = new Set(['warmup', 'words', 'guess', 'explain', 'learn', 'examples', 'check', 'choose', 'practice', 'produce', 'pause', 'exit', 'challenge']);
const LANGS = ['he', 'ru', 'ar', 'en'];
const problems = [];
const warn = (m, it, msg) => problems.push(`${m.id} › ${it?.id || '-'}: ${msg}`);
const fullL = (o) => o && LANGS.every((l) => typeof o[l] === 'string');

function modelAnswerFor(item, cfg) {
  switch (cfg.type) {
    case 'multiple_choice': case 'choose_sentence': case 'listen_choose': return cfg.answer;
    case 'fill_blank': return cfg.answer;
    case 'sentence_builder': return (item.chunks || cfg.chunks).join(' ') + '.';
    case 'translate': case 'error_correction': case 'transform': return item.acceptedAnswers[0];
    case 'translate_multi': return cfg.parts.map((p) => p.acceptedAnswers[0]);
    case 'pair_fill': return (cfg.answers || item.answers).map((a) => [].concat(a)[0]);
    case 'text_gaps': return item.chat.filter((c) => c.text.includes('___')).map((c) => [].concat(c.answer)[0]);
    case 'sort': return Object.fromEntries(item.cards.map((c, i) => [i, c.bucket]));
    case 'match': return Object.fromEntries(item.pairs.map((p, i) => [i, p.right]));
    case 'free_production': case 'wh_scaffold': return item.models[0];
    default: return null;
  }
}

for (const m of [...LESSONS, ...REVIEW_MODULES]) {
  if (!m.steps.length) { warn(m, null, 'lesson has no steps yet'); continue; }
  if (!fullL(m.title) || !fullL(m.goal)) warn(m, null, 'title/goal missing a language');
  for (const st of m.steps) {
    if (!STEP_TYPES.has(st.type)) warn(m, null, `unknown step type ${st.type}`);
    if (st.skill && !SKILL_BY_ID[st.skill]) warn(m, null, `unknown skill ${st.skill}`);
    if (st.title && !fullL(st.title)) warn(m, null, `step title missing a language (${st.id})`);
    for (const g of st.guess || []) { if (!fullL(g.question) || !fullL(g.reveal)) warn(m, g, 'guess text missing a language'); }
    if (st.learn && !fullL(st.learn.oneLine)) warn(m, null, `learn.oneLine missing a language (${st.id})`);
  }
  for (const it of allItems(m)) {
    if (!it || !it.id) { warn(m, it, 'item without id (missing reference?)'); continue; }
    if (it.grammarSkill && !SKILL_BY_ID[it.grammarSkill]) warn(m, it, `unknown grammarSkill ${it.grammarSkill}`);
    if (it.prompt && !fullL(it.prompt)) warn(m, it, 'prompt missing a language');
    if (it.instruction && !fullL(it.instruction)) warn(m, it, 'instruction missing a language');
    for (const p of it.parts || []) if (!fullL(p.prompt)) warn(m, it, 'part prompt missing a language');
    const levels = it.difficultyConfig || it.kind === 'sentence' ? ['easy', 'medium', 'hard'] : [null];
    for (const lv of levels) {
      for (const k of [0, 1, 2, 6]) {
        const cfg = resolveConfig(it, lv, k, 8);
        if (!cfg) continue;
        if (!TYPES.has(cfg.type)) { warn(m, it, `unknown type ${cfg.type}`); continue; }
        for (const s of modelSentences(it, cfg)) {
          const { unknown } = vocabularyOf(s);
          if (unknown.length) warn(m, it, `words not in vocabulary: ${unknown.join(', ')}  ← "${s}"`);
        }
        if (cfg.type === 'sentence_builder' && it.acceptedAnswers && !it.acceptedAnswers.some((a) => a.replace(/[.?!]$/, '') === (it.chunks || []).join(' '))) warn(m, it, `chunks do not form an accepted answer: ${(it.chunks || []).join(' ')}`);
        const ans = modelAnswerFor(it, cfg);
        if (ans == null) continue;
        const ev = scoreAttempt(it, cfg, ans);
        const ok = cfg.type === 'free_production' || cfg.type === 'wh_scaffold' ? ev.grammarCorrect : ev.correct;
        if (!ok) warn(m, it, `[${lv || '-'}/${cfg.type}] model answer is NOT accepted: ${JSON.stringify(ans)} → ${ev.errorTags?.join(',')}`);
      }
    }
  }
}

if (problems.length) { console.log([...new Set(problems)].join('\n')); console.log(`\n${new Set(problems).size} problem(s)`); process.exit(1); }
console.log(`Content OK — ${LESSONS.length} lesson(s), ${REVIEW_MODULES.length} review(s), every model answer passes its own check.`);
