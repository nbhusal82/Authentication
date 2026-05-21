import express from "express";
import { forgotPassword } from "../Controller/forgot_controller.js";

const router = express.Router();
router.post("/forgot-password", forgotPassword);

export default router;
