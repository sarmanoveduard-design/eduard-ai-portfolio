const fallbackUrl = "http://localhost:3000";
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackUrl;

export const siteUrl = new URL(
  configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`,
);

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}
