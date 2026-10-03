import {NextRequest, NextResponse} from "next/server";
import {writeClient} from "@/lib/sanityWriteClient";
import {resolveContentType, validateFile, type AttachmentResult} from "@/lib/attachments";

// Grotere bestanden (tot de 4 MB-grens) kunnen een paar seconden kosten om
// naar Sanity te streamen; geef de functie wat lucht boven de Vercel-default.
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({error: "Invalid upload"}, {status: 400});
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({error: "No file provided"}, {status: 400});
  }

  const validation = validateFile(file.name, file.size);
  if (!validation.ok) {
    return NextResponse.json({error: validation.reason}, {status: 400});
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({error: "Write token not configured"}, {status: 500});
  }

  const contentType = resolveContentType(file.name, file.type);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await writeClient.assets.upload(validation.kind, buffer, {
      filename: file.name,
      contentType,
    });

    const result: AttachmentResult = {
      assetId: asset._id,
      kind: validation.kind,
      originalFilename: file.name,
      mimeType: contentType,
      size: file.size,
    };

    return NextResponse.json(result, {status: 201});
  } catch (err) {
    console.error("Attachment upload failed:", err);
    return NextResponse.json({error: "Uploaden is mislukt, probeer het nog eens."}, {status: 500});
  }
}
