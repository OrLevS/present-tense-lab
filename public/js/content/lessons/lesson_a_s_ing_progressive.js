// LESSON A (≈60 min): he/she/it + S → am/is/are → verb + ing → Present Progressive → "now" or "usually"?
// Theme: phones. Every part is gated by its own grammar skill — a part opens only after the teacher marks it as taught.
//
// ITEM SHAPES (reference for writing new lessons)
//  kind:'sentence'  → the three help levels are generated automatically:
//      { id, kind:'sentence', prompt:L(...), acceptedAnswers:[...], chunks:[...], target:{structure, person?, verb?},
//        focus:{ frame:'She ___ her phone now.', options:[...], answer, base? }, rule:'pp', wrong?:'error sentence for Hard' }
//  type:'multiple_choice' { frame, options, answer, target }      type:'fill_blank' { frame, base, answer, target }
//  type:'sort'  { buckets:[{id,label}], cards:[{text,bucket}], errorTag }      type:'match' { pairs:[{left,right}], errorTag }
//  type:'pair_fill' { verb, frames:[...], answers:[...], targets?:[...] }    type:'text_gaps' { chat:[{from,text,base?,answer?}], targets? }
//  type:'listen_choose' { audio, options, answer, errorTag }   type:'transform' { source, instruction:L, acceptedAnswers, target }
//  type:'error_correction' { wrong, acceptedAnswers, target }  type:'translate' { prompt, acceptedAnswers, target }
//  type:'translate_multi' { parts:[{prompt, acceptedAnswers, target}] }
//  type:'free_production' / 'wh_scaffold' { instruction, situation?, fields?, target:{structure, person, verbs}, starter?, models }
// target.structure: 'ps' (default) · 'be' · 'ing' · 'pp' · 'ps_neg' · 'pp_neg' · 'ps_q' · 'pp_q' · 'wh_ps' · 'wh_pp'

import tps from '../modules/third_person_s_phones.js';

const L = (he, ru, ar, en) => ({ he, ru, ar, en });
const sent = (id, prompt, acceptedAnswers, chunks, target, focus, extra = {}) => ({ id, kind: 'sentence', prompt, acceptedAnswers, chunks, target, focus, ...extra });
const tpsItem = (id) => tps.practice.find((i) => i.id === id);

const PP = { structure: 'pp' };
const BE = { structure: 'be' };
const ING = { structure: 'ing' };

