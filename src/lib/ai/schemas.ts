import type { Locale } from "@/i18n/config";

export const MIN_AUDIT_INPUT = 20;
export const MAX_AUDIT_INPUT = 1500;

export const architectureNodeTypes = [
  "source",
  "process",
  "ai",
  "data",
  "integration",
  "human",
] as const;

export type ArchitectureNodeType = (typeof architectureNodeTypes)[number];

export type AuditResult = {
  summary: string;
  automationOpportunities: { title: string; description: string }[];
  architecture: { label: string; type: ArchitectureNodeType }[];
  requirements: string[];
  questions: string[];
  risks: string[];
  nextStep: string;
};

export type GateResult = {
  allowed: boolean;
  category:
    | "business_automation"
    | "software_system"
    | "ai_business_usecase"
    | "off_topic"
    | "abuse";
  reason: string;
};

export type AuditRequest = {
  process: string;
  locale: Locale;
  turnstileToken: string;
};

export const gateJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["allowed", "category", "reason"],
  properties: {
    allowed: { type: "boolean" },
    category: {
      type: "string",
      enum: ["business_automation", "software_system", "ai_business_usecase", "off_topic", "abuse"],
    },
    reason: { type: "string", minLength: 1, maxLength: 180 },
  },
} as const;

const shortText = (maxLength: number) => ({ type: "string", minLength: 1, maxLength });

export const auditJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "automationOpportunities", "architecture", "requirements", "questions", "risks", "nextStep"],
  properties: {
    summary: shortText(600),
    automationOpportunities: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: { title: shortText(100), description: shortText(400) },
      },
    },
    architecture: {
      type: "array",
      minItems: 3,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "type"],
        properties: {
          label: shortText(100),
          type: { type: "string", enum: architectureNodeTypes },
        },
      },
    },
    requirements: { type: "array", minItems: 1, maxItems: 5, items: shortText(220) },
    questions: { type: "array", minItems: 1, maxItems: 4, items: shortText(220) },
    risks: { type: "array", minItems: 0, maxItems: 3, items: shortText(220) },
    nextStep: shortText(300),
  },
} as const;

export function parseAuditRequest(value: unknown): AuditRequest | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (typeof candidate.process !== "string" || (candidate.locale !== "en" && candidate.locale !== "ru")) return null;
  const process = candidate.process.trim();
  if (process.length < MIN_AUDIT_INPUT || process.length > MAX_AUDIT_INPUT) return null;
  return {
    process,
    locale: candidate.locale,
    turnstileToken: typeof candidate.turnstileToken === "string" ? candidate.turnstileToken : "",
  };
}

function isTextArray(value: unknown, min: number, max: number) {
  return Array.isArray(value) && value.length >= min && value.length <= max && value.every((item) => typeof item === "string" && item.length > 0);
}

export function isGateResult(value: unknown): value is GateResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  return typeof result.allowed === "boolean"
    && ["business_automation", "software_system", "ai_business_usecase", "off_topic", "abuse"].includes(String(result.category))
    && typeof result.reason === "string";
}

export function isAuditResult(value: unknown): value is AuditResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  const opportunities = result.automationOpportunities;
  const architecture = result.architecture;
  return typeof result.summary === "string"
    && Array.isArray(opportunities) && opportunities.length >= 2 && opportunities.length <= 5
    && opportunities.every((item) => item && typeof item === "object" && typeof item.title === "string" && typeof item.description === "string")
    && Array.isArray(architecture) && architecture.length >= 3 && architecture.length <= 7
    && architecture.every((item) => item && typeof item === "object" && typeof item.label === "string" && architectureNodeTypes.includes(item.type as ArchitectureNodeType))
    && isTextArray(result.requirements, 1, 5)
    && isTextArray(result.questions, 1, 4)
    && isTextArray(result.risks, 0, 3)
    && typeof result.nextStep === "string";
}
