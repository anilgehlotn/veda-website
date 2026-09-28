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
      {/* Brown block: the वेद mark over the classroom photo slot. */}
      <div className="relative order-2 flex min-h-[420px] flex-col justify-end overflow-hidden bg-block px-4 pb-8 pt-16 text-on-block sm:min-h-[520px] sm:px-8 sm:pb-10 lg:order-1 lg:min-h-0 lg:px-12 lg:pb-14 xl:px-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_10%,var(--block-2)_0%,transparent_60%)]"
        />

        {/* Photo slot. Swap for a real photo (object-cover, mix-blend-luminosity, ~35% opacity). */}
        <div className="absolute inset-4 flex items-start justify-end rounded-[6px] border border-dashed border-on-block/25 p-4 sm:inset-6 lg:inset-x-8 lg:bottom-8 lg:top-24 xl:inset-x-10">
          <p className="max-w-[16rem] text-right text-sm leading-snug text-on-block/60">
            [Photo: students in a Veda classroom]
          </p>
        </div>

        <div data-exit className="relative origin-bottom-left">
          <p
            lang="sa"
            className="ink-wipe -ml-1 font-deva text-[clamp(8.5rem,46vw,11rem)] leading-[1.15] text-accent sm:text-[15rem] md:text-[17rem] lg:text-[clamp(11rem,23vw,24rem)]"
          >
            वेद
          </p>
          <p className="rise mt-2 text-base text-on-block/85 [--d:900ms] sm:text-lg">
            Veda is Sanskrit for <span className="font-serif text-xl italic sm:text-2xl">knowledge</span>.
          </p>
        </div>
      </div>

      {/* Paper side: what Veda is and the one call to action. */}
      <div className="order-1 flex flex-col justify-center px-4 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-12 lg:order-2 lg:px-12 lg:pb-16 lg:pt-28 xl:px-16 2xl:px-24">
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
