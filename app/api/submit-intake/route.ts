import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";

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

  try {
    await writeClient.create({
      _type: "formSubmission",
      submittedAt: new Date().toISOString(),
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

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("formSubmission create failed:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }
}
