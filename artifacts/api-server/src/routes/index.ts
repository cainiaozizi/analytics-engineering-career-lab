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
import { getBootstrapStatus, isBootstrapActive } from "../bootstrap.js";

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
 * Replit behavior on some publishes). Reachable only while the bootstrap
 * window is actually open — once OWNER_GOOGLE_SUB is set in env, OR the
 * bootstrap window has been claimed/expired, the route returns 404. On
 * a public deployment this guarantees the endpoint never leaks the
 * single-use bootstrap URL outside the brief window when the operator
 * genuinely needs it. The pino startup banner and the workspace
 * `.bootstrap-url` file mirror remain the operator-only recovery
 * channels during that window.
 */
router.get("/_debug/bootstrap-status", (_req, res) => {
  if (!isBootstrapActive()) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(getBootstrapStatus());
});

export default router;
