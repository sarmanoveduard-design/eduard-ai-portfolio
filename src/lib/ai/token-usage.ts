export type AiTokenUsage = {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  cachedInputTokens?: number;
};

function tokenCount(value: unknown) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}

function addCount(current: number | undefined, value: unknown) {
  const count = tokenCount(value);
  if (count === undefined) return current;
  const sum = (current ?? 0) + count;
  return Number.isSafeInteger(sum) ? sum : current;
}

export function addResponseUsage(current: AiTokenUsage, rawUsage: unknown): AiTokenUsage {
  if (!rawUsage || typeof rawUsage !== "object") return current;
  const usage = rawUsage as Record<string, unknown>;
  const inputDetails = usage.input_tokens_details && typeof usage.input_tokens_details === "object"
    ? usage.input_tokens_details as Record<string, unknown>
    : undefined;

  return {
    inputTokens: addCount(current.inputTokens, usage.input_tokens),
    outputTokens: addCount(current.outputTokens, usage.output_tokens),
    totalTokens: addCount(current.totalTokens, usage.total_tokens),
    cachedInputTokens: addCount(current.cachedInputTokens, inputDetails?.cached_tokens),
  };
}
