import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import {
  buildSessionCookie,
  parseSessionCookie,
  COOKIE_NAME,
} from "../middlewares/requireOwner.js";
import { config, getRedirectUri } from "../config.js";
import {
  buildBootstrapState,
  consumeBootstrapToken,
  isBootstrapActive,
  peekActiveBootstrapToken,
  recordBootstrapClaim,
  verifyBootstrapState,
} from "../bootstrap.js";
import { logger } from "../lib/logger.js";

const BOOTSTRAP_STATE_COOKIE = "bootstrap_state";

function getQueryParam(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
}

export const authRouter = Router();

const SCOPES = ["openid", "email", "profile"];

/** Cookie options — httpOnly, SameSite=Strict, Secure in production */
function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: !config.isDev,
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}

// ============================================================
// GET /api/auth/google
//
// Normal mode: redirects to Google's OAuth consent page.
// Bootstrap mode: requires ?token=<bootstrap> matching the active
// bootstrap token. The signed state nonce is stored in a short-lived
// cookie AND passed as the OAuth `state` parameter. The bootstrap
// token is NOT consumed at this step — that happens only after the
// callback verifies Google and binds the signed state.
// ============================================================
authRouter.get("/google", (req, res) => {
  let oauthState: string | undefined;

  if (isBootstrapActive()) {
    const supplied = getQueryParam(req.query.token);
    const active = peekActiveBootstrapToken();
    if (!active || !supplied || supplied !== active) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    oauthState = buildBootstrapState(active);
    // Bind this state to the browser session so the callback can verify
    // it without depending on URL parameters alone.
    res.cookie(BOOTSTRAP_STATE_COOKIE, oauthState, {
      ...cookieOptions(5 * 60 * 1000), // 5 minutes — long enough for OAuth round-trip
    });
  }

  const client = new OAuth2Client(
    config.googleClientId,
    config.googleClientSecret,
    getRedirectUri(),
  );

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "select_account",
    ...(oauthState ? { state: oauthState } : {}),
  });

  res.redirect(authUrl);
});

// ============================================================
// GET /api/auth/google/callback
//
// - Normal mode: exchanges code, verifies ID token, checks sub against
//   OWNER_GOOGLE_SUB, sets session cookie, redirects home.
// - Bootstrap mode: same flow but the bootstrap token CONSUMPTION is
//   gated on (a) successful ID-token verification AND (b) the state
//   parameter (and state cookie) matching the active token claim. If
//   the OAuth handshake is interrupted for any reason, the token is
//   preserved and the owner can retry by visiting the bootstrap URL.
// ============================================================
authRouter.get("/google/callback", async (req, res): Promise<void> => {
  const code = req.query.code;
  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Missing authorization code" });
    return;
  }

  const client = new OAuth2Client(
    config.googleClientId,
    config.googleClientSecret,
    getRedirectUri(),
  );

  try {
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken) {
      res.status(400).json({ error: "No ID token returned from Google" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub) {
      res.status(400).json({ error: "Could not extract sub from ID token" });
      return;
    }

    const sub = payload.sub;
    const bootstrapMode = !config.ownerGoogleSub;

    if (bootstrapMode) {
      // Must prove the caller had possession of the bootstrap token at
      // /auth/google time. Two ways to deliver `state`: URL query (set by
      // Google redirect) OR cookie (set in /auth/google). Either is enough.
      const queryState = getQueryParam(req.query.state);
      const cookieState: string | undefined =
        req.cookies?.[BOOTSTRAP_STATE_COOKIE];
      const supplied = queryState ?? cookieState;
      const stateOk = verifyBootstrapState(supplied);

      // Clear the state cookie whether or not verification succeeded.
      res.clearCookie(BOOTSTRAP_STATE_COOKIE, cookieOptions());

      if (!stateOk) {
        // Either bootstrap window is closed/expired, or this callback
        // did not originate from a /auth/google call with the token.
        res
          .status(403)
          .json({ error: "Forbidden: bootstrap state missing or invalid" });
        return;
      }

      // Burn the token only AFTER verified Google identity AND verified
      // bootstrap state. Failed/abandoned OAuth attempts leave the
      // bootstrap token alive and recoverable by retrying the bootstrap URL.
      consumeBootstrapToken();

      recordBootstrapClaim(sub);

      const cookieValue = buildSessionCookie(sub);
      res.cookie(
        COOKIE_NAME,
        cookieValue,
        cookieOptions(30 * 24 * 60 * 60 * 1000),
      );

      const redirectTarget = config.productionOrigin || "/";
      res.redirect(redirectTarget);
      return;
    }

    // Production path: sub must match OWNER_GOOGLE_SUB exactly. If a
    // leftover bootstrap_state cookie is present from a previous startup,
    // clear it.
    res.clearCookie(BOOTSTRAP_STATE_COOKIE, cookieOptions());

    if (sub !== config.ownerGoogleSub) {
      res.status(403).json({ error: "Forbidden: not the site owner" });
      return;
    }

    logger.info({ sub }, "[auth] owner authenticated via Google OAuth");

    const cookieValue = buildSessionCookie(sub);
    res.cookie(
      COOKIE_NAME,
      cookieValue,
      cookieOptions(30 * 24 * 60 * 60 * 1000),
    );

    const redirectTarget = config.productionOrigin || "/";
    res.redirect(redirectTarget);
  } catch (err) {
    req.log?.error({ err }, "[auth] Google OAuth callback error");
    res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * GET /api/auth/me
 * Returns { isOwner: true } when the valid session cookie is present,
 * { isOwner: false } otherwise. Never returns 401 — safe for public use.
 */
authRouter.get("/me", (req, res) => {
  const cookieValue: string | undefined = req.cookies?.[COOKIE_NAME];
  if (!cookieValue) {
    res.json({ isOwner: false });
    return;
  }

  const session = parseSessionCookie(cookieValue);
  if (!session) {
    res.json({ isOwner: false });
    return;
  }

  const isOwner =
    !!config.ownerGoogleSub && session.sub === config.ownerGoogleSub;
  res.json({ isOwner });
});

/**
 * POST /api/auth/logout
 * Clears the session cookie and returns 200.
 */
authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.sendStatus(200);
});
