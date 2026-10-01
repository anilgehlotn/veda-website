"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import { DEMO_CTA, NAV_LINKS } from "@/lib/site";

/*
  variant="split" (home): on desktop the header sits over the hero and follows its
  5fr / 7fr split, so the logo lands on the brown block and the links line up with
  the hero text. The demo CTA lives in the hero there.
  variant="plain" (inner pages): logo, links and the demo CTA in one row on paper.
  onTone: the plain header sits on a course tone (see .tone-* in globals.css) and
  takes its colours from it, so the card-to-page transition lands on one colour.
  Below lg both are a plain bar with a menu button.
*/
export function SiteHeader({
  variant = "split",
  onTone = false,
}: {
  variant?: "split" | "plain";
  onTone?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const split = variant === "split";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const navLinks = (
    <ul className="flex items-center gap-6 xl:gap-9">
      {NAV_LINKS.map((l) => {
        const current = pathname === l.href;
        return (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={current ? "page" : undefined}
              className={`whitespace-nowrap text-[0.95rem] underline-offset-[6px] transition-colors duration-300 hover:text-ink hover:underline ${
                onTone
                  ? current
                    ? "text-tone-fg underline decoration-2"
                    : "text-tone-muted hover:!text-tone-fg"
                  : current
                    ? "text-ink underline decoration-accent decoration-2"
                    : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <header className={`relative z-20 ${split ? "lg:absolute lg:inset-x-0 lg:top-0" : ""}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-[6px] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      {split ? (
        <div className="flex h-18 items-center justify-between px-4 sm:px-8 lg:grid lg:h-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:px-0">
          <Link
            href="/"
            className="font-serif text-[1.7rem] font-semibold leading-none tracking-tight text-ink lg:px-12 lg:text-on-block lg:[--focus:var(--accent)] xl:px-16"
          >
            Veda
          </Link>
          <div className="flex items-center gap-2 lg:justify-between lg:px-12 xl:px-16 2xl:px-24">
            <nav aria-label="Main" className="hidden lg:block">
              {navLinks}
            </nav>
            <MenuButton open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </div>
      ) : (
        <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:h-20 lg:px-12">
          <Link
            href="/"
            className={`font-serif text-[1.7rem] font-semibold leading-none tracking-tight ${onTone ? "text-tone-fg" : "text-ink"}`}
          >
            Veda
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            {navLinks}
          </nav>
          <a
            href={DEMO_CTA.href}
            className={`group hidden items-center gap-2 whitespace-nowrap rounded-[6px] px-4 py-2.5 text-[0.95rem] font-medium transition-[background-color,opacity,transform,translate,scale] duration-300 ease-out-soft active:scale-[0.98] lg:inline-flex ${
              onTone ? "bg-tone-fg text-tone-bg hover:opacity-90" : "bg-btn text-on-btn hover:bg-btn-hover"
            }`}
          >
            {DEMO_CTA.label}
            <ArrowRight
              size={16}
              weight="bold"
              aria-hidden="true"
              className={`transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 ${onTone ? "" : "text-accent dark:text-on-btn"}`}
            />
          </a>
          <MenuButton open={open} onToggle={() => setOpen((v) => !v)} onTone={onTone} />
        </div>
      )}

      <nav
        id="mobile-menu"
        aria-label="Main mobile"
        hidden={!open}
        className="absolute inset-x-0 top-18 border-t border-line bg-paper px-4 text-ink pb-8 pt-2 shadow-[0_24px_40px_-24px_rgb(43_27_18/0.35)] sm:px-8 lg:hidden"
      >
        <ul>
          {NAV_LINKS.map((l) => (
            <li key={l.href} className="border-b border-line">
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? "page" : undefined}
                className="block py-4 font-serif text-2xl font-medium"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={DEMO_CTA.href}
          onClick={() => setOpen(false)}
          className="mt-6 flex w-full items-center justify-center rounded-[6px] bg-btn px-5 py-4 font-medium text-on-btn"
        >
          {DEMO_CTA.label}
        </a>
      </nav>
    </header>
  );
}

function MenuButton({
  open,
  onToggle,
  onTone = false,
}: {
  open: boolean;
  onToggle: () => void;
  onTone?: boolean;
}) {
  return (
    <button
      type="button"
      className={`-mr-2 inline-flex size-11 items-center justify-center rounded-[6px] lg:hidden ${onTone ? "text-tone-fg" : "text-ink"}`}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onToggle}
    >
      {open ? <X size={26} weight="light" /> : <List size={26} weight="light" />}
    </button>
  );
}
