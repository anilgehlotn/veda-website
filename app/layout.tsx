import type { Metadata } from "next";
import { EB_Garamond, Geist, Noto_Serif_Devanagari, Rozha_One, Tiro_Devanagari_Hindi } from "next/font/google";
import { PageTransitionProvider } from "@/components/page-transition";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import "./globals.css";

// Headline serif: bookish and academic, chosen for "knowledge".
const heading = EB_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-heading",
  display: "swap",
});

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// High-contrast Devanagari display face for the वेद mark.
const devanagari = Rozha_One({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-devanagari",
  display: "swap",
});

// Bold, solid Devanagari for the large वेद over the hero photo.
const devaDisplay = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: "700",
  variable: "--font-noto-deva",
  display: "swap",
});

const description =
  "Coaching for Grades 8 to 12 for school boards, NEET, JEE and KCET. A test every week, AI finds each student's weak topics, and teachers focus on them.";

// Rozha One draws Devanagari digits as Western numerals, so ८ ९ १० use this face.
const devaNumerals = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  variable: "--font-deva-numerals",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veda | Coaching for Grades 8 to 12",
  description,
  openGraph: {
    title: "Veda | Coaching for Grades 8 to 12",
    description,
    siteName: "Veda",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${heading.variable} ${body.variable} ${devanagari.variable} ${devaNumerals.variable} ${devaDisplay.variable}`}>
      <body className="font-sans">
        <PageTransitionProvider>{children}</PageTransitionProvider>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
