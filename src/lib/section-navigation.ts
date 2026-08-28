export function scrollToSection(id: string) {
  if (typeof document === "undefined" || typeof window === "undefined") return false;

  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(window.history.state, "", `#${encodeURIComponent(id)}`);
  return true;
}
