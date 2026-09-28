import { ArrowRight, ArrowsClockwise, FileText, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { DEMO_CTA } from "@/lib/site";

/*
  Sections shared by /programs and the course pages. Server components; the
  data attributes are picked up by <ScrollMotion>.
*/

export const container = "mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12";

export function MaskLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <span data-mask className="block">
        {children}
      </span>
    </span>
  );
}

const loopCols: Record<number, string> = { 4: "md:grid-cols-4", 5: "md:grid-cols-5" };

/** The weekly loop. Each step appears, then the segment to the next step draws. */
export function WeeklyLoop({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <div data-loop>
      <ol className={`grid ${loopCols[steps.length] ?? "md:grid-cols-4"}`}>
        {steps.map((s, i) => (
          <li key={s.title} data-loop-step className="relative pb-10 pl-10 md:pb-0 md:pl-0 md:pr-8">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-[5px] size-[15px] rounded-full border-2 md:static md:block ${
                i === steps.length - 1 ? "border-accent bg-accent" : "border-ink bg-paper"
              }`}
            />
            {i < steps.length - 1 && (
              <span
                data-loop-seg
                aria-hidden="true"
                className="absolute bottom-0 left-[7px] top-[26px] w-px origin-top bg-ink/35 md:bottom-auto md:left-[23px] md:right-2 md:top-[7px] md:h-px md:w-auto md:origin-left"
              />
            )}
            <h3 className="font-serif text-2xl font-medium leading-tight md:mt-6 lg:text-[1.75rem]">{s.title}</h3>
            <p className="mt-2 max-w-[18rem] text-pretty leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
      <p data-loop-note className="mt-2 flex items-center gap-2.5 text-[0.95rem] font-medium text-muted md:mt-12">
        <ArrowsClockwise size={20} weight="light" aria-hidden="true" className="text-ink" />
        Then it starts again, every week.
      </p>
    </div>
  );
}

/** What parents get: attendance alerts and the weekly report. */
export function ForParents({ heading = "For parents" }: { heading?: string }) {
  return (
    <div data-reveal="">
      <h3 data-part className="text-[0.95rem] font-medium text-muted">
        {heading}
      </h3>
      <div className="mt-5 grid border-t border-line md:grid-cols-2">
        <div data-part className="border-b border-line py-8 md:border-b-0 md:border-r md:py-10 md:pr-12">
          <WhatsappLogo size={30} weight="light" aria-hidden="true" />
          <p className="mt-5 max-w-[26rem] font-serif text-[1.9rem] font-medium leading-[1.12] sm:text-4xl">
            A WhatsApp message at check-in and check-out
          </p>
          <p className="mt-4 max-w-[28rem] text-pretty leading-relaxed text-muted">
            Biometric attendance at the institute. You know when your child arrives and when they leave.
          </p>
        </div>
        <div data-part className="py-8 md:py-10 md:pl-12">
          <FileText size={30} weight="light" aria-hidden="true" />
          <p className="mt-5 max-w-[26rem] font-serif text-[1.9rem] font-medium leading-[1.12] sm:text-4xl">
            A report every week
          </p>
          <p className="mt-4 max-w-[28rem] text-pretty leading-relaxed text-muted">
            Attendance percentage, the test report, and the topics covered that week.
          </p>
        </div>
      </div>
    </div>
  );
}

/** The closing "Book a free demo class" block. */
export function ClosingCta({ context }: { context?: string }) {
  return (
    <section
      id="book-demo"
      aria-labelledby="closing-title"
      data-closing=""
      className="relative isolate scroll-mt-6 overflow-hidden bg-block text-on-block"
    >
      <p
        lang="sa"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.12em] right-4 -z-10 font-deva text-[clamp(8rem,24vw,22rem)] leading-none text-accent/90 sm:right-8 lg:right-12"
      >
        <span data-parallax className="block">
          वेद
        </span>
      </p>

      <div className={`${container} py-24 sm:py-28 lg:py-36`}>
        <h2
          id="closing-title"
          className="max-w-3xl font-serif text-[clamp(2.5rem,6vw,5.2rem)] font-medium leading-[1.04] tracking-[-0.02em]"
        >
          <MaskLine>Come and see a class</MaskLine>
          <MaskLine>before you decide.</MaskLine>
        </h2>
        <p data-part className="mt-6 max-w-[30rem] text-pretty text-lg leading-relaxed text-on-block/85 sm:text-xl">
          Your child attends a real Veda {context ? `${context} ` : ""}class for free. Then you choose the program.
        </p>
        <div data-cta className="mt-10">
          <a
            href={DEMO_CTA.href}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-[6px] bg-accent px-8 py-[1.1rem] text-lg font-medium text-block transition-[background-color,transform,translate,scale] duration-300 ease-out-soft hover:-translate-y-0.5 hover:bg-accent-hover active:translate-y-0 active:scale-[0.98] sm:w-auto"
          >
            {DEMO_CTA.label}
            <ArrowRight
              size={20}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
            />
          </a>
        </div>
        <dl data-part className="mt-12 grid max-w-xl gap-x-10 gap-y-4 text-[0.95rem] sm:grid-cols-3">
          {[
            ["Call", "[Phone number]"],
            ["WhatsApp", "[WhatsApp number]"],
            ["Visit", "[Address]"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-on-block/65">{k}</dt>
              <dd className="mt-0.5 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
