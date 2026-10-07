// Teacher dashboard (Hebrew UI). Tabs: class overview · students · curriculum · vocabulary · activities & preview · settings.

import { h, clear, en, fmtDate, bidi } from '../ui/dom.js';
import { statusChip } from '../ui/components.js';
import { LANGS } from '../i18n.js';
import { SKILLS, SKILL_BY_ID, OVERVIEW_COLUMNS, ERROR_TAGS, VOCAB_SETS, WORD_BY_ID, MODULES, REVIEW_MODULES, MODULE_BY_ID, findItem, allItems } from '../content/index.js';
import { isSkillUnlocked, prerequisitesMet, setTaughtState, moduleBlockers, itemBlockers } from '../logic/unlock.js';
import { overviewRow, skillEvidence, errorTrends } from '../logic/mastery.js';
import { resolveConfig, modelAnswer } from '../logic/score.js';
import { estMinutes, lessonMinutes } from './lessonPlayer.js';
import { app } from '../state.js';
import { api } from '../api.js';
import { go, current } from '../router.js';

const LEVEL_HE = { choose: 'התלמיד/ה בוחר/ת', easy: 'קל (נקבע)', medium: 'בינוני (נקבע)', hard: 'מאתגר (נקבע)' };
const STEP_HE = { check: 'בדיקה', practice: 'תרגול', produce: 'כתיבה עצמאית', exit: 'כרטיס יציאה', remediation: 'תיקון ממוקד' };
const maxFeedback = (r) => Math.max(0, ...(r.attemptLog || []).map((a) => a.feedbackLevel || 0));
const tagHe = (tag) => ERROR_TAGS[tag]?.he || tag;
const skillHe = (id) => SKILL_BY_ID[id]?.name.he || id;
const wordHe = (id) => `${WORD_BY_ID[id]?.en || id}`;

async function refresh() {
  app.teacher = await api.teacherState();
  app.settings = app.teacher.settings;
}

function tabs() {
  const items = [['/t/overview', 'סקירת כיתה'], ['/t/students', 'תלמידים'], ['/t/curriculum', 'תוכנית לימוד'], ['/t/vocab', 'אוצר מילים'], ['/t/modules', 'שיעורים ותצוגה מקדימה'], ['/t/settings', 'הגדרות']];
  const cur = current();
  return h('nav', { class: 'tabs', 'aria-label': 'תפריט מורה' }, items.map(([href, label]) => h('a', { href: '#' + href, class: cur.startsWith(href) ? 'active' : '' }, label)));
}

function shell(root, title, ...content) {
  root.append(h('div', { class: 'page wide' }, tabs(), title ? h('h1', {}, title) : null, ...content));
}

// ============ CLASS OVERVIEW ============
export async function teacherOverview(root) {
  await refresh();
  const { students, responses, settings, events } = app.teacher;
  const rows = students.map((s) => {
    const rs = responses.filter((r) => r.studentId === s.id);
    const exit = rs.filter((r) => r.isExitTicket);
    const last = rs.map((r) => r.timestamp).sort().pop();
    return { s, rs, row: overviewRow(rs, settings.thresholds), exit, last, toolbox: events.filter((e) => e.studentId === s.id && e.type === 'toolbox_open').length };
  });
  const trends = errorTrends(responses);
  const max = Math.max(1, ...trends.map(([, n]) => n));
  shell(root, 'סקירת כיתה',
    h('p', { class: 'muted' }, 'מצב לפי מיומנות — לא ציון כולל ולא דירוג. לחיצה על תלמיד/ה פותחת את כל הראיות, כולל התשובות המקוריות.'),
    h('div', { class: 'row', style: { marginBottom: '12px' } }, ['mastered', 'practicing', 'needs_support', 'not_started'].map((s) => statusChip(s, { teacher: true }))),
    h('div', { class: 'table-wrap' }, h('table', { class: 'data' },
      h('thead', {}, h('tr', {}, h('th', {}, 'תלמיד/ה'), OVERVIEW_COLUMNS.map((c) => h('th', {}, en(c.label))), h('th', {}, 'כרטיס יציאה'), h('th', {}, 'רמת עזרה'), h('th', {}, 'ארגז כלים'), h('th', {}, 'פעילות אחרונה'))),
      h('tbody', {}, rows.map(({ s, row, exit, last, toolbox }) => h('tr', { class: 'clickable', tabindex: 0, onclick: () => go(`/t/student/${s.id}`), onkeydown: (e) => { if (e.key === 'Enter') go(`/t/student/${s.id}`); } },
        h('td', {}, h('b', {}, s.name), ' ', h('span', { class: 'small muted' }, LANGS[s.language]?.name)),
        OVERVIEW_COLUMNS.map((c) => h('td', {}, statusChip(row[c.id], { teacher: true }))),
        h('td', {}, exit.length ? `${exit.filter((r) => r.grammarCorrect || r.teacherOverride === 'correct').length}/${exit.length}` : '—'),
        h('td', { class: 'small' }, LEVEL_HE[s.difficultyPolicy]),
        h('td', {}, toolbox || '—'),
        h('td', { class: 'small' }, fmtDate(last))))))),
    h('div', { class: 'card', style: { marginTop: '20px' } },
      h('h2', {}, 'מגמות שגיאה בכיתה (לפי מושג דקדוקי)'),
      trends.length ? trends.map(([tag, n]) => h('div', { class: 'bar-row' }, h('span', {}, tagHe(tag)), h('div', { class: 'bar', style: { width: `${(n / max) * 100}%` } }), h('b', {}, n))) : h('p', { class: 'muted' }, 'אין עדיין נתונים.'),
      h('p', { class: 'small muted' }, 'כתיב ואוצר מילים נספרים בנפרד מדקדוק: "watchs" נרשם כטעות כתיב, לא כטעות ב-S.')));
}

