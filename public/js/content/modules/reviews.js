// REVIEW modules: everything the teacher already taught in class is taught again here —
// "first you guess, then you learn". Short: guess → learn → examples → quick check.

const L = (he, ru, ar, en) => ({ he, ru, ar, en });
const REVIEW_STEPS = ['guess', 'learn', 'examples', 'check'];

export const subjectPronounsReview = {
  id: 'rev_subject_pronouns', kind: 'review', grammarSkill: 'subject_pronouns', theme: 'basics',
  title: L('חזרה: כינויי גוף', 'Повторение: местоимения', 'مراجعة: الضماير', 'Review: subject pronouns'),
  goal: L('אני יודע/ת להחליף שם ב-he / she / it / we / they.', 'Я умею заменять имя на he / she / it / we / they.', 'بعرف أبدّل الاسم بـ he / she / it / we / they.', 'I can replace a name with he / she / it / we / they.'),
  requiredSkills: [], vocabularySets: ['basics_people'], focusWords: [], steps: REVIEW_STEPS,
  guess: [
    {
      id: 'rsp_g1', show: ['Dana → she', 'Omar → ?'], highlight: ['she'],
      question: L('נחשו: Omar = ?', 'Угадай: Omar = ?', 'خمّن: Omar = ؟', 'Guess: Omar = ?'),
      options: [{ id: 'he', label: L('he', 'he', 'he', 'he'), en: true }, { id: 'she', label: L('she', 'she', 'she', 'she'), en: true }, { id: 'it', label: L('it', 'it', 'it', 'it'), en: true }],
      answer: 'he',
      reveal: L('עומר הוא בן ← he.', 'Омар — мальчик → he.', 'عمر ولد ← he.', 'Omar is a boy → he.'),
    },
    {
      id: 'rsp_g2', show: ['my phone → ?'], highlight: [],
      question: L('נחשו: הטלפון שלי = ?', 'Угадай: мой телефон = ?', 'خمّن: التلفون تبعي = ؟', 'Guess: my phone = ?'),
      options: [{ id: 'he', label: L('he', 'he', 'he', 'he'), en: true }, { id: 'she', label: L('she', 'she', 'she', 'she'), en: true }, { id: 'it', label: L('it', 'it', 'it', 'it'), en: true }],
      answer: 'it',
      reveal: L('חפץ ← it.', 'Предмет → it.', 'شي ← it.', 'A thing → it.'),
    },
  ],
  learn: {
    oneLine: L('כינוי גוף מחליף שם.', 'Местоимение заменяет имя.', 'الضمير بيجي مكان الاسم.', 'A pronoun replaces a name.'),
    table: [
      { left: 'I', right: L('אני', 'я', 'أنا', 'me') },
      { left: 'you', right: L('אתה / את / אתם', 'ты / вы', 'إنت / إنتِ / إنتو', 'the person I talk to') },
      { left: 'he', right: L('הוא', 'он', 'هو', 'a boy / a man') },
      { left: 'she', right: L('היא', 'она', 'هي', 'a girl / a woman') },
      { left: 'it', right: L('חפץ / חיה', 'предмет / животное', 'شي / حيوان', 'a thing / an animal') },
      { left: 'we', right: L('אנחנו', 'мы', 'إحنا', 'me + other people') },
      { left: 'they', right: L('הם / הן', 'они', 'همّ', 'other people') },
    ],
    notes: [],
  },
  examples: [
    { en: 'My sister → she', highlight: 'she', tr: L('אחותי ← she', 'моя сестра → she', 'أختي ← she', '') },
    { en: 'My dad → he', highlight: 'he', tr: L('אבא שלי ← he', 'мой папа → he', 'أبوي ← he', '') },
    { en: 'My friends → they', highlight: 'they', tr: L('החברים שלי ← they', 'мои друзья → they', 'صحابي ← they', '') },
    { en: 'My brother and I → we', highlight: 'we', tr: L('אחי ואני ← we', 'мой брат и я → we', 'أنا وأخوي ← we', '') },
  ],
  check: [
    { id: 'rsp_c1', type: 'multiple_choice', stage: 'A', frame: 'Maya = ___', options: ['she', 'he', 'they'], answer: 'she', target: { skill: 'subject_pronouns' } },
    { id: 'rsp_c2', type: 'multiple_choice', stage: 'A', frame: 'my friends = ___', options: ['we', 'they', 'it'], answer: 'they', target: { skill: 'subject_pronouns' } },
    { id: 'rsp_c3', type: 'multiple_choice', stage: 'A', frame: 'my phone = ___', options: ['she', 'it', 'he'], answer: 'it', target: { skill: 'subject_pronouns' } },
    { id: 'rsp_c4', type: 'multiple_choice', stage: 'A', frame: 'my brother and I = ___', options: ['they', 'we', 'he'], answer: 'we', target: { skill: 'subject_pronouns' } },
  ],
};

