"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./language-switcher";

type NavbarProps = {
  locale: Locale;
  dictionary: Dictionary["nav"];
};

export function Navbar({ locale, dictionary }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const links = [
    { label: dictionary.projects, href: "#projects" },
    { label: dictionary.expertise, href: "#expertise" },
    { label: dictionary.about, href: "#about" },
    { label: dictionary.contact, href: "#contact" },
  ];

  return (
    <MotionConfig reducedMotion="user">
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${scrolled || open ? "border-white/[0.07] bg-[#08090b]/80 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
      <nav aria-label={dictionary.label} className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="Eduard Sarmanov, home" className="group rounded-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]">
          <span className="block text-[13px] font-semibold tracking-[0.14em] lg:hidden">E. SARMANOV<span className="text-[#8d9cff] transition-colors group-hover:text-[#b7c0ff]">.</span></span>
          <span className="hidden lg:block">
            <span className="block text-[13px] font-semibold tracking-[0.14em]">EDUARD SARMANOV<span className="text-[#8d9cff] transition-colors group-hover:text-[#b7c0ff]">.</span></span>
            <span className="mt-1 block font-mono text-[7px] font-medium tracking-[0.2em] text-white/28">AI SYSTEMS ARCHITECT</span>
          </span>
        </a>
        <div className="hidden items-center gap-5 md:flex lg:gap-8">
          <div className="flex items-center gap-4 lg:gap-7">
            {links.map((link) => <a key={link.label} href={link.href} className="rounded-sm text-sm text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff]">{link.label}</a>)}
          </div>
          <LanguageSwitcher locale={locale} />
          <a href="#contact" className="rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-medium text-[#0b0c0e] transition duration-300 hover:-translate-y-0.5 hover:bg-[#dfe3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]">{dictionary.talk}</a>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} />
          <button type="button" aria-label={open ? dictionary.closeMenu : dictionary.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white outline-none transition hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[#9eacff]">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed inset-x-0 top-[72px] h-[calc(100svh-72px)] border-t border-white/[0.06] bg-[#08090b]/95 px-5 py-10 backdrop-blur-2xl md:hidden">
            <div className="flex h-full flex-col justify-between">
              <div className="flex flex-col">
                {links.map((link, index) => (
                  <motion.a key={link.label} href={link.href} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .05 }} className="border-b border-white/[0.07] py-5 text-2xl font-medium tracking-tight text-white/80 outline-none focus-visible:text-[#aab6ff]">
                    <span className="mr-4 font-mono text-[10px] text-[#8694e8]">0{index + 1}</span>{link.label}
                  </motion.a>
                ))}
              </div>
              <a href="#contact" onClick={() => setOpen(false)} className="flex h-14 items-center justify-center rounded-full bg-white text-sm font-semibold text-black outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff]">{dictionary.talk}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </MotionConfig>
  );
}
