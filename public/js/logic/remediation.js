// Remediation: never hard-lock. When the same error repeats, insert a short repair activity
// (3 focused items), then return the student to the normal path.

export const REMEDIATION_WINDOW = 5;
export const REMEDIATION_TRIGGER = 3;

/**
 * @param sessionResponses responses from THIS practice session, in order
 * @param alreadyDone      Set of tags already remediated in this session
 * @param module           module data (has .remediation[tag])
 * @returns tag to remediate, or null
 */
export function remediationNeeded(sessionResponses, alreadyDone, module) {
  const recent = sessionResponses.slice(-REMEDIATION_WINDOW);
  const counts = {};
  for (const r of recent) for (const tag of new Set(r.errorTags || [])) counts[tag] = (counts[tag] || 0) + 1;
  const tag = Object.keys(counts)
    .filter((k) => counts[k] >= REMEDIATION_TRIGGER && module.remediation?.[k]?.length && !alreadyDone.has(k))
    .sort((a, b) => counts[b] - counts[a])[0];
  return tag || null;
}
