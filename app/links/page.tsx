import Navbar from "@/components/Navbar";

type SocialIconName = "bandcamp" | "patreon" | "youtube" | "instagram" | "facebook";
type MetaIconName = "spotify" | "apple" | "bandcamp" | "youtube" | "discord";
type HeadingIconName = "spark" | "music";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIconName;
};

type SectionHeading = {
  type: "heading";
  title: string;
  icon: HeadingIconName;
};

type LinkCard = {
  type: "link";
  title: string;
  href: string;
  thumbnail: string;
  subtitle?: string;
  subtitleIcon?: MetaIconName;
  featured?: boolean;
};

type LinkItem = SectionHeading | LinkCard;

type LinktreeSocial = {
  type?: string;
  url?: string;
};

type LinktreeLink = {
  id?: string;
  type?: string;
  title?: string;
  url?: string;
  position?: number;
  thumbnail?: string | null;
  metaData?: {
    title?: string | null;
    description?: string | null;
  };
};

type LinktreePageProps = {
  socialLinks?: LinktreeSocial[];
  links?: LinktreeLink[];
};

const LINKTREE_USERNAME = "jurnalistbdp";
const LINKTREE_PROFILE_URL = `https://linktr.ee/${LINKTREE_USERNAME}`;

const socialTypeToIcon: Record<string, SocialIconName | undefined> = {
  BANDCAMP: "bandcamp",
  PATREON: "patreon",
  YOUTUBE: "youtube",
  INSTAGRAM: "instagram",
  FACEBOOK: "facebook",
};

const linkTypeToMetaIcon: Record<string, MetaIconName | undefined> = {
  SPOTIFY_SONG: "spotify",
  SPOTIFY_ALBUM: "spotify",
  APPLE_MUSIC_SONG: "apple",
  APPLE_MUSIC_ALBUM: "apple",
  BANDCAMP_ALBUM: "bandcamp",
  BANDCAMP_SONG: "bandcamp",
  YOUTUBE_VIDEO: "youtube",
  COMMUNITY_CHANNEL: "discord",
};

function makeThumb(url?: string | null): string {
  if (!url) {
    return "https://assets.production.linktr.ee/profiles/_next/static/media/default-avatar.7f8f18f8.png";
  }

  const hasQuery = url.includes("?");
  return `${url}${hasQuery ? "&" : "?"}io=true&size=thumbnail-stack_v1_0`;
}

function extractPageProps(html: string): LinktreePageProps | null {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) {
    return null;
  }

  try {
    const parsed = JSON.parse(match[1]);
    return parsed?.props?.pageProps ?? null;
  } catch {
    return null;
  }
}

async function getLinktreeData(): Promise<{ socialLinks: SocialLink[]; linkItems: LinkItem[] }> {
  try {
    const response = await fetch(LINKTREE_PROFILE_URL, {
      next: { revalidate: 300 },
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; JurnalistSiteBot/1.0)",
      },
    });

    if (!response.ok) {
      return { socialLinks: [], linkItems: [] };
    }

    const html = await response.text();
    const pageProps = extractPageProps(html);

    if (!pageProps) {
      return { socialLinks: [], linkItems: [] };
    }

    const socialLinks: SocialLink[] = (pageProps.socialLinks ?? [])
      .map((social) => {
        const icon = socialTypeToIcon[social.type ?? ""];
        if (!icon || !social.url) {
          return null;
        }

        return {
          label: icon.charAt(0).toUpperCase() + icon.slice(1),
          href: social.url,
          icon,
        };
      })
      .filter((social): social is SocialLink => Boolean(social));

    let headingCount = 0;
    const linkItems = (pageProps.links ?? [])
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .flatMap((link, index): LinkItem[] => {
        if (link.type === "HEADER") {
          headingCount += 1;
          return [
            {
              type: "heading",
              title: link.title ?? "Section",
              icon: headingCount === 1 ? "spark" : "music",
            },
          ];
        }

        if (!link.url || !link.title) {
          return [];
        }

        const subtitleFromMeta = (link.metaData?.title ?? "").trim();
        const subtitle = subtitleFromMeta && subtitleFromMeta !== link.title ? subtitleFromMeta : undefined;
        const subtitleIcon = linkTypeToMetaIcon[link.type ?? ""];

        return [
          {
            type: "link",
            title: link.title,
            href: link.url,
            thumbnail: makeThumb(link.thumbnail),
            subtitle,
            subtitleIcon,
            featured: index === 0,
          },
        ];
      });

    return { socialLinks, linkItems };
  } catch {
    return { socialLinks: [], linkItems: [] };
  }
}

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
        <path d="m10.2 9.3 5.1 2.7-5.1 2.7Z" fill="#16051d" />
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

