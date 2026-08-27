export const contactLinks = {
  phoneDisplay: "+82 10-7537-4744",
  phone: "tel:+821075374744",
  telegramDisplay: "@Eduard_1611",
  telegram: "https://t.me/Eduard_1611",
  emailDisplay: "sarmanoveduard@gmail.com",
  email: "mailto:sarmanoveduard@gmail.com",
  githubDisplay: "/sarmanoveduard-design",
  github: "https://github.com/sarmanoveduard-design",
} as const;

export function getWhatsAppLink(message: string) {
  return `https://wa.me/821075374744?text=${encodeURIComponent(message)}`;
}
