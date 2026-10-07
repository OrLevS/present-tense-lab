// Present Lab server — zero-dependency Node HTTP server: static files + JSON API.
// Run: npm start  →  http://localhost:5174

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as store from './db.js';
import { evaluateOpen } from './ai.js';
import { SKILL_BY_ID, MODULE_BY_ID } from '../public/js/content/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(here, '..', 'public');
const PORT = Number(process.env.PORT) || 5174;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };

const sessions = new Map(); // token → { role, id }

// Codes are only 4 digits, so wrong guesses are limited: 8 wrong tries per person per 10 minutes, then a short lock.
const failures = new Map(); // key → { n, until }
const MAX_FAILS = 8, WINDOW_MS = 10 * 60 * 1000;
const clientIp = (req) => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
function tooMany(key) {
  const f = failures.get(key);
  if (!f) return false;
  if (Date.now() > f.until) { failures.delete(key); return false; }
  return f.n >= MAX_FAILS;
}
function fail(key) {
  const f = failures.get(key);
  if (!f || Date.now() > f.until) failures.set(key, { n: 1, until: Date.now() + WINDOW_MS });
  else f.n += 1;
}

// ---------- helpers ----------
const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};
const readBody = (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', (c) => { data += c; if (data.length > 1e6) req.destroy(); });
  req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
});
const publicStudent = (s) => ({ id: s.id, name: s.name, language: s.language, difficultyPolicy: s.difficultyPolicy, overrides: s.overrides });
const auth = (req) => sessions.get((req.headers.authorization || '').replace('Bearer ', ''));

// ---------- routes ----------
const routes = [];
const route = (method, pattern, role, handler) => {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  routes.push({ method, re, keys, role, handler });
};

// public
route('GET', '/api/students/names', null, () => store.get().students.filter((s) => !s.isTest).map((s) => ({ id: s.id, name: s.name, language: s.language, hasPin: !!s.pin })));
route('POST', '/api/login', null, ({ body, req }) => {
  const db = store.get();
  const key = `${clientIp(req)}|${body.role}|${body.studentId || ''}`;
  if (tooMany(key) || (failures.get(`ip|${clientIp(req)}`)?.n || 0) >= 60) return { status: 429, body: { error: 'too_many' } };
  let user = null;
  if (body.role === 'teacher' && String(body.pin) === db.teacher.pin) user = { role: 'teacher', id: db.teacher.id, name: db.teacher.name };
  if (body.role === 'student') {
    const s = db.students.find((x) => x.id === body.studentId);
    if (s && String(body.pin) === s.pin) user = { role: 'student', id: s.id, name: s.name, language: s.language };
  }
  if (!user) { fail(key); fail(`ip|${clientIp(req)}`); return { status: 401, body: { error: 'wrong_code' } }; }
  failures.delete(key);
  return startSession(user);
});
function startSession(user) {
  const token = crypto.randomBytes(18).toString('hex');
  sessions.set(token, { role: user.role, id: user.id });
  return { token, user };
}
// First login: a student without a code chooses one (4 digits). The teacher can see it and reset it.
route('POST', '/api/student/first-pin', null, ({ body }) => {
  const db = store.get();
  const s = db.students.find((x) => x.id === body.studentId);
  if (!s) return { status: 404, body: { error: 'not found' } };
  if (s.pin) return { status: 409, body: { error: 'has_pin' } };
  if (!/^\d{4}$/.test(String(body.pin))) return { status: 400, body: { error: '4-digit code' } };
  s.pin = String(body.pin);
  s.pinSetAt = new Date().toISOString();
  store.save();
  return startSession({ role: 'student', id: s.id, name: s.name, language: s.language });
});

