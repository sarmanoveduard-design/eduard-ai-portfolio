import "server-only";
import OpenAI from "openai";
import { aiConfig } from "./config";

let client: OpenAI | undefined;

export function getOpenAIClient() {
  if (!aiConfig.openAIKey) throw new Error("AI_UNAVAILABLE");
  client ??= new OpenAI({ apiKey: aiConfig.openAIKey, timeout: aiConfig.timeoutMs, maxRetries: 1 });
  return client;
}
