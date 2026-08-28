import "server-only";
import { aiConfig } from "./config";
import { getOpenAIClient } from "./openai";
import { gateInstructions, wrapUserContent } from "./prompts";
import { gateJsonSchema, isGateResult, type GateResult } from "./schemas";

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

export async function classifyPurpose(input: string, signal: AbortSignal): Promise<GateResult> {
  const response = await getOpenAIClient().responses.create({
    model: aiConfig.gateModel,
    instructions: gateInstructions,
    input: wrapUserContent(input),
    max_output_tokens: aiConfig.gateMaxOutputTokens,
    store: false,
    tools: [],
    tool_choice: "none",
    text: { format: { type: "json_schema", name: "business_audit_gate", strict: true, schema: gateJsonSchema } },
  }, { signal });

  const parsed: unknown = JSON.parse(response.output_text);
  if (!isGateResult(parsed)) throw new Error("INVALID_GATE_OUTPUT");
  return parsed;
}
