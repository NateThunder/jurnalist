import { NextResponse } from "next/server";
import { toPublicStemPack } from "@/lib/stems";
import { listStemPacks } from "@/lib/server/stemCatalogRepo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const packs = await listStemPacks({ includeUnpublished: false });
    return NextResponse.json({ packs: packs.map(toPublicStemPack) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load stem packs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
