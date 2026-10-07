// Prerequisite logic: what is taught, what is today, what is locked.
// Rule: a student never gets an exercise that needs grammar or vocabulary the teacher has not marked as taught.

import { SKILLS, SKILL_BY_ID, WORD_BY_ID, VOCAB_SETS } from '../content/index.js';

// settings = class settings; student = student record (may carry per-student overrides)
export function isSkillUnlocked(skillId, settings, student) {
  if (student?.overrides?.skills?.[skillId] === 'unlock') return true;
  if (student?.overrides?.skills?.[skillId] === 'lock') return false;
  return (settings.unlockedSkills || []).includes(skillId);
}

export function isWordTaught(wordId, settings) {
  return (settings.taughtWords || []).includes(wordId);
}

export function prerequisitesMet(skillId, settings, student) {
  if (student?.overrides?.prereq?.[skillId]) return true; // teacher bypassed prerequisites manually
  const skill = SKILL_BY_ID[skillId];
  return (skill?.prerequisites || []).every((p) => isSkillUnlocked(p, settings, student));
}

// learned | today | locked — for the "Where are we?" screen.
export function skillState(skillId, settings, student) {
  if (!isSkillUnlocked(skillId, settings, student)) return 'locked';
  if (settings.todaySkill === skillId) return 'today';
  return 'learned';
}

export function skillsByState(settings, student) {
  const out = { learned: [], today: [], locked: [] };
  for (const s of [...SKILLS].sort((a, b) => a.order - b.order)) out[skillState(s.id, settings, student)].push(s);
  return out;
}

export function setTaughtState(setId, settings) {
  const set = VOCAB_SETS.find((s) => s.id === setId);
  const taught = set.words.filter((w) => isWordTaught(w, settings)).length;
  return taught === 0 ? 'none' : taught === set.words.length ? 'all' : 'partial';
}

// Why is this item unavailable? [] means available.
export function itemBlockers(item, settings, student) {
  const blockers = [];
  for (const sk of item.requiredSkills || []) {
    if (!isSkillUnlocked(sk, settings, student)) blockers.push({ type: 'skill', id: sk });
  }
  const missingWords = (item.requiredVocabulary || []).filter((w) => !isWordTaught(w, settings));
  if (missingWords.length) blockers.push({ type: 'vocab', ids: missingWords });
  return blockers;
}

export const isItemAvailable = (item, settings, student) => itemBlockers(item, settings, student).length === 0;

// A module opens only when: its skill is unlocked, prerequisites are met, and its focus words were taught.
export function moduleBlockers(module, settings, student) {
  const blockers = [];
  if (!isSkillUnlocked(module.grammarSkill, settings, student)) blockers.push({ type: 'skill', id: module.grammarSkill });
  if (!prerequisitesMet(module.grammarSkill, settings, student)) {
    const missing = (SKILL_BY_ID[module.grammarSkill]?.prerequisites || []).filter((p) => !isSkillUnlocked(p, settings, student));
    missing.forEach((id) => blockers.push({ type: 'prereq', id }));
  }
  for (const sk of module.requiredSkills || []) {
    if (!isSkillUnlocked(sk, settings, student) && !blockers.some((b) => b.id === sk)) blockers.push({ type: 'prereq', id: sk });
  }
  const missingFocus = (module.focusWords || []).filter((w) => !isWordTaught(w, settings));
  if (missingFocus.length) blockers.push({ type: 'vocab', ids: missingFocus });
  return blockers;
}

export function isAssigned(module, assignments, studentId) {
  if (module.kind === 'review') return true; // reviews of taught content are always open
  return assignments.some((a) => a.moduleId === module.id && (a.target === 'all' || a.target === studentId));
}

export function wordLabel(id) {
  return WORD_BY_ID[id]?.en || id;
}
