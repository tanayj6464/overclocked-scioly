// Browser-only storage for study settings and progress.
// Keys are versioned so saved data can be imported into accounts later.
export const storageKeys = {
  plan: (eventSlug) => `fmp:v1:plan:${eventSlug}`,
  progress: (eventSlug) => `fmp:v1:progress:${eventSlug}`,
  cards: (eventSlug, deckSlug) => `fmp:v1:cards:${eventSlug}:${deckSlug}`,
  practice: (eventSlug) => `fmp:v1:practice:${eventSlug}`,
};

export function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: the tool still works, it just won't remember */
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {}
}
