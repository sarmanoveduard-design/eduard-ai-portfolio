export type TurnstileSiteverifyResult = {
  success?: boolean;
  hostname?: string;
  action?: string;
};

function normalizeHostname(hostname: string) {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

export function isExpectedTurnstileResult(
  result: TurnstileSiteverifyResult,
  expectedHostname: string,
  expectedAction: string,
) {
  return result.success === true
    && typeof result.hostname === "string"
    && normalizeHostname(result.hostname) === normalizeHostname(expectedHostname)
    && result.action === expectedAction;
}
