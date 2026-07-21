import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import postsRouter from "./posts";
import notesRouter from "./notes";
import interviewRouter from "./interview";
import homepageRouter from "./homepage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(postsRouter);
router.use(notesRouter);
router.use(interviewRouter);
router.use(homepageRouter);

export default router;
