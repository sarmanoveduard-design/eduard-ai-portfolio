import { ArrowRight, Bot, CircleAlert, CircleHelp, Layers3, ListChecks, MessageSquareText, Sparkles, UserRound, WandSparkles } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ArchitectureNodeType, AuditResult } from "@/lib/ai/schemas";

type AuditDictionary = Dictionary["audit"];

const nodeStyles: Record<ArchitectureNodeType, string> = {
  source: "border-sky-300/20 bg-sky-300/[0.045] text-sky-100/70",
  process: "border-white/12 bg-white/[0.025] text-white/62",
  ai: "border-[#a9b5ff]/30 bg-[#7c8ee8]/[0.09] text-[#dce1ff] shadow-[0_0_30px_rgba(114,134,230,0.08)]",
  data: "border-emerald-300/20 bg-emerald-300/[0.04] text-emerald-100/65",
  integration: "border-violet-300/20 bg-violet-300/[0.045] text-violet-100/65",
  human: "border-amber-200/20 bg-amber-200/[0.04] text-amber-100/65",
};

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-white/50">
          <span className="mt-2.5 size-1 shrink-0 rounded-full bg-[#9eacff]/65" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AiAuditResult({ result, dictionary }: { result: AuditResult; dictionary: AuditDictionary }) {
  return (
    <div className="space-y-5">
      <article className="audit-panel relative overflow-hidden rounded-[22px] border border-[#a6b3ff]/[0.14] bg-[#0b0d12]/95 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-[#7487eb]/[0.08] blur-3xl" />
        <div className="relative flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-[#b6c0ff]/65">
          <MessageSquareText size={13} />{dictionary.sections.plainLanguage}
        </div>
        <div className="relative mt-6 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 lg:col-span-3">
            <h3 className="flex items-center gap-2 text-xs font-medium text-white/55"><Sparkles size={14} className="text-[#9facff]/60" />{dictionary.sections.currentProcess}</h3>
            <p className="mt-3 text-[15px] leading-7 text-white/68">{result.plainLanguage.currentProcess}</p>
          </section>
          {([
            [dictionary.sections.whatCanBeAutomated, result.plainLanguage.whatCanBeAutomated, WandSparkles],
            [dictionary.sections.aiRole, result.plainLanguage.aiRole, Bot],
            [dictionary.sections.humanRole, result.plainLanguage.humanRole, UserRound],
          ] as const).map(([title, items, Icon]) => (
            <section key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
              <h3 className="flex items-center gap-2 text-xs font-medium text-white/55"><Icon size={14} className="text-[#9facff]/60" />{title}</h3>
              <TextList items={[...items]} />
            </section>
          ))}
        </div>
      </article>

      <div className="audit-result-grid grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
      <div className="space-y-5">
        <article className="audit-panel rounded-[22px] border border-white/[0.08] bg-[#0b0d12]/90 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-[#a4b0fa]/55"><Sparkles size={13} />{dictionary.sections.summary}</div>
          <p className="mt-5 text-base leading-7 text-white/66 sm:text-lg sm:leading-8">{result.summary}</p>
        </article>

        <article className="audit-panel rounded-[22px] border border-white/[0.08] bg-[#0b0d12]/90 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-[#a4b0fa]/55"><ListChecks size={13} />{dictionary.sections.opportunities}</div>
          <ol className="mt-6 space-y-6">
            {result.automationOpportunities.map((item, index) => (
              <li key={`${item.title}-${index}`} className="grid grid-cols-[28px_1fr] gap-3 border-t border-white/[0.06] pt-5 first:border-0 first:pt-0">
                <span className="font-mono text-[10px] text-[#9facff]/45">0{index + 1}</span>
                <div><h3 className="font-medium tracking-[-0.02em] text-white/82">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/44">{item.description}</p></div>
              </li>
            ))}
          </ol>
        </article>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="audit-panel rounded-[22px] border border-white/[0.08] bg-[#0b0d12]/90 p-6">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-white/35"><Layers3 size={13} />{dictionary.sections.requirements}</div>
            <TextList items={result.requirements} />
          </article>
          <article className="audit-panel rounded-[22px] border border-white/[0.08] bg-[#0b0d12]/90 p-6">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-white/35"><CircleHelp size={13} />{dictionary.sections.questions}</div>
            <TextList items={result.questions} />
          </article>
        </div>
      </div>

      <div className="space-y-5 xl:sticky xl:top-24 xl:self-start">
        <article className="audit-architecture relative overflow-hidden rounded-[22px] border border-[#9fabf5]/[0.13] bg-[#0a0c11] p-6 sm:p-8">
          <div className="audit-mini-grid pointer-events-none absolute inset-0" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="font-mono text-[9px] tracking-[0.18em] text-[#a4b0fa]/55">{dictionary.sections.architecture}</div>
            <span className="font-mono text-[8px] tracking-[0.14em] text-white/20">{result.architecture.length} NODES</span>
          </div>
          <ol className="relative mt-8 space-y-2" aria-label={dictionary.sections.architecture}>
            {result.architecture.map((node, index) => (
              <li key={`${node.label}-${index}`} className="group relative pb-6 last:pb-0">
                {index < result.architecture.length - 1 && <span aria-hidden="true" className="audit-node-line absolute bottom-0 left-5 top-10 w-px bg-white/[0.08]" />}
                <div className={`relative flex min-h-11 items-center gap-4 rounded-xl border px-4 py-3 ${nodeStyles[node.type]}`}>
                  <span className="flex size-3 shrink-0 items-center justify-center rounded-full border border-current/30"><span className="size-1 rounded-full bg-current" /></span>
                  <span className="min-w-0 text-sm leading-5">{node.label}</span>
                  <span className="ml-auto shrink-0 font-mono text-[7px] uppercase tracking-[0.14em] opacity-45">{node.type}</span>
                </div>
              </li>
            ))}
          </ol>
        </article>

        {result.risks.length > 0 && (
          <article className="audit-panel rounded-[22px] border border-amber-200/[0.09] bg-amber-100/[0.018] p-6">
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-amber-100/45"><CircleAlert size={13} />{dictionary.sections.risks}</div>
            <TextList items={result.risks} />
          </article>
        )}

        <aside className="rounded-[22px] border border-[#a4b1ff]/[0.15] bg-[#7889df]/[0.055] p-6 sm:p-7">
          <p className="text-lg font-medium tracking-[-0.025em] text-white/86">{dictionary.ctaTitle}</p>
          <p className="mt-3 text-sm leading-6 text-white/42">{result.nextStep}</p>
          <a href="#contact" className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#090a0c] outline-none transition hover:bg-[#dfe3ff] focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#11131a]">{dictionary.ctaButton}<ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" /></a>
        </aside>
      </div>
      </div>
    </div>
  );
}
