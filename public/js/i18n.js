// Student-interface strings in every support language.
// he = Hebrew · ru = Russian · ar = spoken Jerusalem / Palestinian Arabic · en = English-only mode.
// {name} placeholders are filled by t(key, vars).

export const LANGS = {
  he: { name: 'עברית', dir: 'rtl' },
  ar: { name: 'عربي (محكي)', dir: 'rtl' },
  ru: { name: 'Русский', dir: 'ltr' },
  en: { name: 'English', dir: 'ltr' },
};

const S = {
  app_name: { he: 'מעבדת ההווה', ru: 'Лаборатория Present', ar: 'مختبر الحاضر', en: 'Present Lab' },
  who_are_you: { he: 'מי אתם?', ru: 'Кто ты?', ar: 'مين إنت؟', en: 'Who are you?' },
  student: { he: 'תלמיד / תלמידה', ru: 'Ученик / ученица', ar: 'طالب / طالبة', en: 'Student' },
  teacher: { he: 'מורה', ru: 'Учитель', ar: 'معلّم / معلّمة', en: 'Teacher' },
  choose_name: { he: 'בחרו את השם שלכם', ru: 'Выбери своё имя', ar: 'اختار اسمك', en: 'Choose your name' },
  enter_code: { he: 'הקלידו את הקוד שלכם', ru: 'Введи свой код', ar: 'اكتب الكود تبعك', en: 'Type your code' },
  enter: { he: 'כניסה', ru: 'Войти', ar: 'فوت', en: 'Enter' },
  wrong_code: { he: 'הקוד לא מתאים. נסו שוב.', ru: 'Код не подходит. Попробуй ещё раз.', ar: 'الكود مش مزبوط. جرّب كمان مرّة.', en: 'That code does not match. Try again.' },
  logout: { he: 'יציאה', ru: 'Выйти', ar: 'طلوع', en: 'Log out' },
  back: { he: 'חזרה', ru: 'Назад', ar: 'رجوع', en: 'Back' },
  help_language: { he: 'שפת עזרה', ru: 'Язык помощи', ar: 'لغة المساعدة', en: 'Help language' },
  toolbox: { he: 'ארגז כלים', ru: 'Инструменты', ar: 'صندوق الأدوات', en: 'Toolbox' },
  toolbox_sub: { he: 'אפשר לפתוח בכל רגע. זה לא מוריד נקודות.', ru: 'Можно открыть в любой момент. Баллы не снимаются.', ar: 'فيك تفتحه بأيّ وقت. ما بنقّص علامات.', en: 'Open it any time. It never lowers your score.' },
  toolbox_locked: { he: 'נלמד בהמשך', ru: 'Выучим позже', ar: 'منتعلّمه بعدين', en: 'Coming later' },
  close: { he: 'סגירה', ru: 'Закрыть', ar: 'سكّر', en: 'Close' },

  where_are_we: { he: 'איפה אנחנו?', ru: 'Где мы сейчас?', ar: 'وين إحنا؟', en: 'Where are we?' },
  we_learned: { he: 'כבר למדנו', ru: 'Мы уже выучили', ar: 'تعلّمنا', en: 'We have learned' },
  today: { he: 'היום', ru: 'Сегодня', ar: 'اليوم', en: 'Today' },
  coming_later: { he: 'בהמשך', ru: 'Позже', ar: 'بعدين', en: 'Coming later' },
  words_learned: { he: 'מילים שלמדנו', ru: 'Слова, которые мы выучили', ar: 'كلمات تعلّمناها', en: 'Words we learned' },
  your_task: { he: 'המשימה שלך', ru: 'Твоё задание', ar: 'المهمّة تبعك', en: 'Your task' },
  start: { he: 'מתחילים', ru: 'Начать', ar: 'يلّا نبلّش', en: 'Start' },
  continue: { he: 'ממשיכים', ru: 'Продолжить', ar: 'كمّل', en: 'Continue' },
  done: { he: 'הושלם ✓', ru: 'Готово ✓', ar: 'خلص ✓', en: 'Done ✓' },
  do_again: { he: 'לעשות שוב', ru: 'Пройти ещё раз', ar: 'اعمل كمان مرّة', en: 'Do it again' },
  review_title: { he: 'חוזרים על מה שלמדנו בכיתה', ru: 'Повторяем то, что учили в классе', ar: 'منراجع اللي تعلّمناه بالصف', en: 'Review what we learned in class' },
  review_sub: { he: 'קודם מנחשים — אחר כך לומדים', ru: 'Сначала угадываем — потом учим', ar: 'أوّل منخمّن — بعدين منتعلّم', en: 'First you guess — then you learn' },
  words_of: { he: 'מילים: {set}', ru: 'Слова: {set}', ar: 'كلمات: {set}', en: 'Words: {set}' },
  my_progress: { he: 'ההתקדמות שלי', ru: 'Мой прогресс', ar: 'تقدّمي', en: 'My progress' },
  status_mastered: { he: 'שולט/ת', ru: 'Освоено', ar: 'متمكّن', en: 'Mastered' },
  status_practicing: { he: 'בתרגול', ru: 'Тренируюсь', ar: 'عم بتمرّن', en: 'Practicing' },
  status_needs_support: { he: 'צריך עוד תרגול', ru: 'Нужно ещё потренироваться', ar: 'بدّه تمرين كمان', en: 'Needs more practice' },
  status_not_started: { he: 'עוד לא התחלנו', ru: 'Ещё не начали', ar: 'لسّا ما بلّشنا', en: 'Not started' },
  ev_recognition: { he: 'מזהה', ru: 'Узнаю', ar: 'بميّز', en: 'Recognize' },
  ev_supported: { he: 'כותב/ת עם עזרה', ru: 'Пишу с помощью', ar: 'بكتب بمساعدة', en: 'Write with help' },
  ev_independent: { he: 'כותב/ת לבד', ru: 'Пишу сам(а)', ar: 'بكتب لحالي', en: 'Write alone' },
  teacher_note: { he: 'הודעה מהמורה', ru: 'Сообщение от учителя', ar: 'رسالة من المعلّم/ة', en: 'Note from your teacher' },
  about_answer: { he: 'על התשובה:', ru: 'К ответу:', ar: 'عن الإجابة:', en: 'About your answer:' },
  not_yet_taught: { he: 'עוד לא למדנו בכיתה: {list}. זה ייפתח אחרי שנלמד.', ru: 'Мы ещё не учили в классе: {list}. Откроется после урока.', ar: 'لسّا ما تعلّمنا بالصف: {list}. رح تنفتح بعد ما نتعلّم.', en: "We haven't learned this in class yet: {list}. It opens after the lesson." },
  no_task: { he: 'אין משימה חדשה כרגע. אפשר לחזור על מה שלמדנו.', ru: 'Сейчас нет нового задания. Можно повторить пройденное.', ar: 'ما في مهمّة جديدة هلّأ. فيك تراجع اللي تعلّمناه.', en: 'No new task right now. You can review what we learned.' },

  step_words: { he: 'מילים', ru: 'Слова', ar: 'كلمات', en: 'Words' },
  step_guess: { he: 'מנחשים', ru: 'Угадай', ar: 'خمّن', en: 'Guess' },
  step_learn: { he: 'לומדים', ru: 'Учим', ar: 'نتعلّم', en: 'Learn' },
  step_examples: { he: 'דוגמאות', ru: 'Примеры', ar: 'أمثلة', en: 'Examples' },
  step_check: { he: 'בדיקה קצרה', ru: 'Проверка', ar: 'فحص سريع', en: 'Quick check' },
  step_choose: { he: 'בוחרים עזרה', ru: 'Выбор помощи', ar: 'اختار المساعدة', en: 'Choose help' },
  step_practice: { he: 'תרגול', ru: 'Практика', ar: 'تمرين', en: 'Practice' },
  step_produce: { he: 'כותבים לבד', ru: 'Пишу сам(а)', ar: 'بكتب لحالي', en: 'Write alone' },
  step_exit: { he: 'כרטיס יציאה', ru: 'Итоговый билет', ar: 'بطاقة خروج', en: 'Exit ticket' },
  goal: { he: 'המטרה', ru: 'Цель', ar: 'الهدف', en: 'Goal' },
  step_n_of: { he: 'שלב {n} מתוך {total}', ru: 'Шаг {n} из {total}', ar: 'خطوة {n} من {total}', en: 'Step {n} of {total}' },
  item_n_of: { he: 'שאלה {n} מתוך {total}', ru: 'Вопрос {n} из {total}', ar: 'سؤال {n} من {total}', en: 'Question {n} of {total}' },
  next: { he: 'הבא', ru: 'Дальше', ar: 'اللي بعدو', en: 'Next' },
  check: { he: 'בדיקה', ru: 'Проверить', ar: 'افحص', en: 'Check' },
  hint: { he: 'רמז', ru: 'Подсказка', ar: 'تلميح', en: 'Hint' },
  listen: { he: 'השמעה', ru: 'Послушать', ar: 'اسمع', en: 'Listen' },

  words_intro: { he: 'אלה המילים של השיעור. קודם מנחשים מה כל מילה אומרת.', ru: 'Это слова урока. Сначала угадай, что значит каждое слово.', ar: 'هاي كلمات الدرس. أوّل منخمّن شو معنى كل كلمة.', en: 'These are the lesson words. First, guess what each word means.' },
  guess_meaning: { he: 'מה זה {word}? נחשו!', ru: 'Что значит {word}? Угадай!', ar: 'شو يعني {word}؟ خمّن!', en: 'What does {word} mean? Guess!' },
  guess_note: { he: 'ניחוש הוא לא מבחן. כל ניחוש עוזר ללמוד.', ru: 'Догадка — это не тест. Любая догадка помогает учиться.', ar: 'التخمين مش امتحان. كل تخمين بساعدك تتعلّم.', en: 'A guess is not a test. Every guess helps you learn.' },
  guess_right: { he: 'ניחשת נכון!', ru: 'Ты угадал(а)!', ar: 'خمّنت صحّ!', en: 'You guessed it!' },
  guess_learn: { he: 'עכשיו את/ה יודע/ת:', ru: 'Теперь ты знаешь:', ar: 'هلّأ صرت تعرف:', en: 'Now you know:' },
  learn_title: { he: 'הכלל', ru: 'Правило', ar: 'القاعدة', en: 'The rule' },
  examples_title: { he: 'דוגמאות. לחצו 🔊 כדי לשמוע.', ru: 'Примеры. Нажми 🔊, чтобы послушать.', ar: 'أمثلة. اكبس 🔊 لتسمع.', en: 'Examples. Press 🔊 to listen.' },
  show_translation: { he: 'מה זה אומר?', ru: 'Что это значит?', ar: 'شو معناها؟', en: 'What does it mean?' },
  tap_word: { he: 'לחצו על מילה באנגלית כדי לראות מה היא אומרת.', ru: 'Нажми на английское слово, чтобы увидеть перевод.', ar: 'اكبس على كلمة بالإنجليزي لتشوف معناها.', en: 'Tap an English word to see what it means.' },

  choose_title: { he: 'כמה עזרה את/ה רוצה בתרגול?', ru: 'Сколько помощи тебе нужно в практике?', ar: 'قدّيش مساعدة بدّك بالتمرين؟', en: 'How much help do you want in practice?' },
  choose_sub: { he: 'כל הרמות מתרגלות את אותו הדבר. רק כמות העזרה שונה.', ru: 'Все уровни тренируют одно и то же. Разное только количество помощи.', ar: 'كل المستويات بتمرّن نفس الإشي. بس كمية المساعدة بتختلف.', en: 'All levels practice the same thing. Only the amount of help is different.' },
  level_easy: { he: 'קל', ru: 'Легко', ar: 'سهل', en: 'Easy' },
  level_medium: { he: 'בינוני', ru: 'Средне', ar: 'متوسّط', en: 'Medium' },
  level_hard: { he: 'מאתגר', ru: 'Сложно', ar: 'صعب', en: 'Hard' },
  level_easy_desc: { he: 'בחירה, משפטים חלקיים, בנק מילים, רמזים גלויים', ru: 'Выбор ответа, неполные предложения, банк слов, подсказки', ar: 'اختيار، جمل ناقصة، بنك كلمات، تلميحات ظاهرة', en: 'Choices, half-sentences, word bank, visible hints' },
  level_medium_desc: { he: 'מקלידים משפט שלם. בנק מילים רק אם צריך.', ru: 'Пишешь всё предложение. Банк слов — только если нужно.', ar: 'بتكتب جملة كاملة. بنك كلمات بس إذا بدّك.', en: 'Type the whole sentence. Word bank only if you need it.' },
  level_hard_desc: { he: 'כותבים לבד, משווים משפטים ומתקנים טעויות.', ru: 'Пишешь сам(а), сравниваешь и исправляешь ошибки.', ar: 'بتكتب لحالك، بتقارن جمل وبتصلّح غلطات.', en: 'Write alone, compare sentences, fix mistakes.' },
  level_assigned: { he: 'המורה בחר/ה בשבילך: {level}', ru: 'Учитель выбрал для тебя: {level}', ar: 'المعلّم/ة اختار إلك: {level}', en: 'Your teacher chose for you: {level}' },
  change_level: { he: 'שינוי רמת עזרה', ru: 'Сменить уровень помощи', ar: 'غيّر مستوى المساعدة', en: 'Change help level' },

  instr_multiple_choice: { he: 'בחרו את המילה הנכונה.', ru: 'Выбери правильное слово.', ar: 'اختار الكلمة الصحّ.', en: 'Choose the right word.' },
  instr_choose_sentence: { he: 'איזה משפט נכון?', ru: 'Какое предложение правильное?', ar: 'أيّ جملة صحّ؟', en: 'Which sentence is correct?' },
  instr_fill_blank: { he: 'כתבו את הפועל בצורה הנכונה.', ru: 'Напиши глагол в правильной форме.', ar: 'اكتب الفعل بالشكل الصحّ.', en: 'Write the verb in the right form.' },
  instr_sentence_builder: { he: 'לחצו על המילים לפי הסדר ובנו את המשפט.', ru: 'Нажимай на слова по порядку и составь предложение.', ar: 'اكبس عالكلمات بالترتيب وابني الجملة.', en: 'Tap the words in order to build the sentence.' },
  instr_translate: { he: 'כתבו את המשפט באנגלית.', ru: 'Напиши это предложение по-английски.', ar: 'اكتب الجملة بالإنجليزي.', en: 'Write a full English sentence from these words.' },
  instr_translate_multi: { he: 'כתבו את שני המשפטים באנגלית. שימו לב להבדל.', ru: 'Напиши оба предложения по-английски. Обрати внимание на разницу.', ar: 'اكتب الجملتين بالإنجليزي. انتبه عالفرق.', en: 'Write both sentences in English. Notice the difference.' },
  instr_error_correction: { he: 'יש טעות אחת. כתבו את המשפט נכון.', ru: 'Здесь одна ошибка. Напиши предложение правильно.', ar: 'في غلطة وحدة. اكتب الجملة صحّ.', en: 'There is one mistake. Write the sentence correctly.' },
  word_bank: { he: 'בנק מילים', ru: 'Банк слов', ar: 'بنك كلمات', en: 'Word bank' },
  show_word_bank: { he: 'להציג בנק מילים', ru: 'Показать банк слов', ar: 'فرجيني بنك الكلمات', en: 'Show word bank' },
  verb_given: { he: 'הפועל:', ru: 'Глагол:', ar: 'الفعل:', en: 'Verb:' },
  undo: { he: 'ביטול', ru: 'Отменить', ar: 'رجّع', en: 'Undo' },
  clear: { he: 'ניקוי', ru: 'Очистить', ar: 'امسح', en: 'Clear' },
  type_here: { he: 'כתבו כאן באנגלית…', ru: 'Пиши здесь по-английски…', ar: 'اكتب هون بالإنجليزي…', en: 'Type here in English…' },
  starter: { he: 'התחלת משפט', ru: 'Начало предложения', ar: 'بداية جملة', en: 'Sentence starter' },
  your_sentence: { he: 'המשפט שלך:', ru: 'Твоё предложение:', ar: 'جملتك:', en: 'Your sentence:' },

  correct_1: { he: 'נכון!', ru: 'Верно!', ar: 'صحّ!', en: 'Correct!' },
  correct_2: { he: 'מצוין!', ru: 'Отлично!', ar: 'ممتاز!', en: 'Excellent!' },
  correct_3: { he: 'יפה מאוד!', ru: 'Очень хорошо!', ar: 'كتير منيح!', en: 'Very good!' },
  correct_after_help: { he: 'עשית את זה!', ru: 'У тебя получилось!', ar: 'زبطت معك!', en: 'You did it!' },
  try_again: { he: 'נסו שוב', ru: 'Попробуй ещё раз', ar: 'جرّب كمان مرّة', en: 'Try again' },
  reveal_title: { he: 'הנה תשובה נכונה:', ru: 'Вот правильный ответ:', ar: 'هاي إجابة صحّ:', en: 'Here is a correct answer:' },
  reveal_type: { he: 'אפשר להקליד אותה פעם אחת בעצמכם (לא חובה).', ru: 'Можно один раз напечатать её самому (не обязательно).', ar: 'فيك تكتبها مرّة لحالك (مش إجباري).', en: 'You can type it once yourself (optional).' },
  model_answer: { he: 'דוגמה לתשובה:', ru: 'Пример ответа:', ar: 'مثال لإجابة:', en: 'Example answer:' },
  grammar_ok: { he: 'הדקדוק נכון ✓', ru: 'Грамматика верна ✓', ar: 'القواعد صحّ ✓', en: 'Grammar correct ✓' },
  teacher_will_see: { he: 'המורה יראה/תראה את המשפט שלך.', ru: 'Учитель увидит твоё предложение.', ar: 'المعلّم/ة رح يشوف جملتك.', en: 'Your teacher will read your sentence.' },

  remediation_title: { he: 'נראה שהנושא {topic} עוד קצת מבלבל. נתרגל אותו יחד: 3 שאלות קצרות.', ru: 'Кажется, {topic} пока путает. Давай потренируем вместе: 3 коротких вопроса.', ar: 'شكلو {topic} لسّا ملخبط شوي. خلّينا نتمرّن عليه سوا: 3 أسئلة قصار.', en: 'It looks like {topic} is still a bit tricky. Let’s practice it together: 3 short questions.' },
  remediation_done: { he: 'כל הכבוד! חוזרים לתרגול.', ru: 'Молодец! Возвращаемся к практике.', ar: 'يعطيك العافية! منرجع للتمرين.', en: 'Well done! Back to practice.' },
  produce_intro: { he: 'עכשיו כותבים לבד. אין רק תשובה אחת נכונה.', ru: 'Теперь пишем сами. Правильных ответов может быть много.', ar: 'هلّأ منكتب لحالنا. في أكتر من إجابة صحّ.', en: 'Now you write on your own. There is more than one right answer.' },
  exit_intro: { he: 'כמה משפטים אחרונים — לבד, בלי רמזים. כך המורה יודע/ת מה כבר ידוע לך.', ru: 'Последние предложения — сам(а), без подсказок. Так учитель узнает, что ты уже умеешь.', ar: 'آخر كم جملة — لحالك، بدون تلميحات. هيك المعلّم/ة بعرف شو صرت تعرف.', en: 'A few last sentences — on your own, no hints. This shows your teacher what you already know.' },
  exit_done: { he: 'סיימת! הנה מה שכתבת:', ru: 'Готово! Вот что ты написал(а):', ar: 'خلصت! هاد اللي كتبته:', en: 'Finished! Here is what you wrote:' },
  module_done: { he: 'סיימת את השיעור 🎉', ru: 'Урок пройден 🎉', ar: 'خلّصت الدرس 🎉', en: 'You finished the lesson 🎉' },
  review_done: { he: 'סיימת את החזרה ✓', ru: 'Повторение пройдено ✓', ar: 'خلّصت المراجعة ✓', en: 'Review finished ✓' },
  home: { he: 'לדף הבית', ru: 'На главную', ar: 'للصفحة الرئيسية', en: 'Home' },
  saving_error: { he: 'השמירה לא הצליחה. בדקו את החיבור.', ru: 'Не удалось сохранить. Проверь соединение.', ar: 'ما زبط الحفظ. افحص الاتصال.', en: 'Could not save. Check the connection.' },

  // ---- progressive feedback ----
  fb_s_need_1: { he: 'הסתכלו על הנושא: {subject}. מה קורה לפועל עם he / she / it?', ru: 'Посмотри на подлежащее: {subject}. Что происходит с глаголом с he / she / it?', ar: 'اطّلع عالفاعل: {subject}. شو بصير للفعل مع he / she / it؟', en: 'Look at the subject: {subject}. What happens to the verb with he / she / it?' },
  fb_s_need_2: { he: 'כתבת {wrote}. עם {subject} מוסיפים S לפועל.', ru: 'Ты написал(а) {wrote}. С {subject} добавляем S к глаголу.', ar: 'كتبت {wrote}. مع {subject} منزيد S عالفعل.', en: 'You wrote {wrote}. With {subject}, add S to the verb.' },
  fb_s_extra_1: { he: 'הסתכלו על הנושא: {subject}. האם מוסיפים S עם I / you / we / they?', ru: 'Посмотри на подлежащее: {subject}. Добавляем ли S с I / you / we / they?', ar: 'اطّلع عالفاعل: {subject}. منزيد S مع I / you / we / they؟', en: 'Look at the subject: {subject}. Do we add S with I / you / we / they?' },
  fb_s_extra_2: { he: 'כתבת {wrote}. עם {subject} הפועל נשאר בלי S.', ru: 'Ты написал(а) {wrote}. С {subject} глагол без S.', ar: 'كتبت {wrote}. مع {subject} الفعل بضل بدون S.', en: 'You wrote {wrote}. With {subject}, the verb has no S.' },
  fb_spelling_1: { he: 'הדקדוק נכון ✓. בדקו את הכתיב של {wrote}.', ru: 'Грамматика верна ✓. Проверь, как написано {wrote}.', ar: 'القواعد صحّ ✓. افحص تهجئة {wrote}.', en: 'Your grammar is right ✓. Check the spelling of {wrote}.' },
  fb_spelling_2: { he: 'כותבים כך: {expected}', ru: 'Пишется так: {expected}', ar: 'منكتبها هيك: {expected}', en: 'It is spelled: {expected}' },
  fb_vocab_1: { he: 'הדקדוק נכון ✓. בדקו את המילים: מה כתוב במשפט למעלה?', ru: 'Грамматика верна ✓. Проверь слова: что написано в предложении наверху?', ar: 'القواعد صحّ ✓. افحص الكلمات: شو مكتوب بالجملة فوق؟', en: 'Your grammar is right ✓. Check the words: what does the sentence above say?' },
  fb_vocab_2: { he: 'המילה שצריך: {expected}', ru: 'Нужное слово: {expected}', ar: 'الكلمة اللي بدنا ياها: {expected}', en: 'The word you need: {expected}' },
  fb_missing_1: { he: 'כמעט! משהו חסר. קראו שוב את המשפט למעלה.', ru: 'Почти! Чего-то не хватает. Прочитай ещё раз предложение наверху.', ar: 'تقريبًا! في إشي ناقص. اقرا الجملة فوق كمان مرّة.', en: 'Almost! Something is missing. Read the sentence above again.' },
  fb_missing_2: { he: 'חסר: {expected}', ru: 'Не хватает: {expected}', ar: 'ناقص: {expected}', en: 'Missing: {expected}' },
  fb_order_1: { he: 'כל המילים נמצאות! בדקו את הסדר.', ru: 'Все слова на месте! Проверь порядок.', ar: 'كل الكلمات موجودة! افحص الترتيب.', en: 'All the words are there! Check the order.' },
  fb_order_2: { he: 'מי? ← עושה מה? ← מה? ← מתי?', ru: 'Кто? → что делает? → что? → когда?', ar: 'مين؟ ← شو بعمل؟ ← شو؟ ← إمتى؟', en: 'Who? → does what? → what? → when?' },
  fb_pronoun_1: { he: 'בדקו מי עושה את הפעולה: הוא = he · היא = she.', ru: 'Проверь, кто делает действие: он = he · она = she.', ar: 'افحص مين بعمل: هو = he · هي = she.', en: 'Check who is doing it: a boy = he · a girl = she.' },
  fb_pronoun_2: { he: 'הנושא הנכון: {expected}', ru: 'Правильное подлежащее: {expected}', ar: 'الفاعل الصحّ: {expected}', en: 'The right subject: {expected}' },
  fb_tense_1: { he: 'כאן מדברים על הרגל (every day). בלי is / are ובלי ing.', ru: 'Здесь речь о привычке (every day). Без is / are и без ing.', ar: 'هون منحكي عن عادة (every day). بدون is / are وبدون ing.', en: 'This is a habit (every day). No is / are and no -ing.' },
  fb_tense_2: { he: 'הרגל ← פועל (+S עם he / she / it): {expected}', ru: 'Привычка → глагол (+S с he / she / it): {expected}', ar: 'عادة ← فعل (+S مع he / she / it): {expected}', en: 'Habit → verb (+S with he / she / it): {expected}' },
  fb_generic_1: { he: 'עוד לא. נסו שוב — אפשר לפתוח את ארגז הכלים.', ru: 'Пока нет. Попробуй ещё раз — можно открыть инструменты.', ar: 'لسّا لأ. جرّب كمان مرّة — فيك تفتح صندوق الأدوات.', en: 'Not yet. Try again — you can open the Toolbox.' },
  fb_word_order_free: { he: 'משפט באנגלית מתחיל במי שעושה: ', ru: 'Английское предложение начинается с того, кто делает: ', ar: 'الجملة بالإنجليزي بتبلّش بمين بعمل: ', en: 'An English sentence starts with who does it: ' },
  fb_unknown_words: { he: 'יש מילים שעוד לא למדנו ({words}). זה בסדר — המורה יבדוק/תבדוק.', ru: 'Есть слова, которые мы ещё не учили ({words}). Это нормально — учитель проверит.', ar: 'في كلمات لسّا ما تعلّمناها ({words}). مش مشكلة — المعلّم/ة رح يفحص.', en: 'Some words are new to the app ({words}). That is OK — your teacher will check.' },

  topic_THIRD_PERSON_S: { he: 'he / she / it + S', ru: 'he / she / it + S', ar: 'he / she / it + S', en: 'he / she / it + S' },
  topic_SPELLING: { he: 'הכתיב של es', ru: 'написание es', ar: 'تهجئة es', en: 'spelling with es' },
  topic_WORD_ORDER: { he: 'סדר המילים', ru: 'порядок слов', ar: 'ترتيب الكلمات', en: 'word order' },
};

