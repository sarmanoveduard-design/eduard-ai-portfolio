import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { dictionaries } from "@/i18n/dictionaries";
import { Hero } from "./hero";

describe("Hero calls to action", () => {
  it.each(["en", "ru"] as const)("links the AI Analysis CTA to #ai-audit in %s", (locale) => {
    const markup = renderToStaticMarkup(<Hero dictionary={dictionaries[locale].hero} />);

    expect(markup).toContain('href="#ai-audit"');
    expect(markup).toContain(dictionaries[locale].hero.discuss);
  });
});
