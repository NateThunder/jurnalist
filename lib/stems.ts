export type CheckoutLinks = {
  stripeUrl?: string;
  paypalUrl?: string;
};

export type StemOffer = {
  id: string;
  name: string;
  previewUrl: string;
  fullFileUrl?: string;
  price: number;
  currency: string;
  checkout: CheckoutLinks;
};

export type StemPack = {
  id: string;
  slug: string;
  title: string;
  artistName: string;
  description?: string;
  coverImageUrl?: string;
  previewMixUrl?: string;
  fullPackPrice: number;
  currency: string;
  fullPackCheckout: CheckoutLinks;
  isPublished: boolean;
  stems: StemOffer[];
  createdAt: string;
  updatedAt: string;
};

export type PublicStemOffer = Omit<StemOffer, "fullFileUrl">;

export type PublicStemPack = Omit<StemPack, "stems"> & {
  stems: PublicStemOffer[];
};

export const DEFAULT_CURRENCY = "USD";

export const toPublicStemPack = (pack: StemPack): PublicStemPack => ({
  ...pack,
  stems: pack.stems.map((stem) => ({
    id: stem.id,
    name: stem.name,
    previewUrl: stem.previewUrl,
    price: stem.price,
    currency: stem.currency,
    checkout: stem.checkout,
  })),
});

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
