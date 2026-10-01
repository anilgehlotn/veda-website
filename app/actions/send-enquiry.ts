"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { SITE_CONFIG } from "@/lib/site-config";
import { HONEYPOT_FIELD, checkEnquiry, type EnquiryInput } from "@/lib/enquiry";
import { bookingEmail, bookingSubject } from "@/lib/booking-email";

/*
  Server Action for the "Book a free demo class" form. Runs only on the server, so the
  Resend API key (RESEND_API_KEY in .env.local, see SETUP-EMAIL.md) never reaches the
  browser. The form shows "Thank you" only when this returns { ok: true }, which happens
  only after Resend accepted the email.

  Every outcome is logged on one line starting with [send-enquiry] (never the API key).
  In development the specific reason is also returned to the form (`detail`); in
  production parents only see the friendly message with the phone and WhatsApp links.

  Spam protection:
  - every field is validated again here (the browser's checks can be bypassed);
  - a hidden honeypot field: if a bot fills it, we pretend it worked and send nothing;
  - a rate limit on emails actually sent: 3 per device per 10 minutes (20 while
    developing, so testing is not blocked), and 60 per hour overall. Failed attempts
    (missing key, Resend errors, invalid data) do not count against anyone. It is kept
    in memory, so it resets when the server restarts; on Vercel each server instance
    keeps its own count. Good enough against casual spam.
*/

type Reason = "invalid" | "busy" | "not_configured" | "send_failed";
export type SendEnquiryResult = { ok: true } | { ok: false; reason: Reason; detail?: string };

const DEV = process.env.NODE_ENV !== "production";
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = DEV ? 20 : 3;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_MAX = 60;
const sentPerIp = new Map<string, number[]>();
let sentRecently: number[] = [];

function overLimit(ip: string, now: number) {
  sentRecently = sentRecently.filter((t) => now - t < GLOBAL_WINDOW_MS);
  const mine = (sentPerIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  sentPerIp.set(ip, mine);
  return mine.length >= PER_IP || sentRecently.length >= GLOBAL_MAX;
}

function recordSent(ip: string, now: number) {
  sentPerIp.set(ip, [...(sentPerIp.get(ip) ?? []), now]);
  sentRecently.push(now);
  if (sentPerIp.size > 5000) for (const [key, times] of sentPerIp) if (!times.some((t) => now - t < WINDOW_MS)) sentPerIp.delete(key);
}

const fail = (reason: Reason, log: string, detail: string): SendEnquiryResult => {
  console.error(`[send-enquiry] FAILED (${reason}): ${log}`);
  return { ok: false, reason, ...(DEV ? { detail } : {}) };
};

/** Plain-language explanation of a Resend error, for the log and the development message. */
function explainResendError(status: number | null, name: string, message: string) {
  const code = `${status ?? "no status"} ${name}`;
  if (status === 401 || name === "missing_api_key")
    return `Resend rejected the request (${code}): the API key is missing or malformed. Check RESEND_API_KEY in .env.local and restart the dev server.`;
  if (status === 403 && /own email address|testing emails/i.test(message))
    return `Resend (${code}): with the test sender onboarding@resend.dev, Resend only delivers to the email the Resend account was created with. Create the account with ${SITE_CONFIG.bookingsInbox}, or verify a domain. Resend said: ${message}`;
  if (status === 403 || name === "invalid_api_key")
    return `Resend rejected the API key (${code}): it is wrong or was deleted. Create a new key in Resend and paste it into .env.local. Resend said: ${message}`;
  if (status === 429) return `Resend rate limit (${code}): too many emails too quickly. Resend said: ${message}`;
  return `Resend error (${code}): ${message}`;
}

export async function sendEnquiry(input: EnquiryInput): Promise<SendEnquiryResult> {
  // 1. Honeypot filled: a bot. Look successful, send nothing.
  const trap = input[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    console.warn("[send-enquiry] Honeypot field was filled: treated as spam, nothing sent.");
    return { ok: true };
  }

  // 2. Validate every field again.
  const check = checkEnquiry(input);
  if (!check.ok) {
    return fail("invalid", `validation: ${check.field} ${check.problem}`, `Server validation failed: ${check.field} ${check.problem}.`);
  }
  const enquiry = check.enquiry;

  // 3. Rate limit (emails actually sent).
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const now = Date.now();
  if (overLimit(ip, now)) {
    return fail("busy", `rate limit: ${PER_IP} bookings in 10 minutes already sent from this device`, `Rate limit: ${PER_IP} bookings were already sent from this device in the last 10 minutes.`);
  }

  // 4. Email service configured?
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return fail(
      "not_configured",
      "RESEND_API_KEY is missing or empty. Add it to .env.local in the project root and restart the dev server (see SETUP-EMAIL.md).",
      "Email service not configured: RESEND_API_KEY is missing. Add your Resend API key to .env.local and restart the dev server (see SETUP-EMAIL.md).",
    );
  }
  if (!apiKey.startsWith("re_")) {
    return fail(
      "not_configured",
      `RESEND_API_KEY does not look like a Resend key (it should start with "re_", ${apiKey.length} characters found). Check for quotes or a copy mistake.`,
      'Email service not configured: RESEND_API_KEY should start with "re_". Check .env.local for quotes or a copy mistake.',
    );
  }

  // 5. Send.
  const { html, text } = bookingEmail(enquiry, new Date(now));
  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: SITE_CONFIG.bookingsFrom,
      to: [SITE_CONFIG.bookingsInbox],
      subject: bookingSubject(enquiry),
      html,
      text,
      // Reply goes straight to the parent, but only if they gave an email address.
      ...(enquiry.email ? { replyTo: enquiry.email } : {}),
    });
    if (error) {
      const why = explainResendError(error.statusCode, error.name, error.message);
      return fail("send_failed", why, why);
    }
    recordSent(ip, now);
    console.info(`[send-enquiry] Sent booking email for ${enquiry.studentName} (Grade ${enquiry.grade}) to ${SITE_CONFIG.bookingsInbox}, id ${data?.id ?? "unknown"}.`);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail("send_failed", `could not reach Resend: ${message}`, `Could not reach the email service: ${message}`);
  }
}
