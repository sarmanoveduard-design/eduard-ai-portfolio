import "server-only";
import { aiConfig } from "./config";
import { getOpenAIClient } from "./openai";
import { gateInstructions, wrapUserContent } from "./prompts";
import { gateJsonSchema, isGateResult, type GateResult } from "./schemas";

export type PurposeGateFailureReason =
  | "incomplete"
  | "empty_output"
  | "malformed_output"
  | "invalid_output"
  | "unexpected_status"
  | "timeout"
  | "request_failed";

export class PurposeGateUnavailableError extends Error {
  readonly stage = "purpose_gate";

  constructor(readonly reason: PurposeGateFailureReason, readonly attempts = 1) {
    super("AI_UNAVAILABLE");
    this.name = "PurposeGateUnavailableError";
  }
}

export function getPurposeGateFailureReason(error: unknown) {
  return error instanceof PurposeGateUnavailableError ? error.reason : null;
}

const abusePatterns = [
  /\b(?:ignore|disregard|forget|override)\b.{0,35}\b(?:all|any|the|previous|prior|system|developer)\b.{0,20}\b(?:instructions?|prompts?|rules?)\b/iu,
  /\b(?:reveal|show|print|repeat|extract|leak)\b.{0,30}\b(?:system|developer|hidden|internal)\b.{0,15}\b(?:prompt|instructions?|message|rules?)\b/iu,
  /\b(?:jailbreak|developer mode|dan mode|prompt injection)\b/iu,
  /(?:покажи|раскрой|выведи|повтори|извлеки).{0,35}(?:системн|developer|скрыт|внутренн).{0,20}(?:промпт|инструкц|сообщен|правил)/iu,
  /(?:игнорируй|забудь|отмени|переопредели).{0,35}(?:все|предыдущ|системн|developer).{0,20}(?:инструкц|правил|промпт)/iu,
  /\b(?:system|developer)\s*:\s*(?:you are|ignore|act as)\b/iu,
];

const offTopicPatternGroups = [
  // Short, self-contained greetings and casual chat only.
  [/^(?:привет(?:ик)?|здравствуй(?:те)?|доброе утро|добрый (?:день|вечер)|hello|hi|hey|good (?:morning|afternoon|evening))[!.?,\s]*$/iu,
    /^(?:как дела|как ты|что нового|how are you|how'?s it going|what'?s up)[!.?,\s]*$/iu],
  // Trivial calculations or isolated factual questions.
  [/^\s*\d+(?:[.,]\d+)?\s*[+*/×÷-]\s*\d+(?:[.,]\d+)?\s*(?:=|\?)?\s*$/u,
    /^(?:сколько будет|what is|calculate)\s+\d+(?:[.,]\d+)?\s*[+*/×÷-]\s*\d+(?:[.,]\d+)?[?!.\s]*$/iu,
    /^(?:какая столица|кто (?:такой|такая)|when was|who is|what is the capital)(?:\s|$).{0,90}[?!.\s]*$/iu],
  // Translation and study tasks.
  [/^(?:переведи|перевести|translate)(?:\s|[:,-]|$)/iu,
    /(?:^|\s)(?:сделай|реши|напиши|выполни|помоги с)(?:\s|[:,-]).{0,25}(?:домашк|дз|контрольн|экзамен|реферат|курсов|школьн)/iu,
    /\b(?:do|solve|write|complete|help with)\b.{0,25}\b(?:homework|assignment|exam|school essay|term paper)\b/iu],
  // Creative writing, food, weather, politics/news, and entertainment.
  [/^(?:напиши|сочини|write|compose|draft)(?:\s|[:,-]).{0,25}(?:стих|стихотвор|рассказ|истори|стать|эссе|poem|story|article|essay|lyrics?|song)/iu,
    /(?:^|\s)(?:рецепт|как приготовить|recipe|how (?:do i|to) (?:cook|bake|make))(?:\s|[:,-]|$)/iu,
    /^(?:какая|какой|что|будет ли|what|how|will)(?:\s|[:,-]).{0,25}(?:погод|температур|weather|forecast|temperature)/iu,
    /^(?:кто|что|почему|расскажи|what|who|why|tell me)(?:\s|[:,-]).{0,45}(?:президент|правительств|выбор|политик|новост|president|government|election|politics|news)/iu,
    /^(?:(?:посоветуй|порекомендуй|recommend).{0,30})?(?:фильм|сериал|аниме|игр(?:а|у|ы)|знаменитост|movie|tv show|anime|celebrity|video game)(?:\s|[:,-]|$)/iu],
];

