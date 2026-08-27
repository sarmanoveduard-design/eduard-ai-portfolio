import type { Dictionary } from "@/i18n/dictionaries";
import { contactLinks } from "./contact-links";

export function Footer({ dictionary }: { dictionary: Dictionary["contact"] }) {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-[#07080a] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-[1504px] gap-9 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.15em] text-white/70">EDUARD SARMANOV<span className="text-[#8f9df0]">.</span></p>
          <p className="mt-1.5 font-mono text-[7px] tracking-[0.2em] text-white/24">AI SYSTEMS ARCHITECT</p>
          <p className="mt-6 text-xs text-white/30">South Korea · Remote</p>
        </div>
        <div className="sm:text-right">
          <nav aria-label="Contact links" className="flex flex-wrap gap-x-5 gap-y-3 sm:justify-end">
            <a href={contactLinks.github} target="_blank" rel="noopener noreferrer" className="text-xs text-white/38 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-[#aab6ff]">{dictionary.github}</a>
            <a href={contactLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-xs text-white/38 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-[#aab6ff]">{dictionary.telegram}</a>
            <a href={contactLinks.email} className="text-xs text-white/38 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-[#aab6ff]">{dictionary.email}</a>
          </nav>
          <p className="mt-6 font-mono text-[8px] tracking-[0.12em] text-white/18">© {year} Eduard Sarmanov</p>
        </div>
      </div>
    </footer>
  );
}
