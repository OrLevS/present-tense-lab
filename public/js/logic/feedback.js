// Progressive feedback: never reveal the answer after the first mistake.
//   wrong #1 → a guiding question about the concept
//   wrong #2 → the rule, applied to what the student wrote
//   wrong #3 → show a correct answer (student may type it once)
// Feedback stays at the student's level: it names the student's own words, it does not rewrite their English.

import { t } from '../i18n.js';

const q = (s) => (s ? `“${s}”` : '');

export function maxWrongBeforeReveal(item, cfg) {
  const type = cfg?.type || item.type;
  const options = cfg?.options || item.options;
  if ((type === 'multiple_choice' || type === 'choose_sentence') && options && options.length <= 2) return 2;
  return 3;
}

/**
 * @param ev     evaluation result (from evaluate.js)
 * @param wrong  how many wrong attempts so far, including this one
 * @returns { kind: 'success'|'hint'|'reveal', text, rule, reveal, models }
 */
export function buildFeedback(ev, wrong, item, cfg = {}, { hintsUsed = 0, freeProduction = false } = {}) {
  if (ev.correct) {
    const text = hintsUsed || wrong ? t('correct_after_help') : t(['correct_1', 'correct_2', 'correct_3'][Math.floor(Math.random() * 3)]);
    return { kind: 'success', text };
  }

  const d = ev.details || {};
  const tag = ev.primaryTag;
  const subject = d.subject ? d.subject.replace(/^./, (c) => c.toUpperCase()) : '';
  const wrote = [d.subject, d.verbToken].filter(Boolean).join(' ').replace(/^./, (c) => c.toUpperCase());

  if (freeProduction && wrong >= 2) {
    return { kind: 'reveal', text: t('model_answer'), models: item.models || [], rule: ruleFor(tag, ev) };
  }
  if (!freeProduction && wrong >= maxWrongBeforeReveal(item, cfg)) {
    return { kind: 'reveal', text: t('reveal_title'), reveal: ev.bestMatch || cfg.answer || item.answer || (item.acceptedAnswers || [])[0] };
  }

  const level = wrong <= 1 ? 1 : 2;
  let text;
  switch (tag) {
    case 'THIRD_PERSON_S': {
      const needS = /s$/i.test(d.expectedVerb || '') && !/s$/i.test(d.verbToken || '');
      const key = needS ? `fb_s_need_${level}` : `fb_s_extra_${level}`;
      text = t(key, { subject: q(subject || '—'), wrote: q(wrote) });
      break;
    }
    case 'SPELLING': {
      const [w, e] = (d.misspelled || [])[0] || [d.verbToken, d.expectedVerb];
      text = level === 1 ? t('fb_spelling_1', { wrote: q(w) }) : t('fb_spelling_2', { expected: q(e) });
      break;
    }
    case 'VOCABULARY':
      text = level === 1 ? t('fb_vocab_1') : t('fb_vocab_2', { expected: q(d.expectedVerb || (d.missing || []).join(' ')) });
      break;
    case 'MISSING_WORDS':
      text = level === 1 ? t('fb_missing_1') : t('fb_missing_2', { expected: q((d.missing || []).join(' · ')) });
      break;
    case 'WORD_ORDER':
      text = level === 1 ? t('fb_order_1') : t('fb_order_2');
      break;
    case 'SUBJECT_PRONOUN':
      text = level === 1 ? t('fb_pronoun_1') : t('fb_pronoun_2', { expected: q(firstWord(ev.bestMatch)) });
      break;
    case 'AM_IS_ARE':
      text = level === 1 ? t('fb_be_1', { subject: q(subject || '—') }) : t('fb_be_2', { subject: q(subject || '—'), expected: q(d.expectedBe || 'am / is / are') });
      break;
    case 'ING_FORM':
      text = level === 1 ? t('fb_ing_1') : t('fb_ing_2', { wrote: q(d.verbToken), expected: q(d.expectedVerb) });
      break;
    case 'TENSE_SELECTION':
      // did the task want "habit" (Simple) or "now" (Progressive)?
      if (item.target?.structure === 'pp' || item.target?.structure === 'pp_neg' || item.target?.structure === 'pp_q') text = level === 1 ? t('fb_now_1') : t('fb_now_2');
      else if (item.target?.structure && item.target.structure !== 'ps') text = level === 1 ? t('fb_now_1') : t('fb_now_2');
      else text = level === 1 ? t('fb_tense_1') : t('fb_tense_2', { expected: q(d.expectedVerb) });
      break;
    case 'DONT_DOESNT':
      text = level === 1 ? t('fb_dont_1') : t('fb_dont_2');
      break;
    case 'DOES_BASE_VERB':
      text = level === 1 ? t('fb_doesbase_1') : t('fb_doesbase_2', { expected: q(d.expectedVerb) });
      break;
    case 'PROGRESSIVE_NEGATIVE':
      text = level === 1 ? t('fb_ppneg_1') : t('fb_ppneg_2');
      break;
    case 'DO_DOES_QUESTION':
      text = level === 1 ? t('fb_doq_1') : t('fb_doq_2');
      break;
    case 'BE_QUESTION':
      text = level === 1 ? t('fb_beq_1') : t('fb_beq_2', { expected: q(d.expectedBe ? d.expectedBe[0].toUpperCase() + d.expectedBe.slice(1) : 'Am / Is / Are') });
      break;
    case 'WH_QUESTION':
      text = level === 1 ? t('fb_wh_1') : t('fb_wh_2');
      break;
    case 'SORT':
      text = level === 1 ? t('fb_sort_1', { n: ev.wrongCount || 1 }) : t('fb_sort_2');
      break;
    default:
      text = t('fb_generic_1');
  }
  return { kind: 'hint', level, text, rule: level === 2 ? ruleFor(tag, ev) : null };
}

