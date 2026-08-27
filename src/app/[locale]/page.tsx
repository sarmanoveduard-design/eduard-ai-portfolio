import { notFound } from "next/navigation";
import { About } from "@/components/portfolio/about";
import { AiAudit } from "@/components/portfolio/ai-audit";
import { Contact } from "@/components/portfolio/contact";
import { Hero } from "@/components/portfolio/hero";
import { Expertise } from "@/components/portfolio/expertise";
import { Footer } from "@/components/portfolio/footer";
import { Navbar } from "@/components/portfolio/navbar";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { dictionaries, isLocale } from "@/i18n/dictionaries";
import { getAuditAvailability } from "@/lib/ai/config";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = dictionaries[locale];
  const auditAvailability = getAuditAvailability();

  return (
    <>
      <Navbar locale={locale} dictionary={dictionary.nav} />
      <main className="portfolio-shell">
        <Hero dictionary={dictionary.hero} />
        <SelectedWork dictionary={dictionary.work} />
        <Expertise dictionary={dictionary.expertise} />
        <AiAudit dictionary={dictionary.audit} locale={locale} enabled={auditAvailability.enabled} turnstileSiteKey={auditAvailability.turnstileSiteKey} />
        <About dictionary={dictionary.about} />
        <Contact dictionary={dictionary.contact} />
      </main>
      <Footer dictionary={dictionary.contact} />
    </>
  );
}
