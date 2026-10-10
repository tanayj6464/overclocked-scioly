"use client";

import { useEffect, useState } from "react";
import { storageKeys, loadJSON, saveJSON, removeKey } from "@/lib/storage";

const EMPTY = { missed: [], stats: {} };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards({ eventSlug, deckSlug, cards }) {
  const key = storageKeys.cards(eventSlug, deckSlug);
  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));
  const [saved, setSaved] = useState(EMPTY);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [session, setSession] = useState(null);
  const [showExplain, setShowExplain] = useState(false);

  useEffect(() => {
    const s = loadJSON(key, EMPTY);
    // Drop ids for cards that no longer exist.
    setSaved({ missed: (s.missed || []).filter((id) => byId[id]), stats: s.stats || {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const persist = (next) => {
    setSaved(next);
    saveJSON(key, next);
  };

  const start = (ids, label) => {
    if (!ids.length) return;
    setSession({ queue: shuffleOn ? shuffle(ids) : ids, i: 0, flipped: false, right: [], wrong: [], label, done: false });
  };

  const flip = () => {
    setShowExplain(false);
    setSession((s) => (s && !s.done ? { ...s, flipped: !s.flipped } : s));
  };

  const grade = (correct) => {
    const s = session;
    if (!s || s.done || !s.flipped) return;
    const id = s.queue[s.i];
    const stat = saved.stats[id] || { right: 0, wrong: 0 };
    const missedSet = new Set(saved.missed);
    if (correct) missedSet.delete(id);
    else missedSet.add(id);
    persist({
      missed: [...missedSet],
      stats: { ...saved.stats, [id]: { right: stat.right + (correct ? 1 : 0), wrong: stat.wrong + (correct ? 0 : 1) } },
    });
    const last = s.i + 1 >= s.queue.length;
    setShowExplain(false);
    setSession({
      ...s,
      right: correct ? [...s.right, id] : s.right,
      wrong: correct ? s.wrong : [...s.wrong, id],
      i: last ? s.i : s.i + 1,
      flipped: false,
      done: last,
    });
  };

  // Keyboard: Space flips, 1 = missed it, 2 = got it.
  useEffect(() => {
    if (!session || session.done) return;
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "1") grade(false);
      else if (e.key === "2") grade(true);
      else if ((e.key === "e" || e.key === "E") && session.flipped) setShowExplain((v) => !v);
      // Space on a focused button already clicks it, so only handle it elsewhere.
      else if (e.key === " " && tag !== "BUTTON") { e.preventDefault(); flip(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const reset = () => {
    removeKey(key);
    setSaved(EMPTY);
  };

  // ---- Start screen ----
  if (!session) {
    const seen = Object.keys(saved.stats).length;
    return (
      <div className="fc-start">
        <div className="fc-stats">
          <div><strong>{cards.length}</strong><span>cards</span></div>
          <div><strong>{seen}</strong><span>studied</span></div>
          <div><strong>{saved.missed.length}</strong><span>to redo</span></div>
        </div>
        <div className="fc-start-actions">
          <button className="btn" onClick={() => start(cards.map((c) => c.id), "All cards")}>
            Study all {cards.length} cards
          </button>
          <button
            className="btn btn-outline"
            disabled={!saved.missed.length}
            onClick={() => start(saved.missed, "Cards to redo")}
          >
            Redo missed cards ({saved.missed.length})
          </button>
        </div>
        <label className="fc-toggle">
          <input type="checkbox" checked={shuffleOn} onChange={(e) => setShuffleOn(e.target.checked)} />
          Shuffle the cards
        </label>
        <p className="fineprint">
          Flip each card, then mark whether you got it. Cards you miss are saved so you can redo just those. A card
          leaves your redo list once you get it right. Progress is saved only in this browser on this device.
          {(seen > 0 || saved.missed.length > 0) && (
            <> <button className="btn-plain" onClick={reset}>Reset my progress</button></>
          )}
        </p>
      </div>
    );
  }

  // ---- Results screen ----
  if (session.done) {
    const total = session.queue.length;
    return (
      <div className="fc-results">
        <h3>You got {session.right.length} of {total}</h3>
        <div className="progress" aria-hidden="true"><div style={{ width: `${(session.right.length / total) * 100}%` }} /></div>
        {session.wrong.length > 0 ? (
          <>
            <p>Review the ones you missed:</p>
            <ul className="fc-missed">
              {session.wrong.map((id) => (
                <li key={id}>
                  <div><span>{byId[id].front}</span><strong>{byId[id].back}</strong></div>
                  {byId[id].explain && <p className="fc-missed-explain">{byId[id].explain}</p>}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>You got every card in this round.</p>
        )}
        <div className="fc-start-actions">
          {session.wrong.length > 0 && (
            <button className="btn" onClick={() => start(session.wrong, "Redo")}>
              Redo the {session.wrong.length} you missed
            </button>
          )}
          <button className="btn btn-outline" onClick={() => setSession(null)}>Back to the deck</button>
        </div>
      </div>
    );
  }

  // ---- Card screen ----
  const card = byId[session.queue[session.i]];
  const n = session.queue.length;
  return (
    <div className="fc-session">
      <div className="fc-top">
        <span>{session.label}: card {session.i + 1} of {n}</span>
        <button className="btn-plain" onClick={() => setSession(null)}>End session</button>
      </div>
      <div className="progress" aria-hidden="true"><div style={{ width: `${(session.i / n) * 100}%` }} /></div>

      <button
        className={`fc-card${session.flipped ? " is-flipped" : ""}`}
        onClick={flip}
        aria-label={session.flipped ? "Show the question" : "Show the answer"}
      >
        <span className="fc-inner">
          <span className="fc-face fc-front" aria-hidden={session.flipped}>
            <span className="fc-group">{card.group}</span>
            <span className="fc-text">{card.front}</span>
            <span className="fc-tap">Tap or press Space to flip</span>
          </span>
          <span className="fc-face fc-back" aria-hidden={!session.flipped}>
            <span className="fc-group">{card.group}</span>
            <span className="fc-text">{card.back}</span>
          </span>
        </span>
      </button>
      <p className="sr-only" aria-live="polite">{session.flipped ? `Answer: ${card.back}` : `Question: ${card.front}`}</p>

      {session.flipped && card.explain && (
        <div className="fc-explain">
          <button className="btn-plain" aria-expanded={showExplain} onClick={() => setShowExplain((v) => !v)}>
            {showExplain ? "Hide explanation" : "Show explanation"} <kbd>E</kbd>
          </button>
          {showExplain && <p>{card.explain}</p>}
        </div>
      )}

      <div className="fc-grade">
        {session.flipped ? (
          <>
            <button className="fc-btn fc-miss" onClick={() => grade(false)}>I missed it <kbd>1</kbd></button>
            <button className="fc-btn fc-got" onClick={() => grade(true)}>I got it <kbd>2</kbd></button>
          </>
        ) : (
          <button className="fc-btn fc-show" onClick={flip}>Show answer <kbd>Space</kbd></button>
        )}
      </div>
    </div>
  );
}
