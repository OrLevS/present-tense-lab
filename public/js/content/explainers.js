// Animated explanations — one per rule. Shown right AFTER the "guess" step (first you guess, then you see it move).
// Blocks keep their key between scenes, so the engine (ui/explainer.js) shows them MOVING, not just changing.
// Only taught vocabulary (phones / family / time words).

const L = (he, ru, ar, en) => ({ he, ru, ar, en });
const b = (k, t, o = {}) => ({ k, t, ...o });
const G = { gold: true };
const GG = { gold: true, glue: true };

export const EXPLAINERS = {
  // ───────── he / she / it + S ─────────
  third_person_s: {
    title: L('ה-S קופץ', 'S прыгает', 'الـ S بنط', 'The jumping S'),
    scenes: [
      { rows: [[b('sub', 'I'), b('v', 'play'), b('o', 'games')]], say: 'I play games.', caption: L('עם I — הפועל נשאר כמו שהוא.', 'С I глагол не меняется.', 'مع I — الفعل بضل زيّ ما هو.', 'With I, the verb stays the same.') },
      { rows: [[b('sub', 'He'), b('v', 'play'), b('o', 'games')]], caption: L('עכשיו הנושא הוא He…', 'Теперь подлежащее — He…', 'هلّأ الفاعل He…', 'Now the subject is He…') },
      { rows: [[b('sub', 'He'), b('s', 's', GG), b('v', 'play'), b('o', 'games')]], caption: L('ה-S מגיע יחד עם he / she / it…', 'S приходит вместе с he / she / it…', 'الـ S بتيجي مع he / she / it…', 'The S comes with he / she / it…') },
      { rows: [[b('sub', 'He'), b('v', 'play'), b('s', 's', GG), b('o', 'games')]], say: 'He plays games.', caption: L('…וקופץ אל הפועל!', '…и прыгает к глаголу!', '…وبنط عالفعل!', '…and jumps onto the verb!') },
      { rows: [[b('sub2', 'My mom'), b('v2', 'read'), b('s2', 's', GG), b('o2', 'the news')], [b('sub3', 'Maya'), b('v3', 'use'), b('s3', 's', GG), b('o3', 'her phone')]], say: 'My mom reads the news. Maya uses her phone.', caption: L('אדם אחד או שם = he / she ← +S', 'Один человек или имя = he / she → +S', 'شخص واحد أو اسم = he / she ← +S', 'One person or a name = he / she → +S') },
      { rows: [[b('sub4', 'They'), b('v4', 'play')], [b('sub5', 'We'), b('v5', 'play')], [b('sub6', 'You'), b('v6', 'play')]], caption: L('I / you / we / they — בלי S.', 'I / you / we / they — без S.', 'I / you / we / they — بدون S.', 'I / you / we / they — no S.') },
      { rows: [[b('sub7', 'My brother'), b('v7', 'watch'), b('s7', 'es', GG), b('o7', 'videos')]], say: 'My brother watches videos.', caption: L('אחרי ch / sh / s / x — מוסיפים es.', 'После ch / sh / s / x добавляем es.', 'بعد ch / sh / s / x — منزيد es.', 'After ch / sh / s / x, add es.') },
    ],
  },

  // ───────── am / is / are ─────────
  am_is_are: {
    title: L('מילות דבק', 'Слова-клей', 'كلمات اللزق', 'Glue words'),
    scenes: [
      { rows: [[b('sub', 'She'), b('o', 'my sister')]], caption: L('בעברית אומרים "היא אחותי". באנגלית חסר כאן משהו…', 'По-русски: «Она моя сестра». В английском здесь чего-то не хватает…', 'بالعربي منحكي "هي أختي". بالإنجليزي في إشي ناقص هون…', 'Something is missing here…') },
      { rows: [[b('sub', 'She'), b('be', 'is', G), b('o', 'my sister')]], say: 'She is my sister.', caption: L('מילת דבק! she ← is', 'Слово-клей! she → is', 'كلمة لزق! she ← is', 'A glue word! she → is') },
      { rows: [[b('sub', 'I'), b('be', 'am', G), b('o', 'Dana')]], say: 'I am Dana.', caption: L('I ← am', 'I → am', 'I ← am', 'I → am') },
      { rows: [[b('sub', 'They'), b('be', 'are', G), b('o', 'my friends')]], say: 'They are my friends.', caption: L('you / we / they ← are', 'you / we / they → are', 'you / we / they ← are', 'you / we / they → are') },
      { rows: [[b('a', 'I'), b('am', 'am', G)], [b('b', 'he · she · it'), b('is', 'is', G)], [b('c', 'you · we · they'), b('are', 'are', G)]], caption: L('לכל נושא — הדבק שלו.', 'У каждого подлежащего — свой «клей».', 'لكل فاعل — اللزق تبعه.', 'Every subject has its own glue.') },
    ],
  },

  // ───────── verb + ing ─────────
  verb_ing: {
    title: L('ing ושני מקרים מיוחדים', 'ing и два особых случая', 'ing وحالتين خاصّين', '-ing and two special cases'),
    scenes: [
      { rows: [[b('v', 'play')]], caption: L('רוב הפעלים…', 'Большинство глаголов…', 'أغلب الأفعال…', 'Most verbs…') },
      { rows: [[b('v', 'play'), b('ing', 'ing', GG)]], say: 'playing', caption: L('…פשוט מוסיפים ing.', '…просто добавляем ing.', '…بس منزيد ing.', '…just add -ing.') },
      { rows: [[b('u', 'us'), b('e', 'e', { glue: true, strike: true })]], caption: L('use נגמר ב-e…', 'use кончается на e…', 'use بتخلص بـ e…', 'use ends in e…') },
      { rows: [[b('u', 'us'), b('ing2', 'ing', GG)]], say: 'using', caption: L('…ה-e נופלת: using', '…e исчезает: using', '…الـ e بتوقع: using', '…the e falls off: using') },
      { rows: [[b('c', 'chat')]], caption: L('chat: עיצור–תנועה–עיצור בסוף…', 'chat: согласная–гласная–согласная в конце…', 'chat: ساكن–حركة–ساكن بالآخر…', 'chat: consonant–vowel–consonant at the end…') },
      { rows: [[b('c', 'chat'), b('t', 't', GG), b('ing3', 'ing', GG)]], say: 'chatting', caption: L('…ה-t מוכפלת: chatting', '…t удваивается: chatting', '…الـ t بتتضاعف: chatting', '…the t doubles: chatting') },
    ],
  },

  // ───────── Present Progressive ─────────
  pp_statements: {
    title: L('בונים "עכשיו"', 'Строим «сейчас»', 'منبني "هلّأ"', 'Building "now"'),
    scenes: [
      { icons: ['⚡'], tag: '⚡ now', rows: [[b('sub', 'She')]], caption: L('מה היא עושה ממש עכשיו? מתחילים במי.', 'Что она делает прямо сейчас? Начинаем с «кто».', 'شو بتعمل هلّأ بالزبط؟ منبلّش بمين.', 'What is she doing right now? Start with who.') },
      { icons: ['⚡'], tag: '⚡ now', rows: [[b('sub', 'She'), b('be', 'is', G)]], caption: L('מילת דבק: is', 'Слово-клей: is', 'كلمة لزق: is', 'Glue word: is') },
      { icons: ['⚡'], tag: '⚡ now', rows: [[b('sub', 'She'), b('be', 'is', G), b('v', 'us'), b('ing', 'ing', GG)]], caption: L('הפועל + ing', 'Глагол + ing', 'الفعل + ing', 'verb + -ing') },
      { icons: ['⚡'], tag: '⚡ now', rows: [[b('sub', 'She'), b('be', 'is', G), b('v', 'us'), b('ing', 'ing', GG), b('o', 'her phone'), b('t', 'now')]], say: 'She is using her phone now.', caption: L('She is using her phone now.', 'She is using her phone now.', 'She is using her phone now.', 'She is using her phone now.') },
      { icons: ['⚡'], tag: '⚡ now', rows: [[b('a', 'I'), b('b1', 'am', G), b('c1', 'watching')], [b('d', 'They'), b('b2', 'are', G), b('c2', 'chatting')]], say: 'I am watching. They are chatting.', caption: L('נושא + am / is / are + פועל-ing', 'Подлежащее + am / is / are + глагол-ing', 'فاعل + am / is / are + فعل-ing', 'subject + am / is / are + verb-ing') },
    ],
  },

  // ───────── now or usually? ─────────
  ps_vs_pp: {
    title: L('עכשיו או בדרך כלל?', 'Сейчас или обычно?', 'هلّأ ولا عادةً؟', 'Now or usually?'),
    scenes: [
      { rows: [[b('y1', 'You'), b('w1', 'watch'), b('v1', 'videos')], [b('y2', 'You'), b('a2', 'are', G), b('w2', 'watching'), b('v2', 'videos')]], caption: L('מה ההבדל?', 'В чём разница?', 'شو الفرق؟', 'What is the difference?') },
      { icons: ['Mon 📺', 'Tue 📺', 'Wed 📺', 'Thu 📺', 'Fri 📺'], tag: '⏰ usually', rows: [[b('y1', 'You'), b('w1', 'watch'), b('v1', 'videos'), b('t1', 'every day')]], say: 'You watch videos every day.', caption: L('שוב ושוב, כל יום = הרגל.', 'Снова и снова, каждый день = привычка.', 'كل مرّة، كل يوم = عادة.', 'Again and again, every day = a habit.') },
      { icons: ['⚡'], tag: '⚡ now', rows: [[b('y2', 'You'), b('a2', 'are', G), b('w2', 'watching'), b('v2', 'videos'), b('t2', 'now')]], say: 'You are watching videos now.', caption: L('רגע אחד, ממש עכשיו.', 'Один момент — прямо сейчас.', 'لحظة وحدة، هلّأ بالزبط.', 'One moment, right now.') },
      { rows: [[b('y', 'You'), b('w', 'watch'), b('v', 'videos')]], caption: L('מהרגל ל"עכשיו"…', 'От привычки к «сейчас»…', 'من عادة لـ"هلّأ"…', 'From habit to "now"…') },
      { tag: '⚡ now', rows: [[b('y', 'You'), b('are', 'are', G), b('w', 'watch'), b('ing', 'ing', GG), b('v', 'videos')]], say: 'You are watching videos.', caption: L('…נכנסים are ו-ing.', '…входят are и ing.', '…بفوتوا are و ing.', '…are and -ing come in.') },
      { rows: [[b('h', '⏰', { pic: true }), b('s1', 'She'), b('r1', 'reads'), b('n1', 'every day')], [b('n', '⚡', { pic: true }), b('s2', 'She'), b('i2', 'is', G), b('r2', 'reading'), b('n2', 'now')]], say: 'She reads every day. She is reading now.', caption: L('בדרך כלל ← reads · עכשיו ← is reading', 'Обычно → reads · Сейчас → is reading', 'عادةً ← reads · هلّأ ← is reading', 'Usually → reads · Now → is reading') },
    ],
  },

  // ───────── don't / doesn't ─────────
  ps_negative: {
    title: L('לאן ה-S הולך?', 'Куда уходит S?', 'وين بتروح الـ S؟', 'Where does the S go?'),
    scenes: [
      { rows: [[b('sub', 'She'), b('v', 'use'), b('s', 's', GG), b('o', 'her phone'), b('t', 'at night')]], say: 'She uses her phone at night.', caption: L('She uses… — ועכשיו רוצים להגיד "לא".', 'She uses… — а теперь хотим сказать «не».', 'She uses… — وهلّأ بدنا نحكي "لأ".', 'She uses… — now we want to say "not".') },
      { rows: [[b('sub', 'She'), b('do', 'do'), b('s', 'es', GG), b('not', 'not', G), b('v', 'use'), b('o', 'her phone'), b('t', 'at night')]], say: 'She does not use her phone at night.', caption: L('does not נכנס — וה-S עובר אליו!', 'Входит does not — и S переходит к нему!', 'بفوت does not — والـ S بتنتقل إلو!', 'does not comes in, and the S moves to it!') },
      { rows: [[b('sub', 'She'), b('dn', "doesn't", G), b('v', 'use'), b('o', 'her phone'), b('t', 'at night')]], say: "She doesn't use her phone at night.", caption: L("does not = doesn't. הפועל חוזר לבסיס: use", "does not = doesn't. Глагол без S: use", "does not = doesn't. الفعل برجع للأساس: use", "does not = doesn't. The verb goes back to base: use") },
      { rows: [[b('a', 'I'), b('dt', "don't", G), b('v1', 'use')], [b('c', 'She'), b('ds', "doesn't", G), b('v2', 'use')]], caption: L("I / you / we / they ← don't · he / she / it ← doesn't", "I / you / we / they → don't · he / she / it → doesn't", "I / you / we / they ← don't · he / she / it ← doesn't", "I / you / we / they → don't · he / she / it → doesn't") },
    ],
  },

  // ───────── isn't / aren't ─────────
  pp_negative: {
    title: L('not אחרי מילת הדבק', 'not после «клея»', 'not بعد كلمة اللزق', 'not after the glue word'),
    scenes: [
      { tag: '⚡ now', rows: [[b('sub', 'They'), b('be', 'are'), b('v', 'playing'), b('o', 'a game')]], say: 'They are playing a game.', caption: L('They are playing… — ועכשיו "לא".', 'They are playing… — а теперь «не».', 'They are playing… — وهلّأ "لأ".', 'They are playing… — now "not".') },
      { tag: '⚡ now', rows: [[b('sub', 'They'), b('be', 'are'), b('not', 'not', G), b('v', 'playing'), b('o', 'a game')]], say: 'They are not playing a game.', caption: L('not נכנס מיד אחרי are.', 'not встаёт сразу после are.', 'not بفوت بعد are على طول.', 'not goes right after are.') },
      { tag: '⚡ now', rows: [[b('sub', 'They'), b('nt', "aren't", G), b('v', 'playing'), b('o', 'a game')]], say: "They aren't playing a game.", caption: L("are not = aren't", "are not = aren't", "are not = aren't", "are not = aren't") },
      { rows: [[b('a', 'I'), b('x1', "'m not", G), b('v1', 'calling')], [b('c', 'She'), b('x2', "isn't", G), b('v2', 'calling')], [b('d', 'We'), b('x3', "aren't", G), b('v3', 'calling')]], caption: L("I'm not · isn't · aren't + פועל-ing", "I'm not · isn't · aren't + глагол-ing", "I'm not · isn't · aren't + فعل-ing", "I'm not · isn't · aren't + verb-ing") },
    ],
  },

  // ───────── Do / Does ? ─────────
  ps_questions: {
    title: L('Does עף להתחלה', 'Does летит в начало', 'Does بطير للأوّل', 'Does flies to the front'),
    scenes: [
      { rows: [[b('sub', 'She'), b('v', 'call'), b('s', 's', GG), b('o', 'her mom'), b('t', 'every day')]], say: 'She calls her mom every day.', caption: L('משפט. איך הופכים אותו לשאלה?', 'Утверждение. Как сделать из него вопрос?', 'جملة. كيف منعملها سؤال؟', 'A statement. How do we make a question?') },
      { rows: [[b('do', 'Do', G), b('s', 'es', GG), b('sub', 'she'), b('v', 'call'), b('o', 'her mom'), b('t', 'every day'), b('q', '?')]], say: 'Does she call her mom every day?', caption: L('Do נכנס להתחלה — וה-S קופץ אליו: Does', 'Do встаёт в начало — и S прыгает к нему: Does', 'Do بفوت بالأوّل — والـ S بتنط إلو: Does', 'Do comes to the front, and the S jumps onto it: Does') },
      { rows: [[b('d1', 'Do', G), b('y', 'you'), b('v1', 'call'), b('q1', '?')], [b('d2', 'Does', G), b('h', 'he'), b('v2', 'call'), b('q2', '?')]], caption: L('I / you / we / they ← Do · he / she / it ← Does · הפועל בלי S', 'I / you / we / they → Do · he / she / it → Does · глагол без S', 'I / you / we / they ← Do · he / she / it ← Does · الفعل بدون S', 'I / you / we / they → Do · he / she / it → Does · verb without S') },
    ],
  },

  // ───────── Am / Is / Are ? ─────────
  pp_questions: {
    title: L('מחליפים מקום', 'Меняемся местами', 'منبدّل المحلّات', 'Swap places'),
    scenes: [
      { tag: '⚡ now', rows: [[b('sub', 'She'), b('be', 'is', G), b('v', 'reading'), b('o', 'the news')]], say: 'She is reading the news.', caption: L('משפט "עכשיו". איך שואלים?', 'Предложение «сейчас». Как спросить?', 'جملة "هلّأ". كيف منسأل؟', 'A "now" sentence. How do we ask?') },
      { tag: '⚡ now', rows: [[b('be', 'Is', G), b('sub', 'she'), b('v', 'reading'), b('o', 'the news'), b('q', '?')]], say: 'Is she reading the news?', caption: L('is ו-she מחליפים מקום!', 'is и she меняются местами!', 'is و she ببدّلوا محلّاتهم!', 'is and she swap places!') },
      { rows: [[b('a1', 'Are', G), b('t', 'they'), b('c1', 'chatting'), b('q1', '?')], [b('a2', 'Am', G), b('i', 'I'), b('c2', 'chatting'), b('q2', '?')]], caption: L('Am / Is / Are + נושא + פועל-ing ?', 'Am / Is / Are + подлежащее + глагол-ing ?', 'Am / Is / Are + فاعل + فعل-ing ؟', 'Am / Is / Are + subject + verb-ing ?') },
    ],
  },

  // ───────── WH questions ─────────
  wh_questions: {
    title: L('מילת השאלה נכנסת ראשונה', 'Вопросительное слово — первым', 'كلمة السؤال بتفوت أوّل', 'The question word goes first'),
    scenes: [
      { rows: [[b('aux', 'Does'), b('sub', 'she'), b('v', 'read'), b('o', 'the news'), b('q', '?')]], say: 'Does she read the news?', caption: L('שאלת כן / לא.', 'Вопрос «да / нет».', 'سؤال آه / لأ.', 'A yes / no question.') },
      { rows: [[b('wh', 'Where', G), b('aux', 'does'), b('sub', 'she'), b('v', 'read'), b('o', 'the news'), b('q', '?')]], say: 'Where does she read the news?', caption: L('Where נכנס לפני הכול.', 'Where встаёт перед всем.', 'Where بفوت قبل كل إشي.', 'Where goes before everything.') },
      { icons: ['🏠'], rows: [[b('ans', 'At home.')]], say: 'At home.', caption: L('והתשובה: איפה? — בבית.', 'И ответ: где? — дома.', 'والجواب: وين؟ — بالدار.', 'And the answer: where? At home.') },
      { tag: '⚡ now', rows: [[b('wh2', 'What', G), b('be', 'is'), b('sub2', 'she'), b('v2', 'reading'), b('q2', '?')]], say: 'What is she reading?', caption: L('גם עם am / is / are.', 'И с am / is / are тоже.', 'كمان مع am / is / are.', 'It works with am / is / are too.') },
      { rows: [[b('f1', 'WH', G), b('f2', 'do / does'), b('f3', 'subject'), b('f4', 'verb'), b('f5', '?')], [b('g1', 'WH', G), b('g2', 'am / is / are'), b('g3', 'subject'), b('g4', 'verb-ing'), b('g5', '?')]], caption: L('מילת שאלה + עוזר + נושא + פועל', 'Вопр. слово + помощник + подлежащее + глагол', 'كلمة سؤال + مساعد + فاعل + فعل', 'WH word + helper + subject + verb') },
    ],
  },
};
