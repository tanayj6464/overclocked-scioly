"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { storageKeys, loadJSON } from "@/lib/storage";

// Topics sorted by test share, with progress from this browser.
export default function StudyHubList({ eventSlug, topics }) {
  const [progress, setProgress] = useState({});
  useEffect(() => setProgress(loadJSON(storageKeys.progress(eventSlug), {})), [eventSlug]);

  const sorted = [...topics].sort((a, b) => b.weight - a.weight);
  return (
    <ol className="hub-list">
      {sorted.map((t, i) => {
        const total = t.subtopics.length || 1;
        const done = (progress[t.slug] || []).length;
        const pct = Math.round((done / total) * 100);
        return (
          <li key={t.slug}>
            <Link href={`/events/${eventSlug}/study/${t.slug}`} className="hub-row">
              <span className="hub-pct">{t.weight}%</span>
              <span className="hub-name">
                {t.name}
                {i === 0 && <span className="tag">Start here</span>}
              </span>
              <span className="hub-progress">
                <span className="progress small" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
                <span className="sr-only">{done} of {total} studied</span>
                <span aria-hidden="true">{done}/{total}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
