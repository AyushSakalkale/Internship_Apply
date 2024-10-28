// routes/authRoutes.js
import express from "express";
import {login, logout, getUserSession} from "../controllers/authControllers.js";
import {verifyToken} from "../utils/jwtUtil.js";

const router = express.Router();

router.post("/login", login);
router.delete("/logout", verifyToken, logout);
router.get("/session", verifyToken, getUserSession);

export default router;
