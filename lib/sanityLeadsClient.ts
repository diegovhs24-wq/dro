import "server-only";

import {createClient, type SanityClient} from "@sanity/client";

// Aanvragen bevatten persoonsgegevens en horen NOOIT in de publieke dataset
// "production". Alle schrijfacties voor aanvragen lopen via deze client, naar
// de private dataset "leads". Alleen server-side (zie "server-only"): het
// schrijftoken mag nooit in de browser of in Studio-code terechtkomen.

const PROJECT_ID = "cwblo9lu";
const API_VERSION = "2024-01-01";

export class LeadsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeadsConfigError";
  }
}

let cached: SanityClient | null = null;

export function getLeadsClient(): SanityClient {
  if (cached) return cached;

  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new LeadsConfigError("SANITY_API_WRITE_TOKEN is niet ingesteld.");
  }

  const dataset = process.env.SANITY_LEADS_DATASET || "leads";
  // Geen enkele fout of verkeerde variabele mag aanvragen alsnog naar de
  // publieke dataset sturen.
  if (dataset === "production") {
    throw new LeadsConfigError("SANITY_LEADS_DATASET mag niet 'production' zijn.");
  }

  cached = createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: API_VERSION,
    token,
    useCdn: false,
  });

  return cached;
}

// Voor logging: alleen foutsoort en statuscode, nooit de foutboodschap of
// het antwoord, want die kunnen formulierinhoud bevatten.
export function describeError(err: unknown): string {
  if (err instanceof LeadsConfigError) return `${err.name}: ${err.message}`;
  if (err && typeof err === "object") {
    const name = (err as {name?: unknown}).name;
    const status = (err as {statusCode?: unknown}).statusCode;
    return `${typeof name === "string" ? name : "Error"}${typeof status === "number" ? ` (HTTP ${status})` : ""}`;
  }
  return "Error";
}
