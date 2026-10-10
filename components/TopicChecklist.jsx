"use client";

import { useEffect, useState } from "react";
import { storageKeys, loadJSON, saveJSON } from "@/lib/storage";

// Checklist for one topic. Saves which items are done, in this browser only.
export default function TopicChecklist({ eventSlug, topicSlug, items }) {
  const key = storageKeys.progress(eventSlug);
  const [done, setDone] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDone(loadJSON(key, {})[topicSlug] || []);
    setLoaded(true);
  }, [key, topicSlug]);

  const toggle = (i) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i];
    setDone(next);
    const all = loadJSON(key, {});
    saveJSON(key, { ...all, [topicSlug]: next });
  };

  const pct = items.length ? Math.round((done.length / items.length) * 100) : 0;

  return (
    <div className="checklist-box">
      <div className="progress" aria-hidden="true"><div style={{ width: `${loaded ? pct : 0}%` }} /></div>
      <p className="progress-label">{done.length} of {items.length} studied</p>
      <ul className="checks">
        {items.map((label, i) => (
          <li key={label}>
            <label>
              <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
              <span>{label}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="fineprint">Saved only in this browser on this device.</p>
    </div>
  );
}