// ---- dashboard (timeline) + focused lesson page ----
Object.assign(S, {
  hello: { he: 'שלום {name} 👋', ru: 'Привет, {name} 👋', ar: 'أهلا {name} 👋', en: 'Hi {name} 👋' },
  next_for_you: { he: 'הצעד הבא שלך', ru: 'Твой следующий шаг', ar: 'الخطوة الجاية إلك', en: 'Your next step' },
  my_path: { he: 'המסלול שלי', ru: 'Мой путь', ar: 'مساري', en: 'My path' },
  my_path_sub: { he: 'מה כבר עשינו, מה עושים עכשיו ומה מחכה בהמשך. אפשר ללחוץ על כל תחנה.', ru: 'Что мы уже сделали, что делаем сейчас и что дальше. Можно нажать на любой шаг.', ar: 'شو عملنا، شو منعمل هلّأ، وشو بستنّانا. فيك تكبس على أيّ محطّة.', en: 'What we did, what we do now and what comes next. You can tap any stop.' },
  steps_done: { he: '{done} מתוך {total} שלבים', ru: '{done} из {total} шагов', ar: '{done} من {total} خطوات', en: '{done} of {total} steps' },
  review_again: { he: 'חזרה: נחש ← למד', ru: 'Повторить: угадай → узнай', ar: 'مراجعة: خمّن ← تعلّم', en: 'Review: guess → learn' },
  peek: { he: 'הצצה', ru: 'Заглянуть', ar: 'نظرة', en: 'Peek' },
  peek_title: { he: 'הצצה קדימה', ru: 'Заглянем вперёд', ar: 'نظرة لقدّام', en: 'A look ahead' },
  peek_text: { he: 'את זה עוד לא למדנו בכיתה. רק מסתכלים — אין משימה ואין ציון.', ru: 'Это мы ещё не учили в классе. Просто смотрим — без заданий и оценок.', ar: 'هاد لسّا ما تعلّمناه بالصف. بس منطّلع — ما في مهمّة ولا علامة.', en: "We haven't learned this in class yet. Just looking — no task, no score." },
  peek_example: { he: 'ככה זה נראה:', ru: 'Вот как это выглядит:', ar: 'هيك بيطلع:', en: 'This is how it looks:' },
  my_words: { he: 'המילים שלי', ru: 'Мои слова', ar: 'كلماتي', en: 'My words' },
  teacher_task: { he: 'משימה מהמורה', ru: 'Задание учителя', ar: 'مهمّة من المعلّم/ة', en: 'From your teacher' },
  lesson_path: { he: 'שלבי השיעור', ru: 'Шаги урока', ar: 'خطوات الدرس', en: 'Lesson steps' },
  now_label: { he: 'עכשיו', ru: 'Сейчас', ar: 'هلّأ', en: 'Now' },
  back_dashboard: { he: 'ללוח שלי', ru: 'Моя страница', ar: 'لصفحتي', en: 'My dashboard' },
  ahead_locked: { he: 'ייפתח כשנגיע', ru: 'Откроется позже', ar: 'بتنفتح لمّا نوصل', en: 'Opens when you get there' },
  step_done_again: { he: 'עשית את השלב הזה ✓ אפשר לעשות אותו שוב, או לעבור לשלב הבא.', ru: 'Ты уже сделал(а) этот шаг ✓ Можно повторить или перейти дальше.', ar: 'عملت هاي الخطوة ✓ فيك تعيدها أو تكمّل للّي بعدها.', en: 'You did this step ✓ You can do it again or move on.' },
  skip_to_next: { he: 'לשלב הבא', ru: 'К следующему шагу', ar: 'للخطوة الجاية', en: 'Next step' },
  do_words: { he: 'לכל מילה: נחשו מה היא אומרת, ואז תראו את התשובה. ({n} מילים)', ru: 'Для каждого слова: угадай значение, потом увидишь ответ. ({n} слов)', ar: 'لكل كلمة: خمّن شو معناها، وبعدين بتشوف الجواب. ({n} كلمات)', en: 'For each word: guess what it means, then see the answer. ({n} words)' },
  do_guess: { he: 'קראו את המשפטים באנגלית ונחשו את הכלל. ניחוש לא נבדק.', ru: 'Прочитай английские предложения и угадай правило. Догадку не проверяют.', ar: 'اقرا الجمل بالإنجليزي وخمّن القاعدة. التخمين ما بنفحص.', en: 'Read the English sentences and guess the rule. Guesses are not checked.' },
  do_learn: { he: 'קראו את הכלל ושמעו אותו (🔊). אחר כך לחצו "הבא".', ru: 'Прочитай правило и послушай (🔊). Потом нажми «Дальше».', ar: 'اقرا القاعدة واسمعها (🔊). بعدين اكبس "اللي بعدو".', en: 'Read the rule and listen (🔊). Then press "Next".' },
  do_examples: { he: 'קראו כל משפט ושמעו אותו. אם צריך — לחצו "מה זה אומר?".', ru: 'Прочитай и послушай каждое предложение. Если нужно — нажми «Что это значит?».', ar: 'اقرا كل جملة واسمعها. إذا بدّك — اكبس "شو معناها؟".', en: 'Read and listen to each sentence. If you need to, press "What does it mean?".' },
  do_check: { he: 'ענו על {n} שאלות קצרות.', ru: 'Ответь на {n} коротких вопроса.', ar: 'جاوب على {n} أسئلة قصار.', en: 'Answer {n} short questions.' },
  do_choose: { he: 'בחרנו בשבילך רמת עזרה. לחצו על הכפתור כדי להמשיך.', ru: 'Мы выбрали для тебя уровень помощи. Нажми кнопку, чтобы продолжить.', ar: 'اخترنا إلك مستوى مساعدة. اكبس الزر لتكمّل.', en: 'We picked a help level for you. Press the button to continue.' },
  do_practice: { he: 'ענו על {n} שאלות. טעות? מקבלים רמז ומנסים שוב.', ru: 'Ответь на {n} вопросов. Ошибка? Получишь подсказку и попробуешь снова.', ar: 'جاوب على {n} أسئلة. غلطت؟ بتاخد تلميح وبتجرّب كمان مرّة.', en: 'Answer {n} questions. A mistake? You get a hint and try again.' },
  do_produce: { he: 'כתבו {n} משפטים משלכם באנגלית.', ru: 'Напиши {n} своих предложения по-английски.', ar: 'اكتب {n} جمل من عندك بالإنجليزي.', en: 'Write {n} sentences of your own in English.' },
  do_exit: { he: 'כתבו {n} משפטים לבד, בלי רמזים. ניסיון אחד לכל משפט.', ru: 'Напиши {n} предложения сам(а), без подсказок. Одна попытка.', ar: 'اكتب {n} جمل لحالك، بدون تلميحات. محاولة وحدة لكل جملة.', en: 'Write {n} sentences on your own, no hints. One try each.' },
  recommended: { he: 'מומלץ בשבילך', ru: 'Рекомендуем тебе', ar: 'منصحك فيه', en: 'Recommended for you' },
  continue_with: { he: 'ממשיכים ברמה: {level}', ru: 'Продолжить: {level}', ar: 'كمّل بمستوى: {level}', en: 'Continue with: {level}' },
  other_level: { he: 'רוצה רמת עזרה אחרת?', ru: 'Хочешь другой уровень помощи?', ar: 'بدّك مستوى مساعدة تاني؟', en: 'Want a different help level?' },
  level_now: { he: 'רמת עזרה: {level}', ru: 'Уровень помощи: {level}', ar: 'مستوى المساعدة: {level}', en: 'Help level: {level}' },
});

