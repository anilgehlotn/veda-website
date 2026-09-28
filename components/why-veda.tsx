"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Image as ImageIcon, Minus, Plus } from "@phosphor-icons/react";
import { container } from "./sections";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
  "Why parents trust Veda": an editorial split with a selector.

  Left: heading, one intro line and the six points as a vertical tab list. Only the
  active point shows its line. Right: a stack of framed cards. The active card sits in
  front, fully visible; the next two peek out behind its right edge, smaller and
  softer, like a neat stack of papers. Nothing ever covers the front card.

  Breakpoints:
    lg (1024+)   two columns; the section is min-h-[100dvh] and the card is sized from
                 the window height too, so heading, all six points and the card fit
                 one screen from 1280x720 up.
    md (768+)    tab list on top, card stack below.
    < md         accordion: tapping a point opens its line and its card beneath it,
                 one at a time. No overlaps, no stack.

  Motion: the card switch is a CSS transition on transform and opacity, keyed to the
  active point (so the server render is already correct). GSAP only runs the one-time
  scroll entrance. Reduced motion: cards switch instantly, nothing moves.

  Paper objects keep light paper colours in dark mode because they depict paper.
  The teacher's pen is a darker marigold, since the site marigold is too light on paper.
*/

const PAPER = "bg-[#f2e8d9] text-[#2b1b12]";
const PEN = "text-[#a5651a]";
const MUTED_INK = "text-[#5a4234]";

type ReasonId = "personal" | "classes" | "tests" | "ai" | "whatsapp" | "report";

type Reason = {
  id: ReasonId;
  title: string;
  line: string;
  /** what the card depicts, for screen readers */
  label: string;
  art: React.ReactNode;
};

/* ---------- The objects on each card (all sizes in em of the card's base size) ---------- */

function Poster() {
  return (
    <div className="flex h-full flex-col justify-between gap-[1.4em] bg-[#e6d5bb] p-[1.3em] text-[#2b1b12]">
      <div className={cn("flex items-start justify-between font-serif text-[1em] font-semibold", MUTED_INK)}>
        <span>Veda</span>
        <span lang="sa" className="font-deva text-[1.3em] leading-none text-[#2b1b12]">
          वेद
        </span>
      </div>
      <p className="font-serif text-[2.7em] font-medium leading-[1.02] tracking-[-0.025em]">
        Every student is taught for what they need.
      </p>
      <p className={cn("border-t border-[#2b1b12]/25 pt-[0.7em] text-[0.8em] leading-snug", MUTED_INK)}>
        Grades 8 to 12. Boards, NEET, JEE and KCET.
      </p>
    </div>
  );
}

/* An empty, clearly labelled frame for a real photograph. */
function PhotoSlot({ text }: { text: string }) {
  return (
    <div
      role="img"
      aria-label={text}
      className="flex min-h-[9em] flex-1 flex-col items-center justify-center gap-[0.6em] bg-[#d5b88e]/45 px-[1.4em] text-center"
    >
      <ImageIcon aria-hidden="true" weight="light" className="size-[1.9em] text-[#6e4a33]" />
      <span className={cn("max-w-[15em] text-[0.82em] leading-snug", MUTED_INK)}>{text}</span>
    </div>
  );
}

function SmallClass() {
  return (
    <div className={cn(PAPER, "flex h-full flex-col")}>
      <PhotoSlot text="[Photo: small classroom with teacher and a few students]" />
      <p className="px-[1.2em] py-[1em] font-serif text-[1.15em] leading-snug">
        Batch size: [Batch size] students.
      </p>
    </div>
  );
}

const QUESTIONS = [
  { q: "Solve: x² − 5x + 6 = 0", a: "x = 2, x = 3", ok: true },
  { q: "If sin θ = 3/5, find cos θ.", a: "cos θ = 5/4", ok: false },
  { q: "Sum of the first 10 terms of 3, 7, 11, …", a: "S₁₀ = 210", ok: true },
  { q: "Area of a circle of radius 7 cm.", a: "154 cm²", ok: true },
];

function Mark({ ok }: { ok: boolean }) {
  return (
    <span className={cn("font-serif text-[1.15em] leading-none", PEN)}>
      {ok ? "✓" : "✗"}
      <span className="sr-only">{ok ? "correct" : "wrong"}</span>
    </span>
  );
}

