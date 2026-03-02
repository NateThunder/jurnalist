"use client";

import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "HOME" },
  { href: "/music", label: "MUSIC" },
  { href: "/stems", label: "STEMS" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="bg-gradient-to-b from-black/70 via-black/45 to-black/10">
        <div className="mx-auto flex h-24 w-full max-w-[1240px] items-center px-5 sm:px-8">
          <a
            href="/"
            className="text-3xl font-extrabold uppercase tracking-tight text-[#f6a21a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a] sm:text-5xl"
          >
            JURNALIST
          </a>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-9 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-sm font-semibold tracking-[0.08em] text-[#f2f2f2]/90 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="ml-6 hidden rounded-2xl border border-white/15 bg-[#1a1d26]/70 px-6 py-3 text-sm font-semibold tracking-[0.06em] text-[#f2f2f2]/95 hover:bg-[#272a34]/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a] md:inline-flex"
          >
            CONTACT
          </a>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#161923]/70 text-white hover:bg-[#262a34]/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6a21a] md:hidden"
            onClick={() => setIsOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {isOpen ? (
                <path d="M6 6L18 18M18 6L6 18" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`overflow-hidden border-t border-white/10 bg-[#0b0e16]/95 transition-all duration-300 md:hidden ${
            isOpen ? "max-h-[24rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav aria-label="Mobile primary" className="mx-auto flex max-w-[1240px] flex-col gap-1 px-5 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="rounded-lg px-3 py-2 text-sm font-semibold tracking-[0.08em] text-[#f2f2f2]/95 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6a21a]"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 inline-flex w-fit rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-[#f2f2f2] hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f6a21a]"
              onClick={closeMenu}
            >
              CONTACT
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
