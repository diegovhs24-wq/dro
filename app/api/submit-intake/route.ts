import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { sendSubmissionNotificationEmail } from "@/lib/email";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "lxi5ttc2",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

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

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Write token not configured" }, { status: 500 });
  }

  const submittedAt = new Date().toISOString();

  try {
    await writeClient.create({
      _type: "formSubmission",
      submittedAt,
      intakeFormRef: {
        _type: "reference",
        _ref: payload.intakeFormId,
      },
      entries: payload.entries.map((entry, i) => ({
        _key: `entry-${i}`,
        fieldKey: entry.fieldKey,
        label: entry.label,
        value: entry.value,
      })),
    });
  } catch (err) {
    console.error("formSubmission create failed:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  // Notify admin by email. The submission is already saved, so a failure here
  // must not turn into an error response for the visitor.
  try {
    const form = await writeClient.fetch<{ formTitle?: string; title?: string } | null>(
      `*[_type == "intakeForm" && _id == $id][0]{ formTitle, title }`,
      { id: payload.intakeFormId }
    );

    await sendSubmissionNotificationEmail({
      formTitle: form?.formTitle || form?.title || "Intakeformulier",
      submittedAt,
      entries: payload.entries,
    });
  } catch (err) {
    console.error("Admin notification email failed:", err);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
