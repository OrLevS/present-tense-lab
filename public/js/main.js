// App entry: boot, shells (student / teacher / preview) and routes.

import { h, clear } from './ui/dom.js';
import { t, L, LANGS, setLang, getLang, bwd } from './i18n.js';
import { openToolbox } from './ui/components.js';
import { on, otherwise, start, go, render } from './router.js';
import { api, hasToken, setToken } from './api.js';
import { app } from './state.js';
import { loginScreen, applyDir, logout } from './screens/login.js';
import { studentHome } from './screens/studentHome.js';
import { lessonPlayer } from './screens/lessonPlayer.js';
import { teacherOverview, teacherStudents, teacherStudent, teacherCurriculum, teacherVocab, teacherModules, teacherSettings } from './screens/teacher.js';
import { MODULE_BY_ID, VOCAB_SETS, SKILL_BY_ID, toLesson, allItems } from './content/index.js';
import { isWordTaught, itemBlockers } from './logic/unlock.js';

const root = document.getElementById('app');

async function loadStudent() {
  const s = await api.studentState();
  Object.assign(app, { student: s.student, settings: s.settings, assignments: s.assignments, progress: s.progress, responses: s.responses, notes: s.notes });
  app.user = { role: 'student', id: s.student.id, name: s.student.name };
  setLang(s.student.language);
  applyDir();
}

async function loadTeacher() {
  app.teacher = await api.teacherState();
  app.settings = app.teacher.settings;
  app.user = { role: 'teacher', id: app.teacher.teacher.id, name: app.teacher.teacher.name };
}

// ---------- shells ----------
function studentShell(mode = 'dashboard') {
  clear(root);
  const lesson = mode === 'lesson';
  const lang = h('select', { class: 'lang-select', 'aria-label': t('help_language'), onchange: async (e) => {
    setLang(e.target.value); applyDir();
    if (!app.preview) { app.student.language = e.target.value; api.setLanguage(e.target.value).catch(() => {}); }
    render();
  } }, Object.entries(LANGS).map(([k, v]) => h('option', { value: k, selected: k === getLang() }, v.name)));
  // Lesson page = fewer choices: only "back to my dashboard" + the toolbox. Dashboard = language, toolbox, logout.
  const bar = h('header', { class: `topbar ${lesson ? 'lesson-bar' : ''}` },
    lesson && !app.preview
      ? h('button', { class: 'icon-btn', type: 'button', onclick: () => go('/s/home') }, `${bwd()} ${t('back_dashboard')}`)
      : h('button', { class: 'brand', type: 'button', onclick: () => go(app.preview ? '/t/modules' : '/s/home') }, h('span', { class: 'logo', 'aria-hidden': 'true' }, 'S'), h('span', {}, app.preview ? 'Preview' : app.user.name)),
    h('span', { class: 'spacer' }),
    h('button', { class: 'icon-btn', type: 'button', onclick: openToolbox }, '🧰 ', t('toolbox')),
    lesson && !app.preview ? null : h('label', { class: 'sr-only', for: 'langsel' }, t('help_language')),
    lesson && !app.preview ? null : lang,
    app.preview || lesson ? null : h('button', { class: 'icon-btn', type: 'button', onclick: isTestMode() ? backToTeacher : logout }, isTestMode() ? 'חזרה למורה' : t('logout')));
  lang.id = 'langsel';
  root.append(bar);
  if (isTestMode() && !app.preview) root.append(testBanner());
  const main = h('main', {});
  root.append(main);
  return main;
}

// ---------- teacher "Student view" = a hidden TEST student (never in the class list or analytics) ----------
const isTestMode = () => { try { return !!sessionStorage.getItem('pl_teacher_token'); } catch { return false; } };
async function enterStudentView() {
  const res = await api.startTestStudent();
  try { sessionStorage.setItem('pl_teacher_token', sessionStorage.getItem('pl_token')); } catch { /* ignore */ }
  setToken(res.token);
  try { sessionStorage.setItem('pl_role', 'student'); } catch { /* ignore */ }
  location.hash = '/s/home';
  location.reload();
}
function backToTeacher() {
  let tok = null;
  try { tok = sessionStorage.getItem('pl_teacher_token'); sessionStorage.removeItem('pl_teacher_token'); sessionStorage.setItem('pl_role', 'teacher'); } catch { /* ignore */ }
  setToken(tok);
  location.hash = '/t/overview';
  location.reload();
}
function testBanner() {
  return h('div', { class: 'preview-banner', dir: 'rtl', lang: 'he' },
    h('b', {}, '👁 תצוגת תלמיד — מצב בדיקה'), ' אתם תלמיד/ה לדוגמה: אותן נעילות והגדרות כמו לכיתה. ההתקדמות נשמרת רק לתלמיד הבדיקה ולא מופיעה בנתוני הכיתה.',
    h('button', { class: 'btn small ghost', type: 'button', onclick: async () => { if (confirm('למחוק את כל ההתקדמות של תלמיד הבדיקה ולהתחיל מחדש?')) { await api.resetTestStudent(); location.hash = '/s/home'; location.reload(); } } }, '↺ איפוס תלמיד הבדיקה'),
    h('button', { class: 'btn small ghost', type: 'button', onclick: backToTeacher }, '← חזרה ללוח המורה'));
}

