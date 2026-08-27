import type { ReactNode } from "react";

type VisualKind = "hallucination" | "rag" | "multimodal" | "crm";

const FlowArrow = () => (
  <div className="project-flow-arrow" aria-hidden="true">
    <span />
  </div>
);

function Node({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <div className={`project-visual-node ${active ? "project-visual-node-active" : ""}`}>
      <span className="project-node-dot" />
      {children}
    </div>
  );
}

function HallucinationVisual() {
  return (
    <div className="flex h-full min-h-[360px] flex-col justify-center px-5 py-8 sm:px-8">
      <div className="mb-5 flex items-center justify-between font-mono text-[8px] tracking-[0.16em] text-white/25">
        <span>INFERENCE PIPELINE</span><span className="text-[#9facff]/55">SIMULATED SIGNAL</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Node>PROMPT</Node><span className="font-mono text-[10px] text-white/20">+</span><Node>MODEL ANSWER</Node>
      </div>
      <FlowArrow />
      <Node active>FEATURE EXTRACTION</Node>
      <FlowArrow />
      <div className="grid grid-cols-2 gap-3"><Node>STRUCTURAL</Node><Node>SEMANTIC</Node></div>
      <FlowArrow />
      <Node active>CLASSIFIER</Node>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-emerald-300/10 bg-emerald-300/[0.025] px-4 py-3 font-mono"><span className="block text-[8px] tracking-[0.14em] text-white/25">SAFE SIGNAL</span><span className="mt-1 block text-lg text-emerald-200/65">0.18</span></div>
        <div className="rounded-lg border border-[#9facff]/15 bg-[#8595f5]/[0.04] px-4 py-3 font-mono"><span className="block text-[8px] tracking-[0.14em] text-white/25">RISK SIGNAL</span><span className="mt-1 block text-lg text-[#b7c1ff]/75">0.82</span></div>
      </div>
    </div>
  );
}

function RagVisual() {
  return (
    <div className="flex h-full min-h-[300px] flex-col justify-center p-7 sm:p-9">
      <div className="project-doc-stack mb-7"><span /><span /><span /></div>
      <Node>DOCUMENTS</Node><FlowArrow /><Node>EMBEDDINGS</Node><FlowArrow /><Node active>FAISS VECTOR STORE</Node>
      <div className="mt-4 grid grid-cols-2 gap-3"><Node>SEARCH</Node><Node>RETRIEVAL</Node></div>
      <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#9facff]/30 to-transparent" />
      <div className="mt-3 text-center font-mono text-[9px] tracking-[0.18em] text-[#b9c2ff]/60">ANSWER</div>
    </div>
  );
}

function MultimodalVisual() {
  return (
    <div className="flex h-full min-h-[300px] flex-col justify-center p-7 sm:p-9">
      <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><Node>IMAGE</Node><span className="text-white/20">+</span><Node>CONTEXT</Node></div>
      <FlowArrow /><Node active>MULTIMODAL AI</Node>
      <div className="my-4 grid grid-cols-3 gap-2"><Node>RISK</Node><Node>PROCESS</Node><Node>HACCP</Node></div>
      <div className="rounded-lg border border-white/[0.06] bg-black/20 px-4 py-4">
        <div className="mb-3 font-mono text-[8px] tracking-[0.15em] text-white/25">RECOMMENDATIONS</div>
        <div className="space-y-2"><span className="block h-1 w-full rounded bg-white/[0.07]" /><span className="block h-1 w-4/5 rounded bg-white/[0.05]" /><span className="block h-1 w-2/3 rounded bg-[#8fa0ff]/10" /></div>
      </div>
    </div>
  );
}

function CrmVisual() {
  return (
    <div className="flex h-full min-h-[300px] flex-col justify-center p-7 sm:p-9">
      <div className="mx-auto w-3/4"><Node>NEW LEAD</Node><FlowArrow /><Node active>ROUTING ENGINE</Node></div>
      <div className="my-5 flex items-center gap-2"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#9facff]/20" /><span className="size-1 rounded-full bg-[#9facff]/60" /><span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#9facff]/20" /></div>
      <div className="grid grid-cols-3 gap-2">
        {["OP A", "OP B", "OP C"].map((operator, index) => <div key={operator} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2 py-4 text-center font-mono"><span className="block text-[9px] tracking-[0.12em] text-white/55">{operator}</span><span className="mt-3 block h-1 rounded-full bg-white/[0.06]"><span className="block h-full rounded-full bg-[#91a0f5]/35" style={{ width: `${42 + index * 19}%` }} /></span><span className="mt-2 block text-[7px] text-white/20">WEIGHT + LOAD</span></div>)}
      </div>
    </div>
  );
}

export function ProjectVisual({ kind }: { kind: string }) {
  const visuals: Record<VisualKind, ReactNode> = {
    hallucination: <HallucinationVisual />, rag: <RagVisual />, multimodal: <MultimodalVisual />, crm: <CrmVisual />,
  };

  return (
    <div aria-hidden="true" className="project-visual relative h-full overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#090b0f]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#6e7dcc]/[0.07] blur-3xl" />
      <div className="relative h-full">{visuals[kind as VisualKind]}</div>
    </div>
  );
}
