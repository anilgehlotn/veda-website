import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { COURSES } from "@/lib/courses";
import { ProgramCard } from "./program-card";
import { MaskLine, container } from "./sections";

/*
  Home Programs section. It sits above the hero (z-10) with a soft brown shadow on its
  top edge; as the hero content drifts and fades behind it, the hand-off reads as a
  sheet sliding over the hero. The section itself is never moved by the animation.

  The five grade cards sit in one static row that fits the page on desktop; the
  hovered or focused card grows and the others make room (.program-row in
  globals.css). On phones and tablets the same list is a row you swipe by hand.
*/

const GRADES = COURSES.filter((c) => c.kind === "board");
export function HomePrograms() {
  return (
    <section
      id="programs"
      aria-labelledby="programs-title"
      className="relative z-10 scroll-mt-6 bg-paper pb-24 shadow-[0_-40px_80px_-40px_rgb(43_27_18/0.5)] sm:pb-32"
    >
      <div data-reveal="" className={`${container} pt-20 sm:pt-24 lg:pt-28`}>
        <h2
          id="programs-title"
          className="max-w-4xl font-serif text-[clamp(2.4rem,5.6vw,4.8rem)] font-medium leading-[1.04] tracking-[-0.02em]"
        >
          <MaskLine>Programs for every year,</MaskLine>
          <MaskLine>from 8th to 12th.</MaskLine>
        </h2>
        <p data-part className="mt-6 max-w-[36rem] text-pretty text-lg leading-relaxed text-muted sm:text-xl">
          And coaching for JEE, NEET and KCET. Every program follows the school syllabus and runs on the
          weekly AI test.
        </p>
        <div data-part className="mt-8">
          <Link
            href="/programs"
            className="group inline-flex items-center gap-2.5 font-medium underline decoration-ink/25 underline-offset-[7px] transition-[text-decoration-color] duration-500 hover:decoration-ink"
          >
            Compare all programs
            <ArrowRight
              size={17}
              weight="bold"
              aria-hidden="true"
              className="text-accent transition-transform duration-500 ease-out-soft group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      <div data-reveal="" className="mt-12 sm:mt-16 lg:mx-auto lg:max-w-[1400px] lg:px-12">
        <ul
          aria-label="Programs for 8th to 12th Standard"
          className="program-row flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] sm:scroll-px-8 sm:gap-5 sm:px-8 lg:gap-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {GRADES.map((c) => (
            <li
              key={c.slug}
              data-part
              className="w-[16.5rem] shrink-0 snap-start sm:w-[18.5rem] lg:w-auto lg:snap-align-none"
            >
              <ProgramCard course={c} fluid />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
