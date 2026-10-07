// Exercise runner: one exercise on screen, with the retry + progressive-feedback loop.
// Tracks attempts, hints, support used (word bank / verb / starter), toolbox use and time — then hands back a response record.

import { h, clear, bidi, en } from './dom.js';
import { t, L, getLang, dir, fwd, bwd } from '../i18n.js';
import { renderExercise, wordBankEl } from './exercises.js';
import { ruleCard, clickableSentence, actionBar } from './components.js';
import { resolveConfig, scoreAttempt, buildResponse, modelAnswer } from '../logic/score.js';
import { buildFeedback } from '../logic/feedback.js';
import { VERB_FORMS, WORD_BY_ID } from '../content/index.js';
import { app, isPreview } from '../state.js';
import { api } from '../api.js';

const AI_TIMEOUT_MS = 7000;

/**
 * @param mount   element to render into
 * @param opts    { module, item, level, mode: 'check'|'practice'|'produce'|'exit'|'remediation', index, total, onDone(response) }
 */
export function runExercise(mount, { module, item, level, mode, index, total, onDone }) {
  const cfg = resolveConfig(item, level, index, total);
  const lang = getLang();
  const exit = mode === 'exit';
  const free = cfg.type === 'free_production' || cfg.type === 'wh_scaffold';
  const st = { wrong: 0, attempts: [], hintsUsed: 0, supportUsed: {}, toolboxOpened: false, revealed: false, startedAt: Date.now(), done: false, aiEvaluation: null };
  app.onToolboxOpen = () => { st.toolboxOpened = true; };
  app.currentItemId = item.id;
  if (cfg.verbSupplied) st.supportUsed.verbSupplied = true;

  clear(mount);

  // ---------- instruction ----------
  let instruction;
  if (free) instruction = L(item.instruction);
  else if (cfg.type === 'error_correction' || cfg.type === 'transform') instruction = cfg.instruction || item.instruction ? L(cfg.instruction || item.instruction) : t(`instr_${cfg.type}`);
  else if (item.instruction) instruction = L(item.instruction);
  else instruction = t(`instr_${cfg.type}`);
  const head = h('div', { class: 'instruction' }, h('span', { class: 'num' }, `${index + 1}/${total}`), h('span', {}, bidi(instruction)));

  // ---------- prompt (support language) ----------
  let promptCard = null;
  if ((free || cfg.type === 'wh_scaffold') && item.situation) {
    promptCard = h('div', { class: 'prompt-card' }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, item.situation.emoji), h('div', { class: 'prompt' }, en(item.situation.caption)));
  } else if (item.prompt && cfg.type !== 'translate_multi') {
    const pDir = lang === 'en' ? 'ltr' : dir(lang);
    promptCard = h('div', { class: 'prompt-card' },
      item.image ? h('div', { class: 'pic', 'aria-hidden': 'true' }, item.image) : null,
      h('div', { class: 'prompt', dir: pDir, lang }, L(item.prompt)));
  }

  // ---------- visible supports (Easy) ----------
  const supports = [];
  if (cfg.showRule && !exit) {
    if (cfg.ruleKey) supports.push(ruleCard(cfg.ruleKey));
    else supports.push(ruleCard('both'));
  }
  const chips = [];
  if (cfg.subjectHint && !exit) chips.push(h('span', { class: 'support' }, en(cfg.subjectHint)));
  if (cfg.verbSupplied && !exit) chips.push(h('span', { class: 'support' }, t('verb_given'), ' ', en(`(${WORD_BY_ID[cfg.verbSupplied]?.en || cfg.verbSupplied})`)));

  // ---------- the exercise itself ----------
  const ex = renderExercise(item, cfg, { lang, L, onChange: () => {}, onEnter: () => primary.click() });
  const extras = h('div', {});

  // word bank (Medium: optional, Easy late items: shown)
  const bankChunks = () => {
    const chunks = [...(item.chunks || [])];
    const v = item.target?.verb && VERB_FORMS[WORD_BY_ID[item.target.verb]?.en];
    if (v) for (const f of [v.base, v.s]) if (!chunks.includes(f)) chunks.push(f); // keep the S decision for the student
    return chunks;
  };
  const showBank = () => {
    if (!ex.textarea || !item.chunks || extras.querySelector('.wordbank')) return;
    st.supportUsed.wordBank = true;
    extras.append(wordBankEl(bankChunks(), ex.textarea, item.id));
  };
  if (!exit && ex.textarea && item.chunks) {
    if (cfg.wordBank === 'shown') showBank();
    else if (cfg.wordBank === 'optional') {
      const b = h('button', { class: 'btn small', type: 'button', onclick: () => { showBank(); b.remove(); } }, `🧩 ${t('show_word_bank')}`);
      extras.append(b);
    }
  }
  if (!exit && free && item.starter) {
    const b = h('button', { class: 'btn small', type: 'button', onclick: () => {
      st.supportUsed.starter = true;
      ex.textarea.value = item.starter.replace('…', '').trimEnd() + ' ';
      ex.textarea.focus(); b.remove();
    } }, `✏️ ${t('starter')}`);
    extras.append(b);
  }

  const feedbackBox = h('div', { 'aria-live': 'polite' });

  // ---------- action bar ----------
  const hintBtn = exit ? null : h('button', { class: 'btn', type: 'button', onclick: voluntaryHint }, `💡 ${t('hint')}`);
  const primary = h('button', { class: 'btn primary', type: 'button', onclick: onPrimary }, `${t('check')} ✓`);

  mount.append(
    h('div', { class: 'card' }, head, promptCard, supports.length ? h('div', {}, supports) : null, chips.length ? h('div', { class: 'support-row' }, chips) : null, ex.el, extras, feedbackBox),
    actionBar(hintBtn, h('span', { class: 'spacer' }), primary),
  );
  setTimeout(() => ex.focus(), 0);

  // ---------- behaviour ----------
  function voluntaryHint() {
    st.hintsUsed += 1;
    const third = item.target?.person === 'third';
    const subject = subjectOf(item, cfg);
    const box = h('div', { class: 'feedback hint' }, h('div', { class: 'title' }, `💡 ${t('hint')}`));
    if (st.hintsUsed === 1) {
      box.append(h('p', {}, bidi(t(third ? 'fb_s_need_1' : 'fb_s_extra_1', { subject: subject ? `“${subject}”` : '—' }))), ruleCard(third ? 'third' : 'no_s'));
    } else {
      box.append(ruleCard('order'));
      if (ex.textarea && item.chunks) showBank();
      hintBtn.disabled = true;
    }
    clear(feedbackBox).append(box);
  }

  let busy = false;
  async function onPrimary() {
    if (st.done) return finish();
    if (busy) return;
    if (ex.isEmpty()) { ex.focus(); return; }
    busy = true;
    const answer = ex.getAnswer();
    let ev = scoreAttempt(item, cfg, answer);
    if (free && !isPreview()) {
      primary.disabled = true; primary.textContent = '…';
      ev = await withAI(ev, answer);
      primary.disabled = false; primary.textContent = `${t('check')} ✓`;
    }
    const fbLevel = ev.correct ? null : Math.min(st.wrong + 1, 3);
    st.attempts.push({ answer, ev, feedbackLevel: fbLevel });
    busy = false;

    if (exit) { st.done = true; return finish(); } // exit ticket: one independent attempt, no automatic hints

    if (ev.correct) {
      const fb = buildFeedback(ev, st.wrong, item, cfg, { hintsUsed: st.hintsUsed });
      const box = h('div', { class: 'feedback success' }, h('div', { class: 'title' }, '✓ ', fb.text));
      if (free && ev.details?.unknownWords?.length) box.append(h('p', {}, bidi(t('fb_unknown_words', { words: ev.details.unknownWords.join(', ') }))));
      if (free && ev.aiFeedback) box.append(h('p', {}, bidi(ev.aiFeedback)));
      if (free && st.aiEvaluation?.wellDone?.length) box.append(h('ul', { class: 'small' }, st.aiEvaluation.wellDone.slice(0, 2).map((x) => h('li', {}, '✓ ', bidi(x)))));
      clear(feedbackBox).append(box);
      return complete();
    }

    st.wrong += 1;
    const fb = buildFeedback(ev, st.wrong, item, cfg, { hintsUsed: st.hintsUsed, freeProduction: free });
    if (fb.kind === 'reveal') {
      st.revealed = true;
      if (!fb.models) fb.reveal = ev.bestMatch || modelAnswer(item, cfg);
      const typed = ['translate', 'transform', 'error_correction', 'sentence_builder', 'fill_blank'].includes(cfg.type);
      ex.reveal?.();
      const box = h('div', { class: 'feedback reveal' }, h('div', { class: 'title' }, fb.text));
      if (fb.reveal) {
        box.append(h('div', { class: 'reveal-text' }, clickableSentence(fb.reveal)));
        if (typed) box.append(h('p', { class: 'small muted' }, t('reveal_type')),
          h('input', { class: 'answer', dir: 'ltr', lang: 'en', style: { minHeight: '56px' }, autocomplete: 'off', spellcheck: 'false', 'aria-label': t('reveal_type') }));
      }
      if (fb.models) box.append(...fb.models.map((m) => h('div', { class: 'reveal-text' }, clickableSentence(m))), h('p', { class: 'small muted' }, t('teacher_will_see')));
      if (fb.rule) box.append(ruleCard(fb.rule));
      clear(feedbackBox).append(box);
      return complete();
    }
    const box = h('div', { class: 'feedback hint' },
      h('div', { class: 'title' }, `💡 ${t('try_again')}`),
      h('p', {}, bidi(ev.aiFeedback || fb.text)),
      fb.rule ? ruleCard(fb.rule) : null);
    clear(feedbackBox).append(box);
    ex.onWrong(answer, ev, st.wrong);
  }

  function complete() {
    st.done = true;
    ex.lock();
    if (hintBtn) hintBtn.disabled = true;
    primary.textContent = `${t('next')} ${fwd()}`;
    primary.classList.add('go');
    primary.focus();
  }

  function finish() {
    if (st.finished) return;
    st.finished = true;
    app.onToolboxOpen = null;
    const response = buildResponse({
      studentId: app.student?.id || 'preview', module, item, cfg, level, stepType: mode, attempts: st.attempts,
      hintsUsed: st.hintsUsed, supportUsed: st.supportUsed, toolboxOpened: st.toolboxOpened, revealed: st.revealed,
      startedAt: st.startedAt, aiEvaluation: st.aiEvaluation,
    });
    onDone(response, { cfg, model: modelAnswer(item, cfg) });
  }

  async function withAI(ev, answer) {
    try {
      const res = await Promise.race([
        api.evaluateOpen({ answer, instruction: L(item.instruction, 'en'), target: item.target, language: lang }),
        new Promise((r) => setTimeout(() => r(null), AI_TIMEOUT_MS)),
      ]);
      if (!res?.available) return ev;
      const ai = res.result;
      st.aiEvaluation = ai;
      const grammarCorrect = ai.grammarCorrect && ai.tenseCorrect && ai.wordOrderCorrect;
      return {
        ...ev, grammarCorrect, spellingCorrect: ai.spellingCorrect, vocabularyCorrect: ai.vocabularyOk, wordOrderCorrect: ai.wordOrderCorrect,
        correct: grammarCorrect && ai.spellingCorrect && ai.comprehensible,
        errorTags: ai.errorTags, primaryTag: ai.errorTags[0] || null, aiFeedback: ai.feedback,
      };
    } catch {
      return ev;
    }
  }
}

function subjectOf(item, cfg) {
  if (cfg.frame) return cfg.frame.split('___')[0].trim();
  if (item.chunks) return item.chunks[0];
  if (item.target?.subject) return item.target.subject;
  return '';
}
