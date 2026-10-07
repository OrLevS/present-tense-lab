// Animated explainer ("motion graphics inside the app").
// A rule is shown as a few SCENES. Each scene is rows of word BLOCKS with stable keys:
// a block with the same key MOVES to its new place (FLIP), new keys drop in, removed keys fall away.
// So "the S jumps from the verb onto does" is just: key 's' sits after 'use' in one scene and after 'do' in the next.
//
// scene = { caption: L(...), rows: [[{ k, t, gold?, glue?, strike?, pic? }]], icons?: ['📅', …], tag?: '⏰ usually', say?: 'English sentence' }
// The student controls the pace: back · play/pause · next · replay. Reduced motion → no movement, only the end state.

import { h, clear, bidi, speak } from './dom.js';
import { t, L, getLang, dir } from '../i18n.js';

const MOVE_MS = 650;
const EASE = 'cubic-bezier(.22,1.15,.36,1)'; // gentle spring-like overshoot
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function renderExplainer(explain, { onDone } = {}) {
  const scenes = explain.scenes;
  let i = -1;
  let playing = true;
  let timer = null;

  const stage = h('div', { class: 'ex-stage', dir: 'ltr', lang: 'en', 'aria-live': 'polite' });
  const iconRow = h('div', { class: 'ex-icons', 'aria-hidden': 'true' });
  const tag = h('div', { class: 'ex-tag hidden' });
  const caption = h('div', { class: 'ex-caption', dir: dir(), lang: getLang() });
  const dots = h('div', { class: 'ex-dots', 'aria-hidden': 'true' }, scenes.map(() => h('i')));
  const btn = (label, aria, fn) => h('button', { class: 'icon-btn', type: 'button', 'aria-label': aria, onclick: fn }, label);
  const playBtn = btn('⏸', 'pause', () => { playing = !playing; playBtn.textContent = playing ? '⏸' : '▶'; if (playing) schedule(); else clearTimeout(timer); });
  const controls = h('div', { class: 'ex-controls' },
    btn(dir() === 'rtl' ? '▶▶' : '◀◀', t('back'), () => go(i - 1)),
    playBtn,
    btn(dir() === 'rtl' ? '◀◀' : '▶▶', t('next'), () => go(i + 1)),
    btn('↺', t('play_again'), () => { stage.innerHTML = ''; i = -1; playing = true; playBtn.textContent = '⏸'; go(0); }),
    btn('🔊', t('listen'), () => { const s = scenes[i]; if (s?.say) speak(s.say); }));
  const el = h('div', { class: 'explainer' }, h('div', { class: 'ex-screen' }, iconRow, tag, stage), caption, h('div', { class: 'ex-bar' }, dots, controls));

  function schedule() {
    clearTimeout(timer);
    if (!playing) return;
    const hold = (scenes[i]?.hold || 3.2) * 1000;
    timer = setTimeout(() => { if (i < scenes.length - 1) go(i + 1); else { playing = false; playBtn.textContent = '▶'; onDone?.(); } }, hold);
  }

  function go(n) {
    if (n < 0 || n >= scenes.length) return;
    i = n;
    const sc = scenes[i];
    dots.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k <= i));
    clear(caption).append(bidi(L(sc.caption)));
    tag.textContent = sc.tag || '';
    tag.classList.toggle('hidden', !sc.tag);
    drawIcons(sc.icons || []);
    morph(sc.rows || []);
    schedule();
  }

  function drawIcons(icons) {
    clear(iconRow);
    icons.forEach((ic, k) => {
      const s = h('span', { class: 'ex-icon' }, ic);
      iconRow.append(s);
      if (!reduced()) s.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, delay: 120 + k * 160, easing: EASE, fill: 'backwards' });
    });
  }

  // FLIP: remember old boxes by key → rebuild → animate from old to new
  function morph(rows) {
    const old = new Map();
    stage.querySelectorAll('.blk2').forEach((b) => old.set(b.dataset.k, { rect: b.getBoundingClientRect(), text: b.textContent, el: b }));
    const stageRect = stage.getBoundingClientRect();
    clear(stage);
    const fresh = [];
    for (const row of rows) {
      const r = h('div', { class: 'ex-row' });
      for (const b of row) {
        const node = h('span', { class: `blk2 ${b.gold ? 'gold' : ''} ${b.glue ? 'glue' : ''} ${b.strike ? 'strike' : ''} ${b.pic ? 'pic' : ''}`, 'data-k': b.k }, b.t);
        r.append(node);
        fresh.push([node, b]);
      }
      stage.append(r);
    }
    if (reduced()) return;
    const seen = new Set();
    let enter = 0;
    for (const [node, b] of fresh) {
      const prev = old.get(b.k);
      const now = node.getBoundingClientRect();
      if (prev) {
        seen.add(b.k);
        const dx = prev.rect.left - now.left, dy = prev.rect.top - now.top;
        const sx = prev.rect.width / Math.max(1, now.width);
        node.animate([{ transform: `translate(${dx}px, ${dy}px) scaleX(${sx})` }, { transform: 'none' }], { duration: MOVE_MS, easing: EASE });
        if (prev.text !== node.textContent) node.animate([{ color: 'transparent' }, { color: 'transparent', offset: 0.35 }, {}], { duration: MOVE_MS });
      } else {
        node.animate([{ transform: 'translateY(-46px) scale(.85)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: MOVE_MS, delay: 220 + enter * 90, easing: EASE, fill: 'backwards' });
        enter += 1;
      }
    }
    // blocks that disappear fall away from where they were
    for (const [k, prev] of old) {
      if (seen.has(k)) continue;
      const ghost = prev.el.cloneNode(true);
      Object.assign(ghost.style, { position: 'absolute', left: `${prev.rect.left - stageRect.left}px`, top: `${prev.rect.top - stageRect.top}px`, margin: 0 });
      stage.append(ghost);
      ghost.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(40px) rotate(-6deg)' }], { duration: 420, easing: 'ease-in', fill: 'forwards' }).onfinish = () => ghost.remove();
    }
  }

  setTimeout(() => go(0), 50);
  return { el, stop: () => clearTimeout(timer) };
}
