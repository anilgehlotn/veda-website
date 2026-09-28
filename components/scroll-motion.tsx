"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
// Mobile address bars show/hide on scroll and change the viewport height; that must
// not re-measure every trigger mid-scroll (it caused jumps).
ScrollTrigger.config({ ignoreMobileResize: true });

/*
  Scroll animation for server-rendered markup, driven by data attributes:

    [data-reveal]      a group that reveals when it scrolls into view
      [data-mask]      text inside an overflow-hidden line; slides up
      [data-part]      fades and rises, staggered in DOM order
    [data-parallax]    drifts gently against the scroll (decorative numerals)
    [data-loop]        the weekly loop: each [data-loop-step] appears, then its [data-loop-seg] draws
    [data-closing]     the final CTA: [data-mask], [data-part], [data-cta]
    [data-exit]        hero content that drifts and fades as the next section scrolls over it

  Progressive enhancement: nothing is hidden by CSS, so the page is fully readable
  before (or without) JavaScript. Hidden start states are set here, only for groups
  that are still below the fold, so nothing on screen flickers. Everything is skipped
  for prefers-reduced-motion. Only transform and opacity are animated.
*/

const EASE = "power3.out";
const START = "top 82%";

export function ScrollMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOK: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          // Only reduced motion rebuilds everything. Width-dependent values are read
          // from the window when ScrollTrigger refreshes, so crossing a breakpoint on
          // resize or zoom never tears the animations down (that reset the scroll).
          const { motionOK } = ctx.conditions as { motionOK: boolean };
          const desktop = () => window.innerWidth >= 1024;
          const wide = () => window.innerWidth >= 768;
          if (!motionOK) return;

          const root = scope.current;
          if (!root) return;
          const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
          // A one-time reveal plays at most once per page view. matchMedia rebuilds these
          // animations when a resize or zoom crosses a breakpoint; anything already shown
          // (or on screen at that moment) is marked and never hidden again.
          const shouldReveal = (el: HTMLElement) => {
            if (el.dataset.revealed || ScrollTrigger.isInViewport(el, 0.05)) {
              el.dataset.revealed = "1";
              return false;
            }
            return true;
          };
          const markRevealed = (el: HTMLElement) => () => {
            el.dataset.revealed = "1";
          };

          // Grouped reveals: masks slide up, parts rise one after another.
          q("[data-reveal]").forEach((group) => {
            if (!shouldReveal(group)) return;
            const masks = group.querySelectorAll("[data-mask]");
            const parts = group.querySelectorAll("[data-part]");
            const tl = gsap.timeline({
              scrollTrigger: { trigger: group, start: START, once: true },
              onStart: markRevealed(group),
            });
            if (masks.length) {
              tl.fromTo(masks, { yPercent: 105 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0);
            }
            if (parts.length) {
              tl.fromTo(
                parts,
                { autoAlpha: 0, y: 28 },
                { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.09 },
                masks.length ? 0.15 : 0,
              );
            }
          });

          // Hero hand-off. The hero scrolls normally (no pinning, no sticky) and the next
          // section, which sits above it, covers it. The hero's content lags behind the
          // scroll a little (desktop) and fades, so the next section reads as a sheet
          // sliding over it. Pure scrub: its state is a function of the scroll position,
          // so fast scrolling, reloads mid-page, resizes and zoom all land correctly.
          // Distances are functions of the hero's current height (invalidateOnRefresh).
          q("[data-exit]").forEach((el) => {
            const hero = el.closest("section") ?? el;
            gsap.fromTo(
              el,
              { y: 0, autoAlpha: 1 },
              {
                y: () => (desktop() ? hero.getBoundingClientRect().height * 0.22 : -24),
                autoAlpha: 0.3,
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          // Decorative numerals drift slightly slower than the page.
          q("[data-parallax]").forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: 8 },
              {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: el.closest("article, section") ?? el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          });

          // Weekly loop: each step appears, then the segment to the next step draws.
          q("[data-loop]").forEach((loop) => {
            if (!shouldReveal(loop)) return;
            const steps = Array.from(loop.querySelectorAll<HTMLElement>("[data-loop-step]"));
            const note = loop.querySelector("[data-loop-note]");
            const axis = wide() ? "scaleX" : "scaleY";
            const tl = gsap.timeline({
              scrollTrigger: { trigger: loop, start: "top 75%", once: true },
              onStart: markRevealed(loop),
            });

            steps.forEach((step, i) => {
              const at = i * 0.65;
              tl.fromTo(step, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE }, at);
              const seg = step.querySelector("[data-loop-seg]");
              if (seg) {
                tl.fromTo(seg, { [axis]: 0 }, { [axis]: 1, duration: 0.6, ease: "power2.inOut" }, at + 0.35);
              }
            });
            if (note) {
              tl.fromTo(note, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE }, ">-0.1");
            }
          });

          // Closing CTA: headline lines slide up, then the text, then the button settles in.
          q("[data-closing]").forEach((block) => {
            if (!shouldReveal(block)) return;
            const tl = gsap.timeline({
              scrollTrigger: { trigger: block, start: "top 70%", once: true },
              onStart: markRevealed(block),
            });
            tl.fromTo(
              block.querySelectorAll("[data-mask]"),
              { yPercent: 105 },
              { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.1 },
            )
              .fromTo(
                block.querySelectorAll("[data-part]"),
                { autoAlpha: 0, y: 24 },
                { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.1 },
                0.3,
              )
              .fromTo(
                block.querySelectorAll("[data-cta]"),
                { autoAlpha: 0, y: 16, scale: 0.97 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "expo.out" },
                0.55,
              );
          });
        },
      );

      // Fonts change line heights; re-measure trigger positions once they are in.
      let alive = true;
      document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

      return () => {
        alive = false;
        mm.revert();
      };
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