// ============ STUDENTS ============
export async function teacherStudents(root) {
  await refresh();
  const { students } = app.teacher;
  const msg = h('p', { class: 'small', role: 'status' });
  const name = h('input', { class: 'field', placeholder: 'שם', 'aria-label': 'שם' });
  const pin = h('input', { class: 'field', placeholder: 'קוד (לא חובה)', inputmode: 'numeric', maxlength: 4, 'aria-label': 'קוד', style: { width: '140px' } });
  const lang = langSelect(app.settings.defaultLanguage);
  shell(root, 'תלמידים',
    h('div', { class: 'card' }, h('h2', {}, 'הוספת תלמיד/ה'),
      h('div', { class: 'row' }, name, pin, lang, h('button', { class: 'btn primary', type: 'button', onclick: async () => {
        try { await api.addStudent({ name: name.value, pin: pin.value, language: lang.value }); go('/t/students'); }
        catch (e) { msg.textContent = 'נדרש שם. קוד — 4 ספרות, או להשאיר ריק והתלמיד/ה יבחר/תבחר בכניסה הראשונה.'; }
      } }, 'הוספה')), msg),
    h('div', { class: 'table-wrap' }, h('table', { class: 'data' },
      h('thead', {}, h('tr', {}, h('th', {}, 'שם'), h('th', {}, 'קוד כניסה'), h('th', {}, 'שפת עזרה'), h('th', {}, 'רמת עזרה'), h('th', {}, ''))),
      h('tbody', {}, students.map((s) => {
        const pinIn = s.pin
          ? h('span', { class: 'row', style: { gap: '6px' } }, h('b', { class: 'en', style: { fontSize: '1.1rem', letterSpacing: '.15em' } }, s.pin),
              h('button', { class: 'btn small ghost', type: 'button', title: 'התלמיד/ה יבחר/תבחר קוד חדש בכניסה הבאה', onclick: async () => { if (confirm(`לאפס את הקוד של ${s.name}? בכניסה הבאה ${s.name} יבחר/תבחר קוד חדש.`)) { await save(s.id, { pin: null }); go(current()); } } }, 'איפוס קוד'))
          : h('span', { class: 'muted small' }, 'עוד לא נבחר — ייבחר בכניסה הראשונה');
        return h('tr', {},
          h('td', {}, h('b', {}, s.name)),
          h('td', {}, pinIn),
          h('td', {}, langSelect(s.language, (v) => save(s.id, { language: v }))),
          h('td', {}, policySelect(s.difficultyPolicy, (v) => save(s.id, { difficultyPolicy: v }))),
          h('td', {}, h('a', { href: `#/t/student/${s.id}`, class: 'btn small' }, 'פרטים וראיות')));
      })))));
  async function save(id, patch) {
    try { await api.updateStudent(id, patch); msg.textContent = 'נשמר ✓'; } catch { msg.textContent = 'השמירה נכשלה (קוד חייב להיות 4 ספרות).'; }
  }
}

function langSelect(value, onChange) {
  return h('select', { class: 'field', 'aria-label': 'שפת עזרה', onchange: (e) => onChange?.(e.target.value) }, Object.entries(LANGS).map(([k, v]) => h('option', { value: k, selected: k === value }, v.name)));
}
function policySelect(value, onChange) {
  return h('select', { class: 'field', 'aria-label': 'רמת עזרה', onchange: (e) => onChange?.(e.target.value) }, Object.entries(LEVEL_HE).map(([k, v]) => h('option', { value: k, selected: k === value }, v)));
}

