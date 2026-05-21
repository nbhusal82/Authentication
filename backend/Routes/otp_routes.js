import express from "express";
import { sendOtp, verifyOtpAndReset } from "../Controller/otp_controller.js";

const router = express.Router();
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndReset);

export default router;