function teacherShell() {
  clear(root);
  document.documentElement.lang = 'he';
  document.documentElement.dir = 'rtl';
  root.append(h('header', { class: 'topbar' },
    h('a', { class: 'brand', href: '#/t/overview' }, h('span', { class: 'logo', 'aria-hidden': 'true' }, 'S'), 'מעבדת ההווה · לוח מורה'),
    h('span', { class: 'spacer' }),
    h('button', { class: 'icon-btn', type: 'button', onclick: enterStudentView, title: 'להיכנס לאפליקציה כמו תלמיד/ה ולבדוק אותה' }, '👁 תצוגת תלמיד'),
    h('button', { class: 'icon-btn', type: 'button', onclick: logout }, 'יציאה')));
  const main = h('main', {});
  root.append(main);
  return main;
}

// ---------- guards ----------
const asStudent = (fn, mode = 'dashboard') => async (params) => {
  if (app.user?.role !== 'student') return go('/');
  app.preview = null;
  fn(studentShell(mode), params);
};

const asTeacher = (fn) => async (params) => {
  if (app.user?.role !== 'teacher') return go('/');
  app.preview = null;
  app.student = null;
  setLang('he');
  fn(teacherShell(), params);
};

// ---------- routes ----------
on('/', () => {
  if (app.user?.role === 'student') return go('/s/home');
  if (app.user?.role === 'teacher') return go('/t/overview');
  clear(root);
  applyDir();
  loginScreen(root, {
    onLoggedIn: async (user) => {
      if (user.role === 'student') { await loadStudent(); go('/s/home'); }
      else { await loadTeacher(); go('/t/overview'); }
    },
  });
});

on('/s/home', asStudent((main) => studentHome(main)));
on('/s/module/:id', asStudent((main, { id }) => lessonPlayer(main, id), 'lesson'));
on('/s/words/:setId', asStudent((main, { setId }) => {
  const set = VOCAB_SETS.find((s) => s.id === setId);
  const words = set.words.filter((w) => isWordTaught(w, app.settings));
  lessonPlayer(main, toLesson({ id: `words_${set.id}`, kind: 'review', grammarSkill: null, theme: set.theme, title: { he: t('words_of', { set: L(set.name) }), ru: t('words_of', { set: L(set.name) }), ar: t('words_of', { set: L(set.name) }), en: t('words_of', { set: L(set.name) }) }, goal: { he: t('review_sub'), ru: t('review_sub'), ar: t('review_sub'), en: t('review_sub') }, focusWords: words, steps: ['words'], check: [], practice: [], produce: [], exitTicket: [], remediation: {} }));
}, 'lesson'));

on('/t/overview', asTeacher(teacherOverview));
on('/t/students', asTeacher(teacherStudents));
on('/t/student/:id', asTeacher(teacherStudent));
on('/t/curriculum', asTeacher(teacherCurriculum));
on('/t/vocab', asTeacher(teacherVocab));
on('/t/modules', asTeacher(teacherModules));
on('/t/settings', asTeacher(teacherSettings));

// Teacher preview: the exact student screens, nothing saved, with required grammar/vocab/prereqs on top.
on('/t/preview/:moduleId/:level', async ({ moduleId, level }) => {
  if (app.user?.role !== 'teacher') return go('/');
  const m = MODULE_BY_ID[moduleId];
  app.preview = { moduleId, level };
  app.student = null;
  app.progress = [];
  if (!LANGS[getLang()]) setLang('he');
  applyDir();
  const main = studentShell('lesson');
  const s = app.settings;
  const hidden = allItems(m).filter((it) => itemBlockers(it, s, null).length);
  const banner = h('div', { class: 'preview-banner', dir: 'rtl', lang: 'he' },
    h('b', {}, `תצוגה מקדימה · רמה: ${level}`), ' — כך התלמיד/ה רואה. שום דבר לא נשמר. אפשר לקפוץ בין שלבים.',
    h('span', {}, ` · דקדוק: ${(m.skills || [m.grammarSkill]).map((x) => SKILL_BY_ID[x]?.name.he).join(', ')}`),
    h('span', {}, ` · דרישות קדם: ${(m.requiredSkills || []).map((x) => SKILL_BY_ID[x]?.name.he).join(', ') || '—'}`),

    hidden.length ? h('span', {}, ` · ${hidden.length} פריטים מוסתרים (חומר שלא נלמד)`) : null,
    ['easy', 'medium', 'hard'].filter((lv) => lv !== level && m.kind !== 'review').map((lv) => h('a', { href: `#/t/preview/${moduleId}/${lv}` }, `Preview ${lv}`)),
    h('a', { href: '#/t/modules' }, '← חזרה ללוח'));
  main.before(banner);
  lessonPlayer(main, moduleId, { previewLevel: level });
});

otherwise(() => go('/'));

// ---------- boot ----------
(async () => {
  let role = null;
  try { role = sessionStorage.getItem('pl_role'); } catch { /* ignore */ }
  if (hasToken() && role) {
    try { role === 'student' ? await loadStudent() : await loadTeacher(); } catch { /* token expired → login */ }
  }
  applyDir();
  start();
})();
