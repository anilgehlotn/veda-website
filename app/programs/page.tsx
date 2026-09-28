import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/site-header";
import { ScrollMotion } from "@/components/scroll-motion";
import { SiteFooter } from "@/components/site-footer";
import { ClosingCta, ForParents, WeeklyLoop, container } from "@/components/sections";
import { DEMO_CTA } from "@/lib/site";
import {
  EXAMS,
  PROGRAM_DETAILS,
  SCHOOL_PROGRAMS,
  WEEKLY_LOOP,
  type SchoolProgram,
} from "@/lib/programs";

export const metadata: Metadata = {
  title: "Programs | Veda",
  description:
    "Veda programs for 8th, 9th, 10th, 11th and 12th Standard, and for JEE, NEET and KCET. Every program follows the school syllabus and uses Veda's weekly AI-checked test.",
};

// Load-sequence helpers (CSS, see globals.css): content is visible without JS.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function ProgramsPage() {
  return (
    <>
      <SiteHeader variant="plain" />
      <ScrollMotion>
        <main id="main">
          <Intro />
          <section aria-labelledby="school-programs" className={`${container} pb-4`}>
            <h2 id="school-programs" className="sr-only">
              School programs, 8th to 12th Standard
            </h2>
            {SCHOOL_PROGRAMS.map((p, i) => (
              <ProgramRow key={p.id} program={p} first={i === 0} last={i === SCHOOL_PROGRAMS.length - 1} />
            ))}
          </section>
          <Competitive />
          <EveryProgram />
          <ClosingCta />
        </main>
      </ScrollMotion>
      <SiteFooter />
    </>
  );
}

