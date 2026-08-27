# Eduard Sarmanov Portfolio

Bilingual portfolio for Eduard Sarmanov — AI Systems Architect and Full-Stack Engineer.

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS 4
- Motion and Lucide React
- Next.js Metadata API and generated social images
- OpenAI Responses API with Structured Outputs
- Upstash Redis and Cloudflare Turnstile protection

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

### AI Business Audit

The audit is disabled by default. Set `AI_AUDIT_ENABLED=true` and configure the server-only OpenAI, Upstash Redis, rate-limit salt, and Turnstile values listed in `.env.example`.

Production fails closed when Redis or Turnstile configuration is incomplete. Development permits an explicit local fallback only when the feature flag is enabled: in-memory rate limiting and a missing-Turnstile bypass. Prompts and audit results are not intentionally stored, and raw visitor IPs or submitted process text are not logged.

## Checks

```bash
npm run lint
npm run build
```

## Deployment

Vercel is recommended. Configure all production environment values before enabling the AI audit. Create a Cloudflare Turnstile widget for the deployed domain and an Upstash Redis database, then set a long random `RATE_LIMIT_SALT`.
