import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

const COOKIE_NAME = "owner_session";

interface SessionPayload {
  sub: string;
  iat: number;
}

/**
 * Constant-time string equality. Returns false on length mismatch without
 * invoking `crypto.timingSafeEqual` (which throws on unequal-length inputs).
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Sign a payload string with HMAC-SHA256 using SESSION_SECRET.
 */
export function signPayload(payload: string): string {
  return crypto
    .createHmac("sha256", config.sessionSecret)
    .update(payload)
    .digest("hex");
}

/**
 * Verify an HMAC signature against an expected value. Returns false on
 * anything other than an exact match (including malformed input).
 */
export function verifySignature(expected: string, supplied: string): boolean {
  if (!expected || !supplied) return false;
  return safeEqual(expected, supplied);
}

/**
 * Build a signed session cookie value for the given Google sub.
 */
export function buildSessionCookie(sub: string): string {
  const payload: SessionPayload = { sub, iat: Math.floor(Date.now() / 1000) };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = signPayload(encoded);
  return `${encoded}.${sig}`;
}

/**
 * Parse and verify a session cookie value.
 * Returns the SessionPayload if valid, or null if invalid/tampered.
 *
 * This is the gatekeeper for the auth cookie. Any malformed cookie —
 * wrong shape, wrong length, missing fields, mismatched signature —
 * returns null and is treated as 401 by the middleware.
 */
export function parseSessionCookie(
  cookieValue: string | undefined,
): SessionPayload | null {
  if (!cookieValue) return null;

  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === cookieValue.length - 1) return null;

  const encoded = cookieValue.slice(0, dotIndex);
  const sig = cookieValue.slice(dotIndex + 1);

  const expectedSig = signPayload(encoded);
  if (!verifySignature(expectedSig, sig)) return null;

  let raw: string;
  try {
    raw = Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    typeof (parsed as SessionPayload).sub !== "string" ||
    typeof (parsed as SessionPayload).iat !== "number"
  ) {
    return null;
  }

  return parsed as SessionPayload;
}

/**
 * Middleware: verifies the signed session cookie and checks the Google sub
 * against OWNER_GOOGLE_SUB.
 *
 * Returns 401 if no cookie or invalid/tampered cookie.
 * Returns 403 if the cookie is valid but the sub does not match the owner.
 */
export function requireOwner(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const cookieValue: string | undefined = req.cookies?.[COOKIE_NAME];

  const session = parseSessionCookie(cookieValue);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!config.ownerGoogleSub || session.sub !== config.ownerGoogleSub) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  next();
}

export { COOKIE_NAME };
