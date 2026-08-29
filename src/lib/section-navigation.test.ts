import { afterEach, describe, expect, it, vi } from "vitest";
import { scrollToSection } from "./section-navigation";

describe("scrollToSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("smoothly scrolls to an existing section and updates the hash", () => {
    const scrollIntoView = vi.fn();
    const replaceState = vi.fn();
    vi.stubGlobal("document", { getElementById: vi.fn(() => ({ scrollIntoView })) });
    vi.stubGlobal("window", {
      history: { state: { preserved: true }, replaceState },
    });

    expect(scrollToSection("ai-audit")).toBe(true);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(replaceState).toHaveBeenCalledWith({ preserved: true }, "", "#ai-audit");
  });

  it("keeps the native link fallback when a section does not exist", () => {
    const replaceState = vi.fn();
    vi.stubGlobal("document", { getElementById: vi.fn(() => null) });
    vi.stubGlobal("window", { history: { state: null, replaceState } });

    expect(scrollToSection("missing")).toBe(false);
    expect(replaceState).not.toHaveBeenCalled();
  });
});
