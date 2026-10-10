// Saved practice data for one event, kept in this browser only.
import { storageKeys, loadJSON, saveJSON } from "../storage.js";

export const EMPTY_PRACTICE = { missed: [], stats: {}, tests: [] };

export function loadPractice(eventSlug) {
  const s = loadJSON(storageKeys.practice(eventSlug), EMPTY_PRACTICE);
  return { missed: s.missed || [], stats: s.stats || {}, tests: s.tests || [] };
}

export function savePractice(eventSlug, data) {
  saveJSON(storageKeys.practice(eventSlug), data);
}

// Record one answered question: update topic stats and the redo list.
export function recordAnswer(data, q, correct) {
  const t = data.stats[q.topic] || { right: 0, wrong: 0 };
  const missed = new Set(data.missed);
  if (correct) missed.delete(q.key);
  else missed.add(q.key);
  return {
    ...data,
    missed: [...missed],
    stats: { ...data.stats, [q.topic]: { right: t.right + (correct ? 1 : 0), wrong: t.wrong + (correct ? 0 : 1) } },
  };
}
