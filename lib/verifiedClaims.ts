// Claims die commercieel sterk zijn maar nog niet bevestigd: garantie,
// reactietijd en het Trustoo-cijfer. In Sanity (Site Settings > Geverifieerde
// claims) staan ze als placeholder met een vinkje "bevestigd". Zonder vinkje,
// zonder bron of zonder datum worden ze NIET getoond: fail closed.

export type VerifiedClaims = {
  guarantee?: {text: string; scope?: string};
  responseTime?: {text: string};
  trustoo?: {score: string; count: number; asOf: string; url?: string};
};

type Raw = Record<string, unknown>;

function rec(value: unknown): Raw | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : null;
}

function text(value: unknown, max = 300): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function confirmed(r: Raw | null): r is Raw {
  return Boolean(r && r.verified === true && text(r.verifiedBy, 80) && typeof r.verifiedAt === "string" && !Number.isNaN(Date.parse(r.verifiedAt)));
}

function httpsUrl(value: unknown): string | undefined {
  const url = text(value, 500);
  return url && /^https:\/\//i.test(url) ? url : undefined;
}

export function pickVerifiedClaims(raw: unknown): VerifiedClaims {
  const r = rec(raw);
  if (!r) return {};
  const out: VerifiedClaims = {};

  const guarantee = rec(r.guarantee);
  if (confirmed(guarantee) && text(guarantee.text)) {
    out.guarantee = {text: text(guarantee.text) as string, scope: text(guarantee.scope)};
  }

  const response = rec(r.responseTime);
  if (confirmed(response) && text(response.text, 120)) {
    out.responseTime = {text: text(response.text, 120) as string};
  }

  const trustoo = rec(r.trustoo);
  if (confirmed(trustoo)) {
    const score = text(trustoo.score, 8);
    const count = typeof trustoo.count === "number" && trustoo.count > 0 ? Math.floor(trustoo.count) : undefined;
    const asOf = typeof trustoo.asOf === "string" && !Number.isNaN(Date.parse(trustoo.asOf)) ? trustoo.asOf.slice(0, 10) : undefined;
    if (score && /^\d{1,2}([.,]\d)?$/.test(score) && count && asOf) {
      out.trustoo = {score: score.replace(".", ","), count, asOf, url: httpsUrl(trustoo.url)};
    }
  }

  return out;
}
