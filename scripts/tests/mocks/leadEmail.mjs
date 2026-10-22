// Nagebootste leadmail, gestuurd via globalThis.__EMAIL_MODE.
export const sent = (globalThis.__EMAIL_SENT ||= []);
export async function sendLeadEmail(d) {
  const mode = globalThis.__EMAIL_MODE || "ok";
  if (mode === "throws") throw Object.assign(new Error("resend"), {statusCode: 500});
  if (mode === "not-configured") return false;
  if (mode === "hangs") return new Promise(() => {});
  sent.push(d);
  return true;
}
