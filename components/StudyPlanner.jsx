"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { storageKeys, loadJSON, saveJSON, removeKey } from "@/lib/storage";

const REVIEW_SHARE = 0.1; // final 10% of hours saved for review and timed practice
const LEVELS = {
  new: { label: "Haven't started", mult: 1.3 },
  some: { label: "Know some", mult: 1 },
  strong: { label: "Confident", mult: 0.6 },
};
const DAY = 86400000;

function fmt(h) {
  if (h < 1) return `${Math.max(5, Math.round((h * 60) / 5) * 5)} min`;
  return `${Math.round(h * 2) / 2} hr`;
}
function fmtDate(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildPlan({ date, perWeek, order, levels }, topics) {
  if (!date || !(perWeek > 0)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date + "T00:00:00");
  const days = Math.round((target - today) / DAY);
  if (days <= 0) return { error: "Pick a date in the future." };

  const total = (days / 7) * perWeek;
  const review = total * REVIEW_SHARE;
  const study = total - review;

  const adj = topics.map((t) => t.weight * LEVELS[levels[t.slug] || "some"].mult);
  const adjSum = adj.reduce((a, b) => a + b, 0);
  const areas = topics.map((t, i) => ({ ...t, hours: (study * adj[i]) / adjSum }));
  const ordered = order === "value" ? [...areas].sort((a, b) => b.hours - a.hours) : areas;

  // Break areas into blocks (one per subtopic), then the review block.
  const blocks = [];
  for (const a of ordered) {
    if (a.subtopics.length) {
      for (const s of a.subtopics) blocks.push({ area: a.name, sub: s, hours: a.hours / a.subtopics.length });
    } else {
      blocks.push({ area: a.name, sub: null, hours: a.hours });
    }
  }
  blocks.push({ area: "Full review and timed practice", sub: null, hours: review, review: true });

  // Weekly capacity: full weeks, then a partial final week.
  const nWeeks = Math.ceil(days / 7);
  const caps = Array.from({ length: nWeeks }, (_, i) =>
    i < nWeeks - 1 ? perWeek : ((days - 7 * (nWeeks - 1)) / 7) * perWeek
  );
  const weeks = caps.map((cap, i) => {
    const start = new Date(today.getTime() + i * 7 * DAY);
    const endRaw = new Date(start.getTime() + 6 * DAY);
    const lastDay = new Date(target.getTime() - DAY);
    const end = endRaw < lastDay ? endRaw : lastDay;
    return { cap, used: 0, items: [], start, end };
  });

  let w = 0;
  for (const b of blocks) {
    let left = b.hours;
    let first = true;
    while (left > 0.001) {
      if (w >= weeks.length) w = weeks.length - 1;
      const wk = weeks[w];
      let room = wk.cap - wk.used;
      if (room < 0.05 && w < weeks.length - 1) { w++; continue; }
      if (w === weeks.length - 1) room = Infinity;
      let take = Math.min(left, room);
      if (left - take < 0.05) take = left;
      wk.items.push({ ...b, hours: take, cont: !first });
      wk.used += take;
      left -= take;
      first = false;
      if (wk.cap - wk.used < 0.05 && w < weeks.length - 1) w++;
    }
  }
  return { days, total, review, areas, weeks: weeks.filter((x) => x.items.length) };
}

export default function StudyPlanner({ eventSlug, topics, studyHref }) {
  const [state, setState] = useState({ date: "", perWeek: 3, order: "value", levels: {} });
  const [loaded, setLoaded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const key = storageKeys.plan(eventSlug);

  useEffect(() => {
    setState((s) => ({ ...s, ...loadJSON(key, {}) }));
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (loaded) saveJSON(key, state);
  }, [state, loaded, key]);

  const plan = useMemo(() => buildPlan(state, topics), [state, topics]);
  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  const setLevel = (slug, v) => setState((s) => ({ ...s, levels: { ...s.levels, [slug]: v } }));

  const clear = () => {
    removeKey(key);
    setState({ date: "", perWeek: 3, order: "value", levels: {} });
  };

  const visibleWeeks = plan?.weeks ? (showAll ? plan.weeks : plan.weeks.slice(0, 4)) : [];

  return (
    <div className="planner">
      <div className="planner-inputs">
        <div>
          <label htmlFor="comp-date">Competition date</label>
          <input id="comp-date" type="date" value={state.date} onChange={(e) => set({ date: e.target.value })} />
        </div>
        <div>
          <label htmlFor="per-week">Hours you can study per week</label>
          <input
            id="per-week" type="number" min="0.5" step="0.5" value={state.perWeek}
            onChange={(e) => set({ perWeek: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label htmlFor="order">Study order</label>
          <select id="order" value={state.order} onChange={(e) => set({ order: e.target.value })}>
            <option value="value">Biggest topics first</option>
            <option value="test">Test plan order</option>
          </select>
        </div>
      </div>

      {!plan && <p className="fineprint">Enter your competition date to build your plan.</p>}
      {plan?.error && <p className="warn">{plan.error}</p>}

      {plan && !plan.error && (
        <>
          <p className="total">
            You have <strong>{plan.days} days</strong> and about <strong>{fmt(plan.total)}</strong> of study time.
          </p>
          {plan.total < 5 && <p className="warn">That&rsquo;s tight. Focus on the biggest topics first.</p>}

          <h3 className="planner-h">Your time by topic</h3>
          <p className="fineprint" style={{ marginTop: 0 }}>
            Tell the planner how well you know each topic. Topics you haven&rsquo;t started get more time, and
            ones you&rsquo;re confident in get less.
          </p>
          <div className="table-scroll">
            <table className="plan-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th className="num">Test share</th>
                  <th>How well you know it</th>
                  <th className="num">Study time</th>
                </tr>
              </thead>
              <tbody>
                {plan.areas.map((a) => (
                  <tr key={a.slug}>
                    <td>{a.name}</td>
                    <td className="num">{a.weight}%</td>
                    <td>
                      <select
                        aria-label={`How well you know ${a.name}`}
                        value={state.levels[a.slug] || "some"}
                        onChange={(e) => setLevel(a.slug, e.target.value)}
                      >
                        {Object.entries(LEVELS).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="num">{fmt(a.hours)}</td>
                  </tr>
                ))}
                <tr className="area">
                  <td>Full review and timed practice</td>
                  <td className="num">&ndash;</td>
                  <td></td>
                  <td className="num">{fmt(plan.review)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="planner-h">Week by week</h3>
          <ol className="weeks">
            {visibleWeeks.map((wk, i) => (
              <li className="week" key={i}>
                <div className="week-head">
                  <strong>Week {i + 1}</strong>
                  <span>{fmtDate(wk.start)} to {fmtDate(wk.end)}</span>
                </div>
                <ul>
                  {wk.items.map((it, j) => (
                    <li key={j} className={it.review ? "is-review" : ""}>
                      <span>
                        {it.area}
                        {it.sub && <span className="sub">: {it.sub}</span>}
                        {it.cont && <span className="sub"> (continued)</span>}
                      </span>
                      <span className="num">{fmt(it.hours)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          {plan.weeks.length > 4 && (
            <button className="link-btn" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Show fewer weeks" : `Show all ${plan.weeks.length} weeks`}
            </button>
          )}

          <div className="planner-actions">
            <Link className="btn btn-small" href={studyHref}>Start studying</Link>
            <button className="btn-plain" onClick={() => window.print()}>Print or save as PDF</button>
            <button className="btn-plain" onClick={clear}>Clear my plan</button>
          </div>

          <p className="fineprint">
            Topic shares come from HOSA&rsquo;s official test plan. The rest is our suggestion: time is split
            evenly within each topic, adjusted by how well you know it, and the last tenth of your hours is saved
            for review and timed practice. Your plan is saved only in this browser on this device.
          </p>
        </>
      )}
    </div>
  );
}
