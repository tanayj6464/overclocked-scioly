// Medical Math question generators. Original questions; answers are computed, never typed by hand.
// Rules follow HOSA's 2026-2027 Medical Math guidelines: round only the final answer,
// standard rounding (5 or more rounds up), pediatric doses round down, conversions from the
// official reference sheet.
import { clean, round, roundDown, fmt, fmtWork, roundingInstruction, roundingStep } from "./core.js";

const T = {
  ess: "mathematical-essentials",
  meas: "measurement-and-conversion-problems",
  dose: "drug-dosages-and-intravenous-solutions",
  sol: "dilutions-solutions-and-concentrations",
  info: "interpreting-medical-information",
};

// Builds the common shape: rounds once, at the end.
function q({ prompt, raw, places = 0, down = false, unit = "", steps, table, chart, exact = false, instruction }) {
  const answer = exact ? clean(raw) : down ? roundDown(raw, places) : round(raw, places);
  const p = exact ? null : places;
  return {
    prompt,
    instruction: instruction || roundingInstruction(p, down),
    answer,
    rawAnswer: clean(raw),
    places: p,
    down,
    unit,
    table,
    chart,
    steps: [...steps, roundingStep(raw, answer, p, down)].filter(Boolean),
  };
}

// ---------- Roman numerals ----------
const ROMAN = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];
function romanParts(n) {
  const parts = [];
  for (const [v, s] of ROMAN) {
    while (n >= v) {
      const last = parts[parts.length - 1];
      if (last && last.base === s && s.length === 1) {
        last.sym += s;
        last.val += v;
      } else parts.push({ sym: s, val: v, base: s });
      n -= v;
    }
  }
  return parts;
}
const toRoman = (n) => romanParts(n).map((p) => p.sym).join("");
const tabs = (n) => `${fmt(n)} tablet${n === 1 ? "" : "s"}`;

const pad2 = (n) => String(n).padStart(2, "0");

const UNIT_NAMES = {
  kg: "kilograms", g: "grams", mg: "milligrams", mcg: "micrograms",
  L: "liters", mL: "milliliters", dL: "deciliters", m: "meters", cm: "centimeters", mm: "millimeters",
  tsp: "teaspoons", tbsp: "tablespoons", oz: "ounces", cup: "cups", gtts: "drops (gtts)",
};

const DATASETS = [
  { name: "heart rates", unit: "beats per minute", lo: 58, hi: 112, dec: 0 },
  { name: "temperatures", unit: "°F", lo: 970, hi: 1025, dec: 1 },
  { name: "blood glucose readings", unit: "mg/dL", lo: 70, hi: 240, dec: 0 },
  { name: "systolic blood pressures", unit: "mm Hg", lo: 100, hi: 172, dec: 0 },
  { name: "respiratory rates", unit: "breaths per minute", lo: 12, hi: 28, dec: 0 },
];
function dataValues(rng, ds, n, distinct = false) {
  const vals = [];
  let guard = 0;
  while (vals.length < n && guard++ < 500) {
    const raw = rng.int(ds.lo, ds.hi);
    const v = ds.dec ? raw / 10 : raw;
    if (distinct && vals.includes(v)) continue;
    vals.push(v);
  }
  return vals;
}
const list = (vals) => vals.map((v) => fmt(v)).join(", ");

