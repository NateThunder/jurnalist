import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionToken,
  isUsingDefaultAdminPassword,
  verifyAdminCredentials,
} from "@/lib/server/adminAuth";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  const username = body?.username?.trim() || "";
  const password = body?.password?.trim() || "";

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    warning: isUsingDefaultAdminPassword()
      ? "Using default admin password. Set STEMS_ADMIN_PASSWORD in production."
      : undefined,
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: buildAdminSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