function firstWord(s) {
  return String(s || '').split(' ')[0];
}

export function ruleFor(tag, ev) {
  if (tag === 'THIRD_PERSON_S') return /s$/i.test(ev.details?.expectedVerb || '') ? 'third' : 'no_s';
  if (tag === 'SPELLING') return 'es';
  if (tag === 'WORD_ORDER') return 'order';
  if (tag === 'AM_IS_ARE' || tag === 'BE_QUESTION') return 'be';
  if (tag === 'ING_FORM') return 'ing';
  if (tag === 'TENSE_SELECTION') return 'now_vs_habit';
  if (tag === 'DONT_DOESNT' || tag === 'DOES_BASE_VERB') return 'ps_neg';
  if (tag === 'PROGRESSIVE_NEGATIVE') return 'pp_neg';
  if (tag === 'DO_DOES_QUESTION') return 'ps_q';
  if (tag === 'WH_QUESTION') return 'wh';
  return null;
}

// Rule cards shown as visual support (English, LTR).
export const RULE_CARDS = {
  third: { left: 'he / she / it', right: 'verb + S', example: 'She uses · He calls · Maya watches' },
  both: { left: 'he / she / it', right: 'verb + S', example: 'I / you / we / they → verb (no S)' },
  no_s: { left: 'I / you / we / they', right: 'verb', example: 'I use · We call · They watch' },
  es: { left: 'ch · sh · s · x', right: '+ es', example: 'watch → watches' },
  order: { left: 'Who?', right: 'does what? → what? → when?', example: 'She · uses · her phone · every day' },
  habit: { left: 'every day', right: 'verb (+S)', example: 'She uses her phone every day.' },
  be: { left: 'I → am · he / she / it → is', right: 'you / we / they → are', example: 'I am · She is · They are' },
  ing: { left: 'verb', right: '+ ing', example: 'play → playing · use → using · chat → chatting' },
  pp: { left: 'am / is / are', right: '+ verb-ing', example: 'She is using her phone now.' },
  now_vs_habit: { left: 'now → am / is / are + ing', right: 'every day → verb (+S)', example: 'She is reading now. · She reads every day.' },
  ps_neg: { left: "don't / doesn't", right: '+ verb (no S)', example: "I don't call · She doesn't call" },
  pp_neg: { left: "am not / isn't / aren't", right: '+ verb-ing', example: "She isn't calling. · They aren't playing." },
  ps_q: { left: 'Do / Does + subject', right: '+ verb (no S) ?', example: 'Does she call her mom?' },
  pp_q: { left: 'Am / Is / Are + subject', right: '+ verb-ing ?', example: 'Is she calling her mom?' },
  wh: { left: 'WH + do / does + subject + verb ?', right: 'WH + am / is / are + subject + verb-ing ?', example: 'Where does she read? · What is she reading?' },
};
