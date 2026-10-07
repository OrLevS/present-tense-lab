// MODULE: He / she / it + S — theme: Phones.
// Everything the student sees comes from this data. The UI only knows exercise TYPES.
// Prompts exist in every support language: he / ru / ar (Jerusalem spoken) / en (meaning cues for English-only mode).

const L = (he, ru, ar, en) => ({ he, ru, ar, en });

// Shared "meaning" prompts (sentence the student must produce in English).
const P = {
  sheUses: L('היא משתמשת בטלפון שלה כל יום.', 'Она пользуется своим телефоном каждый день.', 'هي بتستعمل التلفون تبعها كل يوم.', 'she · use · her phone · every day'),
  brotherWatches: L('אחי צופה בסרטונים כל יום.', 'Мой брат смотрит видео каждый день.', 'أخوي بحضر فيديوهات كل يوم.', 'my brother · watch · videos · every day'),
  heCalls: L('הוא מתקשר לחבר שלו אחרי בית הספר.', 'Он звонит своему другу после школы.', 'هو بتّصل بصاحبه بعد المدرسة.', 'he · call · his friend · after school'),
  momReads: L('אמא שלי קוראת חדשות כל בוקר.', 'Моя мама читает новости каждое утро.', 'إمّي بتقرا الأخبار كل صبح.', 'my mom · read · the news · every morning'),
  weWatch: L('אנחנו צופים בסרטונים בסופי שבוע.', 'Мы смотрим видео по выходным.', 'إحنا بنحضر فيديوهات بالويكند.', 'we · watch · videos · on weekends'),
  sisterMessages: L('אחותי שולחת הודעות לחברות שלה כל יום.', 'Моя сестра пишет сообщения своим подругам каждый день.', 'أختي بتبعت مسجات لصاحباتها كل يوم.', 'my sister · message · her friends · every day'),
  iCall: L('אני מתקשר/ת לאבא שלי אחרי בית הספר.', 'Я звоню своему папе после школы.', 'أنا بتّصل بأبوي بعد المدرسة.', 'I · call · my dad · after school'),
  theyUse: L('הם משתמשים בטלפונים שלהם בלילה.', 'Они пользуются своими телефонами ночью.', 'همّ بستعملوا تلفوناتهم بالليل.', 'they · use · their phones · at night'),
  danaReads: L('דנה קוראת ספרים אחרי בית הספר.', 'Дана читает книги после школы.', 'دانا بتقرا كتب بعد المدرسة.', 'Dana · read · books · after school'),
  iWatchNight: L('אני צופה בסרטונים בלילה.', 'Я смотрю видео ночью.', 'أنا بحضر فيديوهات بالليل.', 'I · watch · videos · at night'),
  brotherWatchesNight: L('אחי צופה בסרטונים בלילה.', 'Мой брат смотрит видео ночью.', 'أخوي بحضر فيديوهات بالليل.', 'my brother · watch · videos · at night'),
  friendsUse: L('החברים שלי משתמשים בטלפונים שלהם כל יום.', 'Мои друзья пользуются своими телефонами каждый день.', 'صحابي بستعملوا تلفوناتهم كل يوم.', 'my friends · use · their phones · every day'),
  friendUses: L('החבר שלי משתמש בטלפון שלו כל יום.', 'Мой друг пользуется своим телефоном каждый день.', 'صاحبي بستعمل تلفونه كل يوم.', 'my friend · use · his phone · every day'),
  sisterReadsNews: L('אחותי קוראת חדשות כל יום.', 'Моя сестра читает новости каждый день.', 'أختي بتقرا الأخبار كل يوم.', 'my sister · read · the news · every day'),
  weWatchAfter: L('אנחנו צופים בסרטונים אחרי בית הספר.', 'Мы смотрим видео после школы.', 'إحنا بنحضر فيديوهات بعد المدرسة.', 'we · watch · videos · after school'),
  dadCallsMom: L('אבא שלי מתקשר לאמא שלי כל יום.', 'Мой папа звонит моей маме каждый день.', 'أبوي بتّصل بإمّي كل يوم.', 'my dad · call · my mom · every day'),
};

const FIND_MISTAKE = L('יש טעות אחת. כתבו את המשפט נכון.', 'Здесь одна ошибка. Напиши предложение правильно.', 'في غلطة وحدة. اكتب الجملة صحّ.', 'There is one mistake. Write the sentence correctly.');

