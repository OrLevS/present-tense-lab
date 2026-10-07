// Exercise renderers — one per exercise TYPE. They know nothing about specific lessons.
// Each returns { el, getAnswer, isEmpty, lock, onWrong(answer), focus }.
// To add a type: add a renderer here + a case in logic/score.js.

import { h, en, shuffle, clear, speak } from './dom.js';
import { t } from '../i18n.js';
import { clickableSentence } from './components.js';

const RENDERERS = {
  multiple_choice: renderMultipleChoice,
  choose_sentence: renderChooseSentence,
  fill_blank: renderFillBlank,
  sentence_builder: renderSentenceBuilder,
  translate: renderTranslate,
  error_correction: renderTranslate,
  free_production: renderTranslate,
  translate_multi: renderMulti,
};

export function renderExercise(item, cfg, ctx) {
  const r = RENDERERS[cfg.type];
  if (!r) throw new Error(`No renderer for ${cfg.type}`);
  return r(item, cfg, ctx);
}

function frameEl(frame, slotEl) {
  const [before, after] = frame.split('___');
  return h('div', { class: 'frame', dir: 'ltr', lang: 'en' }, clickableSentence(before.trimEnd()), ' ', slotEl, ' ', clickableSentence(after.trimStart()));
}

function renderMultipleChoice(item, cfg, ctx) {
  let chosen = null;
  const slot = h('span', { class: 'slot' }, ' ');
  const buttons = cfg.options.map((opt) => h('button', {
    class: 'option en', type: 'button', dir: 'ltr', lang: 'en', 'aria-pressed': 'false',
    onclick: (e) => {
      chosen = opt;
      buttons.forEach((b) => { b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false'); });
      e.currentTarget.classList.add('selected'); e.currentTarget.setAttribute('aria-pressed', 'true');
      slot.textContent = opt; slot.classList.add('filled');
      ctx.onChange?.();
    },
  }, opt));
  const el = h('div', {}, cfg.frame ? frameEl(cfg.frame, slot) : null, h('div', { class: 'options' }, buttons));
  return {
    el,
    getAnswer: () => chosen,
    isEmpty: () => chosen == null,
    lock: () => buttons.forEach((b) => (b.disabled = true)),
    onWrong: (ans) => { const b = buttons.find((x) => x.textContent === ans); b?.setAttribute('disabled', ''); b?.classList.add('eliminated'); b?.classList.remove('selected'); chosen = null; slot.textContent = ' '; slot.classList.remove('filled'); },
    focus: () => buttons[0]?.focus(),
  };
}

function renderChooseSentence(item, cfg, ctx) {
  let chosen = null;
  const opts = shuffle(cfg.options, item.id);
  const buttons = opts.map((opt) => h('button', {
    class: 'option sentence en', type: 'button', dir: 'ltr', lang: 'en',
    onclick: (e) => { chosen = opt; buttons.forEach((b) => b.classList.remove('selected')); e.currentTarget.classList.add('selected'); ctx.onChange?.(); },
  }, opt));
  return {
    el: h('div', { class: 'options', style: { gridTemplateColumns: '1fr' } }, buttons),
    getAnswer: () => chosen, isEmpty: () => chosen == null,
    lock: () => buttons.forEach((b) => (b.disabled = true)),
    onWrong: (ans) => { const b = buttons.find((x) => x.textContent === ans); b?.setAttribute('disabled', ''); b?.classList.add('eliminated'); b?.classList.remove('selected'); chosen = null; },
    focus: () => buttons[0]?.focus(),
  };
}

function renderFillBlank(item, cfg, ctx) {
  const input = h('input', { type: 'text', class: '', dir: 'ltr', lang: 'en', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': t('instr_fill_blank'),
    oninput: () => ctx.onChange?.(), onkeydown: (e) => { if (e.key === 'Enter') ctx.onEnter?.(); } });
  const slot = h('span', { class: 'slot' }, input);
  return {
    el: h('div', {}, frameEl(cfg.frame, slot), cfg.base ? h('div', { class: 'base-hint' }, t('verb_given'), ' ', en(`(${cfg.base})`)) : null),
    getAnswer: () => input.value.trim(), isEmpty: () => !input.value.trim(),
    lock: () => (input.disabled = true),
    onWrong: () => input.select(),
    focus: () => input.focus(),
  };
}

function renderSentenceBuilder(item, cfg, ctx) {
  const chunks = item.chunks || cfg.chunks;
  const all = shuffle([...chunks, ...(cfg.distractors || [])], item.id);
  const line = h('div', { class: 'answer-line', 'aria-label': t('your_sentence') });
  const picked = [];
  const pool = all.map((word, i) => h('button', { class: 'tile en', type: 'button', lang: 'en', onclick: () => pick(i) }, word));
  function pick(i) {
    picked.push(i); pool[i].disabled = true; draw(); ctx.onChange?.();
  }
  function unpick(pos) {
    const [i] = picked.splice(pos, 1); pool[i].disabled = false; draw(); ctx.onChange?.();
  }
  function draw() {
    clear(line);
    picked.forEach((i, pos) => line.append(h('button', { class: 'tile en', type: 'button', lang: 'en', onclick: () => unpick(pos) }, all[i])));
  }
  const guide = cfg.showOrder ? h('div', { class: 'order-guide' }, ['Who?', 'does what?', 'what?', 'when?'].map((s) => h('span', {}, s))) : null;
  const undo = h('button', { class: 'btn small', type: 'button', onclick: () => picked.length && unpick(picked.length - 1) }, `↶ ${t('undo')}`);
  const clearBtn = h('button', { class: 'btn small ghost', type: 'button', onclick: () => { while (picked.length) unpick(picked.length - 1); } }, t('clear'));
  return {
    el: h('div', {}, guide, line, h('div', { class: 'tiles' }, pool), h('div', { class: 'row', style: { marginTop: '12px' } }, undo, clearBtn)),
    getAnswer: () => picked.map((i) => all[i]).join(' ') + '.',
    isEmpty: () => picked.length === 0,
    lock: () => { pool.forEach((b) => (b.disabled = true)); undo.disabled = true; clearBtn.disabled = true; },
    onWrong: () => {},
    focus: () => pool.find((b) => !b.disabled)?.focus(),
  };
}

function textArea(ctx, prefill = '') {
  const ta = h('textarea', { class: 'answer', dir: 'ltr', lang: 'en', rows: 2, autocomplete: 'off', autocapitalize: 'sentences', autocorrect: 'off', spellcheck: 'false', placeholder: t('type_here'), 'aria-label': t('type_here'),
    oninput: () => ctx.onChange?.(),
    onkeydown: (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ctx.onEnter?.(); } } });
  ta.value = prefill;
  return ta;
}

// Word bank chips insert text at the cursor.
export function wordBankEl(chunks, ta, seed) {
  return h('div', { class: 'wordbank' },
    h('div', { class: 'section-label' }, t('word_bank')),
    h('div', { class: 'tiles' }, shuffle(chunks, seed).map((c) => h('button', { class: 'tile en', type: 'button', lang: 'en', onclick: () => {
      const v = ta.value;
      ta.value = (v && !/\s$/.test(v) ? v + ' ' : v) + c;
      ta.focus(); ta.dispatchEvent(new Event('input'));
    } }, c))));
}

function renderTranslate(item, cfg, ctx) {
  const prefill = cfg.type === 'error_correction' ? cfg.wrong : '';
  const ta = textArea(ctx, prefill);
  const parts = [];
  if (cfg.type === 'error_correction') parts.push(h('div', { class: 'wrong-sentence' }, clickableSentence(cfg.wrong)));
  parts.push(ta);
  return {
    el: h('div', {}, parts), textarea: ta,
    getAnswer: () => ta.value.trim(), isEmpty: () => !ta.value.trim() || (prefill && ta.value.trim() === prefill),
    lock: () => (ta.readOnly = true),
    onWrong: () => ta.focus(),
    focus: () => ta.focus(),
  };
}

function renderMulti(item, cfg, ctx) {
  const areas = cfg.parts.map(() => textArea(ctx));
  const lang = ctx.lang;
  return {
    el: h('div', { class: 'stack' }, cfg.parts.map((p, i) => h('div', {},
      h('div', { class: 'prompt-card', style: { marginBottom: '8px' } }, h('div', { class: 'prompt', dir: lang === 'en' || lang === 'ru' ? 'ltr' : 'rtl', lang }, `${i + 1}. `, ctx.L(p.prompt))),
      areas[i]))),
    getAnswer: () => areas.map((a) => a.value.trim()),
    isEmpty: () => areas.some((a) => !a.value.trim()),
    lock: () => areas.forEach((a) => (a.readOnly = true)),
    onWrong: () => areas[0].focus(),
    focus: () => areas[0].focus(),
  };
}

// ======================= new exercise types =======================

// Rewrite a given sentence (make it negative / a question / now …)
function renderTransform(item, cfg, ctx) {
  const ta = textArea(ctx);
  const src = cfg.source || item.source;
  return {
    el: h('div', {}, h('div', { class: 'source-sentence' }, speakBtnInline(src), clickableSentence(src)), ta), textarea: ta,
    getAnswer: () => ta.value.trim(), isEmpty: () => !ta.value.trim(),
    lock: () => (ta.readOnly = true), onWrong: () => ta.focus(), focus: () => ta.focus(),
  };
}

// Sort cards into buckets (habit / now · +s / +es …) — also used for matching (each row → one answer)
function renderSort(item, cfg, ctx) {
  const isMatch = cfg.type === 'match';
  const cards = item.cards || item.pairs.map((p) => ({ text: p.left, bucket: p.right }));
  const buckets = isMatch ? shuffle([...new Set(item.pairs.map((p) => p.right))], item.id).map((r) => ({ id: r, label: r })) : item.buckets;
  const order = isMatch ? cards.map((_, i) => i) : shuffle(cards.map((_, i) => i), item.id);
  const answer = {};
  const rows = [];
  const labelOf = (b) => (typeof b.label === 'string' ? b.label : ctx.L(b.label));
  const list = h('div', { class: 'sort-list' }, order.map((i) => {
    const c = cards[i];
    const btns = buckets.map((b) => h('button', { class: `seg ${isMatch || typeof b.label === 'string' ? 'en' : ''}`, type: 'button', 'aria-pressed': 'false', onclick: (e) => {
      answer[i] = b.id;
      e.currentTarget.parentElement.querySelectorAll('.seg').forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      e.currentTarget.classList.add('on'); e.currentTarget.setAttribute('aria-pressed', 'true');
      row.classList.remove('wrong-row');
      ctx.onChange?.();
    } }, b.emoji ? `${b.emoji} ` : '', labelOf(b)));
    const row = h('div', { class: 'sort-row' }, h('div', { class: 'sort-card en', dir: 'ltr', lang: 'en' }, speakBtnInline(c.text), c.text), h('div', { class: 'seg-group' }, btns));
    rows[i] = row;
    return row;
  }));
  return {
    el: list,
    getAnswer: () => ({ ...answer }),
    isEmpty: () => Object.keys(answer).length < cards.length,
    lock: () => list.querySelectorAll('button').forEach((b) => (b.disabled = true)),
    onWrong: (_a, ev, wrongCount) => { if (wrongCount >= 2) (ev?.wrongIdx || []).forEach((i) => rows[i]?.classList.add('wrong-row')); },
    reveal: () => cards.forEach((c, i) => rows[i].querySelectorAll('.seg').forEach((b, k) => b.classList.toggle('on', buckets[k].id === c.bucket))),
    focus: () => list.querySelector('.seg')?.focus(),
  };
}

// Same verb, two (or more) sentences: I ___ soccer. / He ___ soccer.  (play)
function renderPairFill(item, cfg, ctx) {
  const frames = cfg.frames || item.frames;
  const inputs = [];
  const el = h('div', {},
    (cfg.verb || item.verb) ? h('div', { class: 'support-row' }, h('span', { class: 'support' }, t('verb_given'), ' ', en(`(${cfg.verb || item.verb})`))) : null,
    frames.map((fr) => {
      const input = h('input', { type: 'text', dir: 'ltr', lang: 'en', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': fr, onkeydown: (e) => { if (e.key === 'Enter') ctx.onEnter?.(); } });
      inputs.push(input);
      return frameEl(fr, h('span', { class: 'slot' }, input));
    }));
  return {
    el, getAnswer: () => inputs.map((i) => i.value.trim()), isEmpty: () => inputs.some((i) => !i.value.trim()),
    lock: () => inputs.forEach((i) => (i.disabled = true)), onWrong: () => inputs[0].focus(), focus: () => inputs[0].focus(),
  };
}

// A short phone chat with gaps
function renderTextGaps(item, cfg, ctx) {
  const inputs = [];
  const chat = h('div', { class: 'chat', dir: 'ltr', lang: 'en' }, item.chat.map((m) => {
    let content;
    if (m.text.includes('___')) {
      const [a, b] = m.text.split('___');
      const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': m.text, size: Math.max(6, String([].concat(m.answer)[0]).length + 2), onkeydown: (e) => { if (e.key === 'Enter') ctx.onEnter?.(); } });
      inputs.push(input);
      content = h('span', {}, a, input, b, m.base ? h('span', { class: 'base-hint' }, ` (${m.base})`) : null);
    } else content = m.text;
    return h('div', { class: `bubble ${m.from === 'me' ? 'me' : ''}` }, h('div', { class: 'who' }, m.from === 'me' ? '🙂 me' : m.from), h('div', {}, content));
  }));
  return {
    el: chat, getAnswer: () => inputs.map((i) => i.value.trim()), isEmpty: () => inputs.some((i) => !i.value.trim()),
    lock: () => inputs.forEach((i) => (i.disabled = true)), onWrong: () => inputs[0].focus(), focus: () => inputs[0].focus(),
  };
}

// Listen, then choose the sentence you heard
function renderListenChoose(item, cfg, ctx) {
  const inner = renderChooseSentence(item, cfg, ctx);
  const play = h('button', { class: 'btn big', type: 'button', onclick: () => speak(cfg.audio || cfg.answer) }, `🔊 ${t('play_again')}`);
  return { ...inner, el: h('div', {}, h('div', { style: { textAlign: 'center', margin: '6px 0 18px' } }, play), inner.el), focus: () => play.focus() };
}

// Who? What? Where? When? → one sentence (from the teacher's Canva lesson)
function renderWhScaffold(item, cfg, ctx) {
  const ta = textArea(ctx);
  const fields = (item.fields || ['Who?', 'What?', 'Where?', 'When?']).map((q) => h('label', { class: 'wh-field' }, h('span', { class: 'en', dir: 'ltr' }, q), h('input', { type: 'text', dir: 'ltr', lang: 'en', autocomplete: 'off', spellcheck: 'false' })));
  return {
    el: h('div', {}, h('div', { class: 'wh-grid' }, fields), h('p', { style: { fontWeight: 500, marginTop: '14px' } }, t('wh_one_sentence')), ta), textarea: ta,
    getAnswer: () => ta.value.trim(), isEmpty: () => !ta.value.trim(),
    lock: () => (ta.readOnly = true), onWrong: () => ta.focus(), focus: () => fields[0].querySelector('input').focus(),
  };
}

function speakBtnInline(text) {
  return h('button', { class: 'icon-btn small-speak', type: 'button', 'aria-label': `Listen: ${text}`, onclick: (e) => { e.stopPropagation(); speak(text); } }, '🔊');
}

Object.assign(RENDERERS, {
  transform: renderTransform,
  sort: renderSort,
  match: renderSort,
  pair_fill: renderPairFill,
  text_gaps: renderTextGaps,
  listen_choose: renderListenChoose,
  wh_scaffold: renderWhScaffold,
});
