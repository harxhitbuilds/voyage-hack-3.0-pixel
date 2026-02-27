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
  // Sanitize input data
  const sanitizedData = sanitizeOnboardingData(req.body);

  // Validate input data (excluding required field validation for updates)
  const errors = [];

  // Username format validation if provided
  if (
    sanitizedData.username &&
    !/^[a-zA-Z0-9_]+$/.test(sanitizedData.username)
  ) {
    errors.push("Username can only contain letters, numbers, and underscores");
  }

  // Array fields validation
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

  // Check if username is already taken by another user (if username is being updated)
  if (sanitizedData.username) {
    const existingUser = await User.findOne({
      username: sanitizedData.username,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw new ApiError(400, "Username is already taken", []);
    }
  }

  // Build update object with only provided fields
  const updateData = {};

  // Basic fields
  if (sanitizedData.firstName) updateData.firstName = sanitizedData.firstName;
  if (sanitizedData.lastName) updateData.lastName = sanitizedData.lastName;
  if (sanitizedData.username) updateData.username = sanitizedData.username;
  if (sanitizedData.hometown) updateData.hometown = sanitizedData.hometown;

  // Travel preferences - only update if any preference is provided
  const travelPrefs = {};
  if (sanitizedData.travelStyle)
    travelPrefs.travelStyle = sanitizedData.travelStyle;
  if (sanitizedData.budgetRange)
    travelPrefs.budgetRange = sanitizedData.budgetRange;
  if (sanitizedData.groupSize)
    travelPrefs.groupSize = sanitizedData.groupSize;
  if (sanitizedData.tripDuration)
    travelPrefs.tripDuration = sanitizedData.tripDuration;
  if (sanitizedData.travelFrequency)
    travelPrefs.travelFrequency = sanitizedData.travelFrequency;
  if (sanitizedData.accommodationType)
    travelPrefs.accommodationType = sanitizedData.accommodationType;
  if (sanitizedData.transportationPreference)
    travelPrefs.transportationPreference =
      sanitizedData.transportationPreference;

  if (Object.keys(travelPrefs).length > 0) {
    updateData.travelPreferences = travelPrefs;
  }

  // Update user in database
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
        "Profile updated successfully"
      )
    );
});
