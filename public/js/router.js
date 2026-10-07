// Hash router: #/s/home, #/t/student/s_noa, …

const table = [];
let notFound = null;

export function on(pattern, handler) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
  table.push({ re, keys, handler });
}
export function otherwise(handler) { notFound = handler; }

export function go(path) {
  if (location.hash === '#' + path) render();
  else location.hash = path;
}

export function current() {
  return location.hash.slice(1) || '/';
}

export function render() {
  const path = current();
  for (const r of table) {
    const m = path.match(r.re);
    if (m) return r.handler(Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])));
  }
  notFound?.();
}

export function start() {
  window.addEventListener('hashchange', render);
  render();
}
