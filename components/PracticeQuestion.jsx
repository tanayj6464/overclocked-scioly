"use client";

import { useState } from "react";
import { checkAnswer } from "@/lib/practice/core";
import QuestionVisual from "@/components/QuestionVisual";

export function Explanation({ steps, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <div className="pq-explain">
      <button type="button" className="btn-plain" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "Hide explanation" : "Show explanation"}
      </button>
      {open && (
        <ol className="pq-steps">
          {steps.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      )}
    </div>
  );
}

export function QuestionBody({ q }) {
  return (
    <>
      <p className="pq-prompt">{q.prompt}</p>
      <QuestionVisual table={q.table} chart={q.chart} />
      <p className="pq-instr">{q.instruction}</p>
    </>
  );
}

// One practice question: answer, check, see feedback and the explanation.
export default function PracticeQuestion({ q, onResult }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [warning, setWarning] = useState("");
  const locked = !!result;

  const submit = (e) => {
    e.preventDefault();
    if (locked) return;
    const r = checkAnswer(q, input);
    if (r.empty) {
      setWarning(r.message);
      return;
    }
    setWarning("");
    setResult(r);
    onResult?.(r.correct);
  };

  const giveUp = () => {
    if (locked) return;
    const r = { correct: false, message: "Here's the answer.", notes: [], gaveUp: true };
    setResult(r);
    onResult?.(false);
  };

  return (
    <div className="pq">
      <QuestionBody q={q} />
      <form className="pq-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={`a-${q.key}`}>Your answer</label>
        <input
          id={`a-${q.key}`}
          className="pq-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          inputMode={q.answerType === "number" ? "decimal" : "text"}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck="false"
          disabled={locked}
          autoFocus
        />
        {q.unit && <span className="pq-unit">{q.unit}</span>}
        {!locked && <button className="btn btn-small" type="submit">Check answer</button>}
        {!locked && <button className="btn-plain" type="button" onClick={giveUp}>Show answer</button>}
      </form>
      {warning && <p className="warn">{warning}</p>}

      {result && (
        <div className={`pq-feedback ${result.correct ? "is-right" : "is-wrong"}`} role="status">
          <p className="pq-verdict">{result.correct ? "Correct." : result.message}</p>
          {!result.correct && <p>The answer is <strong>{q.display}</strong>.</p>}
          {result.notes.map((n) => <p key={n} className="pq-note">{n}</p>)}
          <Explanation steps={q.steps} startOpen={!result.correct} />
        </div>
      )}
    </div>
  );
}