function MetaIcon({ icon }: { icon: MetaIconName }) {
  if (icon === "spotify") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path d="M7 10.4c3.6-1.1 6.9-.8 10 .7" fill="none" stroke="#8f6a99" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7.6 13.1c2.9-.8 5.4-.6 7.9.5" fill="none" stroke="#8f6a99" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.2 15.5c2.1-.6 4-.4 5.9.4" fill="none" stroke="#8f6a99" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "apple") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.7 12a7.3 7.3 0 0 1 14.6 0v5.2a2 2 0 0 1-2 2h-1.1a2 2 0 0 1-2-2v-3.8a2 2 0 0 1 2-2h1V12a5.2 5.2 0 1 0-10.4 0v1.4h1a2 2 0 0 1 2 2v3.8a2 2 0 0 1-2 2H6.8a2 2 0 0 1-2-2Z" />
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
        <path d="m10.2 9.3 5.1 2.7-5.1 2.7Z" fill="#8f6a99" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.8 6.6A15 15 0 0 0 16.2 5l-.5.8a13 13 0 0 1 3.6 1.2A14.6 14.6 0 0 0 12 5a14.6 14.6 0 0 0-7.3 1.9A13 13 0 0 1 8.3 5.8L7.8 5A15 15 0 0 0 4.2 6.6C2 10 1.4 13.4 1.7 16.9a15.2 15.2 0 0 0 4.7 2.4l1-1.6-1.7-.8.4-.3a12 12 0 0 0 11.8 0l.4.3-1.7.8 1 1.6a15.2 15.2 0 0 0 4.7-2.4c.3-3.5-.3-6.9-1.5-10.3ZM9 14.6c-.9 0-1.5-.8-1.5-1.8S8.1 11 9 11s1.5.8 1.5 1.8-.6 1.8-1.5 1.8Zm6 0c-.9 0-1.5-.8-1.5-1.8s.6-1.8 1.5-1.8 1.5.8 1.5 1.8-.6 1.8-1.5 1.8Z" />
    </svg>
  );
}

function HeadingIcon({ icon }: { icon: HeadingIconName }) {
  if (icon === "spark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 2 1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2Z" />
        <circle cx="18.5" cy="4.5" r="1.5" />
        <circle cx="5.5" cy="18.5" r="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 2v12.2a3.8 3.8 0 1 1-1.6-3V6.2L9.4 7.8v8.4a3.8 3.8 0 1 1-1.6-3V6.5c0-.7.5-1.3 1.1-1.4l7-1.9c.5-.1 1 .2 1.1.8Z" />
    </svg>
  );
}

export default async function LinksPage() {
  const { socialLinks, linkItems } = await getLinktreeData();

  return (
    <>
      <Navbar />
      <main className="links-page">
        <div className="links-background" aria-hidden="true">
          <span className="links-bg-main" />
        </div>

        <div className="links-shell">
          <section className="links-socials" aria-label="Social links">
            {socialLinks.map((social) => (
              <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}>
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </section>

          <section className="links-list" aria-label="Link list">
            {linkItems.map((item) => {
              if (item.type === "heading") {
                return (
                  <h2 key={item.title} className="links-section-title" aria-label={item.title} title={item.title}>
                    <HeadingIcon icon={item.icon} />
                  </h2>
                );
              }

              return (
                <a key={`${item.href}-${item.title}`} href={item.href} target="_blank" rel="noopener noreferrer" className={`links-card${item.featured ? " links-card-featured" : ""}`}>
                  <span className="links-card-thumb" aria-hidden="true">
                    <img src={item.thumbnail} alt="" loading={item.featured ? "eager" : "lazy"} />
                  </span>

                  <span className="links-card-copy">
                    <span className="links-card-title">{item.title}</span>
                    {item.subtitle ? (
                      <span className="links-card-subtitle">
                        {item.subtitleIcon ? (
                          <span className="links-card-subtitle-icon" aria-hidden="true">
                            <MetaIcon icon={item.subtitleIcon} />
                          </span>
                        ) : null}
                        <span>{item.subtitle}</span>
                      </span>
                    ) : null}
                  </span>

                  <span className="links-card-dots" aria-hidden="true">
                    <svg viewBox="0 0 3 11">
                      <path d="M1.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                    </svg>
                  </span>
                </a>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}

