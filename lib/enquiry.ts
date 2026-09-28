// The demo-class enquiry form on the home page (components/ui/contact-with-globe.tsx).

export const GRADES = ["8th", "9th", "10th", "11th", "12th"] as const;
export const PREPARING_FOR = ["Boards", "JEE", "NEET", "KCET"] as const;

export type Enquiry = {
  parentName: string;
  studentName: string;
  grade: (typeof GRADES)[number];
  preparingFor: (typeof PREPARING_FOR)[number];
  /** 10 digits, no country code, no spaces */
  phone: string;
  message: string;
  /** ISO timestamp, set when the form is sent */
  sentAt: string;
};

/**
 * Sends one enquiry to Veda. This is the only place the form talks to the outside.
 *
 * NOT CONNECTED YET: there is no backend, so this waits briefly and resolves, which
 * lets the form's loading and success states be tested. Replace the body with a real
 * request (an API route that emails the office, appends to a Google Sheet, or sends a
 * WhatsApp message) and throw on failure: the form shows its error message whenever
 * this rejects.
 */
export async function submitEnquiry(enquiry: Enquiry): Promise<void> {
  if (!enquiry.phone) throw new Error("An enquiry needs a phone number.");
  await new Promise((resolve) => setTimeout(resolve, 900));
}

/** Accepts 98765 43210, 098765-43210 or +91 98765 43210. Returns the 10 digits, or null. */
export function normaliseIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s()-]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}
