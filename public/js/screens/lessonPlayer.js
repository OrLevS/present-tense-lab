// Lesson player — runs a LESSON: a sequence of PARTS (one grammar skill each), every part made of STEPS.
// Step types: warmup · words · guess · learn · examples · check · choose · practice · produce · pause · exit · challenge
// Everything comes from lesson data (content/lessons/*.js). Old single-skill modules are converted to the same shape.
// "First you guess, then you learn": words and rules start with a guess that is never scored.

import { h, clear, bidi, en, speakBtn, shuffle, highlightEn, markEnding } from '../ui/dom.js';
import { t, L, getLang, dir, fwd } from '../i18n.js';
import { actionBar, clickableSentence, ruleCard } from '../ui/components.js';
import { runExercise } from '../ui/runner.js';
import { renderExplainer } from '../ui/explainer.js';
import { MODULE_BY_ID, WORD_BY_ID, SKILL_BY_ID } from '../content/index.js';
import { isItemAvailable, isSkillUnlocked } from '../logic/unlock.js';
import { remediationNeeded } from '../logic/remediation.js';
import { app, isPreview } from '../state.js';
import { api } from '../api.js';
import { go } from '../router.js';

// Minutes for a whole lesson, counting one help level (default Medium). Bonus challenge not included.
export function lessonMinutes(lesson, level = 'medium') {
  return lesson.steps.reduce((sum, st) => {
    if (st.type === 'challenge') return sum;
    const n = st.items ? st.items.filter((it) => !it.difficultyConfig || it.difficultyConfig[level]).length : undefined;
    return sum + estMinutes(st, st.type === 'exit' && n ? Math.min(4, n) : n);
  }, 0);
}

const STEP_ICON = { warmup: '🔥', words: '🔤', guess: '🤔', explain: '🎬', learn: '💡', examples: '👀', check: '✅', choose: '🎚️', practice: '✏️', produce: '✍️', pause: '🧃', exit: '🎟️', challenge: '⭐' };

// Estimated minutes per step (shown as "~5 min" — never a countdown timer)
export function estMinutes(step, nItems) {
  if (step.estMin) return step.estMin;
  const n = nItems ?? (step.items?.length || step.words?.length || step.guess?.length || 0);
  // average minutes per item: a choice ≈ 30 sec, a typed sentence ≈ 1 min, own writing ≈ 1.5 min
  const per = { words: 0.4, check: 0.5, warmup: 0.5, practice: 0.7, produce: 1.5, challenge: 1 };
  const fixed = { guess: 2, explain: 2, learn: 2, examples: 2, choose: 1, pause: 2, exit: 4 };
  return Math.max(1, Math.round(fixed[step.type] ?? n * (per[step.type] || 1)));
}

