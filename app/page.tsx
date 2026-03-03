import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const spotifyArtistUrl = "https://open.spotify.com/artist/29HYRAPfFehxCFEz951HtG?si=mFwcOgd6T-OxL9t7Y4GjmQ";
const spotifyEmbedUrl = "https://open.spotify.com/embed/artist/29HYRAPfFehxCFEz951HtG";
const spotifyBannerUrl = "https://image-cdn-fa.spotifycdn.com/image/ab6761610000517418df89a573a8eeac102d1dcb";
const bookingEmail = "Jurnalistbooking@gmail.com";
type SocialIconName = "bandcamp" | "patreon" | "youtube" | "instagram" | "facebook";

const socialLinks = [
  { label: "Bandcamp", href: "https://jurnalist1.bandcamp.com/", icon: "bandcamp" },
  { label: "Patreon", href: "https://www.patreon.com/jurnalist", icon: "patreon" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCWJO-2l2mNv2OQNkxEZto1Q", icon: "youtube" },
  { label: "Instagram", href: "https://instagram.com/jurnalistmte", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com/jurnalistbdp", icon: "facebook" },
] as const;

function SocialIcon({ icon }: { icon: SocialIconName }) {
  if (icon === "patreon") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="16.3" cy="7.7" r="4.3" />
        <rect x="4.1" y="4.1" width="4.1" height="15.8" rx="0.9" />
      </svg>
    );
  }

  if (icon === "bandcamp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.2 17.3 9.6 6.8H20.8l-6.4 10.5Z" />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.7" y="6.2" width="18.6" height="11.6" rx="4.2" />
        <path d="m10.2 9.3 5.1 2.7-5.1 2.7Z" fill="#151a24" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.8" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="17.2" cy="6.8" r="1.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 12C23 5.9 18.1 1 12 1S1 5.9 1 12c0 5.2 3.6 9.6 8.4 10.7v-7.1H7.1V12h2.3v-1.5c0-2.5 1.1-4.7 4.8-4.7.7 0 1.9.2 2.4.3v2.9c-.3 0-.8-.1-1.7-.1-1.3 0-1.8.5-1.8 1.8V12h3.3l-.6 3.6h-2.7v7.3c5.4-.7 9.9-5.3 9.9-10.9Z" />
    </svg>
  );
}

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

        <section id="contact" className="scroll-mt-28 border-t border-white/10 bg-[#070911] px-6 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="text-3xl font-extrabold uppercase tracking-[0.06em] text-[#f6a21a] sm:text-4xl">Contact</h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#d5d6db] sm:text-xl">Bookings and collaborations:</p>

            <a
              href={`mailto:${bookingEmail}`}
              className="mt-5 inline-flex rounded-xl bg-gradient-to-b from-[#f7b53f] to-[#f6a21a] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-[#2f2108] shadow-[0_10px_35px_rgba(246,162,26,0.34)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
            >
              {bookingEmail}
            </a>

            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex h-11 w-14 items-center justify-center rounded-xl border border-white/15 bg-[#151a24]/80 text-[#f2f2f2] transition hover:bg-[#202533] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6a21a] [&>svg]:h-6 [&>svg]:w-6 [&>svg]:fill-current"
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

