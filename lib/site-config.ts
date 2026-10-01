/*
  Veda's contact details: the ONE place to change them. Every phone, WhatsApp and email
  link on the site (Contact, FAQ, footer, Programs pages, the floating WhatsApp button,
  form messages and the booking email) reads from here.

  To change a number, edit the digits below; the links are built from them.
*/

/** Digits only, with country code (91 for India), no "+" or spaces. */
const PHONE_DIGITS = "917892051593";
const WHATSAPP_DIGITS = "919731671454";

/** "917892051593" -> "+91 78920 51593" */
const formatIndian = (digits: string) => `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;

/** The message already typed when a parent opens WhatsApp from the site. */
const WHATSAPP_MESSAGE = "Hi Veda, I'd like to know more about your classes.";

export const SITE_CONFIG = {
  phone: formatIndian(PHONE_DIGITS),
  phoneHref: `tel:+${PHONE_DIGITS}`,
  whatsapp: formatIndian(WHATSAPP_DIGITS),
  /** Opens the WhatsApp app on phones and WhatsApp Web on computers, message pre-filled. */
  whatsappHref: `https://wa.me/${WHATSAPP_DIGITS}?text=${encodeURIComponent(WHATSAPP_MESSAGE).replace(/'/g, "%27")}`,
  email: "shivkaransinghbais1628@gmail.com",
  emailHref: "mailto:shivkaransinghbais1628@gmail.com",
  /** Where "Book a free demo class" enquiries are emailed (server only; see app/actions/send-enquiry.ts). */
  bookingsInbox: "shivkaransinghbais1628@gmail.com",
  /** Sender for booking emails. Resend's test sender until a domain is verified (see SETUP-EMAIL.md). */
  bookingsFrom: "Veda Website <onboarding@resend.dev>",

  // Still placeholders: fill these in when you have them.
  address: "[Centre address]",
  mapsHref: "[Google Maps link]",
  hours: "[Class hours]",
  responseTime: "[response time]",
} as const;