export default {
  id: 'lesson_a',
  order: 1,
  theme: 'phones',
  title: L('שיעור 1 · S, ing ו"עכשיו"', 'Урок 1 · S, ing и «сейчас»', 'درس 1 · S و ing و"هلّأ"', 'Lesson 1 · S, -ing and "now"'),
  goal: L(
    'אני יודע/ת לכתוב מה אנשים עושים בדרך כלל (she uses) ומה הם עושים עכשיו (she is using).',
    'Я умею писать, что люди делают обычно (she uses) и что они делают сейчас (she is using).',
    'بعرف أكتب شو الناس بعملوا عادةً (she uses) وشو بعملوا هلّأ (she is using).',
    'I can write what people usually do (she uses) and what they are doing now (she is using).'
  ),
  parts: [
    // ───────────── WARM-UP ─────────────
    {
      id: 'warm', skill: 'ps_i_you_we_they',
      title: L('חימום', 'Разминка', 'تسخين', 'Warm-up'),
      steps: [
        {
          type: 'warmup', items: [
            { id: 'la_w1', type: 'multiple_choice', grammarSkill: 'subject_pronouns', stage: 'A', frame: 'my sister = ___', options: ['she', 'he', 'they'], answer: 'she', target: { skill: 'subject_pronouns' }, errorTag: 'SUBJECT_PRONOUN' },
            { id: 'la_w2', type: 'multiple_choice', grammarSkill: 'subject_pronouns', stage: 'A', frame: 'my friends = ___', options: ['we', 'they', 'it'], answer: 'they', target: { skill: 'subject_pronouns' }, errorTag: 'SUBJECT_PRONOUN' },
            { id: 'la_w3', type: 'sentence_builder', grammarSkill: 'ps_i_you_we_they', stage: 'C', prompt: L('אנחנו צופים בסרטונים בסופי שבוע.', 'Мы смотрим видео по выходным.', 'إحنا بنحضر فيديوهات بالويكند.', 'we · watch · videos · on weekends'), chunks: ['We', 'watch', 'videos', 'on weekends'], acceptedAnswers: ['We watch videos on weekends.'], target: { person: 'plural', verb: 'watch', form: 'watch' } },
            { id: 'la_w4', type: 'multiple_choice', grammarSkill: 'time_words', stage: 'A', frame: 'I read books ___.', prompt: L('אני קורא/ת ספרים בלילה.', 'Я читаю книги ночью.', 'أنا بقرا كتب بالليل.', 'I · read · books · at night'), options: ['at night', 'every morning'], answer: 'at night', target: { skill: 'time_words' }, errorTag: 'VOCABULARY' },
          ],
        },
        { type: 'choose' },
      ],
    },

    // ───────────── PART 1 · he / she / it + S ─────────────
    {
      id: 's', skill: 'third_person_s', requiredSkills: ['subject_pronouns', 'ps_i_you_we_they'],
      title: L('חלק 1 · he / she / it + S', 'Часть 1 · he / she / it + S', 'جزء 1 · he / she / it + S', 'Part 1 · he / she / it + S'),
      steps: [
        { type: 'words', words: tps.focusWords },
        { type: 'guess', guess: tps.guess },
        {
          type: 'learn', learn: {
            ...tps.learn,
            transforms: [{ from: ['I', 'play'], to: ['He', 'plays'], mark: ['plays'], note: L('ה-S "קופץ" לפועל כשהנושא הוא he / she / it. ה-S שייך לנושא — לא לזמן.', 'S «прыгает» к глаголу, когда подлежащее he / she / it. S относится к подлежащему, а не ко времени.', 'الـ S "بنط" عالفعل لمّا الفاعل he / she / it. الـ S تابع للفاعل — مش للزمن.', 'The S "jumps" onto the verb when the subject is he / she / it. The S belongs to the subject.') }],
          },
        },
        { type: 'examples', examples: tps.examples },
        { type: 'check', items: tps.check },
        {
          type: 'practice', title: L('תרגול S · סבב 1', 'Практика S · раунд 1', 'تمرين S · جولة 1', 'S practice · round 1'),
          items: [
            tpsItem('tps_p01'), tpsItem('tps_p02'),
            { id: 'la_s_pf1', type: 'pair_fill', stage: 'B', verb: 'play', frames: ['I ___ games after school.', 'My brother ___ games after school.'], answers: ['play', 'plays'], target: { structure: 'ps' } },
            tpsItem('tps_p03'), tpsItem('tps_p04'),
            { id: 'la_s_l1', type: 'listen_choose', stage: 'A', audio: 'My sister watches videos every day.', options: ['My sister watches videos every day.', 'My sister watch videos every day.', 'My sisters watch videos every day.'], answer: 'My sister watches videos every day.', errorTag: 'THIRD_PERSON_S' },
            tpsItem('tps_p05'),
            {
              id: 'la_s_sort', type: 'sort', stage: 'A', errorTag: 'THIRD_PERSON_S',
              buckets: [{ id: 's', label: 'verb + S' }, { id: 'no', label: 'verb (no S)' }],
              cards: [{ text: 'my mom', bucket: 's' }, { text: 'they', bucket: 'no' }, { text: 'Omar', bucket: 's' }, { text: 'we', bucket: 'no' }, { text: 'my friends', bucket: 'no' }, { text: 'my phone', bucket: 's' }],
            },
          ],
        },
        {
          type: 'practice', title: L('תרגול S · סבב 2', 'Практика S · раунд 2', 'تمرين S · جولة 2', 'S practice · round 2'),
          items: [
            tpsItem('tps_p06'), tpsItem('tps_p07'),
            { id: 'la_s_chat', type: 'text_gaps', stage: 'B', target: { structure: 'ps' }, chat: [
              { from: 'Maya', text: 'My brother ___ videos every day.', base: 'watch', answer: 'watches' },
              { from: 'me', text: 'My sister ___ books after school.', base: 'read', answer: 'reads' },
              { from: 'Maya', text: 'I ___ my mom every day.', base: 'call', answer: 'call' },
            ] },
            tpsItem('tps_p08'), tpsItem('tps_p09'), tpsItem('tps_h01'), tpsItem('tps_h02'), tpsItem('tps_x01'),
          ],
        },
        { type: 'produce', items: [tps.produce[0], tps.produce[2]] },
      ],
    },
    { id: 'pause1', title: L('הפסקה', 'Перерыв', 'استراحة', 'Break'), steps: [{ type: 'pause' }] },

    // ───────────── PART 2 · am / is / are ─────────────
    {
      id: 'be', skill: 'am_is_are',
      title: L('חלק 2 · am / is / are', 'Часть 2 · am / is / are', 'جزء 2 · am / is / are', 'Part 2 · am / is / are'),
      steps: [
        {
          type: 'guess', guess: [{
            id: 'la_b_g1', show: ['I am Dana.', 'She is my sister.', 'They are my friends.'], highlight: ['am', 'is', 'are'],
            question: L('נחשו: איזו מילה באה אחרי They?', 'Угадай: какое слово идёт после They?', 'خمّن: أيّ كلمة بتيجي بعد They؟', 'Guess: which word comes after They?'),
            options: [{ id: 'am', label: L('am', 'am', 'am', 'am'), en: true }, { id: 'is', label: L('is', 'is', 'is', 'is'), en: true }, { id: 'are', label: L('are', 'are', 'are', 'are'), en: true }],
            answer: 'are',
            reveal: L('They ← are. לכל נושא יש "מילת דבק" משלו.', 'They → are. У каждого подлежащего своё «слово-клей».', 'They ← are. لكل فاعل "كلمة لزق" إلها.', 'They → are. Every subject has its own "glue word".'),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('am / is / are = מילות דבק. לכל נושא — הדבק שלו.', 'am / is / are — «слова-клей». У каждого подлежащего — своё.', 'am / is / are = كلمات لزق. لكل فاعل — اللزق تبعه.', 'am / is / are = glue words. Each subject has its own.'),
            table: [{ left: 'I', right: ['am'] }, { left: 'he / she / it', right: ['is'] }, { left: 'you / we / they', right: ['are'] }],
            notes: [{
              text: L('בעברית אומרים "היא אחותי" בלי מילה באמצע. באנגלית חייבים מילת דבק!', 'По-русски говорим «Она моя сестра» без слова посередине. По-английски «клей» обязателен!', 'بالعربي منحكي "هي أختي" بدون كلمة بالنص. بالإنجليزي لازم كلمة لزق!', 'Some languages say "She my sister". English needs the glue word!'),
              examples: ['She is my sister.', 'We are friends.'],
            }],
          },
        },
        { type: 'examples', examples: [
          { en: 'I am Noa.', highlight: 'am', mark: false, tr: L('אני נועה.', 'Я Ноа.', 'أنا نوعا.', '') },
          { en: 'He is my brother.', highlight: 'is', mark: false, tr: L('הוא אח שלי.', 'Он мой брат.', 'هو أخوي.', '') },
          { en: 'We are friends.', highlight: 'are', mark: false, tr: L('אנחנו חברים.', 'Мы друзья.', 'إحنا صحاب.', '') },
          { en: 'It is my phone.', highlight: 'is', mark: false, tr: L('זה הטלפון שלי.', 'Это мой телефон.', 'هاد التلفون تبعي.', '') },
        ] },
        {
          type: 'practice', title: L('תרגול am / is / are', 'Практика am / is / are', 'تمرين am / is / are', 'am / is / are practice'),
          items: [
            { id: 'la_b1', type: 'multiple_choice', stage: 'A', frame: 'She ___ my sister.', options: ['am', 'is', 'are'], answer: 'is', target: BE, showRule: true, ruleKey: 'be' },
            { id: 'la_b2', type: 'multiple_choice', stage: 'A', frame: 'They ___ my friends.', options: ['am', 'is', 'are'], answer: 'are', target: BE, showRule: true, ruleKey: 'be' },
            { id: 'la_b_match', type: 'match', stage: 'A', errorTag: 'AM_IS_ARE', pairs: [{ left: 'I', right: 'am' }, { left: 'My mom', right: 'is' }, { left: 'We', right: 'are' }, { left: 'My phone', right: 'is' }, { left: 'You', right: 'are' }] },
            { id: 'la_b3', type: 'multiple_choice', stage: 'A', frame: 'I ___ Omar.', options: ['am', 'is', 'are'], answer: 'am', target: BE },
            { id: 'la_b_pf', type: 'pair_fill', stage: 'B', verb: 'am / is / are', frames: ['I ___ at home.', 'My brother ___ at home.', 'My friends ___ at home.'], answers: ['am', 'is', 'are'], target: BE },
            sent('la_b_s1', L('היא אחותי.', 'Она моя сестра.', 'هي أختي.', 'she · my sister'), ['She is my sister.', "She's my sister."], ['She', 'is', 'my sister'], BE, { frame: 'She ___ my sister.', options: ['am', 'is', 'are'], answer: 'is' }, { rule: 'be', wrong: 'She are my sister.' }),
            sent('la_b_s2', L('אנחנו חברים.', 'Мы друзья.', 'إحنا صحاب.', 'we · friends'), ['We are friends.', "We're friends."], ['We', 'are', 'friends'], BE, { frame: 'We ___ friends.', options: ['am', 'is', 'are'], answer: 'are' }, { rule: 'be' }),
            sent('la_b_s3', L('הטלפון שלי בבית.', 'Мой телефон дома.', 'التلفون تبعي بالدار.', 'my phone · at home'), ['My phone is at home.'], ['My phone', 'is', 'at home'], BE, { frame: 'My phone ___ at home.', options: ['am', 'is', 'are'], answer: 'is' }, { rule: 'be', wrong: 'My phone are at home.' }),
            { id: 'la_b_e1', type: 'error_correction', stage: 'E', wrong: 'They is my friends.', acceptedAnswers: ['They are my friends.'], target: BE },
          ],
        },
      ],
    },

    // ───────────── PART 3 · verb + ing ─────────────
    {
      id: 'ing', skill: 'verb_ing',
      title: L('חלק 3 · פועל + ing', 'Часть 3 · глагол + ing', 'جزء 3 · فعل + ing', 'Part 3 · verb + ing'),
      steps: [
        {
          type: 'guess', guess: [{
            id: 'la_i_g1', show: ['play → playing', 'use → using', 'chat → chatting'], highlight: ['playing', 'using', 'chatting'],
            question: L('נחשו: מה קרה ל-e במילה use?', 'Угадай: что случилось с e в слове use?', 'خمّن: شو صار للـ e بكلمة use؟', 'Guess: what happened to the e in use?'),
            options: [
              { id: 'gone', label: L('היא נעלמה', 'Она исчезла', 'اختفت', 'It disappeared') },
              { id: 'stay', label: L('היא נשארה', 'Она осталась', 'ضلّت', 'It stayed') },
              { id: 'two', label: L('נוספה עוד e', 'Добавилась ещё одна e', 'انضافت e كمان', 'Another e was added') },
            ],
            answer: 'gone',
            reveal: L('use ← using: ה-e נעלמת. ו-chat ← chatting: ה-t מוכפלת.', 'use → using: e исчезает. chat → chatting: t удваивается.', 'use ← using: الـ e بتختفي. و chat ← chatting: الـ t بتتضاعف.', 'use → using: the e goes. chat → chatting: the t doubles.'),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('מוסיפים ing לפועל. יש שני מקרים מיוחדים.', 'Добавляем ing к глаголу. Есть два особых случая.', 'منزيد ing عالفعل. في حالتين خاصّين.', 'Add -ing to the verb. There are two special cases.'),
            table: [
              { left: '+ ing', right: ['playing', 'reading', 'watching'], mark: 'ing' },
              { left: 'e → ing', right: ['using', 'writing', 'sharing'], mark: 'ing' },
              { left: 'tt → ing', right: ['chatting'], mark: 'ting' },
            ],
            notes: [],
          },
        },
        {
          type: 'practice', title: L('תרגול ing', 'Практика ing', 'تمرين ing', '-ing practice'),
          items: [
            { id: 'la_i1', type: 'multiple_choice', stage: 'A', frame: 'use → ___', options: ['useing', 'using'], answer: 'using', target: ING },
            { id: 'la_i2', type: 'multiple_choice', stage: 'A', frame: 'chat → ___', options: ['chating', 'chatting'], answer: 'chatting', target: ING },
            {
              id: 'la_i_sort', type: 'sort', stage: 'A', errorTag: 'ING_FORM',
              buckets: [{ id: 'ing', label: '+ ing' }, { id: 'e', label: 'e → ing' }, { id: 'dbl', label: 'tt → ing' }],
              cards: [{ text: 'play', bucket: 'ing' }, { text: 'use', bucket: 'e' }, { text: 'chat', bucket: 'dbl' }, { text: 'read', bucket: 'ing' }, { text: 'write', bucket: 'e' }, { text: 'call', bucket: 'ing' }, { text: 'share', bucket: 'e' }, { text: 'watch', bucket: 'ing' }],
            },
            { id: 'la_i3', type: 'fill_blank', stage: 'B', frame: 'share → ___', answer: 'sharing', target: ING },
            { id: 'la_i4', type: 'fill_blank', stage: 'B', frame: 'write → ___', answer: 'writing', target: ING },
            { id: 'la_i5', type: 'fill_blank', stage: 'B', frame: 'watch → ___', answer: 'watching', target: ING },
            { id: 'la_i6', type: 'fill_blank', stage: 'B', frame: 'take → ___', answer: 'taking', target: ING },
            { id: 'la_i7', type: 'multiple_choice', stage: 'A', frame: 'message → ___', options: ['messageing', 'messaging'], answer: 'messaging', target: ING },
          ],
        },
      ],
    },
    { id: 'pause2', title: L('הפסקה', 'Перерыв', 'استراحة', 'Break'), steps: [{ type: 'pause' }] },

    // ───────────── PART 4 · Present Progressive ─────────────
    {
      id: 'pp', skill: 'pp_statements', requiredSkills: ['am_is_are', 'verb_ing'],
      title: L('חלק 4 · מה קורה עכשיו?', 'Часть 4 · Что происходит сейчас?', 'جزء 4 · شو عم بصير هلّأ؟', 'Part 4 · What is happening now?'),
      steps: [
        { type: 'words', words: ['now', 'right_now', 'at_the_moment', 'today'] },
        {
          type: 'guess', guess: [{
            id: 'la_p_g1', picture: '👧📱⚡',
            show: ['Maya is using her phone now.', 'Maya uses her phone every day.'], highlight: ['is using', 'uses'],
            question: L('נחשו: איזה משפט מתאר מה שקורה ממש עכשיו?', 'Угадай: какое предложение про то, что происходит прямо сейчас?', 'خمّن: أيّ جملة بتحكي عن اللي عم بصير هلّأ؟', 'Guess: which sentence is about right now?'),
            options: [{ id: 'now', label: L('Maya is using her phone now.', 'Maya is using her phone now.', 'Maya is using her phone now.', 'Maya is using her phone now.'), en: true }, { id: 'habit', label: L('Maya uses her phone every day.', 'Maya uses her phone every day.', 'Maya uses her phone every day.', 'Maya uses her phone every day.'), en: true }],
            answer: 'now',
            reveal: L('עכשיו ← is using. am / is / are + ing = קורה עכשיו.', 'Сейчас → is using. am / is / are + ing = происходит сейчас.', 'هلّأ ← is using. am / is / are + ing = عم بصير هلّأ.', 'Now → is using. am / is / are + -ing = happening now.'),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('קורה עכשיו? נושא + am / is / are + פועל-ing', 'Происходит сейчас? Подлежащее + am / is / are + глагол-ing', 'عم بصير هلّأ؟ فاعل + am / is / are + فعل-ing', 'Happening now? Subject + am / is / are + verb-ing'),
            formula: [{ text: 'Subject' }, { text: '+' }, { text: 'am / is / are', key: true }, { text: '+' }, { text: 'verb-ing', key: true }],
            table: [{ left: 'I', right: ['am using'] }, { left: 'he / she / it', right: ['is using'] }, { left: 'you / we / they', right: ['are using'] }],
            notes: [{ text: L('מילים של "עכשיו": now · right now · at the moment · Look!', 'Слова «сейчас»: now · right now · at the moment · Look!', 'كلمات "هلّأ": now · right now · at the moment · Look!', 'Now words: now · right now · at the moment · Look!'), examples: ['Look! He is calling his mom.'] }],
          },
        },
        { type: 'examples', examples: [
          { en: 'I am watching a video now.', highlight: 'am watching', mark: false, tr: L('אני צופה בסרטון עכשיו.', 'Я сейчас смотрю видео.', 'أنا بحضر فيديو هلّأ.', '') },
          { en: 'My sister is reading the news right now.', highlight: 'is reading', mark: false, tr: L('אחותי קוראת חדשות ממש עכשיו.', 'Моя сестра прямо сейчас читает новости.', 'أختي بتقرا الأخبار هلّأ بالزبط.', '') },
          { en: 'They are chatting at the moment.', highlight: 'are chatting', mark: false, tr: L('הם מצ׳טטים כרגע.', 'Они сейчас переписываются.', 'همّ بشاتوا بهاي اللحظة.', '') },
          { en: 'Look! Omar is calling his dad.', highlight: 'is calling', mark: false, tr: L('תסתכלו! עומר מתקשר לאבא שלו.', 'Смотри! Омар звонит своему папе.', 'اطّلع! عمر بتّصل بأبوه.', '') },
        ] },
        {
          type: 'check', items: [
            { id: 'la_pc1', type: 'multiple_choice', stage: 'A', frame: 'She ___ her phone now.', options: ['is using', 'using', 'uses'], answer: 'is using', target: PP },
            { id: 'la_pc2', type: 'multiple_choice', stage: 'A', frame: 'I ___ a video right now.', options: ['am watching', 'is watching', 'watching'], answer: 'am watching', target: PP },
            { id: 'la_pc3', type: 'multiple_choice', stage: 'A', frame: 'They ___ at the moment.', options: ['is chatting', 'are chatting', 'are chat'], answer: 'are chatting', target: PP },
          ],
        },
        {
          type: 'practice', title: L('תרגול "עכשיו" · סבב 1', 'Практика «сейчас» · раунд 1', 'تمرين "هلّأ" · جولة 1', '"Now" practice · round 1'),
          items: [
            sent('la_p1', L('היא משתמשת בטלפון שלה עכשיו.', 'Она сейчас пользуется своим телефоном.', 'هي هلّأ بتستعمل التلفون تبعها.', 'now → she · use · her phone'), ['She is using her phone now.', "She's using her phone now.", 'Now she is using her phone.'], ['She', 'is using', 'her phone', 'now'], { ...PP, verb: 'use' }, { frame: 'She ___ her phone now.', options: ['is using', 'uses', 'using'], answer: 'is using', base: 'use' }, { rule: 'pp', wrong: 'She using her phone now.' }),
            sent('la_p2', L('אני צופה בסרטון עכשיו.', 'Я сейчас смотрю видео.', 'أنا بحضر فيديو هلّأ.', 'now → I · watch · a video'), ['I am watching a video now.', "I'm watching a video now."], ['I', 'am watching', 'a video', 'now'], { ...PP, verb: 'watch' }, { frame: 'I ___ a video now.', options: ['am watching', 'is watching', 'watch'], answer: 'am watching', base: 'watch' }, { rule: 'pp' }),
            sent('la_p3', L('אחי מתקשר לחבר שלו ממש עכשיו.', 'Мой брат прямо сейчас звонит своему другу.', 'أخوي بتّصل بصاحبه هلّأ بالزبط.', 'right now → my brother · call · his friend'), ['My brother is calling his friend right now.', 'Right now my brother is calling his friend.'], ['My brother', 'is calling', 'his friend', 'right now'], { ...PP, verb: 'call' }, { frame: 'My brother ___ his friend right now.', options: ['is calling', 'are calling', 'calls'], answer: 'is calling', base: 'call' }, { rule: 'pp', subjectHint: 'my brother = he', wrong: 'My brother are calling his friend right now.' }),
            { id: 'la_p_pf', type: 'pair_fill', stage: 'B', verb: 'watch', frames: ['I ___ a video now.', 'My sister ___ a video now.', 'My friends ___ a video now.'], answers: ['am watching', 'is watching', 'are watching'], target: PP },
            sent('la_p4', L('אנחנו מצ׳טטים כרגע.', 'Мы сейчас переписываемся.', 'إحنا بنشات بهاي اللحظة.', 'at the moment → we · chat'), ['We are chatting at the moment.', "We're chatting at the moment."], ['We', 'are chatting', 'at the moment'], { ...PP, verb: 'chat' }, { frame: 'We ___ at the moment.', options: ['are chatting', 'are chating', 'is chatting'], answer: 'are chatting', base: 'chat' }, { rule: 'pp' }),
            { id: 'la_p_l1', type: 'listen_choose', stage: 'A', audio: 'He is sharing a video now.', options: ['He is sharing a video now.', 'He shares videos every day.', 'We are sharing a video now.'], answer: 'He is sharing a video now.', errorTag: 'TENSE_SELECTION' },
            sent('la_p5', L('אמא שלי קוראת חדשות עכשיו.', 'Моя мама сейчас читает новости.', 'إمّي بتقرا الأخبار هلّأ.', 'now → my mom · read · the news'), ['My mom is reading the news now.', 'My mom is reading news now.', 'My mother is reading the news now.'], ['My mom', 'is reading', 'the news', 'now'], { ...PP, verb: 'read' }, { frame: 'My mom ___ the news now.', options: ['is reading', 'reads', 'is read'], answer: 'is reading', base: 'read' }, { rule: 'pp', subjectHint: 'my mom = she' }),
            sent('la_p6', L('הם כותבים הודעות עכשיו.', 'Они сейчас пишут сообщения.', 'همّ بكتبوا مسجات هلّأ.', 'now → they · write · messages'), ['They are writing messages now.'], ['They', 'are writing', 'messages', 'now'], { ...PP, verb: 'write' }, { frame: 'They ___ messages now.', options: ['are writing', 'are writeing', 'is writing'], answer: 'are writing', base: 'write' }, { rule: 'pp' }),
          ],
        },
        {
          type: 'practice', title: L('תרגול "עכשיו" · סבב 2', 'Практика «сейчас» · раунд 2', 'تمرين "هلّأ" · جولة 2', '"Now" practice · round 2'),
          items: [
            sent('la_p7', L('עומר מפרסם סרטון כרגע.', 'Омар сейчас публикует видео.', 'عمر بنشر فيديو بهاي اللحظة.', 'at the moment → Omar · post · a video'), ['Omar is posting a video at the moment.'], ['Omar', 'is posting', 'a video', 'at the moment'], { ...PP, verb: 'post' }, { frame: 'Omar ___ a video at the moment.', options: ['is posting', 'posts', 'are posting'], answer: 'is posting', base: 'post' }, { rule: 'pp', subjectHint: 'Omar = he' }),
            { id: 'la_p_e1', type: 'error_correction', stage: 'E', wrong: 'She using her phone now.', acceptedAnswers: ['She is using her phone now.', "She's using her phone now."], target: PP },
            sent('la_p8', L('אני מקשיב/ה למוזיקה עכשיו.', 'Я сейчас слушаю музыку.', 'أنا بسمع موسيقى هلّأ.', 'now → I · listen to · music'), ['I am listening to music now.', "I'm listening to music now."], ['I', 'am listening', 'to music', 'now'], { ...PP, verb: 'listen' }, { frame: 'I ___ to music now.', options: ['am listening', 'listening', 'is listening'], answer: 'am listening', base: 'listen' }, { rule: 'pp' }),
            { id: 'la_p_chat', type: 'text_gaps', stage: 'B', target: PP, chat: [
              { from: 'Maya', text: 'Hi! I ___ the news now.', base: 'read', answer: 'am reading' },
              { from: 'me', text: 'I ___ a video right now.', base: 'watch', answer: 'am watching' },
              { from: 'me', text: 'My brother ___ a game.', base: 'play', answer: 'is playing' },
            ] },
            sent('la_p9', L('דנה ומאיה משחקות במשחק ממש עכשיו.', 'Дана и Майя прямо сейчас играют в игру.', 'دانا ومايا بلعبوا لعبة هلّأ بالزبط.', 'right now → Dana and Maya · play · a game'), ['Dana and Maya are playing a game right now.', 'Right now Dana and Maya are playing a game.'], ['Dana and Maya', 'are playing', 'a game', 'right now'], { ...PP, verb: 'play' }, { frame: 'Dana and Maya ___ a game right now.', options: ['are playing', 'is playing', 'play'], answer: 'are playing', base: 'play' }, { rule: 'pp', wrong: 'Dana and Maya is playing a game right now.' }),
            { id: 'la_p_e2', type: 'error_correction', stage: 'E', wrong: 'They are play a game now.', acceptedAnswers: ['They are playing a game now.'], target: PP },
            sent('la_p10', L('אבא שלי מסתכל בטלפון שלו עכשיו.', 'Мой папа сейчас смотрит в свой телефон.', 'أبوي بطّلع عتلفونه هلّأ.', 'now → my dad · look at · his phone'), ['My dad is looking at his phone now.'], ['My dad', 'is looking', 'at his phone', 'now'], { ...PP, verb: 'look' }, { frame: 'My dad ___ at his phone now.', options: ['is looking', 'looks', 'is look'], answer: 'is looking', base: 'look' }, { rule: 'pp', subjectHint: 'my dad = he' }),
            {
              id: 'la_p_ws', type: 'wh_scaffold', stage: 'G',
              situation: { emoji: '👦 🏠 📱 ⚡', caption: 'Omar · at home · now' },
              instruction: L('מה עומר עושה עכשיו? ענו על השאלות, ואז כתבו משפט אחד.', 'Что Омар делает сейчас? Ответь на вопросы, потом напиши одно предложение.', 'شو عمر بعمل هلّأ؟ جاوب عالأسئلة، وبعدين اكتب جملة وحدة.', 'What is Omar doing now? Answer the questions, then write one sentence.'),
              fields: ['Who?', 'What is he doing?', 'Where?', 'When?'],
              target: { structure: 'pp', person: 'third', verbs: ['use'] },
              models: ['Omar is using his phone at home now.', 'Omar is watching a video at home now.'],
            },
          ],
        },
      ],
    },
    { id: 'pause3', title: L('הפסקה', 'Перерыв', 'استراحة', 'Break'), steps: [{ type: 'pause' }] },

    // ───────────── PART 5 · now or usually? ─────────────
    {
      id: 'vs', skill: 'ps_vs_pp', requiredSkills: ['third_person_s', 'pp_statements'],
      title: L('חלק 5 · עכשיו או בדרך כלל?', 'Часть 5 · Сейчас или обычно?', 'جزء 5 · هلّأ ولا عادةً؟', 'Part 5 · Now or usually?'),
      steps: [
        {
          type: 'guess', guess: [{
            id: 'la_v_g1', show: ['She reads the news every morning.', 'She is reading the news now.'], highlight: ['reads', 'is reading'],
            question: L('מה ההבדל בין המשפטים? נחשו!', 'Чем отличаются предложения? Угадай!', 'شو الفرق بين الجملتين؟ خمّن!', 'What is the difference? Guess!'),
            options: [
              { id: 'ok', label: L('הראשון = הרגל. השני = עכשיו.', 'Первое — привычка. Второе — сейчас.', 'الأولى = عادة. التانية = هلّأ.', 'First = habit. Second = now.') },
              { id: 'same', label: L('אין הבדל', 'Разницы нет', 'ما في فرق', 'No difference') },
              { id: 'rev', label: L('הראשון = עכשיו. השני = הרגל.', 'Первое — сейчас. Второе — привычка.', 'الأولى = هلّأ. التانية = عادة.', 'First = now. Second = habit.') },
            ],
            answer: 'ok',
            reveal: L('הרגל (every morning) ← reads. עכשיו (now) ← is reading.', 'Привычка (every morning) → reads. Сейчас (now) → is reading.', 'عادة (every morning) ← reads. هلّأ (now) ← is reading.', 'Habit (every morning) → reads. Now → is reading.'),
          }],
        },
        {
          type: 'learn', learn: {
            oneLine: L('בעברית "קוראת" היא צורה אחת. באנגלית יש שתיים!', 'По-русски «читает» — одна форма. В английском их две!', 'بالعربي "بتقرا" شكل واحد. بالإنجليزي في شكلين!', 'English has two forms for one idea — choose by meaning.'),
            table: [{ left: '⏰ every day · usually', right: ['reads', 'calls', 'uses'] }, { left: '⚡ now · right now', right: ['is reading', 'is calling', 'is using'] }],
            notes: [{ text: L('לא רק לחפש מילת סימן — שאלו: זה הרגל, או שזה קורה עכשיו?', 'Не только ищи слово-сигнал — спроси себя: это привычка или это происходит сейчас?', 'مش بس دوّر على كلمة إشارة — اسأل: هاي عادة، ولا عم بتصير هلّأ؟', 'Do not only look for a signal word — ask: is it a habit, or is it happening now?'), examples: ['📅 habit → reads', '⚡ now → is reading'] }],
          },
        },
        { type: 'examples', examples: [
          { en: 'I call my mom every day.', highlight: 'call', mark: false, tr: L('אני מתקשר/ת לאמא שלי כל יום.', 'Я звоню маме каждый день.', 'أنا بتّصل بإمّي كل يوم.', '') },
          { en: 'I am calling my mom now.', highlight: 'am calling', mark: false, tr: L('אני מתקשר/ת לאמא שלי עכשיו.', 'Я сейчас звоню маме.', 'أنا بتّصل بإمّي هلّأ.', '') },
          { en: 'My brother plays games on weekends.', highlight: 'plays', tr: L('אחי משחק במשחקים בסופי שבוע.', 'Мой брат играет в игры по выходным.', 'أخوي بلعب ألعاب بالويكند.', '') },
          { en: 'My brother is playing a game right now.', highlight: 'is playing', mark: false, tr: L('אחי משחק במשחק ממש עכשיו.', 'Мой брат прямо сейчас играет в игру.', 'أخوي بلعب لعبة هلّأ بالزبط.', '') },
        ] },
        {
          type: 'practice', title: L('עכשיו או בדרך כלל? · סבב 1', 'Сейчас или обычно? · раунд 1', 'هلّأ ولا عادةً؟ · جولة 1', 'Now or usually? · round 1'),
          items: [
            {
              id: 'la_v_sort', type: 'sort', stage: 'A', errorTag: 'TENSE_SELECTION',
              buckets: [{ id: 'habit', label: L('⏰ בדרך כלל', '⏰ обычно', '⏰ عادةً', '⏰ usually') }, { id: 'now', label: L('⚡ עכשיו', '⚡ сейчас', '⚡ هلّأ', '⚡ now') }],
              cards: [
                { text: 'She reads the news every morning.', bucket: 'habit' }, { text: 'She is reading the news.', bucket: 'now' },
                { text: 'We chat after school.', bucket: 'habit' }, { text: 'We are chatting.', bucket: 'now' },
                { text: 'He calls his dad.', bucket: 'habit' }, { text: 'He is calling his dad.', bucket: 'now' },
              ],
            },
            { id: 'la_v_m1', type: 'multiple_choice', stage: 'A', frame: 'My sister ___ the news every morning.', options: ['reads', 'is reading'], answer: 'reads', target: { person: 'third', verb: 'read', form: 'reads' } },
            { id: 'la_v_m2', type: 'multiple_choice', stage: 'A', frame: 'Right now my brother ___ a game.', options: ['plays', 'is playing'], answer: 'is playing', target: PP },
            sent('la_v1', L('אני משתמש/ת בטלפון שלי כל יום.', 'Я пользуюсь своим телефоном каждый день.', 'أنا بستعمل التلفون تبعي كل يوم.', 'every day → I · use · my phone'), ['I use my phone every day.', 'Every day I use my phone.'], ['I', 'use', 'my phone', 'every day'], { person: 'first', verb: 'use', form: 'use' }, { frame: 'I ___ my phone every day.', options: ['use', 'am using'], answer: 'use', base: 'use' }, { rule: 'now_vs_habit', wrong: 'I am using my phone every day.' }),
            sent('la_v2', L('אני משתמש/ת בטלפון שלי עכשיו.', 'Я сейчас пользуюсь своим телефоном.', 'أنا بستعمل التلفون تبعي هلّأ.', 'now → I · use · my phone'), ['I am using my phone now.', "I'm using my phone now."], ['I', 'am using', 'my phone', 'now'], { ...PP, verb: 'use' }, { frame: 'I ___ my phone now.', options: ['am using', 'use'], answer: 'am using', base: 'use' }, { rule: 'now_vs_habit' }),
            { id: 'la_v_pf', type: 'pair_fill', stage: 'B', verb: 'chat', frames: ['We ___ every day.', 'We ___ right now.'], answers: ['chat', 'are chatting'], targets: [{ structure: 'ps', person: 'plural', verb: 'chat', form: 'chat' }, PP] },
            {
              id: 'la_v_tm1', type: 'translate_multi', stage: 'E',
              parts: [
                { prompt: L('אחותי קוראת חדשות כל יום.', 'Моя сестра читает новости каждый день.', 'أختي بتقرا الأخبار كل يوم.', 'every day → my sister · read · the news'), acceptedAnswers: ['My sister reads the news every day.', 'My sister reads news every day.'], target: { person: 'third', verb: 'read', form: 'reads' } },
                { prompt: L('אחותי קוראת חדשות עכשיו.', 'Моя сестра сейчас читает новости.', 'أختي بتقرا الأخبار هلّأ.', 'now → my sister · read · the news'), acceptedAnswers: ['My sister is reading the news now.', 'My sister is reading news now.'], target: PP },
              ],
            },
          ],
        },
        {
          type: 'practice', title: L('עכשיו או בדרך כלל? · סבב 2', 'Сейчас или обычно? · раунд 2', 'هلّأ ولا عادةً؟ · جولة 2', 'Now or usually? · round 2'),
          items: [
            sent('la_v3', L('אבא שלי צופה בטלוויזיה בלילה.', 'Мой папа смотрит телевизор ночью.', 'أبوي بحضر تلفزيون بالليل.', 'at night (habit) → my dad · watch · TV'), ['My dad watches TV at night.', 'At night my dad watches TV.'], ['My dad', 'watches', 'TV', 'at night'], { person: 'third', verb: 'watch', form: 'watches' }, { frame: 'My dad ___ TV at night.', options: ['watches', 'is watching'], answer: 'watches', base: 'watch' }, { rule: 'now_vs_habit' }),
            sent('la_v4', L('אבא שלי צופה בטלוויזיה עכשיו.', 'Мой папа сейчас смотрит телевизор.', 'أبوي بحضر تلفزيون هلّأ.', 'now → my dad · watch · TV'), ['My dad is watching TV now.'], ['My dad', 'is watching', 'TV', 'now'], { ...PP, verb: 'watch' }, { frame: 'My dad ___ TV now.', options: ['is watching', 'watches'], answer: 'is watching', base: 'watch' }, { rule: 'now_vs_habit' }),
            { id: 'la_v_chat', type: 'text_gaps', stage: 'B', chat: [
              { from: 'Maya', text: 'I usually ___ books at night.', base: 'read', answer: 'read' },
              { from: 'Maya', text: 'But right now I ___ a video!', base: 'watch', answer: 'am watching' },
              { from: 'me', text: 'My sister ___ videos every day.', base: 'watch', answer: 'watches' },
            ], targets: [{ structure: 'ps', person: 'first', verb: 'read', form: 'read' }, PP, { structure: 'ps', person: 'third', verb: 'watch', form: 'watches' }] },
            sent('la_v5', L('הם בדרך כלל מצ׳טטים אחרי בית הספר.', 'Они обычно переписываются после школы.', 'همّ عادةً بشاتوا بعد المدرسة.', 'usually → they · chat · after school'), ['They usually chat after school.', 'They chat after school.'], ['They', 'usually', 'chat', 'after school'], { person: 'plural', verb: 'chat', form: 'chat' }, { frame: 'They usually ___ after school.', options: ['chat', 'are chatting'], answer: 'chat', base: 'chat' }, { rule: 'now_vs_habit' }),
            sent('la_v6', L('הם מצ׳טטים כרגע.', 'Они сейчас переписываются.', 'همّ بشاتوا بهاي اللحظة.', 'at the moment → they · chat'), ['They are chatting at the moment.', "They're chatting at the moment."], ['They', 'are chatting', 'at the moment'], { ...PP, verb: 'chat' }, { frame: 'They ___ at the moment.', options: ['are chatting', 'chat'], answer: 'are chatting', base: 'chat' }, { rule: 'now_vs_habit' }),
            { id: 'la_v_e1', type: 'error_correction', stage: 'E', wrong: 'I am using my phone every day.', acceptedAnswers: ['I use my phone every day.'], target: { person: 'first', verb: 'use', form: 'use' } },
            { id: 'la_v_l1', type: 'listen_choose', stage: 'A', audio: 'My brother is calling his friend now.', options: ['My brother is calling his friend now.', 'My brother calls his friend every day.', 'My brothers are calling their friend now.'], answer: 'My brother is calling his friend now.', errorTag: 'TENSE_SELECTION' },
          ],
        },
      ],
    },

    // ───────────── END · write + exit ticket ─────────────
    {
      id: 'end', skill: 'ps_vs_pp', requiredSkills: ['third_person_s', 'pp_statements'],
      title: L('סיום · כותבים לבד', 'Финал · пишу сам(а)', 'الختام · بكتب لحالي', 'Finish · write on your own'),
      steps: [
        {
          type: 'produce', items: [
            { id: 'la_w_habit', type: 'free_production', stage: 'F', grammarSkill: 'third_person_s',
              instruction: L('מה את/ה עושה בדרך כלל עם הטלפון? כתבו משפט אחד עם usually או every day.', 'Что ты обычно делаешь с телефоном? Напиши одно предложение с usually или every day.', 'شو بتعمل عادةً بالتلفون؟ اكتب جملة وحدة مع usually أو every day.', 'What do you usually do with your phone? Write one sentence with usually or every day.'),
              target: { person: 'first', verbs: ['use', 'call', 'message', 'read', 'watch'] }, starter: 'I usually …', models: ['I usually watch videos at night.', 'I message my friends every day.'] },
            { id: 'la_w_now', type: 'free_production', stage: 'F', grammarSkill: 'pp_statements',
              instruction: L('ומה את/ה עושה ממש עכשיו? כתבו משפט אחד עם now.', 'А что ты делаешь прямо сейчас? Напиши одно предложение с now.', 'وشو بتعمل هلّأ بالزبط؟ اكتب جملة وحدة مع now.', 'And what are you doing right now? Write one sentence with now.'),
              target: { structure: 'pp', person: 'first', verbs: ['use', 'write', 'read'] }, starter: 'Right now I am …', models: ['Right now I am writing in English.', 'I am using my phone now.'] },
            { id: 'la_w_pic', type: 'wh_scaffold', stage: 'G', grammarSkill: 'pp_statements',
              situation: { emoji: '👧 🏠 💬 ⚡', caption: 'Maya · at home · now' },
              instruction: L('מה מאיה עושה עכשיו? ענו על השאלות, ואז כתבו משפט אחד.', 'Что Майя делает сейчас? Ответь на вопросы, потом напиши одно предложение.', 'شو مايا بتعمل هلّأ؟ جاوب عالأسئلة، وبعدين اكتب جملة وحدة.', 'What is Maya doing now? Answer the questions, then write one sentence.'),
              fields: ['Who?', 'What is she doing?', 'Where?', 'When?'],
              target: { structure: 'pp', person: 'third', verbs: ['chat'] }, models: ['Maya is chatting with her friends at home now.'] },
          ],
        },
        {
          type: 'exit', items: [
            { id: 'la_x1', type: 'translate', stage: 'E', grammarSkill: 'third_person_s', prompt: L('אחי משתמש בטלפון שלו כל יום.', 'Мой брат пользуется своим телефоном каждый день.', 'أخوي بستعمل تلفونه كل يوم.', 'every day → my brother · use · his phone'), acceptedAnswers: ['My brother uses his phone every day.', 'Every day my brother uses his phone.'], target: { person: 'third', verb: 'use', form: 'uses' } },
            { id: 'la_x2', type: 'translate', stage: 'E', grammarSkill: 'pp_statements', prompt: L('הם צופים בסרטון עכשיו.', 'Они сейчас смотрят видео.', 'همّ بحضروا فيديو هلّأ.', 'now → they · watch · a video'), acceptedAnswers: ['They are watching a video now.', "They're watching a video now."], target: { ...PP, verb: 'watch' } },
            { id: 'la_x3', type: 'translate', stage: 'E', grammarSkill: 'ps_vs_pp', prompt: L('אני קורא/ת חדשות כל בוקר.', 'Я читаю новости каждое утро.', 'أنا بقرا الأخبار كل صبح.', 'every morning → I · read · the news'), acceptedAnswers: ['I read the news every morning.', 'I read news every morning.'], target: { person: 'first', verb: 'read', form: 'read' } },
            { id: 'la_x4', type: 'translate', stage: 'E', grammarSkill: 'ps_vs_pp', prompt: L('אני קורא/ת חדשות עכשיו.', 'Я сейчас читаю новости.', 'أنا بقرا الأخبار هلّأ.', 'now → I · read · the news'), acceptedAnswers: ['I am reading the news now.', "I'm reading the news now.", 'I am reading news now.'], target: { ...PP, verb: 'read' } },
          ],
        },
        {
          type: 'challenge', items: [
            { id: 'la_c1', type: 'error_correction', stage: 'E', grammarSkill: 'pp_statements', wrong: 'My friends is chatting now.', acceptedAnswers: ['My friends are chatting now.'], target: PP },
            { id: 'la_c2', type: 'translate_multi', stage: 'E', grammarSkill: 'ps_vs_pp', parts: [
              { prompt: L('עומר בדרך כלל מתקשר לאמא שלו אחרי בית הספר.', 'Омар обычно звонит маме после школы.', 'عمر عادةً بتّصل بإمّه بعد المدرسة.', 'usually → Omar · call · his mom · after school'), acceptedAnswers: ['Omar usually calls his mom after school.'], target: { person: 'third', verb: 'call', form: 'calls' } },
              { prompt: L('אבל עכשיו הוא משחק במשחק.', 'Но сейчас он играет в игру.', 'بس هلّأ هو بلعب لعبة.', 'but now → he · play · a game'), acceptedAnswers: ['But now he is playing a game.', 'Now he is playing a game.', 'But he is playing a game now.'], target: { ...PP, verb: 'play' } },
            ] },
            { id: 'la_c3', type: 'transform', stage: 'E', grammarSkill: 'ps_vs_pp', source: 'Dana reads books after school.', instruction: L('כתבו את המשפט כך שיקרה עכשיו (now).', 'Перепиши предложение так, чтобы это происходило сейчас (now).', 'اكتب الجملة كإنها عم بتصير هلّأ (now).', 'Rewrite the sentence so it happens now.'), acceptedAnswers: ['Dana is reading a book now.', 'Dana is reading books now.', 'Now Dana is reading a book.'], target: PP },
          ],
        },
      ],
    },
  ],

  // Short repair rounds (3 items) — offered automatically when the same error repeats
  remediation: {
    THIRD_PERSON_S: tps.remediation.THIRD_PERSON_S.map((it) => ({ ...it, grammarSkill: 'third_person_s' })),
    SPELLING: tps.remediation.SPELLING.map((it) => ({ ...it, grammarSkill: 'third_person_s' })),
    WORD_ORDER: tps.remediation.WORD_ORDER.map((it) => ({ ...it, grammarSkill: 'third_person_s' })),
    AM_IS_ARE: [
      { id: 'la_rb1', type: 'multiple_choice', grammarSkill: 'am_is_are', stage: 'A', frame: 'I ___ at home.', options: ['am', 'is', 'are'], answer: 'am', target: BE, showRule: true, ruleKey: 'be' },
      { id: 'la_rb2', type: 'multiple_choice', grammarSkill: 'am_is_are', stage: 'A', frame: 'They ___ my friends.', options: ['am', 'is', 'are'], answer: 'are', target: BE, showRule: true, ruleKey: 'be' },
      { id: 'la_rb3', type: 'multiple_choice', grammarSkill: 'am_is_are', stage: 'A', frame: 'My sister ___ using her phone.', options: ['am', 'is', 'are'], answer: 'is', target: PP, showRule: true, ruleKey: 'be' },
    ],
    ING_FORM: [
      { id: 'la_ri1', type: 'multiple_choice', grammarSkill: 'verb_ing', stage: 'A', frame: 'use → ___', options: ['useing', 'using'], answer: 'using', target: ING, showRule: true, ruleKey: 'ing' },
      { id: 'la_ri2', type: 'multiple_choice', grammarSkill: 'verb_ing', stage: 'A', frame: 'chat → ___', options: ['chating', 'chatting'], answer: 'chatting', target: ING, showRule: true, ruleKey: 'ing' },
      { id: 'la_ri3', type: 'multiple_choice', grammarSkill: 'pp_statements', stage: 'A', frame: 'She is ___ her phone now.', options: ['use', 'using'], answer: 'using', target: PP, showRule: true, ruleKey: 'pp' },
    ],
    TENSE_SELECTION: [
      { id: 'la_rt1', type: 'multiple_choice', grammarSkill: 'ps_vs_pp', stage: 'A', frame: 'I ___ my phone every day.', options: ['use', 'am using'], answer: 'use', target: { person: 'first', verb: 'use', form: 'use' }, showRule: true, ruleKey: 'now_vs_habit' },
      { id: 'la_rt2', type: 'multiple_choice', grammarSkill: 'ps_vs_pp', stage: 'A', frame: 'Right now I ___ my phone.', options: ['use', 'am using'], answer: 'am using', target: PP, showRule: true, ruleKey: 'now_vs_habit' },
      { id: 'la_rt3', type: 'multiple_choice', grammarSkill: 'ps_vs_pp', stage: 'A', frame: 'My sister ___ the news every morning.', options: ['reads', 'is reading'], answer: 'reads', target: { person: 'third', verb: 'read', form: 'reads' }, showRule: true, ruleKey: 'now_vs_habit' },
    ],
  },
};
