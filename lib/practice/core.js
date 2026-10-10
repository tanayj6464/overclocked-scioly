// Shared helpers for generated practice questions.
// Every question is built from a seed, so the exact same question can be rebuilt later.

export function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed) {
  const r = mulberry32(seed);
  const rng = {
    next: r,
    int: (a, b) => a + Math.floor(r() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(r() * arr.length)],
    chance: (p) => r() < p,
    shuffle: (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
  return rng;
}

export function newSeed() {
  return Math.floor(Math.random() * 2147483646) + 1;
}

// Clean float noise (0.1 + 0.2 -> 0.3) before rounding or display.
export function clean(x) {
  return Number(Number(x).toPrecision(12));
}

// Standard rounding: 5 or more rounds up.
export function round(x, places = 0) {
  const f = 10 ** places;
  return Math.round(clean(x * f)) / f;
}

// Pediatric rule: always round down.
export function roundDown(x, places = 0) {
  const f = 10 ** places;
  return Math.floor(clean(x * f)) / f;
}

export function fmt(x, maxDigits = 6) {
  return clean(x).toLocaleString("en-US", { maximumFractionDigits: maxDigits });
}

// Show an unrounded working value without a wall of digits.
export function fmtWork(x) {
  const c = clean(x);
  return Number.isInteger(c) ? fmt(c) : fmt(c, 4);
}

const PLACE_NAMES = { 0: "the nearest whole number", 1: "the nearest tenth", 2: "the nearest hundredth" };

export function roundingInstruction(places, down = false) {
  if (places === null || places === undefined) return "Give the exact answer.";
  return down
    ? `This is a pediatric dose, so round down to ${PLACE_NAMES[places]}.`
    : `Round to ${PLACE_NAMES[places]}.`;
}

// Step text for the final rounding, only when rounding changed the value.
export function roundingStep(raw, answer, places, down = false) {
  if (places === null || places === undefined) return null;
  if (clean(raw) === clean(answer)) return null;
  return down
    ? `Pediatric doses always round down: ${fmtWork(raw)} becomes ${fmt(answer)}.`
    : `Round to ${PLACE_NAMES[places]}: ${fmtWork(raw)} becomes ${fmt(answer)}.`;
}

function normalizeText(s, mode) {
  let v = String(s).trim().toUpperCase().replace(/\s+/g, "");
  if (mode === "time") {
    v = v.replace(/[^0-9]/g, "");
    if (v.length === 3) v = "0" + v;
  }
  return v;
}

// Check a typed answer. Returns { correct, message, notes[] }.
export function checkAnswer(q, input) {
  const raw = String(input ?? "").trim();
  if (!raw) return { correct: false, empty: true, message: "Type an answer first.", notes: [] };

  if (q.answerType === "text") {
    const ok = normalizeText(raw, q.textMode) === normalizeText(q.answer, q.textMode);
    return { correct: ok, message: ok ? "Correct." : "Not quite.", notes: [] };
  }

  const numText = raw.replace(/,/g, "").replace(/\s+/g, "");
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(numText)) {
    return { correct: false, empty: true, message: "Enter a number, using digits and a decimal point only.", notes: [] };
  }
  const v = Number(numText);
  const notes = [];
  if (/^-?\./.test(numText)) notes.push("HOSA's rules require a zero before a decimal point (0.5, not .5).");
  if (/\.\d*0$/.test(numText) || /\.$/.test(numText)) notes.push("HOSA's rules say never to add trailing zeros (5, not 5.0).");

  const correct = Math.abs(v - q.answer) < 1e-9;
  if (correct) return { correct, message: "Correct.", notes };

  if (q.places !== null && q.places !== undefined) {
    const unit = 10 ** -q.places;
    const extraDigits = (numText.split(".")[1] || "").length > q.places;
    if (q.rawAnswer !== undefined && extraDigits && Math.abs(v - q.rawAnswer) < unit / 2) {
      return { correct: false, message: "Your math is right, but the answer needs rounding.", notes };
    }
    if (Math.abs(v - q.answer) <= unit + 1e-9) {
      return { correct: false, message: "Very close. Check your rounding.", notes };
    }
  }
  return { correct: false, message: "Not quite.", notes };
}
