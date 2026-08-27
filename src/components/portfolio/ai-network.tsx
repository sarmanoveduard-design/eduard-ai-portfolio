const nodes = [
  { label: "USER", meta: "INPUT", x: "8%", y: "10%" },
  { label: "AI AGENT", meta: "ORCHESTRATE", x: "53%", y: "18%", active: true },
  { label: "RAG", meta: "CONTEXT", x: "22%", y: "46%" },
  { label: "API", meta: "TOOLS", x: "68%", y: "49%" },
  { label: "DATABASE", meta: "MEMORY", x: "13%", y: "77%" },
  { label: "ACTION", meta: "OUTPUT", x: "61%", y: "82%", active: true },
];

export function AiNetwork() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(94,112,208,0.1),transparent_62%)] blur-2xl" />
      <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="network-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6672a5" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#a4b1ff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#6672a5" stopOpacity="0.08" />
          </linearGradient>
          <filter id="soft-glow"><feGaussianBlur stdDeviation="0.5" /></filter>
        </defs>
        <g fill="none" stroke="url(#network-stroke)" strokeWidth="0.18" vectorEffect="non-scaling-stroke">
          <path className="network-line" d="M14 15 C28 12 39 17 55 23" />
          <path className="network-line" d="M57 25 C48 32 37 39 28 50" />
          <path className="network-line" d="M60 25 C68 31 73 39 73 52" />
          <path className="network-line" d="M27 54 C22 63 20 69 19 80" />
          <path className="network-line" d="M75 55 C73 66 70 74 66 84" />
          <path d="M30 52 C43 56 56 56 70 54" strokeOpacity="0.35" />
          <path d="M22 82 C35 88 49 88 62 86" strokeOpacity="0.25" />
        </g>
        <circle cx="14" cy="15" r="0.55" fill="#a9b5ff" filter="url(#soft-glow)" opacity="0.8" />
        <circle cx="14" cy="15" r="0.34" fill="#dce1ff" />
        <circle cx="57" cy="23" r="0.55" fill="#a9b5ff" filter="url(#soft-glow)" opacity="0.8" />
        <circle cx="57" cy="23" r="0.34" fill="#dce1ff" />
      </svg>
      <span className="data-pulse absolute size-1.5 rounded-full bg-[#b7c1ff] shadow-[0_0_12px_3px_rgba(151,166,255,0.45)] [offset-path:path('M_14_15_C_28_12_39_17_57_23')]" />
      <span className="data-pulse data-pulse-delay absolute size-1 rounded-full bg-white/90 shadow-[0_0_10px_2px_rgba(151,166,255,0.4)] [offset-path:path('M_57_23_C_68_31_73_39_73_52')]" />
      {nodes.map((node) => (
        <div key={node.label} className="network-node absolute" style={{ left: node.x, top: node.y }}>
          <div className={`relative min-w-[102px] rounded-lg border px-3.5 py-2.5 backdrop-blur-md ${node.active ? "border-[#92a0f2]/25 bg-[#8697ff]/[0.07] shadow-[0_10px_40px_rgba(65,78,145,0.08)]" : "border-white/[0.08] bg-white/[0.025]"}`}>
            <span className={`absolute -left-1 top-1/2 size-1.5 -translate-y-1/2 rounded-full ${node.active ? "bg-[#a7b3ff] shadow-[0_0_8px_#8292f2]" : "bg-white/25"}`} />
            <span className="block font-mono text-[9px] tracking-[0.18em] text-white/75">{node.label}</span>
            <span className="mt-1 block font-mono text-[7px] tracking-[0.12em] text-white/25">{node.meta}</span>
          </div>
        </div>
      ))}
      <div className="absolute right-[5%] top-[7%] font-mono text-[8px] leading-5 tracking-[0.14em] text-white/20">
        <span className="block">SYS / ONLINE</span>
        <span className="block text-[#9facff]/40">FLOW 01. ACTIVE</span>
      </div>
    </div>
  );
}
