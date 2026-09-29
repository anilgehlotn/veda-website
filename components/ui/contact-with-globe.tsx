"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { preconnect } from "react-dom";
import { LazyMotion, MotionConfig, animate, domAnimation, m, type AnimationPlaybackControls } from "motion/react";
import type { ExtendedFeature, GeoPermissibleObjects } from "d3-geo";
import type { GeometryCollection, Topology } from "topojson-specification";
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
  WhatsappLogo,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CENTRE_COORDINATES, CONTACT, DEMO_CTA } from "@/lib/site";
import { GRADES, PREPARING_FOR, normaliseIndianMobile, submitEnquiry, type Enquiry } from "@/lib/enquiry";

/*
  Contact: the page's closing chapter. Adapted from 21st.dev "contact-with-globe".

  Theme. The one deliberate light-to-dark switch on the page: this section and the
  footer are a single espresso-brown chapter (bg-block, the dark Programs cards'
  colour), cream text, marigold as the only accent. The rounded top edge rises over
  the grid paper of the section above, so the switch reads as a new sheet, not a cut.

  Motion lives only here (motion/react). The page's GSAP (<ScrollMotion>, Why Veda)
  never wraps this component, so the two never touch the same elements.

  Globe. It turns once to India when it scrolls into view and stops on the centre's
  marker: "this is where we are". No React state per frame: a Motion value drives one
  draw() that rewrites three SVG paths through refs. The map code and data load only
  when the globe is near the viewport; the space is reserved from the start; the turn
  pauses off screen; a failed fetch leaves a clean outline globe facing India.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const INDIA_ID = "356";
const ERROR_TEXT = "text-[#f5a48c]"; // warm coral, 8:1 on the espresso brown

/* ---------- Globe ---------- */

type Rotation = [number, number, number];
type WorldTopology = Topology<{ countries: GeometryCollection }>;

const SIZE = 400; // viewBox units; the SVG scales with its box, so no resize handling
const [LAT, LON] = CENTRE_COORDINATES;
// Centre the view 22° south of the marker, so India sits in the visible upper part.
const END: Rotation = [-LON, -(LAT - 22), 0];
const START: Rotation = [END[0] + 150, END[1] + 14, 0];

