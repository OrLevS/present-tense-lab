// Student DASHBOARD: one "next step" button + the whole unit as a timeline
// (done ✓ · today ▶ · later — everything can be opened; later skills are "peek only" until taught in class).

import { h, bidi, en } from '../ui/dom.js';
import { t, L, fwd } from '../i18n.js';
import { openWord, modal } from '../ui/components.js';
import { lessonMinutes } from './lessonPlayer.js';
import { UNIT, SKILLS, MODULES, REVIEW_MODULES, VOCAB_SETS, SKILL_BY_ID, WORD_BY_ID, TOOLBOX } from '../content/index.js';
import { skillState, moduleBlockers, isAssigned, isWordTaught, setTaughtState } from '../logic/unlock.js';
import { skillEvidence } from '../logic/mastery.js';
import { app } from '../state.js';
import { go } from '../router.js';

export function studentHome(root) {
  const { settings, student } = app;
  const page = h('div', { class: 'page' });
  root.append(page);

  const progressOf = (m) => app.progress.find((p) => p.moduleId === m.id);
  const stepsDone = (m) => {
    const p = progressOf(m);
    if (!p) return 0;
    if (p.status === 'completed') return m.steps.length;
    return (p.completedSteps || []).length || p.stepIndex || 0;
  };
  const openable = (m) => moduleBlockers(m, settings, student).length === 0;

  const lessonOpen = (m) => (m.skills || []).some((sk) => sk !== 'ps_i_you_we_they' && skillState(sk, settings, student) !== 'locked');

  // ---------- 1. Hello + the ONE next step ----------
  const unfinished = (m) => progressOf(m)?.status !== 'completed';
  const next = MODULES.find((m) => lessonOpen(m) && isAssigned(m, app.assignments, student.id) && unfinished(m)) || MODULES.find((m) => lessonOpen(m) && unfinished(m));
  const hero = h('div', { class: 'card hero' },
    h('div', { class: 'section-label' }, L(UNIT.title)),
    h('h1', {}, t('hello', { name: student.name })));
  if (next) {
    const done = stepsDone(next);
    const p = progressOf(next);
    const cur = p && next.steps.find((st) => st.id === p.stepId);
    hero.append(
      h('p', { class: 'section-label', style: { marginTop: '8px' } }, t('next_for_you')),
      h('div', { class: 'row', style: { justifyContent: 'space-between' } },
        h('div', {},
          h('h2', { style: { margin: 0 } }, bidi(L(next.title))),
          h('div', { class: 'muted' }, bidi(L(next.goal))),
          h('div', { class: 'progressline', style: { margin: '10px 0 4px', maxWidth: '360px' } }, h('span', { style: { width: `${Math.max(4, (done / next.steps.length) * 100)}%` } })),
          h('div', { class: 'small muted' }, t('steps_done', { done, total: next.steps.length }), ' · ', t('about_min', { n: lessonMinutes(next) }), cur ? ` · ${t('now_label')}: ${cur.title ? L(cur.title) : t(`step_${cur.type}`)}` : '')),
        h('button', { class: 'btn primary big', type: 'button', onclick: () => go(`/s/module/${next.id}`) }, `${t(p ? 'continue' : 'start')} ${fwd()}`)));
  } else {
    hero.append(h('p', {}, t('no_task')));
  }
  page.append(hero);

  // ---------- 2. Notes from the teacher ----------
  const notes = [...app.notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
  if (notes.length) {
    page.append(h('div', { class: 'card soft' }, h('p', { class: 'section-label' }, `✉️ ${t('teacher_note')}`),
      notes.map((n) => {
        const r = n.responseId && app.responses.find((x) => x.id === n.responseId);
        return h('div', { class: 'note', style: { background: 'var(--surface)' } },
          r ? h('div', { class: 'small muted' }, t('about_answer'), ' ', en(`“${r.finalResponse}”`)) : null,
          h('p', { style: { margin: 0 } }, bidi(n.text)));
      })));
  }

  // ---------- 3. The unit timeline: reviews → lessons → later ----------
  const reviews = REVIEW_MODULES.filter((m) => skillState(m.grammarSkill, settings, student) === 'learned');
  const covered = new Set(MODULES.flatMap((m) => m.skills || []));
  const later = SKILLS.filter((sk) => !covered.has(sk.id) && skillState(sk.id, settings, student) === 'locked');

  const reviewNode = h('li', { class: 'tl-item big done' }, h('span', { class: 'tl-dot', 'aria-hidden': 'true' }, '✓'),
    h('div', { class: 'tl-body' },
      h('div', { class: 'tl-state' }, t('we_learned')),
      h('h3', { style: { margin: '0 0 8px' } }, t('reviews_station')),
      h('div', { class: 'row' }, reviews.map((m) => {
        const done = progressOf(m)?.status === 'completed';
        return h('button', { class: 'btn small', type: 'button', onclick: () => go(`/s/module/${m.id}`) }, done ? '✓ ' : '', bidi(L(m.title)));
      }))));

  page.append(h('div', { class: 'card' },
    h('h2', {}, `🗺️ ${t('my_path')}`),
    h('p', { class: 'muted small' }, t('my_path_sub')),
    h('ol', { class: 'timeline' }, reviewNode, MODULES.map((m) => lessonNode(m)), later.map((sk) => skillPeekNode(sk)))));

  function lessonNode(m) {
    const p = progressOf(m);
    const completed = p?.status === 'completed';
    const open = lessonOpen(m);
    const state = completed ? 'done' : open ? 'now' : 'ahead';
    const done = stepsDone(m);
    const chips = h('div', { class: 'chips', style: { margin: '8px 0' } }, (m.skills || []).filter((sk) => sk !== 'ps_i_you_we_they').map((sk) => {
      const st = skillState(sk, settings, student);
      const ev = st !== 'locked' ? skillEvidence(app.responses, sk, settings.thresholds) : null;
      return h('span', { class: `chip skill-chip ${st}` }, st === 'learned' ? '✓ ' : st === 'today' ? '▶ ' : '🔒 ', bidi(L(SKILL_BY_ID[sk].name)),
        ev && ev.responses ? h('span', { class: `dotstat ${ev.status}`, title: t(`status_${ev.status}`), 'aria-label': t(`status_${ev.status}`) }) : null);
    }));
    const body = h('div', { class: 'tl-body' },
      h('div', { class: 'row', style: { justifyContent: 'space-between' } },
        h('div', {}, h('div', { class: 'tl-state' }, `${t('lesson_word')} ${m.order} · ${t('about_min', { n: lessonMinutes(m) })}`), h('h3', { style: { margin: 0 } }, bidi(L(m.title)))),
        isAssigned(m, app.assignments, student.id) ? h('span', { class: 'pill-ok' }, t('teacher_task')) : null),
      h('div', { class: 'small muted' }, bidi(L(m.goal))),
      chips);
    if (open) {
      body.append(h('div', { class: 'lesson-row' },
        h('div', { style: { flex: 1, minWidth: '220px' } },
          h('div', { class: 'progressline', style: { margin: '0 0 2px' } }, h('span', { style: { width: `${Math.max(4, (done / m.steps.length) * 100)}%` } })),
          h('div', { class: 'small muted' }, t('steps_done', { done, total: m.steps.length }))),
        h('button', { class: `btn ${completed ? '' : 'primary'}`, type: 'button', onclick: () => go(`/s/module/${m.id}`) }, completed ? t('do_again') : `${t(p ? 'continue' : 'start')} ${fwd()}`)));
    } else {
      body.append(h('button', { class: 'btn small', type: 'button', onclick: () => peek(null, m) }, `👀 ${t('peek')}`));
    }
    return h('li', { class: `tl-item big ${state}` }, h('span', { class: 'tl-dot', 'aria-hidden': 'true' }, completed ? '✓' : open ? '▶' : String(m.order)), body);
  }

  function skillPeekNode(sk) {
    return h('li', { class: 'tl-item big ahead' }, h('span', { class: 'tl-dot', 'aria-hidden': 'true' }),
      h('div', { class: 'tl-body' }, h('div', { class: 'tl-state' }, t('coming_later')), h('h3', { style: { margin: 0 } }, bidi(L(sk.name))),
        h('button', { class: 'btn small', type: 'button', style: { marginTop: '8px' }, onclick: () => peek(sk) }, `👀 ${t('peek')}`)));
  }

  // ---------- 4. My words ----------
  const taughtSets = VOCAB_SETS.filter((vs) => setTaughtState(vs.id, settings) === 'all');
  page.append(h('div', { class: 'card' },
    h('h2', {}, `🔤 ${t('my_words')}`),
    h('div', { class: 'row' }, taughtSets.map((vs) => h('button', { class: 'btn small', type: 'button', onclick: () => go(`/s/words/${vs.id}`) }, bidi(t('words_of', { set: L(vs.name) }))))),
    h('div', { class: 'chips', style: { marginTop: '14px' } }, Object.values(WORD_BY_ID).filter((w) => isWordTaught(w.id, settings) && ['verb', 'noun'].includes(w.kind)).map((w) => h('button', { class: 'chip word en', type: 'button', onclick: () => openWord(w.id) }, w.emoji ? `${w.emoji} ` : '', w.en)))));
}

// "Peek ahead": see what a future skill looks like — no exercises, no score.
function peek(sk, lesson) {
  const ids = lesson ? lesson.skills : [sk.id];
  const cards = TOOLBOX.filter((c) => ids.includes(c.skill));
  modal(`👀 ${t('peek_title')}`, h('div', { class: 'stack' },
    h('h3', {}, bidi(L(lesson ? lesson.title : sk.name))),
    h('p', { class: 'muted' }, t('peek_text')),
    cards.length || sk?.short ? h('p', { style: { fontWeight: 500 } }, t('peek_example')) : null,
    cards.map((c) => h('div', { class: 'tb-group' }, h('h3', {}, c.group), c.lines.map((ln) => h('div', { class: 'tb-line' }, h('span', {}, ln.label), ln.value ? h('b', {}, ln.value) : null)))),
    !cards.length && sk?.short ? h('div', { class: 'tb-group' }, h('div', { class: 'tb-line' }, h('b', {}, sk.short))) : null));
}

function meter(label, good, need) {
  return h('span', { class: 'row', style: { gap: '6px', marginInlineEnd: '14px' } }, label,
    h('span', { class: 'meter', 'aria-label': `${good}/${need}` }, Array.from({ length: need }, (_, i) => h('i', { class: i < good ? 'on' : '' }))));
}
