import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollMotion } from "@/components/scroll-motion";
import { Hero } from "@/components/hero";
import { HomePrograms } from "@/components/home-programs";
import { WhyVeda } from "@/components/why-veda";
import { Results } from "@/components/results";
import { Faq } from "@/components/faq";
import ContactWithGlobe from "@/components/ui/contact-with-globe";
import { HAS_RESULTS } from "@/data/results";
import { faqJsonLd } from "@/data/faq";

export default function Home() {
  // FAQPage structured data, finished answers only (see data/faq.ts).
  const faqLd = faqJsonLd();

  return (
    <div className="relative">
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
        />
      )}
      <SiteHeader />
      <main id="main">
        {/* GSAP scroll motion for the light sections. Results, FAQ and Contact animate
            with Motion, so they stay outside this tree and the two libraries never
            touch the same elements. */}
        <ScrollMotion>
          <Hero />
          <HomePrograms />
          <WhyVeda />
        </ScrollMotion>
        {/* One dark closing chapter: Results (when there are results), FAQ, Contact,
            footer. Whichever comes first carries the single light-to-dark edge. */}
        <Results />
        <Faq opensDarkChapter={!HAS_RESULTS} />
        <ContactWithGlobe opensDarkChapter={false} />
      </main>
      <SiteFooter />
    </div>
  );
}
