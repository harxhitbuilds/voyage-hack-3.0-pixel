import asyncHandler from "../utils/async-handle.js";
import { auth } from "../config/firebase.config.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/error.js";
import {
  validateOnboardingData,
  sanitizeOnboardingData,
} from "../utils/validation.js";



export const signUp = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new ApiError(400, "ID token is required", []);
  }

  const decodedToken = await auth.verifyIdToken(idToken);
  const { email, name, picture } = decodedToken;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, name, profile: picture });
    await user.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Signup successful"));
});

export const logout = asyncHandler(async (req, res) => {

  return res.status(200).json({
    success: true,
    data: {},
    message: "Logout successful",
  });
});

export const onBoardUser = asyncHandler(async (req, res) => {
  console.log(
    "Onboarding request received:",
    JSON.stringify(req.body, null, 2)
  );

  const sanitizedData = sanitizeOnboardingData(req.body);

  validateOnboardingData(sanitizedData);

  const {
    firstName,
    lastName,
    username,
    hometown,
    travelStyle,
    budgetRange,
    groupSize,
    tripDuration,
    travelFrequency,
    accommodationType,
    transportationPreference,
  } = sanitizedData;

  const existingUser = await User.findOne({
    username,
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    throw new ApiError(400, "Username is already taken", []);
  }

  const updateData = {
    firstName,
    lastName,
    username,
    hometown,
    name: `${firstName} ${lastName}`.trim(),
    travelPreferences: {
      travelStyle,
      budgetRange,
      groupSize,
      tripDuration,
      travelFrequency,
      accommodationType,
      transportationPreference,
    },
    onBoarded: true,
  };

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found", []);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Onboarding completed successfully"
      )
    );
});

export const checkAuth = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    success: true,
    data: { user },
    message: "User is authenticated",
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v").lean();

  if (!user) {
    throw new ApiError(404, "User not found", []);
  }

  // Attach derived fields for gamification
  user.tripCount = Array.isArray(user.trips) ? user.trips.length : 0;
  user.visitedMonumentCount = Array.isArray(user.visitedMonuments)
    ? user.visitedMonuments.length
    : 0;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user }, "User profile retrieved successfully")
    );
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const sanitizedData = sanitizeOnboardingData(req.body);

  const errors = [];

  if (
    sanitizedData.username &&
    !/^[a-zA-Z0-9_]+$/.test(sanitizedData.username)
  ) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  if (sanitizedData.username && sanitizedData.username.length < 3) {
    errors.push("Username must be at least 3 characters");
  }

  const arrayFields = [
    "travelStyle",
    "budgetRange",
    "groupSize",
    "tripDuration",
    "travelFrequency",
    "accommodationType",
    "transportationPreference",
  ];

  arrayFields.forEach((field) => {
    if (sanitizedData[field] && !Array.isArray(sanitizedData[field])) {
      errors.push(`${field} must be an array`);
    }
  });

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  if (sanitizedData.username) {
    const existingUser = await User.findOne({
      username: sanitizedData.username,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw new ApiError(400, "Username is already taken", []);
    }
  }

  // Build a flat $set object — only touches fields that were actually sent
  const updateData = {};

  if (sanitizedData.firstName) updateData.firstName = sanitizedData.firstName;
  if (sanitizedData.lastName) updateData.lastName = sanitizedData.lastName;
  if (sanitizedData.username) updateData.username = sanitizedData.username;
  if (sanitizedData.hometown) updateData.hometown = sanitizedData.hometown;
  if (req.body.profile) updateData.profile = req.body.profile;

  // Keep the composite `name` field in sync
  if (sanitizedData.firstName || sanitizedData.lastName) {
    const currentUser = await User.findById(req.user._id).lean();
    const first = sanitizedData.firstName || currentUser?.firstName || "";
    const last = sanitizedData.lastName || currentUser?.lastName || "";
    updateData.name = `${first} ${last}`.trim();
  }

  // Use dot-notation so individual sub-fields are updated without wiping siblings
  arrayFields.forEach((field) => {
    if (Array.isArray(sanitizedData[field]) && sanitizedData[field].length > 0) {
      updateData[`travelPreferences.${field}`] = sanitizedData[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields to update", []);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found", []);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Profile updated successfully"
      )
    );
});
