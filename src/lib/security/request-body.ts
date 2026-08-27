export const MAX_AUDIT_BODY_BYTES = 12_000;

export async function readBoundedJson(request: Request, maxBytes = MAX_AUDIT_BODY_BYTES): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(contentLength) || contentLength < 0 || contentLength > maxBytes || !request.body) {
    throw new Error("INVALID_BODY");
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let totalBytes = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new Error("INVALID_BODY");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("INVALID_BODY");
  } finally {
    reader.releaseLock();
  }
}
