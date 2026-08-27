import "server-only";
import { aiConfig } from "./config";
import { getOpenAIClient } from "./openai";
import { gateInstructions, wrapUserContent } from "./prompts";
import { gateJsonSchema, isGateResult, type GateResult } from "./schemas";

const abusePatterns = [
  /ignore (all|any|the|previous) instructions?/i,
  /reveal (your |the )?(system|developer) prompt/i,
  /покажи (системн|developer|внутренн)/i,
  /игнорируй (все |предыдущие )?инструкции/i,
];

const obviousGeneralProgrammingPatterns = [
  /(?:write|build|create|make) (?:me )?(?:a |an )?(?:react|next\.js|vue|angular) (?:app|application|website)/i,
  /напиши (?:мне )?(?:react|next\.js|vue|angular)[- ]?(?:приложение|сайт)/i,
];

export function detectImmediateDenial(input: string): GateResult | null {
  if (abusePatterns.some((pattern) => pattern.test(input))) {
    return { allowed: false, category: "abuse", reason: "Instruction override or prompt extraction request." };
  }
  if (obviousGeneralProgrammingPatterns.some((pattern) => pattern.test(input))) {
    return { allowed: false, category: "off_topic", reason: "General programming request, not a business-process audit." };
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
