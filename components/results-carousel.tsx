"use client";

import * as React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { LazyMotion, MotionConfig, domAnimation, m, useAnimate, useReducedMotion, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { HAS_RESULTS, RESULTS_IN_ORDER, RESULTS_YEAR, streamOf, type Result, type Stream } from "@/data/results";

/*
  Results: a compact card row that glides slowly and continuously on its own, inside the
  page's content container (same max-width and padding as the heading), with cards
  clipped cleanly at the container's edges.

  Carousel engine: Embla (embla-carousel-react, the engine behind shadcn's Carousel) with
  its official Auto Scroll plugin. Loop, so it never ends or jumps; drag and swipe.

  When it moves (WCAG 2.2.2, pause/stop/hide): one controller decides, from these flags:
  - stops while the mouse is over the row, or anything in it has keyboard focus;
  - stops when someone touches or drags it, and resumes about 3 seconds after;
  - stops while the section is off-screen or the browser tab is hidden;
  - stays stopped once the user presses pause, until they press play;
  - never runs under prefers-reduced-motion (arrows, swipe and keyboard still work).
  The arrows stop it, move one card smoothly, and it resumes once the row settles.

  WAI carousel pattern: a labelled region with aria-roledescription="carousel", slides
  labelled "3 of 9"; aria-live is "off" while it moves and "polite" when it is still.
  Short filters are repeated as decorative copies (hidden from screen readers and the
  keyboard) so the loop always has enough cards.

  Card: unchanged. A thin double bezel (24px shell, 16px core, 12px square photo).

  Performance: Embla moves the row with one transform; React state changes only when the
  row starts or stops, never per frame. Images below the first few load lazily.
*/

type Filter = "all" | Stream;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "engineering", label: "Engineering" },
  { id: "medical", label: "Medical" },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const MIN_SLIDES = 12; // enough cards for a seamless loop on the widest container
const SPEED_DESKTOP = 0.7; // px per frame
const SPEED_MOBILE = 0.45;
const RESUME_AFTER_TOUCH = 3000; // ms
const LIFT = { type: "spring", bounce: 0, visualDuration: 0.4 } as const; // damping ratio 1.0

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* ---------- Card (unchanged) ---------- */

/** 32 to 36px serif, tabular figures; the unit is set smaller. Real spaces, so it reads "AIR 677". */
function Figure({ result }: { result: Result }) {
  const unit = "text-[0.44em] font-normal tracking-normal text-muted";
  return (
    <p className="whitespace-nowrap font-serif text-[2.125rem] font-medium leading-[1] tracking-[-0.01em] text-ink [font-variant-numeric:tabular-nums_lining-nums]">
      {result.resultType === "air" && <span className={unit}>AIR </span>}
      {result.resultType === "rank" && <span className={unit}>Rank </span>}
      <span>{result.value}</span>
      {result.resultType === "score" && result.outOf && <span className={unit}> / {result.outOf}</span>}
      {result.resultType === "percentile" && <span className={unit}> percentile</span>}
    </p>
  );
}

