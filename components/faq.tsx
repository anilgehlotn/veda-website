"use client";

import * as React from "react";
import { useId, useRef, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { ArrowRight, Plus, WhatsappLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { CONTACT, DEMO_CTA } from "@/lib/site";
import { FAQ_TOPICS, type Faq } from "@/data/faq";

/*
  Parents' questions, inside the dark closing chapter (Results, FAQ, Contact, footer).
  Same espresso brown, no seam: it opens the chapter with the rounded top edge only
  when there is no Results section above it.

  Topics are tabs; the questions of the selected topic expand inline, one at a time.
  All four topic panels share one grid cell, so the area keeps the height of the
  longest topic: switching topics is a pure cross-fade and nothing below jumps. Every
  answer stays in the HTML (hidden ones are inert), which search engines can read.

  Motion: CSS transitions for state changes (answers, topics), Motion (motion/react)
  only for the scroll entrance, as in Results and Contact. No GSAP here. Reduced
  motion: no movement, instant open and close.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, delay, ease: EASE },
});

function Question({
  item,
  open,
  onToggle,
  onKeyDown,
  buttonRef,
  uid,
}: {
  item: Faq;
  open: boolean;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
  uid: string;
}) {
  const answerId = `${uid}-a-${item.id}`;
  const buttonId = `${uid}-q-${item.id}`;
  return (
    <li className="border-b border-on-block/12">
      <h3>
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={answerId}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="group flex min-h-16 w-full touch-manipulation items-center justify-between gap-6 py-4 text-left transition-transform duration-200 ease-out-soft active:scale-[0.99] motion-reduce:transition-none"
        >
          <span
            className={cn(
              "text-pretty font-serif text-[1.25rem] font-medium leading-snug transition-colors duration-300 md:text-[1.35rem]",
              open ? "text-on-block" : "text-on-block/90 group-hover:text-on-block",
            )}
          >
            {item.question}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-[6px] border transition-[border-color,color] duration-300",
              open ? "border-accent/70 text-accent" : "border-on-block/25 text-on-block/80 group-hover:border-on-block/50",
            )}
          >
            {/* The plus turns into a cross; the box stays square. */}
            <Plus
              size={18}
              weight="light"
              className={cn(
                "transition-[transform,rotate] duration-500 ease-out-soft motion-reduce:transition-none",
                open && "rotate-45",
              )}
            />
          </span>
        </button>
      </h3>
      {/* Height via grid rows (0fr to 1fr): no JavaScript per frame. The text fades and
          settles on top of it. Closed answers are inert, so they are not in the tab order. */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out-soft motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={cn(
              "max-w-[40rem] pb-6 pr-12 text-pretty text-[1.05rem] leading-relaxed text-on-block/85 transition-[opacity,transform,translate] duration-500 ease-out-soft motion-reduce:transition-none",
              open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            )}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </li>
  );
}

