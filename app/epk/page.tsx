import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const epkFileName = "JURNALIST EPK 24 V4.pdf";
const epkHref = `/${encodeURIComponent(epkFileName)}`;

export const metadata: Metadata = {
  title: "JURNALIST EPK",
  description: "Download the official JURNALIST EPK PDF.",
};

export default function EpkPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32 sm:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/media/Jurnalist 14 by Craig R McIntosh.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-xs uppercase tracking-[0.12em] text-[#f6a21a]">Electronic Press Kit</p>
          <h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">EPK</h1>
          <p className="mt-5 text-lg leading-relaxed text-[#d5d6db] sm:text-xl">
            Download the latest JURNALIST EPK as a PDF.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={epkHref}
              download
              className="inline-flex w-fit rounded-xl bg-gradient-to-b from-[#f7b53f] to-[#f6a21a] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-[#2f2108] shadow-[0_10px_35px_rgba(246,162,26,0.34)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
            >
              Download JURNALIST EPK
            </a>
            <a
              href={epkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit rounded-xl border border-white/15 bg-[#1a1d26]/70 px-6 py-3 text-sm font-semibold tracking-[0.06em] text-[#f2f2f2]/95 hover:bg-[#272a34]/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
            >
              Open in new tab
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