export function lessonPlayer(root, lessonOrId, { previewLevel } = {}) {
  const lesson = typeof lessonOrId === 'string' ? MODULE_BY_ID[lessonOrId] : lessonOrId;
  if (!lesson) { root.append(h('p', {}, 'Lesson not found')); return; }
  app.currentModuleId = lesson.id;
  const preview = isPreview();
  const showAll = preview; // teacher lesson preview shows every part
  const settings = app.settings;
  const student = app.student;
  const steps = lesson.steps;
  const progress = app.progress.find((p) => p.moduleId === lesson.id);
  const policy = student?.difficultyPolicy || 'choose';
  const freeNav = showAll || settings.freeNavigation !== false;

  const idxOf = (id) => Math.max(0, steps.findIndex((s) => s.id === id));
  const S = {
    stepIndex: progress && progress.status !== 'completed' ? (progress.stepId ? idxOf(progress.stepId) : Math.min(progress.stepIndex || 0, steps.length - 1)) : 0,
    level: previewLevel || (policy !== 'choose' ? policy : progress?.difficulty) || null,
    practiceIndex: progress && progress.status !== 'completed' ? progress.practiceIndex || 0 : 0,
    sessionResponses: [],
    remediated: new Set(),
    exitResults: [],
    completed: new Set(progress?.status === 'completed' ? steps.map((s) => s.id) : (progress?.completedSteps || []).filter((id) => typeof id === 'string')),
  };

  const page = h('div', { class: 'page lesson-page' });
  root.append(page);

  // ---------- availability (teacher controls what is taught) ----------
  // teacher preview shows everything (locked parts are labelled); students only get what was taught
  function available(list) { return showAll ? (list || []) : (list || []).filter((it) => isItemAvailable(it, settings, student)); }
  function stepLocked(step) {
    if (step.type === 'pause' || step.type === 'choose') return false;
    if (step.skill && !isSkillUnlocked(step.skill, settings, student)) return true;
    if (step.items && !available(step.items).length) return true;
    return false;
  }
  function practiceItems(step) {
    return available(step.items).filter((it) => !it.difficultyConfig || it.difficultyConfig[S.level || 'medium']);
  }
  function countFor(step) {
    if (step.type === 'practice') return practiceItems(step).length;
    if (step.type === 'exit') return Math.min(4, available(step.items).length);
    if (step.items) return available(step.items).length;
    if (step.words) return step.words.length;
    return 0;
  }
  const minutes = (step) => estMinutes(step, step.items || step.words ? countFor(step) : undefined);

  // ---------- saving ----------
  function save(extra = {}) {
    if (preview || !student) return;
    const p = { moduleId: lesson.id, stepIndex: S.stepIndex, stepId: steps[S.stepIndex]?.id, difficulty: S.level, practiceIndex: S.practiceIndex, completedSteps: [...S.completed], ...extra };
    const local = app.progress.find((x) => x.moduleId === lesson.id);
    if (local) Object.assign(local, p); else app.progress.push({ ...p, studentId: student.id, status: 'in_progress' });
    api.saveProgress(p).catch(() => {});
  }
  function saveResponse(r) {
    if (preview || !student) return;
    app.responses.push(r);
    api.saveResponse(r).catch(() => alert(t('saving_error')));
  }

  // ---------- navigation ----------
  function reached() { return Math.max(S.stepIndex, ...steps.map((s, i) => (S.completed.has(s.id) ? i + 1 : 0))); }
  function canOpen(i) { return freeNav || S.completed.has(steps[i].id) || i <= reached(); }
  function jump(i) {
    if (!canOpen(i) || i === S.stepIndex) return;
    S.stepIndex = i;
    if (steps[i].type === 'practice') S.practiceIndex = 0;
    save();
    render();
  }
  function nextStep() {
    S.completed.add(steps[S.stepIndex].id);
    let i = S.stepIndex + 1;
    if (i >= steps.length) return finishLesson();
    S.stepIndex = i;
    S.practiceIndex = 0;
    save();
    render();
  }

  // ---------- side panel: parts → steps ----------
  function pathPanel() {
    const cur = steps[S.stepIndex];
    const done = steps.filter((s) => S.completed.has(s.id)).length;
    const total = steps.reduce((a, s) => a + (s.type === 'challenge' ? 0 : minutes(s)), 0);
    const parts = [];
    for (const [i, s] of steps.entries()) {
      let part = parts[parts.length - 1];
      if (!part || part.id !== s.partId) { part = { id: s.partId, title: s.partTitle, skill: s.partSkill, steps: [] }; parts.push(part); }
      part.steps.push([i, s]);
    }
    return h('nav', { class: 'lesson-path', 'aria-label': t('lesson_path') },
      h('div', { class: 'lp-title' }, bidi(L(lesson.title)), h('span', { class: 'muted small' }, ` · ${t('about_min', { n: total })}`)),
      h('ol', { class: 'parts' }, parts.map((part) => {
        const isCur = part.id === cur.partId;
        const allDone = part.steps.every(([, s]) => S.completed.has(s.id));
        const locked = part.steps.every(([, s]) => stepLocked(s));
        const mins = part.steps.reduce((a, [, s]) => a + (s.type === 'challenge' ? 0 : minutes(s)), 0);
        const head = h('button', { class: `part-head ${isCur ? 'now' : allDone ? 'done' : ''}`, type: 'button', 'aria-expanded': String(isCur), onclick: () => jump(part.steps[0][0]) },
          h('span', { class: 'part-dot', 'aria-hidden': 'true' }, allDone ? '✓' : isCur ? '▶' : locked ? '🔒' : '○'),
          h('span', { class: 'part-title' }, bidi(L(part.title))),
          h('span', { class: 'part-min' }, t('about_min', { n: mins })));
        const list = isCur ? h('ol', { class: 'timeline compact' }, part.steps.map(([i, s]) => {
          const state = i === S.stepIndex ? 'now' : S.completed.has(s.id) ? 'done' : 'ahead';
          const open = canOpen(i);
          return h('li', { class: `tl-item ${state}` },
            h('span', { class: 'tl-dot', 'aria-hidden': 'true' }, state === 'done' ? '✓' : state === 'now' ? '▶' : stepLocked(s) ? '🔒' : '·'),
            h('button', { class: 'tl-link', type: 'button', disabled: !open, 'aria-current': state === 'now' ? 'step' : null, onclick: () => jump(i) },
              stepLabel(s)));
        })) : null;
        return h('li', { class: 'part' }, head, list);
      })),
      S.level ? h('div', { class: 'small', style: { marginTop: '12px' } }, t('level_now', { level: t(`level_${S.level}`) }), ' ',
        (policy === 'choose' || preview) && steps.some((s) => s.type === 'choose') ? h('button', { class: 'btn small ghost', type: 'button', onclick: () => jump(steps.findIndex((s) => s.type === 'choose')) }, t('change_level')) : null) : null);
  }
  function stepLabel(s) { return s.title ? L(s.title) : t(`step_${s.type}`); }

  // ---------- "where am I": one slim bar; tap it to open the lesson map ----------
  let pathOpen = false;
  function lessonBar(step) {
    const done = steps.filter((x) => S.completed.has(x.id)).length;
    const drawer = h('div', { class: `lesson-drawer ${pathOpen ? '' : 'hidden'}` }, pathPanel());
    const toggle = h('button', { class: 'lesson-bar-btn', type: 'button', 'aria-expanded': String(pathOpen), onclick: () => {
      pathOpen = !pathOpen; drawer.classList.toggle('hidden', !pathOpen); toggle.setAttribute('aria-expanded', String(pathOpen)); caret.textContent = pathOpen ? '▴' : '▾';
    } },
      h('span', { class: 'lb-icon', 'aria-hidden': 'true' }, STEP_ICON[step.type] || '▶'),
      h('span', { class: 'lb-title' }, stepLabel(step), S.completed.has(step.id) ? ' ✓' : ''),
      h('span', { class: 'lb-count' }, `${S.stepIndex + 1}/${steps.length}`));
    const caret = h('span', { class: 'lb-caret', 'aria-hidden': 'true' }, pathOpen ? '▴' : '▾');
    toggle.append(caret);
    return h('div', { class: 'lesson-bar' }, toggle,
      h('div', { class: 'progressline slim' }, h('span', { style: { width: `${Math.max(3, (done / steps.length) * 100)}%` } })),
      drawer);
  }

  function render() {
    clear(page);
    window.scrollTo(0, 0);
    const step = steps[S.stepIndex];
    app.currentSkill = step.skill;
    const body = h('div', { class: 'lesson-body' });
    page.append(lessonBar(step), body);
    if (stepLocked(step) && !showAll) return lockedStep(body, step);
    if (stepLocked(step) && showAll) body.append(h('div', { class: 'warn', style: { marginBottom: '12px' } }, 'תצוגה מקדימה: החלק הזה נעול כרגע לתלמידים (מיומנות או מילים שלא סומנו כנלמדו).'));
    const run = { warmup: stepItems, words: stepWords, guess: stepGuess, explain: stepExplain, learn: stepLearn, examples: stepExamples, check: stepItems, choose: stepChoose, practice: stepPractice, produce: stepItems, pause: stepPause, exit: stepExit, challenge: stepItems }[step.type];
    run(body, step);
  }

  function lockedStep(body, step) {
    const learn = steps.find((s) => s.partId === step.partId && s.type === 'learn');
    body.append(h('div', { class: 'card' }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '🔒'), h('h2', {}, bidi(L(SKILL_BY_ID[step.skill]?.name))), h('p', {}, t('part_locked')),
      learn ? learnCard(learn.learn) : null),
    actionBar(h('span', { class: 'spacer' }), S.stepIndex < steps.length - 1 ? h('button', { class: 'btn primary', type: 'button', onclick: () => { S.stepIndex += 1; render(); } }, `${t('skip_to_next')} ${fwd()}`) : null));
  }

  // ---------------- WORDS: guess the meaning, then learn it ----------------
  function stepWords(body, step) {
    const words = (step.words || []).map((id) => WORD_BY_ID[id]).filter(Boolean);
    let i = 0;
    const lang = getLang();
    const meaning = (w) => (lang === 'en' ? w.def || w.en : L(w.tr, lang));
    const draw = () => {
      clear(body);
      const w = words[i];
      const others = shuffle(words.filter((x) => x.id !== w.id), w.id).slice(0, 2);
      const opts = shuffle([w, ...others], w.id + 'o');
      const result = h('div', {});
      const nextBtn = h('button', { class: 'btn primary', type: 'button', disabled: true, onclick: () => { i += 1; i < words.length ? draw() : nextStep(); } }, `${t('next')} ${fwd()}`);
      const card = h('div', { class: 'card' },
        h('div', { class: 'instruction' }, h('span', { class: 'num' }, `${i + 1}/${words.length}`), h('span', {}, bidi(t('guess_meaning', { word: w.en })))),
        h('div', { class: 'row', style: { marginBottom: '16px' } }, h('span', { class: 'en-big en', style: { fontSize: '2rem' } }, w.en), speakBtn(w.en, `🔊 ${t('listen')}`)),
        h('div', { class: 'options' }, opts.map((o) => h('button', {
          class: 'option', type: 'button', dir: lang === 'en' ? 'ltr' : dir(lang), lang, 'data-id': o.id,
          onclick: () => {
            card.querySelectorAll('.option').forEach((b) => { b.disabled = true; if (b.dataset.id === w.id) b.classList.add('answer-shown'); });
            const right = o.id === w.id;
            if (!preview && student) api.logEvent({ type: 'vocab_guess', moduleId: lesson.id, data: { word: w.id, guess: o.id, right } });
            clear(result).append(h('div', { class: `feedback ${right ? 'success' : 'hint'}` },
              h('div', { class: 'title' }, right ? `✓ ${t('guess_right')}` : t('guess_learn')),
              h('div', { class: 'row' }, h('span', { class: 'big-emoji', 'aria-hidden': 'true' }, w.emoji || ''), h('div', {},
                h('div', { class: 'en-big' }, en(w.en), ' = ', h('span', { dir: dir(lang), lang }, meaning(w))),
                w.def && lang !== 'en' ? h('div', { class: 'muted' }, en(w.def)) : null))));
            nextBtn.disabled = false; nextBtn.focus();
          },
        }, meaning(o)))),
        result);
      body.append(card, actionBar(h('span', { class: 'spacer' }), nextBtn));
    };
    if (!words.length) return nextStep();
    draw();
  }

  // ---------------- GUESS the rule ----------------
  function stepGuess(body, step) {
    const list = step.guess || [];
    let i = 0;
    const draw = () => {
      clear(body);
      const g = list[i];
      const result = h('div', {});
      const nextBtn = h('button', { class: 'btn primary', type: 'button', disabled: true, onclick: () => { i += 1; i < list.length ? draw() : nextStep(); } }, `${t('next')} ${fwd()}`);
      const card = h('div', { class: 'card' },
        h('div', { class: 'instruction' }, h('span', { class: 'num' }, `${i + 1}/${list.length}`), h('span', {}, bidi(L(g.question)))),
        g.picture ? h('div', { class: 'big-emoji', 'aria-hidden': 'true', style: { marginBottom: '10px' } }, g.picture) : null,
        h('div', { class: 'guess-sentences', dir: 'ltr', lang: 'en' }, g.show.map((s) => h('div', { class: 'row' }, speakBtn(s.replace('___', '…')), sentenceWithHl(s, g.highlight)))),
        h('div', { class: 'options' }, g.options.map((o) => h('button', {
          class: `option ${o.en ? 'en' : ''}`, type: 'button', dir: o.en ? 'ltr' : undefined, 'data-id': o.id,
          onclick: () => {
            card.querySelectorAll('.option').forEach((b) => { b.disabled = true; if (b.dataset.id === g.answer) b.classList.add('answer-shown'); });
            const right = o.id === g.answer;
            if (!preview && student) api.logEvent({ type: 'rule_guess', moduleId: lesson.id, itemId: g.id, data: { guess: o.id, right } });
            clear(result).append(h('div', { class: `feedback ${right ? 'success' : 'hint'}` },
              h('div', { class: 'title' }, right ? `✓ ${t('guess_right')}` : t('guess_learn')),
              h('p', { class: 'en-big' }, bidi(L(g.reveal)))));
            nextBtn.disabled = false; nextBtn.focus();
          },
        }, o.en ? en(L(o.label)) : bidi(L(o.label))))),
        result);
      body.append(card, actionBar(h('span', { class: 'spacer' }), nextBtn));
    };
    if (!list.length) return nextStep();
    draw();
  }

  // ---------------- EXPLAIN: animated word blocks (motion graphics) ----------------
  let explainer = null;
  function stepExplain(body, step) {
    explainer?.stop();
    explainer = renderExplainer(step.explain);
    body.append(h('div', { class: 'card' }, h('h2', {}, bidi(L(step.explain.title))), explainer.el),
      actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: () => { explainer.stop(); nextStep(); } }, `${t('next')} ${fwd()}`)));
  }

  // ---------------- LEARN (one rule, visual) ----------------
  function learnCard(ln) {
    const lang = getLang();
    return h('div', {},
      h('div', { class: 'oneline' }, bidi(L(ln.oneLine))),
      ln.formula ? h('div', { class: 'formula', dir: 'ltr', lang: 'en' }, ln.formula.map((p, k) => h('span', { class: `fpart ${p.key ? 'key' : ''}` }, p.text))) : null,
      ln.table?.length ? h('table', { class: 'ruletable', role: 'presentation' }, ln.table.map((row) => h('tr', {},
        h('td', { lang: 'en' }, row.left),
        Array.isArray(row.right)
          ? h('td', { lang: 'en' }, row.right.map((v, k) => [k ? ' · ' : '', markEnding(v, row.mark)]), ' ', speakBtn(row.right.join(', ')))
          : h('td', { class: 'l1', dir: lang === 'en' ? 'ltr' : dir(lang), lang }, L(row.right))))) : null,
      // "before → after" block pictures (from the teacher's Canva lessons): words that move or appear
      (ln.transforms || []).map((tr) => h('div', { class: 'transform-pic', dir: 'ltr', lang: 'en' },
        h('div', { class: 'blocks' }, tr.from.map((w) => h('span', { class: 'blk' }, w))),
        h('div', { class: 'arrow-down', 'aria-hidden': 'true' }, '⬇'),
        h('div', { class: 'blocks' }, tr.to.map((w) => h('span', { class: `blk ${(tr.mark || []).includes(w) ? 'new' : ''}` }, w))),
        tr.note ? h('div', { class: 'small muted', dir: dir(), lang: getLang() }, bidi(L(tr.note))) : null)),
      (ln.notes || []).map((n) => h('div', { class: 'note' }, h('p', { style: { fontWeight: 500 } }, bidi(L(n.text))), h('div', { class: 'chips' }, n.examples.map((x) => h('span', { class: 'chip en', dir: 'ltr' }, x))))));
  }
  function stepLearn(body, step) {
    body.append(h('div', { class: 'card' }, h('h2', {}, t('learn_title')), learnCard(step.learn)),
      actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: nextStep }, `${t('next')} ${fwd()}`)));
  }

  // ---------------- EXAMPLES ----------------
  function stepExamples(body, step) {
    const lang = getLang();
    body.append(h('div', { class: 'card' },
      h('h2', {}, t('examples_title')),
      step.examples.map((x) => {
        const tr = h('div', { class: 'tr hidden', dir: lang === 'en' ? 'ltr' : dir(lang), lang }, L(x.tr));
        return h('div', { class: 'example' },
          speakBtn(x.en),
          h('div', { style: { flex: 1 } },
            clickableSentence(x.en, { highlight: x.highlight, mark: x.mark === false ? null : 'es?', big: true }),
            x.subjectNote ? h('div', { class: 'small' }, en(x.subjectNote)) : null,
            lang !== 'en' && L(x.tr) ? h('button', { class: 'btn small ghost', type: 'button', onclick: (e) => { tr.classList.toggle('hidden'); e.currentTarget.remove(); } }, t('show_translation')) : null,
            tr));
      })),
    actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: nextStep }, `${t('next')} ${fwd()}`)));
  }

  // ---------------- generic item sequence ----------------
  function runSequence(body, items, mode, onFinish, startAt = 0, step = null) {
    let i = startAt;
    const one = () => {
      if (i >= items.length) return onFinish();
      runExercise(body, {
        module: lesson, item: items[i], level: S.level || 'medium', mode, index: i, total: items.length,
        onDone: (r, meta) => {
          if (!r.grammarSkill) r.grammarSkill = step?.skill || null;
          saveResponse(r);
          S.sessionResponses.push(r);
          if (mode === 'exit') S.exitResults.push({ item: items[i], r, meta });
          i += 1;
          if (mode === 'practice') {
            S.practiceIndex = i; save();
            const tag = remediationNeeded(S.sessionResponses.filter((x) => x.stepType === 'practice'), S.remediated, lesson);
            if (tag) { S.remediated.add(tag); return remediation(body, tag, one); }
          }
          one();
        },
      });
    };
    one();
  }

  function stepItems(body, step) {
    const items = available(step.items);
    const mode = step.type === 'warmup' ? 'check' : step.type;
    if (step.type === 'challenge') {
      body.append(h('div', { class: 'card' }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '⭐'), h('h2', {}, t('step_challenge')), h('p', {}, bidi(t('do_challenge', { n: items.length })))),
        actionBar(h('button', { class: 'btn', type: 'button', onclick: finishLesson }, t('module_done').replace(/🎉/, '').trim()), h('span', { class: 'spacer' }),
          h('button', { class: 'btn primary', type: 'button', onclick: () => runSequence(body, items, 'practice', finishLesson, 0, step) }, `${t('start')} ${fwd()}`)));
      return;
    }
    if (step.type === 'produce') {
      body.append(h('div', { class: 'card' }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '✍️'), h('h2', {}, t('step_produce')), h('p', {}, t('produce_intro'))),
        actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: () => runSequence(body, items, 'produce', nextStep, 0, step) }, `${t('start')} ${fwd()}`)));
      return;
    }
    runSequence(body, items, mode, nextStep, 0, step);
  }

  function stepPause(body) {
    body.append(h('div', { class: 'card', style: { textAlign: 'center' } }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '🧃'), h('h2', {}, t('step_pause')), h('p', {}, t('do_pause'))),
      actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: nextStep }, `${t('continue')} ${fwd()}`)));
  }

  // ---------------- CHOOSE HELP LEVEL: one recommendation, one button ----------------
  function recommendLevel() {
    const checks = [...app.responses, ...S.sessionResponses].filter((r) => r.moduleId === lesson.id && (r.stepType === 'check'));
    const latest = Object.values(Object.fromEntries(checks.map((r) => [r.activityId, r])));
    if (!latest.length) return 'medium';
    const ratio = latest.filter((r) => r.firstTryCorrect).length / latest.length;
    return ratio === 1 ? 'hard' : ratio >= 0.5 ? 'medium' : 'easy';
  }
  function stepChoose(body) {
    if (policy !== 'choose' && !preview) {
      S.level = policy;
      body.append(h('div', { class: 'card' }, h('h2', {}, t('level_assigned', { level: t(`level_${policy}`) })), h('p', {}, bidi(t(`level_${policy}_desc`))), h('p', { class: 'muted' }, t('choose_sub'))),
        actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: nextStep }, `${t('continue')} ${fwd()}`)));
      return;
    }
    if (!S.level) S.level = recommendLevel();
    const dots = { easy: '●○○', medium: '●●○', hard: '●●●' };
    const main = h('button', { class: 'btn primary', type: 'button', onclick: () => { save(); nextStep(); } });
    const shown = h('div', {});
    const draw = () => {
      main.textContent = `${t('continue_with', { level: t(`level_${S.level}`) })} ${fwd()}`;
      clear(shown).append(h('div', { class: 'levelcard selected' }, h('div', { class: 'section-label' }, t('recommended')),
        h('div', { class: 'lvl' }, t(`level_${S.level}`), ' ', h('span', { class: 'dots', 'aria-hidden': 'true' }, dots[S.level])), h('div', {}, bidi(t(`level_${S.level}_desc`)))));
    };
    draw();
    const others = h('details', { class: 'other-levels' }, h('summary', {}, t('other_level')),
      h('div', { class: 'stack', style: { marginTop: '10px' } }, ['easy', 'medium', 'hard'].map((lv) => h('button', { class: 'levelcard', type: 'button', onclick: () => { S.level = lv; draw(); others.open = false; } },
        h('div', { class: 'lvl' }, t(`level_${lv}`), ' ', h('span', { class: 'dots', 'aria-hidden': 'true' }, dots[lv])), h('div', { class: 'small' }, bidi(t(`level_${lv}_desc`)))))));
    body.append(h('div', { class: 'card' }, shown, others),
      actionBar(h('span', { class: 'spacer' }), main));
  }

  // ---------------- PRACTICE ROUND (+ remediation) ----------------
  function stepPractice(body, step) {
    if (!S.level) S.level = policy !== 'choose' ? policy : recommendLevel();
    const items = practiceItems(step);
    runSequence(body, items, 'practice', nextStep, Math.min(S.practiceIndex, items.length), step);
  }

  function remediation(body, tag, resume) {
    const items = available(lesson.remediation?.[tag] || []);
    if (!items.length) return resume();
    if (!preview && student) api.logEvent({ type: 'remediation', moduleId: lesson.id, data: { tag } });
    clear(body);
    const rk = { SPELLING: 'es', WORD_ORDER: 'order', AM_IS_ARE: 'be', ING_FORM: 'ing', TENSE_SELECTION: 'now_vs_habit', DONT_DOESNT: 'ps_neg', DOES_BASE_VERB: 'ps_neg', PROGRESSIVE_NEGATIVE: 'pp_neg', DO_DOES_QUESTION: 'ps_q', BE_QUESTION: 'pp_q', WH_QUESTION: 'wh' }[tag] || 'third';
    body.append(h('div', { class: 'card' }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '🛠️'), h('h2', {}, bidi(t('remediation_title', { topic: t(`topic_${tag}`) }))), ruleCard(rk)),
      actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: go_ }, `${t('start')} ${fwd()}`)));
    function go_() {
      runSequence(body, items, 'remediation', () => {
        clear(body);
        body.append(h('div', { class: 'card' }, h('div', { class: 'feedback success' }, h('div', { class: 'title' }, `✓ ${t('remediation_done')}`))),
          actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: resume }, `${t('continue')} ${fwd()}`)));
      });
    }
  }

  // ---------------- EXIT TICKET ----------------
  function stepExit(body, step) {
    const items = available(step.items).slice(0, 4);
    S.exitResults = [];
    body.append(h('div', { class: 'card' }, h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, '🎟️'), h('h2', {}, t('step_exit')), h('p', {}, t('exit_intro'))),
      actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: () => runSequence(body, items, 'exit', () => exitSummary(body), 0, step) }, `${t('start')} ${fwd()}`)));
  }
  function exitSummary(body) {
    clear(body);
    body.append(h('div', { class: 'card' },
      h('h2', {}, t('exit_done')),
      S.exitResults.map(({ item, r, meta }) => h('div', { class: 'example' },
        h('span', { class: r.grammarCorrect ? 'yes' : 'no', style: { fontSize: '1.5rem' } }, r.correct ? '✓' : r.grammarCorrect ? '◐' : '•'),
        h('div', {},
          item.prompt ? h('div', { class: 'tr', dir: getLang() === 'en' ? 'ltr' : dir(), lang: getLang() }, L(item.prompt)) : null,
          h('div', { class: 'en-big en', dir: 'ltr' }, r.finalResponse),
          r.correct ? null : h('div', {}, h('span', { class: 'small muted' }, t('model_answer'), ' '), clickableSentence(meta.model)),
          !r.correct && r.grammarCorrect ? h('div', { class: 'small ok' }, t('grammar_ok')) : null)))),
    actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: nextStep }, `${t('next')} ${fwd()}`)));
  }

  function finishLesson() {
    steps.forEach((s) => S.completed.add(s.id));
    save({ status: 'completed', stepIndex: steps.length - 1 });
    clear(page);
    page.append(h('div', { class: 'card', style: { textAlign: 'center' } },
      h('div', { class: 'big-emoji' }, '🎉'),
      h('h1', {}, lesson.kind === 'review' ? t('review_done') : t('module_done')),
      h('p', {}, bidi(L(lesson.goal)))),
    actionBar(h('span', { class: 'spacer' }), h('button', { class: 'btn primary', type: 'button', onclick: () => go(preview ? '/t/modules' : '/s/home') }, preview ? '← Teacher' : `${t('back_dashboard')} ${fwd()}`)));
  }

  render();
}

function sentenceWithHl(s, highlights = []) {
  const target = (highlights || []).find((x) => new RegExp(`\\b${x}\\b`, 'i').test(s));
  return target ? highlightEn(s, target, 'es?') : en(s);
}
