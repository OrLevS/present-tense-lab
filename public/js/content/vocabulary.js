// Vocabulary: words + thematic sets. Pure data.
// tr = translation per support language. ar = spoken Jerusalem / Palestinian Arabic.
// forms.s = he/she/it form, forms.ing = -ing form (used only once -ing is taught), forms.plural for nouns.
// NOTE: Russian and Arabic translations should be reviewed by a native-speaking colleague before classroom use.

const w = (id, en, kind, tr, extra = {}) => ({ id, en, kind, tr, ...extra });

export const WORDS = [
  // ---- people & pronouns ----
  w('i', 'I', 'pronoun', { he: 'אני', ru: 'я', ar: 'أنا' }, { emoji: '🙋' }),
  w('you', 'you', 'pronoun', { he: 'אתה / את / אתם', ru: 'ты / вы', ar: 'إنت / إنتِ / إنتو' }, { emoji: '👉' }),
  w('he', 'he', 'pronoun', { he: 'הוא', ru: 'он', ar: 'هو' }, { emoji: '👦' }),
  w('she', 'she', 'pronoun', { he: 'היא', ru: 'она', ar: 'هي' }, { emoji: '👧' }),
  w('it', 'it', 'pronoun', { he: 'זה / זאת (חפץ, חיה)', ru: 'оно (предмет, животное)', ar: 'هو / هي (لشي أو حيوان)' }, { emoji: '📦' }),
  w('we', 'we', 'pronoun', { he: 'אנחנו', ru: 'мы', ar: 'إحنا' }, { emoji: '👫' }),
  w('they', 'they', 'pronoun', { he: 'הם / הן', ru: 'они', ar: 'همّ' }, { emoji: '👨‍👩‍👧' }),
  w('my', 'my', 'possessive', { he: 'שלי', ru: 'мой / моя', ar: 'تبعي' }),
  w('your', 'your', 'possessive', { he: 'שלך / שלכם', ru: 'твой / ваш', ar: 'تبعك' }),
  w('his', 'his', 'possessive', { he: 'שלו', ru: 'его', ar: 'تبعه' }),
  w('her', 'her', 'possessive', { he: 'שלה', ru: 'её', ar: 'تبعها' }),
  w('our', 'our', 'possessive', { he: 'שלנו', ru: 'наш', ar: 'تبعنا' }),
  w('their', 'their', 'possessive', { he: 'שלהם / שלהן', ru: 'их', ar: 'تبعهم' }),
  w('mom', 'mom', 'noun', { he: 'אמא', ru: 'мама', ar: 'إمّي / ماما' }, { emoji: '👩', alt: ['mother', 'mum'] }),
  w('dad', 'dad', 'noun', { he: 'אבא', ru: 'папа', ar: 'أبوي / بابا' }, { emoji: '👨', alt: ['father'] }),
  w('brother', 'brother', 'noun', { he: 'אח', ru: 'брат', ar: 'أخ' }, { emoji: '👦' }),
  w('sister', 'sister', 'noun', { he: 'אחות', ru: 'сестра', ar: 'أخت' }, { emoji: '👧' }),
  w('friend', 'friend', 'noun', { he: 'חבר / חברה', ru: 'друг / подруга', ar: 'صاحب / صاحبة' }, { emoji: '🧑‍🤝‍🧑', forms: { plural: 'friends' } }),

  // ---- time words ----
  w('every_day', 'every day', 'time', { he: 'כל יום', ru: 'каждый день', ar: 'كل يوم' }, { emoji: '📅' }),
  w('every_morning', 'every morning', 'time', { he: 'כל בוקר', ru: 'каждое утро', ar: 'كل صبح' }, { emoji: '🌅' }),
  w('after_school', 'after school', 'time', { he: 'אחרי בית הספר', ru: 'после школы', ar: 'بعد المدرسة' }, { emoji: '🏫' }),
  w('at_night', 'at night', 'time', { he: 'בלילה', ru: 'ночью', ar: 'بالليل' }, { emoji: '🌙' }),
  w('on_weekends', 'on weekends', 'time', { he: 'בסופי שבוע', ru: 'по выходным', ar: 'بالويكند' }, { emoji: '🎉' }),
  w('usually', 'usually', 'time', { he: 'בדרך כלל', ru: 'обычно', ar: 'عادةً' }),
  w('always', 'always', 'time', { he: 'תמיד', ru: 'всегда', ar: 'دايمًا' }),
  w('sometimes', 'sometimes', 'time', { he: 'לפעמים', ru: 'иногда', ar: 'أحيانًا' }),

  // ---- everyday things ----
  w('video', 'video', 'noun', { he: 'סרטון', ru: 'видео', ar: 'فيديو' }, { emoji: '🎬', forms: { plural: 'videos' } }),
  w('news', 'news', 'noun', { he: 'חדשות', ru: 'новости', ar: 'أخبار' }, { emoji: '📰' }),
  w('book', 'book', 'noun', { he: 'ספר', ru: 'книга', ar: 'كتاب' }, { emoji: '📖', forms: { plural: 'books' } }),
  w('music', 'music', 'noun', { he: 'מוזיקה', ru: 'музыка', ar: 'موسيقى' }, { emoji: '🎵' }),
  w('game', 'game', 'noun', { he: 'משחק', ru: 'игра', ar: 'لعبة' }, { emoji: '🎮', forms: { plural: 'games' } }),

  // ---- PHONES set 1 (vertical slice) ----
  w('phone', 'phone', 'noun', { he: 'טלפון', ru: 'телефон', ar: 'تلفون / جوّال' }, { emoji: '📱', forms: { plural: 'phones' }, def: 'You use it to call and to send messages.' }),
  w('use', 'use', 'verb', { he: 'להשתמש', ru: 'пользоваться / использовать', ar: 'يستعمل' }, { emoji: '👆', forms: { s: 'uses', ing: 'using' }, def: 'to do something with a thing' }),
  w('call', 'call', 'verb', { he: 'להתקשר', ru: 'звонить', ar: 'يتّصل / يرنّ' }, { emoji: '📞', forms: { s: 'calls', ing: 'calling' }, def: 'to talk to someone on the phone' }),
  w('message', 'message', 'verb', { he: 'לשלוח הודעה / הודעה', ru: 'писать сообщение / сообщение', ar: 'يبعت مسج / رسالة' }, { emoji: '💬', forms: { s: 'messages', ing: 'messaging', plural: 'messages' }, def: 'to send words on a phone' }),
  w('read', 'read', 'verb', { he: 'לקרוא', ru: 'читать', ar: 'يقرا' }, { emoji: '👀', forms: { s: 'reads', ing: 'reading' }, def: 'to look at words and understand them' }),
  w('watch', 'watch', 'verb', { he: 'לצפות', ru: 'смотреть', ar: 'يحضر' }, { emoji: '📺', forms: { s: 'watches', ing: 'watching' }, def: 'to look at something for some time (a video, a game)' }),

  // ---- PHONES set 2 ----
  w('write', 'write', 'verb', { he: 'לכתוב', ru: 'писать', ar: 'يكتب' }, { emoji: '✍️', forms: { s: 'writes', ing: 'writing' } }),
  w('listen', 'listen', 'verb', { he: 'להקשיב', ru: 'слушать', ar: 'يسمع' }, { emoji: '🎧', forms: { s: 'listens', ing: 'listening' } }),
  w('play', 'play', 'verb', { he: 'לשחק / לנגן', ru: 'играть', ar: 'يلعب' }, { emoji: '🕹️', forms: { s: 'plays', ing: 'playing' } }),
  w('take', 'take', 'verb', { he: 'לקחת / לצלם (take photos)', ru: 'брать / делать (фото)', ar: 'ياخد / يصوّر' }, { emoji: '🤳', forms: { s: 'takes', ing: 'taking' } }),
  w('look', 'look', 'verb', { he: 'להסתכל', ru: 'смотреть (look at)', ar: 'يطّلع' }, { emoji: '👁️', forms: { s: 'looks', ing: 'looking' } }),
  w('send', 'send', 'verb', { he: 'לשלוח', ru: 'отправлять', ar: 'يبعت' }, { emoji: '📤', forms: { s: 'sends', ing: 'sending' } }),

  // ---- PHONES set 3 (useful for -ing spelling: chat → chatting, share → sharing) ----
  w('chat', 'chat', 'verb', { he: 'לצ׳טט / לשוחח', ru: 'переписываться / болтать', ar: 'يدردش / يشات' }, { emoji: '💬', forms: { s: 'chats', ing: 'chatting' }, def: 'to talk or write to a friend' }),
  w('share', 'share', 'verb', { he: 'לשתף', ru: 'делиться', ar: 'يشارك' }, { emoji: '🔁', forms: { s: 'shares', ing: 'sharing' }, def: 'to give others a part of something' }),
  w('post', 'post', 'verb', { he: 'לפרסם (פוסט)', ru: 'публиковать', ar: 'ينشر' }, { emoji: '📮', forms: { s: 'posts', ing: 'posting' }, def: 'to put a photo or words online' }),
  w('scroll', 'scroll', 'verb', { he: 'לגלול', ru: 'листать (ленту)', ar: 'يمرّر / يسكرول' }, { emoji: '👇', forms: { s: 'scrolls', ing: 'scrolling' }, def: 'to move the screen up or down' }),

  // ---- NOW words (Present Progressive) ----
  w('now', 'now', 'time', { he: 'עכשיו', ru: 'сейчас', ar: 'هلّأ' }, { emoji: '⚡' }),
  w('right_now', 'right now', 'time', { he: 'ממש עכשיו', ru: 'прямо сейчас', ar: 'هلّأ بالزبط' }, { emoji: '⚡' }),
  w('at_the_moment', 'at the moment', 'time', { he: 'כרגע', ru: 'в данный момент', ar: 'بهاي اللحظة' }, { emoji: '⏱️' }),
  w('today', 'today', 'time', { he: 'היום', ru: 'сегодня', ar: 'اليوم' }, { emoji: '📆' }),

  // ---- QUESTION words (WH questions) ----
  w('what', 'what', 'question', { he: 'מה', ru: 'что', ar: 'شو' }, { emoji: '❓' }),
  w('where', 'where', 'question', { he: 'איפה', ru: 'где', ar: 'وين' }, { emoji: '📍' }),
  w('when', 'when', 'question', { he: 'מתי', ru: 'когда', ar: 'إمتى' }, { emoji: '🕒' }),
  w('who', 'who', 'question', { he: 'מי / את מי', ru: 'кто / кого', ar: 'مين' }, { emoji: '🧑' }),
  w('why', 'why', 'question', { he: 'למה', ru: 'почему', ar: 'ليش' }, { emoji: '🤔' }),
  w('how_often', 'how often', 'question', { he: 'כמה פעמים / באיזו תדירות', ru: 'как часто', ar: 'قدّيش مرّة' }, { emoji: '🔁' }),
  w('what_time', 'what time', 'question', { he: 'באיזו שעה', ru: 'во сколько', ar: 'أيّ ساعة' }, { emoji: '⏰' }),
  w('homework', 'homework', 'noun', { he: 'שיעורי בית', ru: 'домашнее задание', ar: 'وظيفة' }, { emoji: '📚' }),
  w('tv', 'TV', 'noun', { he: 'טלוויזיה', ru: 'телевизор', ar: 'تلفزيون' }, { emoji: '📺' }),
  w('home', 'home', 'noun', { he: 'בית (at home = בבית)', ru: 'дом (at home = дома)', ar: 'دار (at home = بالدار)' }, { emoji: '🏠' }),
  w('class', 'class', 'noun', { he: 'כיתה / שיעור', ru: 'класс / урок', ar: 'صف' }, { emoji: '🏫' }),

  // ---- DEMOCRACY ----
  w('vote', 'vote', 'verb', { he: 'להצביע', ru: 'голосовать', ar: 'يصوّت' }, { emoji: '🗳️', forms: { s: 'votes', ing: 'voting' } }),
  w('citizen', 'citizen', 'noun', { he: 'אזרח / אזרחית', ru: 'гражданин', ar: 'مواطن' }, { emoji: '🧑', forms: { plural: 'citizens' } }),
  w('government', 'government', 'noun', { he: 'ממשלה', ru: 'правительство', ar: 'حكومة' }, { emoji: '🏛️' }),
  w('election', 'election', 'noun', { he: 'בחירות', ru: 'выборы', ar: 'انتخابات' }, { emoji: '📊', forms: { plural: 'elections' } }),
  w('law', 'law', 'noun', { he: 'חוק', ru: 'закон', ar: 'قانون' }, { emoji: '⚖️', forms: { plural: 'laws' } }),
  w('choose', 'choose', 'verb', { he: 'לבחור', ru: 'выбирать', ar: 'يختار' }, { emoji: '☝️', forms: { s: 'chooses', ing: 'choosing' } }),
  w('speak', 'speak', 'verb', { he: 'לדבר', ru: 'говорить', ar: 'يحكي' }, { emoji: '🗣️', forms: { s: 'speaks', ing: 'speaking' } }),
  w('meet', 'meet', 'verb', { he: 'להיפגש', ru: 'встречаться', ar: 'يلتقي / يقابل' }, { emoji: '🤝', forms: { s: 'meets', ing: 'meeting' } }),
  w('discuss', 'discuss', 'verb', { he: 'לדון', ru: 'обсуждать', ar: 'يتناقش' }, { emoji: '💭', forms: { s: 'discusses', ing: 'discussing' } }),
  w('protest', 'protest', 'verb', { he: 'להפגין / מחאה', ru: 'протестовать', ar: 'يتظاهر / مظاهرة' }, { emoji: '📢', forms: { s: 'protests', ing: 'protesting' } }),

  // ---- HISTORY ----
  w('history', 'history', 'noun', { he: 'היסטוריה', ru: 'история', ar: 'تاريخ' }, { emoji: '📜' }),
  w('historian', 'historian', 'noun', { he: 'היסטוריון', ru: 'историк', ar: 'مؤرّخ' }, { emoji: '🧐', forms: { plural: 'historians' } }),
  w('photo', 'photo', 'noun', { he: 'תמונה (צילום)', ru: 'фотография', ar: 'صورة' }, { emoji: '🖼️', forms: { plural: 'photos' } }),
  w('document', 'document', 'noun', { he: 'מסמך', ru: 'документ', ar: 'وثيقة' }, { emoji: '📄', forms: { plural: 'documents' } }),
  w('museum', 'museum', 'noun', { he: 'מוזיאון', ru: 'музей', ar: 'متحف' }, { emoji: '🏛️', forms: { plural: 'museums' } }),
  w('study', 'study', 'verb', { he: 'ללמוד / לחקור', ru: 'изучать', ar: 'يدرس' }, { emoji: '🔎', forms: { s: 'studies', ing: 'studying' } }),
  w('wear', 'wear', 'verb', { he: 'ללבוש', ru: 'носить (одежду)', ar: 'يلبس' }, { emoji: '👕', forms: { s: 'wears', ing: 'wearing' } }),
  w('hold', 'hold', 'verb', { he: 'להחזיק', ru: 'держать', ar: 'يمسك' }, { emoji: '✋', forms: { s: 'holds', ing: 'holding' } }),
  w('stand', 'stand', 'verb', { he: 'לעמוד', ru: 'стоять', ar: 'يوقف' }, { emoji: '🧍', forms: { s: 'stands', ing: 'standing' } }),
  w('sit', 'sit', 'verb', { he: 'לשבת', ru: 'сидеть', ar: 'يقعد' }, { emoji: '🪑', forms: { s: 'sits', ing: 'sitting' } }),
];

