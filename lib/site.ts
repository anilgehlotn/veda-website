// One label per intent, used everywhere on the site.
export const DEMO_CTA = { href: "#book-demo", label: "Book a free demo class" };

import { HAS_RESULTS } from "@/data/results";

// Absolute paths so the nav works from every page. Every link goes to a real page or
// home-page section. "Results" appears only while data/results.ts has entries.
export const NAV_LINKS = [
  { href: "/programs", label: "Programs" },
  { href: "/#why-veda", label: "Why Veda" },
  ...(HAS_RESULTS ? [{ href: "/#results", label: "Results" }] : []),
  { href: "/#contact", label: "Contact" },
];

// How parents reach Veda. The details live in lib/site-config.ts (the one place to edit them).
export { SITE_CONFIG as CONTACT } from "./site-config";