/* The printed weekly test. `checked` is the same sheet after the AI evaluation. */
function TestSheet({ checked = false }: { checked?: boolean }) {
  return (
    <div className={cn(PAPER, "flex h-full flex-col p-[1.2em]")}>
      <div className="flex items-baseline justify-between gap-[1em] border-b border-[#2b1b12]/20 pb-[0.5em]">
        <p className="font-serif text-[1.15em] font-semibold">Weekly test, Maths</p>
        <p className={cn("text-[0.82em]", MUTED_INK)}>Grade 10</p>
      </div>
      <p className={cn("mt-[0.4em] flex justify-between gap-[1em] text-[0.82em]", MUTED_INK)}>
        <span>Name: [Student name]</span>
        <span>[Date]</span>
      </p>
      <ol className="mt-[1.1em] grid gap-[1.15em]">
        {QUESTIONS.map((item, i) => (
          <li key={item.q} className="grid grid-cols-[1.2em_1fr_1.2em] gap-x-[0.4em]">
            <span className={cn("text-[0.85em]", MUTED_INK)}>{i + 1}.</span>
            <div>
              <p className="text-[0.9em] leading-snug">{item.q}</p>
              <p className="relative mt-[0.2em] w-fit font-serif text-[1.1em] italic text-[#3b2a20]">
                {item.a}
                {checked && !item.ok && (
                  <span
                    aria-hidden="true"
                    className="absolute -inset-x-[0.55em] -inset-y-[0.2em] rotate-[-3deg] rounded-[50%] border-[0.12em] border-[#a5651a]"
                  />
                )}
              </p>
              {checked && !item.ok && (
                <p className={cn("mt-[0.3em] font-serif text-[0.85em] italic leading-tight", PEN)}>
                  Weak topic: [weak topic]
                </p>
              )}
            </div>
            <Mark ok={item.ok} />
          </li>
        ))}
      </ol>
      {checked ? (
        <p
          className={cn(
            "mt-auto border-t border-dashed border-[#a5651a]/50 pt-[0.5em] font-serif text-[1em] italic leading-snug",
            PEN,
          )}
        >
          Next week: classes focus on [weak topic].
        </p>
      ) : (
        <p className={cn("mt-auto border-t border-[#2b1b12]/15 pt-[0.5em] text-right text-[0.85em]", MUTED_INK)}>
          Marks: [Score]
        </p>
      )}
    </div>
  );
}

function Messages() {
  return (
    <div className={cn(PAPER, "flex h-full flex-col")}>
      <PhotoSlot text="[Photo: parent's phone showing the Veda check-in message]" />
      <div className="grid gap-[0.55em] px-[1.2em] py-[1em]">
        <p className={cn("text-[0.8em]", MUTED_INK)}>The messages you get on WhatsApp</p>
        <blockquote className="font-serif text-[1.05em] leading-snug">
          &ldquo;[Student name] checked in at Veda, [Time]&rdquo;
        </blockquote>
        <blockquote className="font-serif text-[1.05em] leading-snug">
          &ldquo;[Student name] checked out of Veda, [Time]&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

function Report() {
  const rows: [string, string][] = [
    ["Attendance this week", "[Attendance %]"],
    ["Weekly test", "[Score]"],
    ["Topics covered", "[Topics covered]"],
  ];
  return (
    <div className={cn(PAPER, "flex h-full flex-col p-[1.2em]")}>
      <div className="flex items-start justify-between gap-[1em] border-b-2 border-[#2b1b12] pb-[0.6em]">
        <div>
          <p className="font-serif text-[1.45em] font-semibold leading-tight">Weekly report</p>
          <p className={cn("mt-[0.2em] text-[0.8em]", MUTED_INK)}>Week of [Date]</p>
        </div>
        <span lang="sa" className="font-deva text-[1.3em] leading-none">
          वेद
        </span>
      </div>
      <p className={cn("mt-[0.8em] text-[0.85em]", MUTED_INK)}>[Student name], Grade [Grade]</p>
      <dl className="mt-[0.4em] text-[0.95em]">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-[0.1em] border-b border-[#2b1b12]/15 py-[0.6em]">
            <dt className={cn("text-[0.85em]", MUTED_INK)}>{k}</dt>
            <dd className="font-serif text-[1.15em]">{v}</dd>
          </div>
        ))}
      </dl>
      <p className={cn("mt-auto pt-[0.8em] text-[0.8em]", MUTED_INK)}>Sent to parents every week.</p>
    </div>
  );
}

