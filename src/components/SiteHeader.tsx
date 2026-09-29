"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navigation, site } from "@/content/site";
import { ArrowIcon, Container, Phoenix } from "./ui";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 900) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || open
          ? "border-rule bg-paper"
          : "border-transparent bg-paper"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-sheet focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.legalName}, home`}>
          <Phoenix className="h-9 w-auto" priority />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[17px] font-extrabold tracking-[0.02em] text-ink">
              OVERCLOCKED
            </span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {site.schoolShort} Science Olympiad
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden min-[900px]:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  className="text-[15px] font-medium text-ink/80 transition-colors hover:text-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#support"
            className="group hidden h-10 items-center gap-2 rounded-sheet bg-blue px-4 text-[14px] font-semibold text-white transition-colors hover:bg-deep min-[900px]:inline-flex"
          >
            Support the Team
            <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-sheet border border-rule bg-white px-3 text-[14px] font-semibold text-ink min-[900px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
              {open ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /> : <path d="M2 5h12M2 11h12" />}
            </svg>
          </button>
        </div>
      </Container>

      <div
        id="mobile-menu"
        ref={panel}
        hidden={!open}
        className="border-t border-rule bg-paper min-[900px]:hidden"
      >
        <Container className="py-3">
          <nav aria-label="Mobile">
            <ul>
              {navigation.map((item) => (
                <li key={item.id} className="border-b border-rule last:border-b-0">
                  <Link
                    href={`/#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-xl font-semibold tracking-[-0.02em] text-ink"
                  >
                    {item.label}
                    <ArrowIcon className="text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/#support"
            onClick={() => setOpen(false)}
            className="mb-3 mt-2 flex h-12 items-center justify-center gap-2 rounded-sheet bg-blue text-[15px] font-semibold text-white"
          >
            Support the Team
            <ArrowIcon />
          </Link>
        </Container>
      </div>
    </header>
  );
}
