import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { dictionaries } from "@/i18n/dictionaries";
import { getWhatsAppLink } from "./contact-links";
import { NavbarMobileSectionLink, NavbarSectionLink, NavbarWhatsAppCta } from "./navbar";

describe("Navbar calls to action", () => {
  it.each(["en", "ru"] as const)("uses the localized WhatsApp link for desktop and mobile CTAs in %s", (locale) => {
    const dictionary = dictionaries[locale];
    const expectedHref = getWhatsAppLink(dictionary.contact.whatsappMessage);

    const desktop = renderToStaticMarkup(
      <NavbarWhatsAppCta href={expectedHref} label={dictionary.nav.talk} />,
    );
    const mobile = renderToStaticMarkup(
      <NavbarWhatsAppCta href={expectedHref} label={dictionary.nav.talk} mobile />,
    );

    for (const markup of [desktop, mobile]) {
      expect(markup).toContain(`href="${expectedHref.replaceAll("&", "&amp;")}"`);
      expect(markup).toContain('target="_blank"');
      expect(markup).toContain('rel="noopener noreferrer"');
    }
  });

  it.each(["en", "ru"] as const)("links desktop AI Analysis to #ai-audit in %s", (locale) => {
    const markup = renderToStaticMarkup(
      <NavbarSectionLink id="ai-audit" label={dictionaries[locale].nav.audit} accent onClick={() => undefined} />,
    );

    expect(markup).toContain('href="#ai-audit"');
    expect(markup).toContain(dictionaries[locale].nav.audit);
  });

  it.each(["en", "ru"] as const)("links mobile AI Analysis to #ai-audit in %s", (locale) => {
    const markup = renderToStaticMarkup(
      <NavbarMobileSectionLink id="ai-audit" label={dictionaries[locale].nav.audit} accent index={2} onClick={() => undefined} />,
    );

    expect(markup).toContain('href="#ai-audit"');
    expect(markup).toContain(dictionaries[locale].nav.audit);
  });
});
