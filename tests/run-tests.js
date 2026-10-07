// Run: npm test — checks the deterministic evaluator against the cases from the spec.
import { evaluateSentence, evaluateFree, evaluateChoice } from '../public/js/logic/evaluate.js';

let fail = 0;
function check(name, got, expect) {
  const bad = Object.entries(expect).filter(([k, v]) => {
    if (k === 'tags') return JSON.stringify([...got.errorTags].sort()) !== JSON.stringify([...v].sort());
    if (k === 'hasTag') return !got.errorTags.includes(v);
    return got[k] !== v;
  });
  if (bad.length) {
    fail++;
    console.log('✗', name, '\n   expected', expect, '\n   got', { correct: got.correct, grammarCorrect: got.grammarCorrect, spellingCorrect: got.spellingCorrect, vocabularyCorrect: got.vocabularyCorrect, tags: got.errorTags, details: got.details });
  } else console.log('✓', name);
}

const sheUses = { acceptedAnswers: ['She uses her phone every day.', 'Every day she uses her phone.'], target: { person: 'third', verb: 'use', form: 'uses' } };
const brother = { acceptedAnswers: ['My brother watches videos every day.'], target: { person: 'third', verb: 'watch', form: 'watches' } };
const weWatch = { acceptedAnswers: ['We watch videos on weekends.'], target: { person: 'plural', verb: 'watch', form: 'watch' } };

check('exact', evaluateSentence('She uses her phone every day.', sheUses), { correct: true });
check('no punctuation / lowercase', evaluateSentence('she uses her phone every day', sheUses), { correct: true });
check('alternative order accepted', evaluateSentence('Every day she uses her phone', sheUses), { correct: true });
check('determiner flex', evaluateSentence('She uses the phone every day.', sheUses), { correct: true });
check('missing S → THIRD_PERSON_S', evaluateSentence('She use her phone every day.', sheUses), { correct: false, grammarCorrect: false, tags: ['THIRD_PERSON_S'] });
check('overgeneralised S (We watches)', evaluateSentence('We watches videos on weekends.', weWatch), { grammarCorrect: false, tags: ['THIRD_PERSON_S'] });
check('watchs → grammar ✓ spelling ✗', evaluateSentence('My brother watchs videos every day.', brother), { grammarCorrect: true, spellingCorrect: false, tags: ['SPELLING'] });
check('typo in another word', evaluateSentence('My brother watches vidoes every day.', brother), { grammarCorrect: true, spellingCorrect: false, tags: ['SPELLING'] });
check('She using → AM_IS_ARE', evaluateSentence('She using her phone every day.', sheUses), { grammarCorrect: false, hasTag: 'AM_IS_ARE' });
check('She is using → TENSE_SELECTION', evaluateSentence('She is using her phone every day.', sheUses), { grammarCorrect: false, hasTag: 'TENSE_SELECTION' });
check('wrong verb, right grammar → VOCABULARY', evaluateSentence('She looks her phone every day.', sheUses), { grammarCorrect: true, vocabularyCorrect: false, hasTag: 'VOCABULARY' });
check('missing time word', evaluateSentence('She uses her phone.', sheUses), { grammarCorrect: true, correct: false, hasTag: 'MISSING_WORDS' });
check('word order', evaluateSentence('She uses every day her phone.', sheUses), { grammarCorrect: true, correct: false, hasTag: 'WORD_ORDER' });
check('wrong pronoun he/she', evaluateSentence('He uses his phone every day.', sheUses), { grammarCorrect: true, hasTag: 'SUBJECT_PRONOUN' });

check('free: Omar calls his friend after school', evaluateFree('Omar calls his friend after school.', { target: { person: 'third' } }), { correct: true });
check('free: Omar call his friend', evaluateFree('Omar call his friend after school.', { target: { person: 'third' } }), { grammarCorrect: false, hasTag: 'THIRD_PERSON_S' });
check('free: My sister watchs videos', evaluateFree('My sister watchs videos every day.', { target: { person: 'third' } }), { grammarCorrect: true, spellingCorrect: false });
check('free: I watch videos at night', evaluateFree('I watch videos at night.', { target: { person: 'first' } }), { correct: true });
check('free: I watches videos', evaluateFree('I watches videos at night.', { target: { person: 'first' } }), { grammarCorrect: false, hasTag: 'THIRD_PERSON_S' });
check('free: unknown word is not an error', evaluateFree('My dad watches football every day.', { target: { person: 'third' } }), { grammarCorrect: true, correct: true });

check('choice right', evaluateChoice('uses', { answer: 'uses' }), { correct: true });
check('choice base → THIRD_PERSON_S', evaluateChoice('use', { answer: 'uses' }), { correct: false, tags: ['THIRD_PERSON_S'] });
check('choice watchs → SPELLING', evaluateChoice('watchs', { answer: 'watches' }), { grammarCorrect: true, tags: ['SPELLING'] });

console.log(fail ? `\n${fail} failing` : '\nAll evaluator tests pass');
process.exit(fail ? 1 : 0);
