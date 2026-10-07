// LESSON C (≈50–60 min): question words → WH + Present Simple (QASI) → WH + Present Progressive → habit or now? → interview a friend.
// Theme: phones. Every part is gated by the 'wh_questions' skill (warm-up reviews Yes/No questions and negatives).
// Item shapes: see the comment block at the top of lesson_a_s_ing_progressive.js.
//
// CHECKER NOTES for this lesson:
//  • Only OBJECT / adverb WH questions: "Who does she call?" ✓ — never subject questions ("Who calls her?" ✗).
//  • No "do / does" as a MAIN verb ("What do you do?" ✗) — the checker reads do / does as helpers only.
//  • No "How" alone — only "how often" and "what time". No "because" (not in the vocabulary) → no answers to "why".

const L = (he, ru, ar, en) => ({ he, ru, ar, en });
const sent = (id, prompt, acceptedAnswers, chunks, target, focus, extra = {}) => ({ id, kind: 'sentence', prompt, acceptedAnswers, chunks, target, focus, ...extra });

const WPS = { structure: 'wh_ps' };
const WPP = { structure: 'wh_pp' };
const PP = { structure: 'pp' };

// shared instructions
const I_QWORD = L('בחרו את מילת השאלה המתאימה לתשובה.', 'Выбери вопросительное слово, которое подходит к ответу.', 'اختار كلمة السؤال اللي بتناسب الجواب.', 'Choose the question word that fits the answer.');
const I_DODOES = L('כתבו do או does.', 'Напиши do или does.', 'اكتب do أو does.', 'Write do or does.');
const I_AMISARE = L('כתבו am / is / are.', 'Напиши am / is / are.', 'اكتب am / is / are.', 'Write am / is / are.');
const I_HABIT_NOW = L('הסתכלו על הסימן: 📅 הרגל או ⚡ עכשיו? בחרו.', 'Посмотри на значок: 📅 привычка или ⚡ сейчас? Выбери.', 'اطّلع عالإشارة: 📅 عادة ولا ⚡ هلّأ؟ اختار.', 'Look at the sign: 📅 habit or ⚡ now? Choose.');
const ansCard = (en, emoji, heWord = 'התשובה', ruWord = 'Ответ', arWord = 'الجواب') => L(`💬 ${heWord}: "${en}" ${emoji}`, `💬 ${ruWord}: «${en}» ${emoji}`, `💬 ${arWord}: "${en}" ${emoji}`, `💬 Answer: "${en}" ${emoji}`);
const HABIT = L('📅 זה הרגל (קורה הרבה).', '📅 Это привычка (бывает часто).', '📅 هاي عادة (بتصير كتير).', '📅 It is a habit.');
const NOW = L('⚡ זה קורה עכשיו.', '⚡ Это происходит сейчас.', '⚡ هاد عم بصير هلّأ.', '⚡ It is happening now.');