export const psIYouWeTheyReview = {
  id: 'rev_ps_i_you_we_they', kind: 'review', grammarSkill: 'ps_i_you_we_they', theme: 'phones',
  title: L('חזרה: I / you / we / they + פועל', 'Повторение: I / you / we / they + глагол', 'مراجعة: I / you / we / they + فعل', 'Review: I / you / we / they + verb'),
  goal: L('אני יודע/ת לכתוב משפט עם I / you / we / they.', 'Я умею писать предложение с I / you / we / they.', 'بعرف أكتب جملة مع I / you / we / they.', 'I can write a sentence with I / you / we / they.'),
  requiredSkills: ['subject_pronouns'], vocabularySets: ['basics_people', 'basics_things', 'phones_1'], focusWords: [], steps: REVIEW_STEPS,
  guess: [
    {
      id: 'rps_g1', show: ['I watch videos.', 'We watch videos.', 'They watch videos.'], highlight: ['watch'],
      question: L('נחשו: האם הפועל משתנה?', 'Угадай: глагол меняется?', 'خمّن: الفعل بتغيّر؟', 'Guess: does the verb change?'),
      options: [{ id: 'no', label: L('לא, הוא נשאר אותו דבר', 'Нет, он не меняется', 'لأ، بضل نفسه', 'No, it stays the same') }, { id: 'yes', label: L('כן, הוא משתנה', 'Да, меняется', 'آه، بتغيّر', 'Yes, it changes') }],
      answer: 'no',
      reveal: L('שימו לב: עם I / you / we / they הפועל לא משתנה.', 'Смотри: с I / you / we / they глагол не меняется.', 'شوف: مع I / you / we / they الفعل ما بتغيّر.', 'Look: with I / you / we / they the verb does not change.'),
    },
  ],
  learn: {
    oneLine: L('I / you / we / they + פועל — בלי שינוי.', 'I / you / we / they + глагол — без изменений.', 'I / you / we / they + فعل — بدون تغيير.', 'I / you / we / they + verb — no change.'),
    table: [{ left: 'I / you / we / they', right: ['use', 'call', 'read', 'watch'] }],
    notes: [{ text: L('סדר: מי? ← עושה מה? ← מה? ← מתי?', 'Порядок: кто? → что делает? → что? → когда?', 'الترتيب: مين؟ ← شو بعمل؟ ← شو؟ ← إمتى؟', 'Order: who? → does what? → what? → when?'), examples: ['We · watch · videos · on weekends'] }],
  },
  examples: [
    { en: 'I read books after school.', highlight: 'read', tr: L('אני קורא/ת ספרים אחרי בית הספר.', 'Я читаю книги после школы.', 'أنا بقرا كتب بعد المدرسة.', '') },
    { en: 'We watch videos on weekends.', highlight: 'watch', tr: L('אנחנו צופים בסרטונים בסופי שבוע.', 'Мы смотрим видео по выходным.', 'إحنا بنحضر فيديوهات بالويكند.', '') },
    { en: 'They call their mom every day.', highlight: 'call', tr: L('הם מתקשרים לאמא שלהם כל יום.', 'Они звонят своей маме каждый день.', 'همّ بتّصلوا بإمّهم كل يوم.', '') },
  ],
  check: [
    { id: 'rps_c1', type: 'sentence_builder', stage: 'C', prompt: L('אנחנו צופים בסרטונים בסופי שבוע.', 'Мы смотрим видео по выходным.', 'إحنا بنحضر فيديوهات بالويكند.', 'we · watch · videos · on weekends'), chunks: ['We', 'watch', 'videos', 'on weekends'], acceptedAnswers: ['We watch videos on weekends.'], target: { person: 'plural', verb: 'watch', form: 'watch' } },
    { id: 'rps_c2', type: 'sentence_builder', stage: 'C', prompt: L('אני קורא/ת ספרים אחרי בית הספר.', 'Я читаю книги после школы.', 'أنا بقرا كتب بعد المدرسة.', 'I · read · books · after school'), chunks: ['I', 'read', 'books', 'after school'], acceptedAnswers: ['I read books after school.'], target: { person: 'first', verb: 'read', form: 'read' } },
  ],
};

