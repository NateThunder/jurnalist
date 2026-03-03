# JURNALIST Landing Page

Responsive single-page artist landing site built with Next.js App Router, TypeScript, and Tailwind CSS.

## Getting Started

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Hero Image

The hero uses:

`public/hero.png`

Replace this file with your production artwork while keeping the same filename to avoid code changes.

If the image was provided in a mounted data folder, copy it with:

```bash
cp /mnt/data/9b4b9c69-72c5-498b-a0a2-d547291c8b8f.png public/hero.png
```

## Structure

- `app/page.tsx`: page composition and placeholder content sections
- `components/Navbar.tsx`: sticky top nav with desktop and mobile menu
- `components/Hero.tsx`: full-screen hero with background image, overlay, CTAs, and platform row
- `components/Section.tsx`: reusable section block for link targets
- `app/epk/page.tsx`: EPK download route (PDF)
- `app/globals.css`: global theme values, smooth scroll, and animation utilities

## EPK

- Public route: `http://localhost:3000/epk`
- The EPK PDF is served from `public/JURNALIST EPK 24 V4.pdf`.

## Notes

- `next/image` is used for the full-page hero background (`fill`, `priority`, `sizes="100vw"`) for responsive optimization.
- The vignette/contrast layer is implemented with stacked gradient overlays to keep center copy readable on top of the image.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
