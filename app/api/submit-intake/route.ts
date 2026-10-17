import { NextRequest, NextResponse } from "next/server";
import { sendSubmissionNotificationEmail } from "@/lib/email";
import { fetchSanity } from "@/lib/sanity";
import { describeError, getLeadsClient } from "@/lib/sanityLeadsClient";

// Legacy-route voor de oude, CMS-gedreven IntakeWizard. De nieuwe intake
// gebruikt /api/submit-request. Ook hier gaan aanvragen uitsluitend naar de
// private dataset "leads".

type SubmitPayload = {
  intakeFormId: string;
  entries: Array<{ fieldKey: string; label: string; value: string }>;
};

export async function POST(request: NextRequest) {
  let payload: SubmitPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.entries?.length) {
    return NextResponse.json({ error: "No entries" }, { status: 400 });
  }

  let leads: ReturnType<typeof getLeadsClient>;
  try {
    leads = getLeadsClient();
  } catch (err) {
    console.error("Leads client niet beschikbaar:", describeError(err));
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const submittedAt = new Date().toISOString();
  let documentId: string | undefined;

  try {
    const created = await leads.create({
      _type: "formSubmission",
      submittedAt,
      // Het intakeForm-document staat in "production", niet in "leads":
      // een zwakke verwijzing, anders weigert Sanity het opslaan.
      intakeFormRef: {
        _type: "reference",
        _ref: payload.intakeFormId,
        _weak: true,
      },
      entries: payload.entries.map((entry, i) => ({
        _key: `entry-${i}`,
        fieldKey: entry.fieldKey,
        label: entry.label,
        value: entry.value,
      })),
    });
    documentId = created._id;
  } catch (err) {
    console.error("formSubmission create failed:", describeError(err));
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  // Notify admin by email. The submission is already saved, so a failure here
  // must not turn into an error response for the visitor.
  try {
    // De formuliertitel komt uit de publieke dataset (production), niet uit leads.
    const form = await fetchSanity<{ formTitle?: string; title?: string } | null>(
      `*[_type == "intakeForm" && _id == $id][0]{ formTitle, title }`,
      { id: payload.intakeFormId }
    );

    await sendSubmissionNotificationEmail({
      formTitle: form?.formTitle || form?.title || "Intakeformulier",
      submittedAt,
      entries: payload.entries,
      documentId,
    });
  } catch (err) {
    console.error("Admin notification email failed:", describeError(err));
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
