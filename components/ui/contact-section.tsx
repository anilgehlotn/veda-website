"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  CheckCircle,
  CircleNotch,
  Clock,
  EnvelopeSimple,
  MapPin,
  Phone,
  WarningCircle,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CONTACT, DEMO_CTA } from "@/lib/site";
import { GRADES, HONEYPOT_FIELD, PREPARING_FOR, normaliseIndianMobile } from "@/lib/enquiry";
import { sendEnquiry } from "@/app/actions/send-enquiry";
import { WhatsAppLogo } from "@/components/ui/whatsapp-logo";

/*
  Contact: the last light section, on a sheet a shade warmer than the FAQ above it.
  Originally adapted from 21st.dev "contact-with-globe" (the globe has since been removed).
  The dark footer below rises over its bottom edge with a rounded top: the page's one
  closing switch from light to dark.

  Layout: the form comes first in the page order (it is the main action, and first on
  phones). On desktop the contact details sit on the left, their heading aligned with the
  top of the form card; on tablets the details run in two columns under the form.

  Motion lives only here (motion/react). The page's GSAP (<ScrollMotion>, Why Veda)
  never wraps this component, so the two never touch the same elements.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const ERROR_TEXT = "text-destructive"; // deep red-brown (#9f2f2d), over 7:1 on cream

/* ---------- Ways to reach Veda ---------- */

type Channel = {
  /** A Phosphor icon, or "whatsapp" for the official WhatsApp mark. */
  icon: Icon | "whatsapp";
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  directions?: string;
};

const CHANNELS: Channel[] = [
  { icon: Phone, label: "Call", value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: "whatsapp", label: "WhatsApp", value: CONTACT.whatsapp, href: CONTACT.whatsappHref, external: true },
  { icon: EnvelopeSimple, label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
  { icon: MapPin, label: "Visit", value: CONTACT.address, directions: CONTACT.mapsHref },
  { icon: Clock, label: "Class hours", value: CONTACT.hours },
];

function ChannelIcon({ icon: Glyph }: { icon: Channel["icon"] }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-[6px] border border-card-line bg-card text-mid transition-colors duration-300 group-hover:border-ink group-hover:text-ink">
      {Glyph === "whatsapp" ? (
        <WhatsAppLogo className="size-[20px]" />
      ) : (
        <Glyph size={22} weight="light" aria-hidden="true" />
      )}
    </span>
  );
}

/* Phone and WhatsApp as links inside a sentence (form success and error messages). */
function InlineContacts() {
  const link = "font-medium underline decoration-current/40 underline-offset-4 hover:decoration-current";
  return (
    <>
      call{" "}
      <a href={CONTACT.phoneHref} className={cn(link, "whitespace-nowrap")}>
        {CONTACT.phone}
      </a>{" "}
      or{" "}
      <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className={link}>
        message us on WhatsApp
      </a>
    </>
  );
}

