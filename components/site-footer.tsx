import Link from "next/link";
import { COURSES } from "@/lib/courses";
import { CONTACT, NAV_LINKS } from "@/lib/site";
import { container } from "./sections";

/*
  Dark, the same espresso brown as the Contact section and the closing sections of the
  Programs pages above it, so every page ends in one continuous dark chapter.
*/
export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-on-block/12 bg-block text-on-block [color-scheme:dark]">
      <div className={`${container} grid gap-12 py-16 md:grid-cols-12 lg:py-20`}>
        <div className="md:col-span-5">
          <Link href="/" className="font-serif text-3xl font-semibold tracking-tight">
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
                <Link href={`/programs/${c.slug}`} className="underline-offset-4 hover:underline">
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
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className={`${container} border-t border-on-block/12 py-6 text-sm text-on-block/75`}>
        © {new Date().getFullYear()} Veda. [Registered name and address]
      </div>
    </footer>
  );
}
