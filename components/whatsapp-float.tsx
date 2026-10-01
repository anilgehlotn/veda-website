"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/site-config";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";

/*
  Floating "Chat on WhatsApp" button, bottom-right on every page.

  When it shows:
  - only after the page's first section (the hero) has scrolled out of view;
  - never while the booking form (#book-demo) or the footer is on screen, so it can't sit
    on the form's submit button or on the footer's contact details;
  - never on top of anything you can tap: when scrolling stops, it checks what is under
    it and fades out if a link, button, field or tab is there.
  Visibility uses IntersectionObserver, and the "what is under me" check runs once per
  scroll stop ("scrollend", or a short debounce where that event is missing), never per
  frame. Reduced motion: it appears and disappears without moving.
*/

const INTERACTIVE = "a, button, input, select, textarea, label, summary, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])";

export function WhatsAppFloat() {
  const pathname = usePathname();
  const button = useRef<HTMLAnchorElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [nearBlocked, setNearBlocked] = useState(false);
  const [overControl, setOverControl] = useState(false);

  // Past the hero, and away from the form and the footer.
  useEffect(() => {
    setPastHero(false);
    setNearBlocked(false);
    const hero = document.querySelector("main section");
    const avoid = [document.getElementById("book-demo"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    const heroObs = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    if (hero) heroObs.observe(hero);
    else setPastHero(true);
    const inView = new Set<Element>();
    const avoidObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? inView.add(e.target) : inView.delete(e.target)));
      setNearBlocked(inView.size > 0);
    });
    avoid.forEach((el) => avoidObs.observe(el));
    return () => {
      heroObs.disconnect();
      avoidObs.disconnect();
    };
  }, [pathname]);

  // Not on top of anything tappable: checked once each time scrolling stops.
  useEffect(() => {
    let timer = 0;
    const check = () => {
      const el = button.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const points: [number, number][] = [
        [r.left + r.width / 2, r.top + r.height / 2],
        [r.left + 4, r.top + 4],
        [r.right - 4, r.top + 4],
        [r.left + 4, r.bottom - 4],
        [r.right - 4, r.bottom - 4],
      ];
      const covered = points.some(([x, y]) =>
        document.elementsFromPoint(x, y).some((node) => !el.contains(node) && node.closest(INTERACTIVE)),
      );
      setOverControl(covered);
    };
    // "scrollend" where supported, plus a short debounce after any scroll: scrollend is not
    // fired for every kind of scroll (instant jumps, some anchor links), so it can't be the only signal.
    // A second look once entrance animations have settled: cards that rise into place
    // after scrolling stops can end up under the button.
    let settle = 0;
    const checkTwice = () => {
      check();
      window.clearTimeout(settle);
      settle = window.setTimeout(check, 1100);
    };
    const onScrollEnd = () => checkTwice();
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(checkTwice, 140);
    };
    window.addEventListener("scrollend", onScrollEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(settle);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const shown = pastHero && !nearBlocked && !overControl;

  return (
    <a
      ref={button}
      href={SITE_CONFIG.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Veda on WhatsApp"
      data-shown={shown}
      inert={!shown}
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[25] flex size-14 touch-manipulation items-center justify-center rounded-full bg-chapter-1 text-on-block shadow-[0_18px_40px_-14px_rgb(28_17_11/0.6),0_2px_6px_rgb(28_17_11/0.25)] ring-1 ring-on-block/20 sm:right-6 sm:bottom-6",
        "transition-[opacity,transform,translate,scale,background-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:bg-chapter-2 active:scale-[0.98] motion-reduce:transition-[opacity] motion-reduce:hover:translate-y-0",
        shown ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0 motion-reduce:translate-y-0",
      )}
    >
      <WhatsAppLogo className="size-7" />
    </a>
  );
}
