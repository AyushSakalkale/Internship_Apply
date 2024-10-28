// controllers/authController.js
import {generateToken} from "../utils/jwtUtil.js";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  const {userId} = req.body;
  if (!userId) {
    return res.status(400).json({error: "User ID is required"});
  }

  const token = generateToken({userId});

  await Session.findOneAndUpdate(
    {userId},
    {userId, token, otp: null, attempts: 0},
    {upsert: true, new: true}
  );

  res.cookie("token", token, {httpOnly: true});
  res.status(200).json({message: "Login successful", success: true});
};
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({message: "Unauthorized", success: false});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {userId} = decoded;
    console.log(userId);

    await Session.findOneAndDelete({userId});

    res.clearCookie("token");
    console.log("cookie cleared");
    res.status(200).json({message: "Logout successful", success: true});
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({message: "Server error", success: false});
  }
};

export const getUserSession = async (req, res) => {
  const {userId} = req.user;

  const session = await Session.findOne({userId});
  if (!session) {
    return res.status(404).json({error: "Session not found", success: true});
  }

  res.status(200).json({session});
};
