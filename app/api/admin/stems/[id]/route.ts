import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionToken } from "@/lib/server/adminAuth";
import { parseStemPackInput } from "@/lib/server/stemCatalogInput";
import { deleteStemPack, updateStemPack } from "@/lib/server/stemCatalogRepo";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const rejectIfNotAdmin = (request: NextRequest) => {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isAdminSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const unauthorized = rejectIfNotAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => null)) as unknown;
    const parsed = parseStemPackInput(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const updated = await updateStemPack(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Stem pack not found." }, { status: 404 });
    }

    return NextResponse.json({ pack: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update stem pack.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const unauthorized = rejectIfNotAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const deleted = await deleteStemPack(id);
    if (!deleted) {
      return NextResponse.json({ error: "Stem pack not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete stem pack.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
