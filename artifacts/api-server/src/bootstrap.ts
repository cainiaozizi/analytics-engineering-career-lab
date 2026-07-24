import crypto from "node:crypto";
import { config } from "./config.js";
import { signPayload, verifySignature, safeEqual } from "./middlewares/requireOwner.js";
import { logger } from "./lib/logger.js";

/**
 * Bootstrap mode for first-time owner login.
 *
 * On startup, if OWNER_GOOGLE_SUB is not configured, the server enters a
 * single-use bootstrap window:
 *   1. A 32-byte cryptographically-random bootstrap token is generated.
 *   2. A signed state nonce (HMAC of the token claim) is also generated.
 *   3. Both are printed ONCE to server startup logs (never exposed in any
 *      API response, cookie, or frontend).
 *   4. /api/auth/google?token=<bootstrap> succeeds only when the supplied
 *      token matches the active bootstrap token AND the server has
 *      recorded the signed state nonce in a short-lived cookie. The
 *      token is NOT burned at this step — failed OAuth attempts do not
 *      exhaust the bootstrap budget.
 *   5. /api/auth/google/callback burns the token ONLY after Google
 *      ID-token verification succeeds and the signed state cookie binds
 *      the callback to the same browser session that initiated login.
 *      Token burns immediately after first use.
 *   6. Token also expires after 1 hour, even if unused.
 *
 * No anonymous login succeeds during bootstrap without the token — the
 * /google handler rejects requests missing or mismatching it with 403,
 * AND the /callback handler refuses state cookies that don't have a
 * matching signed nonce (mitigates cross-tab/cross-browser replays).
 * Once OWNER_GOOGLE_SUB is set in the environment, this module's
 * activation paths are all disabled.
 */

interface BootstrapState {
  token: string;
  /** Discovered Google sub from the first successful bootstrap login */
  claimedSub: string | null;
  generatedAt: number;
}

const BOOTSTRAP_TTL_MS = 60 * 60 * 1000; // 1 hour

let state: BootstrapState | null = null;

/**
 * Activate bootstrap mode if OWNER_GOOGLE_SUB is missing.
 * Call once at server startup. Idempotent.
 */
export function initBootstrap(): void {
  if (config.ownerGoogleSub) {
    state = null;
    return;
  }
  if (state) return;

  const token = crypto.randomBytes(32).toString("hex");
  state = {
    token,
    claimedSub: null,
    generatedAt: Date.now(),
  };

  const fullLoginUrl = `${config.productionOrigin}/api/auth/google?token=${token}`;
  // Log to pino so it lands in Replit's production deployment log stream
  // (fetchDeploymentLogs). Kept identical to the previous console.log banner
  // so an operator can copy the URL/token straight from the publish-logs pane.
  logger.info(
    "\n" +
      "=================================================================\n" +
      "[bootstrap] OWNER_GOOGLE_SUB is not configured.\n" +
      "[bootstrap] A single-use bootstrap token has been generated.\n" +
      "[bootstrap] To claim owner, visit this URL ONCE in your browser:\n" +
      `[bootstrap]   ${fullLoginUrl}\n` +
      "[bootstrap] Keep this URL private. Anyone who has it can become\n" +
      "[bootstrap] the owner; on first successful login the token is\n" +
      "[bootstrap] burned and the bootstrap window is closed.\n" +
      "[bootstrap] After you log in, copy the printed sub into the\n" +
      `[bootstrap] OWNER_GOOGLE_SUB secret and restart the server.\n` +
      "[bootstrap] Token expires in 1 hour even if unused.\n" +
      "=================================================================\n",
  );
}

function isExpired(): boolean {
  if (!state) return true;
  return Date.now() - state.generatedAt > BOOTSTRAP_TTL_MS;
}

/** Whether bootstrap mode is currently active AND usable. */
export function isBootstrapActive(): boolean {
  if (config.ownerGoogleSub) return false;
  if (!state) return false;
  if (isExpired()) return false;
  if (state.claimedSub) return false;
  return !!state.token;
}

/**
 * Peek at the active bootstrap token (read-only). Used by /auth/google to
 * mint a signed state nonce that proves to /auth/google/callback that the
 * caller had possession of the bootstrap token at the time of redirect.
 *
 * Returns null if bootstrap is not active.
 */
export function peekActiveBootstrapToken(): string | null {
  if (!isBootstrapActive()) return null;
  return state?.token ?? null;
}

/**
 * Build a signed state nonce binding the bootstrap token claim to the
 * outgoing /auth/google redirect. Verifies on return in /auth/google/callback.
 */
export function buildBootstrapState(activeToken: string): string {
  const claim = `bootstrap:${activeToken}`;
  const sig = signPayload(claim);
  return `${Buffer.from(claim).toString("base64url")}.${sig}`;
}

/**
 * Verify a state nonce returned from /auth/google/callback. Returns true
 * iff the signed claim binds to the currently active bootstrap token.
 */
export function verifyBootstrapState(supplied: string | undefined): boolean {
  if (!supplied) return false;
  if (!isBootstrapActive()) return false;
  const active = state?.token;
  if (!active) return false;

  const dot = supplied.lastIndexOf(".");
  if (dot === -1 || dot === supplied.length - 1) return false;

  const encoded = supplied.slice(0, dot);
  const sig = supplied.slice(dot + 1);
  const claim = `bootstrap:${active}`;
  const expectedSig = signPayload(claim);
  const encodedExpected = Buffer.from(claim).toString("base64url");

  if (!safeEqual(encoded, encodedExpected)) return false;
  if (!verifySignature(expectedSig, sig)) return false;
  return true;
}

/**
 * Consume (burn) the bootstrap token. Idempotent. Called from the callback
 * after ID-token verification succeeds.
 *
 * After burning, isBootstrapActive() returns false for the remainder of
 * this process; future logins require OWNER_GOOGLE_SUB to be configured.
 */
export function consumeBootstrapToken(): boolean {
  if (!isBootstrapActive()) return false;
  if (!state) return false;
  state.token = "";
  return true;
}

/**
 * Record the Google sub discovered during a successful first login.
 * Held in memory only. Owner must copy this value into OWNER_GOOGLE_SUB
 * and restart the server for cookie sessions to be issued long-term
 * via the env-var path.
 */
export function recordBootstrapClaim(sub: string): void {
  if (!state) return;
  state.claimedSub = sub;
  logger.info(
    "[bootstrap] First owner login recorded.\n" +
      "[bootstrap] Sub: " +
      sub +
      "\n" +
      "[bootstrap] Copy this sub into the OWNER_GOOGLE_SUB secret and restart the server.",
  );
}

/** Returned in /api/auth/me so the UI can show a banner during bootstrap. */
export function getBootstrapStatus(): {
  active: boolean;
  claimed: boolean;
  claimedSub: string | null;
} {
  return {
    active: isBootstrapActive(),
    claimed: !!state?.claimedSub,
    claimedSub: state?.claimedSub ?? null,
  };
}
