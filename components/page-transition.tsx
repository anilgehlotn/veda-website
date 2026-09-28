"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

/*
  Card-to-page transition. A fixed overlay starts exactly over the clicked card,
  in the card's colour, and grows to fill the screen (transform only). Then the
  route changes; the course page's hero has the same colour, so the overlay just
  fades away. Links stay real <a>s: modified clicks, no JS and reduced motion all
  fall back to normal navigation.
*/

type Go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;

const TransitionContext = createContext<Go>(() => {});

export const useCardTransition = () => useContext(TransitionContext);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef(false);

  const go = useCallback<Go>(
    (e, href) => {
      const el = overlay.current;
      if (!el || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();

      const card = e.currentTarget;
      const r = card.getBoundingClientRect();
      router.prefetch(href);

      gsap.killTweensOf(el);
      gsap.set(el, {
        display: "block",
        autoAlpha: 1,
        backgroundColor: getComputedStyle(card).backgroundColor,
        transformOrigin: "0 0",
        x: r.left,
        y: r.top,
        scaleX: r.width / window.innerWidth,
        scaleY: r.height / window.innerHeight,
      });
      gsap.to(el, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.8,
        ease: "expo.inOut",
        onComplete: () => {
          pending.current = true;
          router.push(href);
        },
      });
    },
    [router],
  );

  // New page is in place: fade the overlay off it.
  useEffect(() => {
    const el = overlay.current;
    if (!el || !pending.current) return;
    pending.current = false;
    // Start the new page at the top, instantly, while it is still covered.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.6,
      delay: 0.1,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(el, { display: "none", clearProps: "transform" });
      },
    });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div
        ref={overlay}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-screen"
      />
    </TransitionContext.Provider>
  );
}