// =====================================================================
export const generators = [
  // ---------------- Mathematical essentials ----------------
  {
    id: "ess-roman-to-arabic", topic: T.ess,
    make(rng) {
      const n = rng.int(4, 1999);
      const parts = romanParts(n);
      const r = q({
        prompt: `Convert the Roman numeral ${toRoman(n)} to an Arabic number.`,
        raw: n, exact: true,
        steps: [
          "Read left to right. A smaller numeral before a larger one is subtracted (IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900).",
          `Split it into parts: ${parts.map((p) => `${p.sym} = ${fmt(p.val)}`).join(", ")}.`,
          `Add the parts: ${parts.map((p) => fmt(p.val)).join(" + ")} = ${fmt(n)}.`,
        ],
      });
      return r;
    },
  },
  {
    id: "ess-arabic-to-roman", topic: T.ess,
    make(rng) {
      const n = rng.int(4, 399);
      const pieces = [Math.floor(n / 100) * 100, Math.floor((n % 100) / 10) * 10, n % 10].filter((x) => x > 0);
      return {
        prompt: `Write ${n} as a Roman numeral.`,
        instruction: "Use capital letters, like XIV.",
        answer: toRoman(n), answerType: "text", display: toRoman(n),
        steps: [
          `Split ${n} by place value: ${pieces.map(fmt).join(" + ")}.`,
          `Write each part: ${pieces.map((p) => `${p} = ${toRoman(p)}`).join(", ")}.`,
          `Put them together in order: ${toRoman(n)}.`,
        ],
      };
    },
  },
  {
    id: "ess-military-time", topic: T.ess,
    make(rng) {
      const h = rng.int(1, 12);
      const m = rng.int(0, 59);
      const pm = rng.chance(0.5);
      const h24 = pm ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
      const ans = `${pad2(h24)}${pad2(m)}`;
      let rule;
      if (!pm && h === 12) rule = "12 AM is midnight, which is hour 00 in 24-hour time.";
      else if (pm && h === 12) rule = "12 PM is noon, which stays 12 in 24-hour time.";
      else if (pm) rule = `For PM times from 1 to 11, add 12 to the hour: ${h} + 12 = ${h24}.`;
      else rule = `For AM times from 1 to 11, keep the hour and add a leading zero if needed: ${pad2(h24)}.`;
      return {
        prompt: `Convert ${h}:${pad2(m)} ${pm ? "PM" : "AM"} to 24-hour (military) time.`,
        instruction: "Write all four digits, like 0830.",
        answer: ans, answerType: "text", textMode: "time", display: ans,
        steps: [rule, `Keep the minutes (${pad2(m)}) and drop the colon: ${ans}.`],
      };
    },
  },
  {
    id: "ess-percent-of", topic: T.ess,
    make(rng) {
      const p = rng.pick([5, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 90]);
      const base = rng.int(20, 900);
      const raw = (p / 100) * base;
      return q({
        prompt: `What is ${p}% of ${fmt(base)}?`, raw, places: 1,
        steps: [`Change the percent to a decimal: ${p}% = ${fmt(p / 100)}.`, `Multiply: ${fmt(p / 100)} × ${fmt(base)} = ${fmtWork(raw)}.`],
      });
    },
  },
  {
    id: "ess-fraction-to-percent", topic: T.ess,
    make(rng) {
      const b = rng.pick([3, 6, 7, 8, 9, 11, 12, 16, 20, 25, 40]);
      const a = rng.int(1, b - 1);
      const raw = (a / b) * 100;
      return q({
        prompt: `Write the fraction ${a}/${b} as a percent.`, raw, places: 1, unit: "%",
        steps: [`Divide the top by the bottom: ${a} ÷ ${b} = ${fmtWork(a / b)}.`, `Multiply by 100 to get a percent: ${fmtWork(raw)}%.`],
      });
    },
  },
  {
    id: "ess-proportion", topic: T.ess,
    make(rng) {
      const a = rng.int(1, 12), b = rng.int(2, 15), d = rng.int(2, 60);
      const raw = (a * d) / b;
      return q({
        prompt: `Solve for x: ${a} : ${b} = x : ${d}`, raw, places: 1,
        steps: [
          `In a proportion, the product of the means equals the product of the extremes: ${b} × x = ${a} × ${d}.`,
          `So x = (${a} × ${d}) ÷ ${b} = ${a * d} ÷ ${b} = ${fmtWork(raw)}.`,
        ],
      });
    },
  },

  // ---------------- Measurement and conversion ----------------
  {
    id: "meas-metric-weight", topic: T.meas,
    make(rng) {
      const [big, small, f] = rng.pick([["kg", "g", 1000], ["g", "mg", 1000], ["mg", "mcg", 1000], ["g", "mcg", 1000000]]);
      const down = rng.chance(0.5);
      if (down) {
        const v = clean(rng.int(1, 999) / rng.pick([1, 10, 100, 1000]));
        const raw = v * f;
        return q({
          prompt: `Convert ${fmt(v)} ${big} to ${small}.`, raw, exact: true, unit: small,
          steps: [
            `1 ${big} = ${fmt(f)} ${small}.`,
            `Going from a larger unit to a smaller one, multiply: ${fmt(v)} × ${fmt(f)} = ${fmt(raw)} ${small}.`,
          ],
        });
      }
      const v = rng.int(1, 9999) * rng.pick([1, 1, 10]);
      const raw = v / f;
      return q({
        prompt: `Convert ${fmt(v)} ${small} to ${big}.`, raw, exact: true, unit: big,
        steps: [
          `1 ${big} = ${fmt(f)} ${small}.`,
          `Going from a smaller unit to a larger one, divide: ${fmt(v)} ÷ ${fmt(f)} = ${fmt(raw)} ${big}.`,
        ],
      });
    },
  },
  {
    id: "meas-metric-volume-length", topic: T.meas,
    make(rng) {
      const [big, small, f] = rng.pick([["L", "mL", 1000], ["L", "dL", 10], ["m", "cm", 100], ["cm", "mm", 10], ["m", "mm", 1000]]);
      const down = rng.chance(0.5);
      if (down) {
        const v = clean(rng.int(1, 250) / rng.pick([1, 10, 100]));
        const raw = v * f;
        return q({
          prompt: `Convert ${fmt(v)} ${big} to ${small}.`, raw, exact: true, unit: small,
          steps: [`1 ${big} = ${fmt(f)} ${small}.`, `Larger unit to smaller unit, so multiply: ${fmt(v)} × ${fmt(f)} = ${fmt(raw)} ${small}.`],
        });
      }
      const v = rng.int(1, 5000);
      const raw = v / f;
      return q({
        prompt: `Convert ${fmt(v)} ${small} to ${big}.`, raw, exact: true, unit: big,
        steps: [`1 ${big} = ${fmt(f)} ${small}.`, `Smaller unit to larger unit, so divide: ${fmt(v)} ÷ ${fmt(f)} = ${fmt(raw)} ${big}.`],
      });
    },
  },
  {
    id: "meas-lb-kg", topic: T.meas,
    make(rng) {
      if (rng.chance(0.5)) {
        const lb = rng.int(8, 300);
        const raw = lb / 2.2;
        return q({
          prompt: `A patient weighs ${lb} lb. What is the patient's weight in kilograms?`, raw, places: 1, unit: "kg",
          steps: ["1 kg = 2.2 lb, so divide pounds by 2.2.", `${lb} ÷ 2.2 = ${fmtWork(raw)} kg.`],
        });
      }
      const kg = clean(rng.int(3, 140) + rng.pick([0, 0, 0.5]));
      const raw = kg * 2.2;
      return q({
        prompt: `A patient weighs ${fmt(kg)} kg. What is the patient's weight in pounds?`, raw, places: 1, unit: "lb",
        steps: ["1 kg = 2.2 lb, so multiply kilograms by 2.2.", `${fmt(kg)} × 2.2 = ${fmtWork(raw)} lb.`],
      });
    },
  },
  {
    id: "meas-household", topic: T.meas,
    make(rng) {
      const [from, to, f] = rng.pick([
        ["tsp", "mL", 5], ["tbsp", "mL", 15], ["oz", "mL", 30], ["cup", "mL", 240],
        ["tbsp", "tsp", 3], ["oz", "tbsp", 2], ["oz", "tsp", 6], ["cup", "oz", 8], ["cup", "tbsp", 16], ["mL", "gtts", 15],
      ]);
      if (rng.chance(0.5)) {
        const v = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]);
        const raw = v * f;
        return q({
          prompt: `How many ${UNIT_NAMES[to]} are in ${fmt(v)} ${from}?`, raw, exact: true, unit: to,
          steps: [`From the reference sheet: 1 ${from} = ${f} ${to}.`, `Multiply: ${fmt(v)} × ${f} = ${fmt(raw)} ${to}.`],
        });
      }
      const target = rng.pick([0.5, 1, 1.5, 2, 3, 4, 6, 8]);
      const v = clean(target * f);
      return q({
        prompt: `How many ${UNIT_NAMES[from]} are in ${fmt(v)} ${to}?`, raw: v / f, exact: true, unit: from,
        steps: [`From the reference sheet: 1 ${from} = ${f} ${to}.`, `Divide: ${fmt(v)} ÷ ${f} = ${fmt(v / f)} ${from}.`],
      });
    },
  },
  {
    id: "meas-temperature", topic: T.meas,
    make(rng) {
      if (rng.chance(0.5)) {
        const F = rng.int(950, 1052) / 10;
        const raw = ((F - 32) * 5) / 9;
        return q({
          prompt: `A patient's temperature is ${fmt(F)}°F. What is it in degrees Celsius?`, raw, places: 1, unit: "°C",
          steps: ["Use °C = (°F − 32) × 5/9.", `${fmt(F)} − 32 = ${fmtWork(F - 32)}.`, `${fmtWork(F - 32)} × 5/9 = ${fmtWork(raw)}°C.`],
        });
      }
      const C = rng.int(350, 412) / 10;
      const raw = (C * 9) / 5 + 32;
      return q({
        prompt: `A patient's temperature is ${fmt(C)}°C. What is it in degrees Fahrenheit?`, raw, places: 1, unit: "°F",
        steps: ["Use °F = (°C × 9/5) + 32.", `${fmt(C)} × 9/5 = ${fmtWork((C * 9) / 5)}.`, `${fmtWork((C * 9) / 5)} + 32 = ${fmtWork(raw)}°F.`],
      });
    },
  },
  {
    id: "meas-length", topic: T.meas,
    make(rng) {
      const kind = rng.int(0, 2);
      if (kind === 0) {
        const inch = rng.int(18, 78);
        const raw = inch * 2.54;
        return q({
          prompt: `Convert ${inch} inches to centimeters.`, raw, places: 1, unit: "cm",
          steps: ["1 in = 2.54 cm, so multiply inches by 2.54.", `${inch} × 2.54 = ${fmtWork(raw)} cm.`],
        });
      }
      if (kind === 1) {
        const ft = rng.int(4, 6), inch = rng.int(0, 11);
        const total = ft * 12 + inch;
        const raw = total * 2.54;
        return q({
          prompt: `A patient is ${ft} feet ${inch} inches tall. What is the height in centimeters?`, raw, places: 1, unit: "cm",
          steps: [
            `Change to inches first (1 ft = 12 in): ${ft} × 12 + ${inch} = ${total} in.`,
            `Then multiply by 2.54 (1 in = 2.54 cm): ${total} × 2.54 = ${fmtWork(raw)} cm.`,
          ],
        });
      }
      const cm = rng.int(45, 200);
      const raw = cm / 2.54;
      return q({
        prompt: `Convert ${cm} centimeters to inches.`, raw, places: 1, unit: "in",
        steps: ["1 in = 2.54 cm, so divide centimeters by 2.54.", `${cm} ÷ 2.54 = ${fmtWork(raw)} in.`],
      });
    },
  },
  {
    id: "meas-bsa", topic: T.meas,
    make(rng) {
      if (rng.chance(0.5)) {
        const h = rng.int(90, 195);
        const w = rng.int(Math.round(h * 0.18), Math.round(h * 0.55));
        const prod = h * w;
        const raw = Math.sqrt(prod / 3600);
        return q({
          prompt: `A patient is ${h} cm tall and weighs ${w} kg. What is the patient's body surface area (BSA) in m²?`,
          raw, places: 2, unit: "m²",
          steps: [
            "With centimeters and kilograms, BSA = √(height × weight ÷ 3,600).",
            `${h} × ${w} = ${fmt(prod)}.`,
            `${fmt(prod)} ÷ 3,600 = ${fmtWork(prod / 3600)}.`,
            `√${fmtWork(prod / 3600)} = ${fmtWork(raw)} m².`,
          ],
        });
      }
      const h = rng.int(36, 76);
      const w = rng.int(Math.round(h * 0.9), Math.round(h * 3.3));
      const prod = h * w;
      const raw = Math.sqrt(prod / 3131);
      return q({
        prompt: `A patient is ${h} inches tall and weighs ${w} lb. What is the patient's body surface area (BSA) in m²?`,
        raw, places: 2, unit: "m²",
        steps: [
          "With inches and pounds, BSA = √(height × weight ÷ 3,131).",
          `${h} × ${w} = ${fmt(prod)}.`,
          `${fmt(prod)} ÷ 3,131 = ${fmtWork(prod / 3131)}.`,
          `√${fmtWork(prod / 3131)} = ${fmtWork(raw)} m².`,
        ],
      });
    },
  },

  // ---------------- Drug dosages and IV solutions ----------------
  {
    id: "dose-tablets", topic: T.dose,
    make(rng) {
      const have = rng.pick([5, 10, 20, 25, 40, 50, 100, 200, 250, 500]);
      const count = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      const want = clean(have * count);
      return q({
        prompt: `A provider orders ${fmt(want)} mg of a drug by mouth. The tablets on hand are ${have} mg each. How many tablets should be given?`,
        raw: count, exact: true, unit: count === 1 ? "tablet" : "tablets",
        instruction: "The tablets are scored, so half tablets are allowed. Give the exact answer.",
        steps: [
          "Use the dosage formula: Desired ÷ Have × Quantity (D/H × Q).",
          `${fmt(want)} mg ÷ ${have} mg × 1 tablet = ${tabs(count)}.`,
        ],
      });
    },
  },
  {
    id: "dose-tablets-convert", topic: T.dose,
    make(rng) {
      if (rng.chance(0.5)) {
        const have = rng.pick([125, 250, 500]);
        const count = rng.pick([1, 2, 3, 4]);
        const wantMg = have * count;
        const wantG = clean(wantMg / 1000);
        return q({
          prompt: `The order is ${fmt(wantG)} g by mouth. You have ${have} mg tablets. How many tablets should be given?`,
          raw: count, exact: true, unit: count === 1 ? "tablet" : "tablets",
          steps: [
            "The order and the tablets use different units, so convert first. 1 g = 1,000 mg.",
            `${fmt(wantG)} g × 1,000 = ${fmt(wantMg)} mg.`,
            `D/H × Q: ${fmt(wantMg)} mg ÷ ${have} mg × 1 tablet = ${tabs(count)}.`,
          ],
        });
      }
      const have = rng.pick([25, 50, 75, 100, 125, 150]);
      const count = rng.pick([0.5, 1, 2, 3]);
      const wantMcg = clean(have * count);
      const wantMg = clean(wantMcg / 1000);
      return q({
        prompt: `The order is ${fmt(wantMg)} mg by mouth. You have ${have} mcg tablets. How many tablets should be given?`,
        raw: count, exact: true, unit: count === 1 ? "tablet" : "tablets",
        instruction: "The tablets are scored, so half tablets are allowed. Give the exact answer.",
        steps: [
          "The order and the tablets use different units, so convert first. 1 mg = 1,000 mcg.",
          `${fmt(wantMg)} mg × 1,000 = ${fmt(wantMcg)} mcg.`,
          `D/H × Q: ${fmt(wantMcg)} mcg ÷ ${have} mcg × 1 tablet = ${tabs(count)}.`,
        ],
      });
    },
  },
  {
    id: "dose-liquid", topic: T.dose,
    make(rng) {
      const [mg, ml] = rng.pick([[125, 5], [250, 5], [100, 5], [200, 5], [40, 1], [50, 1], [80, 1], [10, 1], [20, 1], [100, 2]]);
      const perMl = mg / ml;
      const want = Math.max(1, Math.round((perMl * rng.int(2, 60)) / 4));
      const raw = (want / mg) * ml;
      return q({
        prompt: `The order is ${fmt(want)} mg of a liquid medication. It is supplied as ${mg} mg per ${ml} mL. How many mL should be given?`,
        raw, places: 1, unit: "mL",
        steps: [
          "Use D/H × Q, where Q is the volume that holds the 'have' amount.",
          `${fmt(want)} mg ÷ ${mg} mg × ${ml} mL = ${fmtWork(raw)} mL.`,
        ],
      });
    },
  },
  {
    id: "dose-units", topic: T.dose,
    make(rng) {
      const conc = rng.pick([1000, 5000, 10000, 20000]);
      const want = rng.int(1, 30) * 500;
      const raw = want / conc;
      return q({
        prompt: `Heparin ${fmt(want)} units is ordered. The vial contains ${fmt(conc)} units per mL. How many mL should be given?`,
        raw, places: 2, unit: "mL",
        steps: ["Use D/H × Q.", `${fmt(want)} units ÷ ${fmt(conc)} units × 1 mL = ${fmtWork(raw)} mL.`],
      });
    },
  },
  {
    id: "dose-weight-adult", topic: T.dose,
    make(rng) {
      const mgkg = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 10, 15]);
      const lb = rng.int(100, 260);
      const kg = lb / 2.2;
      const raw = mgkg * kg;
      return q({
        prompt: `An adult patient weighs ${lb} lb. The order is ${fmt(mgkg)} mg/kg. How many mg should the patient receive?`,
        raw, places: 0, unit: "mg",
        steps: [
          `Convert pounds to kilograms: ${lb} ÷ 2.2 = ${fmtWork(kg)} kg. Don't round yet; round only the final answer.`,
          `Multiply by the dose per kg: ${fmt(mgkg)} mg/kg × ${fmtWork(kg)} kg = ${fmtWork(raw)} mg.`,
        ],
      });
    },
  },
  {
    id: "dose-weight-pediatric", topic: T.dose,
    make(rng) {
      const perDay = rng.pick([20, 25, 30, 40, 50, 60, 75, 80, 90, 100]);
      const [n, every] = rng.pick([[2, "every 12 hours"], [3, "every 8 hours"], [4, "every 6 hours"]]);
      const lb = rng.int(12, 80);
      const kg = lb / 2.2;
      const daily = perDay * kg;
      const raw = daily / n;
      return q({
        prompt: `A child weighs ${lb} lb. The order is ${perDay} mg/kg/day, divided into equal doses given ${every}. How many mg should be given per dose?`,
        raw, places: 0, down: true, unit: "mg",
        steps: [
          `Convert pounds to kilograms: ${lb} ÷ 2.2 = ${fmtWork(kg)} kg.`,
          `Find the daily dose: ${perDay} mg/kg/day × ${fmtWork(kg)} kg = ${fmtWork(daily)} mg per day.`,
          `"${every[0].toUpperCase() + every.slice(1)}" means ${n} doses a day: ${fmtWork(daily)} ÷ ${n} = ${fmtWork(raw)} mg per dose.`,
        ],
      });
    },
  },
  {
    id: "iv-ml-per-hour", topic: T.dose,
    make(rng) {
      const vol = rng.pick([250, 500, 750, 1000, 1500, 2000, 3000]);
      const hrs = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 24]);
      const raw = vol / hrs;
      return q({
        prompt: `Infuse ${fmt(vol)} mL of IV fluid over ${hrs} hour${hrs > 1 ? "s" : ""}. What is the rate in mL/hr?`,
        raw, places: 0, unit: "mL/hr",
        steps: ["mL/hr = total volume ÷ total hours.", `${fmt(vol)} mL ÷ ${hrs} hr = ${fmtWork(raw)} mL/hr.`],
      });
    },
  },
  {
    id: "iv-drops-per-minute", topic: T.dose,
    make(rng) {
      const df = rng.pick([10, 15, 20, 60]);
      let vol, minutes, timeText;
      if (rng.chance(0.4)) {
        vol = rng.pick([50, 100, 150]);
        minutes = rng.pick([15, 20, 30, 45, 60]);
        timeText = `${minutes} minutes`;
      } else {
        vol = rng.pick([250, 500, 1000]);
        const hrs = rng.pick([1, 2, 4, 6, 8, 10, 12]);
        minutes = hrs * 60;
        timeText = `${hrs} hour${hrs > 1 ? "s" : ""}`;
      }
      const raw = (vol * df) / minutes;
      const convert = timeText.includes("hour") ? [`Change the time to minutes: ${timeText} = ${minutes} minutes.`] : [];
      return q({
        prompt: `Infuse ${fmt(vol)} mL over ${timeText}. The tubing's drop factor is ${df} gtt/mL. What is the flow rate in drops per minute?`,
        raw, places: 0, unit: "gtt/min",
        steps: [
          "gtt/min = (volume in mL × drop factor) ÷ time in minutes.",
          ...convert,
          `(${fmt(vol)} × ${df}) ÷ ${minutes} = ${fmt(vol * df)} ÷ ${minutes} = ${fmtWork(raw)} gtt/min.`,
        ],
      });
    },
  },
  {
    id: "iv-infusion-time", topic: T.dose,
    make(rng) {
      const vol = rng.pick([100, 250, 500, 750, 1000]);
      const rate = rng.pick([25, 40, 50, 60, 75, 80, 100, 125, 150, 200]);
      const raw = vol / rate;
      return q({
        prompt: `An IV bag holds ${fmt(vol)} mL and is running at ${rate} mL/hr. How many hours will it take to finish?`,
        raw, places: 1, unit: "hours",
        steps: ["Time (hours) = volume ÷ rate.", `${fmt(vol)} mL ÷ ${rate} mL/hr = ${fmtWork(raw)} hours.`],
      });
    },
  },
  {
    id: "dose-bsa", topic: T.dose,
    make(rng) {
      const per = rng.pick([10, 25, 50, 75, 100, 150, 200, 250, 375]);
      const bsa = rng.int(50, 220) / 100;
      const raw = per * bsa;
      return q({
        prompt: `The order is ${per} mg/m². The patient's body surface area is ${fmt(bsa)} m². How many mg should be given?`,
        raw, places: 0, unit: "mg",
        steps: ["Dose = dose per m² × BSA.", `${per} mg/m² × ${fmt(bsa)} m² = ${fmtWork(raw)} mg.`],
      });
    },
  },
  {
    id: "iv-units-per-hour", topic: T.dose,
    make(rng) {
      const [units, bag] = rng.pick([[25000, 500], [25000, 250], [20000, 500], [10000, 250]]);
      const conc = units / bag;
      if (rng.chance(0.5)) {
        const rate = rng.int(5, 40);
        const raw = rate * conc;
        return q({
          prompt: `Heparin ${fmt(units)} units in ${bag} mL is infusing at ${rate} mL/hr. How many units per hour is the patient receiving?`,
          raw, places: 0, unit: "units/hr",
          steps: [
            `Find the concentration: ${fmt(units)} units ÷ ${bag} mL = ${fmtWork(conc)} units/mL.`,
            `Multiply by the rate: ${fmtWork(conc)} units/mL × ${rate} mL/hr = ${fmtWork(raw)} units/hr.`,
          ],
        });
      }
      const want = rng.int(8, 40) * 50;
      const raw = want / conc;
      return q({
        prompt: `Heparin ${fmt(units)} units in ${bag} mL is ordered to run at ${fmt(want)} units/hr. What should the pump be set to, in mL/hr?`,
        raw, places: 0, unit: "mL/hr",
        steps: [
          `Find the concentration: ${fmt(units)} units ÷ ${bag} mL = ${fmtWork(conc)} units/mL.`,
          `Divide the ordered dose by the concentration: ${fmt(want)} ÷ ${fmtWork(conc)} = ${fmtWork(raw)} mL/hr.`,
        ],
      });
    },
  },

  // ---------------- Dilutions, solutions, and concentrations ----------------
  {
    id: "sol-stock-volume", topic: T.sol,
    make(rng) {
      const c1 = rng.pick([10, 20, 25, 40, 50, 70, 95, 100]);
      const c2 = rng.pick([0.5, 1, 2, 2.5, 5, 10, 12.5, 20, 25, 30, 40, 50].filter((x) => x < c1));
      const v2 = rng.pick([50, 100, 150, 200, 250, 500, 1000]);
      const raw = (c2 * v2) / c1;
      return q({
        prompt: `You need ${fmt(v2)} mL of a ${fmt(c2)}% solution. You have a ${c1}% stock solution. How many mL of the stock solution do you need?`,
        raw, places: 1, unit: "mL",
        steps: [
          "Use C₁V₁ = C₂V₂, where C₁ and V₁ are the stock and C₂ and V₂ are what you want.",
          `${c1}% × V₁ = ${fmt(c2)}% × ${fmt(v2)} mL.`,
          `V₁ = (${fmt(c2)} × ${fmt(v2)}) ÷ ${c1} = ${fmt(c2 * v2)} ÷ ${c1} = ${fmtWork(raw)} mL.`,
        ],
      });
    },
  },
  {
    id: "sol-diluent", topic: T.sol,
    make(rng) {
      const c1 = rng.pick([10, 20, 25, 40, 50, 70, 95]);
      const c2 = rng.pick([1, 2, 2.5, 5, 10, 12.5, 20, 25, 30].filter((x) => x < c1));
      const v2 = rng.pick([100, 200, 250, 500, 1000]);
      const v1 = (c2 * v2) / c1;
      const raw = v2 - v1;
      return q({
        prompt: `To make ${fmt(v2)} mL of a ${fmt(c2)}% solution from a ${c1}% stock, how many mL of diluent (water) must be added?`,
        raw, places: 1, unit: "mL",
        steps: [
          `First find the stock needed with C₁V₁ = C₂V₂: V₁ = (${fmt(c2)} × ${fmt(v2)}) ÷ ${c1} = ${fmtWork(v1)} mL. Don't round yet.`,
          `Diluent = final volume − stock volume: ${fmt(v2)} − ${fmtWork(v1)} = ${fmtWork(raw)} mL.`,
        ],
      });
    },
  },
  {
    id: "sol-grams-in-solution", topic: T.sol,
    make(rng) {
      const [name, pct] = rng.pick([
        ["dextrose", 5], ["dextrose", 10], ["dextrose", 20], ["dextrose", 50],
        ["sodium chloride", 0.9], ["sodium chloride", 0.45], ["sodium chloride", 3],
      ]);
      const vol = rng.pick([50, 100, 250, 500, 1000]);
      const raw = (pct * vol) / 100;
      return q({
        prompt: `How many grams of ${name} are in ${fmt(vol)} mL of a ${fmt(pct)}% ${name} solution?`,
        raw, places: 1, unit: "g",
        steps: [
          `A percent solution (weight/volume) means grams per 100 mL, so ${fmt(pct)}% = ${fmt(pct)} g per 100 mL.`,
          `${fmt(pct)} g ÷ 100 mL × ${fmt(vol)} mL = ${fmtWork(raw)} g.`,
        ],
      });
    },
  },
  {
    id: "sol-percent-strength", topic: T.sol,
    make(rng) {
      const g = rng.int(1, 50);
      const vol = rng.pick([50, 100, 200, 250, 500, 1000]);
      const raw = (g / vol) * 100;
      return q({
        prompt: `${g} g of a drug is dissolved to make ${fmt(vol)} mL of solution. What is the percent strength (w/v)?`,
        raw, places: 1, unit: "%",
        steps: [
          "Percent strength (w/v) = grams of drug ÷ mL of solution × 100.",
          `${g} ÷ ${fmt(vol)} × 100 = ${fmtWork(raw)}%.`,
        ],
      });
    },
  },
  {
    id: "sol-percent-to-mg-ml", topic: T.sol,
    make(rng) {
      const pct = rng.pick([0.1, 0.2, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 50]);
      const raw = pct * 10;
      return q({
        prompt: `How many mg per mL are in a ${fmt(pct)}% solution?`, raw, exact: true, unit: "mg/mL",
        steps: [
          `${fmt(pct)}% (w/v) means ${fmt(pct)} g in 100 mL.`,
          `Change grams to mg: ${fmt(pct)} g = ${fmt(pct * 1000)} mg, so it's ${fmt(pct * 1000)} mg in 100 mL.`,
          `Divide by 100 to get one mL: ${fmt(pct * 1000)} ÷ 100 = ${fmt(raw)} mg/mL. (Shortcut: percent × 10.)`,
        ],
      });
    },
  },
  {
    id: "sol-ratio-strength", topic: T.sol,
    make(rng) {
      const r = rng.pick([1000, 2000, 5000, 10000]);
      const vol = rng.pick([0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5, 10]);
      const perMl = 1000 / r;
      const raw = vol * perMl;
      return q({
        prompt: `Epinephrine comes in a 1:${fmt(r)} solution. How many mg are in ${fmt(vol)} mL?`,
        raw, places: 2, unit: "mg",
        steps: [
          `A ratio strength of 1:${fmt(r)} means 1 g of drug in ${fmt(r)} mL.`,
          `1 g = 1,000 mg, so that's 1,000 mg ÷ ${fmt(r)} mL = ${fmt(perMl)} mg/mL.`,
          `${fmt(perMl)} mg/mL × ${fmt(vol)} mL = ${fmtWork(raw)} mg.`,
        ],
      });
    },
  },
  {
    id: "sol-final-concentration", topic: T.sol,
    make(rng) {
      const c1 = rng.pick([10, 20, 25, 50, 70, 95]);
      const v1 = rng.pick([10, 20, 25, 30, 40, 50, 75, 100]);
      const v2 = v1 + rng.pick([25, 50, 75, 100, 150, 200, 250, 400]);
      const raw = (c1 * v1) / v2;
      return q({
        prompt: `${v1} mL of a ${c1}% solution is diluted to a final volume of ${v2} mL. What is the new percent strength?`,
        raw, places: 1, unit: "%",
        steps: [
          "Use C₁V₁ = C₂V₂ and solve for C₂.",
          `C₂ = (${c1} × ${v1}) ÷ ${v2} = ${fmt(c1 * v1)} ÷ ${v2} = ${fmtWork(raw)}%.`,
        ],
      });
    },
  },
  {
    id: "sol-final-volume", topic: T.sol,
    make(rng) {
      const c1 = rng.pick([20, 25, 50, 70, 95]);
      const v1 = rng.pick([20, 25, 30, 40, 50, 100]);
      const c2 = rng.pick([1, 2, 5, 10, 12.5, 15].filter((x) => x < c1));
      const raw = (c1 * v1) / c2;
      return q({
        prompt: `You have ${v1} mL of a ${c1}% solution. How many mL of a ${fmt(c2)}% solution can you make from it?`,
        raw, places: 1, unit: "mL",
        steps: [
          "Use C₁V₁ = C₂V₂ and solve for V₂.",
          `V₂ = (${c1} × ${v1}) ÷ ${fmt(c2)} = ${fmt(c1 * v1)} ÷ ${fmt(c2)} = ${fmtWork(raw)} mL.`,
        ],
      });
    },
  },

  // ---------------- Interpreting medical information ----------------
  {
    id: "info-mean", topic: T.info,
    make(rng) {
      const ds = rng.pick(DATASETS);
      const vals = dataValues(rng, ds, rng.int(5, 8));
      const sum = vals.reduce((a, b) => a + b, 0);
      const raw = sum / vals.length;
      return q({
        prompt: `A patient's ${ds.name} (${ds.unit}) were: ${list(vals)}. What is the mean?`,
        raw, places: 1, unit: ds.unit,
        steps: [
          "Mean = sum of the values ÷ number of values.",
          `Sum: ${vals.map((v) => fmt(v)).join(" + ")} = ${fmtWork(sum)}.`,
          `${fmtWork(sum)} ÷ ${vals.length} = ${fmtWork(raw)}.`,
        ],
      });
    },
  },
  {
    id: "info-median", topic: T.info,
    make(rng) {
      const ds = rng.pick(DATASETS);
      const vals = dataValues(rng, ds, rng.int(5, 8));
      const sorted = [...vals].sort((a, b) => a - b);
      const n = sorted.length;
      const mid = Math.floor(n / 2);
      const raw = n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const how = n % 2
        ? `There are ${n} values (odd), so the median is the middle one, value #${mid + 1}: ${fmt(raw)}.`
        : `There are ${n} values (even), so average the two middle values: (${fmt(sorted[mid - 1])} + ${fmt(sorted[mid])}) ÷ 2 = ${fmt(raw)}.`;
      return q({
        prompt: `A patient's ${ds.name} (${ds.unit}) were: ${list(vals)}. What is the median?`,
        raw, exact: true, unit: ds.unit,
        steps: [`Put the values in order: ${list(sorted)}.`, how],
      });
    },
  },
  {
    id: "info-mode", topic: T.info,
    make(rng) {
      const ds = rng.pick(DATASETS);
      const base = dataValues(rng, ds, rng.int(5, 7), true);
      const repeat = rng.pick(base);
      const vals = rng.shuffle([...base, repeat]);
      return q({
        prompt: `A patient's ${ds.name} (${ds.unit}) were: ${list(vals)}. What is the mode?`,
        raw: repeat, exact: true, unit: ds.unit,
        steps: ["The mode is the value that appears most often.", `${fmt(repeat)} appears twice, and every other value appears once.`],
      });
    },
  },
  {
    id: "info-range", topic: T.info,
    make(rng) {
      const ds = rng.pick(DATASETS);
      const vals = dataValues(rng, ds, rng.int(5, 8));
      const hi = Math.max(...vals), lo = Math.min(...vals);
      return q({
        prompt: `A patient's ${ds.name} (${ds.unit}) were: ${list(vals)}. What is the range?`,
        raw: hi - lo, exact: true, unit: ds.unit,
        steps: ["Range = highest value − lowest value.", `${fmt(hi)} − ${fmt(lo)} = ${fmt(clean(hi - lo))}.`],
      });
    },
  },
  {
    id: "info-std-dev", topic: T.info,
    make(rng) {
      const ds = rng.pick(DATASETS.filter((d) => !d.dec));
      const vals = dataValues(rng, ds, rng.int(4, 6));
      const n = vals.length;
      const mean = vals.reduce((a, b) => a + b, 0) / n;
      const sq = vals.map((v) => (v - mean) ** 2);
      const ss = sq.reduce((a, b) => a + b, 0);
      const raw = Math.sqrt(ss / (n - 1));
      return q({
        prompt: `Find the sample standard deviation of these ${ds.name} (${ds.unit}): ${list(vals)}.`,
        raw, places: 1, unit: ds.unit,
        steps: [
          "Sample standard deviation: s = √( Σ(x − mean)² ÷ (n − 1) ).",
          `Mean = ${fmtWork(vals.reduce((a, b) => a + b, 0))} ÷ ${n} = ${fmtWork(mean)}.`,
          `Squared differences from the mean: ${sq.map(fmtWork).join(", ")}.`,
          `Add them: ${fmtWork(ss)}. Divide by n − 1 = ${n - 1}: ${fmtWork(ss / (n - 1))}.`,
          `Take the square root: √${fmtWork(ss / (n - 1))} = ${fmtWork(raw)}.`,
        ],
      });
    },
  },
  {
    id: "info-table", topic: T.info,
    make(rng) {
      const rooms = ["Room 101", "Room 102", "Room 103"];
      const shifts = ["7 AM–3 PM", "3 PM–11 PM", "11 PM–7 AM"];
      const rows = rooms.map((r) => [r, ...shifts.map(() => rng.int(10, 90) * 10)]);
      const table = { caption: "Fluid intake (mL) by shift", headers: ["Room", ...shifts], rows };
      const kind = rng.int(0, 2);
      const i = rng.int(0, 2);
      const total = (r) => r.slice(1).reduce((a, b) => a + b, 0);
      if (kind === 0) {
        return q({
          prompt: `Using the table, what was the total fluid intake for ${rooms[i]} over all three shifts?`,
          raw: total(rows[i]), exact: true, unit: "mL", table,
          steps: [`Add ${rooms[i]}'s three shifts: ${rows[i].slice(1).join(" + ")} = ${fmt(total(rows[i]))} mL.`],
        });
      }
      if (kind === 1) {
        const raw = total(rows[i]) / 3;
        return q({
          prompt: `Using the table, what was the average intake per shift for ${rooms[i]}?`,
          raw, places: 1, unit: "mL", table,
          steps: [
            `Total for ${rooms[i]}: ${rows[i].slice(1).join(" + ")} = ${fmt(total(rows[i]))} mL.`,
            `Divide by 3 shifts: ${fmt(total(rows[i]))} ÷ 3 = ${fmtWork(raw)} mL.`,
          ],
        });
      }
      const s = rng.int(1, 3);
      const col = rows.map((r) => r[s]);
      const hi = Math.max(...col), lo = Math.min(...col);
      return q({
        prompt: `Using the table, during the ${shifts[s - 1]} shift, how many more mL did the room with the highest intake take in than the room with the lowest?`,
        raw: hi - lo, exact: true, unit: "mL", table,
        steps: [`Read the ${shifts[s - 1]} column: ${col.join(", ")}.`, `Highest − lowest: ${hi} − ${lo} = ${hi - lo} mL.`],
      });
    },
  },
  {
    id: "info-chart", topic: T.info,
    make(rng) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const vals = rng.shuffle(Array.from({ length: 49 }, (_, i) => i + 12)).slice(0, 5); // distinct values
      const chart = { title: "Clinic visits per day", labels: days, values: vals, unit: "visits" };
      if (rng.chance(0.5)) {
        const sum = vals.reduce((a, b) => a + b, 0);
        const raw = sum / 5;
        return q({
          prompt: "Using the bar graph, what was the average number of clinic visits per day?",
          raw, places: 1, unit: "visits", chart,
          steps: [`Read each bar: ${vals.join(", ")}.`, `Add them: ${sum}. Divide by 5 days: ${sum} ÷ 5 = ${fmtWork(raw)}.`],
        });
      }
      const [a, b] = rng.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort((x, y) => x - y);
      const raw = Math.abs(vals[b] - vals[a]);
      return q({
        prompt: `Using the bar graph, what is the difference in clinic visits between ${days[a]} and ${days[b]}?`,
        raw, exact: true, unit: "visits", chart,
        steps: [`${days[a]} had ${vals[a]} and ${days[b]} had ${vals[b]}.`, `The difference is ${Math.max(vals[a], vals[b])} − ${Math.min(vals[a], vals[b])} = ${raw}.`],
      });
    },
  },
];
