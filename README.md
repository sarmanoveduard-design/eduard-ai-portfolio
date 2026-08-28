# Eduard Sarmanov — AI Systems Portfolio

**AI Systems Architect · Full-Stack Engineer · SaaS Builder**

**Live Portfolio:** [https://eduard.n8n-tools.online](https://eduard.n8n-tools.online)

## About the project

This repository contains Eduard Sarmanov's bilingual production portfolio. It presents selected work in AI systems, full-stack engineering, automation, and SaaS development through a responsive interface designed for both Russian- and English-speaking visitors.

This is not a static portfolio template. It is a deployed web product with an interactive AI Business Audit that turns a description of an existing business process into a structured analysis of automation opportunities, system architecture, implementation requirements, risks, and next steps.

The application is built and operated with production concerns in mind: input validation, abuse prevention, moderation, rate limiting, fail-closed AI handling, health monitoring, container isolation, and a controlled reverse-proxy deployment architecture.

## Main capabilities

- Bilingual Russian and English experience
- Interactive AI Business Audit with structured results
- Curated engineering and applied AI project portfolio
- Responsive UI for mobile, tablet, and desktop
- SEO and social sharing metadata
- Containerized production deployment
- Layered security, moderation, validation, and rate limiting

## AI Business Audit architecture

The audit uses the OpenAI Responses API with Structured Outputs. A separate purpose gate ensures that only relevant business-process and automation requests reach the full audit stage. Requests fail closed when a required security, classification, generation, or validation step cannot be completed safely.

```text
Visitor
   ↓
Turnstile / rate limits
   ↓
Deterministic validation
   ↓
Moderation
   ↓
AI purpose gate
   ↓
Full business audit
   ↓
Structured validation
   ↓
UI result
```

The public documentation intentionally describes this pipeline at a high level. Credentials, private origin controls, internal security values, and infrastructure secrets are not stored in this README.

## Selected Work

### [hallucination-detector-sber](https://github.com/sarmanoveduard-design/hallucination-detector-sber)

A production-oriented hallucination detection service that evaluates prompt-and-answer pairs using semantic and structural signals.

### [RAG_Simble_FAISS_Consultant](https://github.com/sarmanoveduard-design/RAG_Simble_FAISS_Consultant)

A document consultation system built around retrieval-augmented generation and FAISS-based search.

### [MultimodalConfectioneryHW](https://github.com/sarmanoveduard-design/MultimodalConfectioneryHW)

A multimodal analysis project for identifying operational bottlenecks and risks in confectionery production workflows.

### [miniCRM-backend-test](https://github.com/sarmanoveduard-design/miniCRM-backend-test)

A backend service for CRM workflows, including lead distribution and workload-aware processing.

## Tech stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### AI

- OpenAI Responses API
- Structured Outputs
- AI Agents and RAG concepts

### Backend / Infrastructure

- Node.js
- Docker
- Caddy
- Cloudflare
- Upstash Redis

### Security

- Cloudflare Turnstile
- Visitor and global rate limiting
- Moderation and deterministic request filtering
- Fail-closed input and model-output validation

## Production architecture

```text
Cloudflare → Caddy reverse proxy → Docker container → Next.js standalone app
```

The application runs as an isolated Docker service using the Next.js standalone output. The production container includes a health check, resource limits, restart policy, non-root execution, and additional container hardening. Infrastructure addresses, credentials, and private routing controls are intentionally not documented publicly.

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment

Use [`.env.example`](./.env.example) as the reference for required environment variables. For local development, copy it to an appropriate local environment file and provide your own values.

Never commit `.env.production`, API keys, service credentials, Turnstile secrets, Redis credentials, or other sensitive configuration. Production secrets must be supplied through the deployment environment.

## Quality checks

Run the complete local verification set before shipping changes:

```bash
npm test
npm run lint
npm run build
```

## Contact

**Eduard Sarmanov**

- Portfolio: [https://eduard.n8n-tools.online](https://eduard.n8n-tools.online)
- GitHub: [https://github.com/sarmanoveduard-design](https://github.com/sarmanoveduard-design)
- Telegram: [https://t.me/Eduard_1611](https://t.me/Eduard_1611)
- Email: [sarmanoveduard@gmail.com](mailto:sarmanoveduard@gmail.com)
