import { notFound } from "next/navigation";
import { Hero } from "@/components/portfolio/hero";
import { Expertise } from "@/components/portfolio/expertise";
import { Navbar } from "@/components/portfolio/navbar";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { dictionaries, isLocale } from "@/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = dictionaries[locale];

  return (
    <main className="portfolio-shell">
      <Navbar locale={locale} dictionary={dictionary.nav} />
      <Hero dictionary={dictionary.hero} />
      <SelectedWork dictionary={dictionary.work} />
      <Expertise dictionary={dictionary.expertise} />
    </main>
  );
}