function GlobeToIndia({ className }: { className?: string }) {
  preconnect("https://cdn.jsdelivr.net", { crossOrigin: "anonymous" });
  const box = useRef<HTMLDivElement>(null);
  const graticuleRef = useRef<SVGPathElement>(null);
  const landRef = useRef<SVGPathElement>(null);
  const indiaRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    let visible = false;
    let done = false;
    let turn: AnimationPlaybackControls | null = null;
    let draw: ((r: Rotation) => void) | null = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Turn once, only while on screen. Pausing keeps its place; it resumes on return.
    const run = () => {
      if (!draw || done || !visible) return;
      if (turn) {
        turn.play();
        return;
      }
      const d = draw;
      turn = animate(0, 1, {
        duration: 2.6,
        ease: [0.65, 0, 0.35, 1],
        onUpdate: (t) => d([START[0] + (END[0] - START[0]) * t, START[1] + (END[1] - START[1]) * t, 0]),
        onComplete: () => {
          done = true;
          el.dataset.turn = "done"; // arrived and stopped
          seen.disconnect();
        },
      });
    };

    const load = async () => {
      const [geo, topo] = await Promise.all([import("d3-geo"), import("topojson-client")]);
      const projection = geo
        .geoOrthographic()
        .scale(SIZE / 2 - 2)
        .translate([SIZE / 2, SIZE / 2])
        .clipAngle(90)
        .precision(0.6);
      const path = geo.geoPath(projection).digits(1);
      const graticule = geo.geoGraticule10();

      let land: GeoPermissibleObjects | null = null;
      let india: ExtendedFeature | null = null;
      try {
        const res = await fetch(WORLD_URL);
        if (!res.ok) throw new Error(`World map: ${res.status}`);
        const world = (await res.json()) as WorldTopology;
        land = topo.mesh(world, world.objects.countries);
        const countries = topo.feature(world, world.objects.countries);
        india = (countries.features.find((f) => String(f.id) === INDIA_ID) as ExtendedFeature | undefined) ?? null;
      } catch {
        // Fallback: outline globe with its grid and the marker, already facing India.
        land = null;
      }
      if (cancelled) return;

      draw = ([lambda, phi]) => {
        projection.rotate([lambda, phi, 0]);
        graticuleRef.current?.setAttribute("d", path(graticule) ?? "");
        landRef.current?.setAttribute("d", land ? (path(land) ?? "") : "");
        indiaRef.current?.setAttribute("d", india ? (path(india) ?? "") : "");
        const marker = markerRef.current;
        const point = projection([LON, LAT]);
        const facing = geo.geoDistance([LON, LAT], [-lambda, -phi]) < Math.PI / 2 - 0.05;
        if (marker && point) {
          marker.setAttribute("transform", `translate(${point[0].toFixed(1)} ${point[1].toFixed(1)})`);
          marker.setAttribute("opacity", facing ? "1" : "0");
        }
      };

      el.dataset.globe = land ? "map" : "fallback";
      if (reduce || !land) {
        draw(END);
        done = true;
        el.dataset.turn = "done";
        seen.disconnect();
        return;
      }
      draw(START);
      run();
    };

    // Load the map code and data only when the globe is getting close.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        void load();
      },
      { rootMargin: "600px 0px" },
    );
    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
        else turn?.pause();
      },
      { threshold: 0.4 },
    );
    near.observe(el);
    seen.observe(el);

    return () => {
      cancelled = true;
      near.disconnect();
      seen.disconnect();
      turn?.stop();
    };
  }, []);

  return (
    <div
      ref={box}
      role="img"
      aria-label="A globe that turns to India and stops on a marker at Veda's centre."
      className={cn("relative aspect-[10/7] overflow-hidden", className)}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" className="absolute inset-x-0 top-0 h-auto w-full">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 2 - 2}
          className="fill-on-block/[0.035] stroke-on-block/35"
          strokeWidth={1}
        />
        <path ref={graticuleRef} fill="none" className="stroke-on-block/12" strokeWidth={0.6} />
        <path ref={indiaRef} className="fill-accent/20 stroke-accent" strokeWidth={0.9} strokeLinejoin="round" />
        <path ref={landRef} fill="none" className="stroke-on-block/45" strokeWidth={0.6} strokeLinejoin="round" />
        <g ref={markerRef} opacity={0}>
          <circle r={11} className="fill-accent/20" />
          <circle r={4.5} className="fill-accent stroke-block" strokeWidth={1.5} />
        </g>
      </svg>
      {/* The lower part of the globe sinks into the section. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-block to-transparent" />
    </div>
  );
}

/* ---------- Ways to reach Veda ---------- */

type Channel = {
  icon: Icon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  directions?: string;
};

const CHANNELS: Channel[] = [
  { icon: Phone, label: "Call", value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: WhatsappLogo, label: "WhatsApp", value: CONTACT.whatsapp, href: CONTACT.whatsappHref, external: true },
  { icon: EnvelopeSimple, label: "Email", value: CONTACT.email, href: CONTACT.emailHref },
  { icon: MapPin, label: "Visit", value: CONTACT.address, directions: CONTACT.mapsHref },
  { icon: Clock, label: "Class hours", value: CONTACT.hours },
];

function ChannelIcon({ icon: Glyph }: { icon: Icon }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-[6px] border border-on-block/20 text-accent transition-colors duration-300 group-hover:border-accent/70">
      <Glyph size={22} weight="light" aria-hidden="true" />
    </span>
  );
}

function ChannelRow({ channel }: { channel: Channel }) {
  const text = (
    <span className="min-w-0">
      <span className="block text-[0.9rem] text-on-block/75">{channel.label}</span>
      <span className="block text-[1.05rem] font-medium text-on-block [overflow-wrap:anywhere]">{channel.value}</span>
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
          className="ml-auto shrink-0 text-on-block/60 transition-[transform,translate,color] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent motion-reduce:transition-none"
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
            className="group/dir mt-1 inline-flex touch-manipulation min-h-6 items-center gap-1 text-[0.95rem] font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-[color,text-decoration-color] duration-300 hover:decoration-accent"
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
  "w-full rounded-[6px] border border-on-block/45 bg-block/70 px-4 text-base text-on-block transition-colors duration-200 placeholder:text-on-block/65 hover:border-on-block/65 focus-visible:border-accent focus-visible:outline-offset-1 aria-[invalid=true]:border-[#f5a48c]";

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
      <label htmlFor={id} className="text-[0.95rem] font-medium text-on-block">
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
    const enquiry: Enquiry = {
      parentName: values.parentName.trim(),
      studentName: values.studentName.trim(),
      grade: values.grade as Enquiry["grade"],
      preparingFor: values.preparingFor as Enquiry["preparingFor"],
      phone: normaliseIndianMobile(values.phone) ?? "",
      message: values.message.trim(),
      sentAt: new Date().toISOString(),
    };
    try {
      await submitEnquiry(enquiry);
      setFormHeight(formRef.current?.offsetHeight);
      setStatus("sent");
    } catch {
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
        <CheckCircle size={40} weight="light" aria-hidden="true" className="text-accent" />
        <h3 ref={thanks} tabIndex={-1} className="text-balance font-serif text-[1.9rem] font-medium leading-tight outline-none">
          Thank you. We&rsquo;ll call you within {CONTACT.responseTime}.
        </h3>
        <p className="max-w-[26rem] text-pretty break-words leading-relaxed text-on-block/80">
          We&rsquo;ll call {phone.replace(/^(\d{5})(\d{5})$/, "$1 $2")} to fix a day for {values.studentName.trim()}&rsquo;s free demo class. To
          talk sooner, call {CONTACT.phone} or message us on WhatsApp.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-note`} className="grid gap-5">
      <div>
        <h3 className="font-serif text-[1.6rem] font-medium leading-tight">Tell us about your child</h3>
        <p id={`${uid}-note`} className="mt-1.5 text-pretty text-[0.98rem] leading-relaxed text-on-block/80">
          We&rsquo;ll call you to fix a day and time for the free demo class.
        </p>
      </div>

      <div className="h-px bg-on-block/12" aria-hidden="true" />

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
          className="group h-14 w-full touch-manipulation justify-between gap-4 rounded-[6px] bg-accent py-0 pl-6 pr-2 text-[1.05rem] font-medium text-block ring-offset-block transition-[background-color,transform,translate,scale] duration-300 ease-out-soft hover:bg-accent-hover active:scale-[0.98] disabled:opacity-80 motion-reduce:transition-none sm:w-fit sm:min-w-[19rem]"
        >
          {sending ? "Sending…" : DEMO_CTA.label}
          {/* Button-in-button: the arrow sits in its own inset square. */}
          <span className="flex size-10 items-center justify-center rounded-[4px] bg-block/10 transition-[transform,translate,scale] duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:scale-105 motion-reduce:transition-none">
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
              We couldn&rsquo;t send this. Please try again, or call {CONTACT.phone}.
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
          !props.value && "text-on-block/65",
          "[&>option]:bg-block [&>option]:text-on-block",
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
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-block/75"
      />
    </div>
  );
}

/* ---------- Section ---------- */

interface ContactWithGlobeProps {
  title?: string;
  description?: string;
  className?: string;
  /**
   * True when Contact opens the page's dark chapter (rounded top edge over the light
   * section above). False when a dark section above (Results, FAQ) already opened it:
   * Contact then continues flat, with no seam.
   */
  opensDarkChapter?: boolean;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.75, delay, ease: EASE },
});

export default function ContactWithGlobe({
  title = "Come and see a class",
  description = "The first demo class is free. Visit the centre, call us, or message us on WhatsApp.",
  className,
  opensDarkChapter = true,
}: ContactWithGlobeProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* Reduced motion: Motion drops the movement and keeps the short fades. */}
      <MotionConfig reducedMotion="user">
        <section
          id="contact"
          aria-labelledby="contact-title"
          className={cn(
            "relative overflow-hidden bg-block pb-16 pt-20 text-on-block [color-scheme:dark] md:pb-20 md:pt-24 lg:pt-28",
            opensDarkChapter && "z-20 -mt-8 rounded-t-[2rem] sm:rounded-t-[2.75rem] lg:rounded-t-[3.5rem]",
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
              <p className="mt-4 max-w-[32rem] text-pretty text-[1.1rem] leading-relaxed text-on-block/80">
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
                <div className="rounded-[24px] bg-on-block/[0.04] p-2 ring-1 ring-on-block/10 shadow-[0_40px_90px_-40px_rgb(18_10_6/0.6)]">
                  <div className="rounded-[16px] bg-block-2/55 p-5 ring-1 ring-on-block/[0.07] shadow-[inset_0_1px_0_rgb(242_232_217/0.06)] sm:p-8">
                    <EnquiryForm />
                  </div>
                </div>
              </m.div>

              <m.div
                {...rise(0.22)}
                className="grid content-start gap-10 md:grid-cols-2 md:items-center lg:col-start-1 lg:row-start-1 lg:grid-cols-1 lg:items-start"
              >
                <div>
                  <h3 className="font-serif text-[1.6rem] font-medium leading-tight">Visit, call or message</h3>
                  <ul className="mt-5 grid gap-2">
                    {CHANNELS.map((c) => (
                      <li key={c.label}>
                        <ChannelRow channel={c} />
                      </li>
                    ))}
                  </ul>
                </div>
                <GlobeToIndia className="mx-auto w-full max-w-[20rem] md:max-w-[24rem] lg:mx-0 lg:max-w-[26rem]" />
              </m.div>
            </div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
