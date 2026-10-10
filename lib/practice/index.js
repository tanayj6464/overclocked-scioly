import { makeRng, newSeed, fmt } from "./core.js";
import { generators as medicalMath } from "./medicalMath.js";

const SETS = { "medical-math": medicalMath };

// "33.3%" and "98.6°F" take no space; other units do.
export function withUnit(value, unit) {
  if (!unit) return value;
  return /^[%°]/.test(unit) ? `${value}${unit}` : `${value} ${unit}`;
}

export function hasPractice(eventSlug, topicSlug) {
  const gens = SETS[eventSlug] || [];
  return topicSlug ? gens.some((g) => g.topic === topicSlug) : gens.length > 0;
}

export function generatorsFor(eventSlug, topicSlug) {
  const gens = SETS[eventSlug] || [];
  return topicSlug ? gens.filter((g) => g.topic === topicSlug) : gens;
}

// Rebuild the exact same question from its key ("generatorId:seed").
export function buildQuestion(eventSlug, genId, seed) {
  const gen = (SETS[eventSlug] || []).find((g) => g.id === genId);
  if (!gen) return null;
  const made = gen.make(makeRng(seed));
  const answerType = made.answerType || "number";
  return {
    ...made,
    answerType,
    key: `${genId}:${seed}`,
    genId,
    seed,
    topic: gen.topic,
    display: made.display ?? withUnit(fmt(made.answer), made.unit),
  };
}

export function questionFromKey(eventSlug, key) {
  const [genId, seed] = key.split(":");
  return buildQuestion(eventSlug, genId, Number(seed));
}

// A set of questions for one topic, cycling through question types so it isn't repetitive.
export function makeTopicSet(eventSlug, topicSlug, count) {
  const gens = generatorsFor(eventSlug, topicSlug);
  const out = [];
  let pool = [];
  while (out.length < count) {
    if (!pool.length) pool = [...gens].sort(() => Math.random() - 0.5);
    const g = pool.pop();
    out.push(buildQuestion(eventSlug, g.id, newSeed()));
  }
  return out;
}

// Split a test's question count across topics by official weight (largest remainder).
export function blueprint(topics, total) {
  const exact = topics.map((t) => ({ slug: t.slug, name: t.name, weight: t.weight, x: (t.weight / 100) * total }));
  exact.forEach((e) => (e.n = Math.floor(e.x)));
  let left = total - exact.reduce((s, e) => s + e.n, 0);
  [...exact]
    .sort((a, b) => b.x - Math.floor(b.x) - (a.x - Math.floor(a.x)) || b.weight - a.weight)
    .forEach((e) => { if (left > 0) { e.n++; left--; } });
  return exact.map(({ slug, name, n }) => ({ slug, name, n }));
}

export function makePracticeTest(eventSlug, topics, total) {
  const plan = blueprint(topics, total);
  const qs = plan.flatMap((p) => makeTopicSet(eventSlug, p.slug, p.n));
  return { plan, questions: qs.sort(() => Math.random() - 0.5) };
}