const REASONS: Reason[] = [
  {
    id: "personal",
    title: "Personalised learning",
    line: "We find what your child is weak in and teach to that.",
    label: "A poster: Every student is taught for what they need.",
    art: <Poster />,
  },
  {
    id: "classes",
    title: "Small classes",
    line: "[Batch size] students a batch, so no question is skipped.",
    label: "A classroom photo. Batch size: [Batch size] students.",
    art: <SmallClass />,
  },
  {
    id: "tests",
    title: "Weekly tests",
    line: "A test every week on what was taught that week.",
    label: "A marked weekly Maths test with the teacher's ticks and the score.",
    art: <TestSheet />,
  },
  {
    id: "ai",
    title: "AI evaluation",
    line: "AI finds the weak topics. Next week's classes focus on them.",
    label: "The same test with the weak topic circled. Next week: classes focus on [weak topic].",
    art: <TestSheet checked />,
  },
  {
    id: "whatsapp",
    title: "WhatsApp alerts",
    line: "A WhatsApp message when your child checks in and out.",
    label: "The check-in and check-out messages parents receive on WhatsApp.",
    art: <Messages />,
  },
  {
    id: "report",
    title: "Weekly report",
    line: "Attendance, test score and topics covered, every week.",
    label: "A printed weekly report with attendance, score and topics covered.",
    art: <Report />,
  },
];

/* ---------- The framed card (double bezel) ---------- */

const SHADOW = "shadow-[0_32px_80px_-32px_rgb(74_47_31/0.38),0_2px_8px_-2px_rgb(74_47_31/0.08)]";

/*
  Outer shell: light paper, hairline ring, 8px padding, 24px corners. Inner core: 16px
  corners (24 - 8, concentric). The core is a size container; the object inside sets
  its base size from the core's width, so it scales with the card and never reflows.
  On phones the base size never drops below 14px and the card grows to fit instead.
*/
function Card({ reason, className }: { reason: Reason; className?: string }) {
  return (
    <figure
      aria-label={reason.label}
      className={cn("rounded-[24px] bg-[#fffdf8] p-2 ring-1 ring-[#4a2f1f]/10", SHADOW, className)}
    >
      <div className="@container h-full overflow-clip rounded-[16px] ring-1 ring-[#2b1b12]/[0.06]">
        <div className="h-full text-[max(0.95rem,3.7cqw)] md:text-[3.7cqw]">{reason.art}</div>
      </div>
    </figure>
  );
}

/* Stack poses: 0 = front, 1 and 2 peek out behind the right edge, 3+ wait unseen behind. */
function pose(p: number): React.CSSProperties {
  const depth = Math.min(p, 2);
  return {
    transform: `translateX(${depth * 6}%) scale(${1 - depth * 0.06})`,
    opacity: p > 2 ? 0 : 1,
    visibility: p > 2 ? "hidden" : "visible",
    zIndex: 3 - depth - (p > 2 ? 1 : 0),
  };
}
const VEIL = [0, 0.35, 0.55];

/* ---------- Section ---------- */

