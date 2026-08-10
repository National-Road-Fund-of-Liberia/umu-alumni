import type { SessionPayload } from "@/types/auth";

export const SESSION_COOKIE_NAME = "umu_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const REMEMBER_ME_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function sessionMaxAge(rememberMe: boolean): number {
  return rememberMe ? REMEMBER_ME_TTL_SECONDS : SESSION_TTL_SECONDS;
}

// Web Crypto (globalThis.crypto.subtle), not node:crypto — this module runs
// in Route Handlers (Node runtime) and in middleware (Edge runtime alike),
// and SubtleCrypto is the one HMAC API available in both.
function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set.");
  }
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const buffer = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of buffer) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Session tokens are `base64url(payload).base64url(hmac(payload))` — a
 * hand-rolled signed cookie, not a JWT library, since this is the only auth
 * concern the app has (one role, one credential pair from env vars). The
 * HTTP-only cookie itself is set/cleared by route handlers; this module only
 * produces and verifies the token value.
 */
export async function createSessionToken(username: string, displayName: string, rememberMe: boolean): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    username,
    displayName,
    iat: now,
    exp: now + sessionMaxAge(rememberMe),
  };
  const encodedPayload = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encodedPayload));
  return `${encodedPayload}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  try {
    const key = await getKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature) as BufferSource,
      new TextEncoder().encode(encodedPayload) as BufferSource
    );
    if (!isValid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
