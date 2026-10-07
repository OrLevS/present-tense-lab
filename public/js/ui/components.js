// Reusable UI pieces: modal, toolbox, word card, clickable sentences, status chips, rule cards, stepper.

import { h, en, bidi, speak, speakBtn, clear, markEnding } from './dom.js';
import { t, L, getLang, dir } from '../i18n.js';
import { TOOLBOX, WORD_BY_ID, FORM_INDEX, SKILL_BY_ID, tokenize } from '../content/index.js';
import { isSkillUnlocked } from '../logic/unlock.js';
import { RULE_CARDS } from '../logic/feedback.js';
import { app, isPreview } from '../state.js';
import { api } from '../api.js';

// ---------- modal ----------
export function modal(title, body, { onClose, lang } = {}) {
  const root = document.getElementById('modal-root');
  const prevFocus = document.activeElement;
  const close = () => { clear(root); document.removeEventListener('keydown', onKey); onClose?.(); prevFocus?.focus?.(); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  const closeBtn = h('button', { class: 'btn small', type: 'button', onclick: close }, t('close'));
  const box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': typeof title === 'string' ? title : '', dir: dir(lang || getLang()) },
    h('div', { class: 'head' }, h('h2', {}, title), closeBtn),
    body);
  const backdrop = h('div', { class: 'modal-backdrop', onclick: (e) => { if (e.target === backdrop) close(); } }, box);
  clear(root).append(backdrop);
  document.addEventListener('keydown', onKey);
  closeBtn.focus();
  return close;
}

// ---------- grammar toolbox ----------
export function openToolbox() {
  app.onToolboxOpen?.();
  if (app.user?.role === 'student' && !isPreview()) api.logEvent({ type: 'toolbox_open', moduleId: app.currentModuleId || null, itemId: app.currentItemId || null });
  const settings = app.settings;
  const student = app.student;
  const body = h('div', {},
    h('p', { class: 'muted' }, t('toolbox_sub')),
    TOOLBOX.map((card) => {
      const open = isSkillUnlocked(card.skill, settings, student);
      if (!open) {
        return h('div', { class: 'tb-group locked' }, h('h3', {}, `🔒 ${card.group}`), h('div', { dir: dir() }, L(SKILL_BY_ID[card.skill]?.name), ' · ', t('toolbox_locked')));
      }
      return h('div', { class: 'tb-group' },
        h('h3', {}, card.group),
        card.lines.map((ln) => h('div', { class: 'tb-line' },
          h('span', {}, ln.label),
          ln.value ? h('b', {}, ln.mark ? richValue(ln.value, ln.mark) : ln.value) : null)));
    }));
  modal(`🧰 ${t('toolbox')}`, body);
}

function richValue(value, mark) {
  const parts = value.split(' ');
  const last = parts.pop();
  return h('span', {}, parts.length ? parts.join(' ') + ' ' : '', markEnding(last, mark));
}

// ---------- vocabulary help (never counts as an error) ----------
export function openWord(wordId) {
  const w = WORD_BY_ID[wordId];
  if (!w) return;
  if (app.user?.role === 'student' && !isPreview()) api.logEvent({ type: 'vocab_lookup', moduleId: app.currentModuleId || null, itemId: app.currentItemId || null, data: { word: wordId } });
  const lang = getLang();
  const showS = w.kind === 'verb' && isSkillUnlocked('third_person_s', app.settings, app.student);
  modal(h('span', {}, w.emoji ? `${w.emoji} ` : '', en(w.en)), h('div', { class: 'stack' },
    h('div', { class: 'row' }, speakBtn(w.en, `🔊 ${t('listen')}`)),
    lang !== 'en' ? h('p', { class: 'en-big', dir: dir(), lang }, L(w.tr, lang)) : null,
    w.def ? h('p', {}, en(w.def)) : null,
    showS ? h('div', { class: 'tb-group' }, h('div', { class: 'tb-line' }, h('span', {}, 'I / you / we / they'), h('b', {}, w.en)), h('div', { class: 'tb-line' }, h('span', {}, 'he / she / it'), h('b', {}, markEnding(w.forms.s, 'es?')))) : null,
  ));
}

// English sentence where each known word can be tapped for help.
export function clickableSentence(sentence, { highlight, mark, big = false } = {}) {
  const wrap = h('span', { class: `en sentence-words ${big ? 'en-big' : ''}`, dir: 'ltr', lang: 'en' });
  const parts = String(sentence).split(/(\s+)/);
  const hlWords = highlight ? highlight.toLowerCase().split(' ') : [];
  for (const p of parts) {
    if (/^\s+$/.test(p) || !p) { wrap.append(p); continue; }
    const core = tokenize(p)[0] || '';
    const id = FORM_INDEX.get(core.toLowerCase());
    const isHl = hlWords.includes(core.toLowerCase());
    let content = isHl && mark ? markEnding(p.replace(/[.,!?]$/, ''), mark) : p.replace(/[.,!?]$/, '');
    const punct = (p.match(/[.,!?]$/) || [''])[0];
    let node = id ? h('button', { class: 'wordlink', type: 'button', onclick: () => openWord(id), 'aria-label': `${core}: help` }, content) : h('span', {}, content);
    if (isHl) node = h('span', { class: 'hl' }, node);
    wrap.append(node, punct);
  }
  return wrap;
}

// ---------- status chip ----------
const STATUS_ICON = { mastered: '✓', practicing: '◐', needs_support: '!', not_started: '○' };
const STATUS_HE_TEACHER = { mastered: 'שולט/ת', practicing: 'בתרגול', needs_support: 'זקוק/ה לתמיכה', not_started: 'טרם התחיל/ה' };
export function statusChip(status, { teacher = false } = {}) {
  const label = teacher ? STATUS_HE_TEACHER[status] : t(`status_${status}`);
  return h('span', { class: `status ${status}` }, h('span', { 'aria-hidden': 'true' }, STATUS_ICON[status]), label);
}

// ---------- rule card ----------
export function ruleCard(key) {
  const r = RULE_CARDS[key];
  if (!r) return null;
  return h('div', { class: 'rulecard', dir: 'ltr', lang: 'en' },
    h('span', { class: 'left' }, r.left), h('span', { class: 'arrow' }, '→'), h('span', { class: 'right' }, r.right),
    h('span', { class: 'ex' }, r.example));
}

// ---------- stepper ----------
export function stepper(steps, current, { onJump } = {}) {
  const pct = Math.round((current / steps.length) * 100);
  return h('div', {},
    h('div', { class: 'stepinfo' }, t('step_n_of', { n: current + 1, total: steps.length }), ' · ', h('b', {}, t(`step_${steps[current]}`))),
    h('div', { class: 'progressline', role: 'progressbar', 'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('span', { style: { width: `${Math.max(4, pct)}%` } })),
    h('ol', { class: 'stepper', 'aria-label': 'steps' }, steps.map((s, i) => h('li', { class: i < current ? 'done' : i === current ? 'current' : '' },
      onJump ? h('button', { type: 'button', onclick: () => onJump(i) }, `${i < current ? '✓ ' : ''}${t(`step_${s}`)}`) : `${i < current ? '✓ ' : ''}${t(`step_${s}`)}`))),
  );
}

// ---------- action bar (always in the same place) ----------
export function actionBar(...buttons) {
  return h('div', { class: 'actionbar' }, h('div', { class: 'inner' }, buttons));
}

export { bidi, speak };