export const VOCAB_SETS = [
  { id: 'basics_people', theme: 'basics', name: { en: 'People & pronouns', he: 'אנשים וכינויי גוף', ru: 'Люди и местоимения', ar: 'ناس وضماير' },
    words: ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'mom', 'dad', 'brother', 'sister', 'friend'] },
  { id: 'basics_time', theme: 'basics', name: { en: 'Time words', he: 'מילות זמן', ru: 'Слова времени', ar: 'كلمات الوقت' },
    words: ['every_day', 'every_morning', 'after_school', 'at_night', 'on_weekends', 'usually', 'always', 'sometimes'] },
  { id: 'basics_things', theme: 'basics', name: { en: 'Everyday things', he: 'דברים יומיומיים', ru: 'Повседневные вещи', ar: 'أشيا يومية' },
    words: ['video', 'news', 'book', 'music', 'game'] },
  { id: 'phones_1', theme: 'phones', name: { en: 'Phones 1', he: 'טלפונים 1', ru: 'Телефоны 1', ar: 'تلفونات 1' },
    words: ['phone', 'use', 'call', 'message', 'read', 'watch'] },
  { id: 'phones_2', theme: 'phones', name: { en: 'Phones 2', he: 'טלפונים 2', ru: 'Телефоны 2', ar: 'تلفونات 2' },
    words: ['write', 'listen', 'play', 'take', 'look', 'send'] },
  { id: 'phones_3', theme: 'phones', name: { en: 'Phones 3', he: 'טלפונים 3', ru: 'Телефоны 3', ar: 'تلفونات 3' },
    words: ['chat', 'share', 'post', 'scroll'] },
  { id: 'time_now', theme: 'basics', name: { en: 'Now words', he: 'מילים של "עכשיו"', ru: 'Слова «сейчас»', ar: 'كلمات "هلّأ"' },
    words: ['now', 'right_now', 'at_the_moment', 'today'] },
  { id: 'places', theme: 'basics', name: { en: 'Places & things 2', he: 'מקומות ודברים 2', ru: 'Места и вещи 2', ar: 'أماكن وأشيا 2' },
    words: ['homework', 'tv', 'home', 'class'] },
  { id: 'question_words', theme: 'basics', name: { en: 'Question words', he: 'מילות שאלה', ru: 'Вопросительные слова', ar: 'كلمات السؤال' },
    words: ['what', 'where', 'when', 'who', 'why', 'how_often', 'what_time'] },
  { id: 'democracy_1', theme: 'democracy', name: { en: 'Democracy 1', he: 'דמוקרטיה 1', ru: 'Демократия 1', ar: 'ديمقراطية 1' },
    words: ['vote', 'citizen', 'government', 'election', 'law', 'choose', 'speak', 'meet', 'discuss', 'protest'] },
  { id: 'history_1', theme: 'history', name: { en: 'History 1', he: 'היסטוריה 1', ru: 'История 1', ar: 'تاريخ 1' },
    words: ['history', 'historian', 'photo', 'document', 'museum', 'study', 'read', 'write', 'look', 'wear', 'hold', 'stand', 'sit'] },
];

