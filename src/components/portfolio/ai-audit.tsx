"use client";

import Script from "next/script";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, LockKeyhole, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { MAX_AUDIT_INPUT, MIN_AUDIT_INPUT, TURNSTILE_ACTION, isMeaningfulAuditInput, type AuditResult } from "@/lib/ai/schemas";
import { AiAuditResult } from "./ai-audit-result";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type AuditDictionary = Dictionary["audit"];
type ErrorCode = "INVALID_INPUT" | "NOT_ALLOWED" | "RATE_LIMITED" | "AI_UNAVAILABLE" | "INTERNAL_ERROR";
type ClientError = ErrorCode | "TURNSTILE";

function IdleProcessor({ dictionary, active }: { dictionary: AuditDictionary; active: boolean }) {
  return (
    <div className="audit-processor relative flex min-h-[390px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[24px] border border-[#9eacff]/[0.13] bg-[#090b10] p-6 sm:min-h-[460px] sm:p-8">
      <div className="audit-mini-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-24 -top-20 size-72 rounded-full bg-[#7487eb]/[0.11] blur-3xl" />
      <div className="relative flex items-center justify-between"><span className="font-mono text-[9px] tracking-[0.2em] text-[#a5b1fb]/55">{dictionary.processorLabel}</span><span className={`size-1.5 rounded-full ${active ? "animate-pulse bg-[#a8b5ff] shadow-[0_0_12px_#8296ff]" : "bg-white/20"}`} /></div>
      <div className="relative my-auto py-10">
        <div className="audit-orbit mx-auto flex size-40 items-center justify-center rounded-full border border-white/[0.07] sm:size-48">
          <div className={`audit-core flex size-20 items-center justify-center rounded-2xl border border-[#a8b5ff]/20 bg-[#7d8fe9]/[0.07] ${active ? "audit-core-active" : ""}`}><Sparkles size={23} className="text-[#afbbff]/65" /></div>
          <span /><span /><span />
        </div>
        <div className="mx-auto mt-10 grid w-full min-w-0 max-w-[410px] grid-cols-3 gap-2">
          {dictionary.processorNodes.map((node, index) => <div key={node} className="relative min-w-0 rounded-lg border border-white/[0.07] bg-white/[0.018] px-2 py-3 text-center font-mono text-[7px] tracking-[0.1em] text-white/34 [overflow-wrap:anywhere]"><span className={`absolute left-0 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full ${active && index === 1 ? "bg-[#a6b3ff] shadow-[0_0_8px_#8296ff]" : "bg-white/18"}`} />{node}</div>)}
        </div>
      </div>
      <div className="relative flex items-center gap-3 border-t border-white/[0.06] pt-5 font-mono text-[8px] tracking-[0.14em] text-white/24"><span className="h-px w-6 bg-[#9eacff]/30" />{dictionary.processorIdle}</div>
    </div>
  );
}

