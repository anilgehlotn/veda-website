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

// How parents reach Veda. Placeholders in square brackets until the real details are in.
export const CONTACT = {
  phone: "[Phone number]",
  phoneHref: "tel:[Phone number]",
  whatsapp: "[WhatsApp number]",
  // wa.me takes the number with country code and no "+", spaces or dashes.
  whatsappHref: "https://wa.me/[WhatsApp number]",
  email: "[Email address]",
  emailHref: "mailto:[Email address]",
  address: "[Centre address]",
  mapsHref: "[Google Maps link]",
  hours: "[Class hours]",
  responseTime: "[response time]",
};

// Where the centre is, for the marker on the contact globe: [Latitude, Longitude].
// Placeholder: the geographic centre of India until the centre's coordinates are in.
export const CENTRE_COORDINATES: [number, number] = [22.35, 78.67];
