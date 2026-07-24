import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import projectsRouter from "./projects.js";
import postsRouter from "./posts.js";
import notesRouter from "./notes.js";
import interviewRouter from "./interview.js";
import homepageRouter from "./homepage.js";
import { aiRouter } from "./ai.js";
import storageRouter from "./storage.js";
import { authRouter } from "./auth.js";
import { getBootstrapStatus } from "../bootstrap.js";

const router: IRouter = Router();

router.use("/auth", authRouter);
router.use(healthRouter);
router.use(projectsRouter);
router.use(postsRouter);
router.use(notesRouter);
router.use(interviewRouter);
router.use(homepageRouter);
router.use("/ai", aiRouter);
router.use(storageRouter);

/**
 * GET /api/_debug/bootstrap-status
 *
 * Operator-only recovery channel for the bootstrap URL when the pino
 * deployment log mirror clips multi-line startup records (a known
 * Replit behavior on some publishes). Mirrors the in-process
 * getBootstrapStatus() — including fullLoginUrl while a bootstrap
 * window is open, and the discovered sub after a successful claim.
 *
 * The endpoint is unauthenticated by design: the URL is single-use
 * and burned on first successful Google authentication, and the sub
 * is whatever Google OAuth minted during the same window.
 * OWNER_GOOGLE_SUB remains the ground-truth for any subsequent sign-in.
 *
 * During normal (post-bootstrap) operation this endpoint returns
 * `{ active: false, fullLoginUrl: null, … }`.
 */
router.get("/_debug/bootstrap-status", (_req, res) => {
  res.json(getBootstrapStatus());
});

export default router;
