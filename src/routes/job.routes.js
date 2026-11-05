import express from "express";
import { getAllJobs, getJobById, getJobStats } from "../controllers/job.controller.js";

const router = express.Router();

// Note: "/stats" must be registered before "/:id" so it is not captured
// as an id parameter.
router.get("/", getAllJobs);
router.get("/stats", getJobStats);
router.get("/:id", getJobById);

export default router;
