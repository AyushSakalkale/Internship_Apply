// utils/jwtUtil.js
import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});
};

export const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({error: "Token is required"});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the decoded user info in the request object for use in subsequent middleware
    next(); // Call the next middleware or route handler
  } catch (error) {
    return res.status(401).json({error: "Unauthorized"});
  }
};
