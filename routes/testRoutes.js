import express from "express";
import { testPostController } from "../controller/testcontroller.js";
import userAuth from "../middleware/authMiddleware.js";
// router object
const router = express.Router();

// routes
router.post("/test-post", userAuth, testPostController);

// export
export default router;