function ResultCard({ result, eager }: { result: Result; eager: boolean }) {
  return (
    <m.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={LIFT}
      className="group/card h-full rounded-[24px] bg-card-shell p-2 shadow-card ring-1 ring-card-line"
    >
      <article className="flex h-full flex-col rounded-[16px] bg-card p-2">
        {/* Perfect square, declared size (no layout shift), face centred, 3% zoom on hover. */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-tan">
          <Image
            src={result.photo}
            alt={`Photo of ${result.name}`}
            width={512}
            height={512}
            sizes="(min-width: 768px) 272px, 70vw"
            loading={eager ? "eager" : "lazy"}
            className="size-full object-cover object-[50%_35%] saturate-[0.9] sepia-[0.12] transition-transform duration-700 ease-out-soft group-hover/card:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
        </div>
        {/* 8px rhythm: label, number, name, college. College never cut off (up to 2 lines reserved). */}
        <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
          <p className="text-[0.875rem] leading-5 text-muted">{result.exam}</p>
          <div className="mt-2">
            <Figure result={result} />
          </div>
          <h3 className="mt-3 font-serif text-[1.125rem] font-medium leading-6 text-ink">{result.name}</h3>
          <p className="mt-1 min-h-10 text-pretty text-[0.875rem] leading-5 text-muted">
            {result.college}, {result.course}
          </p>
        </div>
      </article>
    </m.div>
  );
}

/* ---------- Controls ---------- */

const CONTROL =
  "flex size-11 cursor-pointer touch-manipulation items-center justify-center rounded-[6px] border border-field-line text-ink transition-[background-color,border-color,transform,translate,scale] duration-200 ease-out-soft hover:border-ink hover:bg-card active:scale-[0.98] motion-reduce:transition-none";

function Controls({
  onPrev,
  onNext,
  onToggle,
  paused,
  showToggle,
  controls,
}: {
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  paused: boolean;
  showToggle: boolean;
  controls: string;
}) {
  return (
    <div className="flex shrink-0 gap-2">
      {showToggle && (
        <button
          type="button"
          aria-label={paused ? "Play results" : "Pause results"}
          aria-controls={controls}
          onClick={onToggle}
          className={CONTROL}
        >
          {paused ? <Play size={18} weight="fill" aria-hidden="true" /> : <Pause size={18} weight="fill" aria-hidden="true" />}
        </button>
      )}
      <button type="button" aria-label="Previous results" aria-controls={controls} onClick={onPrev} className={CONTROL}>
        <ArrowLeft size={18} weight="bold" aria-hidden="true" />
      </button>
      <button type="button" aria-label="Next results" aria-controls={controls} onClick={onNext} className={CONTROL}>
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ---------- Section ---------- */

export function ResultsCarousel() {
  if (!HAS_RESULTS) return null;
  return <ResultsCarouselSection />;
}

type Flags = { hover: boolean; focus: boolean; touch: boolean; offscreen: boolean; hidden: boolean; paused: boolean };

function ResultsCarouselSection() {
  const uid = useId();
  const rowId = `${uid}-row`;
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [userPaused, setUserPaused] = useState(false);
  const [moving, setMoving] = useState(false); // changes only on start/stop, never per frame
  const [rowScope, animateRow] = useAnimate<HTMLDivElement>();

  const filters = FILTERS.filter((f) => f.id === "all" || RESULTS_IN_ORDER.some((r) => streamOf(r) === f.id));
  const { slides, count } = useMemo(() => {
    const shown = RESULTS_IN_ORDER.filter((r) => filter === "all" || streamOf(r) === filter);
    const rounds = Math.max(1, Math.ceil(MIN_SLIDES / shown.length));
    const all = Array.from({ length: rounds }, (_, round) => shown.map((r, i) => ({ r, n: i + 1, copy: round > 0 }))).flat();
    return { slides: all, count: shown.length };
  }, [filter]);

  // The plugin only starts and stops when told to (all decisions are in sync() below).
  const plugins = useMemo(
    () => [
      AutoScroll({
        playOnInit: false,
        startDelay: 0,
        speed: SPEED_DESKTOP,
        direction: "forward",
        stopOnInteraction: true, // stops on drag; sync() decides when to resume
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    ],
    [],
  );
  const [viewportRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: false, skipSnaps: true, duration: 30 },
    plugins,
  );

  /* The controller: auto-scroll runs only when nothing asks it to stop. */
  const flags = useRef<Flags>({ hover: false, focus: false, touch: false, offscreen: true, hidden: false, paused: false });
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const sync = useCallback(() => {
    const auto = embla?.plugins()?.autoScroll;
    if (!embla || !auto) return;
    const f = flags.current;
    const shouldRun = !reduceRef.current && !f.paused && !f.hover && !f.focus && !f.touch && !f.offscreen && !f.hidden;
    if (shouldRun && !auto.isPlaying()) auto.play(0);
    else if (!shouldRun && auto.isPlaying()) auto.stop();
  }, [embla]);
  const set = useCallback(
    (patch: Partial<Flags>) => {
      flags.current = { ...flags.current, ...patch };
      sync();
    },
    [sync],
  );

  // Speed: slower on small screens.
  useEffect(() => {
    if (!embla) return;
    const auto = embla.plugins().autoScroll;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      const opts = (auto as unknown as { options: { speed: number } }).options;
      if (opts) opts.speed = mq.matches ? SPEED_DESKTOP : SPEED_MOBILE;
      // Restart so the new speed takes effect if it is running.
      if (auto.isPlaying()) {
        auto.stop();
        sync();
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [embla, sync]);

  // Moving / still: for aria-live and the pause button icon.
  useEffect(() => {
    if (!embla) return;
    const onPlay = () => setMoving(true);
    const onStop = () => setMoving(false);
    embla.on("autoScroll:play", onPlay).on("autoScroll:stop", onStop);
    return () => {
      embla.off("autoScroll:play", onPlay).off("autoScroll:stop", onStop);
    };
  }, [embla]);

  // Touch and drag: stop now (the plugin does), resume about 3 seconds after letting go.
  useEffect(() => {
    if (!embla) return;
    let timer = 0;
    const down = () => {
      window.clearTimeout(timer);
      set({ touch: true });
    };
    const up = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => set({ touch: false }), RESUME_AFTER_TOUCH);
    };
    embla.on("pointerDown", down).on("pointerUp", up);
    return () => {
      window.clearTimeout(timer);
      embla.off("pointerDown", down).off("pointerUp", up);
    };
  }, [embla, set]);

  // Off-screen and hidden tab: no work while nobody can see it.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !embla) return;
    const io = new IntersectionObserver(([e]) => set({ offscreen: !e.isIntersecting }), { threshold: 0.1 });
    io.observe(el);
    const onVis = () => set({ hidden: document.visibilityState === "hidden" });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [embla, set]);

  // Reduced motion changes (rare): re-decide.
  useEffect(() => {
    sync();
  }, [reduce, sync]);

  // Filter change: re-measure, restart from the first card.
  useEffect(() => {
    if (!embla) return;
    embla.plugins().autoScroll?.stop();
    embla.reInit();
    embla.scrollTo(0, true);
    sync();
  }, [embla, slides, sync]);

  // Arrows: stop, move one card smoothly, resume when the row settles.
  const step = useCallback(
    (dir: 1 | -1) => {
      if (!embla) return;
      embla.plugins().autoScroll?.stop();
      if (dir === 1) embla.scrollNext(Boolean(reduce));
      else embla.scrollPrev(Boolean(reduce));
      const resume = () => {
        embla.off("settle", resume);
        sync();
      };
      embla.on("settle", resume);
    },
    [embla, reduce, sync],
  );
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  const togglePause = () => {
    const paused = !userPaused;
    setUserPaused(paused);
    set({ paused });
  };

  const pickFilter = (f: Filter) => {
    if (f === filter) return;
    setFilter(f);
    if (rowScope.current && !reduce) void animateRow(rowScope.current, { opacity: [0.2, 1] }, { duration: 0.4, ease: EASE });
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = filters.length - 1;
    const nextIndex =
      e.key === "ArrowRight" ? (i + 1) % filters.length
      : e.key === "ArrowLeft" ? (i + last) % filters.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (nextIndex === null) return;
    e.preventDefault();
    pickFilter(filters[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const onRowKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const showToggle = !reduce;
  const controls = (
    <Controls
      onPrev={prev}
      onNext={next}
      onToggle={togglePause}
      paused={userPaused || !moving}
      showToggle={showToggle}
      controls={rowId}
    />
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <m.section
          ref={sectionRef}
          id="results"
          aria-labelledby="results-title"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative scroll-mt-4 overflow-hidden bg-sheet-1 py-16 text-ink md:py-20 lg:py-14"
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <m.div variants={rise}>
              <h2
                id="results-title"
                className="text-balance font-serif text-[clamp(2.25rem,4.2vw,3.375rem)] font-medium leading-[1.05] tracking-[-0.02em] lg:whitespace-nowrap"
              >
                Where our students got in
              </h2>
              <p className="mt-3 max-w-[65ch] text-pretty text-[1rem] leading-relaxed text-muted sm:text-[1.0625rem]">
                NEET, JEE, KCET and PESSAT results from Veda students, {RESULTS_YEAR}.
              </p>
            </m.div>
            {/* Filters on the left, controls on the right: one row, same 44px height. */}
            <m.div variants={rise} className="mt-6 flex items-center justify-between gap-4">
              <div role="tablist" aria-label="Filter results" className="flex flex-wrap gap-2">
                {filters.map((f, i) => {
                  const on = filter === f.id;
                  return (
                    <button
                      key={f.id}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${uid}-tab-${f.id}`}
                      aria-selected={on}
                      aria-controls={rowId}
                      tabIndex={on ? 0 : -1}
                      onClick={() => pickFilter(f.id)}
                      onKeyDown={(e) => onTabKey(e, i)}
                      className={cn(
                        "h-11 cursor-pointer touch-manipulation rounded-[6px] border px-4 text-[0.95rem] transition-[color,background-color,border-color,transform,translate,scale] duration-200 ease-out-soft active:scale-[0.98] motion-reduce:transition-none sm:px-5",
                        on ? "border-btn bg-btn font-medium text-on-btn" : "border-field-line text-ink hover:border-ink hover:bg-card",
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
              <div className="hidden md:block">{controls}</div>
            </m.div>

            {/* The row: inside the content container, cards clipped cleanly at its edges. */}
            <m.div variants={rise} className="mt-6 lg:mt-8">
              <div
                ref={(el) => {
                  regionRef.current = el;
                  rowScope.current = el as HTMLDivElement;
                }}
                id={rowId}
                role="region"
                aria-roledescription="carousel"
                aria-label="Student results"
                tabIndex={0}
                onKeyDown={onRowKey}
                onMouseEnter={() => set({ hover: true })}
                onMouseLeave={() => set({ hover: false })}
                onFocus={() => set({ focus: true })}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) set({ focus: false });
                }}
                className="outline-offset-2"
              >
                <div ref={viewportRef} className="overflow-hidden py-3">
                  <ul aria-live={moving ? "off" : "polite"} className="flex touch-pan-y">
                    {slides.map(({ r, n, copy }, i) => (
                      <li
                        key={`${r.slug}-${i}`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={copy ? undefined : `${n} of ${count}`}
                        aria-hidden={copy || undefined}
                        inert={copy || undefined}
                        data-copy={copy || undefined}
                        className="min-w-0 shrink-0 grow-0 basis-[calc(min(68vw,18rem)+24px)] pr-6"
                      >
                        <ResultCard result={r} eager={i < 5} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </m.div>

            {/* Phones and small tablets: controls under the row. */}
            <div className="mt-4 flex justify-center md:hidden">{controls}</div>
          </div>
        </m.section>
      </MotionConfig>
    </LazyMotion>
  );
}
