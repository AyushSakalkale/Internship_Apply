// routes/otpRoutes.js
import express from "express";
import {generateOTP, verifyOTP} from "../controllers/otpController.js";
import {verifyToken} from "../utils/jwtUtil.js";

const router = express.Router();

router.post("/generate", verifyToken, generateOTP);
router.post("/verify", verifyToken, verifyOTP);

export default router;
