import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "jurnalist_admin_session";

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "changeme";
const DEFAULT_SESSION_SECRET = "jurnalist-local-session-secret";

const getAdminUsername = () => process.env.STEMS_ADMIN_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
const getAdminPassword = () => process.env.STEMS_ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
const getSessionSecret = () =>
  process.env.STEMS_ADMIN_SESSION_SECRET?.trim() || DEFAULT_SESSION_SECRET;

const toBuffer = (value: string) => Buffer.from(value, "utf8");

const secureCompare = (left: string, right: string) => {
  const leftBuffer = toBuffer(left);
  const rightBuffer = toBuffer(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
};

const buildSessionDigest = () =>
  createHash("sha256")
    .update(`${getAdminUsername()}:${getAdminPassword()}:${getSessionSecret()}`)
    .digest("hex");

export const buildAdminSessionToken = () => buildSessionDigest();

export const verifyAdminCredentials = (username: string, password: string) =>
  secureCompare(username, getAdminUsername()) && secureCompare(password, getAdminPassword());

export const isAdminSessionToken = (token: string | undefined) =>
  token ? secureCompare(token, buildSessionDigest()) : false;

export const isUsingDefaultAdminPassword = () => !process.env.STEMS_ADMIN_PASSWORD;