export default {
  id: 'tps_phones',
  kind: 'module',
  grammarSkill: 'third_person_s',
  theme: 'phones',
  title: L('He / she / it + S · טלפונים', 'He / she / it + S · Телефоны', 'He / she / it + S · تلفونات', 'He / she / it + S · Phones'),
  goal: L(
    'אני יכול/ה לכתוב משפטים באנגלית עם he / she / it + S.',
    'Я могу писать предложения с he / she / it + S.',
    'بقدر أكتب جمل بالإنجليزي مع he / she / it + S.',
    'I can write English sentences with he / she / it + S.'
  ),
  requiredSkills: ['subject_pronouns', 'ps_i_you_we_they', 'time_words'],
  vocabularySets: ['phones_1', 'basics_people', 'basics_time', 'basics_things'],
  focusWords: ['phone', 'use', 'call', 'message', 'read', 'watch'],
  steps: ['words', 'guess', 'learn', 'examples', 'check', 'choose', 'practice', 'produce', 'exit'],

  // ---------- 1. FIRST YOU GUESS ----------
  guess: [
    {
      id: 'tps_g1',
      show: ['I use my phone every day.', 'She uses her phone every day.'],
      highlight: ['use', 'uses'],
      question: L('מה השתנה במשפט השני? נחשו!', 'Что изменилось во втором предложении? Угадай!', 'شو تغيّر بالجملة التانية؟ خمّن!', 'What changed in the second sentence? Guess!'),
      options: [
        { id: 'verb_s', label: L('הפועל קיבל S בסוף', 'У глагола появилась S в конце', 'الفعل صار في آخره S', 'The verb got an S at the end') },
        { id: 'phone', label: L('המילה phone השתנתה', 'Изменилось слово phone', 'كلمة phone تغيّرت', 'The word phone changed') },
        { id: 'nothing', label: L('שום דבר', 'Ничего', 'ولا إشي', 'Nothing') },
      ],
      answer: 'verb_s',
      reveal: L('use ← uses. הפועל קיבל S. עכשיו נגלה מתי.', 'use → uses. Глагол получил S. Сейчас узнаем, когда.', 'use ← uses. الفعل أخد S. هلّأ بنعرف إمتى.', 'use → uses. The verb got an S. Now let’s find out when.'),
    },
    {
      id: 'tps_g2',
      show: ['We watch videos.', 'He watches videos.', 'They call their friends.', 'She calls her friends.'],
      highlight: ['watches', 'calls'],
      question: L('מתי מוסיפים S? נחשו!', 'Когда добавляем S? Угадай!', 'إمتى منزيد S؟ خمّن!', 'When do we add S? Guess!'),
      options: [
        { id: 'he_she', label: L('עם he / she', 'С he / she', 'مع he / she', 'With he / she') },
        { id: 'we_they', label: L('עם we / they', 'С we / they', 'مع we / they', 'With we / they') },
        { id: 'always', label: L('תמיד', 'Всегда', 'دايمًا', 'Always') },
      ],
      answer: 'he_she',
      reveal: L('עם he / she / it מוסיפים S. עם I / you / we / they — לא.', 'С he / she / it добавляем S. С I / you / we / they — нет.', 'مع he / she / it منزيد S. مع I / you / we / they — لأ.', 'With he / she / it we add S. With I / you / we / they — no S.'),
    },
    {
      id: 'tps_g3',
      show: ['My brother ___ videos every day.'],
      highlight: [],
      question: L('נחשו: איזו מילה מתאימה?', 'Угадай: какое слово подходит?', 'خمّن: أيّ كلمة بتزبط؟', 'Guess: which word fits?'),
      options: [
        { id: 'watch', label: L('watch', 'watch', 'watch', 'watch'), en: true },
        { id: 'watches', label: L('watches', 'watches', 'watches', 'watches'), en: true },
      ],
      answer: 'watches',
      reveal: L('my brother = he ← watches.', 'my brother = he → watches.', 'my brother = he ← watches.', 'my brother = he → watches.'),
    },
  ],

  // ---------- 2. LEARN (short + visual) ----------
  learn: {
    oneLine: L('עם he / she / it — מוסיפים S לפועל.', 'С he / she / it — добавляем S к глаголу.', 'مع he / she / it — منزيد S عالفعل.', 'With he / she / it — add S to the verb.'),
    table: [
      { left: 'I / you / we / they', right: ['use', 'call', 'watch'] },
      { left: 'he / she / it', right: ['uses', 'calls', 'watches'], mark: 'es?' },
    ],
    notes: [
      {
        text: L('שם או אדם אחד = he / she', 'Имя или один человек = he / she', 'اسم أو شخص واحد = he / she', 'A name or one person = he / she'),
        examples: ['my brother = he', 'my mom = she', 'Maya = she'],
      },
      {
        text: L('אחרי ch / sh / s / x מוסיפים es', 'После ch / sh / s / x добавляем es', 'بعد ch / sh / s / x منزيد es', 'After ch / sh / s / x add es'),
        examples: ['watch → watches'],
      },
    ],
  },

  // ---------- 3. EXAMPLES ----------
  examples: [
    { en: 'My sister uses her phone every day.', highlight: 'uses', subjectNote: 'my sister = she', tr: L('אחותי משתמשת בטלפון שלה כל יום.', 'Моя сестра пользуется своим телефоном каждый день.', 'أختي بتستعمل التلفون تبعها كل يوم.', 'my sister = she') },
    { en: 'Omar calls his dad after school.', highlight: 'calls', subjectNote: 'Omar = he', tr: L('עומר מתקשר לאבא שלו אחרי בית הספר.', 'Омар звонит своему папе после школы.', 'عمر بتّصل بأبوه بعد المدرسة.', 'Omar = he') },
    { en: 'My dad reads the news every morning.', highlight: 'reads', subjectNote: 'my dad = he', tr: L('אבא שלי קורא חדשות כל בוקר.', 'Мой папа читает новости каждое утро.', 'أبوي بقرا الأخبار كل صبح.', 'my dad = he') },
    { en: 'I watch videos at night.', highlight: 'watch', subjectNote: 'I → no S', tr: L('אני צופה בסרטונים בלילה.', 'Я смотрю видео ночью.', 'أنا بحضر فيديوهات بالليل.', 'I → no S') },
    { en: 'Maya watches videos at night.', highlight: 'watches', subjectNote: 'Maya = she', tr: L('מאיה צופה בסרטונים בלילה.', 'Майя смотрит видео ночью.', 'مايا بتحضر فيديوهات بالليل.', 'Maya = she') },
  ],

  // ---------- 4. QUICK CHECK (recognition, same for everyone) ----------
  check: [
    { id: 'tps_c1', type: 'multiple_choice', stage: 'A', frame: 'He ___ his friend after school.', options: ['call', 'calls'], answer: 'calls', prompt: P.heCalls, target: { person: 'third', verb: 'call', form: 'calls' } },
    { id: 'tps_c2', type: 'multiple_choice', stage: 'A', frame: 'They ___ the news every morning.', options: ['read', 'reads'], answer: 'read', target: { person: 'plural', verb: 'read', form: 'read' } },
    { id: 'tps_c3', type: 'multiple_choice', stage: 'A', frame: 'My sister ___ videos every day.', options: ['watch', 'watches'], answer: 'watches', target: { person: 'third', verb: 'watch', form: 'watches' } },
    { id: 'tps_c4', type: 'choose_sentence', stage: 'A', options: ['She use her phone every day.', 'She uses her phone every day.'], answer: 'She uses her phone every day.', target: { person: 'third', verb: 'use', form: 'uses' } },
  ],

  // ---------- 5. PRACTICE: same target, three levels of scaffolding ----------
  // difficultyConfig[level] === null → item is skipped at that level.
  practice: [
    {
      id: 'tps_p01', prompt: P.sheUses, image: '👧📱',
      acceptedAnswers: ['She uses her phone every day.', 'Every day she uses her phone.', 'She uses the phone every day.', 'She uses a phone every day.'],
      chunks: ['She', 'uses', 'her phone', 'every day'],
      target: { person: 'third', verb: 'use', form: 'uses' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'multiple_choice', stage: 'A', frame: 'She ___ her phone every day.', options: ['use', 'uses'], answer: 'uses', showRule: true },
        medium: { type: 'sentence_builder', stage: 'C', distractors: ['use'] },
        hard: null,
      },
    },
    {
      id: 'tps_p02', prompt: P.brotherWatches, image: '👦🎬',
      acceptedAnswers: ['My brother watches videos every day.', 'Every day my brother watches videos.'],
      chunks: ['My brother', 'watches', 'videos', 'every day'],
      target: { person: 'third', verb: 'watch', form: 'watches' }, errorTags: ['THIRD_PERSON_S', 'SPELLING'],
      difficultyConfig: {
        easy: { type: 'multiple_choice', stage: 'A', frame: 'My brother ___ videos every day.', options: ['watch', 'watches'], answer: 'watches', showRule: true, subjectHint: 'my brother = he' },
        medium: { type: 'sentence_builder', stage: 'C', distractors: ['watch'] },
        hard: { type: 'translate', stage: 'E' },
      },
    },
    {
      id: 'tps_p03', prompt: P.heCalls, image: '👦📞',
      acceptedAnswers: ['He calls his friend after school.', 'After school he calls his friend.'],
      chunks: ['He', 'calls', 'his friend', 'after school'],
      target: { person: 'third', verb: 'call', form: 'calls' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'fill_blank', stage: 'B', frame: 'He ___ his friend after school.', base: 'call', answer: 'calls', showRule: true },
        medium: { type: 'translate', stage: 'D', verbSupplied: 'call', wordBank: 'optional' },
        hard: { type: 'error_correction', stage: 'E', wrong: 'He call his friend after school.', instruction: FIND_MISTAKE },
      },
    },
    {
      id: 'tps_p04', prompt: P.momReads, image: '👩📰',
      acceptedAnswers: ['My mom reads the news every morning.', 'My mom reads news every morning.', 'My mother reads the news every morning.', 'Every morning my mom reads the news.'],
      chunks: ['My mom', 'reads', 'the news', 'every morning'],
      target: { person: 'third', verb: 'read', form: 'reads' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'fill_blank', stage: 'B', frame: 'My mom ___ the news every morning.', base: 'read', answer: 'reads', showRule: true, subjectHint: 'my mom = she' },
        medium: { type: 'translate', stage: 'D', verbSupplied: 'read', wordBank: 'optional' },
        hard: null,
      },
    },
    {
      id: 'tps_p05', prompt: P.weWatch, image: '👫🎬',
      acceptedAnswers: ['We watch videos on weekends.', 'On weekends we watch videos.'],
      chunks: ['We', 'watch', 'videos', 'on weekends'],
      target: { person: 'plural', verb: 'watch', form: 'watch' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'multiple_choice', stage: 'A', frame: 'We ___ videos on weekends.', options: ['watch', 'watches'], answer: 'watch', showRule: true },
        medium: { type: 'translate', stage: 'D', wordBank: 'optional' },
        hard: null,
      },
    },
    {
      id: 'tps_p06', prompt: P.sisterMessages, image: '👧💬',
      acceptedAnswers: ['My sister messages her friends every day.', 'Every day my sister messages her friends.', 'My sister sends messages to her friends every day.'],
      chunks: ['My sister', 'messages', 'her friends', 'every day'],
      target: { person: 'third', verb: 'message', form: 'messages' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'sentence_builder', stage: 'C', distractors: ['message'], showRule: true },
        medium: { type: 'translate', stage: 'D', verbSupplied: 'message', wordBank: 'optional' },
        hard: { type: 'translate', stage: 'E' },
      },
    },
    {
      id: 'tps_p07', prompt: P.iCall, image: '🙋📞',
      acceptedAnswers: ['I call my dad after school.', 'After school I call my dad.', 'I call my father after school.'],
      chunks: ['I', 'call', 'my dad', 'after school'],
      target: { person: 'first', verb: 'call', form: 'call' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'sentence_builder', stage: 'C', distractors: ['calls'] },
        medium: { type: 'translate', stage: 'D', wordBank: 'optional' },
        hard: { type: 'translate', stage: 'E' },
      },
    },
    {
      id: 'tps_p08', prompt: P.theyUse, image: '👨‍👩‍👧🌙',
      acceptedAnswers: ['They use their phones at night.', 'At night they use their phones.', 'They use their phone at night.'],
      chunks: ['They', 'use', 'their phones', 'at night'],
      target: { person: 'plural', verb: 'use', form: 'use' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'translate', stage: 'D', wordBank: 'shown' },
        medium: { type: 'translate', stage: 'E', wordBank: 'optional' },
        hard: { type: 'translate', stage: 'E' },
      },
    },
    {
      id: 'tps_p09', prompt: P.danaReads, image: '👧📖',
      acceptedAnswers: ['Dana reads books after school.', 'After school Dana reads books.', 'Dana reads a book after school.'],
      chunks: ['Dana', 'reads', 'books', 'after school'],
      target: { person: 'third', verb: 'read', form: 'reads' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'translate', stage: 'D', wordBank: 'shown' },
        medium: { type: 'translate', stage: 'E', wordBank: 'optional' },
        hard: { type: 'error_correction', stage: 'E', wrong: 'Dana read books after school.', instruction: FIND_MISTAKE },
      },
    },
    // HARD-only: contextual comparison (two sentences, decide S / no S)
    {
      id: 'tps_h01',
      target: { person: 'mixed', verb: 'watch' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: null, medium: null,
        hard: {
          type: 'translate_multi', stage: 'E',
          parts: [
            { prompt: P.iWatchNight, acceptedAnswers: ['I watch videos at night.', 'At night I watch videos.'], target: { person: 'first', verb: 'watch', form: 'watch' } },
            { prompt: P.brotherWatchesNight, acceptedAnswers: ['My brother watches videos at night.', 'At night my brother watches videos.'], target: { person: 'third', verb: 'watch', form: 'watches' } },
          ],
        },
      },
    },
    {
      id: 'tps_h02',
      target: { person: 'mixed', verb: 'use' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: null, medium: null,
        hard: {
          type: 'translate_multi', stage: 'E',
          parts: [
            { prompt: P.friendsUse, acceptedAnswers: ['My friends use their phones every day.', 'Every day my friends use their phones.'], target: { person: 'plural', verb: 'use', form: 'use' } },
            { prompt: P.friendUses, acceptedAnswers: ['My friend uses his phone every day.', 'Every day my friend uses his phone.', 'My friend uses her phone every day.'], target: { person: 'third', verb: 'use', form: 'uses' } },
          ],
        },
      },
    },
    // Extension that needs Phones 2 vocabulary — stays hidden until the teacher marks "send" as taught.
    {
      id: 'tps_x01', prompt: L('אחי שולח הודעות לאמא שלי כל יום.', 'Мой брат отправляет сообщения моей маме каждый день.', 'أخوي ببعت مسجات لإمّي كل يوم.', 'my brother · send · messages · to my mom · every day'),
      acceptedAnswers: ['My brother sends messages to my mom every day.', 'Every day my brother sends messages to my mom.'],
      chunks: ['My brother', 'sends', 'messages', 'to my mom', 'every day'],
      target: { person: 'third', verb: 'send', form: 'sends' }, errorTags: ['THIRD_PERSON_S'],
      difficultyConfig: {
        easy: { type: 'sentence_builder', stage: 'C', distractors: ['send'] },
        medium: { type: 'translate', stage: 'D', wordBank: 'optional' },
        hard: { type: 'translate', stage: 'E' },
      },
    },
  ],

  // ---------- 6. INDEPENDENT PRODUCTION (original sentences) ----------
  produce: [
    {
      id: 'tps_w1', type: 'free_production', stage: 'G',
      situation: { emoji: '👦 📞 🏫', caption: 'Omar · after school' },
      instruction: L('הסתכלו על התמונה. מה עומר עושה אחרי בית הספר? כתבו משפט אחד.', 'Посмотри на картинку. Что Омар делает после школы? Напиши одно предложение.', 'اطّلع عالصورة. شو عمر بعمل بعد المدرسة؟ اكتب جملة وحدة.', 'Look at the picture. What does Omar do after school? Write one sentence.'),
      target: { person: 'third', verbs: ['call'], subject: 'Omar' },
      starter: 'Omar …',
      models: ['Omar calls his friend after school.', 'Omar calls his mom after school.'],
    },
    {
      id: 'tps_w2', type: 'free_production', stage: 'G',
      situation: { emoji: '👧 📰 📱 🌅', caption: 'Maya · every morning' },
      instruction: L('מה מאיה עושה כל בוקר? כתבו משפט אחד.', 'Что Майя делает каждое утро? Напиши одно предложение.', 'شو مايا بتعمل كل صبح؟ اكتب جملة وحدة.', 'What does Maya do every morning? Write one sentence.'),
      target: { person: 'third', verbs: ['read', 'use', 'watch'], subject: 'Maya' },
      starter: 'Maya …',
      models: ['Maya reads the news every morning.', 'Maya reads the news on her phone every morning.'],
    },
    {
      id: 'tps_w3', type: 'free_production', stage: 'F',
      instruction: L('כתבו על אדם אחד מהמשפחה שלכם: מה הוא/היא עושה עם הטלפון?', 'Напиши про одного человека из твоей семьи: что он/она делает с телефоном?', 'اكتب عن شخص واحد من عيلتك: شو بعمل/بتعمل بالتلفون؟', 'Write about one person in your family: what does he or she do with the phone?'),
      target: { person: 'third', verbs: ['use', 'call', 'message', 'read', 'watch'] },
      starter: 'My …',
      models: ['My sister watches videos every day.', 'My dad calls my mom after school.'],
    },
    {
      id: 'tps_w4', type: 'free_production', stage: 'F',
      instruction: L('ועכשיו עליכם: מה אתם עושים עם הטלפון? התחילו ב-I.', 'А теперь о себе: что ты делаешь с телефоном? Начни с I.', 'وهلّأ عنك: شو بتعمل بالتلفون؟ ابدا بـ I.', 'Now about you: what do you do with your phone? Start with I.'),
      target: { person: 'first', verbs: ['use', 'call', 'message', 'read', 'watch'] },
      starter: 'I …',
      models: ['I watch videos at night.', 'I call my friend every day.'],
    },
  ],

  // ---------- 7. EXIT TICKET (no levels, no automatic hints, 2–4 items) ----------
  exitTicket: [
    { id: 'tps_e1', type: 'translate', stage: 'E', prompt: P.sisterReadsNews, acceptedAnswers: ['My sister reads the news every day.', 'My sister reads news every day.', 'Every day my sister reads the news.'], target: { person: 'third', verb: 'read', form: 'reads' } },
    { id: 'tps_e2', type: 'translate', stage: 'E', prompt: P.weWatchAfter, acceptedAnswers: ['We watch videos after school.', 'After school we watch videos.'], target: { person: 'plural', verb: 'watch', form: 'watch' } },
    { id: 'tps_e3', type: 'translate', stage: 'E', prompt: P.dadCallsMom, acceptedAnswers: ['My dad calls my mom every day.', 'My father calls my mother every day.', 'Every day my dad calls my mom.'], target: { person: 'third', verb: 'call', form: 'calls' } },
  ],

  // ---------- Short targeted repair activities (3 items each) ----------
  remediation: {
    THIRD_PERSON_S: [
      { id: 'tps_r1', type: 'multiple_choice', stage: 'A', frame: 'Maya ___ videos every day.', options: ['watch', 'watches'], answer: 'watches', showRule: true, subjectHint: 'Maya = she', target: { person: 'third', verb: 'watch', form: 'watches' } },
      { id: 'tps_r2', type: 'multiple_choice', stage: 'A', frame: 'I ___ my mom every day.', options: ['call', 'calls'], answer: 'call', showRule: true, target: { person: 'first', verb: 'call', form: 'call' } },
      { id: 'tps_r3', type: 'fill_blank', stage: 'B', frame: 'My dad ___ the news every morning.', base: 'read', answer: 'reads', showRule: true, subjectHint: 'my dad = he', target: { person: 'third', verb: 'read', form: 'reads' } },
    ],
    SPELLING: [
      { id: 'tps_rs1', type: 'multiple_choice', stage: 'A', frame: 'My brother ___ videos.', options: ['watchs', 'watches'], answer: 'watches', showRule: true, ruleKey: 'es', target: { person: 'third', verb: 'watch', form: 'watches' } },
      { id: 'tps_rs2', type: 'multiple_choice', stage: 'A', frame: 'She ___ her phone.', options: ['uses', 'usees'], answer: 'uses', showRule: true, target: { person: 'third', verb: 'use', form: 'uses' } },
      { id: 'tps_rs3', type: 'fill_blank', stage: 'B', frame: 'Dana ___ videos at night.', base: 'watch', answer: 'watches', showRule: true, ruleKey: 'es', target: { person: 'third', verb: 'watch', form: 'watches' } },
    ],
    WORD_ORDER: [
      { id: 'tps_ro1', type: 'sentence_builder', stage: 'C', prompt: P.sheUses, chunks: ['She', 'uses', 'her phone', 'every day'], acceptedAnswers: ['She uses her phone every day.'], showOrder: true, target: { person: 'third', verb: 'use', form: 'uses' } },
      { id: 'tps_ro2', type: 'sentence_builder', stage: 'C', prompt: P.heCalls, chunks: ['He', 'calls', 'his friend', 'after school'], acceptedAnswers: ['He calls his friend after school.'], showOrder: true, target: { person: 'third', verb: 'call', form: 'calls' } },
      { id: 'tps_ro3', type: 'sentence_builder', stage: 'C', prompt: P.weWatch, chunks: ['We', 'watch', 'videos', 'on weekends'], acceptedAnswers: ['We watch videos on weekends.'], showOrder: true, target: { person: 'plural', verb: 'watch', form: 'watch' } },
    ],
  },
};
