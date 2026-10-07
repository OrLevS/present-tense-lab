import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// Demo data: one teacher, three students with realistic answers and mistakes.
// Demo login codes (test values only — change them in the teacher dashboard): see README.

import { VOCAB_SETS, MODULE_BY_ID, allItems } from '../public/js/content/index.js';
import { resolveConfig, scoreAttempt, buildResponse } from '../public/js/logic/score.js';
import { DEFAULT_THRESHOLDS } from '../public/js/logic/mastery.js';

// Real class list
// The class list and teacher code live in data/class.json — NOT in the code, so names never reach git.
// Copy class.example.json → data/class.json and edit it. (data/ is in .gitignore.)
const here = path.dirname(fileURLToPath(import.meta.url));
function readClass() {
  const file = path.join(process.env.DATA_DIR || path.join(here, '..', 'data'), 'class.json');
  const fallback = path.join(here, '..', 'class.example.json');
  try { return JSON.parse(fs.readFileSync(fs.existsSync(file) ? file : fallback, 'utf8')); } catch { return { teacherPin: '1234', students: [] }; }
}

const setWords = (...ids) => ids.flatMap((id) => VOCAB_SETS.find((s) => s.id === id).words);

export function buildSeed() {
  const CLASS_FILE = readClass();
  const now = Date.now();
  const db = {
    version: 1,
    teacher: { id: 't1', name: 'המורה', pin: String(CLASS_FILE.teacherPin || '1234') },
    settings: {
      unitId: 'present_simple_vs_progressive',
      unlockedSkills: ['subject_pronouns', 'ps_i_you_we_they', 'time_words', 'third_person_s'],
      todaySkill: 'third_person_s',
      taughtWords: [...new Set(setWords('basics_people', 'basics_time', 'basics_things', 'phones_1', 'phones_2', 'phones_3', 'time_now', 'places'))],
      thresholds: DEFAULT_THRESHOLDS,
      defaultLanguage: 'he',
      freeNavigation: true, // students may open any lesson step (Khan-Academy style)
    },
    // The class roster. Codes are empty: each student chooses a 4-digit code at the first login (the teacher can see / reset it).
    students: (CLASS_FILE.students || []).map((name, i) => ({ id: `s${String(i + 1).padStart(2, '0')}`, name, pin: null, language: 'he', difficultyPolicy: 'choose', overrides: { skills: {}, prereq: {} }, createdAt: iso(now) })),
    demoStudents: [
      { id: 's_noa', name: 'Noa', pin: '1111', language: 'he', difficultyPolicy: 'choose', overrides: { skills: {}, prereq: {} }, createdAt: iso(now, -20 * 1440) },
      { id: 's_artyom', name: 'Artyom', pin: '2222', language: 'ru', difficultyPolicy: 'choose', overrides: { skills: {}, prereq: {} }, createdAt: iso(now, -20 * 1440) },
      { id: 's_rami', name: 'Rami', pin: '3333', language: 'ar', difficultyPolicy: 'easy', overrides: { skills: {}, prereq: {} }, createdAt: iso(now, -20 * 1440) },
    ],
    assignments: [{ id: 'a1', moduleId: 'lesson_a', target: 'all', createdAt: iso(now, -2 * 1440) }],
    progress: [],
    responses: [],
    events: [],
    notes: [],
  };

  // Demo students + realistic answers — only in the test copy (DEMO_DATA=1), never in the real class database.
  const demo = db.demoStudents;
  delete db.demoStudents;
  if (process.env.DEMO_DATA !== '1') return db;
  db.students.push(...demo);
  db.teacher.pin = '2468';

  let clock = now - 3 * 1440 * 60000;
  const R = (studentId, moduleId, itemId, level, answers, opt = {}) => {
    const module = MODULE_BY_ID[moduleId];
    const item = allItems(module).find((i) => i.id === itemId);
    const cfg = resolveConfig(item, level);
    const attempts = answers.map((answer, i) => ({ answer, ev: scoreAttempt(item, cfg, answer), feedbackLevel: i < answers.length - 1 ? i + 1 : null }));
    const startedAt = clock;
    clock += (opt.sec || 40) * 1000;
    const r = buildResponse({
      studentId, module, item, cfg, level, stepType: opt.step || 'practice', attempts,
      hintsUsed: opt.hints || 0, supportUsed: opt.support || {}, toolboxOpened: !!opt.toolbox, revealed: !!opt.revealed,
      startedAt, endedAt: clock,
    });
    db.responses.push(r);
    return r;
  };

  // ---------- Noa: finished the module (Medium) → mastered ----------
  clock = now - 2 * 1440 * 60000;
  ['tps_c1', 'tps_c2', 'tps_c3', 'tps_c4'].forEach((id, i) => R('s_noa', 'lesson_a', id, null, [['calls', 'read', 'watches', 'She uses her phone every day.'][i]], { step: 'check' }));
  R('s_noa', 'lesson_a', 'tps_p01', 'medium', ['She uses her phone every day.']);
  R('s_noa', 'lesson_a', 'tps_p02', 'medium', ['My brother watches videos every day.']);
  R('s_noa', 'lesson_a', 'tps_p03', 'medium', ['He calls his friend after school.'], { support: { verbSupplied: true } });
  R('s_noa', 'lesson_a', 'tps_p04', 'medium', ['My mom reads news every morning.'], { support: { verbSupplied: true } });
  R('s_noa', 'lesson_a', 'tps_p05', 'medium', ['We watch videos on weekends.']);
  R('s_noa', 'lesson_a', 'tps_p06', 'medium', ['My sister messages her friends every day.'], { support: { verbSupplied: true } });
  R('s_noa', 'lesson_a', 'tps_p07', 'medium', ['I call my dad after school.']);
  R('s_noa', 'lesson_a', 'tps_p08', 'medium', ['They use their phones at night.']);
  R('s_noa', 'lesson_a', 'tps_p09', 'medium', ['Dana reads books after scool.', 'Dana reads books after school.'], { hints: 1 });
  R('s_noa', 'lesson_a', 'tps_w1', null, ['Omar calls his friend after school.'], { step: 'produce' });
  R('s_noa', 'lesson_a', 'tps_w3', null, ['My sister watches videos at night.'], { step: 'produce' });
  R('s_noa', 'lesson_a', 'la_s_pf1', 'medium', [['play', 'plays']]);
  R('s_noa', 'lesson_a', 'la_s_chat', 'medium', [['watches', 'reads', 'call']]);
  R('s_noa', 'lesson_a', 'la_s_sort', 'medium', [{ 0: 's', 1: 'no', 2: 's', 3: 'no', 4: 'no', 5: 's' }]);
  R('s_noa', 'lesson_a', 'la_x1', null, ['My brother uses his phone every day.'], { step: 'exit' });
  db.progress.push({ id: 'p_noa', studentId: 's_noa', moduleId: 'lesson_a', status: 'in_progress', stepId: 'be.guess.0', difficulty: 'medium', practiceIndex: 0, completedSteps: ['warm.warmup.0', 'warm.choose.1', 's.words.0', 's.guess.1', 's.learn.2', 's.examples.3', 's.check.4', 's.practice.5', 's.practice.6', 's.produce.7', 'pause1.pause.0'], updatedAt: iso(clock) });

  // ---------- Artyom: mid-practice (Medium) → practicing ----------
  clock = now - 1440 * 60000;
  R('s_artyom', 'lesson_a', 'tps_c1', null, ['call', 'calls'], { step: 'check' });
  R('s_artyom', 'lesson_a', 'tps_c2', null, ['read'], { step: 'check' });
  R('s_artyom', 'lesson_a', 'tps_c3', null, ['watches'], { step: 'check' });
  R('s_artyom', 'lesson_a', 'tps_c4', null, ['She uses her phone every day.'], { step: 'check' });
  R('s_artyom', 'lesson_a', 'tps_p01', 'medium', ['She uses her phone every day.']);
  R('s_artyom', 'lesson_a', 'tps_p02', 'medium', ['My brother watch videos every day.', 'My brother watches videos every day.']);
  R('s_artyom', 'lesson_a', 'tps_p03', 'medium', ['He calls his freind after school.', 'He calls his friend after school.'], { support: { verbSupplied: true } });
  const ar4 = R('s_artyom', 'lesson_a', 'tps_p04', 'medium', ['My mom read the news every morning.', 'My mom reads the news every morning.'], { support: { verbSupplied: true, wordBank: true }, hints: 1, toolbox: true });
  R('s_artyom', 'lesson_a', 'tps_p05', 'medium', ['We watch videos on weekends.']);
  db.progress.push({ id: 'p_artyom', studentId: 's_artyom', moduleId: 'lesson_a', status: 'in_progress', stepId: 's.practice.5', difficulty: 'medium', practiceIndex: 5, completedSteps: ['warm.warmup.0', 'warm.choose.1', 's.words.0', 's.guess.1', 's.learn.2', 's.examples.3', 's.check.4'], updatedAt: iso(clock) });
  db.events.push({ id: 'ev1', studentId: 's_artyom', type: 'toolbox_open', moduleId: 'lesson_a', itemId: 'tps_p04', timestamp: ar4.timestamp });
  ar4.teacherFeedback = 'Great fix! Remember: my mom = she → reads.';
  db.notes.push({ id: 'n1', studentId: 's_artyom', responseId: ar4.id, text: 'Great fix! Remember: my mom = she → reads.', createdAt: iso(clock) });

  // ---------- Rami: Easy (assigned by teacher), repeated S errors → remediation → needs support ----------
  clock = now - 1440 * 60000 + 3600000;
  R('s_rami', 'lesson_a', 'tps_c1', null, ['call', 'calls'], { step: 'check' });
  R('s_rami', 'lesson_a', 'tps_c2', null, ['reads', 'read'], { step: 'check' });
  R('s_rami', 'lesson_a', 'tps_c3', null, ['watches'], { step: 'check' });
  R('s_rami', 'lesson_a', 'tps_c4', null, ['She use her phone every day.', 'She uses her phone every day.'], { step: 'check' });
  R('s_rami', 'lesson_a', 'tps_p01', 'easy', ['use', 'uses']);
  R('s_rami', 'lesson_a', 'tps_p02', 'easy', ['watch', 'watches'], { toolbox: true });
  R('s_rami', 'lesson_a', 'tps_p03', 'easy', ['call', 'callz', 'calls'], { hints: 2 });
  R('s_rami', 'lesson_a', 'tps_r1', null, ['watches'], { step: 'remediation' });
  R('s_rami', 'lesson_a', 'tps_r2', null, ['calls', 'call'], { step: 'remediation' });
  R('s_rami', 'lesson_a', 'tps_r3', null, ['reads'], { step: 'remediation' });
  R('s_rami', 'lesson_a', 'tps_p04', 'easy', ['reads']);
  R('s_rami', 'lesson_a', 'tps_p05', 'easy', ['watches', 'watch']);
  db.progress.push({ id: 'p_rami', studentId: 's_rami', moduleId: 'lesson_a', status: 'in_progress', stepId: 's.practice.5', difficulty: 'easy', practiceIndex: 6, completedSteps: ['warm.warmup.0', 'warm.choose.1', 's.words.0', 's.guess.1', 's.learn.2', 's.examples.3', 's.check.4'], updatedAt: iso(clock) });
  db.events.push({ id: 'ev2', studentId: 's_rami', type: 'toolbox_open', moduleId: 'lesson_a', itemId: 'tps_p02', timestamp: iso(clock) });
  db.events.push({ id: 'ev3', studentId: 's_rami', type: 'remediation', moduleId: 'lesson_a', data: { tag: 'THIRD_PERSON_S' }, timestamp: iso(clock) });

  // Reviews (re-teaching what was taught in class)
  clock = now - 4 * 1440 * 60000;
  ['rsp_c1', 'rsp_c2', 'rsp_c3', 'rsp_c4'].forEach((id, i) => R('s_noa', 'rev_subject_pronouns', id, null, [['she', 'they', 'it', 'we'][i]], { step: 'check' }));
  ['rsp_c1', 'rsp_c2', 'rsp_c3', 'rsp_c4'].forEach((id, i) => R('s_rami', 'rev_subject_pronouns', id, null, [['she', 'we', 'it', 'they'][i], ...(i === 1 ? ['they'] : i === 3 ? ['we'] : [])], { step: 'check' }));

  return db;
}

function iso(base, minutes = 0) {
  return new Date(base + minutes * 60000).toISOString();
}
