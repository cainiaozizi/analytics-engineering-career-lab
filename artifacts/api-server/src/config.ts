/**
 * Server configuration — reads required secrets from process.env.
 *
 * Required secrets (set as Replit Secrets):
 *   GOOGLE_CLIENT_ID       — OAuth 2.0 client ID from Google Cloud Console
 *   GOOGLE_CLIENT_SECRET   — OAuth 2.0 client secret from Google Cloud Console
 *   OWNER_GOOGLE_SUB       — Owner's permanent Google subject ID
 *   SESSION_SECRET         — Random 32-byte hex string for HMAC-signing session cookies
 *   PRODUCTION_ORIGIN      — Full production URL (e.g. https://analytics-career-lab.replit.app)
 */

const isDev = process.env.NODE_ENV !== "production";

function requireSecret(key: string): string {
  // All secrets except OWNER_GOOGLE_SUB are required for the server to start.
  // OWNER_GOOGLE_SUB is OPTIONAL on purpose: on first deploy the owner hasn't
  // signed in yet, so the value is unknown. The bootstrap module handles that
  // case and writes the discovered sub back via a single-use token.
  if (key === "OWNER_GOOGLE_SUB") return process.env.OWNER_GOOGLE_SUB ?? "";

  const value = process.env[key];
  if (!value && !isDev) {
    throw new Error(
      `[config] Required secret "${key}" is missing. Set it as a Replit Secret before deploying.`,
    );
  }
  return value ?? "";
}

function optionalSecret(key: string): string {
  return process.env[key] ?? "";
}

export const config = {
  isDev,
  googleClientId: requireSecret("GOOGLE_CLIENT_ID"),
  googleClientSecret: requireSecret("GOOGLE_CLIENT_SECRET"),
  ownerGoogleSub: requireSecret("OWNER_GOOGLE_SUB"),
  sessionSecret: requireSecret("SESSION_SECRET"),
  productionOrigin: requireSecret("PRODUCTION_ORIGIN"),
} as const;

/** The OAuth redirect URI — must be registered in Google Cloud Console */
export function getRedirectUri(): string {
  return `${config.productionOrigin}/api/auth/google/callback`;
}

/** Allowed CORS origins */
export function getAllowedOrigins(): string[] {
  const origins: string[] = [];
  if (config.productionOrigin) {
    origins.push(config.productionOrigin);
  }
  // Always allow localhost variants in any environment (devs hitting the API directly)
  origins.push("http://localhost:3000");
  origins.push("http://localhost:5173");
  origins.push("http://localhost:4000");
  // Allow Replit dev domain if set
  const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;
  if (replitDevDomain) {
    origins.push(`https://${replitDevDomain}`);
  }
  const replitDomains = process.env.REPLIT_DOMAINS;
  if (replitDomains) {
    replitDomains.split(",").forEach((d) => {
      const trimmed = d.trim();
      if (trimmed) origins.push(`https://${trimmed}`);
    });
  }
  return origins;
}
