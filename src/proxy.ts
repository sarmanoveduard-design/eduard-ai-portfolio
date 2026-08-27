import { type NextRequest, NextResponse } from "next/server";
import { isLocale, type Locale } from "@/i18n/config";

const LOCALE_COOKIE = "portfolio-locale";

function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return "en";

  const preferred = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .find((language) => language === "ru" || language?.startsWith("ru-"));

  return preferred ? "ru" : "en";
}

export function proxy(request: NextRequest) {
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    savedLocale && isLocale(savedLocale)
      ? savedLocale
      : localeFromAcceptLanguage(request.headers.get("accept-language"));

  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

export const config = {
  matcher: "/",
};
