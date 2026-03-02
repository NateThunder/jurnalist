"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_CURRENCY, slugify, type StemPack } from "@/lib/stems";

type PackDraft = Omit<StemPack, "id" | "createdAt" | "updatedAt">;

const createDraftStem = () => ({
  id:
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `stem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  name: "",
  previewUrl: "",
  fullFileUrl: "",
  price: 0,
  currency: DEFAULT_CURRENCY,
  checkout: {
    stripeUrl: "",
    paypalUrl: "",
  },
});

const createEmptyDraft = (): PackDraft => ({
  slug: "",
  title: "",
  artistName: "",
  description: "",
  coverImageUrl: "",
  previewMixUrl: "",
  fullPackPrice: 0,
  currency: DEFAULT_CURRENCY,
  fullPackCheckout: {
    stripeUrl: "",
    paypalUrl: "",
  },
  isPublished: false,
  stems: [createDraftStem()],
});

export default function AdminDashboard() {
  const router = useRouter();
  const [packs, setPacks] = useState<StemPack[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PackDraft>(createEmptyDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedPack = useMemo(
    () => packs.find((pack) => pack.id === selectedId) || null,
    [packs, selectedId],
  );

  const loadPacks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/stems", { cache: "no-store" });
      if (response.status === 401) {
        router.push("/admin/login");
        router.refresh();
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        packs?: StemPack[];
        error?: string;
      };
      if (!response.ok) {
        setError(payload.error || "Failed to load stem packs.");
        return;
      }
      const nextPacks = payload.packs || [];
      setPacks(nextPacks);

      if (selectedId) {
        const freshSelection = nextPacks.find((pack) => pack.id === selectedId);
        if (freshSelection) {
          setDraft({
            slug: freshSelection.slug,
            title: freshSelection.title,
            artistName: freshSelection.artistName,
            description: freshSelection.description || "",
            coverImageUrl: freshSelection.coverImageUrl || "",
            previewMixUrl: freshSelection.previewMixUrl || "",
            fullPackPrice: freshSelection.fullPackPrice,
            currency: freshSelection.currency,
            fullPackCheckout: {
              stripeUrl: freshSelection.fullPackCheckout.stripeUrl || "",
              paypalUrl: freshSelection.fullPackCheckout.paypalUrl || "",
            },
            isPublished: freshSelection.isPublished,
            stems: freshSelection.stems.map((stem) => ({
              ...stem,
              fullFileUrl: stem.fullFileUrl || "",
              checkout: {
                stripeUrl: stem.checkout.stripeUrl || "",
                paypalUrl: stem.checkout.paypalUrl || "",
              },
            })),
          });
          return;
        }
      }

      if (nextPacks.length > 0 && !selectedId) {
        const first = nextPacks[0];
        setSelectedId(first.id);
        setDraft({
          slug: first.slug,
          title: first.title,
          artistName: first.artistName,
          description: first.description || "",
          coverImageUrl: first.coverImageUrl || "",
          previewMixUrl: first.previewMixUrl || "",
          fullPackPrice: first.fullPackPrice,
          currency: first.currency,
          fullPackCheckout: {
            stripeUrl: first.fullPackCheckout.stripeUrl || "",
            paypalUrl: first.fullPackCheckout.paypalUrl || "",
          },
          isPublished: first.isPublished,
          stems: first.stems.map((stem) => ({
            ...stem,
            fullFileUrl: stem.fullFileUrl || "",
            checkout: {
              stripeUrl: stem.checkout.stripeUrl || "",
              paypalUrl: stem.checkout.paypalUrl || "",
            },
          })),
        });
      }
    } catch {
      setError("Failed to load stem packs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPack = (pack: StemPack) => {
    setSelectedId(pack.id);
    setDraft({
      slug: pack.slug,
      title: pack.title,
      artistName: pack.artistName,
      description: pack.description || "",
      coverImageUrl: pack.coverImageUrl || "",
      previewMixUrl: pack.previewMixUrl || "",
      fullPackPrice: pack.fullPackPrice,
      currency: pack.currency,
      fullPackCheckout: {
        stripeUrl: pack.fullPackCheckout.stripeUrl || "",
        paypalUrl: pack.fullPackCheckout.paypalUrl || "",
      },
      isPublished: pack.isPublished,
      stems: pack.stems.map((stem) => ({
        ...stem,
        fullFileUrl: stem.fullFileUrl || "",
        checkout: {
          stripeUrl: stem.checkout.stripeUrl || "",
          paypalUrl: stem.checkout.paypalUrl || "",
        },
      })),
    });
    setMessage(null);
    setError(null);
  };

  const startNewPack = () => {
    setSelectedId(null);
    setDraft(createEmptyDraft());
    setMessage(null);
    setError(null);
  };

  const savePack = async () => {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const endpoint = selectedId ? `/api/admin/stems/${selectedId}` : "/api/admin/stems";
      const method = selectedId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...draft,
          slug: draft.slug || slugify(draft.title),
        }),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        router.refresh();
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as {
        pack?: StemPack;
        error?: string;
      };
      if (!response.ok || !payload.pack) {
        setError(payload.error || "Failed to save stem pack.");
        return;
      }

      setSelectedId(payload.pack.id);
      setMessage(selectedId ? "Stem pack updated." : "Stem pack created.");
      await loadPacks();
    } catch {
      setError("Failed to save stem pack.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCurrentPack = async () => {
    if (!selectedPack) return;
    const confirmed = window.confirm(`Delete "${selectedPack.title}"?`);
    if (!confirmed) return;

    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/stems/${selectedPack.id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        router.push("/admin/login");
        router.refresh();
        return;
      }

      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(payload.error || "Failed to delete stem pack.");
        return;
      }

      setMessage("Stem pack deleted.");
      setSelectedId(null);
      setDraft(createEmptyDraft());
      await loadPacks();
    } catch {
      setError("Failed to delete stem pack.");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#050811] px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[#f6a21a]">Stems Admin</p>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">Catalog Manager</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={startNewPack}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              + New Pack
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-[#0d121f]/85 p-3">
            <h2 className="px-2 pb-2 text-xs uppercase tracking-[0.1em] text-white/55">All Packs</h2>
            <div className="space-y-2">
              {isLoading ? (
                <p className="px-2 py-3 text-sm text-white/60">Loading...</p>
              ) : packs.length === 0 ? (
                <p className="px-2 py-3 text-sm text-white/50">No packs yet.</p>
              ) : (
                packs.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => selectPack(pack)}
                    className={`w-full rounded-xl border px-3 py-2 text-left ${
                      selectedId === pack.id
                        ? "border-[#f6a21a]/40 bg-[#f6a21a]/10"
                        : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06]"
                    }`}
                  >
                    <p className="truncate text-sm font-semibold text-white">{pack.title}</p>
                    <p className="mt-1 text-xs text-white/55">{pack.artistName}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-white/45">
                      {pack.isPublished ? "Published" : "Draft"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-[#0d121f]/85 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs uppercase tracking-[0.08em] text-white/55">Track Title</span>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((previous) => ({ ...previous, title: event.target.value }))}
                  className="h-11 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs uppercase tracking-[0.08em] text-white/55">Artist Name</span>
                <input
                  value={draft.artistName}
                  onChange={(event) => setDraft((previous) => ({ ...previous, artistName: event.target.value }))}
                  className="h-11 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs uppercase tracking-[0.08em] text-white/55">Slug</span>
                <div className="flex gap-2">
                  <input
                    value={draft.slug}
                    onChange={(event) => setDraft((previous) => ({ ...previous, slug: event.target.value }))}
                    className="h-11 flex-1 rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                  />
                  <button
                    type="button"
                    onClick={() => setDraft((previous) => ({ ...previous, slug: slugify(previous.title) }))}
                    className="rounded-lg border border-white/20 bg-white/5 px-3 text-xs font-semibold text-white/75 hover:bg-white/10"
                  >
                    Auto
                  </button>
                </div>
              </label>
              <label className="space-y-1">
                <span className="text-xs uppercase tracking-[0.08em] text-white/55">Currency</span>
                <input
                  value={draft.currency}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      currency: event.target.value.toUpperCase().slice(0, 3),
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.08em] text-white/55">Description</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => setDraft((previous) => ({ ...previous, description: event.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.08em] text-white/55">Cover Image URL</span>
                <input
                  value={draft.coverImageUrl}
                  onChange={(event) =>
                    setDraft((previous) => ({ ...previous, coverImageUrl: event.target.value }))
                  }
                  className="h-11 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                />
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-xs uppercase tracking-[0.08em] text-white/55">Preview Mix URL (Optional)</span>
                <input
                  value={draft.previewMixUrl}
                  onChange={(event) =>
                    setDraft((previous) => ({ ...previous, previewMixUrl: event.target.value }))
                  }
                  className="h-11 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                />
              </label>
            </div>

            <section className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.06em] text-white">Full Pack Checkout</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="space-y-1">
                  <span className="text-xs text-white/55">Price</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.fullPackPrice}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        fullPackPrice: Math.max(0, Number(event.target.value) || 0),
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                  />
                </label>
                <label className="space-y-1 sm:col-span-2">
                  <span className="text-xs text-white/55">Stripe Checkout URL</span>
                  <input
                    value={draft.fullPackCheckout.stripeUrl || ""}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        fullPackCheckout: { ...previous.fullPackCheckout, stripeUrl: event.target.value },
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                  />
                </label>
                <label className="space-y-1 sm:col-span-3">
                  <span className="text-xs text-white/55">PayPal Checkout URL</span>
                  <input
                    value={draft.fullPackCheckout.paypalUrl || ""}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        fullPackCheckout: { ...previous.fullPackCheckout, paypalUrl: event.target.value },
                      }))
                    }
                    className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                  />
                </label>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-[0.06em] text-white">Individual Stems</h3>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((previous) => ({ ...previous, stems: [...previous.stems, createDraftStem()] }))
                  }
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 hover:bg-white/10"
                >
                  + Add Stem
                </button>
              </div>

              <div className="space-y-3">
                {draft.stems.map((stem, index) => (
                  <article key={stem.id} className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1">
                        <span className="text-xs text-white/55">Stem Name</span>
                        <input
                          value={stem.name}
                          onChange={(event) =>
                            setDraft((previous) => ({
                              ...previous,
                              stems: previous.stems.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, name: event.target.value } : item,
                              ),
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs text-white/55">Price</span>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={stem.price}
                          onChange={(event) =>
                            setDraft((previous) => ({
                              ...previous,
                              stems: previous.stems.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, price: Math.max(0, Number(event.target.value) || 0) }
                                  : item,
                              ),
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                        />
                      </label>
                      <label className="space-y-1 sm:col-span-2">
                        <span className="text-xs text-white/55">Preview URL (Short Clip)</span>
                        <input
                          value={stem.previewUrl}
                          onChange={(event) =>
                            setDraft((previous) => ({
                              ...previous,
                              stems: previous.stems.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, previewUrl: event.target.value } : item,
                              ),
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                        />
                      </label>
                      <label className="space-y-1 sm:col-span-2">
                        <span className="text-xs text-white/55">Full File URL (Admin Record)</span>
                        <input
                          value={stem.fullFileUrl || ""}
                          onChange={(event) =>
                            setDraft((previous) => ({
                              ...previous,
                              stems: previous.stems.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, fullFileUrl: event.target.value } : item,
                              ),
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs text-white/55">Stripe URL</span>
                        <input
                          value={stem.checkout.stripeUrl || ""}
                          onChange={(event) =>
                            setDraft((previous) => ({
                              ...previous,
                              stems: previous.stems.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      checkout: { ...item.checkout, stripeUrl: event.target.value },
                                    }
                                  : item,
                              ),
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="text-xs text-white/55">PayPal URL</span>
                        <input
                          value={stem.checkout.paypalUrl || ""}
                          onChange={(event) =>
                            setDraft((previous) => ({
                              ...previous,
                              stems: previous.stems.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      checkout: { ...item.checkout, paypalUrl: event.target.value },
                                    }
                                  : item,
                              ),
                            }))
                          }
                          className="h-10 w-full rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white outline-none ring-[#f6a21a]/45 focus:ring"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((previous) => ({
                          ...previous,
                          stems: previous.stems.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 hover:bg-white/10"
                    >
                      Remove Stem
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <label className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(event) => setDraft((previous) => ({ ...previous, isPublished: event.target.checked }))}
                className="h-4 w-4 accent-[#f6a21a]"
              />
              Published (visible on /stems)
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={savePack}
                disabled={isSaving}
                className="rounded-lg bg-[#f6a21a] px-5 py-2 text-sm font-extrabold uppercase tracking-[0.06em] text-[#2f2108] disabled:opacity-65"
              >
                {isSaving ? "Saving..." : selectedId ? "Update Pack" : "Create Pack"}
              </button>
              {selectedId ? (
                <button
                  type="button"
                  onClick={deleteCurrentPack}
                  className="rounded-lg border border-rose-400/35 bg-rose-500/20 px-5 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/30"
                >
                  Delete Pack
                </button>
              ) : null}
            </div>

            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
