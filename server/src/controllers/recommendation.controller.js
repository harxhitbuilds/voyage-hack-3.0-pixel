import asyncHandler from "../utils/async-handle.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/error.js";

import {
  fallbackRecommendations,
  fallbackTrendingPlaces,
} from "../fallback-response/index.js";

const fetchDestinationImage = async (searchQuery) => {
  try {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.warn("No Unsplash API key found. Using placeholder image.");
      return "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1171&q=80";
    }

    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: searchQuery,
        orientation: "landscape",
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }

    return "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1171&q=80";
  } catch (error) {
    console.error(`Failed to fetch image for ${searchQuery}:`, error.message);
    return "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1171&q=80";
  }
};

// using fallback data for now to save credits and time on API calls, but this can be easily switched to real API calls in the future by replacing the fallbackRecommendations function with actual logic to fetch personalized recommendations based on user profile and preferences. The structure of the response is designed to be consistent whether it's coming from fallback data or real API calls, making it easy to integrate real recommendation logic later on without changing the frontend.
export const getFallbackRecommendations = asyncHandler(async (req, res) => {
  try {
    const fallbacks = fallbackRecommendations();


    const enhancedRecommendations = fallbacks.map((rec, index) => ({
      id: `fallback_${Date.now()}_${index}`,
      ...rec,
      generatedAt: new Date().toISOString(),
      userId: req.user._id,
      type: "fallback",
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          recommendations: enhancedRecommendations,
          generationInfo: {
            type: "fallback",
            totalRecommendations: enhancedRecommendations.length,
            generatedAt: new Date().toISOString(),
            note: "These are popular destinations. Complete your profile for personalized recommendations.",
          },
        },
        "Popular travel recommendations retrieved successfully",
      ),
    );
  } catch (error) {
    console.error("❌ Fallback recommendations error:", error);
    throw new ApiError(500, "Failed to generate fallback recommendations", [
      error.message,
    ]);
  }
});

export const getPersonalizedRecommendations = asyncHandler(async (req, res) => {
  const fallbacks = fallbackRecommendations().map((rec, i) => ({
    id: `fallback_${Date.now()}_${i}`,
    ...rec,
    type: "popular",
    generatedAt: new Date().toISOString(),
  }));
  return res.status(200).json(
    new ApiResponse(200, { recommendations: fallbacks }, "Popular travel recommendations"),
  );
});

export const getTrendingRecommendations = asyncHandler(async (req, res) => {
  const trending = fallbackTrendingPlaces();
  return res.status(200).json(
    new ApiResponse(200, { recommendations: trending }, "Trending destinations"),
  );
});
