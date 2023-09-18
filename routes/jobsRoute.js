import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createJobController,
  deleteJobController,
  getJobController,
  jobStatsController,
  //getSingleJobController,
  updateJobController,
} from "../controller/jobsController.js";

const router = express.Router();
//create jobs
router.post("/create-job", userAuth, createJobController);
// get jobs
router.get("/get-job", userAuth, getJobController);
// update job
router.patch("/update-job/:id", userAuth, updateJobController);

//delete job
router.delete("/delete-job/:id", userAuth, deleteJobController);

// // job stats adn filter get
router.get("/job-stats", userAuth, jobStatsController);
export default router;
