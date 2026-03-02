import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionToken } from "@/lib/server/adminAuth";
import { parseStemPackInput } from "@/lib/server/stemCatalogInput";
import { createStemPack, listStemPacks } from "@/lib/server/stemCatalogRepo";

export const runtime = "nodejs";

const rejectIfNotAdmin = (request: NextRequest) => {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAdminSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
};

export async function GET(request: NextRequest) {
  const unauthorized = rejectIfNotAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const packs = await listStemPacks({ includeUnpublished: true });
    return NextResponse.json({ packs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load stem packs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = rejectIfNotAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json().catch(() => null)) as unknown;
    const parsed = parseStemPackInput(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const created = await createStemPack(parsed.data);
    return NextResponse.json({ pack: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create stem pack.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
