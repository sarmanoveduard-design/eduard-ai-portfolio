import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { ExpertiseVisual } from "./expertise-visuals";

type ExpertiseDictionary = Dictionary["expertise"];

const cardSpans = [
  "xl:col-span-7",
  "xl:col-span-5",
  "xl:col-span-3",
  "xl:col-span-3",
  "xl:col-span-3",
  "xl:col-span-3",
];

export function Expertise({ dictionary }: { dictionary: ExpertiseDictionary }) {
  return (
    <section id="expertise" aria-labelledby="expertise-title" className="expertise-section relative scroll-mt-20 border-t border-white/[0.06] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="expertise-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1504px]">
        <header className="grid gap-7 pb-14 md:grid-cols-[1fr_0.7fr] md:items-end md:pb-20">
          <div>
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#9ba9fb]/60"><span className="h-px w-7 bg-[#8f9df0]/50" />{dictionary.eyebrow}</div>
            <h2 id="expertise-title" className="work-title max-w-[820px] font-medium text-[#f0f1f4]">{dictionary.title[0]}<br /><span className="text-white/42">{dictionary.title[1]}</span></h2>
          </div>
          <p className="max-w-[520px] text-[15px] leading-7 text-white/48 md:justify-self-end sm:text-base">{dictionary.intro}</p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
          {dictionary.services.map((service, index) => (
            <article key={service.title} className={`expertise-card group flex min-w-0 flex-col rounded-[22px] border border-white/[0.075] bg-white/[0.018] p-3 sm:p-4 ${cardSpans[index]}`}>
              <div className={`${index < 2 ? "min-h-[164px]" : "min-h-[118px]"}`}><ExpertiseVisual kind={service.visual} /></div>
              <div className="flex flex-1 flex-col px-3 pb-4 pt-6 sm:px-4 sm:pb-5">
                <div className="mb-6 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.18em] text-[#9facff]/50">SERVICE</span><span className="font-mono text-[10px] text-white/18">0{index + 1}</span></div>
                <h3 className={`font-medium tracking-[-0.035em] text-white ${index < 2 ? "text-2xl sm:text-3xl" : "text-xl"}`}>{service.title}</h3>
                <p className="mt-4 text-[14px] leading-6 text-white/44">{service.description}</p>
                <ul aria-label={dictionary.examplesLabel} className="mt-6 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/[0.055] pt-5">
                  {service.examples.map((example) => <li key={example} className="flex min-w-0 items-start gap-2 text-[11px] leading-4 text-white/35"><span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#96a5fa]/45" /><span>{example}</span></li>)}
                </ul>
                <ul aria-label={dictionary.stackLabel} className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-7">
                  {service.tech.map((item) => <li key={item} className="font-mono text-[8px] tracking-[0.08em] text-white/24">{item}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <aside className="expertise-cta relative mt-8 overflow-hidden rounded-[24px] border border-[#9aa8f5]/[0.13] bg-[#0d0f15] px-6 py-8 sm:px-10 sm:py-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-12">
          <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-[#7284e6]/[0.1] blur-3xl" />
          <div className="relative max-w-[760px]">
            <h3 className="text-2xl font-medium tracking-[-0.035em] text-white sm:text-3xl">{dictionary.cta.title}</h3>
            <p className="mt-3 max-w-[690px] text-sm leading-6 text-white/42 sm:text-[15px]">{dictionary.cta.text}</p>
          </div>
          <a href="#contact" className="group relative mt-7 inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-white px-5 text-sm font-semibold text-[#090a0c] outline-none transition duration-300 hover:bg-[#dfe3ff] focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0f15] lg:ml-10 lg:mt-0">{dictionary.cta.button}<ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></a>
        </aside>
      </div>
    </section>
  );
}
