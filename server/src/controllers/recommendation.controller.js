import axios from "axios";
import asyncHandler from "../utils/async-handle.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/error.js";
import User from "../models/user.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

import {
  fallbackRecommendations,
  fallbackTrendingPlaces,
} from "../fallback-response/index.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found", [
      "The authenticated user does not exist",
    ]);
  }

  const prefs = user.travelPreferences || {};
  const hasPreferences =
    (prefs.travelStyle?.length || 0) +
    (prefs.budgetRange?.length || 0) +
    (prefs.groupSize?.length || 0) > 0;

  // If no preferences yet, return fallback with note
  if (!hasPreferences) {
    const fallbacks = fallbackRecommendations().map((rec, i) => ({
      id: `fallback_${i}`,
      ...rec,
      type: "popular",
      generatedAt: new Date().toISOString(),
    }));
    return res.status(200).json(
      new ApiResponse(200, { recommendations: fallbacks }, "Popular destinations (complete your profile for personalized picks)"),
    );
  }

  try {
    const prompt = `
You are a travel recommendation AI. Based on this traveler's preferences, suggest 6 Indian destinations.

Traveler Profile:
- Travel Style: ${prefs.travelStyle?.join(", ") || "not specified"}
- Budget Range: ${prefs.budgetRange?.join(", ") || "not specified"}
- Group Size: ${prefs.groupSize?.join(", ") || "solo"}
- Trip Duration: ${prefs.tripDuration?.join(", ") || "flexible"}
- Travel Frequency: ${prefs.travelFrequency?.join(", ") || "occasional"}
- Accommodation: ${prefs.accommodationType?.join(", ") || "any"}
- Transport: ${prefs.transportationPreference?.join(", ") || "any"}
- Hometown: ${user.hometown || "India"}

Return ONLY a valid JSON array of 6 objects with this exact structure:
[{
  "placeName": "Destination Name",
  "description": "2 sentence description",
  "picture": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
  "fitReasoning": ["reason 1 matching their style", "reason 2", "reason 3"],
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4"],
  "bestTimeToVisit": "Month range",
  "estimatedBudget": "₹X,XXX-XX,XXX per day",
  "travelDuration": "X-X days",
  "matchScore": 92
}]

Use real Unsplash landscape photo URLs for Indian destinations. Return ONLY the JSON array.`;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const recommendations = JSON.parse(text);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          recommendations: recommendations.map((r, i) => ({
            id: `ai_${Date.now()}_${i}`,
            ...r,
            type: "personalized",
            generatedAt: new Date().toISOString(),
          })),
        },
        "Personalized recommendations generated successfully",
      ),
    );
  } catch (err) {
    console.error("❌ Gemini personalization error:", err.message);
    // Graceful fallback
    const fallbacks = fallbackRecommendations().map((rec, i) => ({
      id: `fallback_${i}`,
      ...rec,
      type: "popular",
      generatedAt: new Date().toISOString(),
    }));
    return res.status(200).json(
      new ApiResponse(200, { recommendations: fallbacks }, "Popular destinations"),
    );
  }
});

export const getTrendingRecommendations = asyncHandler(async (req, res) => {
  const trending = fallbackTrendingPlaces();
  return res.status(200).json(
    new ApiResponse(200, { recommendations: trending }, "Trending destinations"),
  );
});
