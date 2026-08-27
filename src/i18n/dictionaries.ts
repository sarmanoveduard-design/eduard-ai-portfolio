import type { Locale } from "./config";

export { isLocale, locales } from "./config";
export type { Locale } from "./config";

const en = {
  nav: {
    label: "Primary navigation",
    projects: "Projects",
    expertise: "Expertise",
    about: "About",
    contact: "Contact",
    talk: "Let's talk",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  hero: {
    status: "AVAILABLE FOR SELECT PROJECTS",
    titleBefore: "I build ",
    titleAccent: "AI systems",
    titleAfter: "that do real work.",
    description:
      "I design and build AI automation, agents, RAG systems and SaaS products — from business problem to production.",
    path: ["From business problem", "architecture", "working product"],
    explore: "Explore my work",
    discuss: "Discuss a project",
    github: "GitHub",
    technologiesLabel: "Core technologies",
    selectedWork: "Selected work",
    scroll: "Scroll to explore",
    scrollLabel: "Scroll to selected work",
  },
  work: {
    eyebrow: "SELECTED WORK",
    title: ["Systems built to solve", "real problems."],
    intro:
      "A selection of AI, RAG and backend systems focused on practical engineering rather than demos.",
    repository: "View repository",
    stackLabel: "Technology stack",
    metricsLabel: "Verified results",
    projects: [
      {
        title: "LLM Hallucination Detector",
        category: "Applied AI / ML",
        context:
          "A lightweight system for detecting factual hallucinations in LLM responses, built for a Sber AI hackathon.",
        built:
          "Evaluates hallucination probability from prompt + model answer, with optional reference answers. Combines structural and semantic features with fast production-oriented inference.",
        metrics: ["PR-AUC 0.9076", "F1 0.8400", "23–38 ms warm inference"],
        metricNote: "Preview dataset",
        tech: ["Python", "Sentence Transformers", "Logistic Regression", "Docker", "ML"],
        github: "https://github.com/sarmanoveduard-design/hallucination-detector-sber",
        visual: "hallucination",
      },
      {
        title: "RAG Simble FAISS Consultant",
        category: "RAG / Knowledge Systems",
        context:
          "RAG consultant for working with document collections using FAISS and LangChain, including vector-base merging, hybrid retrieval and local document processing.",
        tech: ["Python", "LangChain", "FAISS", "RAG", "RetrievalQA"],
        github: "https://github.com/sarmanoveduard-design/RAG_Simble_FAISS_Consultant",
        visual: "rag",
      },
      {
        title: "Multimodal Production Analysis",
        category: "Multimodal AI",
        context:
          "Multimodal analysis of a confectionery production environment using AI to identify operational bottlenecks, HACCP-related risks and optimization opportunities.",
        tech: ["GPT", "Multimodal AI", "Production Analysis", "HACCP"],
        github: "https://github.com/sarmanoveduard-design/MultimodalConfectioneryHW",
        visual: "multimodal",
      },
      {
        title: "Weighted Lead Distribution CRM",
        category: "Backend / Automation",
        context:
          "Lightweight FastAPI miniCRM with automatic lead distribution based on configurable weights and operator workload limits.",
        tech: ["FastAPI", "Python", "Backend", "Lead Routing", "API"],
        github: "https://github.com/sarmanoveduard-design/miniCRM-backend-test",
        visual: "crm",
      },
    ],
  },
  expertise: {
    eyebrow: "EXPERTISE",
    title: ["What I can build", "for your business."],
    intro:
      "From AI automation to complete software products — systems designed around real business processes.",
    examplesLabel: "Business applications",
    stackLabel: "Technology stack",
    services: [
      {
        title: "AI Automation",
        description:
          "Automate repetitive business processes, customer communication, document workflows and internal operations with AI.",
        examples: ["Lead handling", "Customer support", "Document processing", "Workflow automation"],
        tech: ["LLM", "APIs", "FastAPI", "Webhooks"],
        visual: "automation",
      },
      {
        title: "AI Agents",
        description:
          "Agents that can reason over business context, use tools, work with APIs and execute multi-step tasks.",
        examples: ["Sales agents", "Research agents", "Internal assistants", "Tool-using agents"],
        tech: ["LLM Agents", "LangGraph", "Tools", "APIs"],
        visual: "agents",
      },
      {
        title: "RAG & Knowledge Systems",
        description:
          "AI systems that work with company documents, regulations, knowledge bases and private data instead of relying only on model memory.",
        examples: ["Document search", "Corporate knowledge", "AI consultants", "Semantic retrieval"],
        tech: ["RAG", "Embeddings", "FAISS", "Vector Search"],
        visual: "knowledge",
      },
      {
        title: "SaaS & Web Products",
        description:
          "Complete web products with frontend, backend, authentication, business logic, databases and third-party integrations.",
        examples: ["Client portals", "Dashboards", "Internal systems", "Subscription products"],
        tech: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL"],
        visual: "saas",
      },
      {
        title: "Backend & Integrations",
        description:
          "Production-oriented APIs and backend services connecting business systems, databases, messengers and external platforms.",
        examples: ["REST APIs", "CRM integrations", "Messaging platforms", "Payment / service APIs"],
        tech: ["Python", "FastAPI", "PostgreSQL", "Redis"],
        visual: "backend",
      },
      {
        title: "Multimodal AI",
        description:
          "Systems that combine text, images, audio or other inputs to analyze real-world business situations.",
        examples: ["Image analysis", "Speech workflows", "Operational analysis", "Multimodal assistants"],
        tech: ["Vision", "STT/TTS", "LLM", "Multimodal AI"],
        visual: "multimodal",
      },
    ],
    cta: {
      title: "Have a process that should be automated?",
      text: "Describe the task — I'll help determine what can be automated and what architecture makes sense.",
      button: "Discuss a project",
    },
  },
  about: {
    eyebrow: "ABOUT",
    title: ["I don't just add AI features.", "I design working systems."],
    paragraphs: [
      "I'm Eduard Sarmanov, an AI Systems Architect and Full-Stack Engineer. I design and build software systems that bring AI, backend services, data, interfaces and external platforms together into a working product.",
      "I'm most interested in problems where simply calling an AI API is not enough. I analyze the business process, design the architecture and build the system around the actual workflow.",
    ],
    identityLabel: "IDENTITY",
    name: "EDUARD SARMANOV",
    roles: ["AI Systems Architect", "Full-Stack Engineer"],
    locationLabel: "LOCATION",
    location: "South Korea · Remote",
    focusLabel: "FOCUS",
    focus: ["AI Systems", "Automation", "RAG", "Agents", "SaaS", "Backend"],
    principleLabel: "HOW I THINK",
    principle:
      "Business problem → system architecture → implementation → measurable working result.",
  },
  contact: {
    eyebrow: "CONTACT",
    title: ["Have a problem to solve?", "Let's talk."],
    intro:
      "Tell me what is currently manual, repetitive or needs AI. I'll help identify how it can be turned into a practical software system.",
    whatsapp: "WhatsApp",
    whatsappMessage:
      "Hi Eduard, I found your portfolio and would like to discuss a project.",
    telegram: "Telegram",
    call: "Call",
    email: "Email",
    github: "GitHub",
    openAction: "Open",
  },
} as const;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : T extends object
      ? { readonly [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof en>;

const ru = {
  nav: {
    label: "Основная навигация",
    projects: "Проекты",
    expertise: "Экспертиза",
    about: "Обо мне",
    contact: "Контакты",
    talk: "Обсудить проект",
    openMenu: "Открыть меню навигации",
    closeMenu: "Закрыть меню навигации",
  },
  hero: {
    status: "ОТКРЫТ ДЛЯ НОВЫХ ПРОЕКТОВ",
    titleBefore: "Создаю ",
    titleAccent: "AI-системы,",
    titleAfter: "которые реально работают.",
    description:
      "Автоматизирую бизнес-процессы, создаю AI-агентов, RAG-системы и SaaS-продукты — от задачи до production.",
    path: ["От бизнес-задачи", "к архитектуре", "к работающему продукту"],
    explore: "Мои проекты",
    discuss: "Обсудить проект",
    github: "GitHub",
    technologiesLabel: "Основные технологии",
    selectedWork: "Избранные проекты",
    scroll: "Смотреть проекты",
    scrollLabel: "Перейти к избранным проектам",
  },
  work: {
    eyebrow: "ИЗБРАННЫЕ ПРОЕКТЫ",
    title: ["Системы для решения", "реальных задач."],
    intro:
      "Подборка AI, RAG и backend-систем, ориентированных на практическую инженерную задачу, а не просто на демонстрацию технологии.",
    repository: "Открыть репозиторий",
    stackLabel: "Стек технологий",
    metricsLabel: "Подтверждённые результаты",
    projects: [
      {
        title: "LLM Hallucination Detector",
        category: "Прикладной AI / ML",
        context:
          "Лёгкая система для обнаружения фактологических галлюцинаций в ответах LLM, разработанная для AI-хакатона Sber.",
        built:
          "Оценивает вероятность галлюцинации по запросу и ответу модели, при необходимости используя эталонный ответ. Объединяет структурные и семантические признаки с быстрым inference.",
        metrics: ["PR-AUC 0.9076", "F1 0.8400", "23–38 ms warm inference"],
        metricNote: "Preview dataset",
        tech: ["Python", "Sentence Transformers", "Logistic Regression", "Docker", "ML"],
        github: "https://github.com/sarmanoveduard-design/hallucination-detector-sber",
        visual: "hallucination",
      },
      {
        title: "RAG Simble FAISS Consultant",
        category: "RAG / Системы знаний",
        context:
          "RAG-консультант для работы с коллекциями документов на базе FAISS и LangChain: объединение векторных баз, гибридный поиск и локальная обработка документов.",
        tech: ["Python", "LangChain", "FAISS", "RAG", "RetrievalQA"],
        github: "https://github.com/sarmanoveduard-design/RAG_Simble_FAISS_Consultant",
        visual: "rag",
      },
      {
        title: "Multimodal Production Analysis",
        category: "Мультимодальный AI",
        context:
          "Мультимодальный анализ кондитерского производства с помощью AI: поиск узких мест, рисков HACCP и возможностей для оптимизации процессов.",
        tech: ["GPT", "Multimodal AI", "Production Analysis", "HACCP"],
        github: "https://github.com/sarmanoveduard-design/MultimodalConfectioneryHW",
        visual: "multimodal",
      },
      {
        title: "Weighted Lead Distribution CRM",
        category: "Backend / Автоматизация",
        context:
          "Лёгкая miniCRM на FastAPI с автоматическим распределением лидов по заданным весам и ограничениям нагрузки операторов.",
        tech: ["FastAPI", "Python", "Backend", "Lead Routing", "API"],
        github: "https://github.com/sarmanoveduard-design/miniCRM-backend-test",
        visual: "crm",
      },
    ],
  },
  expertise: {
    eyebrow: "ЭКСПЕРТИЗА",
    title: ["Что я могу создать", "для вашего бизнеса."],
    intro:
      "От AI-автоматизации до полноценных программных продуктов — системы, построенные вокруг реальных бизнес-процессов.",
    examplesLabel: "Применение в бизнесе",
    stackLabel: "Стек технологий",
    services: [
      {
        title: "AI-автоматизация",
        description:
          "Автоматизация повторяющихся бизнес-процессов, общения с клиентами, работы с документами и внутренних операций с помощью AI.",
        examples: ["Обработка лидов", "Поддержка клиентов", "Документы", "Бизнес-процессы"],
        tech: ["LLM", "APIs", "FastAPI", "Webhooks"],
        visual: "automation",
      },
      {
        title: "AI-агенты",
        description:
          "AI-агенты, которые работают с контекстом бизнеса, используют инструменты и API и выполняют многошаговые задачи.",
        examples: ["Продажи", "Исследования", "Внутренние ассистенты", "Работа с инструментами"],
        tech: ["LLM Agents", "LangGraph", "Tools", "APIs"],
        visual: "agents",
      },
      {
        title: "RAG и системы знаний",
        description:
          "AI-системы для работы с документами компании, регламентами, базами знаний и закрытыми данными вместо ответов только из памяти модели.",
        examples: ["Поиск по документам", "База знаний", "AI-консультанты", "Семантический поиск"],
        tech: ["RAG", "Embeddings", "FAISS", "Vector Search"],
        visual: "knowledge",
      },
      {
        title: "SaaS и веб-продукты",
        description:
          "Полноценные веб-продукты: frontend, backend, авторизация, бизнес-логика, базы данных и внешние интеграции.",
        examples: ["Личные кабинеты", "Панели управления", "Внутренние системы", "SaaS-сервисы"],
        tech: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL"],
        visual: "saas",
      },
      {
        title: "Backend и интеграции",
        description:
          "Backend-сервисы и API для связи бизнес-систем, баз данных, мессенджеров и внешних платформ.",
        examples: ["REST API", "CRM", "Мессенджеры", "Внешние сервисы"],
        tech: ["Python", "FastAPI", "PostgreSQL", "Redis"],
        visual: "backend",
      },
      {
        title: "Мультимодальный AI",
        description:
          "Системы, которые объединяют текст, изображения, аудио и другие источники данных для анализа реальных бизнес-задач.",
        examples: ["Анализ изображений", "Работа с речью", "Анализ процессов", "Мультимодальные ассистенты"],
        tech: ["Vision", "STT/TTS", "LLM", "Multimodal AI"],
        visual: "multimodal",
      },
    ],
    cta: {
      title: "Есть процесс, который пора автоматизировать?",
      text: "Опишите задачу — помогу определить, что можно автоматизировать и какая архитектура для этого подходит.",
      button: "Обсудить проект",
    },
  },
  about: {
    eyebrow: "ОБО МНЕ",
    title: ["Проектирую не просто AI-функции,", "а работающие системы."],
    paragraphs: [
      "Я — Eduard Sarmanov, AI Systems Architect и Full-Stack Engineer. Проектирую и создаю программные системы, которые объединяют AI, backend, данные, интерфейсы и внешние сервисы в единый рабочий продукт.",
      "Мне интересны задачи, где недостаточно просто подключить модель через API. Я разбираю бизнес-процесс, проектирую архитектуру и довожу решение до системы, которой можно пользоваться в реальной работе.",
    ],
    identityLabel: "IDENTITY",
    name: "EDUARD SARMANOV",
    roles: ["AI Systems Architect", "Full-Stack Engineer"],
    locationLabel: "LOCATION",
    location: "South Korea · Remote",
    focusLabel: "FOCUS",
    focus: ["AI Systems", "Automation", "RAG", "Agents", "SaaS", "Backend"],
    principleLabel: "ПОДХОД",
    principle:
      "Бизнес-задача → архитектура системы → реализация → измеримый рабочий результат.",
  },
  contact: {
    eyebrow: "КОНТАКТЫ",
    title: ["Есть задача?", "Давайте разберём."],
    intro:
      "Расскажите, что сейчас делается вручную, занимает много времени или требует AI. Я помогу определить, как это можно превратить в рабочую систему.",
    whatsapp: "Написать в WhatsApp",
    whatsappMessage:
      "Эдуард, здравствуйте. Я посмотрел ваше портфолио и хотел бы обсудить проект.",
    telegram: "Telegram",
    call: "Позвонить",
    email: "Email",
    github: "GitHub",
    openAction: "Открыть",
  },
} as const satisfies Dictionary;

export const dictionaries: Record<Locale, Dictionary> = { en, ru };
