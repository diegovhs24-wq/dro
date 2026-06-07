import { Resend } from "resend";

const BRAND = {
  orange: "#ff6a00",
  ink: "#171717",
  soft: "#f6f5f2",
  cream: "#f7f2ea",
  border: "#e8e3da",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dro-renovaties.nl";
const LOGO_URL = `${SITE_URL.replace(/\/$/, "")}/drobouwlogo.png`;

type SubmissionEntry = { fieldKey: string; label: string; value: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEntryRows(entries: SubmissionEntry[]): string {
  return entries
    .map(
      (entry, i) => `
        <tr>
          <td style="padding:14px 20px;background:${i % 2 === 0 ? "#ffffff" : BRAND.soft};border-bottom:1px solid ${BRAND.border};font-family:'Poppins',Arial,sans-serif;font-size:13px;font-weight:600;color:${BRAND.ink};vertical-align:top;width:38%;">
            ${escapeHtml(entry.label || entry.fieldKey)}
          </td>
          <td style="padding:14px 20px;background:${i % 2 === 0 ? "#ffffff" : BRAND.soft};border-bottom:1px solid ${BRAND.border};font-family:'Poppins',Arial,sans-serif;font-size:14px;color:${BRAND.ink};vertical-align:top;">
            ${escapeHtml(entry.value || "—").replace(/\n/g, "<br/>")}
          </td>
        </tr>`
    )
    .join("");
}

export function renderSubmissionNotificationEmail(params: {
  formTitle: string;
  submittedAt: string;
  entries: SubmissionEntry[];
}): { subject: string; html: string } {
  const { formTitle, submittedAt, entries } = params;

  const formattedDate = new Date(submittedAt).toLocaleString("nl-NL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  });

  const html = `
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nieuwe formulier inzending</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.cream};font-family:'Poppins',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND.border};">
            <tr>
              <td style="background:${BRAND.ink};padding:24px 32px;">
                <img src="${LOGO_URL}" alt="DRO Renovaties" height="36" style="display:block;height:36px;width:auto;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <p style="margin:0 0 6px 0;font-family:'Poppins',Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.orange};">
                  Nieuwe aanvraag ontvangen
                </p>
                <h1 style="margin:0 0 4px 0;font-family:'Poppins',Arial,sans-serif;font-size:22px;font-weight:800;color:${BRAND.ink};">
                  ${escapeHtml(formTitle)}
                </h1>
                <p style="margin:0;font-family:'Poppins',Arial,sans-serif;font-size:13px;color:#6b6b6b;">
                  Ingediend op ${escapeHtml(formattedDate)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 8px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
                  ${renderEntryRows(entries)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <a href="${SITE_URL}/studio/structure/formSubmission"
                   style="display:inline-block;background:${BRAND.orange};color:#ffffff;font-family:'Poppins',Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;">
                  Bekijk in Sanity Studio
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:${BRAND.soft};border-top:1px solid ${BRAND.border};">
                <p style="margin:0;font-family:'Poppins',Arial,sans-serif;font-size:12px;color:#8a8a8a;">
                  Deze e-mail is automatisch verzonden door het intakeformulier op dro-renovaties.nl. De volledige inzending is opgeslagen in Sanity.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject: `Nieuwe aanvraag via "${formTitle}"`,
    html,
  };
}

export async function sendSubmissionNotificationEmail(params: {
  formTitle: string;
  submittedAt: string;
  entries: SubmissionEntry[];
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!apiKey || !from || !to) {
    console.warn("Resend not configured (RESEND_API_KEY / EMAIL_FROM / ADMIN_NOTIFICATION_EMAIL missing) — skipping admin notification email");
    return;
  }

  const { subject, html } = renderSubmissionNotificationEmail(params);
  const resend = new Resend(apiKey);

  const recipients = to.split(",").map((email) => email.trim()).filter(Boolean);

  const { error } = await resend.emails.send({
    from,
    to: recipients,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
