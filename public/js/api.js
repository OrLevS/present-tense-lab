// Thin client for the JSON API. Keeps the login token in sessionStorage (per browser tab).

let token = null;
try { token = sessionStorage.getItem('pl_token'); } catch { /* storage blocked */ }

export function setToken(t) {
  token = t;
  try { t ? sessionStorage.setItem('pl_token', t) : sessionStorage.removeItem('pl_token'); } catch { /* ignore */ }
}
export const hasToken = () => !!token;

async function call(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  studentNames: () => call('GET', '/api/students/names'),
  login: (payload) => call('POST', '/api/login', payload),
  firstPin: (payload) => call('POST', '/api/student/first-pin', payload),
  startTestStudent: () => call('POST', '/api/teacher/test-student'),
  resetTestStudent: () => call('POST', '/api/student/reset-test'),
  // student
  studentState: () => call('GET', '/api/student/state'),
  setLanguage: (language) => call('PUT', '/api/student/language', { language }),
  saveProgress: (p) => call('PUT', '/api/student/progress', p),
  saveResponse: (r) => call('POST', '/api/student/responses', r),
  logEvent: (e) => call('POST', '/api/student/events', e).catch(() => null),
  evaluateOpen: (payload) => call('POST', '/api/evaluate-open', payload),
  // teacher
  teacherState: () => call('GET', '/api/teacher/state'),
  saveSettings: (s) => call('PUT', '/api/teacher/settings', s),
  addStudent: (s) => call('POST', '/api/teacher/students', s),
  updateStudent: (id, s) => call('PATCH', `/api/teacher/students/${id}`, s),
  updateResponse: (id, r) => call('PATCH', `/api/teacher/responses/${id}`, r),
  addNote: (n) => call('POST', '/api/teacher/notes', n),
  deleteNote: (id) => call('DELETE', `/api/teacher/notes/${id}`),
  assign: (a) => call('POST', '/api/teacher/assignments', a),
  unassign: (id) => call('DELETE', `/api/teacher/assignments/${id}`),
  reopen: (p) => call('POST', '/api/teacher/reopen', p),
  reset: (p) => call('POST', '/api/teacher/reset', p),
};
