import express from "express";
//import userAuth from "../middleware/authMiddleware";
import { updateUserController } from "../controller/userController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

//Update users
router.put("/update-user", userAuth, updateUserController);
export default router;
