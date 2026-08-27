import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, GitBranch, Mail, MessageCircle, Phone, Send } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { contactLinks, getWhatsAppLink } from "./contact-links";

type ContactDictionary = Dictionary["contact"];

type ContactCardProps = {
  href: string;
  label: string;
  value: string;
  icon: ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary" | "compact";
};

function ContactCard({ href, label, value, icon, external = false, variant = "compact" }: ContactCardProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={`${label}: ${value}`}
      className={`contact-card group relative flex min-w-0 overflow-hidden rounded-[22px] border outline-none focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090a0d] ${variant === "primary" ? "contact-card-primary min-h-[270px] flex-col justify-between p-7 sm:p-9" : variant === "secondary" ? "min-h-[270px] flex-col justify-between p-7 sm:p-9" : "min-h-[150px] flex-col justify-between p-6"}`}
    >
      <div className="contact-card-glow pointer-events-none absolute -right-20 -top-24 size-64 rounded-full blur-3xl" />
      <div className="relative flex items-start justify-between">
        <span className="contact-icon flex size-11 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.035] text-white/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">{icon}</span>
        {external ? <ArrowUpRight size={17} className="text-white/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/60" /> : <ArrowRight size={17} className="text-white/25 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/60" />}
      </div>
      <div className="relative mt-8 min-w-0">
        <h3 className={`${variant === "compact" ? "text-lg" : "text-2xl sm:text-3xl"} font-medium tracking-[-0.035em] text-white`}>{label}</h3>
        <p className={`mt-2 max-w-full font-mono tracking-[0.04em] text-white/38 ${variant === "compact" ? "break-all text-[10px]" : "text-[11px] sm:text-xs"}`}>{value}</p>
      </div>
    </a>
  );
}

export function Contact({ dictionary }: { dictionary: ContactDictionary }) {
  const whatsappHref = getWhatsAppLink(dictionary.whatsappMessage);

  return (
    <section id="contact" aria-labelledby="contact-title" className="contact-section relative scroll-mt-20 overflow-hidden border-t border-white/[0.06] px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32 lg:px-12 lg:pb-36 lg:pt-40">
      <div className="contact-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-[20%] size-[42rem] -translate-x-1/2 rounded-full bg-[#6c7fdc]/[0.055] blur-3xl" />
      <div className="relative mx-auto max-w-[1504px]">
        <header className="mx-auto max-w-[1050px] text-center">
          <div className="mb-7 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#a1aefd]/65"><span className="h-px w-7 bg-[#8f9df0]/50" />{dictionary.eyebrow}<span className="h-px w-7 bg-[#8f9df0]/50" /></div>
          <h2 id="contact-title" className="contact-title font-medium text-[#f3f4f7]">{dictionary.title[0]}<br /><span className="title-accent">{dictionary.title[1]}</span></h2>
          <p className="mx-auto mt-7 max-w-[720px] text-[15px] leading-7 text-white/52 sm:text-base">{dictionary.intro}</p>
        </header>

        <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-7"><ContactCard href={whatsappHref} label={dictionary.whatsapp} value={contactLinks.phoneDisplay} icon={<MessageCircle size={20} />} external variant="primary" /></div>
          <div className="lg:col-span-5"><ContactCard href={contactLinks.telegram} label={dictionary.telegram} value={contactLinks.telegramDisplay} icon={<Send size={19} />} external variant="secondary" /></div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-12">
            <ContactCard href={contactLinks.phone} label={dictionary.call} value={contactLinks.phoneDisplay} icon={<Phone size={18} />} />
            <ContactCard href={contactLinks.email} label={dictionary.email} value={contactLinks.emailDisplay} icon={<Mail size={18} />} />
            <ContactCard href={contactLinks.github} label={dictionary.github} value={contactLinks.githubDisplay} icon={<GitBranch size={18} />} external />
          </div>
        </div>
      </div>
    </section>
  );
}
