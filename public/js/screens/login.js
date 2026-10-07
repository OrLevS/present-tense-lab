// Login / role selection. Students: tap your name → 4-digit code on a big keypad.

import { h, clear, bidi } from '../ui/dom.js';
import { t, LANGS, setLang, getLang, dir, fwd, bwd } from '../i18n.js';
import { api, setToken } from '../api.js';
import { go } from '../router.js';

export function loginScreen(root, { onLoggedIn }) {
  const wrap = h('div', { class: 'login' });
  root.append(wrap);
  showRoles();

  function langPicker() {
    return h('select', { class: 'lang-select', 'aria-label': t('help_language'), onchange: (e) => { setLang(e.target.value); applyDir(); clear(root); loginScreen(root, { onLoggedIn }); } },
      Object.entries(LANGS).map(([k, v]) => h('option', { value: k, selected: k === getLang() }, v.name)));
  }

  function header() {
    return h('div', { class: 'row', style: { marginBottom: '20px' } },
      h('div', { class: 'brand row' }, h('span', { class: 'logo', style: { width: '48px', height: '48px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--gold)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '1.5rem' } }, 'S'),
        h('div', {}, h('h1', { style: { margin: 0 } }, t('app_name')), h('div', { class: 'muted small en', dir: 'ltr' }, 'Present Simple · Present Progressive'))),
      h('span', { class: 'spacer', style: { flex: 1 } }), langPicker());
  }

  function showRoles() {
    clear(wrap).append(header(), h('div', { class: 'card' },
      h('h2', {}, t('who_are_you')),
      h('div', { class: 'roles' },
        h('button', { class: 'role', type: 'button', onclick: showNames }, h('span', { class: 'big-emoji', 'aria-hidden': 'true' }, '🎒'), t('student')),
        h('button', { class: 'role', type: 'button', onclick: () => showPin({ role: 'teacher', name: t('teacher') }) }, h('span', { class: 'big-emoji', 'aria-hidden': 'true' }, '🍎'), t('teacher')))));
  }

  async function showNames() {
    const names = await api.studentNames();
    clear(wrap).append(header(), h('div', { class: 'card' },
      h('h2', {}, t('choose_name')),
      h('div', { class: 'names' }, names.map((s) => h('button', { class: 'role', type: 'button', onclick: () => showPin({ role: 'student', studentId: s.id, name: s.name, language: s.language, firstTime: !s.hasPin }) }, s.name)))),
    h('button', { class: 'btn', type: 'button', onclick: showRoles }, `${bwd()} ${t('back')}`));
  }

  // who.firstTime → the student has no code yet: choose 4 digits, type them again, done.
  function showPin(who) {
    let pin = '';
    let firstEntry = null;
    const prompt = h('p', {}, who.firstTime ? t('choose_code') : t('enter_code'));
    const dots = h('div', { class: 'pindots', 'aria-hidden': 'true' }, [0, 1, 2, 3].map(() => h('i')));
    const msg = h('p', { class: 'warn hidden', role: 'alert' });
    const draw = () => dots.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i < pin.length));
    const press = async (d) => {
      if (d === 'del') pin = pin.slice(0, -1);
      else if (pin.length < 4) pin += d;
      draw();
      if (pin.length === 4 && who.firstTime) {
        if (firstEntry == null) { firstEntry = pin; pin = ''; draw(); prompt.textContent = t('confirm_code'); msg.classList.add('hidden'); return; }
        if (pin !== firstEntry) { firstEntry = null; pin = ''; draw(); prompt.textContent = t('choose_code'); msg.textContent = t('codes_differ'); msg.classList.remove('hidden'); return; }
        try {
          const res = await api.firstPin({ studentId: who.studentId, pin });
          setToken(res.token);
          try { sessionStorage.setItem('pl_role', 'student'); } catch { /* ignore */ }
          onLoggedIn(res.user);
        } catch {
          firstEntry = null; pin = ''; draw(); prompt.textContent = t('enter_code'); who.firstTime = false;
          msg.textContent = t('wrong_code'); msg.classList.remove('hidden');
        }
        return;
      }
      if (pin.length === 4) {
        try {
          const res = await api.login({ role: who.role, studentId: who.studentId, pin });
          setToken(res.token);
          try { sessionStorage.setItem('pl_role', res.user.role); } catch { /* ignore */ }
          onLoggedIn(res.user);
        } catch (err) {
          pin = ''; draw();
          msg.textContent = t(err.status === 429 ? 'too_many' : 'wrong_code'); msg.classList.remove('hidden');
        }
      }
    };
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0'].map((k) => h('button', { type: 'button', 'aria-label': k === 'del' ? 'delete' : k, onclick: () => press(k) }, k === 'del' ? '⌫' : k));
    const onKey = (e) => { if (/^\d$/.test(e.key)) press(e.key); if (e.key === 'Backspace') press('del'); };
    document.addEventListener('keydown', onKey);
    const back = h('button', { class: 'btn', type: 'button', onclick: () => { document.removeEventListener('keydown', onKey); who.role === 'student' ? showNames() : showRoles(); } }, `${bwd()} ${t('back')}`);
    clear(wrap).append(header(), h('div', { class: 'card', style: { textAlign: 'center' } },
      h('h2', {}, who.name), prompt, who.firstTime ? h('p', { class: 'small muted' }, t('code_tip')) : null, dots, msg, h('div', { class: 'pinpad' }, keys)), back);
    // remove listener once logged in
    const stop = () => document.removeEventListener('keydown', onKey);
    window.addEventListener('hashchange', stop, { once: true });
  }
}

export function applyDir() {
  document.documentElement.lang = getLang();
  document.documentElement.dir = dir();
}

export function logout() {
  setToken(null);
  try { sessionStorage.removeItem('pl_role'); } catch { /* ignore */ }
  go('/');
  location.reload();
}

export { bidi };
