// LESSON B (≈60 min): don't / doesn't → am not / isn't / aren't → Do / Does …? → Am / Is / Are …? → which question?
// Theme: phones. Every part is gated by its own grammar skill — a part opens only after the teacher marks it as taught.
// Item shapes: see the comment block at the top of lesson_a_s_ing_progressive.js.
// No WH questions here (What / Where / When …) — they are taught in lesson C.

const L = (he, ru, ar, en) => ({ he, ru, ar, en });
const sent = (id, prompt, acceptedAnswers, chunks, target, focus, extra = {}) => ({ id, kind: 'sentence', prompt, acceptedAnswers, chunks, target, focus, ...extra });

const PP = { structure: 'pp' };
const BE = { structure: 'be' };
const ING = { structure: 'ing' };
const PSN = { structure: 'ps_neg' };
const PPN = { structure: 'pp_neg' };
const PSQ = { structure: 'ps_q' };
const PPQ = { structure: 'pp_q' };

const TO_NEG = L("כתבו את המשפט בשלילה (don't / doesn't).", "Напиши предложение в отрицании (don't / doesn't).", "اكتب الجملة بالنفي (don't / doesn't).", "Make the sentence negative (don't / doesn't).");
const TO_PPNEG = L("כתבו את המשפט בשלילה (isn't / aren't / am not).", "Напиши предложение в отрицании (isn't / aren't / am not).", "اكتب الجملة بالنفي (isn't / aren't / am not).", "Make the sentence negative (isn't / aren't / am not).");
const TO_Q = L('הפכו את המשפט לשאלה (Do / Does).', 'Преврати предложение в вопрос (Do / Does).', 'حوّل الجملة لسؤال (Do / Does).', 'Make the sentence a question (Do / Does).');
const TO_PPQ = L('הפכו את המשפט לשאלה (Am / Is / Are).', 'Преврати предложение в вопрос (Am / Is / Are).', 'حوّل الجملة لسؤال (Am / Is / Are).', 'Make the sentence a question (Am / Is / Are).');
const PICTURE = L('הסתכלו בתמונה: הרגל 📅 או עכשיו ⚡? בחרו את השאלה.', 'Посмотри на картинку: привычка 📅 или сейчас ⚡? Выбери вопрос.', 'اطّلع عالصورة: عادة 📅 ولا هلّأ ⚡؟ اختار السؤال.', 'Look at the picture: habit 📅 or now ⚡? Choose the question.');
const SHORT = L('בחרו את התשובה הקצרה הנכונה.', 'Выбери правильный короткий ответ.', 'اختار الجواب القصير الصحّ.', 'Choose the correct short answer.');

