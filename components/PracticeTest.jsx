"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { makePracticeTest, blueprint } from "@/lib/practice/index";
import { checkAnswer } from "@/lib/practice/core";
import { loadPractice, savePractice, recordAnswer, EMPTY_PRACTICE } from "@/lib/practice/progress";
import { QuestionBody, Explanation } from "@/components/PracticeQuestion";

function clock(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PracticeTest({ eventSlug, topics, total, minutes, calculator }) {
  const [data, setData] = useState(EMPTY_PRACTICE);
  const [phase, setPhase] = useState("intro");
  const [useTimer, setUseTimer] = useState(true);
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(minutes * 60);
  const [startedAt, setStartedAt] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [graded, setGraded] = useState(null);
  const [onlyMissed, setOnlyMissed] = useState(false);
  const submitRef = useRef(null);

  useEffect(() => setData(loadPractice(eventSlug)), [eventSlug]);

  // Countdown
  useEffect(() => {
    if (phase !== "test" || !useTimer) return;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, useTimer]);
  useEffect(() => {
    if (phase === "test" && useTimer && left === 0) submitRef.current?.();
  }, [left, phase, useTimer]);

  // Warn before leaving mid-test
  useEffect(() => {
    if (phase !== "test") return;
    const h = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [phase]);

  const start = () => {
    setTest(makePracticeTest(eventSlug, topics, total));
    setAnswers({});
    setI(0);
    setLeft(minutes * 60);
    setStartedAt(Date.now());
    setConfirming(false);
    setOnlyMissed(false);
    setPhase("test");
    window.scrollTo({ top: 0 });
  };

  const submit = () => {
    const results = test.questions.map((q) => {
      const r = checkAnswer(q, answers[q.key] ?? "");
      return { q, input: answers[q.key] ?? "", correct: !r.empty && r.correct, message: r.message };
    });
    let next = data;
    for (const r of results) next = recordAnswer(next, r.q, r.correct);
    const score = results.filter((r) => r.correct).length;
    next = { ...next, tests: [{ date: new Date().toISOString(), score, total: results.length }, ...next.tests].slice(0, 10) };
    setData(next);
    savePractice(eventSlug, next);
    const byTopic = topics.map((t) => {
      const rs = results.filter((r) => r.q.topic === t.slug);
      return { ...t, right: rs.filter((r) => r.correct).length, n: rs.length };
    });
    setGraded({ results, score, byTopic, seconds: Math.round((Date.now() - startedAt) / 1000) });
    setPhase("results");
    window.scrollTo({ top: 0 });
  };
  submitRef.current = submit;

  // ---------- Intro ----------
  if (phase === "intro") {
    const plan = blueprint(topics, total);
    const last = data.tests[0];
    return (
      <div className="pt-intro">
        <p>
          A full-length practice test: {total} questions in {minutes} minutes, split across topics the same way as
          HOSA&rsquo;s official test plan. Every test is newly generated.
        </p>
        <div className="table-scroll">
          <table className="plan-table">
            <thead><tr><th>Topic</th><th className="num">Questions</th></tr></thead>
            <tbody>
              {plan.map((p) => <tr key={p.slug}><td>{p.name}</td><td className="num">{p.n}</td></tr>)}
            </tbody>
          </table>
        </div>
        <ul className="rules">
          <li>Type each answer the way you would grid it: digits and a decimal point only.</li>
          <li>Follow each question&rsquo;s rounding instruction, and round only your final answer.</li>
          {calculator && <li>{calculator} Practice with a basic calculator, not your phone&rsquo;s.</li>}
          <li>You can skip questions and come back. Answers aren&rsquo;t checked until you submit.</li>
        </ul>
        <label className="fc-toggle">
          <input type="checkbox" checked={useTimer} onChange={(e) => setUseTimer(e.target.checked)} />
          Use the {minutes}-minute timer (the test submits itself when time runs out)
        </label>
        <div className="fc-start-actions">
          <button className="btn" onClick={start}>Start the practice test</button>
        </div>
        {last && (
          <p className="fineprint">
            Your last score: {last.score} of {last.total} on {new Date(last.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.
            Scores are saved only in this browser.
          </p>
        )}
      </div>
    );
  }

  // ---------- Test ----------
  if (phase === "test") {
    const qs = test.questions;
    const q = qs[i];
    const answeredCount = qs.filter((x) => (answers[x.key] ?? "").trim()).length;
    const unanswered = qs.length - answeredCount;
    return (
      <div className="pt-test">
        <div className="pt-bar">
          <span>Question {i + 1} of {qs.length}</span>
          {useTimer && <span className={`pt-clock${left < 300 ? " is-low" : ""}`} aria-live={left < 60 ? "polite" : "off"}>{clock(left)} left</span>}
          <span>{answeredCount} answered</span>
        </div>

        <div className="pq">
          <QuestionBody q={q} />
          <div className="pq-form">
            <label className="sr-only" htmlFor={`t-${q.key}`}>Your answer to question {i + 1}</label>
            <input
              id={`t-${q.key}`}
              key={q.key}
              className="pq-input"
              value={answers[q.key] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter" && i < qs.length - 1) setI(i + 1); }}
              inputMode={q.answerType === "number" ? "decimal" : "text"}
              autoComplete="off"
              spellCheck="false"
              autoFocus
            />
            {q.unit && <span className="pq-unit">{q.unit}</span>}
          </div>
        </div>

        <div className="pt-nav">
          <button className="btn btn-outline btn-small" disabled={i === 0} onClick={() => setI(i - 1)}>Previous</button>
          {i < qs.length - 1 ? (
            <button className="btn btn-small" onClick={() => setI(i + 1)}>Next</button>
          ) : (
            <button className="btn btn-small" onClick={() => setConfirming(true)}>Finish</button>
          )}
        </div>

        <nav className="pt-grid" aria-label="Jump to a question">
          {qs.map((x, n) => (
            <button
              key={x.key}
              className={`${n === i ? "is-current " : ""}${(answers[x.key] ?? "").trim() ? "is-done" : ""}`}
              onClick={() => setI(n)}
              aria-label={`Question ${n + 1}${(answers[x.key] ?? "").trim() ? ", answered" : ""}`}
            >
              {n + 1}
            </button>
          ))}
        </nav>

        <div className="pt-submit">
          {confirming ? (
            <div className="callout">
              <p>{unanswered > 0 ? `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. ` : ""}Submit your test?</p>
              <div className="fc-start-actions">
                <button className="btn btn-small" onClick={submit}>Yes, submit</button>
                <button className="btn-plain" onClick={() => setConfirming(false)}>Keep working</button>
              </div>
            </div>
          ) : (
            <button className="btn-plain" onClick={() => setConfirming(true)}>Submit test</button>
          )}
        </div>
      </div>
    );
  }

  // ---------- Results ----------
  const { results, score, byTopic, seconds } = graded;
  const weakest = [...byTopic].filter((t) => t.n).sort((a, b) => a.right / a.n - b.right / b.n)[0];
  const shown = onlyMissed ? results.filter((r) => !r.correct) : results;
  return (
    <div className="pt-results">
      <div className="fc-results">
        <h3>You scored {score} of {results.length} ({Math.round((score / results.length) * 100)}%)</h3>
        <p className="fineprint" style={{ marginTop: 0 }}>Time used: {clock(Math.min(seconds, minutes * 60))}</p>
      </div>

      <div className="table-scroll">
        <table className="plan-table">
          <thead><tr><th>Topic</th><th className="num">Correct</th><th className="num">Score</th></tr></thead>
          <tbody>
            {byTopic.map((t) => (
              <tr key={t.slug}>
                <td><Link href={`/events/${eventSlug}/study/${t.slug}/practice`}>{t.name}</Link></td>
                <td className="num">{t.right} of {t.n}</td>
                <td className="num">{t.n ? Math.round((t.right / t.n) * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {weakest && weakest.right < weakest.n && (
        <p className="callout">
          Focus next on <strong>{weakest.name}</strong>.{" "}
          <Link href={`/events/${eventSlug}/study/${weakest.slug}/practice`}>Practice that topic</Link>. The questions you
          missed are already on its redo list.
        </p>
      )}

      <div className="pt-review-head">
        <h3 className="planner-h">Review your answers</h3>
        <label className="fc-toggle">
          <input type="checkbox" checked={onlyMissed} onChange={(e) => setOnlyMissed(e.target.checked)} />
          Show only the ones I missed
        </label>
      </div>
      <ol className="pt-review">
        {shown.map((r) => (
          <li key={r.q.key} className={r.correct ? "is-right" : "is-wrong"}>
            <p className="pt-review-num">Question {results.indexOf(r) + 1}: {r.correct ? "Correct" : "Missed"}</p>
            <QuestionBody q={r.q} />
            <p>
              Your answer: <strong>{r.input.trim() || "(blank)"}</strong>
              {!r.correct && <> &nbsp;Correct answer: <strong>{r.q.display}</strong></>}
            </p>
            <Explanation steps={r.q.steps} />
          </li>
        ))}
      </ol>

      <div className="fc-start-actions">
        <button className="btn" onClick={start}>Take a new practice test</button>
        <Link className="btn btn-outline" href={`/events/${eventSlug}/study`}>Back to studying</Link>
      </div>
    </div>
  );
}
