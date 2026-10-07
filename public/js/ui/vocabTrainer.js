// "Words you need" — shown before every part of a lesson.
// 1) a dropdown list of the part's English words, each with 🔊 and "I don't know"
// 2) the words marked "I don't know" can be learned in 3 ways: flashcards · memory game · multiple choice
// Using any of this is help, never an error. Marked words are logged so the teacher can see them.

import { h, clear, speak, shuffle, en } from './dom.js';
import { t, L, getLang, dir } from '../i18n.js';
import { WORD_BY_ID } from '../content/index.js';

const meaningOf = (w, lang) => (lang === 'en' ? w.def || w.en : L(w.tr, lang));

/**
 * @param wordIds  word ids used in this part
 * @param opts     { onLog(type, data), onAllDone() }
 * @returns { el, marked: Set }
 */
export function renderVocabStep(wordIds, { onLog } = {}) {
  const lang = getLang();
  const words = wordIds.map((id) => WORD_BY_ID[id]).filter(Boolean);
  const marked = new Set();
  const root = h('div', {});
  const learnBox = h('div', {});

  function drawList() {
    clear(root);
    const rows = words.map((w) => {
      const btn = h('button', { class: `seg ${marked.has(w.id) ? 'on' : ''}`, type: 'button', 'aria-pressed': String(marked.has(w.id)), onclick: () => {
        if (marked.has(w.id)) marked.delete(w.id); else { marked.add(w.id); onLog?.('word_unknown', { word: w.id }); }
        btn.classList.toggle('on', marked.has(w.id)); btn.setAttribute('aria-pressed', String(marked.has(w.id)));
        drawLearn();
      } }, `❓ ${t('dont_know')}`);
      return h('li', { class: 'vw-row' },
        h('span', { class: 'vw-emoji', 'aria-hidden': 'true' }, w.emoji || '•'),
        h('button', { class: 'vw-word en', type: 'button', dir: 'ltr', lang: 'en', onclick: () => speak(w.en) }, w.en, ' ', h('span', { class: 'vw-speak', 'aria-hidden': 'true' }, '🔊')),
        btn);
    });
    const details = h('details', { class: 'vw-list', open: true },
      h('summary', {}, `📋 ${t('vocab_list', { n: words.length })}`),
      h('ul', {}, rows));
    root.append(details, learnBox);
    drawLearn();
  }

  function drawLearn() {
    clear(learnBox);
    if (!marked.size) return;
    const ws = words.filter((w) => marked.has(w.id));
    const mode = (icon, key, fn) => h('button', { class: 'mode-btn', type: 'button', onclick: () => { onLog?.('word_practice', { mode: key, words: ws.map((w) => w.id) }); fn(ws); } }, h('span', { class: 'mode-ic', 'aria-hidden': 'true' }, icon), t(`mode_${key}`));
    learnBox.append(h('div', { class: 'modes' },
      h('div', { class: 'section-label' }, t('learn_marked', { n: ws.length })),
      h('div', { class: 'mode-grid' }, mode('🃏', 'flash', flashcards), mode('🧠', 'memory', memory), mode('✅', 'quiz', quiz))));
  }

  function shell(title, body) {
    clear(root);
    root.append(h('div', { class: 'row', style: { justifyContent: 'space-between', marginBottom: '10px' } },
      h('b', {}, title), h('button', { class: 'btn small', type: 'button', onclick: drawList }, `📋 ${t('back_to_words')}`)), body);
  }
  function done(msg) {
    return h('div', { class: 'feedback success' }, h('div', { class: 'title' }, `✓ ${msg}`),
      h('button', { class: 'btn small', type: 'button', onclick: drawList }, `📋 ${t('back_to_words')}`));
  }

  // ---------- 1. flashcards ----------
  function flashcards(ws) {
    let deck = shuffle(ws, 'f' + ws.length);
    const area = h('div', {});
    shell(`🃏 ${t('mode_flash')}`, area);
    const show = () => {
      clear(area);
      if (!deck.length) return area.append(done(t('words_done')));
      const w = deck[0];
      let flipped = false;
      const back = h('div', { class: 'fc-back hidden', dir: lang === 'en' ? 'ltr' : dir(lang), lang }, meaningOf(w, lang));
      const card = h('button', { class: 'flashcard', type: 'button', 'aria-label': t('flip'), onclick: () => { flipped = !flipped; back.classList.toggle('hidden', !flipped); front.classList.toggle('dim', flipped); if (flipped) speak(w.en); } },
        h('span', { class: 'fc-emoji', 'aria-hidden': 'true' }, w.emoji || ''));
      const front = h('div', { class: 'fc-front en', dir: 'ltr', lang: 'en' }, w.en);
      card.append(front, back, h('span', { class: 'fc-hint small muted' }, `👆 ${t('flip')}`));
      area.append(h('div', { class: 'small muted', style: { textAlign: 'center' } }, `${ws.length - deck.length + 1}/${ws.length}`), card,
        h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '12px' } },
          h('button', { class: 'btn', type: 'button', onclick: () => speak(w.en) }, `🔊 ${t('listen')}`),
          h('button', { class: 'btn', type: 'button', onclick: () => { deck.push(deck.shift()); show(); } }, `↻ ${t('again')}`),
          h('button', { class: 'btn go', type: 'button', onclick: () => { deck.shift(); show(); } }, `${t('got_it')}`)));
      speak(w.en);
    };
    show();
  }

  // ---------- 2. memory game: English ↔ support language ----------
  function memory(ws) {
    const rounds = [];
    for (let i = 0; i < ws.length; i += 6) rounds.push(ws.slice(i, i + 6));
    let r = 0;
    const area = h('div', {});
    shell(`🧠 ${t('mode_memory')}`, area);
    const play = () => {
      clear(area);
      if (r >= rounds.length) return area.append(done(t('memory_done')));
      const set = rounds[r];
      const cards = shuffle(set.flatMap((w) => [{ id: w.id, side: 'en', text: w.en }, { id: w.id, side: 'l1', text: meaningOf(w, lang) }]), 'm' + r + set.length);
      let open = [];
      let found = 0;
      const grid = h('div', { class: 'mem-grid' });
      const els = cards.map((c, k) => {
        const face = h('span', { class: `mem-face ${c.side === 'en' ? 'en' : ''}`, dir: c.side === 'en' ? 'ltr' : dir(lang), lang: c.side === 'en' ? 'en' : lang }, c.text);
        const b = h('button', { class: 'mem-card', type: 'button', 'aria-label': '?', onclick: () => turn(k) }, h('span', { class: 'mem-q', 'aria-hidden': 'true' }, '?'), face);
        grid.append(b);
        return b;
      });
      function turn(k) {
        const b = els[k];
        if (b.classList.contains('up') || open.length === 2) return;
        b.classList.add('up'); b.setAttribute('aria-label', cards[k].text);
        if (cards[k].side === 'en') speak(cards[k].text);
        open.push(k);
        if (open.length === 2) {
          const [a, c] = open;
          if (cards[a].id === cards[c].id) {
            els[a].classList.add('matched'); els[c].classList.add('matched'); open = []; found += 1;
            if (found === set.length) setTimeout(() => { r += 1; play(); }, 900);
          } else {
            setTimeout(() => { els[a].classList.remove('up'); els[c].classList.remove('up'); open = []; }, 1100);
          }
        }
      }
      if (rounds.length > 1) area.append(h('div', { class: 'small muted' }, `${r + 1}/${rounds.length}`));
      area.append(grid);
    };
    play();
  }

  // ---------- 3. multiple choice (both directions) ----------
  function quiz(ws) {
    const pool = words.length >= 3 ? words : Object.values(WORD_BY_ID).filter((w) => w.tr);
    const qs = shuffle(ws.flatMap((w) => [{ w, rev: false }, { w, rev: true }]), 'q' + ws.length);
    let i = 0;
    const area = h('div', {});
    shell(`✅ ${t('mode_quiz')}`, area);
    const ask = () => {
      clear(area);
      if (i >= qs.length) return area.append(done(t('words_done')));
      const { w, rev } = qs[i];
      const others = shuffle(pool.filter((x) => x.id !== w.id), w.id + i).slice(0, 2);
      const opts = shuffle([w, ...others], 'o' + w.id + i);
      const result = h('div', {});
      const question = rev
        ? h('div', { class: 'quiz-q' }, t('quiz_rev'), ' ', h('b', { dir: dir(lang), lang }, meaningOf(w, lang)))
        : h('div', { class: 'quiz-q' }, h('span', { class: 'fc-emoji', 'aria-hidden': 'true' }, w.emoji || ''), ' ', t('quiz_q'), ' ', en(w.en), ' ', h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('listen'), onclick: () => speak(w.en) }, '🔊'));
      const buttons = opts.map((o) => h('button', {
        class: `option ${rev ? 'en' : ''}`, type: 'button', dir: rev ? 'ltr' : dir(lang), lang: rev ? 'en' : lang,
        onclick: (e) => {
          if (o.id === w.id) {
            buttons.forEach((b) => (b.disabled = true));
            e.currentTarget.classList.add('answer-shown');
            speak(w.en);
            clear(result).append(h('div', { class: 'feedback success' }, h('div', { class: 'title' }, `✓ ${w.en} = ${meaningOf(w, lang)}`)));
            setTimeout(() => { i += 1; ask(); }, 1200);
          } else {
            e.currentTarget.disabled = true; e.currentTarget.classList.add('eliminated');
          }
        },
      }, rev ? o.en : meaningOf(o, lang)));
      area.append(h('div', { class: 'small muted' }, `${i + 1}/${qs.length}`), question, h('div', { class: 'options', style: { marginTop: '12px' } }, buttons), result);
      if (!rev) speak(w.en);
    };
    ask();
  }

  drawList();
  return { el: root, marked };
}
