import type { Locale } from "./config";

export { isLocale, locales } from "./config";
export type { Locale } from "./config";

const en = {
  nav: {
    label: "Primary navigation",
    projects: "Projects",
    expertise: "What I Build",
    audit: "AI Analysis",
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
    description: [
      "I help businesses reduce manual work, handle customers and data faster, and turn ideas into practical digital systems.",
      "I build automation, AI assistants, intelligent document search and complete online products — from an idea to a working system.",
    ],
    path: ["From business problem", "architecture", "working product"],
    explore: "My projects",
    discuss: "Try AI Analysis",
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
    eyebrow: "WHAT I BUILD",
    title: ["What I can build", "for your business."],
    intro:
      "From AI automation to complete software products — systems designed around real business processes.",
    examplesLabel: "Business applications",
    stackLabel: "Technology stack",
    services: [
      {
        title: "Routine work automation",
        technicalLabel: "AI AUTOMATION",
        description:
          "The system can process incoming requests, move data between services, assist customers, work with documents and pass tasks to employees.",
        examples: ["Customer requests", "Documents", "Support", "Repetitive operations"],
        tech: ["LLM", "APIs", "FastAPI", "Webhooks"],
        visual: "automation",
      },
      {
        title: "AI assistants for business",
        technicalLabel: "AI AGENTS",
        description:
          "More than a chatbot. An AI assistant can understand a task, find information, work with your services and complete multi-step actions.",
        examples: ["Sales", "Information search", "Internal assistant", "CRM workflows"],
        tech: ["LLM Agents", "LangGraph", "Tools", "APIs"],
        visual: "agents",
      },
      {
        title: "AI that knows your documents",
        technicalLabel: "RAG / KNOWLEDGE SYSTEMS",
        description:
          "Connect instructions, catalogs, contracts or a knowledge base, and AI can answer questions using your own materials instead of relying only on general model knowledge.",
        examples: ["Documents", "Instructions", "Catalogs", "Knowledge base"],
        tech: ["RAG", "Embeddings", "FAISS", "Vector Search"],
        visual: "knowledge",
      },
      {
        title: "Online services and workspaces",
        technicalLabel: "SAAS / WEB PRODUCTS",
        description:
          "I build complete online systems: customer accounts, dashboards, internal employee tools and services for clients.",
        examples: ["Customer accounts", "Dashboards", "Internal systems", "Online services"],
        tech: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL"],
        visual: "saas",
      },
      {
        title: "Connecting your business services",
        technicalLabel: "BACKEND & INTEGRATIONS",
        description:
          "I build the internal logic that lets websites, CRM systems, databases, messengers and external platforms exchange data automatically.",
        examples: ["CRM", "Messengers", "Databases", "External services"],
        tech: ["Python", "FastAPI", "PostgreSQL", "Redis"],
        visual: "backend",
      },
      {
        title: "AI that understands more than text",
        technicalLabel: "MULTIMODAL AI",
        description:
          "The system can work with images, video, voice and text together — for example to analyze operations, documents, visual information or conversations.",
        examples: ["Photos and images", "Video", "Voice", "Process analysis"],
        tech: ["Vision", "STT/TTS", "LLM", "Multimodal AI"],
        visual: "multimodal",
      },
    ],
    cta: {
      title: "Have a process that takes too much time?",
      text: "Describe it in plain language. AI will help identify what could be automated and what a possible solution might look like.",
      button: "Try AI Analysis",
    },
  },
  audit: {
    eyebrow: "TRY AI RIGHT NOW",
    title: ["Tell me what takes too much of your time.", "AI will show what can be automated."],
    description:
      "Describe in plain language how the work is done today: where requests arrive, what employees do manually, where data has to be copied, or which actions are repeated again and again. AI will analyze the process and show what could be automated, what should remain with people, and what a possible system could look like.",
    inputLabel: "What is currently done manually?",
    placeholder:
      "For example: requests arrive in WhatsApp. A manager manually copies the customer's name, phone number, product and address into a spreadsheet, then informs an employee about the new order...",
    button: "Get AI analysis",
    simpleHint: "You don't need technical terminology — just describe the situation in your own words.",
    retry: "Try again",
    disclaimer:
      "This is a preliminary technical analysis. Final architecture depends on the actual processes, constraints and integrations.",
    privacy:
      "Do not submit passwords, API keys, customer personal data or other confidential information.",
    comingSoon: "AI audit is coming soon.",
    processorLabel: "AUDIT PROCESSOR",
    processorIdle: "Ready for process input",
    processorNodes: ["PROCESS", "ANALYSIS", "ARCHITECTURE"],
    loading: ["Analyzing process", "Finding automation opportunities", "Building architecture"],
    sections: {
      plainLanguage: "In plain language",
      currentProcess: "What happens now",
      whatCanBeAutomated: "What can be automated",
      aiRole: "What AI will do",
      humanRole: "What remains with people",
      summary: "Summary",
      opportunities: "Automation opportunities",
      architecture: "Possible architecture",
      requirements: "Requirements",
      questions: "Questions to clarify",
      risks: "Risks / constraints",
    },
    ctaTitle: "Want to take this architecture further?",
    ctaButton: "Discuss with Eduard",
    errors: {
      invalid: "Describe a meaningful business process in 60–1500 characters and several words.",
      notAllowed: "The AI audit analyzes only real business processes and automation tasks.",
      suggestion: "Describe what people currently do manually, where time is lost, or where errors occur.",
      rateLimited: "Audit limit reached. Please try again later.",
      unavailable: "AI audit is temporarily unavailable. Please try again later.",
      internal: "The audit could not be completed. Please try again.",
      turnstile: "Complete the security check and try again.",
    },
  },
  about: {
    eyebrow: "ABOUT",
    title: ["I don't just add AI features.", "I design working systems."],
    paragraphs: [
      "I'm Eduard Sarmanov. I design and build digital systems that help businesses automate work, use AI and connect different services into one practical workflow.",
      "My specialization is AI Systems Architecture and Full-Stack Engineering. That means I can design the complete system — from what users see to the internal logic, AI, data and integrations.",
      "I'm especially interested in problems where simply connecting ChatGPT or building a bot is not enough. I first understand how the business actually works, then design the solution and turn it into a product people can use every day.",
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
    expertise: "Что я создаю",
    audit: "AI-анализ",
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
    description: [
      "Помогаю бизнесу убрать ручную рутину, быстрее работать с клиентами и данными и превращать идеи в готовые цифровые системы.",
      "Создаю автоматизацию, AI-помощников, умный поиск по документам и полноценные онлайн-сервисы — от идеи до работающего продукта.",
    ],
    path: ["От бизнес-задачи", "к архитектуре", "к работающему продукту"],
    explore: "Мои проекты",
    discuss: "Попробовать AI-анализ",
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
    eyebrow: "ЧТО Я СОЗДАЮ",
    title: ["Что я могу создать", "для вашего бизнеса."],
    intro:
      "От AI-автоматизации до полноценных программных продуктов — системы, построенные вокруг реальных бизнес-процессов.",
    examplesLabel: "Применение в бизнесе",
    stackLabel: "Стек технологий",
    services: [
      {
        title: "Автоматизация рутинной работы",
        technicalLabel: "AI AUTOMATION",
        description:
          "Система сама принимает и обрабатывает заявки, переносит данные, отвечает клиентам, работает с документами и передаёт задачи сотрудникам.",
        examples: ["Заявки клиентов", "Документы", "Поддержка", "Повторяющиеся операции"],
        tech: ["LLM", "APIs", "FastAPI", "Webhooks"],
        visual: "automation",
      },
      {
        title: "AI-помощники для бизнеса",
        technicalLabel: "AI AGENTS",
        description:
          "Не просто чат-боты. Такой помощник может понимать задачу, искать информацию, работать с вашими сервисами и выполнять несколько действий самостоятельно.",
        examples: ["Продажи", "Поиск информации", "Внутренний помощник", "Работа с CRM"],
        tech: ["LLM Agents", "LangGraph", "Tools", "APIs"],
        visual: "agents",
      },
      {
        title: "AI, который знает ваши документы",
        technicalLabel: "RAG / KNOWLEDGE SYSTEMS",
        description:
          "Загружаете инструкции, каталоги, договоры или базу знаний — и AI отвечает на вопросы именно по вашим материалам, а не только по общей информации модели.",
        examples: ["Документы", "Инструкции", "Каталоги", "База знаний"],
        tech: ["RAG", "Embeddings", "FAISS", "Vector Search"],
        visual: "knowledge",
      },
      {
        title: "Онлайн-сервисы и рабочие кабинеты",
        technicalLabel: "SAAS / WEB PRODUCTS",
        description:
          "Создаю полноценные онлайн-системы: личные кабинеты, панели управления, внутренние программы для сотрудников и сервисы для клиентов.",
        examples: ["Личные кабинеты", "Панели управления", "Внутренние системы", "Онлайн-сервисы"],
        tech: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL"],
        visual: "saas",
      },
      {
        title: "Связь между вашими сервисами",
        technicalLabel: "BACKEND & INTEGRATIONS",
        description:
          "Настраиваю внутреннюю часть системы, чтобы сайт, CRM, база данных, WhatsApp, Telegram и другие сервисы автоматически обменивались данными.",
        examples: ["CRM", "Мессенджеры", "Базы данных", "Внешние сервисы"],
        tech: ["Python", "FastAPI", "PostgreSQL", "Redis"],
        visual: "backend",
      },
      {
        title: "AI, который понимает не только текст",
        technicalLabel: "MULTIMODAL AI",
        description:
          "Система может работать с фотографиями, видео, голосом и текстом одновременно — например анализировать производство, документы, изображения или разговоры.",
        examples: ["Фото и изображения", "Видео", "Голос", "Анализ процессов"],
        tech: ["Vision", "STT/TTS", "LLM", "Multimodal AI"],
        visual: "multimodal",
      },
    ],
    cta: {
      title: "Есть процесс, который отнимает слишком много времени?",
      text: "Опишите его обычными словами. AI поможет показать, какие действия можно автоматизировать и как может выглядеть решение.",
      button: "Попробовать AI-анализ",
    },
  },
  audit: {
    eyebrow: "ПОПРОБУЙТЕ AI ПРЯМО СЕЙЧАС",
    title: ["Расскажите, что отнимает у вас время.", "AI покажет, что можно автоматизировать."],
    description:
      "Опишите обычными словами, как сейчас устроена ваша работа. Например: откуда приходят заявки, что сотрудники делают вручную, где приходится переносить данные или постоянно повторять одни и те же действия. AI разберёт процесс и покажет, что можно передать автоматике, что оставить человеку и как может выглядеть готовая система.",
    inputLabel: "Что у вас сейчас делается вручную?",
    placeholder:
      "Например: заявки приходят в WhatsApp. Менеджер вручную записывает имя, телефон, товар и адрес в таблицу, потом сообщает сотруднику о новом заказе...",
    button: "Получить AI-анализ",
    simpleHint: "Не нужно знать технические термины — просто опишите ситуацию своими словами.",
    retry: "Попробовать снова",
    disclaimer:
      "AI формирует предварительный технический разбор. Финальная архитектура зависит от реальных процессов, ограничений и интеграций.",
    privacy:
      "Не отправляйте пароли, API-ключи, персональные данные клиентов и другую конфиденциальную информацию.",
    comingSoon: "AI-аудит скоро будет доступен.",
    processorLabel: "AUDIT PROCESSOR",
    processorIdle: "Ожидает описание процесса",
    processorNodes: ["ПРОЦЕСС", "АНАЛИЗ", "АРХИТЕКТУРА"],
    loading: ["Анализирую процесс", "Ищу точки автоматизации", "Формирую архитектуру"],
    sections: {
      plainLanguage: "Простыми словами",
      currentProcess: "Что происходит сейчас",
      whatCanBeAutomated: "Что можно автоматизировать",
      aiRole: "Что будет делать AI",
      humanRole: "Что останется человеку",
      summary: "Краткий разбор",
      opportunities: "Что можно автоматизировать",
      architecture: "Возможная архитектура",
      requirements: "Что потребуется",
      questions: "Что нужно уточнить",
      risks: "Риски / ограничения",
    },
    ctaTitle: "Хотите разобрать такую систему подробнее?",
    ctaButton: "Обсудить с Эдуардом",
    errors: {
      invalid: "Опишите содержательный бизнес-процесс длиной от 60 до 1500 символов и в нескольких словах.",
      notAllowed: "AI-аудит анализирует только реальные бизнес-процессы и задачи автоматизации.",
      suggestion: "Опишите, что сейчас люди делают вручную, где тратится время или где возникают ошибки.",
      rateLimited: "Лимит аудитов исчерпан. Попробуйте позже.",
      unavailable: "AI-аудит временно недоступен. Попробуйте позже.",
      internal: "Не удалось завершить аудит. Попробуйте ещё раз.",
      turnstile: "Пройдите проверку безопасности и повторите запрос.",
    },
  },
  about: {
    eyebrow: "ОБО МНЕ",
    title: ["Проектирую не просто AI-функции,", "а работающие системы."],
    paragraphs: [
      "Я — Eduard Sarmanov. Проектирую и создаю цифровые системы, которые помогают бизнесу автоматизировать работу, использовать AI и связывать разные сервисы в один рабочий процесс.",
      "По специализации — AI Systems Architect и Full-Stack Engineer. Это значит, что я могу продумать всю систему целиком: от того, что видит пользователь, до внутренней логики, AI, данных и интеграций.",
      "Мне особенно интересны задачи, где недостаточно просто подключить ChatGPT или сделать бота. Сначала я разбираю, как реально работает бизнес, затем проектирую решение и довожу его до продукта, которым можно пользоваться каждый день.",
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
