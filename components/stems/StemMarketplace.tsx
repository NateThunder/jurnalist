"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import PreviewPlayer from "@/components/stems/PreviewPlayer";
import type { CheckoutLinks, PublicStemPack } from "@/lib/stems";

type StemMarketplaceProps = {
  packs: PublicStemPack[];
};

const formatPrice = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const CheckoutButtons = ({ checkout }: { checkout: CheckoutLinks }) => {
  if (!checkout.stripeUrl && !checkout.paypalUrl) {
    return <span className="text-xs text-white/50">Checkout link not configured yet.</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {checkout.stripeUrl ? (
        <a
          href={checkout.stripeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[#625cff]/45 bg-[#625cff]/20 px-3 py-1.5 text-xs font-semibold text-[#d8d6ff] hover:bg-[#625cff]/30"
        >
          Buy via Stripe
        </a>
      ) : null}
      {checkout.paypalUrl ? (
        <a
          href={checkout.paypalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[#1e7ad4]/45 bg-[#1e7ad4]/20 px-3 py-1.5 text-xs font-semibold text-[#c8e5ff] hover:bg-[#1e7ad4]/30"
        >
          Buy via PayPal
        </a>
      ) : null}
    </div>
  );
};

export default function StemMarketplace({ packs }: StemMarketplaceProps) {
  const [expandedPackId, setExpandedPackId] = useState<string | null>(packs[0]?.id ?? null);
  const hasPacks = useMemo(() => packs.length > 0, [packs.length]);
  const activePackId = packs.some((pack) => pack.id === expandedPackId) ? expandedPackId : (packs[0]?.id ?? null);

  if (!hasPacks) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-8 text-center text-white/60">
        No stem packs are live yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {packs.map((pack) => {
        const showPreview = activePackId === pack.id;

        return (
          <article
            key={pack.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(13,18,31,0.9),rgba(7,11,19,0.92))] shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
          >
            <div className="grid gap-0 lg:grid-cols-[330px_1fr]">
              <section className="relative overflow-hidden border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-6">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(246,162,26,0.12),transparent_45%),radial-gradient(circle_at_88%_8%,rgba(95,138,255,0.14),transparent_45%)]"
                  aria-hidden="true"
                />

                <div className="relative z-10 space-y-4">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                    {pack.coverImageUrl ? (
                      <Image
                        src={pack.coverImageUrl}
                        alt={`${pack.title} cover`}
                        width={600}
                        height={600}
                        className="aspect-square h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center text-sm text-white/55">
                        Cover image not set
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-[#f6a21a]/25 bg-[#f6a21a]/10 p-4">
                    <p className="text-xs uppercase tracking-[0.08em] text-[#ffd89a]">Full Pack</p>
                    <p className="mt-1 text-2xl font-extrabold text-white">
                      {formatPrice(pack.fullPackPrice, pack.currency)}
                    </p>
                    <p className="mt-1 text-xs text-white/60">Includes all stems for this track.</p>
                    <div className="mt-3">
                      <CheckoutButtons checkout={pack.fullPackCheckout} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="p-5 sm:p-6">
                <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-[#f6a21a]">Stem Pack</p>
                    <h2 className="mt-1 text-3xl font-extrabold uppercase tracking-[0.03em] text-white sm:text-4xl">
                      {pack.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/70">{pack.artistName}</p>
                    {pack.description ? <p className="mt-3 max-w-3xl text-sm text-white/65">{pack.description}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpandedPackId((previous) => (previous === pack.id ? null : pack.id))}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/85 hover:bg-white/10"
                  >
                    {showPreview ? "Close Player" : "Open Player"}
                  </button>
                </header>

                <section className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.08em] text-white/55">Buy Individual Stems</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {pack.stems.map((stem) => (
                      <article
                        key={stem.id}
                        className="rounded-xl border border-white/12 bg-black/20 p-3"
                      >
                        <p className="text-sm font-semibold text-white">{stem.name}</p>
                        <p className="mt-1 text-xs text-white/60">{formatPrice(stem.price, stem.currency)}</p>
                        <div className="mt-3">
                          <CheckoutButtons checkout={stem.checkout} />
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {showPreview ? (
                  <div className="mt-5">
                    <PreviewPlayer title={pack.title} artistName={pack.artistName} stems={pack.stems} />
                  </div>
                ) : null}
              </section>
            </div>
          </article>
        );
      })}
    </div>
  );
}
