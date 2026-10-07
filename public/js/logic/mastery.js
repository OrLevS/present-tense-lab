// Mastery is NOT one percentage. Three kinds of evidence are tracked separately:
//   recognition (stage A) · supported production (B–D) · independent production (E–G + exit ticket)
// A skill is "mastered" only when the student produced it correctly several times WITHOUT hints.

import { OVERVIEW_COLUMNS } from '../content/index.js';

export const DEFAULT_THRESHOLDS = {
  recognition: { need: 4, of: 5 },
  supported: { need: 3, of: 4 },
  independent: { need: 3 },
};

export const STAGE_BUCKET = { A: 'recognition', B: 'supported', C: 'supported', D: 'supported', E: 'independent', F: 'independent', G: 'independent' };

const GRAMMAR_TAGS = new Set(['SUBJECT_PRONOUN', 'THIRD_PERSON_S', 'AM_IS_ARE', 'ING_FORM', 'TENSE_SELECTION', 'DONT_DOESNT', 'DOES_BASE_VERB', 'PROGRESSIVE_NEGATIVE', 'DO_DOES_QUESTION', 'BE_QUESTION', 'WORD_ORDER', 'WH_QUESTION']);
const byTime =(a, b) => (a.timestamp || '').localeCompare(b.timestamp || '');
const overridden = (r) => r.teacherOverride === 'correct';

export function bucketOf(r) {
  if (r.isExitTicket) return 'independent';
  return STAGE_BUCKET[r.stage] || null;
}

// Did this response count as evidence for its bucket?
export function counts(r) {
  if (overridden(r)) return true;
  const b = bucketOf(r);
  if (b === 'recognition') return r.grammarCorrect && r.attempts === 1;
  if (b === 'supported') return r.grammarCorrect && r.attempts <= 2 && !r.revealed;
  if (b === 'independent') return r.grammarCorrect && r.attempts === 1 && !r.hintsUsed && !r.supportUsed?.wordBank && !r.revealed;
  return false;
}

export function skillEvidence(responses, skillId, thresholds = DEFAULT_THRESHOLDS) {
  const rs = responses.filter((r) => r.grammarSkill === skillId && r.stepType !== 'guess').sort(byTime);
  const inBucket = (b) => rs.filter((r) => bucketOf(r) === b);

  const rec = inBucket('recognition').slice(-thresholds.recognition.of);
  const sup = inBucket('supported').slice(-thresholds.supported.of);
  const ind = inBucket('independent');

  const ev = {
    recognition: { good: rec.filter(counts).length, total: rec.length, need: thresholds.recognition.need, of: thresholds.recognition.of },
    supported: { good: sup.filter(counts).length, total: sup.length, need: thresholds.supported.need, of: thresholds.supported.of },
    independent: { good: ind.filter(counts).length, total: ind.length, need: thresholds.independent.need },
    exitTicket: { good: rs.filter((r) => r.isExitTicket && (r.grammarCorrect || overridden(r))).length, total: rs.filter((r) => r.isExitTicket).length },
    responses: rs.length,
  };
  ev.recognition.met = ev.recognition.good >= ev.recognition.need;
  ev.supported.met = ev.supported.good >= ev.supported.need;
  ev.independent.met = ev.independent.good >= ev.independent.need;
  ev.status = statusFrom(ev, rs);
  return ev;
}

function statusFrom(ev, rs) {
  if (!rs.length) return 'not_started';
  if (ev.recognition.met && ev.supported.met && ev.independent.met) return 'mastered';
  const recent = rs.slice(-6);
  // A "miss" is a GRAMMAR error on the first try. Spelling / vocabulary slips do not count here.
  const misses = recent.filter((r) => !overridden(r) && (GRAMMAR_TAGS.has(r.firstErrorTag) || (!r.grammarCorrect && r.attempts > 1))).length;
  if (recent.length >= 4 && misses / recent.length >= 0.5) return 'needs_support';
  if (rs.some((r) => r.stepType === 'remediation') && rs.slice(-3).some((r) => !r.grammarCorrect)) return 'needs_support';
  return 'practicing';
}

const RANK = { needs_support: 3, practicing: 2, mastered: 1, not_started: 0 };

export function columnStatus(responses, column, thresholds) {
  const sts = column.skills.map((s) => skillEvidence(responses, s, thresholds).status);
  if (sts.every((s) => s === 'mastered')) return 'mastered';
  if (sts.every((s) => s === 'not_started')) return 'not_started';
  if (sts.includes('needs_support')) return 'needs_support';
  return 'practicing';
}

export function overviewRow(responses, thresholds) {
  return Object.fromEntries(OVERVIEW_COLUMNS.map((c) => [c.id, columnStatus(responses, c, thresholds)]));
}

export function errorTrends(responses) {
  const counts = {};
  for (const r of responses) for (const tag of r.errorTags || []) counts[tag] = (counts[tag] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export { RANK };
