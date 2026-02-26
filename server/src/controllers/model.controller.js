import asyncHandler from "../utils/async-handle.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/error.js";
import ThreeDModel from "../models/3dmodel.model.js";
import User from "../models/user.model.js";

export const getModels = asyncHandler(async (req, res, next) => {
  const models = await ThreeDModel.find();
  if (!models || models.length === 0) {
    return next(new ApiError(404, "No 3D models found"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { models }, "All 3D models retrieved successfully")
    );
});

export const trackVisit = asyncHandler(async (req, res, next) => {
  const { monumentId } = req.body;
  if (!monumentId) {
    return next(new ApiError(400, "monumentId is required"));
  }
  const userId = req.user?._id || req.user?.id;
  if (!userId) {
    return next(new ApiError(401, "Unauthorized"));
  }

  // Add to visitedMonuments only if not already present
  await User.findByIdAndUpdate(userId, {
    $addToSet: { visitedMonuments: monumentId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Visit tracked successfully"));
});