// ---- feedback for Progressive / negatives / questions / WH ----
Object.assign(S, {
  fb_be_1: { he: 'הסתכלו על הנושא: {subject}. איזו מילת דבק מתאימה — am, is או are?', ru: 'Посмотри на подлежащее: {subject}. Какое слово подходит — am, is или are?', ar: 'اطّلع عالفاعل: {subject}. أيّ كلمة بتزبط — am ولا is ولا are؟', en: 'Look at the subject: {subject}. Which glue word fits — am, is or are?' },
  fb_be_2: { he: 'עם {subject} כותבים {expected}.', ru: 'С {subject} пишем {expected}.', ar: 'مع {subject} منكتب {expected}.', en: 'With {subject} we write {expected}.' },
  fb_ing_1: { he: 'אחרי am / is / are — הפועל מקבל ing.', ru: 'После am / is / are глагол получает ing.', ar: 'بعد am / is / are — الفعل بياخد ing.', en: 'After am / is / are, the verb gets -ing.' },
  fb_ing_2: { he: 'כתבת {wrote}. צריך: {expected}', ru: 'Ты написал(а) {wrote}. Нужно: {expected}', ar: 'كتبت {wrote}. لازم: {expected}', en: 'You wrote {wrote}. We need: {expected}' },
  fb_now_1: { he: 'זה קורה עכשיו? או בדרך כלל? קראו שוב את המשפט למעלה.', ru: 'Это происходит сейчас или обычно? Прочитай ещё раз предложение наверху.', ar: 'هاد بصير هلّأ ولا عادةً؟ اقرا الجملة فوق كمان مرّة.', en: 'Is it happening now, or usually? Read the sentence above again.' },
  fb_now_2: { he: 'עכשיו ← am / is / are + ing. בדרך כלל ← פועל (+S).', ru: 'Сейчас → am / is / are + ing. Обычно → глагол (+S).', ar: 'هلّأ ← am / is / are + ing. عادةً ← فعل (+S).', en: 'Now → am / is / are + -ing. Usually → verb (+S).' },
  fb_dont_1: { he: 'בשלילה בהווה פשוט צריך don\'t או doesn\'t. מי הנושא?', ru: 'В отрицании Present Simple нужно don\'t или doesn\'t. Кто подлежащее?', ar: 'بالنفي بـ Present Simple بدنا don\'t أو doesn\'t. مين الفاعل؟', en: 'A Present Simple negative needs don\'t or doesn\'t. Who is the subject?' },
  fb_dont_2: { he: 'I / you / we / they ← don\'t · he / she / it ← doesn\'t', ru: 'I / you / we / they → don\'t · he / she / it → doesn\'t', ar: 'I / you / we / they ← don\'t · he / she / it ← doesn\'t', en: 'I / you / we / they → don\'t · he / she / it → doesn\'t' },
  fb_doesbase_1: { he: 'אחרי does / doesn\'t — האם הפועל צריך S?', ru: 'После does / doesn\'t — нужна ли глаголу S?', ar: 'بعد does / doesn\'t — الفعل بدّه S؟', en: 'After does / doesn\'t — does the verb need S?' },
  fb_doesbase_2: { he: 'ה-S כבר נמצא ב-does. הפועל חוזר לבסיס: {expected}', ru: 'S уже есть в does. Глагол без S: {expected}', ar: 'الـ S موجود بـ does. الفعل برجع للأساس: {expected}', en: 'The S is already in does. The verb goes back to base: {expected}' },
  fb_ppneg_1: { he: 'בהווה מתמשך השלילה היא am / is / are + not.', ru: 'В Present Progressive отрицание: am / is / are + not.', ar: 'بـ Present Progressive النفي: am / is / are + not.', en: 'Progressive negative: am / is / are + not.' },
  fb_ppneg_2: { he: 'I am not · she isn\'t · they aren\'t + פועל-ing', ru: 'I am not · she isn\'t · they aren\'t + глагол-ing', ar: 'I am not · she isn\'t · they aren\'t + فعل-ing', en: 'I am not · she isn\'t · they aren\'t + verb-ing' },
  fb_doq_1: { he: 'שאלה בהווה פשוט מתחילה ב-Do או Does. מי הנושא?', ru: 'Вопрос в Present Simple начинается с Do или Does. Кто подлежащее?', ar: 'السؤال بـ Present Simple ببلّش بـ Do أو Does. مين الفاعل؟', en: 'A Present Simple question starts with Do or Does. Who is the subject?' },
  fb_doq_2: { he: 'Do / Does + נושא + פועל בלי S ?', ru: 'Do / Does + подлежащее + глагол без S ?', ar: 'Do / Does + فاعل + فعل بدون S ؟', en: 'Do / Does + subject + verb (no S) ?' },
  fb_beq_1: { he: 'בשאלה בהווה מתמשך, am / is / are עוברים להתחלה.', ru: 'В вопросе Present Progressive am / is / are идут в начало.', ar: 'بالسؤال بـ Present Progressive، am / is / are بروحوا للأوّل.', en: 'In a Progressive question, am / is / are move to the start.' },
  fb_beq_2: { he: 'Am / Is / Are + נושא + פועל-ing ? ({expected})', ru: 'Am / Is / Are + подлежащее + глагол-ing ? ({expected})', ar: 'Am / Is / Are + فاعل + فعل-ing ؟ ({expected})', en: 'Am / Is / Are + subject + verb-ing ? ({expected})' },
  fb_wh_1: { he: 'בדקו את מילת השאלה, ואחריה — do / does או am / is / are.', ru: 'Проверь вопросительное слово, а после него — do / does или am / is / are.', ar: 'افحص كلمة السؤال، وبعدها — do / does أو am / is / are.', en: 'Check the question word — and after it: do / does or am / is / are.' },
  fb_wh_2: { he: 'מילת שאלה + do / does + נושא + פועל ?  ·  מילת שאלה + am / is / are + נושא + פועל-ing ?', ru: 'Вопр. слово + do / does + подлежащее + глагол ?  ·  Вопр. слово + am / is / are + подлежащее + глагол-ing ?', ar: 'كلمة سؤال + do / does + فاعل + فعل ؟  ·  كلمة سؤال + am / is / are + فاعل + فعل-ing ؟', en: 'WH word + do / does + subject + verb ?  ·  WH word + am / is / are + subject + verb-ing ?' },
  fb_sort_1: { he: '{n} כרטיסים עוד לא במקום. נסו שוב.', ru: '{n} карточки пока не на месте. Попробуй ещё раз.', ar: '{n} كروت لسّا مش بمحلّها. جرّب كمان مرّة.', en: '{n} cards are not in the right place yet. Try again.' },
  fb_sort_2: { he: 'סימנו את הכרטיסים שצריך להזיז.', ru: 'Мы отметили карточки, которые надо переставить.', ar: 'علّمنا الكروت اللي لازم تتحرّك.', en: 'We marked the cards that need to move.' },
  // ---- new exercise instructions ----
  instr_transform: { he: 'כתבו את המשפט מחדש לפי ההוראה.', ru: 'Перепиши предложение по заданию.', ar: 'اكتب الجملة من جديد حسب التعليمات.', en: 'Rewrite the sentence as asked.' },
  instr_sort: { he: 'לכל כרטיס — בחרו לאן הוא שייך.', ru: 'Для каждой карточки выбери, куда она относится.', ar: 'لكل كرت — اختار وين بنتمي.', en: 'For each card, choose where it belongs.' },
  instr_match: { he: 'התאימו: לכל שורה בחרו את החלק המתאים.', ru: 'Соедини: для каждой строки выбери подходящую часть.', ar: 'وصّل: لكل سطر اختار الجزء المناسب.', en: 'Match: for each row, choose the part that fits.' },
  instr_pair_fill: { he: 'אותו פועל — שני משפטים. שימו לב מתי הפועל משתנה.', ru: 'Один глагол — два предложения. Обрати внимание, когда он меняется.', ar: 'نفس الفعل — جملتين. انتبه إمتى الفعل بتغيّر.', en: 'Same verb — two sentences. Notice when the verb changes.' },
  instr_text_gaps: { he: 'השלימו את ההודעות בצ\'אט.', ru: 'Дополни сообщения в чате.', ar: 'كمّل المسجات بالشات.', en: 'Complete the chat messages.' },
  instr_listen_choose: { he: 'הקשיבו ובחרו את המשפט ששמעתם.', ru: 'Послушай и выбери предложение, которое услышал(а).', ar: 'اسمع واختار الجملة اللي سمعتها.', en: 'Listen and choose the sentence you heard.' },
  instr_wh_scaffold: { he: 'הסתכלו על התמונה. ענו בקצרה על השאלות, ואז חברו הכול למשפט אחד.', ru: 'Посмотри на картинку. Коротко ответь на вопросы, потом собери одно предложение.', ar: 'اطّلع عالصورة. جاوب باختصار عالأسئلة، وبعدين جمّع كلّه بجملة وحدة.', en: 'Look at the picture. Answer the questions in short, then join everything into one sentence.' },
  wh_one_sentence: { he: 'עכשיו משפט אחד שלם:', ru: 'Теперь одно полное предложение:', ar: 'هلّأ جملة وحدة كاملة:', en: 'Now one full sentence:' },
  play_again: { he: 'השמעה', ru: 'Послушать', ar: 'اسمع', en: 'Play' },
  // ---- lesson structure ----
  step_warmup: { he: 'חימום', ru: 'Разминка', ar: 'تسخين', en: 'Warm-up' },
  step_pause: { he: 'הפסקה קצרה', ru: 'Короткий перерыв', ar: 'استراحة قصيرة', en: 'Short break' },
  step_challenge: { he: 'אתגר בונוס', ru: 'Бонус-задание', ar: 'تحدّي بونص', en: 'Bonus challenge' },
  do_warmup: { he: 'חוזרים על מה שכבר למדנו: {n} שאלות קצרות.', ru: 'Повторяем пройденное: {n} коротких вопроса.', ar: 'منراجع اللي تعلّمناه: {n} أسئلة قصار.', en: 'Review what we already learned: {n} short questions.' },
  do_pause: { he: 'קומו, התמתחו, שתו מים. כשמוכנים — לחצו "ממשיכים".', ru: 'Встань, потянись, выпей воды. Когда готов(а) — нажми «Продолжить».', ar: 'قوم، تمطّى، اشرب مي. لمّا تكون جاهز — اكبس "كمّل".', en: 'Stand up, stretch, drink some water. When you are ready, press "Continue".' },
  do_challenge: { he: 'סיימת מוקדם? הנה {n} שאלות מאתגרות. לא חובה.', ru: 'Закончил(а) раньше? Вот {n} сложных вопроса. Не обязательно.', ar: 'خلّصت بكّير؟ هاي {n} أسئلة صعبة. مش إجباري.', en: 'Finished early? Here are {n} harder questions. Optional.' },
  about_min: { he: 'כ-{n} דק׳', ru: '≈{n} мин', ar: 'تقريبًا {n} د', en: '~{n} min' },
  lesson_total: { he: 'כל השיעור: כ-{n} דקות', ru: 'Весь урок: ≈{n} минут', ar: 'كل الدرس: تقريبًا {n} دقيقة', en: 'Whole lesson: about {n} minutes' },
  was_here: { he: 'עברנו', ru: 'Было', ar: 'خلّصنا', en: 'Done' },
  next_up: { he: 'הבא', ru: 'Дальше', ar: 'اللي بعدو', en: 'Next' },
  part_locked: { he: 'החלק הזה ייפתח אחרי שנלמד אותו בכיתה. אפשר להציץ בכלל.', ru: 'Эта часть откроется после урока в классе. Можно посмотреть правило.', ar: 'هاد الجزء بنفتح بعد ما نتعلّمه بالصف. فيك تطّلع عالقاعدة.', en: 'This part opens after we learn it in class. You can look at the rule.' },
  lesson_word: { he: 'שיעור', ru: 'Урок', ar: 'درس', en: 'Lesson' },
  reviews_station: { he: 'חזרות על מה שלמדנו בכיתה', ru: 'Повторение пройденного в классе', ar: 'مراجعة اللي تعلّمناه بالصف', en: 'Reviews of what we learned in class' },
  topic_AM_IS_ARE: { he: 'am / is / are', ru: 'am / is / are', ar: 'am / is / are', en: 'am / is / are' },
  topic_ING_FORM: { he: 'פועל + ing', ru: 'глагол + ing', ar: 'فعل + ing', en: 'verb + ing' },
  topic_TENSE_SELECTION: { he: '"עכשיו" או "בדרך כלל"', ru: '«сейчас» или «обычно»', ar: '"هلّأ" ولا "عادةً"', en: '"now" or "usually"' },
  topic_DONT_DOESNT: { he: "don't / doesn't", ru: "don't / doesn't", ar: "don't / doesn't", en: "don't / doesn't" },
  topic_DOES_BASE_VERB: { he: 'does + פועל בלי S', ru: 'does + глагол без S', ar: 'does + فعل بدون S', en: 'does + verb without S' },
  topic_PROGRESSIVE_NEGATIVE: { he: "isn't / aren't", ru: "isn't / aren't", ar: "isn't / aren't", en: "isn't / aren't" },
  topic_DO_DOES_QUESTION: { he: 'שאלות Do / Does', ru: 'вопросы Do / Does', ar: 'أسئلة Do / Does', en: 'Do / Does questions' },
  topic_BE_QUESTION: { he: 'שאלות Am / Is / Are', ru: 'вопросы Am / Is / Are', ar: 'أسئلة Am / Is / Are', en: 'Am / Is / Are questions' },
  topic_WH_QUESTION: { he: 'שאלות WH', ru: 'вопросы WH', ar: 'أسئلة WH', en: 'WH questions' },
});

