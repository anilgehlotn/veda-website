"use client";

import * as React from "react";
import { useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { EXAMS, HAS_RESULTS, HIGHLIGHTS, RESULTS, resultYears, type Exam, type Result } from "@/data/results";

/*
  Results: where the page's dark closing chapter begins. The rounded top edge rises
  over the light "Why trust Veda" section; Contact and the footer continue the same
  espresso brown below, so the page switches theme once.

  Everything comes from data/results.ts. With no entries the section renders nothing
  (and lib/site.ts drops its nav link). Names and photos appear only with consent.

  Motion (motion/react) only, like Contact. The page's GSAP never wraps this
  component. Reduced motion: no movement, instant tab switches.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
type Tab = "All" | Exam;
const TABS: Tab[] = ["All", ...EXAMS];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.75, delay, ease: EASE },
});

/* ---------- Pieces ---------- */

function initials(name: string) {
  return name
    .replace(/[^\p{L}\s]/gu, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Photo if there is one (and consent), otherwise a monogram in the site's style. */
function Portrait({ result, size }: { result: Result; size: "lg" | "sm" }) {
  const box = size === "lg" ? "size-28 rounded-[16px] md:size-44" : "size-14 rounded-[12px]";
  if (result.consentToShow && result.photo) {
    return (
      <div className={cn("relative shrink-0 overflow-hidden bg-block", box)}>
        <Image
          src={result.photo}
          alt={`${result.studentName}, ${result.exam} ${result.year}`}
          fill
          sizes={size === "lg" ? "176px" : "56px"}
          className="object-cover"
        />
      </div>
    );
  }
  const text = result.consentToShow ? initials(result.studentName) : null;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center bg-block ring-1 ring-inset ring-accent/35",
        box,
      )}
    >
      {text ? (
        <span className={cn("font-serif font-medium leading-none text-accent", size === "lg" ? "text-[2.6rem] md:text-[3.6rem]" : "text-[1.35rem]")}>
          {text}
        </span>
      ) : (
        <span lang="sa" className={cn("font-deva leading-none text-accent", size === "lg" ? "text-[2.2rem] md:text-[3rem]" : "text-[1.1rem]")}>
          वेद
        </span>
      )}
    </div>
  );
}

const displayName = (r: Result) => (r.consentToShow ? r.studentName : "A Veda student");

function Quote({ result, className }: { result: Result; className?: string }) {
  if (!result.quote) return null;
  return (
    <figure className={className}>
      <blockquote className="line-clamp-3 text-pretty font-serif text-[1.15rem] italic leading-snug text-on-block/90">
        &ldquo;{result.quote}&rdquo;
      </blockquote>
      {result.quoteBy && (
        <figcaption className="mt-2 text-[0.9rem] text-on-block/75">
          {result.quoteBy === "parent" ? `Parent of ${displayName(result)}` : displayName(result)}
        </figcaption>
      )}
    </figure>
  );
}

