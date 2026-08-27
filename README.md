# Eduard Sarmanov Portfolio

Bilingual portfolio for Eduard Sarmanov — AI Systems Architect and Full-Stack Engineer.

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS 4
- Motion and Lucide React
- Next.js Metadata API and generated social images

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route selects `/en` or `/ru` from the saved locale and browser language.

## Environment

Copy `.env.example` to `.env.local` and set the public production origin:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

The value is used for canonical URLs, language alternates, robots.txt, sitemap.xml, and social metadata. Local development falls back to `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run build
```

## Deployment

Vercel is recommended. Configure `NEXT_PUBLIC_SITE_URL` in the project environment before the production deployment.