const obviousGeneralProgrammingPatterns = [
  /^(?:напиши|создай|сделай|разработай|сгенерируй)(?:\s|[:,-]).{0,35}(?:код|скрипт|функци|программ|react|next\.js|vue|angular|сайт|приложен|бот)/iu,
  /^(?:write|build|create|make|develop|generate)\b.{0,35}\b(?:code|script|function|program|react|next\.js|vue|angular|website|web ?site|app|application|bot)\b/iu,
];

const existingWorkflowSignals = /(?:бизнес[- ]?процесс|сейчас|вручн|сотрудник|менеджер|клиент|заявк|лид|заказ|документ|склад|crm|workflow|currently|manual|employee|manager|customer|request|lead|order|document|warehouse|help ?desk)/iu;

function isRepeatedGarbage(input: string) {
  const compact = input.trim().replace(/\s/gu, "").toLocaleLowerCase();
  if (compact.length < 8) return false;
  if (/^(.)\1{7,}$/u.test(compact)) return true;
  if (/^(.{1,4})\1{3,}$/u.test(compact)) return true;
  const unique = new Set(compact);
  return compact.length >= 16 && unique.size <= 3;
}

export function detectImmediateDenial(input: string): GateResult | null {
  if (abusePatterns.some((pattern) => pattern.test(input))) {
    return { allowed: false, category: "abuse", reason: "Instruction override or prompt extraction request." };
  }
  if (isRepeatedGarbage(input)) {
    return { allowed: false, category: "off_topic", reason: "Obviously meaningless input." };
  }
  if (offTopicPatternGroups.some((patterns) => patterns.some((pattern) => pattern.test(input.trim())))) {
    return { allowed: false, category: "off_topic", reason: "Clearly unrelated to a business-process audit." };
  }
  if (obviousGeneralProgrammingPatterns.some((pattern) => pattern.test(input.trim())) && !existingWorkflowSignals.test(input)) {
    return { allowed: false, category: "off_topic", reason: "General programming request, not an existing business workflow." };
  }
  return null;
}

function failureReason(error: unknown, signal: AbortSignal): PurposeGateFailureReason {
  if (signal.aborted || (error instanceof Error && ["AbortError", "TimeoutError", "APIConnectionTimeoutError", "APIUserAbortError"].includes(error.name))) {
    return "timeout";
  }
  return error instanceof PurposeGateUnavailableError ? error.reason : "request_failed";
}

function isRetryable(error: unknown) {
  if (error instanceof PurposeGateUnavailableError) {
    return !["timeout", "request_failed"].includes(error.reason);
  }
  if (!(error instanceof Error) || ["AbortError", "TimeoutError", "APIConnectionTimeoutError", "APIUserAbortError", "RateLimitError"].includes(error.name)) {
    return false;
  }
  const status = "status" in error && typeof error.status === "number" ? error.status : undefined;
  return error.name === "APIConnectionError" || status === 408 || status === 409 || (status !== undefined && status >= 500);
}

export async function classifyPurpose(input: string, signal: AbortSignal): Promise<GateResult> {
  let attempts = 0;

  while (attempts < 2) {
    if (signal.aborted) throw new PurposeGateUnavailableError("timeout", attempts);
    attempts += 1;

    try {
      const response = await getOpenAIClient().responses.create({
        model: aiConfig.gateModel,
        reasoning: { effort: "minimal" },
        instructions: gateInstructions,
        input: wrapUserContent(input),
        max_output_tokens: aiConfig.gateMaxOutputTokens,
        store: false,
        tools: [],
        tool_choice: "none",
        text: { format: { type: "json_schema", name: "business_audit_gate", strict: true, schema: gateJsonSchema } },
      }, { signal, maxRetries: 0 });

      if (response.status === "incomplete" || response.incomplete_details) {
        throw new PurposeGateUnavailableError("incomplete", attempts);
      }
      if (response.status !== "completed") {
        throw new PurposeGateUnavailableError("unexpected_status", attempts);
      }
      if (typeof response.output_text !== "string") {
        throw new PurposeGateUnavailableError("invalid_output", attempts);
      }

      const outputText = response.output_text.trim();
      if (!outputText) throw new PurposeGateUnavailableError("empty_output", attempts);

      let parsed: unknown;
      try {
        parsed = JSON.parse(outputText) as unknown;
      } catch {
        throw new PurposeGateUnavailableError("malformed_output", attempts);
      }
      if (!isGateResult(parsed)) throw new PurposeGateUnavailableError("invalid_output", attempts);
      return parsed;
    } catch (error) {
      if (attempts < 2 && !signal.aborted && isRetryable(error)) continue;
      throw new PurposeGateUnavailableError(failureReason(error, signal), attempts);
    }
  }

  throw new PurposeGateUnavailableError("request_failed", attempts);
}
