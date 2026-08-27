"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { saveLocale } from "@/app/actions";

const options: Locale[] = ["en", "ru"];

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  const selectLocale = async (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    await saveLocale(nextLocale);
    router.push(`/${nextLocale}${window.location.hash}`);
  };

  return (
    <div aria-label="Language" className="flex items-center rounded-full border border-white/[0.09] bg-white/[0.025] p-1 font-mono text-[9px] tracking-[0.12em]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-current={option === locale ? "true" : undefined}
          onClick={() => selectLocale(option)}
          className={`rounded-full px-2 py-1.5 uppercase outline-none transition-colors focus-visible:ring-1 focus-visible:ring-[#9eacff] ${
            option === locale
              ? "bg-white/[0.1] text-white"
              : "text-white/30 hover:text-white/70"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