Object.assign(S, {
  choose_code: { he: 'פעם ראשונה כאן! בחרו קוד סודי של 4 ספרות', ru: 'Ты здесь впервые! Придумай секретный код из 4 цифр', ar: 'أوّل مرّة هون! اختار كود سرّي من 4 أرقام', en: 'First time here! Choose a secret 4-digit code' },
  confirm_code: { he: 'הקלידו את אותו קוד שוב', ru: 'Введи этот код ещё раз', ar: 'اكتب نفس الكود كمان مرّة', en: 'Type the same code again' },
  codes_differ: { he: 'הקודים לא זהים. בחרו קוד מחדש.', ru: 'Коды не совпадают. Придумай код заново.', ar: 'الكودين مش زيّ بعض. اختار كود من جديد.', en: 'The codes are different. Choose a code again.' },
  code_tip: { he: 'זכרו את הקוד. שכחתם? המורה יכול/ה לעזור.', ru: 'Запомни код. Забыл(а)? Учитель поможет.', ar: 'تذكّر الكود. نسيته؟ المعلّم/ة بقدر يساعد.', en: 'Remember your code. Forgot it? Your teacher can help.' },
});

Object.assign(S, {
  step_explain: { he: 'רואים את זה זז', ru: 'Смотрим, как это движется', ar: 'منشوفها بتتحرّك', en: 'See it move' },
  do_explain: { he: 'צפו איך המילים זזות. אפשר לעצור, לחזור אחורה ולראות שוב.', ru: 'Смотри, как двигаются слова. Можно остановить, вернуться назад и посмотреть снова.', ar: 'شوف كيف الكلمات بتتحرّك. فيك توقّف، ترجع لورا، وتشوف كمان مرّة.', en: 'Watch how the words move. You can pause, go back and watch again.' },
});

Object.assign(S, {
  too_many: { he: 'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות, או בקשו עזרה מהמורה.', ru: 'Слишком много попыток. Попробуй через несколько минут или попроси учителя.', ar: 'محاولات كتير. جرّب كمان كم دقيقة، أو اطلب مساعدة من المعلّم/ة.', en: 'Too many tries. Try again in a few minutes, or ask your teacher.' },
});

let current = 'he';
export function setLang(l) { current = LANGS[l] ? l : 'he'; }
export function getLang() { return current; }
export function dir(l = current) { return LANGS[l]?.dir || 'rtl'; }

export function t(key, vars = {}, lang = current) {
  const entry = S[key];
  let s = entry ? entry[lang] ?? entry.en ?? entry.he : key;
  for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v);
  return s;
}

// Pick a localized field from content data objects like { he, ru, ar, en }.
export function L(obj, lang = current) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] ?? obj.en ?? obj.he ?? '';
}

// Direction-aware arrows: "forward" points left in Hebrew/Arabic, right in Russian/English.
export const fwd = () => (dir() === 'rtl' ? '←' : '→');
export const bwd = () => (dir() === 'rtl' ? '→' : '←');