export const timeWordsReview = {
  id: 'rev_time_words', kind: 'review', grammarSkill: 'time_words', theme: 'basics',
  title: L('חזרה: מילות זמן', 'Повторение: слова времени', 'مراجعة: كلمات الوقت', 'Review: time words'),
  goal: L('אני יודע/ת לומר מתי משהו קורה.', 'Я умею сказать, когда что-то происходит.', 'بعرف أحكي إمتى إشي بصير.', 'I can say when something happens.'),
  requiredSkills: ['subject_pronouns'], vocabularySets: ['basics_time'], focusWords: [], steps: REVIEW_STEPS,
  guess: [
    {
      id: 'rtw_g1', show: ['I watch videos every day.'], highlight: ['every day'],
      question: L('נחשו: every day = ?', 'Угадай: every day = ?', 'خمّن: every day = ؟', 'Guess: every day = ?'),
      options: [{ id: 'ok', label: L('כל יום', 'каждый день', 'كل يوم', 'all the days') }, { id: 'x1', label: L('ביום שישי', 'в пятницу', 'يوم الجمعة', 'on Friday') }, { id: 'x2', label: L('אף פעם', 'никогда', 'ولا مرّة', 'never') }],
      answer: 'ok',
      reveal: L('every day = כל יום. זה הרגל — משהו שקורה שוב ושוב.', 'every day = каждый день. Это привычка — то, что повторяется.', 'every day = كل يوم. هاي عادة — إشي بصير كل مرّة.', 'every day = a habit — it happens again and again.'),
    },
  ],
  learn: {
    oneLine: L('מילות זמן אומרות מתי. הן באות בסוף המשפט.', 'Слова времени говорят «когда». Они стоят в конце предложения.', 'كلمات الوقت بتحكي إمتى. بتيجي بآخر الجملة.', 'Time words say WHEN. They go at the end of the sentence.'),
    table: [
      { left: 'every day', right: L('כל יום', 'каждый день', 'كل يوم', 'all days') },
      { left: 'every morning', right: L('כל בוקר', 'каждое утро', 'كل صبح', 'all mornings') },
      { left: 'after school', right: L('אחרי בית הספר', 'после школы', 'بعد المدرسة', 'when school ends') },
      { left: 'at night', right: L('בלילה', 'ночью', 'بالليل', 'when it is dark') },
      { left: 'on weekends', right: L('בסופי שבוע', 'по выходным', 'بالويكند', 'Friday, Saturday') },
    ],
    notes: [],
  },
  examples: [
    { en: 'I call my dad after school.', highlight: 'after school', tr: L('אני מתקשר/ת לאבא שלי אחרי בית הספר.', 'Я звоню папе после школы.', 'أنا بتّصل بأبوي بعد المدرسة.', '') },
    { en: 'We watch videos at night.', highlight: 'at night', tr: L('אנחנו צופים בסרטונים בלילה.', 'Мы смотрим видео ночью.', 'إحنا بنحضر فيديوهات بالليل.', '') },
  ],
  check: [
    { id: 'rtw_c1', type: 'multiple_choice', stage: 'A', frame: 'I read books ___.', prompt: L('אני קורא/ת ספרים בלילה.', 'Я читаю книги ночью.', 'أنا بقرا كتب بالليل.', 'I · read · books · at night'), options: ['at night', 'every morning'], answer: 'at night', target: { skill: 'time_words' } },
    { id: 'rtw_c2', type: 'multiple_choice', stage: 'A', frame: 'We call our mom ___.', prompt: L('אנחנו מתקשרים לאמא שלנו כל יום.', 'Мы звоним маме каждый день.', 'إحنا بنتّصل بإمّنا كل يوم.', 'we · call · our mom · every day'), options: ['on weekends', 'every day'], answer: 'every day', target: { skill: 'time_words' } },
  ],
};

export const REVIEWS = [subjectPronounsReview, psIYouWeTheyReview, timeWordsReview];
