import asyncHandler from "../utils/async-handle.js";
import User from "../models/user.model.js";
import ApiError from "../utils/error.js";
import { auth } from "../config/firebase.config.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Authentication token is missing", []);
  }

  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(token);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired authentication token", [
      error.message,
    ]);
  }

  // Find user by email since that's what we save from Firebase in signUp
  const user = await User.findOne({ email: decodedToken.email });

  if (!user) {
    throw new ApiError(401, "User not found in database. Please sign up first.", []);
  }

  req.user = user;
  next();
});