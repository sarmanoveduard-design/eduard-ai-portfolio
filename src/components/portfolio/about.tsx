import type { Dictionary } from "@/i18n/dictionaries";

type AboutDictionary = Dictionary["about"];

export function About({ dictionary }: { dictionary: AboutDictionary }) {
  return (
    <section id="about" aria-labelledby="about-title" className="about-section relative scroll-mt-20 border-t border-white/[0.06] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="about-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1504px]">
        <div className="mb-8 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#9ba9fb]/60"><span className="h-px w-7 bg-[#8f9df0]/50" />{dictionary.eyebrow}</div>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h2 id="about-title" className="about-title max-w-[1050px] font-medium text-[#f0f1f4]">{dictionary.title[0]}<br /><span className="text-white/42">{dictionary.title[1]}</span></h2>
            <div className="mt-12 grid max-w-[980px] gap-6 border-t border-white/[0.07] pt-8 text-[15px] leading-7 text-white/48 sm:grid-cols-2 sm:text-base sm:leading-8 lg:mt-16">
              {dictionary.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>

          <aside className="about-identity relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0b0d11]/80 p-7 sm:p-9 lg:col-span-4 lg:self-stretch">
            <div className="absolute -right-20 -top-20 size-56 rounded-full bg-[#7182dc]/[0.07] blur-3xl" />
            <div className="relative flex h-full flex-col">
              <span className="font-mono text-[8px] tracking-[0.2em] text-white/22">{dictionary.identityLabel}</span>
              <h3 className="mt-6 text-xl font-semibold tracking-[0.13em] text-white">{dictionary.name}<span className="text-[#8f9df0]">.</span></h3>
              <div className="mt-4 space-y-1 font-mono text-[10px] tracking-[0.1em] text-white/38">{dictionary.roles.map((role) => <p key={role}>{role}</p>)}</div>

              <div className="mt-9 border-t border-white/[0.07] pt-6">
                <span className="font-mono text-[8px] tracking-[0.2em] text-white/22">{dictionary.locationLabel}</span>
                <p className="mt-3 text-sm text-white/58">{dictionary.location}</p>
              </div>

              <div className="mt-8 border-t border-white/[0.07] pt-6">
                <span className="font-mono text-[8px] tracking-[0.2em] text-white/22">{dictionary.focusLabel}</span>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {dictionary.focus.map((item) => <li key={item} className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 font-mono text-[8px] tracking-[0.08em] text-white/38">{item}</li>)}
                </ul>
              </div>

              <div aria-hidden="true" className="about-system mt-auto hidden pt-10 lg:block"><span /><span /><span /><span /></div>
            </div>
          </aside>
        </div>

        <div className="about-principle mt-10 grid gap-4 rounded-[18px] border border-white/[0.07] bg-white/[0.015] px-6 py-6 sm:grid-cols-[180px_1fr] sm:items-center sm:px-8">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[#9ba9fb]/50">{dictionary.principleLabel}</span>
          <p className="text-sm leading-6 text-white/52 sm:text-[15px]">{dictionary.principle}</p>
        </div>
      </div>
    </section>
  );
}
