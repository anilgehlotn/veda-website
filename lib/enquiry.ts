// The demo-class enquiry form (components/ui/contact-section.tsx) and its server
// action (app/actions/send-enquiry.ts) share these definitions and rules.

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
  /** Optional; used as the reply-to address of the booking email when present. */
  email?: string;
};

/** What the browser sends. Everything is re-checked on the server. */
export type EnquiryInput = {
  parentName: unknown;
  studentName: unknown;
  grade: unknown;
  preparingFor: unknown;
  phone: unknown;
  message: unknown;
  email?: unknown;
  /**
   * Honeypot: a field people never see. Anything in it means a bot filled the form.
   * Named so browsers do not autofill it (see HONEYPOT_FIELD).
   */
  vd_hp_field?: unknown;
};

/**
 * The honeypot's field name. Deliberately meaningless: browsers autofill fields whose
 * name looks like "website", "url", "company", "organization", "email" or "phone", which
 * would make a real parent's booking look like spam.
 */
export const HONEYPOT_FIELD = "vd_hp_field";

export const LIMITS = { name: 80, message: 1000 } as const;

/**
 * Accepts the ways parents write a mobile number: 7892051593, 78920 51593,
 * 78920-51593, +91 7892051593, +91-78920-51593, 91 7892051593, 0091 7892051593,
 * 07892051593. Returns the 10 digits, or null if it is not an Indian mobile number.
 */
export function normaliseIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s().-]/g, "");
  if (digits.startsWith("+91")) digits = digits.slice(3);
  else if (digits.startsWith("0091")) digits = digits.slice(4);
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");
const isOneOf = <T extends readonly string[]>(list: T, v: string): v is T[number] => (list as readonly string[]).includes(v);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type EnquiryCheck =
  | { ok: true; enquiry: Enquiry }
  | { ok: false; field: keyof EnquiryInput; problem: string };

/** Strict validation of an enquiry. Says which field failed and why, so the server can log it. */
export function checkEnquiry(input: EnquiryInput): EnquiryCheck {
  const parentName = text(input.parentName, LIMITS.name);
  const studentName = text(input.studentName, LIMITS.name);
  const grade = text(input.grade, 10);
  const preparingFor = text(input.preparingFor, 10);
  const rawPhone = text(input.phone, 30);
  const phone = normaliseIndianMobile(rawPhone);
  const message = text(input.message, LIMITS.message);
  const email = text(input.email, 120);
  const fail = (field: keyof EnquiryInput, problem: string): EnquiryCheck => ({ ok: false, field, problem });

  if (parentName.length < 2 || parentName.length > LIMITS.name) return fail("parentName", `needs 2 to ${LIMITS.name} characters`);
  if (studentName.length < 2 || studentName.length > LIMITS.name) return fail("studentName", `needs 2 to ${LIMITS.name} characters`);
  if (!isOneOf(GRADES, grade)) return fail("grade", `"${grade}" is not one of ${GRADES.join(", ")}`);
  if (!isOneOf(PREPARING_FOR, preparingFor)) return fail("preparingFor", `"${preparingFor}" is not one of ${PREPARING_FOR.join(", ")}`);
  if (!phone) return fail("phone", `"${rawPhone}" is not a 10-digit Indian mobile number`);
  if (message.length > LIMITS.message) return fail("message", `longer than ${LIMITS.message} characters`);
  if (email && !EMAIL.test(email)) return fail("email", "not a valid email address");

  return { ok: true, enquiry: { parentName, studentName, grade, preparingFor, phone, message, ...(email ? { email } : {}) } };
}

/** The clean enquiry, or null if anything is wrong. */
export function parseEnquiry(input: EnquiryInput): Enquiry | null {
  const check = checkEnquiry(input);
  return check.ok ? check.enquiry : null;
}
