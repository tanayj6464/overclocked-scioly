// Flashcard decks. Facts come from official HOSA material or standard health math; wording is ours.
// Card ids are permanent: saved progress is keyed by them, so never reuse or renumber.

const METRIC_STEP = "Metric units for weight step by 1,000 each time: kg → g → mg → mcg. Going to a smaller unit, multiply by 1,000 (move the decimal 3 places right). Going to a larger unit, divide.";
const HH = "This is an approximate equivalent from HOSA's reference sheet, so use exactly this number on the test.";

const conversionCards = [
  { id: "len-m-cm", group: "Metric length", front: "1 meter = ? centimeters", back: "100 cm", explain: "Centi- means one hundredth, so there are 100 centimeters in a meter." },
  { id: "len-m-mm", group: "Metric length", front: "1 meter = ? millimeters", back: "1,000 mm", explain: "Milli- means one thousandth, so there are 1,000 millimeters in a meter." },
  { id: "len-cm-mm", group: "Metric length", front: "1 centimeter = ? millimeters", back: "10 mm", explain: "100 cm and 1,000 mm both equal 1 meter, so each centimeter holds 1,000 ÷ 100 = 10 mm." },
  { id: "wt-kg-g", group: "Metric weight", front: "1 kilogram = ? grams", back: "1,000 g", explain: `Kilo- means one thousand. ${METRIC_STEP}` },
  { id: "wt-g-mg", group: "Metric weight", front: "1 gram = ? milligrams", back: "1,000 mg", explain: METRIC_STEP },
  { id: "wt-mg-mcg", group: "Metric weight", front: "1 milligram = ? micrograms", back: "1,000 mcg", explain: `${METRIC_STEP} Example: 0.25 mg × 1,000 = 250 mcg.` },
  { id: "wt-kg-lb", group: "Weight conversion", front: "1 kilogram = ? pounds", back: "2.2 lb", explain: "This one shows up in almost every weight-based dose. A kilogram is heavier than a pound, so the number of pounds is always bigger." },
  { id: "wt-lb-oz", group: "Weight conversion", front: "1 pound = ? ounces", back: "16 oz", explain: "Used for infant weights. Example: 7 lb 8 oz = 7.5 lb, because 8 ÷ 16 = 0.5." },
  { id: "wt-lb-to-kg", group: "Weight conversion", front: "To change pounds into kilograms, you…", back: "Divide by 2.2", explain: "The kg number is always smaller than the lb number, so divide. Example: 154 lb ÷ 2.2 = 70 kg. Don't round here if more steps follow." },
  { id: "wt-kg-to-lb", group: "Weight conversion", front: "To change kilograms into pounds, you…", back: "Multiply by 2.2", explain: "The lb number is always bigger than the kg number, so multiply. Example: 30 kg × 2.2 = 66 lb." },
  { id: "vol-l-ml", group: "Fluid volume", front: "1 liter = ? milliliters", back: "1,000 mL", explain: "Milli- means one thousandth. An IV bag labeled 1 L holds 1,000 mL." },
  { id: "vol-l-dl", group: "Fluid volume", front: "1 liter = ? deciliters", back: "10 dL", explain: "Deci- means one tenth. Lab values are often given per dL, like glucose in mg/dL." },
  { id: "vol-dl-cl", group: "Fluid volume", front: "1 deciliter = ? centiliters", back: "10 cL", explain: "A liter is 10 dL or 100 cL, so each deciliter holds 100 ÷ 10 = 10 cL." },
  { id: "vol-cc-ml", group: "Fluid volume", front: "1 cubic centimeter (cc or cm³) = ? milliliters", back: "1 mL. A cc and a mL are the same amount.", explain: "Syringes are often marked in cc, while orders are written in mL. Treat them as identical: 5 cc = 5 mL." },
  { id: "sol-m3-dm3", group: "Solid volume", front: "1 cubic meter (m³) = ? cubic decimeters", back: "1,000 dm³", explain: "A meter is 10 decimeters, and cubing it gives 10 × 10 × 10 = 1,000." },
  { id: "sol-dm3-cm3", group: "Solid volume", front: "1 cubic decimeter (dm³) = ? cubic centimeters", back: "1,000 cm³", explain: "A decimeter is 10 cm, so 10 × 10 × 10 = 1,000 cm³. That's also 1 liter." },
  { id: "sol-cm3-mm3", group: "Solid volume", front: "1 cubic centimeter (cm³) = ? cubic millimeters", back: "1,000 mm³", explain: "A centimeter is 10 mm, so 10 × 10 × 10 = 1,000 mm³." },
  { id: "unit-u", group: "Units", front: "What is a unit (U)?", back: "A measure used for certain drugs, such as insulin.", explain: "Units measure a drug's effect, not its weight, so you can't convert units to mg. Heparin and insulin are both measured in units." },
  { id: "hh-cup-ml", group: "Household to metric", front: "1 cup = ? milliliters", back: "240 mL", explain: `${HH} It follows from 1 cup = 8 oz and 1 oz = 30 mL: 8 × 30 = 240.` },
  { id: "hh-cup-oz", group: "Household to metric", front: "1 cup = ? ounces", back: "8 oz", explain: "Useful for intake and output: 2 cups of juice = 16 oz = 480 mL." },
  { id: "hh-cup-tbsp", group: "Household to metric", front: "1 cup = ? tablespoons", back: "16 tbsp", explain: "1 cup = 8 oz, and each ounce is 2 tbsp, so 8 × 2 = 16." },
  { id: "hh-oz-ml", group: "Household to metric", front: "1 ounce = ? milliliters", back: "30 mL", explain: `${HH} Example: 6 oz of water = 6 × 30 = 180 mL.` },
  { id: "hh-oz-tbsp", group: "Household to metric", front: "1 ounce = ? tablespoons", back: "2 tbsp", explain: "1 oz = 30 mL and 1 tbsp = 15 mL, so 30 ÷ 15 = 2." },
  { id: "hh-oz-tsp", group: "Household to metric", front: "1 ounce = ? teaspoons", back: "6 tsp", explain: "1 oz = 2 tbsp, and each tbsp is 3 tsp, so 2 × 3 = 6." },
  { id: "hh-tbsp-ml", group: "Household to metric", front: "1 tablespoon = ? milliliters", back: "15 mL", explain: `${HH} The capital T in "Tbsp" is a reminder that it's the bigger spoon.` },
  { id: "hh-tbsp-tsp", group: "Household to metric", front: "1 tablespoon = ? teaspoons", back: "3 tsp", explain: "15 mL ÷ 5 mL = 3." },
  { id: "hh-tsp-ml", group: "Household to metric", front: "1 teaspoon = ? milliliters", back: "5 mL", explain: `${HH} Liquid medicine for kids is often dosed in teaspoons: 2 tsp = 10 mL.` },
  { id: "hh-ml-gtt", group: "Household to metric", front: "1 milliliter = ? drops (gtts)", back: "15 gtts", explain: "From the reference sheet. On IV questions, use the tubing's own drop factor instead if the question gives one." },
  { id: "hh-gtt-ml", group: "Household to metric", front: "1 drop (gtt) = ? milliliters", back: "0.0667 mL", explain: "It's the same fact flipped: 1 ÷ 15 = 0.0667. gtt is the abbreviation for one drop, and gtts for drops." },
  { id: "lx-m-in", group: "Length conversion", front: "1 meter = ? inches", back: "39.4 in", explain: "A meter is a little longer than a yard (36 in)." },
  { id: "lx-in-cm", group: "Length conversion", front: "1 inch = ? centimeters", back: "2.54 cm", explain: "Multiply inches by 2.54 to get cm, and divide cm by 2.54 to get inches. You'll need this for height in BSA problems." },
  { id: "lx-ft-in", group: "Length conversion", front: "1 foot = ? inches", back: "12 in", explain: "For heights like 5 ft 6 in, change everything to inches first: 5 × 12 + 6 = 66 in." },
  { id: "temp-f-c", group: "Temperature", front: "Formula: Fahrenheit to Celsius", back: "°C = (°F − 32) × 5/9", explain: "Subtract 32 first, then multiply by 5/9. Example: 98.6°F − 32 = 66.6, × 5/9 = 37°C." },
  { id: "temp-c-f", group: "Temperature", front: "Formula: Celsius to Fahrenheit", back: "°F = (°C × 9/5) + 32", explain: "Multiply by 9/5 (or 1.8) first, then add 32. It's the reverse of the other formula. Example: 37°C × 1.8 = 66.6, + 32 = 98.6°F." },
  { id: "bsa-metric", group: "Formulas", front: "Body surface area (BSA) using centimeters and kilograms", back: "BSA (m²) = √(height in cm × weight in kg ÷ 3,600)", explain: "Multiply height by weight, divide by 3,600, then take the square root. Use 3,600 only with cm and kg." },
  { id: "bsa-english", group: "Formulas", front: "Body surface area (BSA) using inches and pounds", back: "BSA (m²) = √(height in inches × weight in lb ÷ 3,131)", explain: "Same steps as the metric formula, but divide by 3,131. Pick the formula that matches the units in the question." },
  { id: "sd-sample", group: "Formulas", front: "Standard deviation for sample data", back: "s = √( Σ(x − x̄)² ÷ (n − 1) )", explain: "Find the mean. Subtract it from each value and square the result. Add those up, divide by n − 1, then take the square root." },
];

