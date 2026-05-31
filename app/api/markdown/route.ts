import {NextRequest, NextResponse} from "next/server";
import {buildMarkdownForPath} from "@/lib/seo/markdown";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const markdown = await buildMarkdownForPath(path);

  if (!markdown) {
    return new NextResponse("Page not found", {status: 404});
  }

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      Vary: "Accept",
    },
  });
}