/* Dark double bezel: a faint cream outer shell, then a slightly lighter brown core. */
function Bezel({ children, large = false, className }: { children: React.ReactNode; large?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "bg-on-block/[0.06] ring-1 ring-on-block/10 shadow-[0_40px_90px_-40px_rgb(18_10_6/0.6)]",
        large ? "rounded-[28px] p-2" : "rounded-[24px] p-1.5",
        className,
      )}
    >
      <div
        className={cn(
          "h-full bg-block-2/60 ring-1 ring-on-block/[0.07] shadow-[inset_0_1px_0_rgb(242_232_217/0.06)]",
          large ? "rounded-[20px] p-6 sm:p-8 lg:p-10" : "rounded-[18px] p-5",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function Featured({ result }: { result: Result }) {
  return (
    <Bezel large>
      <article className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
        <Portrait result={result} size="lg" />
        <div className="min-w-0">
          <p className="text-[0.95rem] text-on-block/75">
            {result.exam}, {result.year}
          </p>
          <h3 className="mt-1 break-words font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-tight">
            {displayName(result)}
          </h3>
          <p className="mt-3 break-words font-serif text-[clamp(3rem,6.5vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-accent [font-variant-numeric:tabular-nums]">
            {result.score}
          </p>
          {result.subjects && <p className="mt-3 text-[0.98rem] text-on-block/80">{result.subjects}</p>}
          <Quote result={result} className="mt-6 max-w-[38rem] border-t border-on-block/12 pt-5" />
        </div>
      </article>
    </Bezel>
  );
}

function Card({ result }: { result: Result }) {
  // Width follows content: a card with a quote is wider, so the row never reads as equal cards.
  const wide = Boolean(result.quote);
  return (
    <li
      className={cn(
        "shrink-0 snap-start transition-transform duration-500 ease-out-soft hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        wide ? "w-[min(21rem,82vw)]" : "w-[min(16rem,70vw)]",
      )}
    >
      <Bezel className="h-full">
        <article className="flex h-full flex-col">
          <div className="flex items-center gap-3">
            <Portrait result={result} size="sm" />
            <div className="min-w-0">
              <h3 className="break-words font-serif text-[1.2rem] font-medium leading-tight">{displayName(result)}</h3>
              <p className="text-[0.9rem] text-on-block/75">
                {result.exam}, {result.year}
              </p>
            </div>
          </div>
          <p className="mt-5 break-words font-serif text-[2.4rem] font-medium leading-none text-accent [font-variant-numeric:tabular-nums]">
            {result.score}
          </p>
          {result.subjects && <p className="mt-2 text-[0.95rem] text-on-block/80">{result.subjects}</p>}
          <Quote result={result} className="mt-auto pt-5" />
        </article>
      </Bezel>
    </li>
  );
}

function EmptyTab({ exam }: { exam: Tab }) {
  return (
    <div className="rounded-[24px] border border-dashed border-on-block/25 px-6 py-12 text-center sm:py-16">
      <p className="font-serif text-[1.5rem] font-medium">No {exam === "All" ? "" : `${exam} `}results to show yet</p>
      <p className="mx-auto mt-2 max-w-[30rem] text-pretty leading-relaxed text-on-block/80">
        Results appear here once they are announced and the students agree to share them.
      </p>
    </div>
  );
}

/* ---------- Section ---------- */

export function Results() {
  if (!HAS_RESULTS) return null;
  return <ResultsSection />;
}

function ResultsSection() {
  const uid = useId();
  const reduce = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tab, setTab] = useState<Tab>("All");
  const years = resultYears();
  const [year, setYear] = useState<string>("all");

  // Derived during render: no effects, no extra state.
  const shown = RESULTS.filter((r) => (tab === "All" || r.exam === tab) && (year === "all" || r.year === year));
  const featured = shown.find((r) => r.featured) ?? shown[0];
  const others = shown.filter((r) => r !== featured);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = TABS.length - 1;
    const next =
      e.key === "ArrowRight" ? (i + 1) % TABS.length
      : e.key === "ArrowLeft" ? (i + last) % TABS.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setTab(TABS[next]);
    tabRefs.current[next]?.focus();
  };

  const swap = reduce ? { duration: 0 } : { duration: 0.35, ease: EASE };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <section
          id="results"
          aria-labelledby="results-title"
          className="relative z-20 -mt-8 scroll-mt-4 overflow-hidden rounded-t-[2rem] bg-block pb-20 pt-20 text-on-block [color-scheme:dark] sm:rounded-t-[2.75rem] md:pb-24 md:pt-24 lg:rounded-t-[3.5rem] lg:pt-28"
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-16">
              <m.div {...rise(0)}>
                <h2
                  id="results-title"
                  className="text-balance font-serif text-[clamp(2.5rem,5.2vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.025em]"
                >
                  Results our students earned
                </h2>
                <p className="mt-4 max-w-[30rem] text-pretty text-[1.1rem] leading-relaxed text-on-block/80">
                  Every result here belongs to a Veda student. We name and picture a student only when they have agreed
                  to it.
                </p>
              </m.div>

              {HIGHLIGHTS.length > 0 && (
                <m.ul {...rise(0.1)} className="grid gap-6 sm:grid-cols-3 sm:gap-0">
                  {HIGHLIGHTS.slice(0, 3).map((h) => (
                    <li
                      key={h.label}
                      className="min-w-0 border-t border-on-block/15 pt-4 sm:border-l sm:border-t-0 sm:px-5 sm:pt-0 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0"
                    >
                      <p className="break-words font-serif text-[clamp(2.2rem,3.3vw,3.2rem)] font-medium leading-none text-accent [font-variant-numeric:tabular-nums]">
                        {h.figure}
                      </p>
                      <p className="mt-2 max-w-[16rem] text-pretty text-[0.98rem] leading-snug text-on-block/80">
                        {h.label}
                      </p>
                    </li>
                  ))}
                </m.ul>
              )}
            </div>

            {/* Exam tabs, and a year picker when the data spans more than one year. */}
            <m.div
              {...rise(0.18)}
              className="mt-14 flex flex-col gap-4 border-b border-on-block/12 md:flex-row md:items-end md:justify-between"
            >
              <div
                role="tablist"
                aria-label="Results by exam"
                className="-mx-4 flex overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
              >
                {TABS.map((t, i) => {
                  const on = tab === t;
                  return (
                    <button
                      key={t}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${uid}-tab-${i}`}
                      aria-selected={on}
                      aria-controls={`${uid}-panel`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setTab(t)}
                      onKeyDown={(e) => onTabKey(e, i)}
                      className={cn(
                        "relative min-h-12 shrink-0 touch-manipulation whitespace-nowrap rounded-[6px] px-4 text-[1rem] transition-[color,transform,translate,scale] duration-200 ease-out-soft active:scale-[0.98] motion-reduce:transition-none",
                        on ? "font-medium text-on-block" : "text-on-block/75 hover:text-on-block",
                      )}
                    >
                      {t}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-4 -bottom-px h-[2px] origin-center bg-accent transition-[transform,scale] duration-300 ease-out-soft motion-reduce:transition-none",
                          on ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {years.length > 1 && (
                <div className="flex items-center gap-3 pb-2">
                  <label htmlFor={`${uid}-year`} className="text-[0.95rem] text-on-block/80">
                    Year
                  </label>
                  <div className="relative">
                    <select
                      id={`${uid}-year`}
                      name="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="h-11 cursor-pointer appearance-none rounded-[6px] border border-on-block/45 bg-block px-4 pr-10 text-base text-on-block hover:border-on-block/65 [&>option]:bg-block [&>option]:text-on-block"
                    >
                      <option value="all">All years</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <CaretDown
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-on-block/75"
                    />
                  </div>
                </div>
              )}
            </m.div>

            <m.div
              {...rise(0.26)}
              id={`${uid}-panel`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${TABS.indexOf(tab)}`}
              className="mt-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={`${tab}-${year}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={swap}
                >
                  {featured ? (
                    <div className="grid gap-8">
                      <Featured result={featured} />
                      {others.length > 0 && (
                          <ul
                            aria-label="More results"
                            tabIndex={0}
                            className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-1 [scrollbar-color:rgb(242_232_217/0.25)_transparent] [scrollbar-width:thin] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-12 lg:scroll-px-12 lg:px-12"
                          >
                            {others.map((r) => (
                              <Card key={r.id} result={r} />
                            ))}
                          </ul>
                      )}
                    </div>
                  ) : (
                    <EmptyTab exam={tab} />
                  )}
                </m.div>
              </AnimatePresence>
            </m.div>

            <p className="mt-10 text-[0.95rem] text-on-block/75">Results from Veda students, {years.join(", ")}.</p>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
