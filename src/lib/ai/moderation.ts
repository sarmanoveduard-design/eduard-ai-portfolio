import "server-only";
import { getOpenAIClient } from "./openai";

export async function isModerationBlocked(input: string, signal: AbortSignal) {
  const response = await getOpenAIClient().moderations.create(
    { model: "omni-moderation-latest", input },
    { signal },
  );
  return response.results.some((result) => result.flagged);
}
