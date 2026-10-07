// Grammar skill tree for the unit. Pure data — no UI here.
// Every name is given in all support languages: he / ru / ar (Jerusalem spoken) / en.

export const UNIT = {
  id: 'present_simple_vs_progressive',
  grade: '7-8',
  title: {
    en: 'Present Simple vs. Present Progressive',
    he: 'Present Simple מול Present Progressive',
    ru: 'Present Simple и Present Progressive',
    ar: 'Present Simple مقابل Present Progressive',
  },
};

export const SKILLS = [
  {
    id: 'subject_pronouns', order: 1, prerequisites: [],
    name: { en: 'Subject pronouns', he: 'כינויי גוף', ru: 'Личные местоимения', ar: 'الضماير' },
    short: 'I / you / he / she…',
  },
  {
    id: 'ps_i_you_we_they', order: 2, prerequisites: ['subject_pronouns'],
    name: { en: 'Present Simple: I / you / we / they', he: 'Present Simple: I / you / we / they', ru: 'Present Simple: I / you / we / they', ar: 'Present Simple: I / you / we / they' },
    short: 'I play',
  },
  {
    id: 'third_person_s', order: 3, prerequisites: ['ps_i_you_we_they'],
    name: { en: 'He / she / it + S', he: 'He / she / it + S', ru: 'He / she / it + S', ar: 'He / she / it + S' },
    short: 'she plays',
  },
  {
    id: 'time_words', order: 4, prerequisites: ['subject_pronouns'],
    name: { en: 'Time words for routines', he: 'מילות זמן לשגרה', ru: 'Слова времени (привычки)', ar: 'كلمات الوقت للروتين' },
    short: 'every day',
  },
  {
    id: 'am_is_are', order: 5, prerequisites: ['subject_pronouns'],
    name: { en: 'am / is / are', he: 'am / is / are', ru: 'am / is / are', ar: 'am / is / are' },
    short: 'she is',
  },
  {
    id: 'verb_ing', order: 6, prerequisites: [],
    name: { en: 'verb + ing', he: 'פועל + ing', ru: 'глагол + ing', ar: 'فعل + ing' },
    short: 'playing',
  },
  {
    id: 'pp_statements', order: 7, prerequisites: ['am_is_are', 'verb_ing'],
    name: { en: 'Present Progressive', he: 'Present Progressive', ru: 'Present Progressive', ar: 'Present Progressive' },
    short: 'she is playing',
  },
  {
    id: 'ps_vs_pp', order: 8, prerequisites: ['third_person_s', 'time_words', 'pp_statements'],
    name: { en: 'Simple or Progressive? (meaning)', he: 'Simple או Progressive? (משמעות)', ru: 'Simple или Progressive? (смысл)', ar: 'Simple ولا Progressive؟ (المعنى)' },
    short: 'every day / now',
  },
  {
    id: 'ps_negative', order: 9, prerequisites: ['third_person_s'],
    name: { en: "Negative: don't / doesn't", he: "שלילה: don't / doesn't", ru: "Отрицание: don't / doesn't", ar: "النفي: don't / doesn't" },
    short: "she doesn't play",
  },
  {
    id: 'pp_negative', order: 10, prerequisites: ['pp_statements'],
    name: { en: "Negative: am not / isn't / aren't", he: "שלילה: am not / isn't / aren't", ru: "Отрицание: am not / isn't / aren't", ar: "النفي: am not / isn't / aren't" },
    short: "she isn't playing",
  },
  {
    id: 'ps_questions', order: 11, prerequisites: ['ps_negative'],
    name: { en: 'Questions: Do / Does', he: 'שאלות: Do / Does', ru: 'Вопросы: Do / Does', ar: 'أسئلة: Do / Does' },
    short: 'Does she play?',
  },
  {
    id: 'pp_questions', order: 12, prerequisites: ['pp_negative'],
    name: { en: 'Questions: Am / Is / Are', he: 'שאלות: Am / Is / Are', ru: 'Вопросы: Am / Is / Are', ar: 'أسئلة: Am / Is / Are' },
    short: 'Is she playing?',
  },
  {
    id: 'wh_questions', order: 13, prerequisites: ['ps_questions', 'pp_questions'],
    name: { en: 'WH questions', he: 'שאלות WH', ru: 'Вопросы WH', ar: 'أسئلة WH' },
    short: 'What does she…?',
  },
  {
    id: 'mixed_practice', order: 14, prerequisites: ['ps_vs_pp', 'wh_questions'],
    name: { en: 'Mixed practice', he: 'תרגול משולב', ru: 'Смешанная практика', ar: 'تمرين مخلوط' },
    short: '',
  },
  {
    id: 'independent_production', order: 15, prerequisites: ['mixed_practice'],
    name: { en: 'Independent writing', he: 'כתיבה עצמאית', ru: 'Самостоятельное письмо', ar: 'كتابة لحالك' },
    short: '',
  },
];

// Columns of the teacher's class overview table. Each column groups one or more skills.
export const OVERVIEW_COLUMNS = [
  { id: 'third_person_s', label: 'He/she/it + S', skills: ['third_person_s'] },
  { id: 'am_is_are', label: 'am/is/are', skills: ['am_is_are'] },
  { id: 'ing', label: '-ing', skills: ['verb_ing'] },
  { id: 'tense', label: 'Simple/Progressive', skills: ['ps_vs_pp'] },
  { id: 'negatives', label: 'Negatives', skills: ['ps_negative', 'pp_negative'] },
  { id: 'questions', label: 'Questions', skills: ['ps_questions', 'pp_questions', 'wh_questions'] },
];

export const ERROR_TAGS = {
  SUBJECT_PRONOUN: { he: 'כינוי גוף', en: 'Subject pronoun' },
  THIRD_PERSON_S: { he: 'S בגוף שלישי', en: 'Third-person S' },
  AM_IS_ARE: { he: 'am / is / are', en: 'am / is / are' },
  ING_FORM: { he: 'צורת ing', en: '-ing form' },
  TENSE_SELECTION: { he: 'בחירת זמן', en: 'Tense selection' },
  DONT_DOESNT: { he: "don't / doesn't", en: "don't / doesn't" },
  DOES_BASE_VERB: { he: 'does + פועל בסיס', en: 'does + base verb' },
  PROGRESSIVE_NEGATIVE: { he: 'שלילה ב-Progressive', en: 'Progressive negative' },
  DO_DOES_QUESTION: { he: 'שאלה Do / Does', en: 'Do / Does question' },
  BE_QUESTION: { he: 'שאלה Am / Is / Are', en: 'Am / Is / Are question' },
  WORD_ORDER: { he: 'סדר מילים', en: 'Word order' },
  WH_QUESTION: { he: 'שאלות WH', en: 'WH question' },
  SPELLING: { he: 'כתיב', en: 'Spelling' },
  VOCABULARY: { he: 'אוצר מילים', en: 'Vocabulary' },
  MISSING_WORDS: { he: 'חסרות מילים', en: 'Missing words' },
};
