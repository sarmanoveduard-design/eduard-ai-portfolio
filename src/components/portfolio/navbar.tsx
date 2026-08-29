"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { type MouseEvent, useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { scrollToSection } from "@/lib/section-navigation";
import { getWhatsAppLink } from "./contact-links";
import { LanguageSwitcher } from "./language-switcher";

type NavbarProps = {
  locale: Locale;
  dictionary: Dictionary["nav"];
  whatsappMessage: Dictionary["contact"]["whatsappMessage"];
};

type NavbarWhatsAppCtaProps = {
  href: string;
  label: string;
  mobile?: boolean;
  onClick?: () => void;
};

type NavbarSectionLinkProps = {
  id: string;
  label: string;
  accent?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type NavbarMobileSectionLinkProps = NavbarSectionLinkProps & {
  index: number;
};

export function NavbarSectionLink({ id, label, accent = false, onClick }: NavbarSectionLinkProps) {
  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      className={`rounded-sm text-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff] ${accent ? "text-[#aab6ff]" : "text-white/55"}`}
    >
      {label}
    </a>
  );
}

export function NavbarMobileSectionLink({ id, label, accent = false, index, onClick }: NavbarMobileSectionLinkProps) {
  return (
    <motion.a href={`#${id}`} onClick={onClick} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .05 }} className={`border-b border-white/[0.07] py-4 text-2xl font-medium tracking-tight outline-none focus-visible:text-[#aab6ff] ${accent ? "text-[#aab6ff]" : "text-white/80"}`}>
      <span className="mr-4 font-mono text-[10px] text-[#8694e8]">0{index + 1}</span>{label}
    </motion.a>
  );
}

export function NavbarWhatsAppCta({ href, label, mobile = false, onClick }: NavbarWhatsAppCtaProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      data-testid={mobile ? "navbar-cta-mobile" : "navbar-cta-desktop"}
      className={mobile
        ? "flex h-14 items-center justify-center rounded-full bg-white text-sm font-semibold text-black outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff]"
        : "rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-medium text-[#0b0c0e] transition duration-300 hover:-translate-y-0.5 hover:bg-[#dfe3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]"}
    >
      {label}
    </a>
  );
}

export function Navbar({ locale, dictionary, whatsappMessage }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const whatsappHref = getWhatsAppLink(whatsappMessage);

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
    { label: dictionary.projects, id: "projects" },
    { label: dictionary.expertise, id: "expertise" },
    { label: dictionary.audit, id: "ai-audit", accent: true },
    { label: dictionary.about, id: "about" },
    { label: dictionary.contact, id: "contact" },
  ];

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string, closeMenu = false) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!document.getElementById(id)) return;

    event.preventDefault();
    if (closeMenu) {
      setOpen(false);
      window.requestAnimationFrame(() => scrollToSection(id));
      return;
    }
    scrollToSection(id);
  };

  return (
    <MotionConfig reducedMotion="user">
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${scrolled || open ? "border-white/[0.07] bg-[#08090b]/80 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
      <nav aria-label={dictionary.label} className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label="Eduard Sarmanov, home" className="group rounded-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]">
          <span className="block text-[13px] font-semibold tracking-[0.14em] xl:hidden">Eduard<span className="text-[#8d9cff] transition-colors group-hover:text-[#b7c0ff]">.S</span></span>
          <span className="hidden xl:block">
            <span className="block text-[13px] font-semibold tracking-[0.14em]">EDUARD SARMANOV<span className="text-[#8d9cff] transition-colors group-hover:text-[#b7c0ff]">.</span></span>
            <span className="mt-1 block font-mono text-[7px] font-medium tracking-[0.2em] text-white/28">AI SYSTEMS ARCHITECT</span>
          </span>
        </a>
        <div className="hidden items-center gap-4 lg:flex xl:gap-7">
          <div className="flex items-center gap-3 xl:gap-6">
            {links.map((link) => <NavbarSectionLink key={link.label} id={link.id} label={link.label} accent={link.accent} onClick={(event) => handleSectionClick(event, link.id)} />)}
          </div>
          <LanguageSwitcher locale={locale} />
          <NavbarWhatsAppCta href={whatsappHref} label={dictionary.talk} />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher locale={locale} />
          <button type="button" aria-label={open ? dictionary.closeMenu : dictionary.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white outline-none transition hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[#9eacff]">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed inset-x-0 top-[72px] h-[calc(100svh-72px)] overflow-y-auto border-t border-white/[0.06] bg-[#08090b]/95 px-5 py-7 backdrop-blur-2xl lg:hidden sm:px-8">
            <div className="flex h-full flex-col justify-between">
              <div className="flex flex-col">
                {links.map((link, index) => <NavbarMobileSectionLink key={link.label} id={link.id} label={link.label} accent={link.accent} index={index} onClick={(event) => handleSectionClick(event, link.id, true)} />)}
              </div>
              <NavbarWhatsAppCta href={whatsappHref} label={dictionary.talk} mobile onClick={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </MotionConfig>
  );
}
