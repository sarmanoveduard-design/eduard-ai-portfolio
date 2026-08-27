const Dot = ({ active = false }: { active?: boolean }) => (
  <span className={`expertise-dot ${active ? "expertise-dot-active" : ""}`} />
);

function AutomationVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="grid grid-cols-[auto_54px_auto] items-center gap-4">
        <div className="grid grid-cols-2 gap-2"><Dot /><Dot /><Dot /><Dot /></div>
        <div className="expertise-data-line"><span /></div>
        <div className="expertise-core"><span>AI</span></div>
      </div>
      <span className="absolute bottom-3 right-4 font-mono text-[7px] tracking-[0.16em] text-white/18">PROCESS / AUTOMATE</span>
    </div>
  );
}

function AgentsVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="expertise-agent-orbit"><span className="expertise-core"><span>AGENT</span></span><Dot active /><Dot /><Dot /></div>
      <div className="absolute right-5 top-4 space-y-1.5"><span className="block h-px w-9 bg-white/10" /><span className="block h-px w-6 bg-[#94a4ff]/20" /><span className="block h-px w-11 bg-white/[0.06]" /></div>
    </div>
  );
}

function KnowledgeVisual() {
  return (
    <div className="relative flex h-full items-center justify-center gap-7">
      <div className="expertise-docs"><span /><span /><span /></div>
      <div className="expertise-data-line w-12"><span /></div>
      <div className="flex flex-col items-center gap-2"><Dot active /><span className="font-mono text-[7px] tracking-[0.14em] text-white/25">VECTOR</span></div>
    </div>
  );
}

function SaasVisual() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="expertise-window">
        <div className="flex gap-1 border-b border-white/[0.06] p-2"><i /><i /><i /></div>
        <div className="grid grid-cols-[28%_1fr] gap-2 p-3"><span className="h-full rounded bg-white/[0.035]" /><span className="grid grid-cols-2 gap-2"><b /><b /><b className="col-span-2" /></span></div>
      </div>
    </div>
  );
}

function BackendVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="grid grid-cols-[auto_42px_auto] items-center gap-3"><div className="flex flex-col gap-2"><Dot /><Dot /></div><div className="expertise-data-line"><span /></div><div className="rounded-md border border-[#96a6ff]/15 bg-[#8293ed]/[0.04] px-3 py-2 font-mono text-[7px] tracking-[0.12em] text-white/45">API</div></div>
      <span className="absolute bottom-3 left-4 font-mono text-[7px] tracking-[0.14em] text-white/18">REQUEST → SERVICE</span>
    </div>
  );
}

function MultimodalVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="grid grid-cols-[auto_48px_auto] items-center gap-3"><div className="grid grid-cols-2 gap-2"><span className="expertise-input">T</span><span className="expertise-input">V</span><span className="expertise-input">A</span><span className="expertise-input">D</span></div><div className="expertise-data-line"><span /></div><div className="expertise-core"><span>AI</span></div></div>
    </div>
  );
}

export function ExpertiseVisual({ kind }: { kind: string }) {
  const visuals: Record<string, ReactNode> = {
    automation: <AutomationVisual />,
    agents: <AgentsVisual />,
    knowledge: <KnowledgeVisual />,
    saas: <SaasVisual />,
    backend: <BackendVisual />,
    multimodal: <MultimodalVisual />,
  };

  return <div aria-hidden="true" className="expertise-visual h-full min-h-[118px] overflow-hidden rounded-xl border border-white/[0.055] bg-black/15">{visuals[kind]}</div>;
}
import type { ReactNode } from "react";
