// Free, keyless address lookup via the Dutch government's PDOK Locatieserver.
// https://www.pdok.nl/introductie/-/article/pdok-locatieserver
export type PdokAddress = {
  id: string;
  displayName: string;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
};

type PdokDoc = Record<string, unknown>;

export function normalizeDutchPostcode(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, "").toUpperCase();
  return /^[1-9][0-9]{3}[A-Z]{2}$/.test(cleaned) ? cleaned : null;
}

function asString(value: unknown): string {
  return value === undefined || value === null ? "" : String(value);
}

function toAddress(doc: PdokDoc): PdokAddress {
  return {
    id: asString(doc.id) || `${asString(doc.postcode)}-${asString(doc.huis_nlt) || asString(doc.huisnummer)}`,
    displayName: asString(doc.weergavenaam),
    street: asString(doc.straatnaam),
    houseNumber: asString(doc.huis_nlt) || asString(doc.huisnummer),
    postcode: asString(doc.postcode),
    city: asString(doc.woonplaatsnaam),
  };
}

// Looks up a Dutch address by postcode + house number. Returns an empty
// array (never throws to the caller in a way that breaks the UI) when the
// postcode is invalid, nothing is found, or the request fails/times out,
// so the funnel can fall back to manual address entry.
export async function lookupPdokAddress(postcode: string, houseNumber: string): Promise<PdokAddress[]> {
  const normalizedPostcode = normalizeDutchPostcode(postcode);
  const numericHouseNumber = houseNumber.match(/\d+/)?.[0];

  if (!normalizedPostcode || !numericHouseNumber) {
    return [];
  }

  const q = `postcode:${normalizedPostcode} and huisnummer:${numericHouseNumber}`;
  const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(q)}&fq=type:adres&rows=5`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {signal: controller.signal});
    clearTimeout(timeout);

    if (!res.ok) return [];

    const data = await res.json();
    const docs: PdokDoc[] = data?.response?.docs ?? [];
    return docs.map(toAddress);
  } catch {
    return [];
  }
}