export const decks = [
  {
    eventSlug: "medical-math",
    slug: "conversion-sheet",
    title: "Conversion sheet",
    topicSlug: "measurement-and-conversion-problems",
    description: "Every fact on HOSA's Medical Math reference sheet. You can't use the sheet during the test, so these need to be memorized.",
    source: "HOSA 2026–2027 Medical Math guidelines, Reference Materials Summary",
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/09/MM-26-27-Sept-06.pdf",
    cards: conversionCards,
  },
  {
    eventSlug: "medical-math",
    slug: "math-essentials",
    title: "Math essentials",
    topicSlug: "mathematical-essentials",
    description: "Roman numerals, 24-hour time, percents, proportions, and HOSA's rounding rules.",
    source: "HOSA 2026–2027 Medical Math guidelines and standard math rules",
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/09/MM-26-27-Sept-06.pdf",
    cards: [
      { id: "rn-values", group: "Roman numerals", front: "Values of I, V, X, L, C, D, M", back: "I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1,000", explain: "Memorize these seven symbols, and every other Roman numeral is built from them." },
      { id: "rn-subtract", group: "Roman numerals", front: "When do you subtract in a Roman numeral?", back: "When a smaller numeral comes right before a larger one", explain: "IV = 5 − 1 = 4 and XC = 100 − 10 = 90. Only I, X, and C are placed in front to subtract: IV, IX, XL, XC, CD, CM." },
      { id: "rn-repeat", group: "Roman numerals", front: "How many times in a row can I, X, C, or M repeat?", back: "Up to 3 times", explain: "That's why 4 is IV, not IIII, and 40 is XL, not XXXX. V, L, and D never repeat." },
      { id: "mt-pm", group: "24-hour time", front: "How do you change a PM time (1 to 11 PM) to 24-hour time?", back: "Add 12 to the hour", explain: "3:45 PM becomes 15 + 45 = 1545. Drop the colon and always write four digits." },
      { id: "mt-am", group: "24-hour time", front: "How do you change an AM time (1 to 11 AM) to 24-hour time?", back: "Keep the hour and add a leading zero", explain: "7:05 AM becomes 0705. Morning hours stay the same number." },
      { id: "mt-midnight", group: "24-hour time", front: "12:00 midnight in 24-hour time", back: "0000", explain: "Midnight starts the new day at hour 00, so 12:30 AM is 0030." },
      { id: "mt-noon", group: "24-hour time", front: "12:00 noon in 24-hour time", back: "1200", explain: "Noon stays 12, so 12:30 PM is 1230. Don't add 12 to the 12 PM hour." },
      { id: "pct-to-dec", group: "Percents", front: "How do you change a percent to a decimal?", back: "Divide by 100 (move the decimal 2 places left)", explain: "35% = 0.35 and 2.5% = 0.025. To find a percent of a number, change it to a decimal and multiply." },
      { id: "frac-to-pct", group: "Percents", front: "How do you change a fraction to a percent?", back: "Divide the top by the bottom, then multiply by 100", explain: "3/8 = 3 ÷ 8 = 0.375, × 100 = 37.5%." },
      { id: "proportion", group: "Proportions", front: "How do you solve a proportion like a : b = c : x?", back: "Cross-multiply: the product of the means equals the product of the extremes", explain: "In a : b = c : x, b and c are the means and a and x are the extremes. So b × c = a × x, and x = (b × c) ÷ a." },
      { id: "round-final", group: "Rounding rules", front: "When should you round in a multi-step problem?", back: "Only at the very end", explain: "HOSA's rule: round only the final answer. Rounding a middle step, like a weight in kg, can make your final answer come out wrong." },
      { id: "round-how", group: "Rounding rules", front: "How do you round to a place value?", back: "Look one digit to the right: 5 or more rounds up, 4 or less stays the same", explain: "To the nearest tenth: 4.65 becomes 4.7 and 4.64 becomes 4.6." },
      { id: "round-default", group: "Rounding rules", front: "If a question doesn't say how to round, what do you do?", back: "Round to the nearest whole number", explain: "That's HOSA's default rule for Medical Math and Pharmacology." },
      { id: "round-peds", group: "Rounding rules", front: "How are pediatric doses rounded?", back: "Always down", explain: "Rounding down avoids giving a child too much. 13.8 mg becomes 13 mg, not 14." },
      { id: "zero-lead", group: "Writing numbers", front: "How do you write a decimal less than 1?", back: "With a zero in front: 0.5, not .5", explain: "A lone decimal point can be missed, turning .5 mg into 5 mg, a tenfold error. HOSA requires the leading zero." },
      { id: "zero-trail", group: "Writing numbers", front: "Should you write 5 or 5.0?", back: "5. Never add a trailing zero.", explain: "If the decimal point is missed, 5.0 can be read as 50. HOSA's rules say never to use a trailing zero." },
    ],
  },
  {
    eventSlug: "medical-math",
    slug: "dosage-and-iv",
    title: "Dosage and IV formulas",
    topicSlug: "drug-dosages-and-intravenous-solutions",
    description: "The formulas behind every dosage and IV question, the biggest part of the test (35%).",
    source: "Standard dosage calculation methods, with HOSA's rounding rules",
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/09/MM-26-27-Sept-06.pdf",
    cards: [
      { id: "dhq", group: "Dosage", front: "The basic dosage formula", back: "Desired ÷ Have × Quantity (D/H × Q)", explain: "D is the dose ordered, H is the strength on hand, and Q is the amount that holds H (1 tablet, or 5 mL, for example). Order 500 mg, have 250 mg per tablet: 500 ÷ 250 × 1 = 2 tablets." },
      { id: "dhq-units", group: "Dosage", front: "What must be true before you use D/H × Q?", back: "D and H must be in the same unit", explain: "If the order is in g and the tablets are in mg, convert first. 0.5 g = 500 mg." },
      { id: "liquid", group: "Dosage", front: "Order 300 mg. You have 125 mg per 5 mL. How do you set it up?", back: "300 ÷ 125 × 5 mL = 12 mL", explain: "Q is the volume that holds the 'have' amount, here 5 mL. Divide first, then multiply by Q." },
      { id: "weight-based", group: "Weight-based dosing", front: "Steps for a mg/kg dose when weight is in pounds", back: "1) lb ÷ 2.2 = kg  2) kg × mg/kg = dose", explain: "Keep the unrounded kg value and round only the final dose." },
      { id: "per-day", group: "Weight-based dosing", front: "What does 'mg/kg/day divided every 8 hours' mean?", back: "Find the total daily dose, then divide by 3", explain: "Every 8 hours = 3 doses a day (24 ÷ 8). Every 6 hours = 4 doses, every 12 hours = 2." },
      { id: "peds-down", group: "Weight-based dosing", front: "Rounding a pediatric dose", back: "Always round down", explain: "HOSA's rule protects children from overdose: 145.9 mg becomes 145 mg." },
      { id: "bsa-dose", group: "Weight-based dosing", front: "How do you find a dose ordered in mg/m²?", back: "Dose = mg/m² × BSA (m²)", explain: "If you're given height and weight instead of BSA, calculate BSA first with the formula from the conversion sheet." },
      { id: "ml-hr", group: "IV", front: "IV rate in mL/hr", back: "mL/hr = total volume (mL) ÷ total time (hours)", explain: "1,000 mL over 8 hours = 125 mL/hr. IV pumps are set in mL/hr." },
      { id: "gtt-min", group: "IV", front: "IV flow rate in drops per minute", back: "gtt/min = (volume in mL × drop factor) ÷ time in minutes", explain: "Time must be in minutes, so multiply hours by 60. 500 mL over 4 hr with 15 gtt/mL: (500 × 15) ÷ 240 = 31.25, which rounds to 31 gtt/min." },
      { id: "drop-factor", group: "IV", front: "What is a drop factor?", back: "The number of drops that make 1 mL, set by the IV tubing", explain: "It's printed on the tubing package and given in the question, such as 10, 15, or 20 gtt/mL. Microdrip tubing is 60 gtt/mL." },
      { id: "microdrip", group: "IV", front: "Shortcut for 60 gtt/mL (microdrip) tubing", back: "gtt/min = mL/hr", explain: "Because 60 drops per mL and 60 minutes per hour cancel out. 50 mL/hr on microdrip tubing = 50 gtt/min." },
      { id: "infusion-time", group: "IV", front: "How long will an IV take to finish?", back: "Time (hours) = volume ÷ rate (mL/hr)", explain: "500 mL at 80 mL/hr = 6.25 hours. Read the rounding instruction, and change to hours and minutes only if asked." },
      { id: "units-hr", group: "IV", front: "Heparin units per hour from an infusion rate", back: "units/hr = (units ÷ mL in bag) × mL/hr", explain: "25,000 units in 500 mL = 50 units/mL. At 20 mL/hr: 50 × 20 = 1,000 units/hr." },
    ],
  },
  {
    eventSlug: "medical-math",
    slug: "solutions",
    title: "Solutions and dilutions",
    topicSlug: "dilutions-solutions-and-concentrations",
    description: "Percent strength, ratio strength, and the dilution formula (25% of the test).",
    source: "Standard pharmacy calculation methods",
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/09/MM-26-27-Sept-06.pdf",
    cards: [
      { id: "c1v1", group: "Dilution", front: "The dilution formula", back: "C₁V₁ = C₂V₂", explain: "C₁ and V₁ are the strong stock solution; C₂ and V₂ are what you want to make. Solve for whichever one is missing." },
      { id: "c1v1-stock", group: "Dilution", front: "How much stock do you need to make a weaker solution?", back: "V₁ = (C₂ × V₂) ÷ C₁", explain: "To make 500 mL of 10% from 50% stock: (10 × 500) ÷ 50 = 100 mL of stock." },
      { id: "diluent", group: "Dilution", front: "How much diluent (water) do you add?", back: "Diluent = final volume − stock volume", explain: "Continuing the example: 500 mL − 100 mL of stock = 400 mL of water." },
      { id: "pct-wv", group: "Percent strength", front: "What does a percent (w/v) solution mean?", back: "Grams of drug per 100 mL", explain: "5% dextrose (D5W) = 5 g of dextrose in every 100 mL. 0.9% sodium chloride = 0.9 g per 100 mL." },
      { id: "pct-vv", group: "Percent strength", front: "What does a percent (v/v) solution mean?", back: "mL of liquid drug per 100 mL", explain: "Used when a liquid is mixed into a liquid. 70% isopropyl alcohol = 70 mL of alcohol in 100 mL." },
      { id: "pct-strength", group: "Percent strength", front: "How do you find percent strength (w/v)?", back: "% = grams ÷ mL × 100", explain: "10 g in 250 mL: 10 ÷ 250 × 100 = 4%." },
      { id: "pct-mgml", group: "Percent strength", front: "Shortcut: percent (w/v) to mg/mL", back: "Multiply the percent by 10", explain: "2% = 2 g/100 mL = 2,000 mg/100 mL = 20 mg/mL." },
      { id: "ratio", group: "Ratio strength", front: "What does a 1:1,000 solution mean?", back: "1 g of drug in 1,000 mL", explain: "1 g = 1,000 mg, so 1:1,000 = 1,000 mg/1,000 mL = 1 mg/mL." },
      { id: "ratio-mgml", group: "Ratio strength", front: "Shortcut: ratio strength 1:x to mg/mL", back: "mg/mL = 1,000 ÷ x", explain: "1:10,000 = 1,000 ÷ 10,000 = 0.1 mg/mL. A bigger second number means a weaker solution." },
    ],
  },
  {
    eventSlug: "medical-math",
    slug: "statistics",
    title: "Statistics and data",
    topicSlug: "interpreting-medical-information",
    description: "Mean, median, mode, range, standard deviation, and reading tables and graphs.",
    source: "Standard statistics definitions",
    sourceUrl: "https://hosa.org/wp-content/uploads/2026/09/MM-26-27-Sept-06.pdf",
    cards: [
      { id: "mean", group: "Statistics", front: "Mean", back: "Sum of the values ÷ number of values", explain: "Heart rates 70, 80, 90: (70 + 80 + 90) ÷ 3 = 80. Also called the average." },
      { id: "median-odd", group: "Statistics", front: "Median (odd number of values)", back: "The middle value once they're in order", explain: "Always sort first. 92, 70, 85 sorted is 70, 85, 92, so the median is 85." },
      { id: "median-even", group: "Statistics", front: "Median (even number of values)", back: "The average of the two middle values", explain: "70, 80, 90, 100: (80 + 90) ÷ 2 = 85." },
      { id: "mode", group: "Statistics", front: "Mode", back: "The value that appears most often", explain: "In 98, 99, 99, 101, the mode is 99. A set can have no mode or more than one." },
      { id: "range", group: "Statistics", front: "Range", back: "Highest value − lowest value", explain: "It shows how spread out the data is. 118 − 92 = 26." },
      { id: "sd", group: "Statistics", front: "Steps for sample standard deviation", back: "Mean → subtract → square → add → ÷ (n − 1) → square root", explain: "Dividing by n − 1 (not n) is what makes it the sample formula, which is the one on HOSA's reference sheet." },
      { id: "read-graph", group: "Tables and graphs", front: "First thing to check on any table or graph", back: "The title, labels, and units", explain: "Know what each axis or column measures (mL? per day? per shift?) before you read any numbers." },
    ],
  },
];

export function getDecks(eventSlug) {
  return decks.filter((d) => d.eventSlug === eventSlug);
}
export function getDeck(eventSlug, deckSlug) {
  return decks.find((d) => d.eventSlug === eventSlug && d.slug === deckSlug);
}
export function decksForTopic(eventSlug, topicSlug) {
  return decks.filter((d) => d.eventSlug === eventSlug && d.topicSlug === topicSlug);
}

// Guard against duplicate ids, which would corrupt saved progress.
for (const d of decks) {
  const ids = new Set();
  for (const c of d.cards) {
    if (ids.has(c.id)) throw new Error(`Duplicate card id ${c.id} in ${d.slug}`);
    if (!c.explain) throw new Error(`Card ${c.id} in ${d.slug} has no explanation`);
    ids.add(c.id);
  }
}
