import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollMotion } from "@/components/scroll-motion";
import { ClosingCta, ForParents, MaskLine, WeeklyLoop, container } from "@/components/sections";
import { DEMO_CTA } from "@/lib/site";
import {
  BATCH_DETAILS,
  COURSES,
  EXAM_PREP,
  SYLLABUS_NOTE,
  WEEK_STEPS,
  getCourse,
  type Course,
} from "@/lib/courses";

export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

const pageTitle = (c: Course) => (c.kind === "exam" ? `${c.title} preparation` : c.title);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCourse((await params).slug);
  if (!c) return {};
  return { title: `${pageTitle(c)} | Veda`, description: c.summary };
}

// Page-load sequence (CSS, see globals.css): visible without JS.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function CoursePage({ params }: Props) {
  const c = getCourse((await params).slug);
  if (!c) notFound();

  return (
    <>
      <div className={`tone-${c.tone} bg-tone-bg text-tone-fg`}>
        <SiteHeader variant="plain" onTone />
        <CourseHero course={c} />
      </div>
      <ScrollMotion>
        <main id="main">
          <Overview course={c} />
          <Syllabus course={c} />
          {c.exam && <ExamSection course={c} />}
          <section aria-labelledby="week-title" className={`${container} py-20 sm:py-28`}>
            <div data-reveal="">
              <h2
                id="week-title"
                className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em]"
              >
                <MaskLine>How a week works</MaskLine>
              </h2>
              <p data-part className="mt-5 max-w-[38rem] text-pretty text-lg leading-relaxed text-muted">
                The same cycle every week, so weak topics are found and fixed while they are still small.
              </p>
            </div>
            <div className="mt-14 sm:mt-20">
              <WeeklyLoop steps={WEEK_STEPS} />
            </div>
            <div className="mt-20 sm:mt-28">
              <ForParents heading="What parents get" />
            </div>
          </section>
          <Faqs course={c} />
          <OtherPrograms current={c} />
          <ClosingCta context={c.title} />
        </main>
      </ScrollMotion>
      <SiteFooter />
    </>
  );
}

