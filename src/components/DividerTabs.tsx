"use client";

import { useEffect, useState } from "react";
import { dividerTabs } from "@/content/site";

/**
 * Binder divider index: a column of tabs on the right edge of wide screens.
 * The tab for the section being read is raised in team blue.
 */
export function DividerTabs() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = ["top", ...dividerTabs.map((t) => t.id), "supporters"];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          setActive(dividerTabs.some((t) => t.id === id) ? id : null);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section index"
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 min-[1400px]:block"
    >
      <ol className="flex flex-col gap-1.5">
        {dividerTabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <li key={tab.id}>
              <a
                href={`#${tab.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`flex w-9 rotate-180 items-center justify-center rounded-r-[6px] border border-l-0 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-[translate,background-color,color,border-color] duration-300 ease-out-expo [writing-mode:vertical-rl] ${
                  isActive
                    ? "translate-x-0 border-blue bg-blue text-white"
                    : "translate-x-2 border-rule bg-white text-muted hover:translate-x-0 hover:text-ink"
                }`}
              >
                {tab.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
