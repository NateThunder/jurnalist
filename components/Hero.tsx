import Link from "next/link";

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M7 4.5v15l12-7.5-12-7.5Z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current">
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.29 17.34a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.58-1.17a.75.75 0 1 1-.33-1.47c4.6-1.03 8.53-.58 11.69 1.35.36.22.48.68.25 1.04Zm1.47-3.28a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.55-11.97-1.4a.94.94 0 1 1-.54-1.79c4.36-1.32 9.79-.67 13.49 1.6.44.27.58.85.31 1.28Zm.13-3.42c-3.89-2.31-10.31-2.52-14.02-1.37a1.13 1.13 0 1 1-.67-2.16c4.26-1.31 11.35-1.06 15.84 1.6a1.13 1.13 0 0 1-1.15 1.93Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-current">
      <path d="M16.65 12.92c.02 2.2 1.94 2.93 1.96 2.94-.02.05-.3 1.06-1 2.08-.6.88-1.22 1.77-2.21 1.79-.98.02-1.3-.58-2.42-.58-1.13 0-1.49.56-2.4.6-.95.03-1.67-.96-2.27-1.83-1.24-1.81-2.2-5.12-.92-7.33.63-1.1 1.76-1.8 2.98-1.82.93-.02 1.8.63 2.42.63.61 0 1.76-.77 2.96-.66.5.02 1.9.2 2.8 1.53-.07.04-1.67.97-1.65 2.65ZM14.8 7.35c.5-.6.83-1.45.74-2.28-.72.03-1.59.48-2.1 1.08-.46.53-.86 1.4-.75 2.22.81.06 1.61-.41 2.11-1.02Z" />
    </svg>
  );
}

export default function Hero() {
  const spotifyArtistUrl = "https://open.spotify.com/artist/29HYRAPfFehxCFEz951HtG?si=mFwcOgd6T-OxL9t7Y4GjmQ";
  const appleMusicArtistUrl = "https://music.apple.com/gb/artist/jurnalist/476791990";

  return (
    <section id="top" className="relative isolate min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/hero.png"
        aria-hidden="true"
      >
        <source src="/media/jurn%20.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1240px] items-center justify-center px-5 pb-0 pt-32 sm:px-8 sm:pt-36">
        <div className="animate-hero-fade w-full max-w-[620px] -translate-y-5 text-center text-[#f2f2f2] sm:-translate-y-8">
          <h1 className="text-[clamp(2.7rem,9vw,5.1rem)] font-extrabold uppercase leading-none tracking-tight text-[#f6a21a]">
            JURNALIST
          </h1>

          <p className="mt-5 font-serif text-[clamp(1.35rem,4.8vw,2.6rem)] font-semibold leading-[1.15] text-[#f4f4f4]">
            Voice of the Underground
          </p>

          <p className="mt-5 text-[clamp(1.05rem,3.2vw,1.65rem)] font-semibold tracking-[0.01em] text-[#f6a21a]">
            Glasgow <span className="px-2 text-[#f2f2f2]/70">&bull;</span> Edinburgh{" "}
            <span className="px-2 text-[#f2f2f2]/70">&bull;</span> Beyond
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={spotifyArtistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#f7b53f] to-[#f6a21a] px-8 text-[1.05rem] font-extrabold tracking-[0.03em] text-[#2f2108] shadow-[0_10px_35px_rgba(246,162,26,0.34)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a] sm:w-auto sm:min-w-[15rem]"
            >
              <PlayIcon />
              LISTEN
            </a>

            <Link
              href="/#contact"
              className="inline-flex h-16 w-full items-center justify-center rounded-2xl border border-white/10 bg-[#1a1d25]/62 px-8 text-[1.05rem] font-extrabold tracking-[0.02em] text-[#f2f2f2] hover:bg-[#262a35]/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a] sm:w-auto sm:min-w-[18rem]"
            >
              BOOK JURNALIST
            </Link>
          </div>

          <div className="mt-10 space-y-2 text-[clamp(1rem,2.4vw,1.45rem)] font-medium leading-[1.3] text-[#d6d6d8]">
            <p>Scottish artist, host and live performer.</p>
            <p>SAY25 winner.</p>
            <p>Founder of groov. Stage presence first.</p>
          </div>

          <div className="mt-9 flex items-center justify-center gap-6 text-[#f2f2f2]">
            <a
              href={spotifyArtistUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Spotify artist page"
              className="inline-flex items-center gap-2 text-[1.45rem] font-semibold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
            >
              <SpotifyIcon />
              <span className="text-[1.45rem] leading-none">Spotify</span>
            </a>
            <a
              href={appleMusicArtistUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Apple Music artist page"
              className="inline-flex items-center gap-2 text-[1.45rem] font-semibold hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
            >
              <AppleIcon />
              <span className="text-[1.45rem] uppercase leading-none">Music</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