export function WhyVeda() {
  const scope = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const toggles = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const anchor = useRef<{ index: number; top: number } | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  // Scroll entrance: a gentle staggered fade-up of the heading, the points and the
  // stack, once. Elements already on screen when this runs are left alone (no flash on
  // reload mid-page), and anything hidden by the current breakpoint is never touched.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = scope.current;
        if (!root) return;
        const items = gsap.utils
          .toArray<HTMLElement>("[data-enter]", root)
          .filter((el) => el.getClientRects().length > 0 && !ScrollTrigger.isInViewport(el, 0.05));
        if (!items.length) return;
        gsap.set(items, { autoAlpha: 0, y: 24 });
        // Items that enter in the same frame rise together, one after another.
        let batch: HTMLElement[] = [];
        let frame = 0;
        const flush = () => {
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.06, overwrite: true });
          batch = [];
          frame = 0;
        };
        items.forEach((el) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            // Created before the page-level triggers (child effects run first), so
            // refresh after them, in page order.
            refreshPriority: -1,
            onEnter: () => {
              batch.push(el);
              frame ||= requestAnimationFrame(flush);
            },
          }),
        );
        return () => cancelAnimationFrame(frame);
      });
      let alive = true;
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
      return () => {
        alive = false;
        mm.revert();
      };
    },
    { scope },
  );

  // Phones: opening a point closes the one above it, which would pull the tapped
  // point up the screen. Keep it where the finger was.
  useLayoutEffect(() => {
    const a = anchor.current;
    anchor.current = null;
    const el = a && toggles.current[a.index];
    if (!a || !el) return;
    const delta = el.getBoundingClientRect().top - a.top;
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
  }, [open]);

  // Tablets and short windows put the stack below the points. A tap there must still
  // show the card it picked, so bring the whole stack on screen if it is not.
  // Measured after the render, once the picked point's line has changed the list height.
  // (A tap on the point that is already active must reveal its card too, hence the count.)
  const reveal = useRef(false);
  const [taps, setTaps] = useState(0);
  const pick = (i: number) => {
    reveal.current = window.innerWidth < 1024;
    setActive(i);
    setTaps((n) => n + 1);
  };
  useLayoutEffect(() => {
    const el = stage.current;
    if (!reveal.current || !el) return;
    reveal.current = false;
    const r = el.getBoundingClientRect();
    if (r.top >= 0 && r.bottom <= window.innerHeight) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: r.height > window.innerHeight ? "start" : "nearest", behavior: reduce ? "instant" : "smooth" });
  }, [active, taps]);

  const hoverable = () => window.matchMedia("(min-width: 1024px) and (hover: hover)").matches;

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const last = REASONS.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i + 1) % REASONS.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i + last) % REASONS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const toggle = (i: number) => {
    const el = toggles.current[i];
    if (el) anchor.current = { index: i, top: el.getBoundingClientRect().top };
    setOpen((o) => (o === i ? null : i));
    setActive(i);
  };

  const onAccordionKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === "ArrowDown" ? i + 1 : e.key === "ArrowUp" ? i - 1 : null;
    if (next === null || next < 0 || next >= REASONS.length) return;
    e.preventDefault();
    toggles.current[next]?.focus();
  };

  return (
    <section
      ref={scope}
      id="why-veda"
      aria-labelledby="why-veda-title"
      className="relative z-10 overflow-clip bg-paper bg-[linear-gradient(color-mix(in_srgb,var(--line)_45%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--line)_45%,transparent)_1px,transparent_1px)] bg-[size:28px_28px] py-16 md:py-20 lg:flex lg:min-h-[100dvh] lg:items-center lg:py-12"
    >
      <div
        className={`${container} grid w-full gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-12 xl:gap-20`}
      >
        {/* Left: heading, intro, the six points. */}
        <div>
          <h2
            id="why-veda-title"
            data-enter
            className="max-w-[12ch] text-balance font-serif text-[clamp(2.4rem,4.2vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.025em]"
          >
            Why parents trust Veda
          </h2>
          <p data-enter className="mt-4 max-w-[30rem] text-pretty text-[1.05rem] leading-relaxed text-muted">
            Every child learns differently. We find what your child needs, teach to that, and keep you in the loop
            every week.
          </p>

          {/* md+: a vertical tab list that drives the card stack. */}
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Why parents trust Veda"
            className="mt-7 hidden md:grid md:grid-cols-2 md:items-start md:gap-x-3 lg:mt-8 lg:max-w-[34rem] lg:grid-cols-1"
          >
            {REASONS.map((r, i) => {
              const on = active === i;
              return (
                <button
                  key={r.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  data-enter
                  type="button"
                  role="tab"
                  id={`why-tab-${r.id}`}
                  aria-selected={on}
                  aria-controls="why-stage"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  onPointerMove={() => !on && hoverable() && setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className="group relative block w-full rounded-[16px] py-2.5 pl-6 pr-4 text-left outline-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 rounded-[16px] bg-tan/70 opacity-0 transition-opacity duration-500 ease-out-soft motion-reduce:transition-none",
                      on ? "opacity-100" : "group-hover:opacity-40",
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-2 top-3.5 bottom-3.5 w-[3px] origin-top rounded-full bg-accent transition-[transform,scale] duration-500 ease-out-soft motion-reduce:transition-none",
                      on ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                  <span
                    className={cn(
                      "relative block origin-left font-serif text-[1.3rem] font-medium leading-snug transition-[transform,scale,color] duration-500 ease-out-soft motion-reduce:transition-none",
                      on ? "scale-[1.07] text-ink" : "text-muted group-hover:text-ink",
                    )}
                  >
                    {r.title}
                  </span>
                  {on && (
                    <span className="rise relative mt-1 block text-pretty text-[0.98rem] leading-relaxed text-ink/80 [--d:60ms]">
                      {r.line}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Phones: an accordion. Each point opens its line and its card beneath it. */}
          <ul className="mt-8 grid [overflow-anchor:none] md:hidden">
            {REASONS.map((r, i) => {
              const on = open === i;
              const Icon = on ? Minus : Plus;
              return (
                <li key={r.id} data-enter className="border-b border-line first:border-t">
                  <h3>
                    <button
                      ref={(el) => {
                        toggles.current[i] = el;
                      }}
                      type="button"
                      id={`why-toggle-${r.id}`}
                      aria-expanded={on}
                      aria-controls={`why-panel-${r.id}`}
                      onClick={() => toggle(i)}
                      onKeyDown={(e) => onAccordionKey(e, i)}
                      className={cn(
                        "flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left font-serif text-[1.3rem] font-medium leading-snug transition-colors duration-300",
                        on ? "text-ink" : "text-muted",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-6 w-[3px] origin-center rounded-full bg-accent transition-[transform,scale] duration-500 ease-out-soft motion-reduce:transition-none",
                            on ? "scale-y-100" : "scale-y-0",
                          )}
                        />
                        {r.title}
                      </span>
                      <Icon aria-hidden="true" weight="light" className="size-5 shrink-0" />
                    </button>
                  </h3>
                  <div
                    id={`why-panel-${r.id}`}
                    role="region"
                    aria-labelledby={`why-toggle-${r.id}`}
                    hidden={!on}
                    className="pb-6"
                  >
                    <p className="rise text-pretty text-base leading-relaxed text-ink/80">{r.line}</p>
                    <Card reason={r} className="rise mt-5 [--d:80ms] [&>div]:aspect-[4/5]" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* md+: the card stack. */}
        <div
          ref={stage}
          data-enter
          className="relative mx-auto hidden scroll-my-6 w-[min(100%,29rem)] md:block lg:w-[min(100%,calc((100dvh-7rem)*0.8*1.12),35.84rem)]"
        >
          {/* Background shapes, inside the stack's own box. */}
          <span
            aria-hidden="true"
            className="absolute -left-[7%] -top-[5%] aspect-square w-[46%] rounded-full bg-tan"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-[3%] right-[1%] aspect-square w-[15%] rounded-[16px] bg-accent/25"
          />
          <div
            id="why-stage"
            role="tabpanel"
            aria-labelledby={`why-tab-${REASONS[active].id}`}
            className="relative isolate aspect-[4/5] w-[calc(100%/1.12)]"
          >
            {REASONS.map((r, i) => {
              const p = (i - active + REASONS.length) % REASONS.length;
              const front = p === 0;
              return (
                <div
                  key={r.id}
                  aria-hidden={!front}
                  onClick={front ? undefined : () => setActive(i)}
                  className={cn(
                    "group absolute inset-0 origin-right transition-[transform,opacity,visibility] duration-[600ms] ease-out-soft motion-reduce:transition-none",
                    !front && "cursor-pointer",
                  )}
                  style={pose(p)}
                >
                  <Card reason={r} className="h-full" />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-[24px] bg-paper transition-opacity duration-[600ms] ease-out-soft motion-reduce:transition-none",
                      !front && "group-hover:!opacity-10",
                    )}
                    style={{ opacity: VEIL[Math.min(p, 2)] }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
