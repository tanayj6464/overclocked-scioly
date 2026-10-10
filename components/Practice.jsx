"use client";

import { useEffect, useState } from "react";
import { makeTopicSet, questionFromKey, generatorsFor } from "@/lib/practice/index";
import { loadPractice, savePractice, recordAnswer, EMPTY_PRACTICE } from "@/lib/practice/progress";
import PracticeQuestion, { Explanation } from "@/components/PracticeQuestion";

const SET_SIZE = 10;

export default function Practice({ eventSlug, topicSlug }) {
  const [data, setData] = useState(EMPTY_PRACTICE);
  const [session, setSession] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => setData(loadPractice(eventSlug)), [eventSlug]);

  const genIds = new Set(generatorsFor(eventSlug, topicSlug).map((g) => g.id));
  const topicMissed = data.missed.filter((k) => genIds.has(k.split(":")[0]));
  const stat = data.stats[topicSlug] || { right: 0, wrong: 0 };
  const total = stat.right + stat.wrong;

  const begin = (qs, label) => {
    if (!qs.length) return;
    setSession({ qs, i: 0, results: [], label });
    setAnswered(false);
  };
  const startNew = () => begin(makeTopicSet(eventSlug, topicSlug, SET_SIZE), "Practice set");
  const startRedo = (keys) => begin(keys.map((k) => questionFromKey(eventSlug, k)).filter(Boolean), "Redo");

  const onResult = (correct) => {
    const q = session.qs[session.i];
    const next = recordAnswer(data, q, correct);
    setData(next);
    savePractice(eventSlug, next);
    setSession((s) => ({ ...s, results: [...s.results, { key: q.key, correct }] }));
    setAnswered(true);
  };

  const advance = () => {
    setSession((s) => ({ ...s, i: s.i + 1 }));
    setAnswered(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!session) {
    return (
      <div className="pr-start">
        <div className="fc-stats">
          <div><strong>{total}</strong><span>answered</span></div>
          <div><strong>{total ? Math.round((stat.right / total) * 100) : 0}%</strong><span>correct</span></div>
          <div><strong>{topicMissed.length}</strong><span>to redo</span></div>
        </div>
        <div className="fc-start-actions">
          <button className="btn" onClick={startNew}>Practice {SET_SIZE} questions</button>
          <button className="btn btn-outline" disabled={!topicMissed.length} onClick={() => startRedo(topicMissed)}>
            Redo missed ({topicMissed.length})
          </button>
        </div>
        <p className="fineprint">
          Every set is new, so you can practice as much as you want. Questions you miss are saved so you can redo
          the exact same ones. A question leaves your redo list once you get it right. Saved only in this browser.
        </p>
      </div>
    );
  }

  const done = session.i >= session.qs.length;
  if (done) {
    const right = session.results.filter((r) => r.correct).length;
    const wrongKeys = session.results.filter((r) => !r.correct).map((r) => r.key);
    const byKey = Object.fromEntries(session.qs.map((q) => [q.key, q]));
    return (
      <div className="fc-results">
        <h3>You got {right} of {session.qs.length}</h3>
        <div className="progress" aria-hidden="true"><div style={{ width: `${(right / session.qs.length) * 100}%` }} /></div>
        {wrongKeys.length > 0 ? (
          <ul className="pr-review">
            {wrongKeys.map((k) => (
              <li key={k}>
                <p>{byKey[k].prompt}</p>
                <p>Answer: <strong>{byKey[k].display}</strong></p>
                <Explanation steps={byKey[k].steps} />
              </li>
            ))}
          </ul>
        ) : (
          <p>You got every question in this set.</p>
        )}
        <div className="fc-start-actions">
          {wrongKeys.length > 0 && (
            <button className="btn" onClick={() => startRedo(wrongKeys)}>Redo the {wrongKeys.length} you missed</button>
          )}
          <button className={wrongKeys.length ? "btn btn-outline" : "btn"} onClick={startNew}>New set of {SET_SIZE}</button>
          <button className="btn-plain" onClick={() => setSession(null)}>Back</button>
        </div>
      </div>
    );
  }

  const q = session.qs[session.i];
  const n = session.qs.length;
  return (
    <div className="pr-session">
      <div className="fc-top">
        <span>{session.label}: question {session.i + 1} of {n}</span>
        <button className="btn-plain" onClick={() => setSession(null)}>End practice</button>
      </div>
      <div className="progress" aria-hidden="true"><div style={{ width: `${(session.i / n) * 100}%` }} /></div>
      <PracticeQuestion key={q.key + session.i} q={q} onResult={onResult} />
      {answered && (
        <div className="pr-next">
          <button className="btn" onClick={advance} autoFocus>
            {session.i + 1 < n ? "Next question" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}
