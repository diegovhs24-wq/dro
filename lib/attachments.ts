// Gedeeld tussen client (directe feedback) en server (echte afdwinging) —
// zelfde regels, één bron van waarheid.

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "heif", "gif"];
export const DOC_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "txt"];
export const ALLOWED_EXTENSIONS = [...IMAGE_EXTENSIONS, ...DOC_EXTENSIONS];

// Nooit toestaan, ongeacht wat de browser als MIME-type opgeeft.
const DANGEROUS_EXTENSIONS = ["exe", "sh", "bat", "cmd", "com", "msi", "app", "dmg", "js", "mjs", "vbs", "ps1", "jar", "apk", "scr"];

// Vercel serverless functions hebben een harde requestbody-limiet van
// ongeveer 4.5 MB. De upload-route proxyt bestanden server-side (zodat het
// Sanity-schrijftoken nooit in de browser komt), dus elk bestand moet in
// één request passen. Vandaar 4 MB i.p.v. de in de opdracht geopperde 25 MB,
// met ruimte voor multipart-overhead.
export const MAX_FILE_SIZE_MB = 4;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Ruim, maar begrensd tegen misbruik. Makkelijk aan te passen.
export const MAX_FILES = 25;

const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  gif: "image/gif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain",
};

export function getExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? (parts.pop() || "").toLowerCase() : "";
}

export function isImageExtension(ext: string): boolean {
  return IMAGE_EXTENSIONS.includes(ext);
}

export function resolveContentType(filename: string, browserType: string | undefined | null): string {
  if (browserType) return browserType;
  const ext = getExtension(filename);
  return EXTENSION_TO_MIME[ext] || "application/octet-stream";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type FileValidationResult = {ok: true; kind: "image" | "file"} | {ok: false; reason: string};

// Allowlist op extensie (robuuster dan vertrouwen op het browser-MIME-type
// alleen: HEIC-foto's en .docx/.xlsx krijgen op sommige mobiele browsers
// geen of een generiek MIME-type mee), plus een expliciete blocklist voor
// uitvoerbare bestanden als extra vangnet.
export function validateFile(filename: string, size: number): FileValidationResult {
  const ext = getExtension(filename);

  if (!ext || DANGEROUS_EXTENSIONS.includes(ext)) {
    return {ok: false, reason: "Dit bestandstype is niet toegestaan."};
  }
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {ok: false, reason: "Dit bestandstype wordt niet ondersteund. Gebruik een foto of pdf/doc/docx/xls/xlsx/txt."};
  }
  if (size > MAX_FILE_SIZE_BYTES) {
    return {ok: false, reason: `Dit bestand is groter dan ${MAX_FILE_SIZE_MB} MB.`};
  }

  return {ok: true, kind: isImageExtension(ext) ? "image" : "file"};
}

export type AttachmentResult = {
  assetId: string;
  kind: "image" | "file";
  originalFilename: string;
  mimeType: string;
  size: number;
};