export default {
  id: 'lesson_b',
  order: 2,
  theme: 'phones',
  title: L('שיעור 2 · שלילה ושאלות', 'Урок 2 · Отрицание и вопросы', 'درس 2 · النفي والأسئلة', 'Lesson 2 · Negatives and questions'),
  goal: L(
    "אני יודע/ת לכתוב מה אנשים לא עושים (she doesn't use / she isn't using) ולשאול שאלות (Does she use…? / Is she using…?).",
    "Я умею писать, что люди не делают (she doesn't use / she isn't using), и задавать вопросы (Does she use…? / Is she using…?).",
    "بعرف أكتب شو الناس ما بعملوا (she doesn't use / she isn't using) وأسأل أسئلة (Does she use…? / Is she using…?).",
    "I can write what people don't do (she doesn't use / she isn't using) and ask questions (Does she use…? / Is she using…?)."
  ),
  parts: [
    // ───────────── WARM-UP ─────────────
    {
      id: 'warm', skill: 'third_person_s',
      title: L('חימום', 'Разминка', 'تسخين', 'Warm-up'),
      steps: [
        {
          type: 'warmup', items: [
            { id: 'lb_w1', type: 'multiple_choice', grammarSkill: 'third_person_s', stage: 'A', frame: 'My sister ___ videos every day.', options: ['watch', 'watches'], answer: 'watches', target: { person: 'third', verb: 'watch', form: 'watches' } },
            { id: 'lb_w2', type: 'multiple_choice', grammarSkill: 'am_is_are', stage: 'A', frame: 'My friends ___ at home.', options: ['am', 'is', 'are'], answer: 'are', target: BE },
            { id: 'lb_w3', type: 'multiple_choice', grammarSkill: 'verb_ing', stage: 'A', frame: 'chat → ___', options: ['chating', 'chatting'], answer: 'chatting', target: ING },
            { id: 'lb_w4', type: 'multiple_choice', grammarSkill: 'ps_vs_pp', stage: 'A', frame: 'Right now Omar ___ a game.', options: ['plays', 'is playing'], answer: 'is playing', target: PP },
          ],
        },
        { type: 'choose' },
      ],
    },

    // ───────────── PART 1 · don't / doesn't ─────────────
    {
      id: 'psneg', skill: 'ps_negative',
      title: L("חלק 1 · don't / doesn't", "Часть 1 · don't / doesn't", "جزء 1 · don't / doesn't", "Part 1 · don't / doesn't"),
      steps: [
        {
          type: 'guess', guess: [
            {
              id: 'lb_n_g1', show: ['I watch TV at night.', "I don't watch TV at night."], highlight: ["don't"],
              question: L("מה המילה don't עושה למשפט? נחשו!", "Что слово don't делает с предложением? Угадай!", "شو بتعمل كلمة don't للجملة؟ خمّن!", "What does don't do to the sentence? Guess!"),
              options: [
                { id: 'neg', label: L('הופכת אותו לשלילה (לא)', 'Делает его отрицательным (не)', 'بتقلبها لنفي (ما / مش)', 'It makes it negative (not)') },
                { id: 'q', label: L('הופכת אותו לשאלה', 'Делает его вопросом', 'بتقلبها لسؤال', 'It makes it a question') },
                { id: 'now', label: L('אומרת שזה קורה עכשיו', 'Говорит, что это происходит сейчас', 'بتحكي إنه عم بصير هلّأ', 'It says it is happening now') },
              ],
              answer: 'neg',
              reveal: L("don't = do not = לא. אני לא צופה בטלוויזיה בלילה.", "don't = do not = не. Я не смотрю телевизор ночью.", "don't = do not = ما. أنا ما بحضر تلفزيون بالليل.", "don't = do not. I don't watch TV at night."),
            },
            {
              id: 'lb_n_g2', show: ["I don't use my phone in class.", "She doesn't use her phone in class."], highlight: ["don't", "doesn't"],
              question: L("מתי כותבים doesn't? נחשו!", "Когда пишем doesn't? Угадай!", "إمتى منكتب doesn't؟ خمّن!", "When do we write doesn't? Guess!"),
              options: [
                { id: 'he_she', label: L('עם he / she / it', 'С he / she / it', 'مع he / she / it', 'With he / she / it') },
                { id: 'we_they', label: L('עם we / they', 'С we / they', 'مع we / they', 'With we / they') },
                { id: 'always', label: L('תמיד', 'Всегда', 'دايمًا', 'Always') },
              ],
              answer: 'he_she',
              reveal: L("he / she / it ← doesn't. I / you / we / they ← don't.", "he / she / it → doesn't. I / you / we / they → don't.", "he / she / it ← doesn't. I / you / we / they ← don't.", "he / she / it → doesn't. I / you / we / they → don't."),
            },
            {
              id: 'lb_n_g3', show: ["She doesn't ___ her phone in class."], highlight: ["doesn't"],
              question: L('נחשו: איזו מילה מתאימה?', 'Угадай: какое слово подходит?', 'خمّن: أيّ كلمة بتزبط؟', 'Guess: which word fits?'),
              options: [{ id: 'use', label: L('use', 'use', 'use', 'use'), en: true }, { id: 'uses', label: L('uses', 'uses', 'uses', 'uses'), en: true }],
              answer: 'use',
              reveal: L("doesn't use. ה-S כבר נמצאת ב-doesn't — הפועל בלי S.", "doesn't use. S уже есть в doesn't — глагол без S.", "doesn't use. الـ S موجودة بـ doesn't — الفعل بدون S.", "doesn't use. The S is already in doesn't — the verb has no S."),
            },
          ],
        },
        {
          type: 'learn', learn: {
            oneLine: L("שלילה: don't / doesn't + פועל בסיס (בלי S).", "Отрицание: don't / doesn't + глагол в базовой форме (без S).", "النفي: don't / doesn't + الفعل الأصلي (بدون S).", "Negative: don't / doesn't + base verb (no S)."),
            formula: [{ text: 'Subject' }, { text: '+' }, { text: "don't / doesn't", key: true }, { text: '+' }, { text: 'verb (no S)', key: true }],
            table: [{ left: 'I / you / we / they', right: ["don't use", "don't call", "don't watch"] }, { left: 'he / she / it', right: ["doesn't use", "doesn't call", "doesn't watch"] }],
            transforms: [
              { from: ['She', 'uses', 'her phone', 'in class'], to: ['She', "doesn't", 'use', 'her phone', 'in class'], mark: ["doesn't", 'use'], note: L("ה-S עוברת ל-does / doesn't — הפועל חוזר לצורת הבסיס.", "S переходит в does / doesn't — глагол возвращается в базовую форму.", "الـ S بتنتقل لـ does / doesn't — الفعل برجع لأصله.", "The S moves to does / doesn't — the verb goes back to base.") },
              { from: ['I', 'watch', 'TV'], to: ['I', "don't", 'watch', 'TV'], mark: ["don't"], note: L("עם I / you / we / they מוסיפים don't. הפועל לא משתנה.", "С I / you / we / they добавляем don't. Глагол не меняется.", "مع I / you / we / they منزيد don't. الفعل ما بتغيّر.", "With I / you / we / they add don't. The verb does not change.") },
            ],
            notes: [{ text: L('שתי הצורות נכונות:', 'Обе формы правильные:', 'الشكلين صحّ:', 'Both forms are correct:'), examples: ["don't = do not", "doesn't = does not"] }],
          },
        },
        { type: 'examples', examples: [
          { en: "I don't watch TV at night.", highlight: "don't watch", mark: false, tr: L('אני לא צופה בטלוויזיה בלילה.', 'Я не смотрю телевизор ночью.', 'أنا ما بحضر تلفزيون بالليل.', '') },
          { en: "My brother doesn't use his phone in class.", highlight: "doesn't use", mark: false, subjectNote: 'my brother = he', tr: L('אחי לא משתמש בטלפון שלו בכיתה.', 'Мой брат не пользуется телефоном на уроке.', 'أخوي ما بستعمل تلفونه بالصف.', '') },
          { en: "We don't play games after school.", highlight: "don't play", mark: false, tr: L('אנחנו לא משחקים במשחקים אחרי בית הספר.', 'Мы не играем в игры после школы.', 'إحنا ما بنلعب ألعاب بعد المدرسة.', '') },
          { en: "Maya doesn't call her friends at night.", highlight: "doesn't call", mark: false, subjectNote: 'Maya = she', tr: L('מאיה לא מתקשרת לחברות שלה בלילה.', 'Майя не звонит подругам ночью.', 'مايا ما بتتّصل بصاحباتها بالليل.', '') },
        ] },
        {
          type: 'check', items: [
            { id: 'lb_nc1', type: 'multiple_choice', stage: 'A', frame: 'She ___ TV at night.', options: ["don't watch", "doesn't watch", "doesn't watches"], answer: "doesn't watch", target: PSN },
            { id: 'lb_nc2', type: 'multiple_choice', stage: 'A', frame: 'They ___ games in class.', options: ["don't play", "doesn't play"], answer: "don't play", target: PSN },
            { id: 'lb_nc3', type: 'multiple_choice', stage: 'A', frame: 'My dad ___ his phone at night.', options: ["doesn't use", "doesn't uses", "don't use"], answer: "doesn't use", target: PSN },
          ],
        },
        {
          type: 'practice', title: L("תרגול don't / doesn't · סבב 1", "Практика don't / doesn't · раунд 1", "تمرين don't / doesn't · جولة 1", "don't / doesn't practice · round 1"),
          items: [
            sent('lb_n1', L('היא לא משתמשת בטלפון שלה בלילה.', 'Она не пользуется своим телефоном ночью.', 'هي ما بتستعمل التلفون تبعها بالليل.', 'not · she · use · her phone · at night'), ["She doesn't use her phone at night.", 'She does not use her phone at night.', "At night she doesn't use her phone."], ['She', "doesn't use", 'her phone', 'at night'], { ...PSN, person: 'third', verb: 'use' }, { frame: 'She ___ her phone at night.', options: ["doesn't use", "doesn't uses", "don't use"], answer: "doesn't use", base: 'use' }, { rule: 'ps_neg', wrong: "She doesn't uses her phone at night.", image: '👧📱🌙❌' }),
            sent('lb_n2', L('אני לא צופה בטלוויזיה בלילה.', 'Я не смотрю телевизор ночью.', 'أنا ما بحضر تلفزيون بالليل.', 'not · I · watch · TV · at night'), ["I don't watch TV at night.", 'I do not watch TV at night.', "At night I don't watch TV."], ['I', "don't watch", 'TV', 'at night'], { ...PSN, person: 'first', verb: 'watch' }, { frame: 'I ___ TV at night.', options: ["don't watch", "doesn't watch", 'not watch'], answer: "don't watch", base: 'watch' }, { rule: 'ps_neg', wrong: 'I not watch TV at night.', image: '🙋📺🌙❌' }),
            { id: 'lb_n_pf1', type: 'pair_fill', stage: 'B', verb: 'play', frames: ['I ___ games in class.', 'My brother ___ games in class.'], answers: [["don't play", 'do not play'], ["doesn't play", 'does not play']], target: PSN },
            sent('lb_n3', L('אנחנו לא מצ׳טטים בכיתה.', 'Мы не переписываемся на уроке.', 'إحنا ما بنشات بالصف.', 'not · we · chat · in class'), ["We don't chat in class.", 'We do not chat in class.', "In class we don't chat."], ['We', "don't chat", 'in class'], { ...PSN, person: 'plural', verb: 'chat' }, { frame: 'We ___ in class.', options: ["don't chat", "doesn't chat", "don't chats"], answer: "don't chat", base: 'chat' }, { rule: 'ps_neg' }),
            { id: 'lb_n_match', type: 'match', stage: 'A', errorTag: 'DONT_DOESNT', pairs: [{ left: 'I', right: "don't" }, { left: 'My mom', right: "doesn't" }, { left: 'We', right: "don't" }, { left: 'Omar', right: "doesn't" }, { left: 'My friends', right: "don't" }, { left: 'It', right: "doesn't" }] },
            sent('lb_n4', L('אמא שלי לא קוראת חדשות בלילה.', 'Моя мама не читает новости ночью.', 'إمّي ما بتقرا الأخبار بالليل.', 'not · my mom · read · the news · at night'), ["My mom doesn't read the news at night.", 'My mom does not read the news at night.', "My mom doesn't read news at night.", "My mother doesn't read the news at night."], ['My mom', "doesn't read", 'the news', 'at night'], { ...PSN, person: 'third', verb: 'read' }, { frame: 'My mom ___ the news at night.', options: ["doesn't read", "don't read", "doesn't reads"], answer: "doesn't read", base: 'read' }, { rule: 'ps_neg', subjectHint: 'my mom = she', wrong: "My mom don't read the news at night." }),
            { id: 'lb_n_l1', type: 'listen_choose', stage: 'A', audio: "Omar doesn't play games on weekends.", options: ["Omar doesn't play games on weekends.", "Omar don't play games on weekends.", "Omar doesn't plays games on weekends."], answer: "Omar doesn't play games on weekends.", errorTag: 'DONT_DOESNT' },
            sent('lb_n5', L('הם לא שולחים הודעות בכיתה.', 'Они не отправляют сообщения на уроке.', 'همّ ما ببعتوا مسجات بالصف.', 'not · they · send · messages · in class'), ["They don't send messages in class.", 'They do not send messages in class.', "In class they don't send messages."], ['They', "don't send", 'messages', 'in class'], { ...PSN, person: 'plural', verb: 'send' }, { frame: 'They ___ messages in class.', options: ["don't send", "doesn't send", "don't sends"], answer: "don't send", base: 'send' }, { rule: 'ps_neg' }),
          ],
        },
        {
          type: 'practice', title: L("תרגול don't / doesn't · סבב 2", "Практика don't / doesn't · раунд 2", "تمرين don't / doesn't · جولة 2", "don't / doesn't practice · round 2"),
          items: [
            { id: 'lb_n_t1', type: 'transform', stage: 'E', source: 'My sister watches videos at night.', instruction: TO_NEG, acceptedAnswers: ["My sister doesn't watch videos at night.", 'My sister does not watch videos at night.'], target: PSN },
            sent('lb_n6', L('דנה לא מקשיבה למוזיקה בכיתה.', 'Дана не слушает музыку на уроке.', 'دانا ما بتسمع موسيقى بالصف.', 'not · Dana · listen to · music · in class'), ["Dana doesn't listen to music in class.", 'Dana does not listen to music in class.'], ['Dana', "doesn't listen", 'to music', 'in class'], { ...PSN, person: 'third', verb: 'listen' }, { frame: 'Dana ___ to music in class.', options: ["doesn't listen", "doesn't listens", "don't listen"], answer: "doesn't listen", base: 'listen' }, { rule: 'ps_neg', subjectHint: 'Dana = she', wrong: "Dana doesn't listens to music in class." }),
            { id: 'lb_n_e1', type: 'error_correction', stage: 'E', wrong: "My brother doesn't uses his phone in class.", acceptedAnswers: ["My brother doesn't use his phone in class.", 'My brother does not use his phone in class.'], target: PSN },
            { id: 'lb_n_chat', type: 'text_gaps', stage: 'B', target: PSN, chat: [
              { from: 'Maya', text: 'I ___ my phone in class.', base: 'use', answer: ["don't use", 'do not use'] },
              { from: 'me', text: 'OK. My sister ___ her phone at night.', base: 'use', answer: ["doesn't use", 'does not use'] },
              { from: 'Maya', text: 'My friends ___ videos in class.', base: 'watch', answer: ["don't watch", 'do not watch'] },
            ] },
            sent('lb_n7', L('החברים שלי לא משחקים במשחקים בלילה.', 'Мои друзья не играют в игры ночью.', 'صحابي ما بلعبوا ألعاب بالليل.', 'not · my friends · play · games · at night'), ["My friends don't play games at night.", 'My friends do not play games at night.'], ['My friends', "don't play", 'games', 'at night'], { ...PSN, person: 'plural', verb: 'play' }, { frame: 'My friends ___ games at night.', options: ["don't play", "doesn't play", "don't plays"], answer: "don't play", base: 'play' }, { rule: 'ps_neg', subjectHint: 'my friends = they', wrong: "My friends doesn't play games at night." }),
            { id: 'lb_n_t2', type: 'transform', stage: 'E', source: 'We call our dad after school.', instruction: TO_NEG, acceptedAnswers: ["We don't call our dad after school.", 'We do not call our dad after school.', "We don't call our father after school."], target: PSN },
            { id: 'lb_n_f1', type: 'fill_blank', stage: 'B', frame: 'Noam ___ TV on weekends.', base: 'watch', answer: "doesn't watch", subjectHint: 'Noam = he', target: PSN },
            { id: 'lb_n_tr1', type: 'translate', stage: 'E', prompt: L('אני לא גולל/ת בטלפון בלילה.', 'Я не листаю ленту ночью.', 'أنا ما بسكرول عالتلفون بالليل.', 'not · I · scroll · at night'), acceptedAnswers: ["I don't scroll at night.", 'I do not scroll at night.', "At night I don't scroll.", "I don't scroll on my phone at night."], target: { ...PSN, person: 'first', verb: 'scroll' } },
          ],
        },
      ],
    },
    { id: 'pause1', title: L('הפסקה', 'Перерыв', 'استراحة', 'Break'), steps: [{ type: 'pause' }] },

    // ───────────── PART 2 · am not / isn't / aren't + -ing ─────────────
    {
      id: 'ppneg', skill: 'pp_negative',
      title: L("חלק 2 · לא קורה עכשיו: isn't / aren't", "Часть 2 · Не происходит сейчас: isn't / aren't", "جزء 2 · مش عم بصير هلّأ: isn't / aren't", "Part 2 · Not happening now: isn't / aren't"),
      steps: [
        {
          type: 'guess', guess: [{
            id: 'lb_pn_g1', picture: '👦🎮⚡',
            show: ['Omar is playing a game.', 'Omar is not playing a game.'], highlight: ['not'],
            question: L('נחשו: איפה עומדת המילה not?', 'Угадай: где стоит слово not?', 'خمّن: وين بتيجي كلمة not؟', 'Guess: where does not go?'),
            options: [
              { id: 'after', label: L('אחרי is', 'После is', 'بعد is', 'After is') },
              { id: 'before', label: L('לפני is', 'Перед is', 'قبل is', 'Before is') },
              { id: 'end', label: L('בסוף המשפט', 'В конце предложения', 'بآخر الجملة', 'At the end') },
            ],
            answer: 'after',
            reveal: L("is + not = is not = isn't. כאן אין don't / doesn't!", "is + not = is not = isn't. Здесь нет don't / doesn't!", "is + not = is not = isn't. هون ما في don't / doesn't!", "is + not = is not = isn't. No don't / doesn't here!"),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('לא קורה עכשיו? am / is / are + not + פועל-ing', 'Не происходит сейчас? am / is / are + not + глагол-ing', 'مش عم بصير هلّأ؟ am / is / are + not + فعل-ing', 'Not happening now? am / is / are + not + verb-ing'),
            formula: [{ text: 'Subject' }, { text: '+' }, { text: 'am / is / are', key: true }, { text: '+' }, { text: 'not', key: true }, { text: '+' }, { text: 'verb-ing', key: true }],
            table: [{ left: 'I', right: ['am not playing', "I'm not playing"] }, { left: 'he / she / it', right: ['is not playing', "isn't playing"] }, { left: 'you / we / they', right: ['are not playing', "aren't playing"] }],
            transforms: [
              { from: ['They', 'are', 'playing'], to: ['They', 'are', 'not', 'playing'], mark: ['not'], note: L('not נכנסת אחרי am / is / are.', 'not встаёт после am / is / are.', 'not بتيجي بعد am / is / are.', 'not goes after am / is / are.') },
              { from: ['They', 'are', 'not', 'playing'], to: ['They', "aren't", 'playing'], mark: ["aren't"], note: L("are + not = aren't · is + not = isn't", "are + not = aren't · is + not = isn't", "are + not = aren't · is + not = isn't", "are + not = aren't · is + not = isn't") },
              { from: ['I', 'am', 'not', 'playing'], to: ["I'm", 'not', 'playing'], mark: ["I'm"], note: L("I am not = I'm not", "I am not = I'm not", "I am not = I'm not", "I am not = I'm not") },
            ],
            notes: [{ text: L("כבר יש am / is / are — לא מוסיפים don't / doesn't!", "Уже есть am / is / are — don't / doesn't не добавляем!", "في am / is / are — ما منزيد don't / doesn't!", "There is already am / is / are — do not add don't / doesn't!"), examples: ["She isn't calling.", "They aren't playing."] }],
          },
        },
        { type: 'examples', examples: [
          { en: "I'm not watching TV now.", highlight: "I'm not watching", mark: false, tr: L('אני לא צופה בטלוויזיה עכשיו.', 'Я сейчас не смотрю телевизор.', 'أنا مش عم بحضر تلفزيون هلّأ.', '') },
          { en: "My sister isn't using her phone right now.", highlight: "isn't using", mark: false, tr: L('אחותי לא משתמשת בטלפון שלה ממש עכשיו.', 'Моя сестра прямо сейчас не пользуется телефоном.', 'أختي مش عم بتستعمل التلفون تبعها هلّأ بالزبط.', '') },
          { en: "They aren't playing a game at the moment.", highlight: "aren't playing", mark: false, tr: L('הם לא משחקים במשחק כרגע.', 'Они сейчас не играют в игру.', 'همّ مش عم بلعبوا لعبة بهاي اللحظة.', '') },
          { en: 'Omar is not calling his dad now.', highlight: 'is not calling', mark: false, tr: L('עומר לא מתקשר לאבא שלו עכשיו.', 'Омар сейчас не звонит папе.', 'عمر مش عم بتّصل بأبوه هلّأ.', '') },
        ] },
        {
          type: 'practice', title: L("תרגול isn't / aren't", "Практика isn't / aren't", "تمرين isn't / aren't", "isn't / aren't practice"),
          items: [
            { id: 'lb_pn1', type: 'multiple_choice', stage: 'A', frame: 'She ___ her phone now.', options: ["isn't using", "doesn't using", "isn't use"], answer: "isn't using", target: PPN },
            { id: 'lb_pn_match', type: 'match', stage: 'A', errorTag: 'PROGRESSIVE_NEGATIVE', pairs: [{ left: 'is not', right: "isn't" }, { left: 'are not', right: "aren't" }, { left: 'I am', right: "I'm" }, { left: 'do not', right: "don't" }, { left: 'does not', right: "doesn't" }] },
            sent('lb_pn2', L('אני לא צופה בטלוויזיה עכשיו.', 'Я сейчас не смотрю телевизор.', 'أنا مش عم بحضر تلفزيون هلّأ.', 'now → not · I · watch · TV'), ['I am not watching TV now.', "I'm not watching TV now.", "Now I'm not watching TV."], ['I', 'am not watching', 'TV', 'now'], { ...PPN, verb: 'watch' }, { frame: 'I ___ TV now.', options: ['am not watching', "don't watching", 'not watching'], answer: 'am not watching', base: 'watch' }, { rule: 'pp_neg', wrong: "I don't watching TV now.", image: '🙋📺❌⚡' }),
            { id: 'lb_pn_pf', type: 'pair_fill', stage: 'B', verb: 'play', frames: ['I ___ a game now.', 'My brother ___ a game now.', 'My friends ___ a game now.'], answers: ['am not playing', ["isn't playing", 'is not playing'], ["aren't playing", 'are not playing']], target: PPN },
            sent('lb_pn3', L('אחותי לא משתמשת בטלפון שלה ממש עכשיו.', 'Моя сестра прямо сейчас не пользуется телефоном.', 'أختي مش عم بتستعمل التلفون تبعها هلّأ بالزبط.', 'right now → not · my sister · use · her phone'), ["My sister isn't using her phone right now.", 'My sister is not using her phone right now.', "Right now my sister isn't using her phone."], ['My sister', "isn't using", 'her phone', 'right now'], { ...PPN, verb: 'use' }, { frame: 'My sister ___ her phone right now.', options: ["isn't using", "doesn't using", "aren't using"], answer: "isn't using", base: 'use' }, { rule: 'pp_neg', subjectHint: 'my sister = she', wrong: "My sister doesn't using her phone right now." }),
            { id: 'lb_pn_l1', type: 'listen_choose', stage: 'A', audio: "They aren't chatting now.", options: ["They aren't chatting now.", "They don't chatting now.", "They aren't chat now."], answer: "They aren't chatting now.", errorTag: 'PROGRESSIVE_NEGATIVE' },
            { id: 'lb_pn_t1', type: 'transform', stage: 'E', source: 'Dana is reading a book now.', instruction: TO_PPNEG, acceptedAnswers: ["Dana isn't reading a book now.", 'Dana is not reading a book now.'], target: PPN },
            { id: 'lb_pn_e1', type: 'error_correction', stage: 'E', wrong: "They don't playing a game now.", acceptedAnswers: ["They aren't playing a game now.", 'They are not playing a game now.', "They're not playing a game now."], target: PPN },
            { id: 'lb_pn_chat', type: 'text_gaps', stage: 'B', target: PPN, chat: [
              { from: 'me', text: 'Hi Maya! I am at home.' },
              { from: 'me', text: 'I ___ TV now.', base: 'watch', answer: 'am not watching' },
              { from: 'Maya', text: 'My brother ___ a book.', base: 'read', answer: ["isn't reading", 'is not reading'] },
              { from: 'Maya', text: 'He is playing a game!' },
              { from: 'me', text: 'My friends ___ right now.', base: 'chat', answer: ["aren't chatting", 'are not chatting'] },
            ] },
            sent('lb_pn4', L('אנחנו לא מצ׳טטים כרגע.', 'Мы сейчас не переписываемся.', 'إحنا مش عم بنشات بهاي اللحظة.', 'at the moment → not · we · chat'), ["We aren't chatting at the moment.", 'We are not chatting at the moment.', "We're not chatting at the moment."], ['We', "aren't chatting", 'at the moment'], { ...PPN, verb: 'chat' }, { frame: 'We ___ at the moment.', options: ["aren't chatting", "don't chatting", "aren't chating"], answer: "aren't chatting", base: 'chat' }, { rule: 'pp_neg' }),
          ],
        },
      ],
    },

    // ───────────── PART 3 · Do / Does …? ─────────────
    {
      id: 'psq', skill: 'ps_questions',
      title: L('חלק 3 · שאלות: Do / Does', 'Часть 3 · Вопросы: Do / Does', 'جزء 3 · أسئلة: Do / Does', 'Part 3 · Questions: Do / Does'),
      steps: [
        {
          type: 'guess', guess: [
            {
              id: 'lb_q_g1', show: ['She calls her mom every day.', 'Does she call her mom every day?'], highlight: ['calls', 'Does', 'call'],
              question: L('מה השתנה בשאלה? נחשו!', 'Что изменилось в вопросе? Угадай!', 'شو تغيّر بالسؤال؟ خمّن!', 'What changed in the question? Guess!'),
              options: [
                { id: 'does', label: L('Does באה בהתחלה, ו-calls איבדה את ה-S', 'Does встало в начало, а calls потеряло S', 'Does إجت بالأوّل، و calls خسرت الـ S', 'Does came first, and calls lost its S') },
                { id: 'mark', label: L('רק נוסף סימן שאלה', 'Только добавился знак вопроса', 'بس انضافت علامة سؤال', 'Only a question mark was added') },
                { id: 'nothing', label: L('שום דבר', 'Ничего', 'ولا إشي', 'Nothing') },
              ],
              answer: 'does',
              reveal: L('ה-S עברה מ-calls ל-Does. בשאלה: Does + she + call.', 'S перешла из calls в Does. В вопросе: Does + she + call.', 'الـ S انتقلت من calls لـ Does. بالسؤال: Does + she + call.', 'The S moved from calls to Does. Question: Does + she + call.'),
            },
            {
              id: 'lb_q_g2', show: ['Do you use your phone at night?', 'Does your brother use his phone at night?'], highlight: ['Do', 'Does'],
              question: L('מתי שואלים עם Does? נחשו!', 'Когда спрашиваем с Does? Угадай!', 'إمتى منسأل مع Does؟ خمّن!', 'When do we ask with Does? Guess!'),
              options: [
                { id: 'he_she', label: L('עם he / she / it', 'С he / she / it', 'مع he / she / it', 'With he / she / it') },
                { id: 'you', label: L('עם I / you / we / they', 'С I / you / we / they', 'مع I / you / we / they', 'With I / you / we / they') },
                { id: 'always', label: L('תמיד', 'Всегда', 'دايمًا', 'Always') },
              ],
              answer: 'he_she',
              reveal: L('your brother = he ← Does. you ← Do.', 'your brother = he → Does. you → Do.', 'your brother = he ← Does. you ← Do.', 'your brother = he → Does. you → Do.'),
            },
          ],
        },
        {
          type: 'learn', learn: {
            oneLine: L('שאלה: Do / Does + נושא + פועל בסיס ?', 'Вопрос: Do / Does + подлежащее + глагол в базовой форме ?', 'سؤال: Do / Does + فاعل + الفعل الأصلي ؟', 'Question: Do / Does + subject + base verb ?'),
            formula: [{ text: 'Do / Does', key: true }, { text: '+' }, { text: 'subject' }, { text: '+' }, { text: 'verb (no S)', key: true }, { text: '?' }],
            table: [{ left: 'I / you / we / they', right: ['Do you call…?', 'Do they play…?'] }, { left: 'he / she / it', right: ['Does she call…?', 'Does he play…?'] }],
            transforms: [
              { from: ['She', 'calls', 'her mom'], to: ['Does', 'she', 'call', 'her mom', '?'], mark: ['Does', 'call'], note: L('calls ← call: ה-S עוברת ל-Does.', 'calls → call: S переходит в Does.', 'calls ← call: الـ S بتروح لـ Does.', 'calls → call: the S goes to Does.') },
              { from: ['You', 'use', 'your phone'], to: ['Do', 'you', 'use', 'your phone', '?'], mark: ['Do'], note: L('עם I / you / we / they — Do בהתחלה. הפועל לא משתנה.', 'С I / you / we / they — Do в начале. Глагол не меняется.', 'مع I / you / we / they — Do بالأوّل. الفعل ما بتغيّر.', 'With I / you / we / they — Do comes first. The verb does not change.') },
            ],
            notes: [{ text: L('תשובות קצרות:', 'Короткие ответы:', 'أجوبة قصيرة:', 'Short answers:'), examples: ['Yes, she does.', "No, she doesn't.", 'Yes, I do.', "No, I don't."] }],
          },
        },
        { type: 'examples', examples: [
          { en: 'Do you use your phone at night?', highlight: 'Do use', mark: false, tr: L('את/ה משתמש/ת בטלפון שלך בלילה?', 'Ты пользуешься телефоном ночью?', 'إنت بتستعمل تلفونك بالليل؟', '') },
          { en: 'Does your sister watch videos every day?', highlight: 'Does watch', mark: false, subjectNote: 'your sister = she', tr: L('אחותך צופה בסרטונים כל יום?', 'Твоя сестра смотрит видео каждый день?', 'أختك بتحضر فيديوهات كل يوم؟', '') },
          { en: 'Do your friends play games after school?', highlight: 'Do play', mark: false, subjectNote: 'your friends = they', tr: L('החברים שלך משחקים במשחקים אחרי בית הספר?', 'Твои друзья играют в игры после школы?', 'صحابك بلعبوا ألعاب بعد المدرسة؟', '') },
          { en: 'Does Omar call his mom after school?', highlight: 'Does call', mark: false, subjectNote: 'Omar = he', tr: L('עומר מתקשר לאמא שלו אחרי בית הספר?', 'Омар звонит маме после школы?', 'عمر بتّصل بإمّه بعد المدرسة؟', '') },
        ] },
        {
          type: 'check', items: [
            { id: 'lb_qc1', type: 'multiple_choice', stage: 'A', frame: '___ your brother play games?', options: ['Do', 'Does'], answer: 'Does', target: PSQ },
            { id: 'lb_qc2', type: 'multiple_choice', stage: 'A', frame: '___ they chat after school?', options: ['Do', 'Does'], answer: 'Do', target: PSQ },
            { id: 'lb_qc3', type: 'multiple_choice', stage: 'A', frame: 'Does she ___ her mom every day?', options: ['call', 'calls'], answer: 'call', target: PSQ },
          ],
        },
        {
          type: 'practice', title: L('תרגול Do / Does · סבב 1', 'Практика Do / Does · раунд 1', 'تمرين Do / Does · جولة 1', 'Do / Does practice · round 1'),
          items: [
            sent('lb_q1', L('היא מתקשרת לאמא שלה כל יום?', 'Она звонит маме каждый день?', 'هي بتتّصل بإمّها كل يوم؟', '? · she · call · her mom · every day'), ['Does she call her mom every day?', 'Does she call her mother every day?'], ['Does', 'she', 'call', 'her mom', 'every day'], { ...PSQ, person: 'third', verb: 'call' }, { frame: '___ she call her mom every day?', options: ['Does', 'Do'], answer: 'Does', base: 'do / does' }, { rule: 'ps_q', wrong: 'Does she calls her mom every day?', image: '👧📞👩📅' }),
            sent('lb_q2', L('את/ה משחק/ת במשחקים אחרי בית הספר?', 'Ты играешь в игры после школы?', 'إنت بتلعب ألعاب بعد المدرسة؟', '? · you · play · games · after school'), ['Do you play games after school?'], ['Do', 'you', 'play', 'games', 'after school'], { ...PSQ, person: 'plural', verb: 'play' }, { frame: '___ you play games after school?', options: ['Do', 'Does'], answer: 'Do', base: 'do / does' }, { rule: 'ps_q', wrong: 'Does you play games after school?' }),
            { id: 'lb_q_pf', type: 'pair_fill', stage: 'B', verb: 'do / does', frames: ['___ you watch TV at night?', '___ your dad watch TV at night?'], answers: ['Do', 'Does'], target: PSQ },
            sent('lb_q3', L('מאיה שולחת הודעות לחברות שלה אחרי בית הספר?', 'Майя пишет сообщения подругам после школы?', 'مايا بتبعت مسجات لصاحباتها بعد المدرسة؟', '? · Maya · message · her friends · after school'), ['Does Maya message her friends after school?', 'Does Maya send messages to her friends after school?'], ['Does', 'Maya', 'message', 'her friends', 'after school'], { ...PSQ, person: 'third', verb: 'message' }, { frame: 'Does Maya ___ her friends after school?', options: ['message', 'messages'], answer: 'message', base: 'message' }, { rule: 'ps_q', subjectHint: 'Maya = she', wrong: 'Does Maya messages her friends after school?' }),
            { id: 'lb_q_l1', type: 'listen_choose', stage: 'A', audio: 'Does your brother use his phone in class?', options: ['Does your brother use his phone in class?', 'Do your brother use his phone in class?', 'Does your brother uses his phone in class?'], answer: 'Does your brother use his phone in class?', errorTag: 'DO_DOES_QUESTION' },
            { id: 'lb_q_t1', type: 'transform', stage: 'E', source: 'They watch videos on weekends.', instruction: TO_Q, acceptedAnswers: ['Do they watch videos on weekends?'], target: PSQ },
            sent('lb_q4', L('החברים שלך מצ׳טטים בלילה?', 'Твои друзья переписываются ночью?', 'صحابك بشاتوا بالليل؟', '? · your friends · chat · at night'), ['Do your friends chat at night?'], ['Do', 'your friends', 'chat', 'at night'], { ...PSQ, person: 'plural', verb: 'chat' }, { frame: '___ your friends chat at night?', options: ['Do', 'Does'], answer: 'Do', base: 'do / does' }, { rule: 'ps_q', subjectHint: 'your friends = they', wrong: 'Does your friends chat at night?' }),
            { id: 'lb_q_sa1', type: 'multiple_choice', stage: 'A', instruction: SHORT, frame: 'Does Maya play games? ___', options: ['Yes, she does.', 'Yes, she plays.', 'Yes, she do.'], answer: 'Yes, she does.', target: PSQ, errorTag: 'DO_DOES_QUESTION' },
          ],
        },
        {
          type: 'practice', title: L('תרגול Do / Does · סבב 2', 'Практика Do / Does · раунд 2', 'تمرين Do / Does · جولة 2', 'Do / Does practice · round 2'),
          items: [
            { id: 'lb_q_e1', type: 'error_correction', stage: 'E', wrong: 'Do she play games after school?', acceptedAnswers: ['Does she play games after school?'], target: PSQ },
            sent('lb_q5', L('אבא שלך קורא חדשות כל בוקר?', 'Твой папа читает новости каждое утро?', 'أبوك بقرا الأخبار كل صبح؟', '? · your dad · read · the news · every morning'), ['Does your dad read the news every morning?', 'Does your dad read news every morning?', 'Does your father read the news every morning?'], ['Does', 'your dad', 'read', 'the news', 'every morning'], { ...PSQ, person: 'third', verb: 'read' }, { frame: 'Does your dad ___ the news every morning?', options: ['read', 'reads'], answer: 'read', base: 'read' }, { rule: 'ps_q', subjectHint: 'your dad = he', wrong: 'Does your dad reads the news every morning?' }),
            { id: 'lb_q_chat', type: 'text_gaps', stage: 'B', target: PSQ, chat: [
              { from: 'Maya', text: '___ you listen to music at night?', base: 'do / does', answer: 'Do' },
              { from: 'me', text: 'Yes, I do.' },
              { from: 'me', text: '___ your sister listen to music at night?', base: 'do / does', answer: 'Does' },
              { from: 'Maya', text: "No, she doesn't." },
              { from: 'me', text: '___ your friends play games on weekends?', base: 'do / does', answer: 'Do' },
            ] },
            { id: 'lb_q_sa2', type: 'multiple_choice', stage: 'A', instruction: SHORT, frame: 'Do you watch TV at night? ___', options: ["No, I don't.", "No, I doesn't.", 'No, I not.'], answer: "No, I don't.", target: PSQ, errorTag: 'DO_DOES_QUESTION' },
            { id: 'lb_q_t2', type: 'transform', stage: 'E', source: 'Noa sends messages after school.', instruction: TO_Q, acceptedAnswers: ['Does Noa send messages after school?'], target: PSQ },
            sent('lb_q6', L('הוא משתמש בטלפון שלו בכיתה?', 'Он пользуется телефоном на уроке?', 'هو بستعمل تلفونه بالصف؟', '? · he · use · his phone · in class'), ['Does he use his phone in class?'], ['Does', 'he', 'use', 'his phone', 'in class'], { ...PSQ, person: 'third', verb: 'use' }, { frame: 'Does he ___ his phone in class?', options: ['use', 'uses'], answer: 'use', base: 'use' }, { rule: 'ps_q', wrong: 'Does he uses his phone in class?' }),
            { id: 'lb_q_tr1', type: 'translate', stage: 'E', prompt: L('הם משתפים סרטונים בסופי שבוע?', 'Они делятся видео по выходным?', 'همّ بشاركوا فيديوهات بالويكند؟', '? · they · share · videos · on weekends'), acceptedAnswers: ['Do they share videos on weekends?'], target: { ...PSQ, person: 'plural', verb: 'share' } },
          ],
        },
      ],
    },
    { id: 'pause2', title: L('הפסקה', 'Перерыв', 'استراحة', 'Break'), steps: [{ type: 'pause' }] },

    // ───────────── PART 4 · Am / Is / Are …-ing? ─────────────
    {
      id: 'ppq', skill: 'pp_questions',
      title: L('חלק 4 · שאלות "עכשיו": Am / Is / Are', 'Часть 4 · Вопросы «сейчас»: Am / Is / Are', 'جزء 4 · أسئلة "هلّأ": Am / Is / Are', 'Part 4 · "Now" questions: Am / Is / Are'),
      steps: [
        {
          type: 'guess', guess: [{
            id: 'lb_pq_g1', picture: '👦📞⚡',
            show: ['He is calling his mom now.', 'Is he calling his mom now?'], highlight: ['is', 'Is'],
            question: L('מה השתנה בשאלה? נחשו!', 'Что изменилось в вопросе? Угадай!', 'شو تغيّر بالسؤال؟ خمّن!', 'What changed in the question? Guess!'),
            options: [
              { id: 'swap', label: L('he ו-is החליפו מקום', 'he и is поменялись местами', 'he و is بدّلوا أماكنهم', 'he and is changed places') },
              { id: 'do', label: L('נוספה המילה Do', 'Добавилось слово Do', 'انضافت كلمة Do', 'The word Do was added') },
              { id: 'nothing', label: L('שום דבר', 'Ничего', 'ولا إشي', 'Nothing') },
            ],
            answer: 'swap',
            reveal: L('is קופצת להתחלה: Is he calling…? לא צריך Do / Does.', 'is прыгает в начало: Is he calling…? Do / Does не нужно.', 'is بتنط للأوّل: Is he calling…؟ ما في داعي لـ Do / Does.', 'is jumps to the start: Is he calling…? No Do / Does.'),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('שאלה על עכשיו: Am / Is / Are + נושא + פועל-ing ?', 'Вопрос про сейчас: Am / Is / Are + подлежащее + глагол-ing ?', 'سؤال عن هلّأ: Am / Is / Are + فاعل + فعل-ing ؟', 'Question about now: Am / Is / Are + subject + verb-ing ?'),
            formula: [{ text: 'Am / Is / Are', key: true }, { text: '+' }, { text: 'subject' }, { text: '+' }, { text: 'verb-ing', key: true }, { text: '?' }],
            table: [{ left: 'I', right: ['Am I playing?'] }, { left: 'he / she / it', right: ['Is she playing?'] }, { left: 'you / we / they', right: ['Are you playing?'] }],
            transforms: [
              { from: ['She', 'is', 'using', 'her phone'], to: ['Is', 'she', 'using', 'her phone', '?'], mark: ['Is'], note: L('is קופצת להתחלה. לא צריך Do / Does!', 'is прыгает в начало. Do / Does не нужно!', 'is بتنط للأوّل. ما في داعي لـ Do / Does!', 'is jumps to the start. No Do / Does!') },
              { from: ['They', 'are', 'playing'], to: ['Are', 'they', 'playing', '?'], mark: ['Are'], note: L('are קופצת להתחלה. הפועל נשאר עם ing.', 'are прыгает в начало. Глагол остаётся с ing.', 'are بتنط للأوّل. الفعل بضل مع ing.', 'are jumps to the start. The verb keeps -ing.') },
            ],
            notes: [{ text: L('תשובות קצרות:', 'Короткие ответы:', 'أجوبة قصيرة:', 'Short answers:'), examples: ['Yes, she is.', "No, she isn't.", 'Yes, I am.', "No, I'm not."] }],
          },
        },
        { type: 'examples', examples: [
          { en: 'Are you using your phone now?', highlight: 'Are using', mark: false, tr: L('את/ה משתמש/ת בטלפון שלך עכשיו?', 'Ты сейчас пользуешься телефоном?', 'إنت عم بتستعمل تلفونك هلّأ؟', '') },
          { en: 'Is your brother playing a game right now?', highlight: 'Is playing', mark: false, subjectNote: 'your brother = he', tr: L('אחיך משחק במשחק ממש עכשיו?', 'Твой брат прямо сейчас играет в игру?', 'أخوك عم بلعب لعبة هلّأ بالزبط؟', '') },
          { en: 'Is Maya chatting with her friends?', highlight: 'Is chatting', mark: false, subjectNote: 'Maya = she', tr: L('מאיה מצ׳טטת עם החברות שלה (עכשיו)?', 'Майя (сейчас) переписывается с подругами?', 'مايا عم بتشات مع صاحباتها؟', '') },
          { en: 'Are they watching TV at the moment?', highlight: 'Are watching', mark: false, tr: L('הם צופים בטלוויזיה כרגע?', 'Они сейчас смотрят телевизор?', 'همّ عم بحضروا تلفزيون بهاي اللحظة؟', '') },
        ] },
        {
          type: 'practice', title: L('תרגול Am / Is / Are', 'Практика Am / Is / Are', 'تمرين Am / Is / Are', 'Am / Is / Are practice'),
          items: [
            { id: 'lb_pq1', type: 'multiple_choice', stage: 'A', frame: '___ she using her phone now?', options: ['Is', 'Does', 'Are'], answer: 'Is', target: PPQ },
            sent('lb_pq2', L('את/ה צופה בטלוויזיה עכשיו?', 'Ты сейчас смотришь телевизор?', 'إنت عم بتحضر تلفزيون هلّأ؟', '? · now · you · watch · TV'), ['Are you watching TV now?'], ['Are', 'you', 'watching', 'TV', 'now'], { ...PPQ, verb: 'watch' }, { frame: '___ you watching TV now?', options: ['Are', 'Do', 'Is'], answer: 'Are', base: 'am / is / are' }, { rule: 'pp_q', wrong: 'Do you watching TV now?' }),
            sent('lb_pq3', L('אחיך משחק במשחק ממש עכשיו?', 'Твой брат прямо сейчас играет в игру?', 'أخوك عم بلعب لعبة هلّأ بالزبط؟', '? · right now · your brother · play · a game'), ['Is your brother playing a game right now?', 'Right now is your brother playing a game?'], ['Is', 'your brother', 'playing', 'a game', 'right now'], { ...PPQ, verb: 'play' }, { frame: 'Is your brother ___ a game right now?', options: ['playing', 'play', 'plays'], answer: 'playing', base: 'play' }, { rule: 'pp_q', subjectHint: 'your brother = he', wrong: 'Is your brother play a game right now?' }),
            { id: 'lb_pq_pf', type: 'pair_fill', stage: 'B', verb: 'am / is / are', frames: ['___ you chatting now?', '___ Maya chatting now?', '___ your friends chatting now?'], answers: ['Are', 'Is', 'Are'], target: PPQ },
            { id: 'lb_pq_t1', type: 'transform', stage: 'E', source: 'Omar is calling his dad.', instruction: TO_PPQ, acceptedAnswers: ['Is Omar calling his dad?', 'Is Omar calling his father?'], target: PPQ },
            { id: 'lb_pq_l1', type: 'listen_choose', stage: 'A', audio: 'Are they playing a game now?', options: ['Are they playing a game now?', 'Do they playing a game now?', 'They are playing a game now.'], answer: 'Are they playing a game now?', errorTag: 'BE_QUESTION' },
            { id: 'lb_pq_e1', type: 'error_correction', stage: 'E', wrong: 'Is she use her phone now?', acceptedAnswers: ['Is she using her phone now?'], target: PPQ },
            sent('lb_pq4', L('דנה קוראת חדשות כרגע?', 'Дана сейчас читает новости?', 'دانا عم بتقرا الأخبار بهاي اللحظة؟', '? · at the moment · Dana · read · the news'), ['Is Dana reading the news at the moment?', 'Is Dana reading news at the moment?'], ['Is', 'Dana', 'reading', 'the news', 'at the moment'], { ...PPQ, verb: 'read' }, { frame: '___ Dana reading the news at the moment?', options: ['Is', 'Does', 'Are'], answer: 'Is', base: 'am / is / are' }, { rule: 'pp_q', subjectHint: 'Dana = she', wrong: 'Does Dana reading the news at the moment?' }),
            { id: 'lb_pq_sa', type: 'multiple_choice', stage: 'A', instruction: SHORT, frame: 'Are you listening to music now? ___', options: ["No, I'm not.", "No, I don't."], answer: "No, I'm not.", target: PPQ, errorTag: 'BE_QUESTION' },
          ],
        },
      ],
    },

    // ───────────── PART 5 · Mixed: which question? ─────────────
    {
      id: 'mixq', skill: 'pp_questions', requiredSkills: ['ps_questions'],
      title: L('חלק 5 · איזו שאלה? Do / Does או Is / Are', 'Часть 5 · Какой вопрос? Do / Does или Is / Are', 'جزء 5 · أيّ سؤال؟ Do / Does ولا Is / Are', 'Part 5 · Mixed: which question?'),
      steps: [
        {
          type: 'learn', learn: {
            oneLine: L('הרגל? ← Do / Does. קורה עכשיו? ← Am / Is / Are + ing.', 'Привычка? → Do / Does. Происходит сейчас? → Am / Is / Are + ing.', 'عادة؟ ← Do / Does. عم بصير هلّأ؟ ← Am / Is / Are + ing.', 'Habit? → Do / Does. Happening now? → Am / Is / Are + -ing.'),
            table: [{ left: '📅 habit', right: ['Do you play…?', 'Does she play…?'] }, { left: '⚡ now', right: ['Are you playing…?', 'Is she playing…?'] }],
            notes: [{ text: L('לא רק לחפש מילת סימן — הסתכלו בתמונה ושאלו: הרגל או עכשיו?', 'Не только ищи слово-сигнал — посмотри на картинку: привычка или сейчас?', 'مش بس دوّر على كلمة إشارة — اطّلع عالصورة واسأل: عادة ولا هلّأ؟', 'Do not only look for a signal word — look at the picture: habit or now?'), examples: ['📅 Does she watch TV?', '⚡ Is she watching TV?'] }],
          },
        },
        {
          type: 'practice', title: L('איזו שאלה?', 'Какой вопрос?', 'أيّ سؤال؟', 'Which question?'),
          items: [
            {
              id: 'lb_m_sort', type: 'sort', stage: 'A', errorTag: 'TENSE_SELECTION',
              buckets: [{ id: 'habit', label: L('📅 שאלה על הרגל', '📅 вопрос о привычке', '📅 سؤال عن عادة', '📅 habit question') }, { id: 'now', label: L('⚡ שאלה על עכשיו', '⚡ вопрос о «сейчас»', '⚡ سؤال عن هلّأ', '⚡ now question') }],
              cards: [
                { text: 'Does she watch TV every day?', bucket: 'habit' }, { text: 'Is she watching TV now?', bucket: 'now' },
                { text: 'Do you play games on weekends?', bucket: 'habit' }, { text: 'Are you playing a game?', bucket: 'now' },
                { text: 'Does Omar call his mom after school?', bucket: 'habit' }, { text: 'Is Omar calling his mom?', bucket: 'now' },
              ],
            },
            { id: 'lb_m1', type: 'multiple_choice', stage: 'A', frame: '___ your sister read the news every morning?', options: ['Does', 'Is'], answer: 'Does', target: PSQ },
            { id: 'lb_m2', type: 'multiple_choice', stage: 'A', frame: '___ your sister reading the news now?', options: ['Does', 'Is'], answer: 'Is', target: PPQ },
            { id: 'lb_m3', type: 'multiple_choice', stage: 'A', instruction: PICTURE, image: '👧📺⚡', prompt: L('מאיה צופה בטלוויזיה?', 'Майя смотрит телевизор?', 'مايا بتحضر تلفزيون؟', '? · Maya · watch · TV'), options: ['Does Maya watch TV?', 'Is Maya watching TV?'], answer: 'Is Maya watching TV?', target: PPQ, errorTag: 'TENSE_SELECTION' },
            { id: 'lb_m4', type: 'multiple_choice', stage: 'A', instruction: PICTURE, image: '📅👧📺', prompt: L('מאיה צופה בטלוויזיה?', 'Майя смотрит телевизор?', 'مايا بتحضر تلفزيون؟', '? · Maya · watch · TV'), options: ['Does Maya watch TV?', 'Is Maya watching TV?'], answer: 'Does Maya watch TV?', target: PSQ, errorTag: 'TENSE_SELECTION' },
            { id: 'lb_m_chat', type: 'text_gaps', stage: 'B', chat: [
              { from: 'Maya', text: '___ you chatting with Dana now?', base: 'do / does / am / is / are', answer: 'Are' },
              { from: 'me', text: 'No. I am watching TV.' },
              { from: 'Maya', text: '___ you watch TV every day?', base: 'do / does / am / is / are', answer: 'Do' },
              { from: 'me', text: 'Yes, I do.' },
              { from: 'me', text: '___ your brother play games on weekends?', base: 'do / does / am / is / are', answer: 'Does' },
            ], targets: [PPQ, null, PSQ, null, PSQ] },
            { id: 'lb_m5', type: 'multiple_choice', stage: 'A', instruction: PICTURE, image: '👦🎮⚡', prompt: L('עומר משחק במשחק?', 'Омар играет в игру?', 'عمر بلعب لعبة؟', '? · Omar · play · a game'), options: ['Does Omar play games?', 'Is Omar playing a game?'], answer: 'Is Omar playing a game?', target: PPQ, errorTag: 'TENSE_SELECTION' },
            { id: 'lb_m_tr1', type: 'translate', stage: 'E', prompt: L('אבא שלך משתמש בטלפון שלו עכשיו?', 'Твой папа сейчас пользуется телефоном?', 'أبوك عم بستعمل تلفونه هلّأ؟', '? · now · your dad · use · his phone'), acceptedAnswers: ['Is your dad using his phone now?', 'Is your father using his phone now?'], target: { ...PPQ, verb: 'use' } },
            { id: 'lb_m_tr2', type: 'translate', stage: 'E', prompt: L('אבא שלך משתמש בטלפון שלו בלילה?', 'Твой папа пользуется телефоном ночью?', 'أبوك بستعمل تلفونه بالليل؟', '? · your dad · use · his phone · at night'), acceptedAnswers: ['Does your dad use his phone at night?', 'Does your father use his phone at night?'], target: { ...PSQ, person: 'third', verb: 'use' } },
          ],
        },
      ],
    },

    // ───────────── END · write + exit ticket ─────────────
    {
      id: 'end', skill: 'pp_questions', requiredSkills: ['ps_negative', 'pp_negative', 'ps_questions'],
      title: L('סיום · כותבים לבד', 'Финал · пишу сам(а)', 'الختام · بكتب لحالي', 'Finish · write on your own'),
      steps: [
        {
          type: 'produce', items: [
            { id: 'lb_pr1', type: 'free_production', stage: 'F', grammarSkill: 'ps_questions',
              situation: { emoji: '🎤 🧑‍🤝‍🧑 📱 📅', caption: 'Interview · your friend · phone habits' },
              instruction: L('ראיון: כתבו 2 שאלות לחבר/ה על מה שהוא/היא עושה עם הטלפון. התחילו ב-Do you …?', 'Интервью: напиши 2 вопроса другу о том, что он делает с телефоном. Начни с Do you …?', 'مقابلة: اكتب سؤالين لصاحبك عن شو بعمل بالتلفون. ابدأ بـ Do you …؟', 'Interview: write 2 questions to ask a friend about their phone habits. Start with Do you …?'),
              target: { structure: 'ps_q', person: 'plural', verbs: ['use', 'play', 'watch', 'chat'] }, starter: 'Do you …', models: ['Do you use your phone at night? Do you play games after school?', 'Do you watch videos every day?'] },
            { id: 'lb_pr2', type: 'free_production', stage: 'F', grammarSkill: 'ps_negative',
              situation: { emoji: '🙋 ❌ 📱 🌙', caption: "Me · something I don't do" },
              instruction: L("כתבו משפט אחד על משהו שאת/ה לא עושה (I don't …).", "Напиши одно предложение о том, что ты не делаешь (I don't …).", "اكتب جملة وحدة عن إشي إنت ما بتعمله (I don't …).", "Write one sentence about something you don't do (I don't …)."),
              target: { structure: 'ps_neg', person: 'first', verbs: ['use', 'play', 'watch'] }, starter: "I don't …", models: ["I don't play games at night.", "I don't use my phone in class."] },
            { id: 'lb_pr3', type: 'free_production', stage: 'F', grammarSkill: 'pp_negative',
              situation: { emoji: '👧 📖 ⚡ · ❌ 📱', caption: 'Maya · now · a book — not her phone' },
              instruction: L("מה מאיה לא עושה עכשיו? כתבו משפט אחד עם isn't.", "Что Майя сейчас не делает? Напиши одно предложение с isn't.", "شو مايا مش عم بتعمل هلّأ؟ اكتب جملة وحدة مع isn't.", "What is Maya not doing now? Write one sentence with isn't."),
              target: { structure: 'pp_neg', person: 'third', verbs: ['use'] }, starter: "Maya isn't …", models: ["Maya isn't using her phone now.", "Maya isn't using her phone. She is reading a book."] },
          ],
        },
        {
          type: 'exit', items: [
            { id: 'lb_x1', type: 'translate', stage: 'E', grammarSkill: 'ps_negative', prompt: L('אחי לא משחק במשחקים בלילה.', 'Мой брат не играет в игры ночью.', 'أخوي ما بلعب ألعاب بالليل.', 'not · my brother · play · games · at night'), acceptedAnswers: ["My brother doesn't play games at night.", 'My brother does not play games at night.'], target: { ...PSN, person: 'third', verb: 'play' } },
            { id: 'lb_x2', type: 'translate', stage: 'E', grammarSkill: 'pp_negative', prompt: L('אני לא משתמש/ת בטלפון שלי עכשיו.', 'Я сейчас не пользуюсь телефоном.', 'أنا مش عم بستعمل التلفون تبعي هلّأ.', 'now → not · I · use · my phone'), acceptedAnswers: ["I'm not using my phone now.", 'I am not using my phone now.', "Now I'm not using my phone."], target: { ...PPN, verb: 'use' } },
            { id: 'lb_x3', type: 'translate', stage: 'E', grammarSkill: 'ps_questions', prompt: L('אחותך צופה בסרטונים כל יום?', 'Твоя сестра смотрит видео каждый день?', 'أختك بتحضر فيديوهات كل يوم؟', '? · your sister · watch · videos · every day'), acceptedAnswers: ['Does your sister watch videos every day?'], target: { ...PSQ, person: 'third', verb: 'watch' } },
            { id: 'lb_x4', type: 'translate', stage: 'E', grammarSkill: 'pp_questions', prompt: L('הם מצ׳טטים ממש עכשיו?', 'Они прямо сейчас переписываются?', 'همّ عم بشاتوا هلّأ بالزبط؟', '? · right now · they · chat'), acceptedAnswers: ['Are they chatting right now?'], target: { ...PPQ, verb: 'chat' } },
          ],
        },
        {
          type: 'challenge', items: [
            { id: 'lb_c1', type: 'error_correction', stage: 'E', grammarSkill: 'pp_negative', wrong: "She doesn't using her phone now.", acceptedAnswers: ["She isn't using her phone now.", 'She is not using her phone now.', "She's not using her phone now."], target: PPN },
            { id: 'lb_c2', type: 'transform', stage: 'E', grammarSkill: 'ps_questions', source: 'Dana listens to music every day.', instruction: TO_Q, acceptedAnswers: ['Does Dana listen to music every day?'], target: PSQ },
            { id: 'lb_c3', type: 'translate_multi', stage: 'E', grammarSkill: 'pp_questions', parts: [
              { prompt: L('עומר משחק במשחקים אחרי בית הספר?', 'Омар играет в игры после школы?', 'عمر بلعب ألعاب بعد المدرسة؟', '? · Omar · play · games · after school'), acceptedAnswers: ['Does Omar play games after school?'], target: { ...PSQ, person: 'third', verb: 'play' } },
              { prompt: L('עומר משחק במשחק עכשיו?', 'Омар сейчас играет в игру?', 'عمر عم بلعب لعبة هلّأ؟', '? · now · Omar · play · a game'), acceptedAnswers: ['Is Omar playing a game now?'], target: { ...PPQ, verb: 'play' } },
            ] },
          ],
        },
      ],
    },
  ],

  // Short repair rounds (3 items) — offered automatically when the same error repeats
  remediation: {
    DONT_DOESNT: [
      { id: 'lb_rn1', type: 'multiple_choice', grammarSkill: 'ps_negative', stage: 'A', frame: 'My sister ___ TV at night.', options: ["don't watch", "doesn't watch"], answer: "doesn't watch", target: PSN, showRule: true, ruleKey: 'ps_neg' },
      { id: 'lb_rn2', type: 'multiple_choice', grammarSkill: 'ps_negative', stage: 'A', frame: 'We ___ games in class.', options: ["don't play", "doesn't play"], answer: "don't play", target: PSN, showRule: true, ruleKey: 'ps_neg' },
      { id: 'lb_rn3', type: 'multiple_choice', grammarSkill: 'ps_negative', stage: 'A', frame: 'Omar ___ his phone in class.', options: ["don't use", "doesn't use"], answer: "doesn't use", target: PSN, showRule: true, ruleKey: 'ps_neg' },
    ],
    DOES_BASE_VERB: [
      { id: 'lb_rd1', type: 'multiple_choice', grammarSkill: 'ps_negative', stage: 'A', frame: "She doesn't ___ her phone at night.", options: ['use', 'uses'], answer: 'use', target: PSN, showRule: true, ruleKey: 'ps_neg' },
      { id: 'lb_rd2', type: 'multiple_choice', grammarSkill: 'ps_questions', stage: 'A', frame: 'Does he ___ his mom every day?', options: ['call', 'calls'], answer: 'call', target: PSQ, showRule: true, ruleKey: 'ps_q' },
      { id: 'lb_rd3', type: 'multiple_choice', grammarSkill: 'ps_negative', stage: 'A', frame: "My dad doesn't ___ the news.", options: ['read', 'reads'], answer: 'read', target: PSN, showRule: true, ruleKey: 'ps_neg' },
    ],
    PROGRESSIVE_NEGATIVE: [
      { id: 'lb_rp1', type: 'multiple_choice', grammarSkill: 'pp_negative', stage: 'A', frame: 'They ___ playing a game now.', options: ["aren't", "don't"], answer: "aren't", target: PPN, showRule: true, ruleKey: 'pp_neg' },
      { id: 'lb_rp2', type: 'multiple_choice', grammarSkill: 'pp_negative', stage: 'A', frame: 'I ___ watching TV now.', options: ['am not', "don't"], answer: 'am not', target: PPN, showRule: true, ruleKey: 'pp_neg' },
      { id: 'lb_rp3', type: 'multiple_choice', grammarSkill: 'pp_negative', stage: 'A', frame: 'My brother ___ using his phone now.', options: ["isn't", "doesn't"], answer: "isn't", target: PPN, showRule: true, ruleKey: 'pp_neg' },
    ],
    DO_DOES_QUESTION: [
      { id: 'lb_rq1', type: 'multiple_choice', grammarSkill: 'ps_questions', stage: 'A', frame: '___ your sister play games?', options: ['Do', 'Does'], answer: 'Does', target: PSQ, showRule: true, ruleKey: 'ps_q' },
      { id: 'lb_rq2', type: 'multiple_choice', grammarSkill: 'ps_questions', stage: 'A', frame: '___ you call your dad after school?', options: ['Do', 'Does'], answer: 'Do', target: PSQ, showRule: true, ruleKey: 'ps_q' },
      { id: 'lb_rq3', type: 'multiple_choice', grammarSkill: 'ps_questions', stage: 'A', frame: '___ Omar watch videos every day?', options: ['Do', 'Does'], answer: 'Does', target: PSQ, showRule: true, ruleKey: 'ps_q' },
    ],
    BE_QUESTION: [
      { id: 'lb_rb1', type: 'multiple_choice', grammarSkill: 'pp_questions', stage: 'A', frame: '___ you using your phone now?', options: ['Am', 'Is', 'Are'], answer: 'Are', target: PPQ, showRule: true, ruleKey: 'pp_q' },
      { id: 'lb_rb2', type: 'multiple_choice', grammarSkill: 'pp_questions', stage: 'A', frame: '___ Maya chatting now?', options: ['Am', 'Is', 'Are'], answer: 'Is', target: PPQ, showRule: true, ruleKey: 'pp_q' },
      { id: 'lb_rb3', type: 'multiple_choice', grammarSkill: 'pp_questions', stage: 'A', frame: '___ your friends watching TV?', options: ['Is', 'Are', 'Do'], answer: 'Are', target: PPQ, showRule: true, ruleKey: 'be' },
    ],
  },
};
