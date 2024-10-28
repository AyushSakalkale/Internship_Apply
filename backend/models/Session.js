import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {type: String, required: true, unique: true},
  otp: {type: String, default: null},
  attempts: {type: Number, default: 0},
  generatedAt: {type: Date, default: null},
});

export default mongoose.model("Session", sessionSchema);
