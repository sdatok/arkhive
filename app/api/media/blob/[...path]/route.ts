import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { blobPutAccess } from "@/lib/server-upload";

export const runtime = "nodejs";

/**
 * Proxies Blob storage for private stores (and can fetch public blobs by pathname).
 * Uploads with BLOB_PUT_ACCESS=private return URLs like /api/media/blob/products/...
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  const pathname = segments.join("/");
  if (
    !pathname.startsWith("products/") &&
    !pathname.startsWith("submissions/") &&
    !pathname.startsWith("wtf/")
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  if (pathname.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const access = blobPutAccess();
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  try {
    const result = await get(pathname, {
      access,
      token,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (e) {
    console.error("Blob media proxy failed:", e);
    return new NextResponse("Not found", { status: 404 });
  }
}
