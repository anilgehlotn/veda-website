import whatsappMark from "simple-icons/icons/whatsapp.svg";
import { cn } from "@/lib/utils";

/**
 * The official WhatsApp mark from the simple-icons package, as its static SVG file.
 * (The package's JavaScript entry holds all ~3,400 icons in one 5 MB module, too heavy for
 * the browser; the file is a few hundred bytes.) It is drawn through a CSS mask, so it
 * takes the text colour of wherever it sits. Decorative: always next to a visible or
 * screen-reader label.
 */
// Depending on the bundler, a static .svg import is a URL string or { src } (sometimes under default).
type SvgImport = string | { src?: string; default?: string | { src?: string } };
const markSrc = (() => {
  const m = whatsappMark as unknown as SvgImport;
  if (typeof m === "string") return m;
  if (m.src) return m.src;
  return typeof m.default === "string" ? m.default : (m.default?.src ?? "");
})();

export function WhatsAppLogo({ className }: { className?: string }) {
  const url = `url("${markSrc}")`;
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
