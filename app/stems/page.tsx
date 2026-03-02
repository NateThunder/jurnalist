import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import StemMarketplace from "@/components/stems/StemMarketplace";
import { toPublicStemPack, type PublicStemPack } from "@/lib/stems";
import { listStemPacks } from "@/lib/server/stemCatalogRepo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "JURNALIST Stems",
  description: "Buy full stem packs or individual stems and preview them in the multitrack stem player.",
};

const demoStemPack: PublicStemPack = {
  id: "demo-pack",
  slug: "jurnalist-demo-pack",
  title: "JURNALIST Demo Pack",
  artistName: "JURNALIST",
  description: "Sample preview for the stem player.",
  coverImageUrl: "/media/jurnalist.jpg",
  previewMixUrl: "/media/jurn%20.mp4",
  fullPackPrice: 0,
  currency: "USD",
  fullPackCheckout: {},
  isPublished: true,
  stems: [
    {
      id: "demo-stem-vocal",
      name: "Lead Vocal (Preview)",
      previewUrl: "/media/jurn%20.mp4",
      price: 0,
      currency: "USD",
      checkout: {},
    },
    {
      id: "demo-stem-drums",
      name: "Drums (Preview)",
      previewUrl: "/media/jurn%20.mp4",
      price: 0,
      currency: "USD",
      checkout: {},
    },
    {
      id: "demo-stem-bass",
      name: "Bass (Preview)",
      previewUrl: "/media/jurn%20.mp4",
      price: 0,
      currency: "USD",
      checkout: {},
    },
    {
      id: "demo-stem-synth",
      name: "Synth (Preview)",
      previewUrl: "/media/jurn%20.mp4",
      price: 0,
      currency: "USD",
      checkout: {},
    },
    {
      id: "demo-stem-adlibs",
      name: "Adlibs (Preview)",
      previewUrl: "/media/jurn%20.mp4",
      price: 0,
      currency: "USD",
      checkout: {},
    },
  ],
  createdAt: "2026-03-01T00:00:00.000Z",
  updatedAt: "2026-03-01T00:00:00.000Z",
};

export default async function StemsPage() {
  const packs = await listStemPacks({ includeUnpublished: false });
  const publicPacks = packs.map(toPublicStemPack);
  const packsToRender = publicPacks.length > 0 ? publicPacks : [demoStemPack];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,rgba(246,162,26,0.14),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(70,116,255,0.16),transparent_45%),#04060b] px-4 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-10 sm:mb-12">
            <p className="text-xs uppercase tracking-[0.12em] text-[#f6a21a]">JURNALIST Stems</p>
            <h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
              Buy. Isolate. Play.
            </h1>
            <p className="mt-4 max-w-3xl text-base text-white/75 sm:text-lg">
              Open a stem pack, purchase the full set or individual stems, and audition everything in the multitrack
              player before checkout.
            </p>
          </header>

          <StemMarketplace packs={packsToRender} />
        </div>
      </main>
    </>
  );
}
