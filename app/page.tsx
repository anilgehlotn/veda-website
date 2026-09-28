import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollMotion } from "@/components/scroll-motion";
import { Hero } from "@/components/hero";
import { HomePrograms } from "@/components/home-programs";
import { WhyVeda } from "@/components/why-veda";
import ContactWithGlobe from "@/components/ui/contact-with-globe";

export default function Home() {
  return (
    <div className="relative">
      <SiteHeader />
      <main id="main">
        {/* GSAP scroll motion for the light sections. Contact animates with Motion, so it
            stays outside this tree and the two libraries never touch the same elements. */}
        <ScrollMotion>
          <Hero />
          <HomePrograms />
          <WhyVeda />
        </ScrollMotion>
        {/* Contact and the footer are one dark closing chapter. The form is #book-demo. */}
        <ContactWithGlobe />
      </main>
      <SiteFooter />
    </div>
  );
}
