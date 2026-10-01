import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DEMO_CTA } from "@/lib/site";

const headline = ["A test every week.", "AI finds the weak topics.", "Teachers focus on them."];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid lg:min-h-[100svh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      {/* The hero scrolls normally. Its content drifts and fades as the Programs section scrolls over it ([data-exit]). */}
      {/* Brown block: the classroom photo, with वेद and its meaning set over it. Above the text on phones. */}
      <div className="relative h-[clamp(22rem,56svh,30rem)] overflow-hidden bg-block text-on-block sm:h-[34rem] lg:h-auto">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_10%,var(--block-2)_0%,transparent_70%)]"
        />

        {/* Fixed frame: its size comes from the layout, never from the image, so nothing shifts while it loads.
            container-type lets वेद scale with the frame on every screen. */}
        <div
          data-exit
          className="absolute inset-4 overflow-hidden rounded-[18px] border border-dashed border-on-block/15 bg-block [container-type:size] sm:inset-6 lg:inset-8 lg:top-24"
        >
          <Image
            src="/hero/classroom.jpg"
            alt="Students writing their weekly test in a Veda classroom"
            fill
            preload
            fetchPriority="high"
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover object-[50%_40%] lg:object-center"
          />
          {/* Warm, dark sepia wash so the photo sits quietly in the brown block; darker towards the
              bottom (where the caption sits, for AA contrast) and the left. */}
          <div aria-hidden="true" className="absolute inset-0 bg-block/[0.62]" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-block/80 from-0% to-block/0 to-45%" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-block/35 to-block/0 to-60%" />

          {/* Anchored bottom-left. On big frames it overhangs the bottom edge (the lowest stroke, the
              tail of द, sits about 0.26em above the line box's bottom); on smaller frames, where the
              caption is wide next to the glyph, it lifts so that stroke clears the caption by 8px. */}
          <p
            lang="sa"
            className="ink-wipe absolute bottom-[calc(2.5rem-0.26em)] -left-[0.06em] [@container(min-width:29rem)_and_(min-height:43rem)]:-bottom-[0.22em] font-deva-hero text-[min(71cqw,48cqh)] font-bold leading-none text-accent"
          >
            वेद
          </p>
          <p className="rise absolute bottom-3 left-4 text-sm text-on-block/85 [--d:900ms]">
            Veda is Sanskrit for <em className="font-serif italic text-on-block">knowledge.</em>
          </p>
        </div>
      </div>

      {/* Paper side: what Veda is and the one call to action. */}
      <div className="flex flex-col justify-center px-4 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12 lg:pb-16 lg:pt-28 xl:px-16 2xl:px-24">
        <div data-exit className="origin-top-left">
          <p className="rise text-[0.95rem] font-medium text-muted [--d:100ms]">
            <span className="block sm:inline">Coaching for Grades 8 to 12</span>
            <span aria-hidden="true" className="mx-2 hidden text-line sm:inline">
              |
            </span>
            <span className="block sm:inline">Boards, NEET, JEE, KCET</span>
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-serif text-[clamp(1.85rem,8.4vw,2.6rem)] font-medium leading-[1.06] tracking-[-0.02em] sm:text-[3.6rem] lg:text-[clamp(2.9rem,4.9vw,5rem)]"
          >
            {headline.map((line, i) => (
              <span key={line} className="line-mask block overflow-hidden pb-[0.06em]">
                <span style={{ ["--d" as string]: `${250 + i * 120}ms` }}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="rise mt-7 max-w-[36rem] text-pretty text-lg leading-relaxed text-muted [--d:700ms] sm:text-xl sm:leading-relaxed">
            So every student gets personal attention. Parents get a WhatsApp message at check-in and
            check-out, and a report every week.
          </p>

          <div className="rise mt-10 [--d:850ms]">
            <a
              href={DEMO_CTA.href}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-[6px] bg-btn px-7 py-4 text-base font-medium text-on-btn transition-[background-color,transform,translate,scale] duration-300 ease-out-soft hover:bg-btn-hover active:scale-[0.98] sm:w-auto"
            >
              {DEMO_CTA.label}
              <ArrowRight
                size={18}
                weight="bold"
                aria-hidden="true"
                className="text-accent transition-transform duration-300 ease-out-soft group-hover:translate-x-1 dark:text-on-btn"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