export const THEMES = [
  { id: 'phones', emoji: '📱', name: { en: 'Phones & technology', he: 'טלפונים וטכנולוגיה', ru: 'Телефоны и технологии', ar: 'تلفونات وتكنولوجيا' } },
  { id: 'democracy', emoji: '🗳️', name: { en: 'Democracy', he: 'דמוקרטיה', ru: 'Демократия', ar: 'ديمقراطية' } },
  { id: 'history', emoji: '📜', name: { en: 'History', he: 'היסטוריה', ru: 'История', ar: 'تاريخ' } },
];

// Words that never need teaching (articles, prepositions, small connectors).
export const FUNCTION_WORDS = ['the', 'a', 'an', 'and', 'to', 'at', 'in', 'on', 'of', 'with', 'for', 'too', 'very', 'this', 'that', 'yes', 'no', 'but', 'so', 'hi', 'ok'];

// Grammar words. They never need vocabulary teaching — they are gated by the grammar SKILL instead.
export const GRAMMAR_WORDS = {
  am: 'am_is_are', is: 'am_is_are', are: 'am_is_are', "i'm": 'am_is_are', "he's": 'am_is_are', "she's": 'am_is_are', "it's": 'am_is_are', "we're": 'am_is_are', "they're": 'am_is_are', "you're": 'am_is_are',
  not: 'ps_negative', "don't": 'ps_negative', "doesn't": 'ps_negative', "isn't": 'pp_negative', "aren't": 'pp_negative',
  do: 'ps_questions', does: 'ps_questions',
};

// Names used in exercises. A name is "she" or "he" — that is part of what students practice.
export const NAMES = { dana: 'she', maya: 'she', noa: 'she', lina: 'she', dani: 'he', noam: 'he', omer: 'he', omar: 'he' };