// ============ STUDENT DETAIL ============
export async function teacherStudent(root, { id }) {
  await refresh();
  const { students, responses, settings, progress, events, notes } = app.teacher;
  const s = students.find((x) => x.id === id);
  if (!s) return shell(root, 'לא נמצא');
  const rs = responses.filter((r) => r.studentId === id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const ev = events.filter((e) => e.studentId === id);
  const unlocked = SKILLS.filter((sk) => isSkillUnlocked(sk.id, settings, s));
  const trends = errorTrends(rs);
  const studentNotes = notes.filter((n) => n.studentId === id && !n.responseId);

  // --- module progress with reopen / reset ---
  const progressCard = h('div', { class: 'card' }, h('h2', {}, 'פעילויות'),
    [...MODULES, ...REVIEW_MODULES].filter((m) => progress.some((p) => p.studentId === id && p.moduleId === m.id) || rs.some((r) => r.moduleId === m.id)).map((m) => {
      const p = progress.find((x) => x.studentId === id && x.moduleId === m.id);
      return h('div', { class: 'row', style: { justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', padding: '8px 0' } },
        h('div', {}, h('b', {}, m.title.he), ' ', h('span', { class: 'small muted' }, p ? (p.status === 'completed' ? `הושלם ${fmtDate(p.completedAt)}` : `בתהליך · ${(p.completedSteps || []).length}/${m.steps.length} שלבים`) : ''), p?.difficulty ? h('span', { class: 'small muted' }, ` · רמה: ${p.difficulty}`) : null),
        h('div', { class: 'row' },
          h('button', { class: 'btn small', type: 'button', onclick: async () => { await api.reopen({ studentId: id, moduleId: m.id }); go(current()); } }, 'פתיחה מחדש'),
          h('button', { class: 'btn small ghost', type: 'button', onclick: async () => { if (confirm(`לאפס את "${m.title.he}" עבור ${s.name}? התשובות יועברו לארכיון.`)) { await api.reset({ studentId: id, moduleId: m.id }); go(current()); } } }, 'איפוס')));
    }));

  // --- per-skill evidence ---
  const evidence = h('div', { class: 'card' }, h('h2', {}, 'שליטה לפי מיומנות'),
    h('p', { class: 'small muted' }, `ספים: זיהוי ${settings.thresholds.recognition.need}/${settings.thresholds.recognition.of} · הפקה עם תמיכה ${settings.thresholds.supported.need}/${settings.thresholds.supported.of} · הפקה עצמאית ${settings.thresholds.independent.need} משפטים בלי רמזים`),
    h('div', { class: 'table-wrap' }, h('table', { class: 'data' },
      h('thead', {}, h('tr', {}, h('th', {}, 'מיומנות'), h('th', {}, 'מצב'), h('th', {}, 'זיהוי'), h('th', {}, 'הפקה עם תמיכה'), h('th', {}, 'הפקה עצמאית'), h('th', {}, 'כרטיס יציאה'))),
      h('tbody', {}, unlocked.map((sk) => {
        const e = skillEvidence(rs, sk.id, settings.thresholds);
        const cell = (x) => h('td', { class: x.met ? 'yes' : '' }, `${x.good}/${x.need}${x.met ? ' ✓' : ''}`);
        return h('tr', {}, h('td', {}, sk.name.he), h('td', {}, statusChip(e.status, { teacher: true })), cell(e.recognition), cell(e.supported), cell(e.independent), h('td', {}, e.exitTicket.total ? `${e.exitTicket.good}/${e.exitTicket.total}` : '—'));
      })))));

  // --- exit tickets ---
  const exits = rs.filter((r) => r.isExitTicket);
  const exitCard = h('div', { class: 'card' }, h('h2', {}, 'כרטיסי יציאה (המדד הטוב ביותר לשליטה עצמאית)'),
    exits.length ? exits.map((r) => h('div', { class: 'row', style: { borderBottom: '1px dashed var(--line)', padding: '6px 0' } },
      h('span', { class: r.grammarCorrect ? 'yes' : 'no' }, r.grammarCorrect ? '✓' : '✗'), en(r.finalResponse), r.correct ? null : h('span', { class: 'small muted' }, '→ ', en(r.correctedResponse)), h('span', { class: 'small muted' }, (r.errorTags || []).map(tagHe).join(', ')))) : h('p', { class: 'muted' }, 'עדיין לא בוצע כרטיס יציאה.'));

  // --- overrides ---
  const overrides = structuredClone(s.overrides || { skills: {}, prereq: {} });
  const overrideCard = h('div', { class: 'card' }, h('h2', {}, 'התאמות אישיות'),
    h('div', { class: 'row' }, h('label', {}, 'רמת עזרה: '), policySelect(s.difficultyPolicy, async (v) => { await api.updateStudent(id, { difficultyPolicy: v }); }), h('label', {}, ' שפת עזרה: '), langSelect(s.language, async (v) => { await api.updateStudent(id, { language: v }); })),
    h('p', { class: 'small muted', style: { marginTop: '12px' } }, 'פתיחת מיומנות לתלמיד/ה זה/זו בלבד, או עקיפה ידנית של דרישות קדם:'),
    h('div', { class: 'table-wrap' }, h('table', { class: 'data' }, h('tbody', {}, SKILLS.slice(0, 13).map((sk) => h('tr', {},
      h('td', {}, sk.name.he),
      h('td', {}, h('select', { class: 'field', onchange: async (e) => { overrides.skills[sk.id] = e.target.value || undefined; if (!e.target.value) delete overrides.skills[sk.id]; await api.updateStudent(id, { overrides }); } },
        [['', 'לפי הכיתה'], ['unlock', 'פתוח לתלמיד/ה'], ['lock', 'נעול לתלמיד/ה']].map(([v, l]) => h('option', { value: v, selected: (overrides.skills[sk.id] || '') === v }, l)))),
      h('td', {}, h('label', { class: 'toggle' }, h('input', { type: 'checkbox', checked: !!overrides.prereq[sk.id], onchange: async (e) => { if (e.target.checked) overrides.prereq[sk.id] = true; else delete overrides.prereq[sk.id]; await api.updateStudent(id, { overrides }); } }), 'עקיפת דרישות קדם'))))))));

  // --- message to student ---
  const noteIn = h('textarea', { class: 'field', rows: 2, style: { width: '100%' }, placeholder: 'הודעה קצרה שתופיע בדף הבית של התלמיד/ה' });
  const noteCard = h('div', { class: 'card' }, h('h2', {}, 'הודעה לתלמיד/ה'), noteIn,
    h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn small primary', type: 'button', onclick: async () => { if (noteIn.value.trim()) { await api.addNote({ studentId: id, text: noteIn.value.trim() }); go(current()); } } }, 'שליחה')),
    studentNotes.map((n) => h('div', { class: 'note row' }, h('span', { style: { flex: 1 } }, bidi(n.text)), h('span', { class: 'small muted' }, fmtDate(n.createdAt)), h('button', { class: 'btn small ghost', type: 'button', onclick: async () => { await api.deleteNote(n.id); go(current()); } }, 'מחיקה'))));

  // --- answers ---
  const filter = h('select', { class: 'field', 'aria-label': 'סינון', onchange: () => drawAnswers() }, [['all', 'כל התשובות'], ['wrong', 'רק עם טעויות'], ['exit', 'כרטיסי יציאה'], ['produce', 'כתיבה עצמאית'], ['review', 'דורש בדיקת מורה']].map(([v, l]) => h('option', { value: v }, l)));
  const tbody = h('tbody');
  const answersCard = h('div', { class: 'card' }, h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('h2', {}, 'התשובות של התלמיד/ה'), filter),
    h('div', { class: 'table-wrap answers' }, h('table', { class: 'data' },
      h('thead', {}, h('tr', {}, ['פעילות', 'תשובה מקורית', 'תשובה סופית', 'תשובה מתוקנת', 'דקדוק / כתיב / מילים', 'ניסיונות', 'רמזים ותמיכה', 'רמה', 'תגיות שגיאה', 'זמן', 'פעולות מורה'].map((x) => h('th', {}, x)))),
      tbody)));
  function drawAnswers() {
    clear(tbody);
    const f = filter.value;
    const list = rs.filter((r) => f === 'all' || (f === 'wrong' && r.errorTags.length) || (f === 'exit' && r.isExitTicket) || (f === 'produce' && r.stepType === 'produce') || (f === 'review' && r.needsTeacherReview));
    for (const r of list) {
      const found = findItem(r.activityId);
      const prompt = found?.item?.prompt?.he || found?.item?.instruction?.he || '';
      const fbIn = h('input', { class: 'field', value: r.teacherFeedback || '', placeholder: 'משוב', style: { width: '160px' } });
      const yn = (v) => h('span', { class: v ? 'yes' : 'no' }, v ? '✓' : '✗');
      tbody.append(h('tr', {},
        h('td', {}, h('div', { class: 'small' }, `${STEP_HE[r.stepType] || r.stepType}${r.isExitTicket ? ' 🎟️' : ''}`), h('div', { class: 'small muted' }, prompt), h('div', { class: 'small muted en' }, r.exerciseType)),
        h('td', {}, en(r.originalResponse)),
        h('td', {}, en(r.finalResponse)),
        h('td', {}, en(r.correctedResponse)),
        h('td', {}, yn(r.grammarCorrect || r.teacherOverride === 'correct'), ' / ', yn(r.spellingCorrect), ' / ', yn(r.vocabularyCorrect), r.teacherOverride === 'correct' ? h('div', { class: 'small ok' }, 'סומן נכון ע"י המורה') : null, r.needsTeacherReview ? h('div', { class: 'small' }, `לבדיקה: ${(r.unknownWords || []).join(', ')}`) : null, r.aiEvaluation ? h('div', { class: 'small muted' }, 'נבדק גם ע"י AI') : null),
        h('td', {}, String(r.attempts), r.revealed ? h('div', { class: 'small muted' }, 'התשובה הוצגה') : null),
        h('td', { class: 'small' }, [r.hintsUsed ? `רמזים שביקש/ה: ${r.hintsUsed}` : null, maxFeedback(r) ? `משוב מדורג עד שלב ${maxFeedback(r)}` : null, r.supportUsed?.wordBank ? 'בנק מילים' : null, r.supportUsed?.verbSupplied ? 'פועל נתון' : null, r.supportUsed?.starter ? 'התחלת משפט' : null, r.toolboxOpened ? '🧰 ארגז כלים' : null].filter(Boolean).join(' · ') || '—'),
        h('td', { class: 'small' }, r.difficulty || '—'),
        h('td', { class: 'small' }, (r.errorTags || []).map(tagHe).join(', ') || '—'),
        h('td', { class: 'small' }, fmtDate(r.timestamp), r.timeSpentSec ? h('div', { class: 'muted' }, `${r.timeSpentSec} שנ׳`) : null),
        h('td', {}, h('div', { class: 'stack' },
          h('button', { class: 'btn small', type: 'button', onclick: async () => { await api.updateResponse(r.id, { teacherOverride: r.teacherOverride === 'correct' ? null : 'correct' }); go(current()); } }, r.teacherOverride === 'correct' ? 'ביטול סימון' : 'סימון כנכון'),
          h('div', { class: 'row', style: { gap: '4px' } }, fbIn, h('button', { class: 'btn small ghost', type: 'button', onclick: async () => { await api.updateResponse(r.id, { teacherFeedback: fbIn.value.trim() }); fbIn.style.borderColor = 'var(--teal)'; } }, 'שמירה'))))));
    }
    if (!list.length) tbody.append(h('tr', {}, h('td', { colspan: 11, class: 'muted' }, 'אין תשובות להצגה.')));
  }
  drawAnswers();

  shell(root, null,
    h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('h1', {}, s.name), h('a', { class: 'btn small', href: '#/t/overview' }, '→ חזרה לכיתה')),
    h('p', { class: 'muted' }, `שפת עזרה: ${LANGS[s.language]?.name} · רמת עזרה: ${LEVEL_HE[s.difficultyPolicy]} · ארגז כלים נפתח ${ev.filter((e) => e.type === 'toolbox_open').length} פעמים · עזרת מילים ${ev.filter((e) => e.type === 'vocab_lookup').length} פעמים (לא נחשב כטעות)`),
    evidence,
    h('div', { class: 'grid2' }, exitCard, h('div', { class: 'card' }, h('h2', {}, 'מגמות שגיאה'), trends.length ? trends.map(([tag, n]) => h('div', { class: 'bar-row' }, h('span', {}, tagHe(tag)), h('div', { class: 'bar', style: { width: `${(n / Math.max(...trends.map((x) => x[1]))) * 100}%` } }), h('b', {}, n))) : h('p', { class: 'muted' }, 'אין שגיאות.'))),
    answersCard, progressCard, overrideCard, noteCard);
}

// ============ CURRICULUM (skills) ============
export async function teacherCurriculum(root) {
  await refresh();
  const settings = app.settings;
  const msg = h('span', { class: 'small ok', role: 'status' });
  const list = h('div', { class: 'table-wrap' }, h('table', { class: 'data' },
    h('thead', {}, h('tr', {}, h('th', {}, '#'), h('th', {}, 'מיומנות'), h('th', {}, 'דרישות קדם'), h('th', {}, 'נלמד / פתוח'), h('th', {}, 'היום'))),
    h('tbody', {}, SKILLS.map((sk) => {
      const unlocked = settings.unlockedSkills.includes(sk.id);
      const prereqOk = prerequisitesMet(sk.id, settings, null);
      return h('tr', {},
        h('td', {}, sk.order),
        h('td', {}, h('b', {}, sk.name.he), ' ', h('span', { class: 'small muted en' }, sk.short)),
        h('td', {}, sk.prerequisites.length ? sk.prerequisites.map((p) => h('span', { class: settings.unlockedSkills.includes(p) ? 'pill-ok' : 'pill-miss' }, skillHe(p))) : '—',
          unlocked && !prereqOk ? h('div', { class: 'warn', style: { marginTop: '6px' } }, '⚠ פתוח למרות שדרישות הקדם לא סומנו כנלמדו') : null),
        h('td', {}, h('label', { class: 'toggle' }, h('input', { type: 'checkbox', checked: unlocked, onchange: async (e) => {
          if (e.target.checked && !prereqOk && !confirm('דרישות הקדם של מיומנות זו עוד לא סומנו כנלמדו. לפתוח בכל זאת?')) { e.target.checked = false; return; }
          const next = e.target.checked ? [...new Set([...settings.unlockedSkills, sk.id])] : settings.unlockedSkills.filter((x) => x !== sk.id);
          await api.saveSettings({ unlockedSkills: next, ...(e.target.checked ? {} : settings.todaySkill === sk.id ? { todaySkill: null } : {}) });
          go(current());
        } }), unlocked ? 'פתוח' : 'נעול')),
        h('td', {}, h('input', { type: 'radio', name: 'today', checked: settings.todaySkill === sk.id, 'aria-label': `היום: ${sk.name.he}`, onchange: async () => {
          const next = [...new Set([...settings.unlockedSkills, sk.id])];
          await api.saveSettings({ todaySkill: sk.id, unlockedSkills: next });
          msg.textContent = 'נשמר ✓'; go(current());
        } })));
    }))));
  shell(root, 'תוכנית לימוד — מיומנויות דקדוק',
    h('p', { class: 'muted' }, 'התלמידים רואים "כבר למדנו / היום / בהמשך" בדיוק לפי מה שמסומן כאן. תרגיל שדורש מיומנות נעולה לא יופיע לתלמידים.'),
    msg, list);
}

// ============ VOCABULARY ============
export async function teacherVocab(root) {
  await refresh();
  const settings = app.settings;
  const taught = new Set(settings.taughtWords);
  const saveWords = async () => { await api.saveSettings({ taughtWords: [...taught] }); go(current()); };
  shell(root, 'אוצר מילים — מה כבר נלמד בכיתה',
    h('p', { class: 'muted' }, 'אפשר לסמן סט שלם או מילים בודדות. פעילות שצריכה מילה שלא נלמדה נשארת נעולה — תלמידים לא יתבקשו ללמוד מילים לבד כדי להתקדם.'),
    VOCAB_SETS.map((vs) => {
      const state = setTaughtState(vs.id, settings);
      return h('div', { class: 'card' },
        h('div', { class: 'row', style: { justifyContent: 'space-between' } },
          h('h2', { style: { margin: 0 } }, vs.name.he, ' ', h('span', { class: 'small muted en' }, vs.name.en)),
          h('div', { class: 'row' },
            h('span', { class: state === 'all' ? 'pill-ok' : state === 'partial' ? 'pill-miss' : 'small muted' }, state === 'all' ? 'כל הסט נלמד' : state === 'partial' ? 'נלמד חלקית' : 'לא נלמד'),
            h('button', { class: 'btn small', type: 'button', onclick: () => { vs.words.forEach((w) => taught.add(w)); saveWords(); } }, 'סימון כל הסט'),
            h('button', { class: 'btn small ghost', type: 'button', onclick: () => { vs.words.forEach((w) => taught.delete(w)); saveWords(); } }, 'ביטול'))),
        h('div', { class: 'chips', style: { marginTop: '12px' } }, vs.words.map((w) => h('label', { class: 'chip word toggle' },
          h('input', { type: 'checkbox', checked: taught.has(w), onchange: (e) => { e.target.checked ? taught.add(w) : taught.delete(w); saveWords(); } }),
          en(WORD_BY_ID[w].en), h('span', { class: 'small muted' }, WORD_BY_ID[w].tr.he)))));
    }));
}

// ============ ACTIVITIES: assign + preview ============
export async function teacherModules(root) {
  await refresh();
  const { settings, students, assignments } = app.teacher;
  const TYPE_HE = { multiple_choice: 'בחירה', fill_blank: 'השלמה', sentence_builder: 'בניית משפט', translate: 'תרגום להפקה', translate_multi: 'זוג משפטים', error_correction: 'תיקון טעות', choose_sentence: 'בחירת משפט', transform: 'שכתוב', sort: 'מיון', match: 'התאמה', pair_fill: 'אותו פועל – שני משפטים', text_gaps: 'צ׳אט עם השלמות', listen_choose: 'האזנה', wh_scaffold: 'מי/מה/איפה/מתי ← משפט', free_production: 'כתיבה חופשית' };
  const cards = [...MODULES, ...REVIEW_MODULES].map((m) => {
    const items = allItems(m);
    const hidden = items.map((it) => ({ it, b: itemBlockers(it, settings, null) })).filter((x) => x.b.length);
    const taught = new Set(settings.taughtWords);
    const vocab = [...new Set(items.flatMap((it) => it.requiredVocabulary))];
    const target = h('select', { class: 'field', 'aria-label': 'הקצאה ל' }, h('option', { value: 'all' }, 'כל הכיתה'), students.map((s) => h('option', { value: s.id }, s.name)));
    const mine = assignments.filter((a) => a.moduleId === m.id);
    const minutes = lessonMinutes(m);
    const types = new Set();
    for (const it of items) for (const lv of ['easy', 'medium', 'hard']) { const c = resolveConfig(it, lv, 1, 8); if (c?.type) types.add(c.type); }
    // parts overview
    const parts = [];
    for (const st of m.steps) { let p = parts[parts.length - 1]; if (!p || p.id !== st.partId) { p = { id: st.partId, title: st.partTitle, skill: st.partSkill, steps: [] }; parts.push(p); } p.steps.push(st); }
    const partRows = parts.map((p) => {
      const its = p.steps.flatMap((st) => st.items || []);
      const hid = its.filter((it) => itemBlockers(it, settings, null).length).length;
      const mins = lessonMinutes({ steps: p.steps });
      return h('tr', {},
        h('td', {}, h('b', {}, p.title?.he || '')),
        h('td', {}, p.skill ? h('span', { class: isSkillUnlocked(p.skill, settings, null) ? 'pill-ok' : 'pill-miss' }, skillHe(p.skill)) : '—'),
        h('td', { class: 'small' }, p.steps.map((st) => (st.title?.he || st.type)).join(' · ')),
        h('td', {}, its.length ? `${its.length - hid}/${its.length}` : '—'),
        h('td', {}, `${mins} דק׳`));
    });
    return h('div', { class: 'card' },
      h('div', { class: 'row', style: { justifyContent: 'space-between' } }, h('h2', { style: { margin: 0 } }, m.title.he), h('span', { class: 'small muted' }, `כ-${minutes} דקות · ${items.length} פריטים`), m.kind === 'review' ? h('span', { class: 'pill-ok' }, 'חזרה — פתוח תמיד למה שנלמד') : null),
      h('p', { class: 'muted' }, m.goal.he),
      m.kind === 'review' ? null : h('div', { class: 'table-wrap', style: { margin: '10px 0' } }, h('table', { class: 'data' },
        h('thead', {}, h('tr', {}, h('th', {}, 'חלק'), h('th', {}, 'מיומנות (נלמד בכיתה?)'), h('th', {}, 'שלבים'), h('th', {}, 'פריטים זמינים'), h('th', {}, 'זמן'))),
        h('tbody', {}, partRows))),
      h('div', { class: 'small', style: { margin: '6px 0' } }, h('b', {}, 'סוגי תרגילים: '), [...types].map((x) => h('span', { class: 'chip', style: { margin: '2px', fontSize: '.8rem' } }, TYPE_HE[x] || x))),
      h('div', { class: 'small' }, h('b', {}, 'אוצר מילים נדרש: '), vocab.map((w) => h('span', { class: taught.has(w) ? 'pill-ok' : 'pill-miss' }, wordHe(w)))),
      hidden.length ? h('details', { style: { marginTop: '10px' } }, h('summary', {}, `${hidden.length} פריטים מוסתרים מהתלמידים כרגע (דורשים חומר שלא סומן כנלמד)`),
        hidden.map(({ it, b }) => h('div', { class: 'small' }, en(it.id), ': ', b.map((x) => (x.type === 'vocab' ? x.ids.map(wordHe).join(', ') : skillHe(x.id))).join(' · ')))) : null,
      h('div', { class: 'row', style: { marginTop: '14px' } },
        h('b', {}, 'תצוגה מקדימה כמו תלמיד/ה:'),
        m.kind === 'review'
          ? h('a', { class: 'btn small', href: `#/t/preview/${m.id}/easy` }, 'תצוגה מקדימה')
          : ['easy', 'medium', 'hard'].map((lv) => h('a', { class: 'btn small', href: `#/t/preview/${m.id}/${lv}` }, `Preview ${lv[0].toUpperCase() + lv.slice(1)}`))),
      m.kind === 'review' ? null : h('div', { class: 'row', style: { marginTop: '14px' } },
        h('b', {}, 'הקצאה:'), target,
        h('button', { class: 'btn small primary', type: 'button', onclick: async () => { await api.assign({ moduleId: m.id, target: target.value }); go(current()); } }, 'הקצאה'),
        mine.map((a) => h('span', { class: 'chip' }, a.target === 'all' ? 'כל הכיתה' : students.find((s) => s.id === a.target)?.name, ' ', h('button', { class: 'btn small ghost', type: 'button', 'aria-label': 'הסרת הקצאה', onclick: async () => { await api.unassign(a.id); go(current()); } }, '✕')))));
  });
  shell(root, 'שיעורים ותצוגה מקדימה',
    h('p', { class: 'muted' }, 'כל שיעור בנוי מחלקים — כל חלק הוא מיומנות אחת. חלק נפתח לתלמידים רק אחרי שסימנת את המיומנות כנלמדה בלשונית "תוכנית לימוד". בתצוגה המקדימה רואים הכול.'),
    ...cards);
}

// ============ SETTINGS ============
export async function teacherSettings(root) {
  await refresh();
  const th = structuredClone(app.settings.thresholds);
  const num = (path, label) => {
    const [a, b] = path.split('.');
    return h('label', { class: 'row' }, label, h('input', { class: 'field', type: 'number', min: 1, max: 10, value: th[a][b], style: { width: '80px' }, onchange: (e) => { th[a][b] = Number(e.target.value); } }));
  };
  const msg = h('span', { class: 'small ok', role: 'status' });
  shell(root, 'הגדרות',
    h('div', { class: 'card' }, h('h2', {}, 'ספי שליטה (Mastery)'),
      h('p', { class: 'muted' }, 'מיומנות נחשבת "בשליטה" רק כשכל שלושת סוגי הראיות התקיימו — והפקה עצמאית נספרת רק בלי רמזים, בלי בנק מילים ובניסיון ראשון.'),
      h('div', { class: 'stack' },
        h('div', { class: 'row' }, h('b', {}, 'זיהוי:'), num('recognition.need', 'נכונות'), num('recognition.of', 'מתוך האחרונות')),
        h('div', { class: 'row' }, h('b', {}, 'הפקה עם תמיכה:'), num('supported.need', 'נכונות'), num('supported.of', 'מתוך האחרונות')),
        h('div', { class: 'row' }, h('b', {}, 'הפקה עצמאית:'), num('independent.need', 'משפטים נכונים בלי רמזים'))),
      h('div', { class: 'row', style: { marginTop: '14px' } }, h('button', { class: 'btn primary', type: 'button', onclick: async () => { await api.saveSettings({ thresholds: th }); msg.textContent = 'נשמר ✓'; } }, 'שמירה'), msg)),
    h('div', { class: 'card' }, h('h2', {}, 'ניווט בתוך שיעור'),
      h('label', { class: 'toggle' }, h('input', { type: 'checkbox', checked: app.settings.freeNavigation !== false, onchange: async (e) => { await api.saveSettings({ freeNavigation: e.target.checked }); msg.textContent = 'נשמר ✓'; } }),
        'ניווט חופשי (כמו Khan Academy): התלמידים יכולים לפתוח כל שלב בשיעור — לחזור אחורה וגם להציץ קדימה'),
      h('p', { class: 'small muted' }, 'כשהאפשרות כבויה: אפשר תמיד לחזור לשלבים שכבר נעשו, אבל שלבים קדימה נפתחים רק לפי הסדר. בכל מקרה, מיומנויות ומילים שעוד לא נלמדו בכיתה לא מופיעות בתרגילים.')),
    h('div', { class: 'card' }, h('h2', {}, 'שפת עזרה ברירת מחדל לתלמידים חדשים'),
      langSelect(app.settings.defaultLanguage, async (v) => { await api.saveSettings({ defaultLanguage: v }); msg.textContent = 'נשמר ✓'; })),
    h('div', { class: 'card' }, h('h2', {}, 'קוד כניסה של המורה'), h('p', { class: 'muted' }, 'קוד המורה מוגדר בקובץ data/db.json (שדה teacher.pin).')));
}

export { MODULE_BY_ID };
