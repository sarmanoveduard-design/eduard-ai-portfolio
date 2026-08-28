import type { Locale } from "@/i18n/config";

export const MIN_AUDIT_INPUT = 60;
export const MAX_AUDIT_INPUT = 1500;
export const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
export const TURNSTILE_ACTION = "ai_audit";
export const PLAIN_CURRENT_PROCESS_MAX_LENGTH = 450;
export const PLAIN_LIST_ITEM_MAX_LENGTH = 180;
export const AUDIT_SUMMARY_MAX_LENGTH = 600;

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
  plainLanguage: {
    currentProcess: string;
    whatCanBeAutomated: string[];
    aiRole: string[];
    humanRole: string[];
  };
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
  required: ["plainLanguage", "summary", "automationOpportunities", "architecture", "requirements", "questions", "risks", "nextStep"],
  properties: {
    plainLanguage: {
      type: "object",
      additionalProperties: false,
      required: ["currentProcess", "whatCanBeAutomated", "aiRole", "humanRole"],
      properties: {
        currentProcess: shortText(PLAIN_CURRENT_PROCESS_MAX_LENGTH),
        whatCanBeAutomated: { type: "array", minItems: 1, maxItems: 4, items: shortText(PLAIN_LIST_ITEM_MAX_LENGTH) },
        aiRole: { type: "array", minItems: 1, maxItems: 4, items: shortText(PLAIN_LIST_ITEM_MAX_LENGTH) },
        humanRole: { type: "array", minItems: 1, maxItems: 4, items: shortText(PLAIN_LIST_ITEM_MAX_LENGTH) },
      },
    },
    summary: shortText(AUDIT_SUMMARY_MAX_LENGTH),
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
  if (!isMeaningfulAuditInput(process)) return null;
  if (typeof candidate.turnstileToken !== "string" || candidate.turnstileToken.length > MAX_TURNSTILE_TOKEN_LENGTH) return null;
  return {
    process,
    locale: candidate.locale,
    turnstileToken: candidate.turnstileToken,
  };
}

export function isMeaningfulAuditInput(input: string) {
  const text = input.trim();
  if (text.length < MIN_AUDIT_INPUT || text.length > MAX_AUDIT_INPUT) return false;
  if (/^https?:\/\/\S+\/?$/iu.test(text) || /^www\.\S+\/?$/iu.test(text)) return false;

  const words = text.match(/[\p{L}\p{N}]+/gu) ?? [];
  if (words.length < 4) return false;

  const compact = text.replace(/\s/gu, "");
  const meaningfulCharacters = compact.match(/[\p{L}\p{N}]/gu)?.length ?? 0;
  if (compact.length === 0 || meaningfulCharacters / compact.length < 0.55) return false;

  const frequencies = new Map<string, number>();
  for (const character of compact.toLocaleLowerCase()) {
    frequencies.set(character, (frequencies.get(character) ?? 0) + 1);
  }
  const mostFrequent = Math.max(...frequencies.values());
  if (mostFrequent / compact.length > 0.6) return false;

  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length < 12) return false;
  const vowels = letters.filter((letter) => /[aeiouyаеёиоуыэюя]/iu.test(letter)).length;
  return vowels >= 2;
}

function isText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length >= 1 && value.length <= maxLength;
}

function isTextArray(value: unknown, min: number, max: number, maxLength: number) {
  return Array.isArray(value)
    && value.length >= min
    && value.length <= max
    && value.every((item) => isText(item, maxLength));
}

const trailingForeignGlyph = /[\p{Script=Cyrillic}\p{Script=Latin}][\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Arabic}\p{Script=Hebrew}](?:[.!?…]["'”’)}\]]*)?$/u;
const completeTokenEnding = /[\p{L}\p{N}.!?…%"'”’)}\]]$/u;
const completeSentenceEnding = /[.!?…]["'”’)}\]]*$/u;

function hasValidTextQuality(value: string, maxLength: number, requireCompleteSentence = false) {
  const text = value.trim();
  if (!text || /\uFFFD/u.test(text) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text)) return false;
  if (trailingForeignGlyph.test(text) || !completeTokenEnding.test(text)) return false;
  if (requireCompleteSentence && !completeSentenceEnding.test(text)) return false;
  if (value.length === maxLength && !completeSentenceEnding.test(text)) return false;
  return true;
}

export function hasValidAuditTextQuality(result: AuditResult) {
  const fields: Array<[string, number, boolean?]> = [
    [result.plainLanguage.currentProcess, PLAIN_CURRENT_PROCESS_MAX_LENGTH, true],
    [result.summary, AUDIT_SUMMARY_MAX_LENGTH, true],
    ...result.plainLanguage.whatCanBeAutomated.map((item) => [item, PLAIN_LIST_ITEM_MAX_LENGTH] as [string, number]),
    ...result.plainLanguage.aiRole.map((item) => [item, PLAIN_LIST_ITEM_MAX_LENGTH] as [string, number]),
    ...result.plainLanguage.humanRole.map((item) => [item, PLAIN_LIST_ITEM_MAX_LENGTH] as [string, number]),
    ...result.automationOpportunities.flatMap((item) => [[item.title, 100], [item.description, 400]] as Array<[string, number]>),
    ...result.architecture.map((item) => [item.label, 100] as [string, number]),
    ...result.requirements.map((item) => [item, 220] as [string, number]),
    ...result.questions.map((item) => [item, 220] as [string, number]),
    ...result.risks.map((item) => [item, 220] as [string, number]),
    [result.nextStep, 300],
  ];
  return fields.every(([value, maxLength, requireCompleteSentence]) => hasValidTextQuality(value, maxLength, requireCompleteSentence));
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
  const plainLanguage = result.plainLanguage as Record<string, unknown> | null | undefined;
  return plainLanguage !== null
    && plainLanguage !== undefined
    && typeof plainLanguage === "object"
    && !Array.isArray(plainLanguage)
    && isText(plainLanguage.currentProcess, PLAIN_CURRENT_PROCESS_MAX_LENGTH)
    && isTextArray(plainLanguage.whatCanBeAutomated, 1, 4, PLAIN_LIST_ITEM_MAX_LENGTH)
    && isTextArray(plainLanguage.aiRole, 1, 4, PLAIN_LIST_ITEM_MAX_LENGTH)
    && isTextArray(plainLanguage.humanRole, 1, 4, PLAIN_LIST_ITEM_MAX_LENGTH)
    && isText(result.summary, AUDIT_SUMMARY_MAX_LENGTH)
    && Array.isArray(opportunities) && opportunities.length >= 2 && opportunities.length <= 5
    && opportunities.every((item) => item && typeof item === "object" && isText(item.title, 100) && isText(item.description, 400))
    && Array.isArray(architecture) && architecture.length >= 3 && architecture.length <= 7
    && architecture.every((item) => item && typeof item === "object" && isText(item.label, 100) && architectureNodeTypes.includes(item.type as ArchitectureNodeType))
    && isTextArray(result.requirements, 1, 5, 220)
    && isTextArray(result.questions, 1, 4, 220)
    && isTextArray(result.risks, 0, 3, 220)
    && isText(result.nextStep, 300)
    && hasValidAuditTextQuality(result as AuditResult);
}
