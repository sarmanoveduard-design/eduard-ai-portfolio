import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", alignItems: "center", justifyContent: "center", borderRadius: 42, background: "linear-gradient(145deg, #11131a, #08090b)", color: "#f4f5f7", fontFamily: "Arial, sans-serif", fontSize: 96, fontWeight: 800, letterSpacing: -8 }}>
      E<span style={{ position: "absolute", right: 35, top: 34, width: 14, height: 14, borderRadius: 14, background: "#8f9df0", boxShadow: "0 0 18px rgba(143,157,240,.65)" }} />
    </div>,
    size,
  );
}
