import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { ADMIN_SESSION_COOKIE, isAdminSessionToken } from "@/lib/server/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (isAdminSessionToken(token)) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050811] px-5 py-10 sm:px-8">
      <AdminLoginForm />
    </main>
  );
}
