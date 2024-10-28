import crypto from "crypto";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
const OTP_EXPIRATION_TIME = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;

// Hash the OTP for storage
const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const generateOTP = async (req, res) => {
  const {userId} = req.user;

  const otp = crypto.randomInt(1000, 9999).toString();
  const hashedOtp = hashOTP(otp);

  const session = await Session.findOneAndUpdate(
    {userId},
    {otp: hashedOtp, attempts: 0, generatedAt: Date.now()},
    {new: true, upsert: true}
  );

  console.log(`Generated OTP for user ${userId}: ${otp}`);
  res.status(200).json({message: "OTP generated", success: true, otp: otp});
};

export const verifyOTP = async (req, res) => {
  const {otp} = req.body;
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({message: "Unauthorized", success: false});
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const {userId} = decoded;

  const session = await Session.findOne({userId});
  if (!session || !session.otp) {
    return res.status(400).json({error: "No OTP found"});
  }

  if (Date.now() - session.generatedAt > OTP_EXPIRATION_TIME) {
    await Session.findOneAndUpdate({userId}, {otp: null, attempts: 0});
    return res.status(403).json({error: "OTP has expired"});
  }

  const hashedInputOtp = hashOTP(otp);

  if (session.otp === hashedInputOtp) {
    await Session.findOneAndUpdate({userId}, {otp: null, attempts: 0});
    return res.status(200).json({message: "OTP verified", success: true});
  }

  session.attempts += 1;

  if (session.attempts >= MAX_ATTEMPTS) {
    await Session.findOneAndUpdate({userId}, {otp: null, attempts: 0});
    return res.status(403).json({error: "Too many attempts", success: false});
  }

  await session.save();
  res.status(401).json({error: "Incorrect OTP", success: false});
};
