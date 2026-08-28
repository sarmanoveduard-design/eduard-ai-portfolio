import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { dictionaries } from "@/i18n/dictionaries";
import { getWhatsAppLink } from "./contact-links";
import { NavbarSectionLink, NavbarWhatsAppCta } from "./navbar";

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

  it("keeps the regular Contact navigation item linked to #contact", () => {
    const dictionary = dictionaries.en;
    const markup = renderToStaticMarkup(
      <NavbarSectionLink id="contact" label={dictionary.nav.contact} onClick={() => undefined} />,
    );

    expect(markup).toContain('href="#contact"');
    expect(markup).toContain(`>${dictionary.nav.contact}</a>`);
  });
});
