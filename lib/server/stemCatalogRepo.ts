import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { StemPack } from "@/lib/stems";
import type { StemPackInput } from "@/lib/server/stemCatalogInput";

const localStorePath = path.join(process.cwd(), ".data", "stem-packs.json");

const readStemPacks = async (): Promise<StemPack[]> => {
  try {
    const content = await fs.readFile(localStorePath, "utf8");
    const parsed = JSON.parse(content) as StemPack[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
};

const writeStemPacks = async (packs: StemPack[]) => {
  await fs.mkdir(path.dirname(localStorePath), { recursive: true });
  await fs.writeFile(localStorePath, JSON.stringify(packs, null, 2), "utf8");
};

const sortByUpdatedAtDesc = (packs: StemPack[]) =>
  packs.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));

export const listStemPacks = async (options?: { includeUnpublished?: boolean }) => {
  const includeUnpublished = options?.includeUnpublished ?? false;
  const packs = await readStemPacks();
  const visible = includeUnpublished ? packs : packs.filter((pack) => pack.isPublished);
  return sortByUpdatedAtDesc(visible);
};

export const getStemPackById = async (id: string) => {
  const packs = await readStemPacks();
  return packs.find((pack) => pack.id === id) || null;
};

export const createStemPack = async (input: StemPackInput) => {
  const packs = await readStemPacks();
  const now = new Date().toISOString();
  const created: StemPack = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  packs.unshift(created);
  await writeStemPacks(packs);
  return created;
};

export const updateStemPack = async (id: string, input: StemPackInput) => {
  const packs = await readStemPacks();
  const index = packs.findIndex((pack) => pack.id === id);
  if (index < 0) return null;

  const current = packs[index];
  const updated: StemPack = {
    ...input,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };
  packs[index] = updated;
  await writeStemPacks(packs);
  return updated;
};

export const deleteStemPack = async (id: string) => {
  const packs = await readStemPacks();
  const next = packs.filter((pack) => pack.id !== id);
  if (next.length === packs.length) return false;
  await writeStemPacks(next);
  return true;
};
