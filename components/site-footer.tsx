import Link from "next/link";
import { COURSES } from "@/lib/courses";
import { CONTACT, NAV_LINKS } from "@/lib/site";
import { container } from "./sections";

/*
  The page's dark closing anchor (chapter-4 to chapter-5 in globals.css). Its rounded top
  edge rises 2rem over the section above (the light Contact section on the home page, the
  dark closing section on Programs pages), the one deliberate light-to-dark switch.
*/
const LINK =
  "inline-block underline-offset-4 transition-[transform,translate,scale] duration-200 ease-out-soft hover:underline active:scale-[0.98] motion-reduce:transition-none";
export function SiteFooter() {
  return (
    <footer className="chapter-4 relative z-10 -mt-8 rounded-t-[2rem] text-on-block [color-scheme:dark] sm:rounded-t-[2.75rem] lg:rounded-t-[3.5rem]">
      <div className={`${container} grid gap-12 py-16 md:grid-cols-12 lg:py-20`}>
        <div className="md:col-span-5">
          <Link
            href="/"
            className="inline-block font-serif text-3xl font-semibold tracking-tight transition-[opacity,transform,translate,scale] duration-200 ease-out-soft hover:opacity-85 active:scale-[0.98] motion-reduce:transition-none"
          >
            Veda
          </Link>
          <p className="mt-4 max-w-[22rem] text-pretty leading-relaxed text-on-block/75">
            <span lang="sa" className="font-deva text-lg text-on-block">
              वेद
            </span>{" "}
            means knowledge. Coaching for Grades 8 to 12, and for JEE, NEET and KCET.
          </p>
          <dl className="mt-8 grid gap-3 text-[0.95rem]">
            {[
              ["Call", CONTACT.phone],
              ["WhatsApp", CONTACT.whatsapp],
              ["Visit", CONTACT.address],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-24 text-on-block/75">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Programs" className="md:col-span-4">
          <p className="text-[0.95rem] font-medium text-on-block/75">Programs</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {COURSES.map((c) => (
              <li key={c.slug}>
                <Link href={`/programs/${c.slug}`} className={LINK}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site" className="md:col-span-3">
          <p className="text-[0.95rem] font-medium text-on-block/75">Veda</p>
          <ul className="mt-4 grid gap-2.5">
            <li>
              <Link href="/" className={LINK}>
                Home
              </Link>
            </li>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* The divider sits inside the container, so it lines up with the columns above. */}
      <div className={container}>
        <div className="border-t border-hairline py-6 text-sm text-on-block/75">
          © {new Date().getFullYear()} Veda. [Registered name and address]
        </div>
      </div>
    </footer>
  );
}
