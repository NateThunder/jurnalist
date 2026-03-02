import { randomUUID } from "crypto";
import { DEFAULT_CURRENCY, slugify, type StemPack } from "@/lib/stems";

export type StemPackInput = Omit<StemPack, "id" | "createdAt" | "updatedAt">;

type ParseSuccess = {
  data: StemPackInput;
};

type ParseFailure = {
  error: string;
};

const asString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const asNumber = (value: unknown, fallback = 0) => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const asBoolean = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const asCurrency = (value: unknown) => {
  const raw = asString(value).toUpperCase();
  if (raw.length !== 3) return DEFAULT_CURRENCY;
  return raw;
};

const isMediaUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith("/");

const normalizeCheckoutUrl = (value: unknown) => {
  const raw = asString(value);
  if (!raw) return undefined;
  if (!/^https?:\/\//i.test(raw)) return null;
  return raw;
};

const parseCheckout = (value: unknown): { stripeUrl?: string; paypalUrl?: string } | null => {
  const safeValue = value && typeof value === "object" ? value : {};
  const stripeUrl = normalizeCheckoutUrl(
    "stripeUrl" in safeValue ? (safeValue as { stripeUrl?: unknown }).stripeUrl : undefined,
  );
  const paypalUrl = normalizeCheckoutUrl(
    "paypalUrl" in safeValue ? (safeValue as { paypalUrl?: unknown }).paypalUrl : undefined,
  );

  if (stripeUrl === null || paypalUrl === null) return null;

  return {
    stripeUrl: stripeUrl || undefined,
    paypalUrl: paypalUrl || undefined,
  };
};

export const parseStemPackInput = (value: unknown): ParseSuccess | ParseFailure => {
  if (!value || typeof value !== "object") {
    return { error: "Invalid payload." };
  }

  const payload = value as Record<string, unknown>;

  const title = asString(payload.title);
  if (!title) return { error: "Track title is required." };

  const artistName = asString(payload.artistName);
  if (!artistName) return { error: "Artist name is required." };

  const parsedPackCheckout = parseCheckout(payload.fullPackCheckout);
  if (parsedPackCheckout === null) {
    return { error: "Full pack checkout links must start with http:// or https://." };
  }

  const stemsInput = Array.isArray(payload.stems) ? payload.stems : [];
  let invalidCheckout = false;
  let invalidPreviewUrl = false;
  let invalidFullFileUrl = false;

  const validStems: StemPackInput["stems"] = [];

  stemsInput.forEach((rawStem) => {
    if (!rawStem || typeof rawStem !== "object") return;

    const stemValue = rawStem as Record<string, unknown>;
    const checkout = parseCheckout(stemValue.checkout);
    if (checkout === null) {
      invalidCheckout = true;
      return;
    }

    const name = asString(stemValue.name);
    const previewUrl = asString(stemValue.previewUrl);
    if (!name || !previewUrl) return;
    if (!isMediaUrl(previewUrl)) {
      invalidPreviewUrl = true;
      return;
    }

    const fullFileUrl = asString(stemValue.fullFileUrl);
    if (fullFileUrl && !isMediaUrl(fullFileUrl)) {
      invalidFullFileUrl = true;
      return;
    }

    validStems.push({
      id: asString(stemValue.id) || randomUUID(),
      name,
      previewUrl,
      fullFileUrl: fullFileUrl || undefined,
      price: Math.max(0, asNumber(stemValue.price, 0)),
      currency: asCurrency(stemValue.currency || payload.currency),
      checkout,
    });
  });

  if (invalidCheckout) {
    return { error: "Stem checkout links must start with http:// or https://." };
  }
  if (invalidPreviewUrl) {
    return { error: "Stem preview URLs must start with http:// or https://." };
  }
  if (invalidFullFileUrl) {
    return { error: "Stem full file URLs must start with http:// or https://." };
  }

  if (validStems.length === 0) {
    return { error: "Add at least one stem with a name and preview URL." };
  }

  const slug = slugify(asString(payload.slug) || title) || `stem-pack-${Date.now()}`;

  const parsed: StemPackInput = {
    slug,
    title,
    artistName,
    description: asString(payload.description) || undefined,
    coverImageUrl: asString(payload.coverImageUrl) || undefined,
    previewMixUrl: asString(payload.previewMixUrl) || undefined,
    fullPackPrice: Math.max(0, asNumber(payload.fullPackPrice, 0)),
    currency: asCurrency(payload.currency),
    fullPackCheckout: parsedPackCheckout,
    isPublished: asBoolean(payload.isPublished, false),
    stems: validStems,
  };

  return { data: parsed };
};
