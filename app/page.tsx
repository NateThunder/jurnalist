import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const spotifyArtistUrl = "https://open.spotify.com/artist/29HYRAPfFehxCFEz951HtG?si=mFwcOgd6T-OxL9t7Y4GjmQ";
const spotifyEmbedUrl = "https://open.spotify.com/embed/artist/29HYRAPfFehxCFEz951HtG?utm_source=generator";
const spotifyBannerUrl = "https://image-cdn-fa.spotifycdn.com/image/ab6761610000517418df89a573a8eeac102d1dcb";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section id="music" className="scroll-mt-28 bg-[#070911] px-6 pb-0 pt-0 sm:px-8 sm:pb-0 sm:pt-0">
          <div className="mx-auto w-full max-w-5xl">
            <div className="music-fade-shell relative overflow-hidden rounded-[1.6rem] bg-[#060a13]/60">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${spotifyBannerUrl})` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[#060a13]/70" aria-hidden="true" />
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(246,162,26,0.3),transparent_50%)]"
                aria-hidden="true"
              />
              <div className="music-glow-left" aria-hidden="true" />
              <div className="music-glow-right" aria-hidden="true" />
              <div className="music-noise-layer" aria-hidden="true" />

              <div className="relative z-10 grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold uppercase tracking-[0.06em] text-[#f6a21a] sm:text-4xl">Music</h2>
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
          </div>
        </section>
        <section
          id="stems"
          className="relative isolate scroll-mt-28 overflow-hidden bg-[#070911] px-6 pb-0 pt-0 sm:px-8 sm:pb-0 sm:pt-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/media/jurnalist-wall-texture.jpg)" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#060a13]/75" aria-hidden="true" />
          <div className="stems-noise-layer" aria-hidden="true" />

          <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="stems-photo-frame relative mx-auto w-full max-w-[420px] overflow-hidden bg-black/35">
              <Image
                src="/media/jurnalist.jpeg"
                alt="JURNALIST promotional photo"
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="stems-photo-fade" aria-hidden="true" />
              <div className="stems-photo-noise" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold uppercase tracking-[0.06em] text-[#f6a21a] sm:text-4xl">
                Stems Store
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#d5d6db] sm:text-xl">
                Preview short stem clips in an interactive mixer, then purchase full packs or single stems.
              </p>
              <a
                href="/stems"
                className="mt-8 inline-flex rounded-xl bg-gradient-to-b from-[#f7b53f] to-[#f6a21a] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-[#2f2108] shadow-[0_10px_35px_rgba(246,162,26,0.34)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
              >
                Open Stems Marketplace
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

