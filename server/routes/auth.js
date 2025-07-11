import express from "express";
import { signup, login, sendOtp, verifyOtp } from "../controller/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;