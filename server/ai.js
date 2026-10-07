// OPTIONAL AI evaluation — used only for open-ended production (free writing).
// Controlled grammar exercises are always checked deterministically in the browser.
// Active only when the Anthropic SDK is installed (npm install) and ANTHROPIC_API_KEY (or an `ant auth login` profile) is available.

let client = null;
let tried = false;

async function getClient() {
  if (tried) return client;
  tried = true;
  if (process.env.AI_FEEDBACK === 'off') return null;
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    client = new Anthropic();
  } catch {
    client = null;
  }
  return client;
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['grammarCorrect', 'tenseCorrect', 'wordOrderCorrect', 'comprehensible', 'vocabularyOk', 'spellingCorrect', 'errorTags', 'feedback', 'wellDone', 'fixes', 'betterSentence'],
  properties: {
    grammarCorrect: { type: 'boolean', description: 'Is the TARGET structure used correctly?' },
    tenseCorrect: { type: 'boolean' },
    wordOrderCorrect: { type: 'boolean' },
    comprehensible: { type: 'boolean' },
    vocabularyOk: { type: 'boolean' },
    spellingCorrect: { type: 'boolean' },
    errorTags: { type: 'array', items: { type: 'string', enum: ['SUBJECT_PRONOUN', 'THIRD_PERSON_S', 'AM_IS_ARE', 'ING_FORM', 'TENSE_SELECTION', 'DONT_DOESNT', 'DOES_BASE_VERB', 'PROGRESSIVE_NEGATIVE', 'DO_DOES_QUESTION', 'BE_QUESTION', 'WH_QUESTION', 'WORD_ORDER', 'SPELLING', 'VOCABULARY'] } },
    feedback: { type: 'string', description: 'One or two short sentences in the student support language.' },
    wellDone: { type: 'array', items: { type: 'string' }, description: 'Exactly 2 short things the student did well (support language).' },
    fixes: { type: 'array', items: { type: 'string' }, description: 'Up to 2 very specific corrections, quoting the student’s words (support language). Empty if correct.' },
    betterSentence: { type: 'string', description: 'The student’s own sentence with only the needed corrections, at the same simple level. Same as the student sentence if correct.' },
  },
};

// structures beyond the 3rd-person S lesson
const TARGET_TEXT = { pp: 'am / is / are + verb-ing (happening now)', ps_neg: "don't / doesn't + base verb", pp_neg: "am not / isn't / aren't + verb-ing", ps_q: 'Do / Does + subject + base verb ?', pp_q: 'Am / Is / Are + subject + verb-ing ?', wh_ps: 'WH word + do / does + subject + base verb ?', wh_pp: 'WH word + am / is / are + subject + verb-ing ?' };

const LANG_NAMES = { he: 'Hebrew', ru: 'Russian', ar: 'spoken Palestinian (Jerusalem) Arabic', en: 'very simple English' };

/**
 * @returns AI evaluation object, or null when AI is not available (the browser's rule-based check is then used).
 */
export async function evaluateOpen({ answer, instruction, target, taughtGrammar, language }) {
  const c = await getClient();
  if (!c) return null;
  const system = [
    'You check one English sentence written by a 7th–8th grade English learner (some have learning disabilities or ADHD).',
    `Target grammar of this task: ${TARGET_TEXT[target?.structure] || (target?.person === 'first' ? 'I + base verb (no S), Present Simple' : 'he / she / it (or one named person) + verb + S, Present Simple')}.`,
    `Grammar the class has been taught so far: ${taughtGrammar.join(', ')}. Do NOT expect or suggest any other grammar.`,
    'Judge in this order: target structure, tense choice, word order, comprehensibility, vocabulary, spelling.',
    'A spelling mistake is NOT a grammar mistake. A different but sensible word is a vocabulary note, not a grammar mistake.',
    `Write "feedback" in ${LANG_NAMES[language] || 'Hebrew'}, max 2 short sentences, kind and concrete, quoting the student's own words, e.g. "You wrote 'He use'. With HE, add S → 'He uses'."`,
    'Feedback format (from the teacher): 2 things done well, up to 2 very specific corrections, and 1 better version of the SAME sentence.',
    'Never rewrite the sentence into more advanced English. Never use punishment language.',
  ].join('\n');
  try {
    const response = await c.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 2000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
      system,
      messages: [{ role: 'user', content: `Task: ${instruction}\nStudent sentence: ${answer}` }],
    });
    if (response.stop_reason === 'refusal') return null;
    const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    return JSON.parse(text);
  } catch (err) {
    console.warn('AI evaluation unavailable, using rule-based check:', err?.message || err);
    return null;
  }
}
