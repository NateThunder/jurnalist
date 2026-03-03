import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

const spotifyArtistUrl = "https://open.spotify.com/artist/29HYRAPfFehxCFEz951HtG?si=mFwcOgd6T-OxL9t7Y4GjmQ";
const spotifyEmbedUrl = "https://open.spotify.com/embed/artist/29HYRAPfFehxCFEz951HtG";

export const metadata: Metadata = {
  title: "JURNALIST | Music",
  description: "Listen to JURNALIST on Spotify.",
};

export default function MusicPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070911] px-6 pb-12 pt-32 sm:px-8 sm:pt-36">
        <section className="mx-auto w-full max-w-5xl">
          <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b0e16]/85 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <h1 className="text-3xl font-extrabold uppercase tracking-[0.06em] text-[#f6a21a] sm:text-4xl">Music</h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#e0e2e9] sm:text-xl">
                  Stream JURNALIST on Spotify and play tracks directly below.
                </p>
                <a
                  href={spotifyArtistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex rounded-xl bg-gradient-to-b from-[#f7b53f] to-[#f6a21a] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-[#2f2108] shadow-[0_10px_35px_rgba(246,162,26,0.34)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
                >
                  Open Spotify Artist Page
                </a>
              </div>

              <div className="mx-auto w-full max-w-[460px] rounded-[1.3rem] border border-white/20 bg-black/55 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                <iframe
                  src={spotifyEmbedUrl}
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Embed: Jurnalist"
                  className="w-full rounded-[1rem] border-0"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