// ----- student -----
route('GET', '/api/student/state', 'student', ({ user }) => {
  const db = store.get();
  const student = db.students.find((s) => s.id === user.id);
  return {
    student: publicStudent(student),
    settings: db.settings,
    assignments: db.assignments.filter((a) => a.target === 'all' || a.target === user.id),
    progress: db.progress.filter((p) => p.studentId === user.id),
    responses: db.responses.filter((r) => r.studentId === user.id),
    notes: db.notes.filter((n) => n.studentId === user.id),
  };
});
route('PUT', '/api/student/language', 'student', ({ user, body }) => {
  const s = store.get().students.find((x) => x.id === user.id);
  if (['he', 'ru', 'ar', 'en'].includes(body.language)) s.language = body.language;
  store.save();
  return publicStudent(s);
});
route('PUT', '/api/student/progress', 'student', ({ user, body }) => {
  const db = store.get();
  let p = db.progress.find((x) => x.studentId === user.id && x.moduleId === body.moduleId);
  if (!p) { p = { id: store.newId('p'), studentId: user.id, moduleId: body.moduleId, status: 'in_progress' }; db.progress.push(p); }
  for (const k of ['stepIndex', 'stepId', 'difficulty', 'practiceIndex', 'status', 'completedSteps']) if (body[k] !== undefined) p[k] = body[k];
  if (body.status === 'completed') p.completedAt = new Date().toISOString();
  p.updatedAt = new Date().toISOString();
  store.save();
  return p;
});
route('POST', '/api/student/responses', 'student', ({ user, body }) => {
  const db = store.get();
  const r = { ...body, studentId: user.id, id: body.id || store.newId('r') };
  db.responses.push(r);
  store.save();
  return r;
});
route('POST', '/api/student/events', 'student', ({ user, body }) => {
  const db = store.get();
  const e = { id: store.newId('ev'), studentId: user.id, type: body.type, moduleId: body.moduleId || null, itemId: body.itemId || null, data: body.data || null, timestamp: new Date().toISOString() };
  db.events.push(e);
  store.save();
  return e;
});
route('POST', '/api/evaluate-open', 'any', async ({ body }) => {
  const db = store.get();
  const taughtGrammar = db.settings.unlockedSkills.map((id) => SKILL_BY_ID[id]?.name.en).filter(Boolean);
  const result = await evaluateOpen({ ...body, taughtGrammar });
  return { available: !!result, result };
});

