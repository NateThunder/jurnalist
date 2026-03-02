"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        warning?: string;
      };

      if (!response.ok) {
        setError(payload.error || "Login failed.");
        return;
      }

      if (payload.warning) {
        setWarning(payload.warning);
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to reach login endpoint.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-white/15 bg-[#0d121f]/90 p-6">
      <h1 className="text-2xl font-extrabold uppercase tracking-[0.05em] text-white">Admin Login</h1>
      <p className="text-sm text-white/65">
        Sign in to create stem packs, manage previews, and set Stripe/PayPal checkout links.
      </p>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-[0.08em] text-white/55">Username</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-11 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-white outline-none ring-[#f6a21a]/50 focus:ring"
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs uppercase tracking-[0.08em] text-white/55">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-white outline-none ring-[#f6a21a]/50 focus:ring"
          required
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-lg bg-[#f6a21a] text-sm font-extrabold uppercase tracking-[0.06em] text-[#2f2108] disabled:opacity-65"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {warning ? <p className="text-sm text-amber-300">{warning}</p> : null}
    </form>
  );
}
