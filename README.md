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
- `app/stems/page.tsx`: public stems marketplace route with preview mixer and checkout buttons
- `app/admin/page.tsx`: protected admin dashboard for stem pack management
- `app/globals.css`: global theme values, smooth scroll, and animation utilities

## Stems Marketplace

- Public route: `http://localhost:3000/stems`
- Admin route: `http://localhost:3000/admin/login`
- Supports:
  - full pack sales and individual stem sales
  - short preview playback with per-stem mute/solo/volume
  - Stripe and PayPal checkout URLs per pack or per stem

### Admin Environment Variables

Set these in `.env.local`:

```bash
STEMS_ADMIN_USERNAME=admin
STEMS_ADMIN_PASSWORD=replace_this
STEMS_ADMIN_SESSION_SECRET=replace_this_too
```

If unset, username defaults to `admin` and password defaults to `changeme` (development fallback only).

### Data Storage

Stem catalog data is stored in:

`./.data/stem-packs.json`

This file is generated automatically and ignored by git.

## Notes

- `next/image` is used for the full-page hero background (`fill`, `priority`, `sizes="100vw"`) for responsive optimization.
- The vignette/contrast layer is implemented with stacked gradient overlays to keep center copy readable on top of the image.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