function ChannelRow({ channel }: { channel: Channel }) {
  const text = (
    <span className="min-w-0">
      <span className="block text-[0.9rem] text-muted">{channel.label}</span>
      <span className="block text-[1.05rem] font-medium text-ink decoration-ink/30 underline-offset-4 [overflow-wrap:anywhere] group-hover:underline">
        {/* An email address may wrap after the @ on narrow screens, never mid-word. */}
        {channel.value.includes("@") ? (
          <>
            {channel.value.split("@")[0]}@<wbr />
            {channel.value.split("@").slice(1).join("@")}
          </>
        ) : (
          channel.value
        )}
      </span>
    </span>
  );

  if (channel.href) {
    return (
      <a
        href={channel.href}
        {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex min-h-14 touch-manipulation items-center gap-4 rounded-[6px] py-1.5 transition-transform duration-200 ease-out-soft active:scale-[0.98] motion-reduce:transition-none"
      >
        <ChannelIcon icon={channel.icon} />
        {text}
        <ArrowUpRight
          size={18}
          weight="light"
          aria-hidden="true"
          className="ml-auto shrink-0 text-muted transition-[transform,translate,color] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink motion-reduce:transition-none"
        />
        {channel.external && <span className="sr-only">(opens WhatsApp)</span>}
      </a>
    );
  }

  return (
    <div className="flex min-h-14 items-center gap-4 py-1.5">
      <ChannelIcon icon={channel.icon} />
      <span className="min-w-0">
        {text}
        {channel.directions && (
          <a
            href={channel.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="group/dir mt-1 inline-flex touch-manipulation min-h-6 items-center gap-1 text-[0.95rem] font-medium text-accent-ink underline decoration-accent-ink/40 underline-offset-4 transition-[color,text-decoration-color] duration-300 hover:decoration-accent-ink"
          >
            Get directions
            <ArrowUpRight
              size={15}
              weight="bold"
              aria-hidden="true"
              className="transition-[transform,translate] duration-300 ease-out-soft group-hover/dir:translate-x-0.5 group-hover/dir:-translate-y-0.5 motion-reduce:transition-none"
            />
            <span className="sr-only">(opens Google Maps)</span>
          </a>
        )}
      </span>
    </div>
  );
}

/* ---------- Enquiry form ---------- */

type Field = "parentName" | "studentName" | "grade" | "preparingFor" | "phone" | "message";
type Values = Record<Field, string>;
type Status = "idle" | "sending" | "sent" | "failed";

const EMPTY: Values = { parentName: "", studentName: "", grade: "", preparingFor: "", phone: "", message: "" };
const ORDER: Field[] = ["parentName", "studentName", "grade", "preparingFor", "phone", "message"];

function validate(v: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (v.parentName.trim().length < 2) errors.parentName = "Please enter your name.";
  if (v.studentName.trim().length < 2) errors.studentName = "Please enter your child's name.";
  if (!v.grade) errors.grade = "Please choose your child's grade.";
  if (!v.preparingFor) errors.preparingFor = "Please choose what your child is preparing for.";
  if (!v.phone.trim()) errors.phone = "Please enter a mobile number we can call.";
  else if (!normaliseIndianMobile(v.phone))
    errors.phone = "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
  return errors;
}

const CONTROL =
  "w-full rounded-[6px] border border-field-line bg-field-bg px-4 text-base text-ink transition-colors duration-200 placeholder:text-muted hover:border-ink focus-visible:border-ink focus-visible:outline-offset-1 aria-[invalid=true]:border-destructive";

function FieldShell({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <label htmlFor={id} className="text-[0.95rem] font-medium text-ink">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} aria-live="polite" className={cn("text-[0.9rem] leading-snug", ERROR_TEXT, !error && "sr-only")}>
        {error && (
          <span className="flex items-start gap-1.5">
            <WarningCircle size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
            {error}
          </span>
        )}
      </p>
    </div>
  );
}

function EnquiryForm() {
  const uid = useId();
  const id = (f: Field) => `${uid}-${f}`;
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const thanks = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const [failDetail, setFailDetail] = useState<string | null>(null);
  // The thank-you keeps the form's height, so the card does not collapse under the reader.
  const [formHeight, setFormHeight] = useState<number>();

  const errors = validate(values);
  const shown = (f: Field) => ((submitted || touched[f]) && errors[f]) || undefined;

  useEffect(() => {
    if (status === "sent") thanks.current?.focus();
  }, [status]);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [f]: e.target.value }));
  const blur = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }));
  const aria = (f: Field) => ({
    id: id(f),
    name: f,
    "aria-invalid": shown(f) ? true : undefined,
    "aria-describedby": `${id(f)}-error`,
    onBlur: blur(f),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);
    const first = ORDER.find((f) => errors[f]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    setStatus("sending");
    try {
      // The server validates everything again and emails Veda (app/actions/send-enquiry.ts).
      // "Thank you" appears only when the email was actually sent.
      const result = await sendEnquiry({ ...values, [HONEYPOT_FIELD]: honeypot.current?.value ?? "" });
      if (result.ok) {
        setFormHeight(formRef.current?.offsetHeight);
        setStatus("sent");
      } else {
        // `detail` is only sent by the server in development (see app/actions/send-enquiry.ts).
        setFailDetail(result.detail ?? null);
        setStatus("failed");
      }
    } catch (err) {
      setFailDetail(process.env.NODE_ENV !== "production" ? `The request did not complete: ${String(err)}` : null);
      setStatus("failed");
    }
  };

  if (status === "sent") {
    const phone = normaliseIndianMobile(values.phone) ?? values.phone.trim();
    return (
      <div
        role="status"
        style={{ minHeight: formHeight }}
        className="grid min-h-[26rem] content-center justify-items-start gap-4 py-6"
      >
        <CheckCircle size={40} weight="light" aria-hidden="true" className="text-accent-ink" />
        <h3 ref={thanks} tabIndex={-1} className="text-balance font-serif text-[1.9rem] font-medium leading-tight outline-none">
          Thank you. We&rsquo;ll call you within {CONTACT.responseTime}.
        </h3>
        <p className="max-w-[26rem] text-pretty break-words leading-relaxed text-muted">
          We&rsquo;ll call {phone.replace(/^(\d{5})(\d{5})$/, "$1 $2")} to fix a day for {values.studentName.trim()}&rsquo;s free demo class. To
          talk sooner, <InlineContacts />.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-note`} className="relative grid gap-5">
      <div>
        <h3 className="font-serif text-[1.6rem] font-medium leading-tight">Tell us about your child</h3>
        <p id={`${uid}-note`} className="mt-1.5 text-pretty text-[0.98rem] leading-relaxed text-muted">
          We&rsquo;ll call you to fix a day and time for the free demo class.
        </p>
      </div>

      <div className="h-px bg-card-line" aria-hidden="true" />

      {/* Honeypot for bots. Off-screen with inline styles (never display:none, which bots skip),
          so it stays hidden even before the stylesheet loads; out of the tab order and hidden
          from screen readers; a name browsers do not autofill. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: 0, width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}
      >
        <label htmlFor={`${uid}-hp`}>Leave this field empty</label>
        <input
          ref={honeypot}
          id={`${uid}-hp`}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          defaultValue=""
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell id={id("parentName")} label="Parent's name" error={shown("parentName")}>
          <input
            {...aria("parentName")}
            type="text"
            autoComplete="name"
            required
            value={values.parentName}
            onChange={set("parentName")}
            className={cn(CONTROL, "h-12")}
          />
        </FieldShell>
        <FieldShell id={id("studentName")} label="Student's name" error={shown("studentName")}>
          <input
            {...aria("studentName")}
            type="text"
            autoComplete="off"
            required
            value={values.studentName}
            onChange={set("studentName")}
            className={cn(CONTROL, "h-12")}
          />
        </FieldShell>

        <FieldShell id={id("grade")} label="Grade" error={shown("grade")}>
          <SelectBox
            {...aria("grade")}
            required
            value={values.grade}
            onChange={set("grade")}
            placeholder="Choose a grade"
            options={GRADES}
          />
        </FieldShell>
        <FieldShell id={id("preparingFor")} label="Preparing for" error={shown("preparingFor")}>
          <SelectBox
            {...aria("preparingFor")}
            required
            value={values.preparingFor}
            onChange={set("preparingFor")}
            placeholder="Choose one"
            options={PREPARING_FOR}
          />
        </FieldShell>
      </div>

      <FieldShell id={id("phone")} label="Phone number (WhatsApp)" error={shown("phone")}>
        <input
          {...aria("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required
          placeholder="10-digit mobile number…"
          value={values.phone}
          onChange={set("phone")}
          className={cn(CONTROL, "h-12")}
        />
      </FieldShell>

      <FieldShell id={id("message")} label="Message (optional)">
        <textarea
          {...aria("message")}
          rows={3}
          autoComplete="off"
          placeholder="Anything you’d like us to know…"
          value={values.message}
          onChange={set("message")}
          className={cn(CONTROL, "min-h-24 resize-y py-3 leading-relaxed")}
        />
      </FieldShell>

      <div className="grid gap-3 pt-1">
        <Button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className="group h-14 w-full touch-manipulation justify-between gap-4 rounded-[6px] bg-btn py-0 pl-6 pr-2 text-[1.05rem] font-medium text-on-btn transition-[background-color,transform,translate,scale] duration-300 ease-out-soft hover:bg-btn-hover active:scale-[0.98] disabled:opacity-80 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus-visible:ring-0 motion-reduce:transition-none sm:w-fit sm:min-w-[19rem]"
        >
          {sending ? "Sending…" : DEMO_CTA.label}
          {/* Button-in-button: the arrow sits in its own inset square. */}
          <span className="flex size-10 items-center justify-center rounded-[4px] bg-on-btn/10 text-accent transition-[transform,translate,scale] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:scale-105 motion-reduce:transition-none dark:text-on-btn">
            {sending ? (
              <CircleNotch size={20} weight="bold" aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
            ) : (
              <ArrowRight size={20} weight="bold" aria-hidden="true" />
            )}
          </span>
        </Button>
        <p aria-live="polite" className={cn("text-[0.95rem] leading-snug", ERROR_TEXT, status !== "failed" && "sr-only")}>
          {status === "failed" && (
            <span className="flex items-start gap-1.5">
              <WarningCircle size={18} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>
                We couldn&rsquo;t send your request. Please <InlineContacts />.
                {failDetail && (
                  <span className="mt-2 block rounded-[6px] bg-sheet-3 px-3 py-2 text-[0.85rem] leading-snug text-ink">
                    <span className="font-medium">Development only: </span>
                    {failDetail}
                  </span>
                )}
              </span>
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

function SelectBox({
  options,
  placeholder,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder: string }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(
          CONTROL,
          "h-12 cursor-pointer appearance-none pr-11",
          !props.value && "text-muted",
          "[&>option]:bg-card [&>option]:text-ink",
          className,
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <CaretDown
        size={18}
        weight="bold"
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/* ---------- Section ---------- */

interface ContactSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.75, delay, ease: EASE },
});

export default function ContactSection({
  title = "Come and see a class",
  description = "The first demo class is free. Visit the centre, call us, or message us on WhatsApp.",
  className,
}: ContactSectionProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* Reduced motion: Motion drops the movement and keeps the short fades. */}
      <MotionConfig reducedMotion="user">
        <section
          id="contact"
          aria-labelledby="contact-title"
          className={cn(
            // Bottom padding includes the 2rem the footer's rounded edge rises over.
            "relative overflow-hidden bg-sheet-3 pb-24 pt-20 text-ink md:pb-28 md:pt-24 lg:pb-32 lg:pt-28",
            className,
          )}
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
            <m.div {...rise(0)} className="max-w-[40rem]">
              <h2
                id="contact-title"
                className="text-balance font-serif text-[clamp(2.5rem,5.2vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.025em]"
              >
                {title}
              </h2>
              <p className="mt-4 max-w-[32rem] text-pretty text-[1.1rem] leading-relaxed text-muted">
                {description}
              </p>
            </m.div>

            <div className="mt-12 grid gap-12 md:mt-14 lg:mt-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:gap-24">
              {/* The form comes first in the page order: it is the main action (and first on phones). */}
              <m.div
                {...rise(0.12)}
                id="book-demo"
                className="scroll-mt-8 lg:col-start-2 lg:row-start-1"
              >
                {/* Double bezel: a light outer shell, then the inner core with concentric corners. */}
                <div className="rounded-[24px] bg-card-shell p-2 shadow-card ring-1 ring-card-line">
                  <div className="rounded-[16px] bg-card p-5 sm:p-8">
                    <EnquiryForm />
                  </div>
                </div>
              </m.div>

              {/* Its heading's first line sits level with the top edge of the form card (leading-none). */}
              <m.div {...rise(0.22)} className="lg:col-start-1 lg:row-start-1">
                <h3 className="font-serif text-[1.6rem] font-medium leading-none">Visit, call or message</h3>
                <ul className="mt-6 grid gap-2 md:grid-cols-2 md:gap-x-8 lg:grid-cols-1">
                  {CHANNELS.map((c) => (
                    <li key={c.label}>
                      <ChannelRow channel={c} />
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
