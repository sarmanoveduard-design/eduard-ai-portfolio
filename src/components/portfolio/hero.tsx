"use client";

import { ArrowDown, ArrowRight, ExternalLink } from "lucide-react";
import { MotionConfig, motion } from "motion/react";
import { type MouseEvent, useRef } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { AiNetwork } from "./ai-network";

const technologies = ["Next.js", "FastAPI", "Python", "TypeScript", "PostgreSQL", "RAG", "LLM Agents"];

export function Hero({ dictionary }: { dictionary: Dictionary["hero"] }) {
  const heroRef = useRef<HTMLElement>(null);
  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    heroRef.current.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  };

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <MotionConfig reducedMotion="user">
    <section ref={heroRef} id="top" onMouseMove={handlePointerMove} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-30" />
      <div className="hero-noise pointer-events-none absolute inset-0 -z-20" />
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10 transition-[background] duration-300" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="pointer-events-none absolute inset-y-[13%] right-[-5%] -z-10 w-[54%] opacity-80 lg:right-[1%] lg:w-[46%] xl:w-[43%] 2xl:right-[5%] 2xl:w-[40%] max-md:inset-x-[14%] max-md:top-[50%] max-md:h-[44%] max-md:w-auto max-md:opacity-25"><AiNetwork /></div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pt-[clamp(8rem,17vh,12rem)] sm:px-8 lg:px-12">
        <div className="relative z-10 max-w-[970px]">
          <motion.div {...enter(.05)} className="mb-7 flex items-center gap-3 sm:mb-8">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-30" /><span className="relative inline-flex size-2 rounded-full bg-emerald-300/90" /></span>
            <span className="font-mono text-[10px] font-medium tracking-[0.18em] text-white/52 sm:text-[11px]">{dictionary.status}</span>
          </motion.div>
          <motion.h1 id="hero-title" {...enter(.13)} className="display-title max-w-[1000px] font-medium text-[#f3f3f5]">
            {dictionary.titleBefore}<span className="title-accent">{dictionary.titleAccent}</span><br />{dictionary.titleAfter}
          </motion.h1>
          <motion.div {...enter(.22)} className="mt-7 max-w-[690px] sm:mt-9">
            <div className="space-y-3 text-[15px] leading-6 text-white/65 sm:text-[17px] sm:leading-7">
              {dictionary.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.06em] text-white/40 sm:text-[11px]">{dictionary.path[0]} <span className="mx-1 text-[#93a1f4]">→</span> {dictionary.path[1]} <span className="mx-1 text-[#93a1f4]">→</span> {dictionary.path[2]}.</p>
          </motion.div>
          <motion.div {...enter(.3)} className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9">
            <a href="#projects" className="group flex h-12 items-center gap-2.5 rounded-full bg-[#f3f3f5] px-5 text-sm font-semibold text-[#090a0c] outline-none transition duration-300 hover:-translate-y-0.5 hover:bg-[#dfe3ff] hover:shadow-[0_12px_35px_rgba(117,135,229,0.14)] focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]">{dictionary.explore} <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" /></a>
            <a href="#ai-audit" className="flex h-12 items-center rounded-full border border-white/[0.13] bg-white/[0.035] px-5 text-sm font-medium text-white/78 outline-none backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07] hover:text-white focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]">{dictionary.discuss}</a>
            <a href="https://github.com/sarmanoveduard-design" target="_blank" rel="noopener noreferrer" className="ml-1 flex h-10 items-center gap-1.5 rounded-sm px-2 text-sm text-white/45 outline-none transition hover:text-white focus-visible:ring-2 focus-visible:ring-[#9eacff]">{dictionary.github} <ExternalLink size={12} /></a>
          </motion.div>
          <motion.ul {...enter(.38)} aria-label={dictionary.technologiesLabel} className="mt-8 flex max-w-[760px] flex-wrap items-center gap-y-2 sm:mt-10">
            {technologies.map((technology, index) => <li key={technology} className="flex items-center font-mono text-[9px] tracking-[0.08em] text-white/32 sm:text-[10px]">{index > 0 && <span aria-hidden="true" className="mx-2.5 size-0.5 rounded-full bg-white/20 sm:mx-3.5" />}{technology}</li>)}
          </motion.ul>
        </div>
        <motion.a {...enter(.48)} href="#projects" aria-label={dictionary.scrollLabel} className="group relative z-10 mt-auto flex items-end justify-between border-t border-white/[0.07] pb-5 pt-5 text-white outline-none sm:pb-6 sm:pt-6">
          <div className="flex items-center gap-3"><span className="font-mono text-[9px] tracking-[0.2em] text-white/25">01</span><span className="text-xs font-medium tracking-[0.11em] text-white/48 uppercase transition-colors group-hover:text-white/80">{dictionary.selectedWork}</span></div>
          <div className="flex items-center gap-4"><span className="hidden font-mono text-[8px] tracking-[0.18em] text-white/20 uppercase sm:block">{dictionary.scroll}</span><span className="scroll-line relative h-7 w-px overflow-hidden bg-white/10" /><ArrowDown size={13} className="text-white/35 transition-transform group-hover:translate-y-1" /></div>
        </motion.a>
      </div>
    </section>
    </MotionConfig>
  );
}