// ----- teacher -----
// "Student view": the teacher tests the app as a hidden TEST student (same class settings, not shown anywhere in class data)
const TEST_ID = 's_test';
function ensureTestStudent(db) {
  let s = db.students.find((x) => x.id === TEST_ID);
  if (!s) { s = { id: TEST_ID, name: 'תלמיד/ה לבדיקה', pin: null, isTest: true, language: db.settings.defaultLanguage || 'he', difficultyPolicy: 'choose', overrides: { skills: {}, prereq: {} }, createdAt: new Date().toISOString() }; db.students.push(s); store.save(); }
  return s;
}
route('POST', '/api/teacher/test-student', 'teacher', () => {
  const s = ensureTestStudent(store.get());
  return startSession({ role: 'student', id: s.id, name: s.name, language: s.language });
});
route('POST', '/api/student/reset-test', 'student', ({ user }) => {
  if (user.id !== TEST_ID) return { status: 403, body: { error: 'only the test student' } };
  const db = store.get();
  for (const k of ['responses', 'progress', 'events', 'notes']) db[k] = db[k].filter((x) => x.studentId !== TEST_ID);
  store.save();
  return { ok: true };
});route('GET', '/api/teacher/state', 'teacher', () => {
  const db = store.get();
  const real = (x) => x.studentId !== TEST_ID;
  return { ...db, teacher: { id: db.teacher.id, name: db.teacher.name }, students: db.students.filter((x) => !x.isTest),
    responses: db.responses.filter(real), progress: db.progress.filter(real), events: db.events.filter(real), notes: db.notes.filter(real) };
});
route('PUT', '/api/teacher/settings', 'teacher', ({ body }) => {
  const db = store.get();
  for (const k of ['unlockedSkills', 'todaySkill', 'taughtWords', 'thresholds', 'defaultLanguage', 'freeNavigation']) if (body[k] !== undefined) db.settings[k] = body[k];
  store.save();
  return db.settings;
});
route('POST', '/api/teacher/students', 'teacher', ({ body }) => {
  const db = store.get();
  const name = String(body.name || '').trim();
  const pin = String(body.pin || '').trim();
  if (!name || (pin && !/^\d{4}$/.test(pin))) return { status: 400, body: { error: 'name required; code must be 4 digits (or empty — the student chooses it)' } };
  const s = { id: store.newId('s'), name, pin: pin || null, language: body.language || db.settings.defaultLanguage, difficultyPolicy: 'choose', overrides: { skills: {}, prereq: {} }, createdAt: new Date().toISOString() };
  db.students.push(s);
  store.save();
  return s;
});
route('PATCH', '/api/teacher/students/:id', 'teacher', ({ params, body }) => {
  const s = store.get().students.find((x) => x.id === params.id);
  if (!s) return { status: 404, body: { error: 'not found' } };
  for (const k of ['name', 'language', 'difficultyPolicy', 'overrides']) if (body[k] !== undefined) s[k] = body[k];
  // empty / null code = reset: the student chooses a new code at the next login
  if (body.pin !== undefined) {
    if (body.pin === null || body.pin === '') s.pin = null;
    else if (!/^\d{4}$/.test(String(body.pin))) return { status: 400, body: { error: '4-digit code' } };
    else s.pin = String(body.pin);
  }
  store.save();
  return s;
});
route('PATCH', '/api/teacher/responses/:id', 'teacher', ({ params, body }) => {
  const db = store.get();
  const r = db.responses.find((x) => x.id === params.id);
  if (!r) return { status: 404, body: { error: 'not found' } };
  if (body.teacherOverride !== undefined) r.teacherOverride = body.teacherOverride;
  if (body.teacherFeedback !== undefined) {
    r.teacherFeedback = body.teacherFeedback;
    db.notes = db.notes.filter((n) => n.responseId !== r.id);
    if (body.teacherFeedback) db.notes.push({ id: store.newId('n'), studentId: r.studentId, responseId: r.id, text: body.teacherFeedback, createdAt: new Date().toISOString() });
  }
  store.save();
  return r;
});
route('POST', '/api/teacher/notes', 'teacher', ({ body }) => {
  const db = store.get();
  const n = { id: store.newId('n'), studentId: body.studentId, responseId: null, text: String(body.text || '').slice(0, 500), createdAt: new Date().toISOString() };
  db.notes.push(n);
  store.save();
  return n;
});
route('DELETE', '/api/teacher/notes/:id', 'teacher', ({ params }) => {
  const db = store.get();
  db.notes = db.notes.filter((n) => n.id !== params.id);
  store.save();
  return { ok: true };
});
route('POST', '/api/teacher/assignments', 'teacher', ({ body }) => {
  const db = store.get();
  if (!MODULE_BY_ID[body.moduleId]) return { status: 400, body: { error: 'unknown module' } };
  const a = { id: store.newId('a'), moduleId: body.moduleId, target: body.target || 'all', createdAt: new Date().toISOString() };
  db.assignments.push(a);
  store.save();
  return a;
});
route('DELETE', '/api/teacher/assignments/:id', 'teacher', ({ params }) => {
  const db = store.get();
  db.assignments = db.assignments.filter((a) => a.id !== params.id);
  store.save();
  return { ok: true };
});
// Reopen: completed module can be done again; previous answers are kept.
route('POST', '/api/teacher/reopen', 'teacher', ({ body }) => {
  const p = store.get().progress.find((x) => x.studentId === body.studentId && x.moduleId === body.moduleId);
  if (p) { p.status = 'in_progress'; p.stepIndex = body.stepIndex ?? 0; p.practiceIndex = 0; p.reopenedAt = new Date().toISOString(); store.save(); }
  return p || { ok: true };
});
// Reset: progress + answers for this module are archived (not deleted) and the student starts fresh.
route('POST', '/api/teacher/reset', 'teacher', ({ body }) => {
  const db = store.get();
  db.archivedResponses = db.archivedResponses || [];
  const keep = [];
  for (const r of db.responses) (r.studentId === body.studentId && r.moduleId === body.moduleId ? db.archivedResponses : keep).push(r);
  db.responses = keep;
  db.progress = db.progress.filter((p) => !(p.studentId === body.studentId && p.moduleId === body.moduleId));
  store.save();
  return { ok: true };
});

// ---------- server ----------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) {
    const r = routes.find((x) => x.method === req.method && x.re.test(url.pathname));
    if (!r) return send(res, 404, { error: 'not found' });
    const user = auth(req);
    if (r.role && r.role !== 'any' && user?.role !== r.role) return send(res, 401, { error: 'login required' });
    if (r.role === 'any' && !user) return send(res, 401, { error: 'login required' });
    try {
      const m = url.pathname.match(r.re);
      const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
      const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};
      const out = await r.handler({ user, params, body, query: url.searchParams, req });
      if (out && out.status && out.body) return send(res, out.status, out.body);
      return send(res, 200, out);
    } catch (err) {
      console.error(err);
      return send(res, 500, { error: 'server error' });
    }
  }
  // static files
  let file = path.normalize(path.join(PUBLIC, decodeURIComponent(url.pathname)));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  if (url.pathname === '/' || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(PUBLIC, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
});

const db0 = store.load();
// TEACHER_PIN in the hosting settings always wins (so the teacher code can be changed there)
if (process.env.TEACHER_PIN && db0.teacher.pin !== process.env.TEACHER_PIN) { db0.teacher.pin = String(process.env.TEACHER_PIN); store.save(); }
server.listen(PORT, () => console.log(`Present Lab running → http://localhost:${PORT}`));
process.on('SIGINT', () => { store.flush(); process.exit(0); });
process.on('SIGTERM', () => { store.flush(); process.exit(0); });
