"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import type { Course } from "@/lib/courses";
import { useCardTransition } from "./page-transition";

/*
  One program card. Each card takes its course's tone, and grade cards and exam
  cards have different widths and marks, so the row never reads as identical boxes.
  The subjects line is revealed on hover (always shown on touch screens).

  fluid: the card fills its parent's width (the home .program-row). There, the text
  block keeps a fixed width and the mark's size follows the row, not the card, so
  nothing rewraps while the card's width animates (see .program-row in globals.css).
*/
export function ProgramCard({
  course: c,
  tabIndex,
  fluid = false,
}: {
  course: Course;
  tabIndex?: number;
  fluid?: boolean;
}) {
  const go = useCardTransition();
  const href = `/programs/${c.slug}`;
  const exam = c.kind === "exam";

  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      draggable={false}
      onClick={(e) => go(e, href)}
      aria-label={`${c.title}: ${c.tagline} View details.`}
      className={`tone-${c.tone} group/card relative flex h-[23rem] shrink-0 select-none flex-col justify-between overflow-hidden rounded-[6px] bg-tone-bg p-6 text-tone-fg transition-[transform,translate,scale,box-shadow] duration-700 ease-out-soft hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-28px_rgb(43_27_18/0.55)] focus-visible:-translate-y-1.5 sm:h-[25rem] sm:p-7 ${
        fluid ? "card-fluid w-full" : exam ? "w-[19rem] sm:w-[22rem]" : "w-[16.5rem] sm:w-[18.5rem]"
      } ${c.tone === "paper" ? "ring-1 ring-inset ring-tone-line" : ""}`}
    >
      <div className="flex items-start justify-between gap-4 text-[0.9rem] text-tone-muted">
        <span className="card-kicker whitespace-nowrap">{c.kicker}</span>
        {c.deva && (
          <span lang="hi" className="font-deva-num text-[1.7rem] leading-none text-tone-fg/75">
            {c.deva}
          </span>
        )}
      </div>

      <p
        aria-hidden="true"
        className={`card-mark whitespace-nowrap font-serif font-medium leading-[0.8] tracking-[-0.04em] transition-transform duration-700 ease-out-soft group-hover/card:-translate-y-1 ${
          exam ? "text-[5.2rem] sm:text-[6.2rem]" : "text-[8.5rem] sm:text-[10rem]"
        }`}
      >
        {c.mark}
        {!exam && <span className="ml-1 align-top text-[0.22em] tracking-normal text-tone-muted">th</span>}
      </p>

      <div>
        <div className="card-body">
          <p className="card-tagline text-pretty font-serif text-[1.35rem] font-medium leading-snug">{c.tagline}</p>
          <p className="mt-2 text-sm text-tone-muted transition-[opacity,transform,translate,scale] duration-500 ease-out-soft [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:translate-y-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:group-focus-visible/card:translate-y-0 [@media(hover:hover)]:group-focus-visible/card:opacity-100">
            {c.detail}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between whitespace-nowrap border-t border-tone-line pt-4 text-[0.95rem] font-medium">
          View details
          <ArrowRight
            size={18}
            weight="bold"
            aria-hidden="true"
            className="transition-transform duration-500 ease-out-soft group-hover/card:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