export default {
  id: 'lesson_c',
  order: 3,
  theme: 'phones',
  title: L('שיעור 3 · שאלות WH', 'Урок 3 · Вопросы WH', 'درس 3 · أسئلة WH', 'Lesson 3 · WH questions'),
  goal: L(
    'אני יודע/ת לשאול שאלות עם מילות שאלה — על הרגלים (Where does she read?) ועל מה שקורה עכשיו (What is she reading?).',
    'Я умею задавать вопросы с вопросительными словами — о привычках (Where does she read?) и о том, что происходит сейчас (What is she reading?).',
    'بعرف أسأل أسئلة مع كلمات سؤال — عن العادات (Where does she read?) وعن اللي عم بصير هلّأ (What is she reading?).',
    'I can ask WH questions — about habits (Where does she read?) and about now (What is she reading?).'
  ),
  parts: [
    // ───────────── WARM-UP · Yes/No questions + negatives ─────────────
    {
      id: 'warm', skill: 'ps_questions',
      title: L('חימום', 'Разминка', 'تسخين', 'Warm-up'),
      steps: [
        {
          type: 'warmup', items: [
            { id: 'lc_w1', type: 'multiple_choice', grammarSkill: 'ps_questions', stage: 'A', frame: '___ your sister read the news every day?', options: ['Do', 'Does', 'Is'], answer: 'Does', target: { structure: 'ps_q' } },
            { id: 'lc_w2', type: 'multiple_choice', grammarSkill: 'pp_questions', stage: 'A', frame: '___ they chatting now?', options: ['Is', 'Are', 'Do'], answer: 'Are', target: { structure: 'pp_q' } },
            { id: 'lc_w3', type: 'sentence_builder', grammarSkill: 'ps_negative', stage: 'C', prompt: L('אחי לא משחק במשחקים בלילה.', 'Мой брат не играет в игры ночью.', 'أخوي ما بلعب ألعاب بالليل.', "my brother · not · play · games · at night"), chunks: ['My brother', "doesn't", 'play', 'games', 'at night'], acceptedAnswers: ["My brother doesn't play games at night.", 'My brother does not play games at night.'], target: { structure: 'ps_neg', verb: 'play' } },
            { id: 'lc_w4', type: 'multiple_choice', grammarSkill: 'pp_negative', stage: 'A', frame: 'I ___ watching TV now.', options: ['am not', "isn't", "don't"], answer: 'am not', target: { structure: 'pp_neg' } },
          ],
        },
        { type: 'choose' },
      ],
    },

    // ───────────── PART 1 · question words ─────────────
    {
      id: 'qw', skill: 'wh_questions',
      title: L('חלק 1 · מילות שאלה', 'Часть 1 · Вопросительные слова', 'جزء 1 · كلمات السؤال', 'Part 1 · Question words'),
      steps: [
        { type: 'words', words: ['what', 'where', 'when', 'who', 'why', 'how_often', 'what_time'] },
        {
          type: 'guess', guess: [
            {
              id: 'lc_q_g1', picture: '👧📰🏠',
              show: ['Where does Maya read the news?', 'At home.'], highlight: ['Where', 'At home'],
              question: L('נחשו: על מה שואלת המילה Where?', 'Угадай: о чём спрашивает слово Where?', 'خمّن: عن شو بتسأل كلمة Where؟', 'Guess: what does the word Where ask about?'),
              options: [
                { id: 'place', label: L('על מקום 📍', 'О месте 📍', 'عن مكان 📍', 'A place 📍') },
                { id: 'time', label: L('על זמן 🕒', 'О времени 🕒', 'عن وقت 🕒', 'A time 🕒') },
                { id: 'person', label: L('על אדם 🧑', 'О человеке 🧑', 'عن شخص 🧑', 'A person 🧑') },
              ],
              answer: 'place',
              reveal: L('Where = איפה ← התשובה היא מקום: at home.', 'Where = где → ответ — место: at home.', 'Where = وين ← الجواب مكان: at home.', 'Where → a place: at home.'),
            },
            {
              id: 'lc_q_g2', picture: '👦📞👩',
              show: ['How often does Omar call his mom?', 'Every day.'], highlight: ['How often', 'Every day'],
              question: L('נחשו: על מה שואלים How often?', 'Угадай: о чём спрашивает How often?', 'خمّن: عن شو بتسأل How often؟', 'Guess: what does How often ask about?'),
              options: [
                { id: 'times', label: L('כמה פעמים 🔁', 'Сколько раз 🔁', 'قدّيش مرّة 🔁', 'How many times 🔁') },
                { id: 'place', label: L('על מקום 📍', 'О месте 📍', 'عن مكان 📍', 'A place 📍') },
                { id: 'thing', label: L('על חפץ 📦', 'О предмете 📦', 'عن شي 📦', 'A thing 📦') },
              ],
              answer: 'times',
              reveal: L('How often = כמה פעמים ← every day · on weekends · sometimes.', 'How often = как часто → every day · on weekends · sometimes.', 'How often = قدّيش مرّة ← every day · on weekends · sometimes.', 'How often → every day · on weekends · sometimes.'),
            },
          ],
        },
        {
          type: 'practice', title: L('תרגול מילות שאלה', 'Практика: вопросительные слова', 'تمرين كلمات السؤال', 'Question words practice'),
          items: [
            { id: 'lc_q_match', type: 'match', stage: 'A', errorTag: 'WH_QUESTION',
              instruction: L('התאימו לכל מילת שאלה את התשובה שלה.', 'Соедини каждое вопросительное слово с его ответом.', 'وصّل كل كلمة سؤال بالجواب تبعها.', 'Match each question word with its answer.'),
              pairs: [{ left: 'Where?', right: 'at home' }, { left: 'When?', right: 'after school' }, { left: 'How often?', right: 'every day' }, { left: 'Who?', right: 'my mom' }, { left: 'What?', right: 'the news' }] },
            { id: 'lc_q1', type: 'multiple_choice', stage: 'A', instruction: I_QWORD, prompt: ansCard('At home.', '🏠'), frame: '___ does she read the news?', options: ['Where', 'When', 'Who'], answer: 'Where', target: WPS, errorTag: 'WH_QUESTION' },
            { id: 'lc_q2', type: 'multiple_choice', stage: 'A', instruction: I_QWORD, prompt: ansCard('After school.', '🏫'), frame: '___ does Omar call his mom?', options: ['When', 'Where', 'What'], answer: 'When', target: WPS, errorTag: 'WH_QUESTION' },
            { id: 'lc_q3', type: 'multiple_choice', stage: 'A', instruction: I_QWORD, prompt: ansCard('Her dad.', '👨'), frame: '___ does Dana call after school?', options: ['Who', 'Where', 'How often'], answer: 'Who', target: WPS, errorTag: 'WH_QUESTION' },
            {
              id: 'lc_q_sort', type: 'sort', stage: 'A', errorTag: 'WH_QUESTION',
              instruction: L('איזו מילת שאלה מתאימה לכל תשובה?', 'Какое вопросительное слово подходит к каждому ответу?', 'أيّ كلمة سؤال بتناسب كل جواب؟', 'Which question word fits each answer?'),
              buckets: [{ id: 'where', label: 'Where? 📍' }, { id: 'when', label: 'When? 🕒' }, { id: 'who', label: 'Who? 🧑' }, { id: 'what', label: 'What? ❓' }],
              cards: [{ text: 'at home', bucket: 'where' }, { text: 'after school', bucket: 'when' }, { text: 'my friend', bucket: 'who' }, { text: 'a video', bucket: 'what' }, { text: 'in class', bucket: 'where' }, { text: 'at night', bucket: 'when' }, { text: 'my dad', bucket: 'who' }, { text: 'music', bucket: 'what' }],
            },
            { id: 'lc_q4', type: 'multiple_choice', stage: 'A', instruction: I_QWORD, prompt: ansCard('Videos.', '🎬'), frame: '___ do you watch on your phone?', options: ['What', 'Who', 'When'], answer: 'What', target: WPS, errorTag: 'WH_QUESTION' },
            { id: 'lc_q5', type: 'multiple_choice', stage: 'A', instruction: I_QWORD, prompt: ansCard('Every day.', '📅'), frame: '___ do they play games?', options: ['How often', 'Where', 'Who'], answer: 'How often', target: WPS, errorTag: 'WH_QUESTION' },
            { id: 'lc_q6', type: 'multiple_choice', stage: 'A', instruction: I_QWORD, prompt: ansCard('At 7:00.', '⏰'), frame: '___ do you read the news?', options: ['What time', 'Where', 'Who'], answer: 'What time', target: WPS, errorTag: 'WH_QUESTION' },
            { id: 'lc_q_l1', type: 'listen_choose', stage: 'A', audio: 'Where does your brother play games?', options: ['Where does your brother play games?', 'When does your brother play games?', 'Where does your brother plays games?'], answer: 'Where does your brother play games?', errorTag: 'WH_QUESTION' },
          ],
        },
      ],
    },

    // ───────────── PART 2 · WH + Present Simple (QASI) ─────────────
    {
      id: 'whps', skill: 'wh_questions',
      title: L('חלק 2 · שאלות WH על הרגלים', 'Часть 2 · Вопросы WH о привычках', 'جزء 2 · أسئلة WH عن العادات', 'Part 2 · WH questions about habits'),
      steps: [
        {
          type: 'learn', learn: {
            oneLine: L('שאלה על הרגל: מילת שאלה + do / does + נושא + פועל (בלי S) ?', 'Вопрос о привычке: вопросительное слово + do / does + подлежащее + глагол (без S) ?', 'سؤال عن عادة: كلمة سؤال + do / does + فاعل + فعل (بدون S) ؟', 'Habit question: WH word + do / does + subject + verb (no S) ?'),
            formula: [{ text: 'WH word', key: true }, { text: '+' }, { text: 'do / does', key: true }, { text: '+' }, { text: 'subject' }, { text: '+' }, { text: 'verb (no S)', key: true }, { text: '?' }],
            table: [{ left: 'I / you / we / they', right: ['Where do you read?'] }, { left: 'he / she / it', right: ['Where does she read?'] }],
            transforms: [
              { from: ['Does', 'she', 'read', 'the news', '?'], to: ['Where', 'does', 'she', 'read', 'the news', '?'], mark: ['Where'], note: L('לוקחים שאלת Yes/No ומוסיפים מילת שאלה בהתחלה. כל השאר נשאר!', 'Берём вопрос Yes/No и ставим вопросительное слово в начало. Всё остальное не меняется!', 'منوخد سؤال Yes/No ومنزيد كلمة سؤال بالأوّل. كل إشي تاني بضلّ زي ما هو!', 'Take a Yes/No question and add a question word at the start. Everything else stays!') },
              { from: ['She', 'reads', 'the news', 'at home', '.'], to: ['Where', 'does', 'she', 'read', 'the news', '?'], mark: ['Where', 'does', 'read'], note: L('ה-S "עוברת" מ-reads ל-does. הפועל חוזר לצורת הבסיס: read.', 'S «переходит» с reads на does. Глагол возвращается в начальную форму: read.', 'الـ S "بتنتقل" من reads لـ does. الفعل برجع لأصله: read.', 'The S moves from reads to does. The verb goes back to its base: read.') },
            ],
            notes: [{
              text: L('QASI — כך זוכרים את הסדר: Question word · Auxiliary (do / does) · Subject · Infinitive (פועל בסיס)', 'QASI — так запоминаем порядок: Question word · Auxiliary (do / does) · Subject · Infinitive (начальная форма)', 'QASI — هيك منتذكّر الترتيب: Question word · Auxiliary (do / does) · Subject · Infinitive (أصل الفعل)', 'QASI — remember the order: Question word · Auxiliary (do / does) · Subject · Infinitive (base verb)'),
              examples: ['Q = Where', 'A = does', 'S = she', 'I = read'],
            }],
          },
        },
        { type: 'examples', examples: [
          { en: 'Where do you read the news?', highlight: 'Where do', mark: false, tr: L('איפה את/ה קורא/ת חדשות?', 'Где ты читаешь новости?', 'وين بتقرا الأخبار؟', '') },
          { en: 'What does your brother watch after school?', highlight: 'What does', mark: false, tr: L('במה אחיך צופה אחרי בית הספר?', 'Что твой брат смотрит после школы?', 'شو أخوك بحضر بعد المدرسة؟', '') },
          { en: 'How often does Maya call her friends?', highlight: 'How often does', mark: false, tr: L('כמה פעמים מאיה מתקשרת לחברות שלה?', 'Как часто Майя звонит своим друзьям?', 'قدّيش مرّة مايا بتتّصل بصحباتها؟', '') },
          { en: 'What time do they play games?', highlight: 'What time do', mark: false, tr: L('באיזו שעה הם משחקים במשחקים?', 'Во сколько они играют в игры?', 'أيّ ساعة بلعبوا ألعاب؟', '') },
        ] },
        {
          type: 'check', items: [
            { id: 'lc_pc1', type: 'multiple_choice', stage: 'A', frame: 'Where ___ your sister play games?', options: ['do', 'does', 'is'], answer: 'does', target: WPS },
            { id: 'lc_pc2', type: 'multiple_choice', stage: 'A', frame: 'What ___ you watch on your phone?', options: ['do', 'does', 'are'], answer: 'do', target: WPS },
            { id: 'lc_pc3', type: 'multiple_choice', stage: 'A', frame: 'When does he ___ his mom?', options: ['call', 'calls', 'calling'], answer: 'call', target: WPS },
          ],
        },
        {
          type: 'practice', title: L('שאלות על הרגלים · סבב 1', 'Вопросы о привычках · раунд 1', 'أسئلة عن العادات · جولة 1', 'Habit questions · round 1'),
          items: [
            sent('lc_ps1', L('איפה היא קוראת חדשות?', 'Где она читает новости?', 'وين بتقرا الأخبار؟', 'where? · she · read · the news'), ['Where does she read the news?', 'Where does she read news?'], ['Where', 'does', 'she', 'read', 'the news'], { ...WPS, verb: 'read' }, { frame: 'Where ___ she read the news?', options: ['does', 'do', 'is'], answer: 'does', base: 'do' }, { rule: 'wh', wrong: 'Where she reads the news?' }),
            sent('lc_ps2', L('במה את/ה צופה אחרי בית הספר?', 'Что ты смотришь после школы?', 'شو بتحضر بعد المدرسة؟', 'what? · you · watch · after school'), ['What do you watch after school?'], ['What', 'do', 'you', 'watch', 'after school'], { ...WPS, verb: 'watch' }, { frame: 'What ___ you watch after school?', options: ['do', 'does', 'are'], answer: 'do', base: 'do' }, { rule: 'wh' }),
            { id: 'lc_ps_pf', type: 'pair_fill', stage: 'B', instruction: I_DODOES, verb: 'do / does', frames: ['Where ___ you play games?', 'Where ___ your brother play games?'], answers: ['do', 'does'], target: WPS },
            sent('lc_ps3', L('כמה פעמים עומר מתקשר לאמא שלו?', 'Как часто Омар звонит маме?', 'قدّيش مرّة عمر بتّصل بإمّه؟', 'how often? · Omar · call · his mom'), ['How often does Omar call his mom?', 'How often does Omar call his mother?'], ['How often', 'does', 'Omar', 'call', 'his mom'], { ...WPS, verb: 'call' }, { frame: 'How often does Omar ___ his mom?', options: ['call', 'calls', 'calling'], answer: 'call', base: 'call' }, { rule: 'wh', subjectHint: 'Omar = he', wrong: 'How often does Omar calls his mom?' }),
            { id: 'lc_ps_fb1', type: 'fill_blank', stage: 'B', instruction: I_DODOES, frame: 'When ___ your friends chat?', base: 'do / does', answer: 'do', target: WPS, subjectHint: 'your friends = they' },
            sent('lc_ps4', L('למי דנה מתקשרת אחרי בית הספר?', 'Кому Дана звонит после школы?', 'لمين دانا بتتّصل بعد المدرسة؟', 'who? · Dana · call · after school'), ['Who does Dana call after school?'], ['Who', 'does', 'Dana', 'call', 'after school'], { ...WPS, verb: 'call' }, { frame: 'Who ___ Dana call after school?', options: ['does', 'do', 'is'], answer: 'does', base: 'do' }, { rule: 'wh', subjectHint: 'Dana = she' }),
            { id: 'lc_ps_e1', type: 'error_correction', stage: 'E', wrong: 'When does he calls his mom?', acceptedAnswers: ['When does he call his mom?', 'When does he call his mother?'], target: WPS },
            { id: 'lc_ps_sb1', type: 'sentence_builder', stage: 'C', prompt: L('באיזו שעה את/ה קורא/ת חדשות?', 'Во сколько ты читаешь новости?', 'أيّ ساعة بتقرا الأخبار؟', 'what time? · you · read · the news'), chunks: ['What time', 'do', 'you', 'read', 'the news'], distractors: ['does', 'reads'], acceptedAnswers: ['What time do you read the news?'], target: { ...WPS, verb: 'read' } },
          ],
        },
        {
          type: 'practice', title: L('שאלות על הרגלים · סבב 2', 'Вопросы о привычках · раунд 2', 'أسئلة عن العادات · جولة 2', 'Habit questions · round 2'),
          items: [
            { id: 'lc_ps_tr1', type: 'transform', stage: 'D', source: 'She reads the news at home.',
              instruction: L('כתבו שאלה על החלק "at home" (מקום 📍).', 'Задай вопрос к части «at home» (место 📍).', 'اكتب سؤال عن الجزء "at home" (مكان 📍).', 'Write a question about "at home" (a place 📍).'),
              acceptedAnswers: ['Where does she read the news?', 'Where does she read news?'], target: WPS },
            { id: 'lc_ps_tr2', type: 'transform', stage: 'D', source: 'My brother plays games after school.',
              instruction: L('כתבו שאלה על החלק "after school" (זמן 🕒). התחילו ב-When.', 'Задай вопрос к части «after school» (время 🕒). Начни с When.', 'اكتب سؤال عن الجزء "after school" (وقت 🕒). ابدا بـ When.', 'Write a question about "after school" (a time 🕒). Start with When.'),
              acceptedAnswers: ['When does your brother play games?', 'When does he play games?', 'When does my brother play games?'], target: WPS },
            sent('lc_ps5', L('מה אחותך מפרסמת בסופי שבוע?', 'Что твоя сестра публикует по выходным?', 'شو أختك بتنشر بالويكند؟', 'what? · your sister · post · on weekends'), ['What does your sister post on weekends?'], ['What', 'does', 'your sister', 'post', 'on weekends'], { ...WPS, verb: 'post' }, { frame: 'What does your sister ___ on weekends?', options: ['post', 'posts', 'posting'], answer: 'post', base: 'post' }, { rule: 'wh', subjectHint: 'your sister = she', wrong: 'What does your sister posts on weekends?' }),
            { id: 'lc_ps_e2', type: 'error_correction', stage: 'E', wrong: 'What do your sister watch?', acceptedAnswers: ['What does your sister watch?'], target: WPS },
            { id: 'lc_ps_tr3', type: 'transform', stage: 'D', source: 'They watch videos every day.',
              instruction: L('כתבו שאלה על החלק "every day" (כמה פעמים 🔁).', 'Задай вопрос к части «every day» (как часто 🔁).', 'اكتب سؤال عن الجزء "every day" (قدّيش مرّة 🔁).', 'Write a question about "every day" (how often 🔁).'),
              acceptedAnswers: ['How often do they watch videos?'], target: WPS },
            sent('lc_ps6', L('איפה הם מקשיבים למוזיקה?', 'Где они слушают музыку?', 'وين بسمعوا موسيقى؟', 'where? · they · listen to · music'), ['Where do they listen to music?'], ['Where', 'do', 'they', 'listen', 'to music'], { ...WPS, verb: 'listen' }, { frame: 'Where ___ they listen to music?', options: ['do', 'does', 'are'], answer: 'do', base: 'do' }, { rule: 'wh' }),
            { id: 'lc_ps_chat', type: 'text_gaps', stage: 'B', target: WPS, chat: [
              { from: 'Maya', text: 'What ___ you watch at night?', base: 'do / does', answer: 'do' },
              { from: 'me', text: 'I watch videos.' },
              { from: 'me', text: 'What ___ your brother watch?', base: 'do / does', answer: 'does' },
              { from: 'Maya', text: 'He watches the news.' },
              { from: 'Maya', text: 'How often ___ you chat with friends?', base: 'do / does', answer: 'do' },
            ] },
            { id: 'lc_ps_t1', type: 'translate', stage: 'E', prompt: L('כמה פעמים את/ה משתמש/ת בטלפון שלך?', 'Как часто ты пользуешься своим телефоном?', 'قدّيش مرّة بتستعمل تلفونك؟', 'how often? · you · use · your phone'), acceptedAnswers: ['How often do you use your phone?'], target: { ...WPS, verb: 'use' } },
          ],
        },
      ],
    },
    { id: 'pause1', title: L('הפסקה', 'Перерыв', 'استراحة', 'Break'), steps: [{ type: 'pause' }] },

    // ───────────── PART 3 · WH + Present Progressive ─────────────
    {
      id: 'whpp', skill: 'wh_questions',
      title: L('חלק 3 · שאלות WH על "עכשיו"', 'Часть 3 · Вопросы WH о «сейчас»', 'جزء 3 · أسئلة WH عن "هلّأ"', 'Part 3 · WH questions about now'),
      steps: [
        {
          type: 'guess', guess: [{
            id: 'lc_p_g1', picture: '👦📱⚡',
            show: ['Is Omar watching a video?', 'What is Omar watching?'], highlight: ['Is', 'What'],
            question: L('נחשו: מה נוסף בתחילת השאלה השנייה?', 'Угадай: что добавилось в начале второго вопроса?', 'خمّن: شو انضاف بأوّل السؤال التاني؟', 'Guess: what was added at the start of the second question?'),
            options: [
              { id: 'wh', label: L('מילת שאלה', 'Вопросительное слово', 'كلمة سؤال', 'A question word') },
              { id: 'do', label: L('does', 'does', 'does', 'does'), en: true },
              { id: 'none', label: L('שום דבר', 'Ничего', 'ولا إشي', 'Nothing') },
            ],
            answer: 'wh',
            reveal: L('What + is + Omar + watching? — אותו סדר כמו בשאלת Yes/No, רק עם מילת שאלה בהתחלה.', 'What + is + Omar + watching? — тот же порядок, что и в вопросе Yes/No, только с вопросительным словом в начале.', 'What + is + Omar + watching? — نفس ترتيب سؤال Yes/No، بس مع كلمة سؤال بالأوّل.', 'What + is + Omar + watching? — same order as a Yes/No question, with a question word first.'),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('שאלה על עכשיו: מילת שאלה + am / is / are + נושא + פועל-ing ?', 'Вопрос о «сейчас»: вопросительное слово + am / is / are + подлежащее + глагол-ing ?', 'سؤال عن هلّأ: كلمة سؤال + am / is / are + فاعل + فعل-ing ؟', 'Now question: WH word + am / is / are + subject + verb-ing ?'),
            formula: [{ text: 'WH word', key: true }, { text: '+' }, { text: 'am / is / are', key: true }, { text: '+' }, { text: 'subject' }, { text: '+' }, { text: 'verb-ing', key: true }, { text: '?' }],
            table: [{ left: 'I', right: ['What am I reading?'] }, { left: 'he / she / it', right: ['What is she reading?'] }, { left: 'you / we / they', right: ['What are you reading?'] }],
            transforms: [{ from: ['Is', 'she', 'calling', 'her friend', '?'], to: ['Who', 'is', 'she', 'calling', '?'], mark: ['Who'], note: L('Who בהתחלה — ו-"her friend" יוצא, כי עליו שואלים!', 'Who в начале — а «her friend» уходит: о нём мы и спрашиваем!', 'Who بالأوّل — و"her friend" بطلع، لإنه هو اللي منسأل عنه!', 'Who goes first — "her friend" goes out, because that is what we ask about!') }],
            notes: [{ text: L('⚡ עכשיו → am / is / are + ing.   📅 הרגל → do / does + פועל.', '⚡ Сейчас → am / is / are + ing.   📅 Привычка → do / does + глагол.', '⚡ هلّأ → am / is / are + ing.   📅 عادة → do / does + فعل.', '⚡ Now → am / is / are + -ing.   📅 Habit → do / does + verb.'), examples: ['What are you watching now?', 'What do you watch every day?'] }],
          },
        },
        { type: 'examples', examples: [
          { en: 'What are you watching now?', highlight: 'What are watching', mark: false, tr: L('במה את/ה צופה עכשיו?', 'Что ты сейчас смотришь?', 'شو عم بتحضر هلّأ؟', '') },
          { en: 'Who is she calling right now?', highlight: 'Who is calling', mark: false, tr: L('למי היא מתקשרת ממש עכשיו?', 'Кому она звонит прямо сейчас?', 'لمين عم بتتّصل هلّأ بالزبط؟', '') },
          { en: 'Where are they chatting at the moment?', highlight: 'Where are chatting', mark: false, tr: L('איפה הם מצ׳טטים כרגע?', 'Где они сейчас переписываются?', 'وين عم بشاتوا بهاي اللحظة؟', '') },
          { en: 'Why is your brother scrolling now?', highlight: 'Why is scrolling', mark: false, tr: L('למה אחיך גולל עכשיו?', 'Почему твой брат сейчас листает ленту?', 'ليش أخوك عم بسكرول هلّأ؟', '') },
        ] },
        {
          type: 'check', items: [
            { id: 'lc_pp_c1', type: 'multiple_choice', stage: 'A', frame: 'Who ___ she calling now?', options: ['is', 'does', 'are'], answer: 'is', target: WPP },
            { id: 'lc_pp_c2', type: 'multiple_choice', stage: 'A', frame: 'What are you ___ now?', options: ['watching', 'watch', 'watches'], answer: 'watching', target: WPP },
          ],
        },
        {
          type: 'practice', title: L('שאלות על "עכשיו"', 'Вопросы о «сейчас»', 'أسئلة عن "هلّأ"', 'Now questions'),
          items: [
            sent('lc_pp1', L('במה את/ה צופה עכשיו?', 'Что ты сейчас смотришь?', 'شو عم بتحضر هلّأ؟', 'what? · you · watch · now'), ['What are you watching now?'], ['What', 'are', 'you', 'watching', 'now'], { ...WPP, verb: 'watch' }, { frame: 'What are you ___ now?', options: ['watching', 'watch', 'watches'], answer: 'watching', base: 'watch' }, { rule: 'wh', wrong: 'What you are watching now?' }),
            sent('lc_pp2', L('למי היא מתקשרת?', 'Кому она звонит?', 'لمين عم بتتّصل؟', 'who? · she · call · (now)'), ['Who is she calling?', 'Who is she calling now?'], ['Who', 'is', 'she', 'calling'], { ...WPP, verb: 'call' }, { frame: 'Who ___ she calling?', options: ['is', 'does', 'are'], answer: 'is' }, { rule: 'wh' }),
            sent('lc_pp3', L('למה הם מצ׳טטים עכשיו?', 'Почему они сейчас переписываются?', 'ليش عم بشاتوا هلّأ؟', 'why? · they · chat · now'), ['Why are they chatting now?'], ['Why', 'are', 'they', 'chatting', 'now'], { ...WPP, verb: 'chat' }, { frame: 'Why are they ___ now?', options: ['chatting', 'chating', 'chat'], answer: 'chatting', base: 'chat' }, { rule: 'wh', wrong: 'Why are they chat now?' }),
            { id: 'lc_pp_pf', type: 'pair_fill', stage: 'B', instruction: I_AMISARE, verb: 'am / is / are', frames: ['Who ___ you calling?', 'Who ___ Omar calling?'], answers: ['are', 'is'], target: WPP },
            sent('lc_pp4', L('איפה החברים שלך משחקים עכשיו?', 'Где сейчас играют твои друзья?', 'وين صحابك عم بلعبوا هلّأ؟', 'where? · your friends · play · now'), ['Where are your friends playing now?'], ['Where', 'are', 'your friends', 'playing', 'now'], { ...WPP, verb: 'play' }, { frame: 'Where ___ your friends playing now?', options: ['are', 'is', 'do'], answer: 'are' }, { rule: 'wh', subjectHint: 'your friends = they', wrong: 'Where is your friends playing now?' }),
            { id: 'lc_pp_chat', type: 'text_gaps', stage: 'B', chat: [
              { from: 'me', text: 'Hi Noa! What ___ you reading?', answer: 'are' },
              { from: 'Noa', text: 'I ___ the news.', base: 'read', answer: 'am reading' },
              { from: 'me', text: 'Who ___ your brother calling?', answer: 'is' },
              { from: 'Noa', text: 'He ___ his friend.', base: 'call', answer: 'is calling' },
            ], targets: [WPP, PP, WPP, PP] },
            { id: 'lc_pp_l1', type: 'listen_choose', stage: 'A', audio: 'What is your sister watching?', options: ['What is your sister watching?', 'What does your sister watch?', 'What is your sister watch?'], answer: 'What is your sister watching?', errorTag: 'BE_QUESTION' },
            { id: 'lc_pp_e1', type: 'error_correction', stage: 'E', wrong: 'What you are watching now?', acceptedAnswers: ['What are you watching now?'], target: WPP },
            sent('lc_pp5', L('למי הם שולחים הודעות ממש עכשיו?', 'Кому они пишут сообщения прямо сейчас?', 'لمين عم يبعتوا مسجات هلّأ بالزبط؟', 'who? · they · message · right now'), ['Who are they messaging right now?'], ['Who', 'are', 'they', 'messaging', 'right now'], { ...WPP, verb: 'message' }, { frame: 'Who are they ___ right now?', options: ['messaging', 'messageing', 'message'], answer: 'messaging', base: 'message' }, { rule: 'wh' }),
            { id: 'lc_pp_t1', type: 'translate', stage: 'E', prompt: L('מה מאיה שומעת עכשיו?', 'Что Майя сейчас слушает?', 'شو مايا عم بتسمع هلّأ؟', 'what? · Maya · listen to · now'), acceptedAnswers: ['What is Maya listening to now?'], target: { ...WPP, verb: 'listen' } },
          ],
        },
      ],
    },

    // ───────────── PART 4 · mixed: habit or now? ─────────────
    {
      id: 'mix', skill: 'wh_questions',
      title: L('חלק 4 · הרגל או עכשיו?', 'Часть 4 · Привычка или сейчас?', 'جزء 4 · عادة ولا هلّأ؟', 'Part 4 · Habit or now?'),
      steps: [
        {
          type: 'guess', guess: [{
            id: 'lc_m_g1', picture: '📅 ⚡',
            show: ['Where do you usually read the news?', 'What are you reading now?'], highlight: ['do', 'are'],
            question: L('נחשו: איזו שאלה שואלת על הרגל?', 'Угадай: какой вопрос о привычке?', 'خمّن: أيّ سؤال بسأل عن عادة؟', 'Guess: which question asks about a habit?'),
            options: [
              { id: 'habit', label: L('Where do you usually read the news?', 'Where do you usually read the news?', 'Where do you usually read the news?', 'Where do you usually read the news?'), en: true },
              { id: 'now', label: L('What are you reading now?', 'What are you reading now?', 'What are you reading now?', 'What are you reading now?'), en: true },
            ],
            answer: 'habit',
            reveal: L('📅 הרגל ← do / does + פועל. ⚡ עכשיו ← am / is / are + ing.', '📅 Привычка → do / does + глагол. ⚡ Сейчас → am / is / are + ing.', '📅 عادة ← do / does + فعل. ⚡ هلّأ ← am / is / are + ing.', '📅 Habit → do / does + verb. ⚡ Now → am / is / are + -ing.'),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('קודם שואלים: זה הרגל או שזה קורה עכשיו? ואז בוחרים את מילת העזר.', 'Сначала спроси себя: это привычка или это происходит сейчас? Потом выбирай вспомогательное слово.', 'أوّل إشي اسأل: هاي عادة ولا عم بتصير هلّأ؟ وبعدين اختار الكلمة المساعدة.', 'First ask: is it a habit, or is it happening now? Then choose the helper.'),
            table: [{ left: '📅 habit', right: ['What do you watch?', 'What does she watch?'] }, { left: '⚡ now', right: ['What are you watching?', 'What is she watching?'] }],
            notes: [{ text: L('לא תמיד יש מילת סימן! הסתכלו על התמונה: 📅 או ⚡.', 'Слово-сигнал есть не всегда! Смотри на картинку: 📅 или ⚡.', 'مش دايمًا في كلمة إشارة! اطّلع عالصورة: 📅 أو ⚡.', 'There is not always a signal word! Look at the picture: 📅 or ⚡.'), examples: ['📅 → does', '⚡ → is'] }],
          },
        },
        {
          type: 'practice', title: L('הרגל או עכשיו?', 'Привычка или сейчас?', 'عادة ولا هلّأ؟', 'Habit or now?'),
          items: [
            {
              id: 'lc_m_sort', type: 'sort', stage: 'A', errorTag: 'TENSE_SELECTION',
              buckets: [{ id: 'habit', label: L('📅 שאלה על הרגל', '📅 вопрос о привычке', '📅 سؤال عن عادة', '📅 habit question') }, { id: 'now', label: L('⚡ שאלה על עכשיו', '⚡ вопрос о «сейчас»', '⚡ سؤال عن هلّأ', '⚡ now question') }],
              cards: [
                { text: 'Where do you usually read the news?', bucket: 'habit' }, { text: 'What are you reading now?', bucket: 'now' },
                { text: 'How often does she call her mom?', bucket: 'habit' }, { text: 'Who is she calling?', bucket: 'now' },
                { text: 'What do they watch on weekends?', bucket: 'habit' }, { text: 'Why are they chatting?', bucket: 'now' },
              ],
            },
            { id: 'lc_m1', type: 'multiple_choice', stage: 'A', frame: 'What ___ she watch every day?', options: ['does', 'is'], answer: 'does', target: WPS, errorTag: 'TENSE_SELECTION' },
            { id: 'lc_m2', type: 'multiple_choice', stage: 'A', frame: 'What ___ she watching now?', options: ['does', 'is'], answer: 'is', target: WPP, errorTag: 'TENSE_SELECTION' },
            { id: 'lc_m3', type: 'multiple_choice', stage: 'A', instruction: I_HABIT_NOW, image: '📅', prompt: HABIT, frame: 'Where ___ your dad read the news?', options: ['does', 'is'], answer: 'does', target: WPS, errorTag: 'TENSE_SELECTION' },
            { id: 'lc_m4', type: 'multiple_choice', stage: 'A', instruction: I_HABIT_NOW, image: '⚡', prompt: NOW, frame: 'Who ___ your dad calling?', options: ['does', 'is'], answer: 'is', target: WPP, errorTag: 'TENSE_SELECTION' },
            sent('lc_m5', L('⚡ במה אחותך צופה? (זה קורה עכשיו)', '⚡ Что смотрит твоя сестра? (это происходит сейчас)', '⚡ شو أختك عم بتحضر؟ (عم بصير هلّأ)', '⚡ what? · your sister · watch'), ['What is your sister watching?', 'What is your sister watching now?'], ['What', 'is', 'your sister', 'watching'], { ...WPP, verb: 'watch' }, { frame: 'What ___ your sister watching?', options: ['is', 'does'], answer: 'is' }, { rule: 'wh', image: '⚡', subjectHint: 'your sister = she', wrong: 'What does your sister watching?' }),
            sent('lc_m6', L('📅 איפה אחותך צופה בסרטונים? (הרגל)', '📅 Где твоя сестра смотрит видео? (привычка)', '📅 وين أختك بتحضر فيديوهات؟ (عادة)', '📅 where? · your sister · watch · videos'), ['Where does your sister watch videos?'], ['Where', 'does', 'your sister', 'watch', 'videos'], { ...WPS, verb: 'watch' }, { frame: 'Where ___ your sister watch videos?', options: ['does', 'is'], answer: 'does', base: 'do' }, { rule: 'wh', image: '📅', subjectHint: 'your sister = she' }),
            {
              id: 'lc_m_tm1', type: 'translate_multi', stage: 'E',
              parts: [
                { prompt: L('📅 במה את/ה צופה כל יום?', '📅 Что ты смотришь каждый день?', '📅 شو بتحضر كل يوم؟', '📅 what? · you · watch · every day'), acceptedAnswers: ['What do you watch every day?'], target: WPS },
                { prompt: L('⚡ במה את/ה צופה עכשיו?', '⚡ Что ты сейчас смотришь?', '⚡ شو عم بتحضر هلّأ؟', '⚡ what? · you · watch · now'), acceptedAnswers: ['What are you watching now?'], target: WPP },
              ],
            },
            {
              id: 'lc_m_tm2', type: 'translate_multi', stage: 'E',
              parts: [
                { prompt: L('📅 למי עומר מתקשר אחרי בית הספר?', '📅 Кому Омар звонит после школы?', '📅 لمين عمر بتّصل بعد المدرسة؟', '📅 who? · Omar · call · after school'), acceptedAnswers: ['Who does Omar call after school?'], target: WPS },
                { prompt: L('⚡ למי עומר מתקשר עכשיו?', '⚡ Кому Омар звонит сейчас?', '⚡ لمين عمر عم بتّصل هلّأ؟', '⚡ who? · Omar · call · now'), acceptedAnswers: ['Who is Omar calling now?'], target: WPP },
              ],
            },
            { id: 'lc_m_e1', type: 'error_correction', stage: 'E', wrong: 'What is she watch every day?', acceptedAnswers: ['What does she watch every day?'], target: WPS },
          ],
        },
      ],
    },
    { id: 'pause2', title: L('הפסקה', 'Перерыв', 'استراحة', 'Break'), steps: [{ type: 'pause' }] },

    // ───────────── END · Who? What? Where? When? + interview a friend + exit ─────────────
    {
      id: 'end', skill: 'wh_questions',
      title: L('סיום · שואלים לבד', 'Финал · спрашиваю сам(а)', 'الختام · بسأل لحالي', 'Finish · ask on your own'),
      steps: [
        {
          type: 'produce', items: [
            { id: 'lc_w_pic', type: 'wh_scaffold', stage: 'G', grammarSkill: 'pp_statements',
              situation: { emoji: '👧 📱 🏠 ⚡', caption: 'Lina · at home · now' },
              instruction: L('Who? What? Where? When? — ענו בקצרה על השאלות, ואז כתבו משפט אחד על לינה.', 'Who? What? Where? When? — коротко ответь на вопросы, потом напиши одно предложение о Лине.', 'Who? What? Where? When? — جاوب باختصار عالأسئلة، وبعدين اكتب جملة وحدة عن لينا.', 'Who? What? Where? When? — answer in short, then write one sentence about Lina.'),
              fields: ['Who?', 'What is she doing?', 'Where?', 'When?'],
              target: { structure: 'pp', person: 'third', verbs: ['call'] },
              models: ['Lina is calling her friend at home now.', 'Lina is using her phone at home now.'] },
            { id: 'lc_w_habit', type: 'free_production', stage: 'F',
              instruction: L('ראיון עם חבר/ה 🎤: כתבו שאלה אחת על הרגלי הטלפון שלו/ה (What / Where / When / How often).', 'Интервью с другом 🎤: напиши один вопрос о его / её привычках с телефоном (What / Where / When / How often).', 'مقابلة مع صاحب/ة 🎤: اكتب سؤال واحد عن عادات التلفون تبعه/ها (What / Where / When / How often).', 'Interview a friend 🎤: write one question about their phone habits (What / Where / When / How often).'),
              target: { structure: 'wh_ps', verbs: ['use', 'watch', 'call', 'read'] }, starter: 'What do you …',
              models: ['What do you watch on your phone?', 'Where do you use your phone?', 'How often do you call your friends?'] },
            { id: 'lc_w_now', type: 'free_production', stage: 'F',
              instruction: L('ועכשיו שאלה אחת על מה שהחבר/ה עושה ממש עכשיו ⚡.', 'А теперь один вопрос о том, что друг делает прямо сейчас ⚡.', 'وهلّأ سؤال واحد عن اللي صاحبك/صاحبتك عم يعمل/تعمل هلّأ بالزبط ⚡.', 'Now one question about what your friend is doing right now ⚡.'),
              target: { structure: 'wh_pp', verbs: ['watch', 'message', 'read'] }, starter: 'What are you …',
              models: ['What are you watching now?', 'Who are you messaging right now?'] },
          ],
        },
        {
          type: 'exit', items: [
            { id: 'lc_x1', type: 'translate', stage: 'E', prompt: L('איפה את/ה משחק/ת במשחקים?', 'Где ты играешь в игры?', 'وين بتلعب ألعاب؟', 'where? · you · play · games'), acceptedAnswers: ['Where do you play games?'], target: { ...WPS, verb: 'play' } },
            { id: 'lc_x2', type: 'translate', stage: 'E', prompt: L('כמה פעמים אחיך מפרסם סרטונים?', 'Как часто твой брат публикует видео?', 'قدّيش مرّة أخوك بنشر فيديوهات؟', 'how often? · your brother · post · videos'), acceptedAnswers: ['How often does your brother post videos?'], target: { ...WPS, verb: 'post' } },
            { id: 'lc_x3', type: 'translate', stage: 'E', prompt: L('למי את/ה שולח/ת הודעה עכשיו?', 'Кому ты сейчас пишешь сообщение?', 'لمين عم تبعت مسج هلّأ؟', 'who? · you · message · now'), acceptedAnswers: ['Who are you messaging now?'], target: { ...WPP, verb: 'message' } },
            { id: 'lc_x4', type: 'translate', stage: 'E', prompt: L('מה דנה קוראת ממש עכשיו?', 'Что Дана читает прямо сейчас?', 'شو دانا عم بتقرا هلّأ بالزبط؟', 'what? · Dana · read · right now'), acceptedAnswers: ['What is Dana reading right now?'], target: { ...WPP, verb: 'read' } },
          ],
        },
        {
          type: 'challenge', items: [
            { id: 'lc_c1', type: 'error_correction', stage: 'E', wrong: 'Where does your friends play games?', acceptedAnswers: ['Where do your friends play games?'], target: WPS },
            { id: 'lc_c2', type: 'transform', stage: 'E', source: 'Noa is chatting with her sister now.',
              instruction: L('כתבו שאלה על החלק "her sister" (אדם 🧑). התחילו ב-Who.', 'Задай вопрос к части «her sister» (человек 🧑). Начни с Who.', 'اكتب سؤال عن الجزء "her sister" (شخص 🧑). ابدا بـ Who.', 'Write a question about "her sister" (a person 🧑). Start with Who.'),
              acceptedAnswers: ['Who is Noa chatting with?', 'Who is Noa chatting with now?', 'Who is she chatting with?', 'Who is she chatting with now?'], target: WPP },
            { id: 'lc_c3', type: 'translate_multi', stage: 'E', parts: [
              { prompt: L('📅 כמה פעמים מאיה גוללת בלילה?', '📅 Как часто Майя листает ленту ночью?', '📅 قدّيش مرّة مايا بتسكرول بالليل؟', '📅 how often? · Maya · scroll · at night'), acceptedAnswers: ['How often does Maya scroll at night?'], target: WPS },
              { prompt: L('⚡ למה היא גוללת עכשיו?', '⚡ Почему она сейчас листает ленту?', '⚡ ليش عم بتسكرول هلّأ؟', '⚡ why? · she · scroll · now'), acceptedAnswers: ['Why is she scrolling now?'], target: WPP },
            ] },
          ],
        },
      ],
    },
  ],

  // Short repair rounds (3 items) — offered automatically when the same error repeats
  remediation: {
    WH_QUESTION: [
      { id: 'lc_rw1', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'Where ___ she read the news?', options: ['does', 'she', 'reads'], answer: 'does', target: WPS, showRule: true, ruleKey: 'wh' },
      { id: 'lc_rw2', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'What ___ they watching now?', options: ['are', 'does', 'is'], answer: 'are', target: WPP, showRule: true, ruleKey: 'wh' },
      { id: 'lc_rw3', type: 'sentence_builder', grammarSkill: 'wh_questions', stage: 'C', prompt: L('למי עומר מתקשר אחרי בית הספר?', 'Кому Омар звонит после школы?', 'لمين عمر بتّصل بعد المدرسة؟', 'who? · Omar · call · after school'), chunks: ['Who', 'does', 'Omar', 'call', 'after school'], acceptedAnswers: ['Who does Omar call after school?'], target: { ...WPS, verb: 'call' }, showRule: true, ruleKey: 'wh' },
    ],
    DO_DOES_QUESTION: [
      { id: 'lc_rd1', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'How often ___ you call your mom?', options: ['do', 'does'], answer: 'do', target: WPS, showRule: true, ruleKey: 'ps_q' },
      { id: 'lc_rd2', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'What ___ your brother watch on weekends?', options: ['do', 'does'], answer: 'does', target: WPS, showRule: true, ruleKey: 'ps_q' },
      { id: 'lc_rd3', type: 'multiple_choice', grammarSkill: 'ps_questions', stage: 'A', frame: '___ your friends play games after school?', options: ['Do', 'Does'], answer: 'Do', target: { structure: 'ps_q' }, showRule: true, ruleKey: 'ps_q' },
    ],
    BE_QUESTION: [
      { id: 'lc_rb1', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'Who ___ you calling now?', options: ['are', 'do', 'is'], answer: 'are', target: WPP, showRule: true, ruleKey: 'pp_q' },
      { id: 'lc_rb2', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'What ___ Maya reading now?', options: ['is', 'does', 'are'], answer: 'is', target: WPP, showRule: true, ruleKey: 'pp_q' },
      { id: 'lc_rb3', type: 'multiple_choice', grammarSkill: 'pp_questions', stage: 'A', frame: '___ your sister using her phone now?', options: ['Is', 'Does', 'Are'], answer: 'Is', target: { structure: 'pp_q' }, showRule: true, ruleKey: 'pp_q' },
    ],
    DOES_BASE_VERB: [
      { id: 'lc_rv1', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'When does she ___ her friends?', options: ['call', 'calls'], answer: 'call', target: WPS, showRule: true, ruleKey: 'ps_q' },
      { id: 'lc_rv2', type: 'multiple_choice', grammarSkill: 'wh_questions', stage: 'A', frame: 'What does your dad ___ every morning?', options: ['read', 'reads'], answer: 'read', target: WPS, showRule: true, ruleKey: 'wh' },
      { id: 'lc_rv3', type: 'multiple_choice', grammarSkill: 'ps_negative', stage: 'A', frame: "My sister doesn't ___ TV at night.", options: ['watch', 'watches'], answer: 'watch', target: { structure: 'ps_neg' }, showRule: true, ruleKey: 'ps_neg' },
    ],
  },
};