export function AiAudit({ dictionary, locale, enabled, turnstileSiteKey }: { dictionary: AuditDictionary; locale: Locale; enabled: boolean; turnstileSiteKey: string }) {
  const inputId = useId();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [process, setProcess] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<ClientError | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const interval = window.setInterval(() => setStage((current) => Math.min(current + 1, dictionary.loading.length - 1)), 1400);
    return () => window.clearInterval(interval);
  }, [dictionary.loading.length, loading]);

  useEffect(() => {
    if (!enabled || !turnstileSiteKey || !scriptReady || !turnstileRef.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: turnstileSiteKey,
      action: TURNSTILE_ACTION,
      theme: "dark",
      size: "flexible",
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [enabled, scriptReady, turnstileSiteKey]);

  const resetChallenge = () => {
    setToken("");
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  };

  const errorMessage = error === "INVALID_INPUT" ? dictionary.errors.invalid
    : error === "NOT_ALLOWED" ? dictionary.errors.notAllowed
      : error === "RATE_LIMITED" ? dictionary.errors.rateLimited
        : error === "AI_UNAVAILABLE" ? dictionary.errors.unavailable
          : error === "TURNSTILE" ? dictionary.errors.turnstile
          : dictionary.errors.internal;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = process.trim();
    if (!isMeaningfulAuditInput(trimmed)) {
      setError("INVALID_INPUT");
      return;
    }
    if (turnstileSiteKey && !token) {
      setError("TURNSTILE");
      return;
    }

    setLoading(true);
    setStage(0);
    setError(null);
    try {
      const response = await fetch("/api/ai-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ process: trimmed, locale, turnstileToken: token }),
      });
      const payload = await response.json() as { data?: AuditResult; error?: { code?: ErrorCode } };
      if (!response.ok || !payload.data) {
        setError(payload.error?.code || "INTERNAL_ERROR");
        resetChallenge();
        return;
      }
      setResult(payload.data);
      resetChallenge();
    } catch {
      setError("INTERNAL_ERROR");
      resetChallenge();
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ai-audit" aria-labelledby="ai-audit-title" className="ai-audit-section relative min-w-0 max-w-full scroll-mt-20 border-t border-white/[0.06] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      {turnstileSiteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />}
      <div className="audit-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto min-w-0 max-w-[1504px]">
        <header className="grid min-w-0 max-w-full gap-7 pb-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] md:items-end md:pb-16">
          <div className="min-w-0 max-w-full">
            <div className="mb-6 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#9ba9fb]/60"><span className="h-px w-7 bg-[#8f9df0]/50" />{dictionary.eyebrow}</div>
            <h2 id="ai-audit-title" className="audit-title w-full min-w-0 max-w-[980px] font-medium text-[#f0f1f4]">{dictionary.title[0]}<br /><span className="title-accent">{dictionary.title[1]}</span></h2>
          </div>
          <p className="min-w-0 max-w-[560px] text-[15px] leading-7 text-white/62 [overflow-wrap:anywhere] md:justify-self-end sm:text-base">{dictionary.description}</p>
        </header>

        {result ? (
          <div className="min-w-0 max-w-full">
            <div className="mb-6 flex justify-end"><button type="button" onClick={() => { setResult(null); setError(null); }} className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] px-4 py-2 text-xs text-white/48 outline-none transition hover:border-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-[#9eacff]"><RotateCcw size={13} />{dictionary.retry}</button></div>
            <AiAuditResult result={result} dictionary={dictionary} />
          </div>
        ) : (
          <div className="grid min-w-0 max-w-full gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <form onSubmit={submit} aria-busy={loading} className="audit-form relative w-full min-w-0 max-w-full overflow-hidden rounded-[24px] border border-white/[0.085] bg-[#0b0d12]/90 p-5 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-[#6f81df]/[0.06] blur-3xl" />
              <div className="relative min-w-0 max-w-full">
                <div className="mb-5 flex items-center justify-between gap-4"><label htmlFor={inputId} className="text-sm font-medium text-white/72">{dictionary.inputLabel}</label><span className="font-mono text-[9px] tabular-nums text-white/28">{process.length} / {MAX_AUDIT_INPUT}</span></div>
                <div className="audit-input-shell min-w-0 max-w-full rounded-[18px] border border-white/[0.09] bg-[#07090d] p-1 transition focus-within:border-[#9eacff]/30 focus-within:shadow-[0_0_0_3px_rgba(128,146,240,0.06)]">
                  <textarea id={inputId} value={process} onChange={(event) => { setProcess(event.target.value.slice(0, MAX_AUDIT_INPUT)); setError(null); }} maxLength={MAX_AUDIT_INPUT} minLength={MIN_AUDIT_INPUT} required disabled={!enabled || loading} placeholder={dictionary.placeholder} className="min-h-[250px] w-full resize-y rounded-[15px] bg-transparent px-4 py-4 text-[15px] leading-7 text-white/72 outline-none placeholder:text-white/38 disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-[290px] sm:px-5 sm:py-5" />
                </div>

                <div className="mt-5 flex items-start gap-2.5 text-sm leading-6 text-white/55"><LockKeyhole size={14} className="mt-1 shrink-0 text-[#9eacff]/55" /><p>{dictionary.privacy}</p></div>

                {turnstileSiteKey && enabled && <div ref={turnstileRef} className="mt-5 min-h-[65px] w-full min-w-0 max-w-full" />}

                <div aria-live="polite" className="mt-5 min-h-12">
                  {!enabled ? <p className="rounded-xl border border-[#9eacff]/[0.1] bg-[#8495ed]/[0.04] px-4 py-3 text-sm text-[#cbd2ff]/58">{dictionary.comingSoon}</p>
                    : error ? <div role="alert" className="rounded-xl border border-rose-200/[0.1] bg-rose-200/[0.025] px-4 py-3 text-sm leading-6 text-rose-100/65"><p>{errorMessage}</p>{error === "NOT_ALLOWED" && <p className="mt-1 text-white/35">{dictionary.errors.suggestion}</p>}</div>
                      : loading ? <div className="rounded-xl border border-[#9eacff]/[0.1] bg-[#8495ed]/[0.035] px-4 py-3"><div className="flex items-center gap-3 text-sm text-[#d7dcff]/70"><span className="size-1.5 animate-pulse rounded-full bg-[#9eacff] shadow-[0_0_10px_#8296ff]" />{dictionary.loading[stage]}</div><div className="mt-3 h-px overflow-hidden bg-white/[0.06]"><span className="audit-progress block h-full w-1/3 bg-gradient-to-r from-transparent via-[#9eacff] to-transparent" /></div></div>
                        : null}
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button type="submit" disabled={!enabled || loading || !isMeaningfulAuditInput(process)} className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-6 text-sm font-semibold text-[#090a0c] outline-none transition hover:bg-[#dfe3ff] focus-visible:ring-2 focus-visible:ring-[#9eacff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0d12] disabled:cursor-not-allowed disabled:opacity-30">{dictionary.button}<ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></button>
                  <div className="flex items-center gap-2 font-mono text-[8px] tracking-[0.12em] text-white/22"><ShieldCheck size={13} />SECURE · SINGLE AUDIT</div>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#cbd2ff]/65">{dictionary.simpleHint}</p>
                <p className="mt-7 border-t border-white/[0.06] pt-5 text-xs leading-5 text-white/48">{dictionary.disclaimer}</p>
              </div>
            </form>

            <IdleProcessor dictionary={dictionary} active={loading} />
          </div>
        )}
      </div>
    </section>
  );
}
