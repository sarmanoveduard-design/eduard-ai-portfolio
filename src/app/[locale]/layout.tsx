import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/dictionaries";
import { absoluteUrl, siteUrl } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "cyrillic"] });

const seo = {
  en: {
    title: "Eduard Sarmanov — AI Systems Architect",
    description: "AI Systems Architect and Full-Stack Engineer building AI automation, agents, RAG systems, SaaS products and production-ready software systems.",
    keywords: ["AI Systems Architect", "AI Automation", "AI Agents", "RAG", "Full-Stack Engineer", "SaaS", "FastAPI", "Next.js", "LLM"],
    ogLocale: "en_US",
    alternateLocale: "ru_RU",
  },
  ru: {
    title: "Eduard Sarmanov — архитектор AI-систем",
    description: "Архитектор AI-систем и Full-Stack Engineer. AI-автоматизация, агенты, RAG-системы, SaaS и программные продукты для реальных бизнес-процессов.",
    keywords: ["AI автоматизация", "AI агенты", "RAG", "архитектор AI систем", "Full-Stack", "SaaS", "автоматизация бизнеса"],
    ogLocale: "ru_RU",
    alternateLocale: "en_US",
  },
} as const;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = seo[locale];
  const canonical = absoluteUrl(`/${locale}`);

  return {
    metadataBase: siteUrl,
    title: content.title,
    description: content.description,
    keywords: [...content.keywords],
    authors: [{ name: "Eduard Sarmanov" }],
    creator: "Eduard Sarmanov",
    alternates: {
      canonical,
      languages: { en: absoluteUrl("/en"), ru: absoluteUrl("/ru"), "x-default": absoluteUrl("/") },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: content.title,
      description: content.description,
      siteName: "Eduard Sarmanov",
      locale: content.ogLocale,
      alternateLocale: content.alternateLocale,
    },
    twitter: { card: "summary_large_image", title: content.title, description: content.description },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
