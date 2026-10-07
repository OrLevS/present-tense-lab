// Minimal DOM helpers. No framework — every screen is a function that returns elements.

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'html') el.innerHTML = v;
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

// English text: LTR isolated span.
export const en = (text, cls = '') => h('span', { class: `en ${cls}`.trim(), dir: 'ltr', lang: 'en' }, text);

// Mixed Hebrew/Arabic/Russian text with English fragments → wrap Latin runs so they stay readable in RTL.
const LATIN_RUN = /([A-Za-z“"'][A-Za-z0-9'’/·+\-=→… ,.:?!“”"()]*[A-Za-z0-9.?!”"…)]|[A-Za-z])/g;
export function bidi(text) {
  const frag = document.createDocumentFragment();
  const s = String(text ?? '');
  let last = 0;
  for (const m of s.matchAll(LATIN_RUN)) {
    let run = m[0];
    // A final "." that ends a Hebrew/Arabic sentence belongs to that sentence, not to the English fragment.
    const fullEnglishSentence = /^[“"]?[A-Z]/.test(run) && run.trim().split(/\s+/).length >= 3;
    if (run.length < s.length && /[^.?!][.?!]$/.test(run) && /[֐-ۿ]/.test(s) && !fullEnglishSentence) run = run.slice(0, -1);
    if (m.index > last) frag.append(s.slice(last, m.index));
    frag.append(h('bdi', { dir: 'ltr', class: 'en', lang: 'en' }, run));
    last = m.index + run.length;
  }
  if (last < s.length) frag.append(s.slice(last));
  return frag;
}

// Highlight a word/phrase inside an English sentence.
export function highlightEn(sentence, target, markRegex) {
  const span = h('span', { class: 'en', dir: 'ltr', lang: 'en' });
  if (!target) { span.append(sentence); return span; }
  const i = sentence.toLowerCase().indexOf(target.toLowerCase());
  if (i < 0) { span.append(sentence); return span; }
  span.append(sentence.slice(0, i), h('span', { class: 'hl' }, markEnding(sentence.slice(i, i + target.length), markRegex)), sentence.slice(i + target.length));
  return span;
}

// Mark the -s / -es ending of a verb in gold.
export function markEnding(word, regex) {
  if (!regex) return word;
  const m = regex === 'es?'
    ? word.match(/^(.*(?:ch|sh|ss|x))(es)$/i) || word.match(/^(.*[^s])(s)$/i)
    : word.match(new RegExp(`^(.*?)(${regex})$`));
  if (!m || !m[1]) return word;
  const frag = document.createDocumentFragment();
  frag.append(m[1], h('span', { class: 'mark-s' }, m[2]));
  return frag;
}

// ---------- audio (browser speech, English voice) ----------
let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices();
  voice = vs.find((v) => /en-US/i.test(v.lang) && /female|samantha|aria|jenny|google us/i.test(v.name)) || vs.find((v) => /^en/i.test(v.lang)) || null;
  return voice;
}
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = pickVoice;

export function speak(text, rate = 0.85) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  u.voice = voice || pickVoice();
  speechSynthesis.speak(u);
}

export const speakBtn = (text, label = '🔊') => h('button', { class: 'icon-btn', type: 'button', 'aria-label': `Listen: ${text}`, onclick: (e) => { e.stopPropagation(); speak(text); } }, label);

// Seeded shuffle — same order every time for the same item (no surprise re-ordering on re-render).
export function shuffle(arr, seedStr = '') {
  let seed = [...seedStr].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' }) + ' ' + d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}
