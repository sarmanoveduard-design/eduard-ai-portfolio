import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/i18n/config";

export const alt = "Eduard Sarmanov — AI Systems Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const copy: Record<Locale, { statement: [string, string]; footer: string }> = {
  en: { statement: ["AI systems", "that do real work."], footer: "Automation · Agents · RAG · SaaS" },
  ru: { statement: ["AI-системы,", "которые реально работают."], footer: "Автоматизация · Агенты · RAG · SaaS" },
};

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : "en";
  const content = copy[locale];

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#08090b", color: "#f4f5f7", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", opacity: 0.22, backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", right: -120, top: -150, width: 620, height: 620, borderRadius: 620, background: "radial-gradient(circle, rgba(104,122,224,.22), transparent 67%)" }} />

      <div style={{ position: "absolute", right: 92, top: 100, width: 330, height: 390, display: "flex" }}>
        <div style={{ position: "absolute", left: 26, top: 38, width: 10, height: 10, borderRadius: 10, background: "#9eacff", boxShadow: "0 0 20px rgba(145,163,255,.7)" }} />
        <div style={{ position: "absolute", left: 30, top: 43, width: 208, height: 1, background: "linear-gradient(90deg, #9eacff, rgba(158,172,255,.05))", transform: "rotate(23deg)", transformOrigin: "left" }} />
        <div style={{ position: "absolute", right: 40, top: 126, width: 118, height: 52, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(164,178,255,.24)", borderRadius: 10, background: "rgba(117,135,229,.06)", fontSize: 13, letterSpacing: 2, color: "rgba(225,229,255,.72)" }}>AI AGENT</div>
        <div style={{ position: "absolute", right: 97, top: 178, width: 1, height: 88, background: "linear-gradient(#9eacff, rgba(158,172,255,.05))" }} />
        <div style={{ position: "absolute", left: 58, bottom: 58, width: 94, height: 48, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.12)", borderRadius: 9, fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,.48)" }}>RAG</div>
        <div style={{ position: "absolute", right: 34, bottom: 22, width: 108, height: 48, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.12)", borderRadius: 9, fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,.48)" }}>ACTION</div>
      </div>

      <div style={{ position: "relative", width: "100%", padding: "64px 70px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 20, fontWeight: 700, letterSpacing: 5 }}>EDUARD SARMANOV<span style={{ color: "#91a0f5" }}>.</span></div>
          <div style={{ marginTop: 10, fontSize: 11, letterSpacing: 4, color: "rgba(255,255,255,.38)" }}>AI SYSTEMS ARCHITECT</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 780, marginTop: 18 }}>
          <div style={{ fontSize: locale === "ru" ? 70 : 82, lineHeight: 0.98, letterSpacing: -4, fontWeight: 700, color: "#f5f5f7" }}>{content.statement[0]}</div>
          <div style={{ marginTop: 4, fontSize: locale === "ru" ? 58 : 72, lineHeight: 1.02, letterSpacing: -3, fontWeight: 700, color: "#aebaff" }}>{content.statement[1]}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 15, letterSpacing: 2, color: "rgba(255,255,255,.44)" }}><div style={{ width: 34, height: 1, marginRight: 14, background: "rgba(158,173,255,.55)" }} />{content.footer}</div>
      </div>
    </div>,
    size,
  );
}
