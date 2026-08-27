import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { ProjectVisual } from "./project-visuals";

type WorkDictionary = Dictionary["work"];

function TechList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => <li key={item} className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 font-mono text-[8px] tracking-[0.08em] text-white/38 sm:text-[9px]">{item}</li>)}
    </ul>
  );
}

function RepositoryLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group/link inline-flex items-center gap-2 rounded-sm text-sm font-medium text-white/60 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0b0e]">
      {label}<ArrowUpRight size={15} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
    </a>
  );
}

export function SelectedWork({ dictionary }: { dictionary: WorkDictionary }) {
  const [featured, ...projects] = dictionary.projects;

  return (
    <section id="projects" aria-labelledby="work-title" className="selected-work relative scroll-mt-20 border-t border-white/[0.06] bg-[#0a0b0e] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <div className="work-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1504px]">
        <header className="grid gap-7 border-b border-white/[0.07] pb-14 md:grid-cols-[1fr_0.7fr] md:items-end md:pb-20">
          <div>
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#9ba9fb]/60"><span className="h-px w-7 bg-[#8f9df0]/50" />{dictionary.eyebrow}</div>
            <h2 id="work-title" className="work-title max-w-[820px] font-medium text-[#f0f1f4]">{dictionary.title[0]}<br /><span className="text-white/42">{dictionary.title[1]}</span></h2>
          </div>
          <p className="max-w-[520px] text-[15px] leading-7 text-white/45 md:justify-self-end sm:text-base">{dictionary.intro}</p>
        </header>

        <article className="project-card group mt-10 grid gap-5 rounded-[28px] border border-white/[0.08] bg-[#0c0e12]/80 p-3 sm:mt-14 sm:p-5 lg:grid-cols-[0.94fr_1.06fr] lg:gap-8 lg:p-7">
          <div className="flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="mb-9 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.18em] text-[#9facff]/60">{featured.category}</span><span className="font-mono text-[11px] text-white/18">01</span></div>
            <h3 className="max-w-[560px] text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">{featured.title}</h3>
            <p className="mt-6 max-w-[600px] text-[15px] leading-7 text-white/50">{featured.context}</p>
            {"built" in featured && <p className="mt-4 max-w-[600px] text-sm leading-6 text-white/34">{featured.built}</p>}
            {"metrics" in featured && (
              <div className="my-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
                {featured.metrics.map((metric) => <div key={metric} className="bg-[#0b0d11] px-4 py-4"><span className="block font-mono text-[11px] text-white/75">{metric}</span><span className="mt-1 block font-mono text-[7px] tracking-[0.12em] text-white/22">{featured.metricNote}</span></div>)}
              </div>
            )}
            <div className="mt-auto"><TechList items={featured.tech} label={dictionary.stackLabel} /><div className="mt-8"><RepositoryLink href={featured.github} label={dictionary.repository} /></div></div>
          </div>
          <ProjectVisual kind={featured.visual} />
        </article>

        <div className="mt-5 space-y-5 sm:mt-7 sm:space-y-7">
          {projects.map((project, index) => (
            <article key={project.title} className="project-card group grid overflow-hidden rounded-[24px] border border-white/[0.075] bg-[#0c0e12]/65 lg:grid-cols-2">
              <div className={`min-w-0 p-7 sm:p-10 lg:p-12 ${index % 2 ? "lg:order-2" : ""}`}>
                <div className="mb-10 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.17em] text-[#9facff]/55">{project.category}</span><span className="font-mono text-[11px] text-white/18">0{index + 2}</span></div>
                <h3 className="max-w-[580px] text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">{project.title}</h3>
                <p className="mt-5 max-w-[620px] text-[15px] leading-7 text-white/45">{project.context}</p>
                <div className="mt-8"><TechList items={project.tech} label={dictionary.stackLabel} /></div>
                <div className="mt-10"><RepositoryLink href={project.github} label={dictionary.repository} /></div>
              </div>
              <div className={`min-h-[320px] border-white/[0.06] p-3 sm:p-5 lg:min-h-[430px] ${index % 2 ? "lg:order-1 lg:border-r" : "lg:border-l"}`}><ProjectVisual kind={project.visual} /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
