import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollMotion } from "@/components/scroll-motion";
import { Hero } from "@/components/hero";
import { HomePrograms } from "@/components/home-programs";
import { WhyVeda } from "@/components/why-veda";
import { ResultsCarousel } from "@/components/results-carousel";
import { Faq } from "@/components/faq";
import ContactSection from "@/components/ui/contact-section";
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
        {/* Light, like the sections above: Results (when there are results), FAQ and
            Contact, each a shade apart. The dark footer closes the page. */}
        <ResultsCarousel />
        <Faq />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