function CourseHero({ course: c }: { course: Course }) {
  const exam = c.kind === "exam";
  return (
    <section aria-labelledby="course-title" className={`${container} pb-16 pt-6 sm:pb-20 lg:pb-24`}>
      <nav aria-label="Breadcrumb" className="rise" style={delay(0)}>
        <ol className="flex flex-wrap items-center gap-2 text-[0.95rem] text-tone-muted">
          <li>
            <Link href="/" className="group inline-flex items-center gap-1.5 hover:text-tone-fg">
              <ArrowLeft
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-500 ease-out-soft group-hover:-translate-x-0.5"
              />
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/programs" className="hover:text-tone-fg">
              Programs
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-tone-fg">
            {c.title}
          </li>
        </ol>
      </nav>

      <div className="mt-10 grid gap-x-12 gap-y-14 sm:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p
            aria-hidden="true"
            className={`rise font-serif font-medium leading-[0.8] tracking-[-0.04em] ${
              exam ? "pb-[0.12em] text-[clamp(5.5rem,17vw,12rem)]" : "text-[clamp(7.5rem,22vw,15rem)]"
            }`}
            style={delay(80)}
          >
            {c.mark}
            {!exam && <span className="ml-1 align-top text-[0.2em] tracking-normal text-tone-muted">th</span>}
            {c.deva && (
              <span lang="hi" className="ml-4 align-top font-deva-num text-[0.24em] text-tone-muted">
                {c.deva}
              </span>
            )}
          </p>
          <p className="rise mt-8 text-[0.95rem] font-medium text-tone-muted" style={delay(180)}>
            {c.kicker}
          </p>
          <h1
            id="course-title"
            className="mt-2 font-serif text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em]"
          >
            <span className="line-mask block overflow-hidden pb-[0.06em]">
              <span style={delay(240)}>{pageTitle(c)}</span>
            </span>
          </h1>
          <p className="rise mt-5 max-w-[34rem] text-pretty text-lg leading-relaxed sm:text-xl" style={delay(360)}>
            {c.summary}
          </p>
          <div className="rise mt-9" style={delay(460)}>
            <a
              href={DEMO_CTA.href}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-[6px] bg-tone-fg px-7 py-4 text-base font-medium text-tone-bg transition-[opacity,transform,translate,scale] duration-300 ease-out-soft hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0 active:scale-[0.98] sm:w-auto"
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

        <div id="batch-details" className="rise lg:col-span-4 lg:col-start-9 lg:self-end" style={delay(560)}>
          <h2 className="text-[0.95rem] font-medium text-tone-muted">Batch details</h2>
          <dl className="mt-4 border-t border-tone-line">
            {BATCH_DETAILS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-tone-line py-3.5">
                <dt className="text-tone-muted">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Overview({ course: c }: { course: Course }) {
  return (
    <section aria-label="Overview" className={`${container} pt-20 sm:pt-28`}>
      <div data-reveal="" className="grid gap-x-16 gap-y-12 border-b border-line pb-20 sm:pb-28 md:grid-cols-2">
        <div data-part>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">Who it is for</h2>
          <p className="mt-5 max-w-[34rem] text-pretty text-lg leading-relaxed text-muted">{c.overview.who}</p>
        </div>
        <div data-part>
          <h2 className="font-serif text-3xl font-medium sm:text-4xl">What it covers</h2>
          <p className="mt-5 max-w-[34rem] text-pretty text-lg leading-relaxed text-muted">{c.overview.covers}</p>
        </div>
      </div>
    </section>
  );
}

function Syllabus({ course: c }: { course: Course }) {
  return (
    <section aria-labelledby="syllabus-title" className={`${container} py-20 sm:py-28`}>
      <div data-reveal="">
        <h2
          id="syllabus-title"
          className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em]"
        >
          <MaskLine>Subjects and syllabus</MaskLine>
        </h2>
        <p data-part className="mt-6 font-serif text-2xl leading-snug sm:text-3xl">
          {c.subjects.join(", ")}
        </p>
        <p data-part className="mt-5 flex items-start gap-2 text-[0.95rem] text-muted">
          <Info size={18} weight="light" aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>
            The main units in each subject. {SYLLABUS_NOTE}
          </span>
        </p>
      </div>

      <div className="mt-14 grid gap-y-12 sm:mt-16">
        {c.syllabus.map((s) => (
          <div key={s.subject} data-reveal="" className="grid gap-x-12 gap-y-5 border-t border-line pt-8 lg:grid-cols-12">
            <h3 data-part className="font-serif text-3xl font-medium lg:col-span-3">
              {s.subject}
            </h3>
            <ul data-part className="grid gap-x-12 sm:grid-cols-2 lg:col-span-9">
              {s.units.map((u) => (
                <li key={u} className="border-b border-line/70 py-3 text-lg">
                  {u}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExamSection({ course: c }: { course: Course }) {
  const exam = c.exam!;
  return (
    <section aria-labelledby="exam-title" className="bg-block text-on-block">
      <div className={`${container} py-20 sm:py-28`}>
        <div data-reveal="" className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2
              id="exam-title"
              className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em]"
            >
              <MaskLine>The {exam.name} exam</MaskLine>
            </h2>
            <p data-part className="mt-5 max-w-[26rem] text-pretty text-lg leading-relaxed text-on-block/80">
              What the exam looks like, so there are no surprises on the day.
            </p>
            <p data-part className="mt-6 flex items-start gap-2 text-[0.95rem] text-on-block/65">
              <Info size={18} weight="light" aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>{exam.source}</span>
            </p>
          </div>
          <dl data-part className="border-t border-on-block/15 lg:col-span-7">
            {exam.rows.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-on-block/15 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-on-block/65">{k}</dt>
                <dd className="text-lg">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal="" className="mt-20 sm:mt-28">
          <h3 data-part className="font-serif text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-tight">
            How Veda prepares students for {c.title}
          </h3>
          <ol className="mt-10 grid gap-x-16 md:grid-cols-2">
            {EXAM_PREP(c.title).map((p) => (
              <li key={p.title} data-part className="border-t border-on-block/15 py-7">
                <p className="font-serif text-2xl font-medium sm:text-[1.7rem]">{p.title}</p>
                <p className="mt-2 max-w-[30rem] text-pretty leading-relaxed text-on-block/75">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Faqs({ course: c }: { course: Course }) {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line">
      <div className={`${container} py-20 sm:py-28`}>
        <div data-reveal="">
          <h2
            id="faq-title"
            className="font-serif text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1.04] tracking-[-0.02em]"
          >
            <MaskLine>Questions parents ask</MaskLine>
          </h2>
        </div>
        <dl data-reveal="" className="mt-12">
          {c.faqs.map((f) => (
            <div
              key={f.q}
              data-part
              className="grid gap-x-12 gap-y-3 border-t border-line py-7 last:border-b md:grid-cols-12"
            >
              <dt className="font-serif text-[1.45rem] font-medium leading-snug md:col-span-5">{f.q}</dt>
              <dd className="max-w-[40rem] text-pretty text-lg leading-relaxed text-muted md:col-span-7">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function OtherPrograms({ current }: { current: Course }) {
  const others = COURSES.filter((c) => c.slug !== current.slug);
  return (
    <section aria-labelledby="others-title" className="border-t border-line">
      <div data-reveal="" className={`${container} py-16 sm:py-20`}>
        <div data-part className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="others-title" className="font-serif text-3xl font-medium sm:text-4xl">
            Other programs
          </h2>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-medium underline decoration-ink/25 underline-offset-[7px] hover:decoration-ink"
          >
            <ArrowLeft
              size={16}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-500 ease-out-soft group-hover:-translate-x-1"
            />
            Back to home
          </Link>
        </div>
        <ul data-part className="mt-8 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o) => (
            <li key={o.slug} className="border-b border-line">
              <Link
                href={`/programs/${o.slug}`}
                className="group flex items-center justify-between gap-4 py-5 pr-4 transition-colors duration-500 hover:bg-ink/[0.035] sm:px-4"
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`tone-${o.tone} size-4 rounded-[3px] bg-tone-bg ring-1 ring-inset ring-ink/15`}
                  />
                  <span className="font-serif text-xl font-medium">{o.title}</span>
                </span>
                <ArrowRight
                  size={17}
                  weight="bold"
                  aria-hidden="true"
                  className="text-accent transition-transform duration-500 ease-out-soft group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
          <li className="border-b border-line">
            <Link
              href="/programs"
              className="group flex items-center justify-between gap-4 py-5 pr-4 transition-colors duration-500 hover:bg-ink/[0.035] sm:px-4"
            >
              <span className="font-serif text-xl font-medium">Compare all programs</span>
              <ArrowRight
                size={17}
                weight="bold"
                aria-hidden="true"
                className="text-accent transition-transform duration-500 ease-out-soft group-hover:translate-x-1"
              />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
