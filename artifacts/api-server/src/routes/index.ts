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

export default router;