export function Faq({ opensDarkChapter = false }: { opensDarkChapter?: boolean }) {
  const uid = useId();
  const [topic, setTopic] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const questionRefs = useRef<Record<string, (HTMLButtonElement | null)[]>>({});

  const pickTopic = (i: number) => {
    setTopic(i);
    setOpen(null);
  };

  // Topics: arrows in either direction (the list is vertical on desktop, a row on phones).
  const onTopicKey = (e: React.KeyboardEvent, i: number) => {
    const n = FAQ_TOPICS.length;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % n
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i + n - 1) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : null;
    if (next === null) return;
    e.preventDefault();
    pickTopic(next);
    tabRefs.current[next]?.focus();
  };

  // Questions: up and down move between questions of the open topic.
  const onQuestionKey = (e: React.KeyboardEvent, topicId: string, i: number) => {
    const list = questionRefs.current[topicId] ?? [];
    const next =
      e.key === "ArrowDown" ? Math.min(i + 1, list.length - 1)
      : e.key === "ArrowUp" ? Math.max(i - 1, 0)
      : e.key === "Home" ? 0
      : e.key === "End" ? list.length - 1
      : null;
    if (next === null) return;
    e.preventDefault();
    list[next]?.focus();
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <section
          id="faq"
          aria-labelledby="faq-title"
          className={cn(
            "relative bg-block pb-16 text-on-block [color-scheme:dark] md:pb-20",
            opensDarkChapter
              ? "z-20 -mt-8 rounded-t-[2rem] pt-20 sm:rounded-t-[2.75rem] md:pt-24 lg:rounded-t-[3.5rem] lg:pt-28"
              : "pt-4 md:pt-8",
          )}
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <m.div {...rise(0)} className="max-w-[40rem]">
              <h2
                id="faq-title"
                className="text-balance font-serif text-[clamp(2.5rem,5.2vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.025em]"
              >
                Questions parents ask us
              </h2>
              <p className="mt-4 max-w-[32rem] text-pretty text-[1.1rem] leading-relaxed text-on-block/80">
                Short answers to what parents ask most. If yours is not here, message us on WhatsApp.
              </p>
            </m.div>

            <div className="mt-12 grid gap-8 md:mt-14 lg:mt-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16 xl:gap-24">
              {/* Topics: a sticky vertical list on desktop, a scrollable row on phones. */}
              <m.div {...rise(0.1)} className="min-w-0 lg:sticky lg:top-10 lg:self-start">
                <div
                  role="tablist"
                  aria-label="Question topics"
                  className="-mx-4 flex gap-1 overflow-x-auto border-b border-on-block/12 px-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
                >
                  {FAQ_TOPICS.map((t, i) => {
                    const on = topic === i;
                    return (
                      <button
                        key={t.id}
                        ref={(el) => {
                          tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`${uid}-tab-${t.id}`}
                        aria-selected={on}
                        aria-controls={`${uid}-panel-${t.id}`}
                        tabIndex={on ? 0 : -1}
                        onClick={() => pickTopic(i)}
                        onKeyDown={(e) => onTopicKey(e, i)}
                        className={cn(
                          "relative min-h-12 shrink-0 touch-manipulation whitespace-nowrap rounded-[6px] px-4 text-left transition-[color,transform,translate,scale] duration-200 ease-out-soft active:scale-[0.98] motion-reduce:transition-none lg:flex lg:min-h-14 lg:items-center lg:justify-between lg:gap-4 lg:whitespace-normal lg:py-3 lg:pl-6",
                          on ? "text-on-block" : "text-on-block/75 hover:text-on-block",
                        )}
                      >
                        <span className={cn("text-[1rem] lg:font-serif lg:text-[1.3rem]", on && "font-medium")}>
                          {t.title}
                        </span>
                        <span className="hidden text-[0.9rem] text-on-block/75 lg:inline">
                          {t.questions.length} questions
                        </span>
                        {/* Marker: a bar under the tab on phones, beside it on desktop. */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-x-4 -bottom-px h-[2px] bg-accent transition-[transform,scale] duration-300 ease-out-soft motion-reduce:transition-none lg:inset-x-auto lg:bottom-3 lg:left-2 lg:top-3 lg:h-auto lg:w-[3px] lg:rounded-full",
                            on ? "scale-100" : "scale-x-0 lg:scale-x-100 lg:scale-y-0",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </m.div>

              {/* All panels share one grid cell: the area keeps the tallest topic's height. */}
              <m.div {...rise(0.18)} className="grid min-w-0 [&>*]:[grid-area:1/1]">
                {FAQ_TOPICS.map((t, i) => {
                  const on = topic === i;
                  return (
                    <div
                      key={t.id}
                      id={`${uid}-panel-${t.id}`}
                      role="tabpanel"
                      aria-labelledby={`${uid}-tab-${t.id}`}
                      inert={!on}
                      className={cn(
                        "transition-[opacity,visibility] duration-300 ease-out-soft motion-reduce:transition-none",
                        on ? "visible opacity-100" : "invisible opacity-0",
                      )}
                    >
                      <ul className="border-t border-on-block/12">
                        {t.questions.map((q, qi) => (
                          <Question
                            key={q.id}
                            uid={uid}
                            item={q}
                            open={open === q.id}
                            onToggle={() => setOpen((o) => (o === q.id ? null : q.id))}
                            onKeyDown={(e) => onQuestionKey(e, t.id, qi)}
                            buttonRef={(el) => {
                              (questionRefs.current[t.id] ??= [])[qi] = el;
                            }}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </m.div>
            </div>

            {/* Still have a question? Double bezel: faint cream shell, lighter brown core. */}
            <m.div
              {...rise(0.1)}
              className="mt-14 rounded-[24px] bg-on-block/[0.06] p-1.5 ring-1 ring-on-block/10 md:mt-16"
            >
              <div className="flex flex-col gap-6 rounded-[18px] bg-block-2/60 p-6 ring-1 ring-on-block/[0.07] shadow-[inset_0_1px_0_rgb(242_232_217/0.06)] md:flex-row md:items-center md:justify-between md:p-8">
                <div>
                  <p className="font-serif text-[1.6rem] font-medium leading-tight">Still have a question?</p>
                  <p className="mt-1.5 text-pretty text-[1rem] leading-relaxed text-on-block/80">
                    Message us on WhatsApp, or come for the free demo class and ask us in person.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={CONTACT.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 touch-manipulation items-center justify-center gap-2.5 whitespace-nowrap rounded-[6px] border border-on-block/45 px-6 text-[1.02rem] font-medium text-on-block transition-[border-color,transform,translate,scale] duration-300 ease-out-soft hover:border-on-block/80 active:scale-[0.98] motion-reduce:transition-none"
                  >
                    <WhatsappLogo size={22} weight="light" aria-hidden="true" className="text-accent" />
                    Message on WhatsApp
                    <span className="sr-only">(opens WhatsApp)</span>
                  </a>
                  <a
                    href={DEMO_CTA.href}
                    className="group inline-flex h-14 touch-manipulation items-center justify-between gap-4 whitespace-nowrap rounded-[6px] bg-accent pl-6 pr-2 text-[1.02rem] font-medium text-block transition-[background-color,transform,translate,scale] duration-300 ease-out-soft hover:bg-accent-hover active:scale-[0.98] motion-reduce:transition-none"
                  >
                    {DEMO_CTA.label}
                    <span className="flex size-10 items-center justify-center rounded-[4px] bg-block/10 transition-[transform,translate,scale] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:scale-105 motion-reduce:transition-none">
                      <ArrowRight size={20} weight="bold" aria-hidden="true" />
                    </span>
                  </a>
                </div>
              </div>
            </m.div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