function Intro() {
  const jumps = [
    ...SCHOOL_PROGRAMS.map((p) => ({ href: `#${p.id}`, grade: p.grade, label: p.title })),
    { href: "#competitive", grade: null, label: "JEE, NEET, KCET" },
  ];

  return (
    <section aria-labelledby="page-title" className={`${container} pb-14 pt-10 sm:pb-20 sm:pt-16 lg:pt-20`}>
      <h1
        id="page-title"
        className="max-w-5xl font-serif text-[clamp(2.3rem,6.4vw,5.4rem)] font-medium leading-[1.04] tracking-[-0.02em]"
      >
        <span className="line-mask block overflow-hidden pb-[0.06em]">
          <span className="text-balance" style={delay(100)}>Programs for Grades 8 to 12,</span>
        </span>
        <span className="line-mask block overflow-hidden pb-[0.06em]">
          <span className="text-balance" style={delay(220)}>and for JEE, NEET and KCET.</span>
        </span>
      </h1>

      <p
        className="rise mt-7 max-w-[40rem] text-pretty text-lg leading-relaxed text-muted sm:text-xl sm:leading-relaxed"
        style={delay(420)}
      >
        Every program follows the school syllabus and uses Veda&rsquo;s weekly test. AI checks each
        test and finds the weak topics, and teachers focus the next week&rsquo;s classes on them.
      </p>

      <nav aria-label="Jump to a program" className="rise mt-12 sm:mt-16" style={delay(560)}>
        <p className="text-[0.95rem] font-medium text-muted">Find your child&rsquo;s class</p>
        <ul className="mt-4 grid grid-cols-3 border-y border-line sm:grid-cols-6">
          {jumps.map((j, i) => (
            <li
              key={j.href}
              className={`border-line ${i % 3 !== 0 ? "border-l" : ""} ${i >= 3 ? "border-t sm:border-t-0" : ""} ${
                i === 3 ? "sm:border-l" : ""
              }`}
            >
              <a
                href={j.href}
                aria-label={j.label}
                className="group flex h-full min-h-24 flex-col justify-center px-3 py-4 transition-colors duration-500 ease-out-soft hover:bg-ink/[0.04] sm:px-5"
              >
                {j.grade ? (
                  <span className="font-serif text-[2.6rem] leading-none tracking-tight transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5 sm:text-5xl">
                    {j.grade}
                    <span className="ml-0.5 align-super text-base text-muted">th</span>
                  </span>
                ) : (
                  <span className="font-serif text-xl leading-tight transition-transform duration-500 ease-out-soft group-hover:-translate-y-0.5 sm:text-2xl">
                    JEE, NEET, KCET
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function ProgramRow({ program: p, first, last }: { program: SchoolProgram; first: boolean; last: boolean }) {
  // The first program is part of the page-load sequence (CSS); the rest reveal on scroll (GSAP).
  let step = 0;
  const part = () => {
    const i = step++;
    return first
      ? { className: "rise", style: delay(700 + i * 90) }
      : { "data-part": "", className: "", style: undefined };
  };

  const numeral = part();
  const stream = part();
  const focus = part();
  const subjects = part();
  const details = part();
  const cta = part();

  return (
    <article
      id={p.id}
      aria-labelledby={`${p.id}-title`}
      data-reveal={first ? undefined : ""}
      className={`group relative isolate grid scroll-mt-6 grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-7 border-line py-12 before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:bg-ink/[0.035] before:opacity-0 before:transition-opacity before:duration-700 hover:before:opacity-100 sm:before:-inset-x-8 lg:grid-cols-12 lg:py-16 lg:before:-inset-x-12 ${
        first ? "" : "border-t"
      } ${last ? "border-b" : ""} lg:gap-x-10`}
    >
      <div
        {...numeral}
        aria-hidden="true"
        className={`${numeral.className} col-start-2 row-start-1 text-right font-serif text-[5rem] font-medium leading-[0.8] tracking-[-0.04em] text-line transition-colors duration-700 ease-out-soft group-hover:text-accent sm:text-[7rem] lg:col-span-3 lg:col-start-1 lg:text-left lg:text-[10.5rem]`}
      >
        <span data-parallax className="block">
          {p.grade}
        </span>
      </div>

      <div className="col-start-1 row-start-1 lg:col-span-5 lg:col-start-4">
        <p {...stream} className={`${stream.className} text-[0.95rem] font-medium text-muted`}>
          {p.stream}
        </p>
        <h3
          id={`${p.id}-title`}
          className="mt-2 font-serif text-[2.4rem] font-medium leading-[1.05] tracking-[-0.015em] sm:text-5xl"
        >
          <span className={`${first ? "line-mask " : ""}block overflow-hidden pb-[0.08em]`}>
            <span data-mask={first ? undefined : ""} className="block" style={first ? delay(760) : undefined}>
              {p.title}
            </span>
          </span>
        </h3>
        <p {...focus} className={`${focus.className} mt-4 max-w-[30rem] text-pretty text-lg leading-relaxed`}>
          {p.focus}
        </p>
        <p {...subjects} className={`${subjects.className} mt-5 text-pretty leading-relaxed text-muted`}>
          <span className="font-medium text-ink">Subjects: </span>
          {p.subjects}
        </p>
      </div>

      <div className="col-span-2 flex flex-col gap-7 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:pt-8">
        <div {...details} className={details.className}>
          <Details />
        </div>
        <div {...cta} className={`${cta.className} flex flex-wrap items-center gap-x-8 gap-y-3`}>
          <InlineCta label={p.title} />
          <Link
            href={`/programs/${p.grade}th`}
            className="text-base font-medium text-muted underline decoration-transparent underline-offset-[7px] transition-colors duration-500 hover:text-ink hover:decoration-ink/40"
          >
            Full course details
          </Link>
        </div>
      </div>
    </article>
  );
}

function Details({ tone = "paper" }: { tone?: "paper" | "block" }) {
  const label = tone === "paper" ? "text-muted" : "text-on-block/65";
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
      {PROGRAM_DETAILS.map((d) => (
        <div key={d.label}>
          <dt className={`text-sm ${label}`}>{d.label}</dt>
          <dd className="mt-0.5 text-[0.95rem] font-medium">{d.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function InlineCta({ label }: { label: string }) {
  return (
    <a
      href={DEMO_CTA.href}
      aria-label={`${DEMO_CTA.label}, ${label}`}
      className="group/cta inline-flex items-center gap-2.5 text-base font-medium underline decoration-ink/25 decoration-1 underline-offset-[7px] transition-[text-decoration-color] duration-500 hover:decoration-ink"
    >
      {DEMO_CTA.label}
      <ArrowRight
        size={17}
        weight="bold"
        aria-hidden="true"
        className="text-accent transition-transform duration-500 ease-out-soft group-hover:translate-x-1 group-hover/cta:translate-x-1.5"
      />
    </a>
  );
}

function Competitive() {
  return (
    <section
      id="competitive"
      aria-labelledby="competitive-title"
      data-reveal=""
      className="mt-20 scroll-mt-6 bg-block text-on-block sm:mt-28"
    >
      <div className={`${container} grid gap-x-12 gap-y-14 py-20 lg:grid-cols-12 lg:py-28`}>
        <div className="lg:col-span-5">
          <p data-part className="text-[0.95rem] font-medium text-on-block/70">
            For 11th and 12th students
          </p>
          <h2
            id="competitive-title"
            className="mt-3 font-serif text-[clamp(2.8rem,7vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.02em]"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-mask className="block">
                JEE, NEET
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-mask className="block">
                and KCET
              </span>
            </span>
          </h2>
          <p data-part className="mt-6 max-w-[30rem] text-pretty text-lg leading-relaxed text-on-block/85">
            Alongside their board preparation: practice in the real exam pattern, mock tests, and AI
            tracking of weak chapters.
          </p>
          <div data-part className="mt-10">
            <Details tone="block" />
          </div>
          <div data-part className="mt-10">
            <a
              href={DEMO_CTA.href}
              aria-label={`${DEMO_CTA.label}, JEE, NEET and KCET`}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-[6px] bg-accent px-7 py-4 text-base font-medium text-block transition-[background-color,transform,translate,scale] duration-300 ease-out-soft hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0 active:scale-[0.98] sm:w-auto"
            >
              {DEMO_CTA.label}
              <ArrowRight
                size={18}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        <ul className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          {EXAMS.map((e) => (
            <li
              key={e.name}
              data-part
              className="grid grid-cols-[7.5rem_1fr] items-baseline gap-x-5 border-t border-on-block/15 py-7 last:border-b sm:grid-cols-[11.5rem_1fr] sm:gap-x-8 lg:py-9"
            >
              <span className="font-serif text-[2.6rem] font-medium leading-none tracking-tight sm:text-6xl">
                {e.name}
              </span>
              <span>
                <span className="block text-lg">{e.purpose}</span>
                <span className="mt-1 block text-on-block/70">{e.subjects}</span>
                <Link
                  href={`/programs/${e.name.toLowerCase()}`}
                  className="group/link mt-3 inline-flex items-center gap-2 text-[0.95rem] font-medium underline decoration-on-block/30 underline-offset-[6px] transition-colors hover:decoration-on-block"
                >
                  {e.name} course details
                  <ArrowRight size={15} weight="bold" aria-hidden="true" className="text-accent transition-transform duration-500 ease-out-soft group-hover/link:translate-x-1" />
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function EveryProgram() {
  return (
    <section
      id="every-program"
      aria-labelledby="every-program-title"
      className={`${container} py-20 sm:py-28 lg:py-32`}
    >
      <div data-reveal="">
        <h2
          id="every-program-title"
          className="font-serif text-[clamp(2.3rem,5.4vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.02em]"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-mask className="block">
              What every program includes
            </span>
          </span>
        </h2>
        <p data-part className="mt-5 max-w-[38rem] text-pretty text-lg leading-relaxed text-muted sm:text-xl">
          The same weekly system runs in every class, so no student&rsquo;s weak topic goes unnoticed.
        </p>
      </div>

      <div className="mt-14 sm:mt-20">
        <WeeklyLoop steps={WEEKLY_LOOP} />
      </div>

      <div className="mt-20 sm:mt-28">
        <ForParents />
      </div>
    </section>
  );
}
