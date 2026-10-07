// Grammar Toolbox — always available. Each card belongs to a skill;
// students only see cards for skills their teacher has already unlocked. The rest show as 🔒.

export const TOOLBOX = [
  {
    group: 'PRONOUNS', skill: 'subject_pronouns',
    lines: [{ label: 'I · you · he · she · it · we · they' }],
  },
  {
    group: 'PRESENT SIMPLE', skill: 'ps_i_you_we_they',
    lines: [{ label: 'I / you / we / they', value: 'play' }],
  },
  {
    group: 'PRESENT SIMPLE', skill: 'third_person_s',
    lines: [
      { label: 'he / she / it', value: 'plays', mark: 's' },
      { label: 'ch · sh · s · x', value: 'watch → watches', mark: 'es' },
      { label: 'my mom · Maya', value: '= she' },
      { label: 'my dad · Omar', value: '= he' },
    ],
  },
  {
    group: 'TIME WORDS', skill: 'time_words',
    lines: [{ label: 'every day · every morning · after school · at night · on weekends' }],
  },
  {
    group: 'PRESENT SIMPLE', skill: 'ps_negative',
    lines: [{ label: 'Negative', value: "don't / doesn't + verb" }],
  },
  {
    group: 'PRESENT SIMPLE', skill: 'ps_questions',
    lines: [{ label: 'Question', value: 'Do / Does + subject + verb?' }],
  },
  {
    group: 'BE', skill: 'am_is_are',
    lines: [{ label: 'I', value: 'am' }, { label: 'he / she / it', value: 'is' }, { label: 'you / we / they', value: 'are' }],
  },
  {
    group: 'VERB + ING', skill: 'verb_ing',
    lines: [{ label: 'play → playing · use → using · sit → sitting' }],
  },
  {
    group: 'PRESENT PROGRESSIVE', skill: 'pp_statements',
    lines: [{ label: 'am / is / are + verb-ing' }],
  },
  {
    group: 'PRESENT PROGRESSIVE', skill: 'pp_negative',
    lines: [{ label: 'Negative', value: "am not / isn't / aren't + verb-ing" }],
  },
  {
    group: 'PRESENT PROGRESSIVE', skill: 'pp_questions',
    lines: [{ label: 'Question', value: 'Am / Is / Are + subject + verb-ing?' }],
  },
];
