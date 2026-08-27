"use server";

import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/i18n/config";

export async function saveLocale(locale: Locale) {
  if (!isLocale(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set("portfolio-locale", locale, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
