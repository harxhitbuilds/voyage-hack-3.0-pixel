import asyncHandler from "../utils/async-handle.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/error.js";
import { VapiClient } from "@vapi-ai/server-sdk";
import Trip from "../models/trip.model.js";
import User from "../models/user.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const vapi = new VapiClient({
  token: process.env.VAPI_PRIVATE_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Process transcript with Gemini to extract trip details
const processTranscriptWithGemini = async (transcript) => {
  try {
    if (!transcript || transcript.trim().length === 0) {
      throw new ApiError(400, "Transcript is empty or invalid");
    }

    const prompt = `
Analyze this travel conversation transcript and extract key trip planning details in JSON format:

Transcript: "${transcript}"

Please extract and return ONLY a valid JSON object with these fields:
{
  "destination": "extracted destination or null",
  "startDate": "extracted start date in YYYY-MM-DD format or null", 
  "endDate": "extracted end date in YYYY-MM-DD format or null",
  "budget": "extracted budget range or null",
  "travelers": "number of travelers or null",
  "preferences": ["array of travel preferences mentioned"],
  "activities": ["array of activities mentioned"],
  "keyPoints": ["3-5 key points from conversation"],
  "tripSummary": "2-3 sentence summary of the planned trip"
}

Return only the JSON object, no other text.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse JSON response
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    const tripData = JSON.parse(cleanedResponse);

    console.log("✨ Gemini processed trip data:", tripData);
    return tripData;
  } catch (error) {
    console.error("❌ Gemini processing error:", error);

    // Return default structure instead of throwing
    return {
      destination: null,
      startDate: null,
      endDate: null,
      budget: null,
      travelers: null,
      preferences: [],
      activities: [],
      keyPoints: ["Failed to process transcript"],
      tripSummary: "Unable to extract trip details from conversation",
    };
  }
};

// Create outbound call with proper error handling
export const createOutboundCall = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Validate required environment variables
  if (
    !process.env.VAPI_PHONE_NUMBER_ID ||
    !process.env.VAPI_CUSTOMER_PHONE_NUMBER ||
    !process.env.VAPI_ASSISTANT_ID
  ) {
    throw new ApiError(500, "Missing required VAPI configuration", [
      "VAPI_PHONE_NUMBER_ID",
      "VAPI_CUSTOMER_PHONE_NUMBER",
      "VAPI_ASSISTANT_ID",
    ]);
  }

  try {
    // Create call with VAPI
    const call = await vapi.calls.create({
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
        number: process.env.VAPI_CUSTOMER_PHONE_NUMBER,
      },
      assistantId: process.env.VAPI_ASSISTANT_ID,
    });

    if (!call || !call.id) {
      throw new ApiError(500, "Failed to create call with VAPI service");
    }

    // Create trip record in database
    const trip = new Trip({
      userId: userId,
      callId: call.id,
      phoneNumber: process.env.VAPI_CUSTOMER_PHONE_NUMBER,
      callStatus: "queued",
      assistantId: process.env.VAPI_ASSISTANT_ID,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
    });

    await trip.save();

    // Update user's trips array
    await User.findByIdAndUpdate(userId, {
      $push: { trips: trip._id },
    });

    console.log("✅ Call initiated successfully. Call ID:", call.id);

    // Start auto-fetch process
    autoFetchTranscript(call.id);

    // Return success response
    res.status(201).json(
      new ApiResponse(
        201,
        {
          callId: call.id,
          tripId: trip._id,
          status: "queued",
          phoneNumber: process.env.VAPI_CUSTOMER_PHONE_NUMBER,
        },
        "Call initiated successfully"
      )
    );
  } catch (error) {
    console.error("❌ Error creating Vapi call:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to create call", [error.message]);
  }
});

// Get call transcript with proper error handling
export const getCallTranscript = asyncHandler(async (req, res) => {
  const { callId } = req.params;

  if (!callId) {
    throw new ApiError(400, "Call ID is required");
  }

  try {
    const call = await vapi.calls.get(callId);

    if (!call) {
      throw new ApiError(404, "Call not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          callId: call.id,
          transcript: call.transcript || "Transcript not ready yet",
          status: call.status,
          duration: call.duration || 0,
        },
        "Transcript retrieved successfully"
      )
    );
  } catch (error) {
    console.error("❌ Error fetching transcript:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to fetch transcript", [error.message]);
  }
});

// Handle VAPI webhook with proper error handling
export const handleVapiWebhook = asyncHandler(async (req, res) => {
  const { type, call } = req.body;

  if (!type || !call || !call.id) {
    throw new ApiError(400, "Invalid webhook payload", [
      "type",
      "call",
      "call.id",
    ]);
  }

  console.log("📞 Webhook received:", type, "Call ID:", call.id);

  try {
    if (type === "call-ended") {
      // Update trip with call data
      const updatedTrip = await Trip.findOneAndUpdate(
        { callId: call.id },
        {
          transcript: call.transcript || "",
          callStatus: call.status,
          callDuration: call.duration || 0,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedTrip) {
        console.warn("⚠️ Trip not found for call ID:", call.id);
      } else {
        console.log("✅ Trip updated with transcript for call:", call.id);

        // Process transcript with Gemini if available
        if (call.transcript && call.transcript.trim().length > 0) {
          try {
            const geminiData = await processTranscriptWithGemini(
              call.transcript
            );

            await Trip.findByIdAndUpdate(updatedTrip._id, {
              tripDetails: {
                destination: geminiData.destination,
                startDate: geminiData.startDate
                  ? new Date(geminiData.startDate)
                  : null,
                endDate: geminiData.endDate
                  ? new Date(geminiData.endDate)
                  : null,
                budget: geminiData.budget,
                travelers: geminiData.travelers,
                preferences: geminiData.preferences || [],
                activities: geminiData.activities || [],
              },
              aiInsights: {
                keyPoints: geminiData.keyPoints || [],
                tripSummary: geminiData.tripSummary || "",
                processedAt: new Date(),
              },
            });

            console.log(
              "✨ AI insights processed and saved for call:",
              call.id
            );
          } catch (aiError) {
            console.error("❌ Failed to process AI insights:", aiError);
          }
        }
      }
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { processed: true },
          "Webhook processed successfully"
        )
      );
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    throw new ApiError(500, "Webhook processing failed", [error.message]);
  }
});

// Get user trips with proper error handling
export const getUserTrips = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  try {
    const trips = await Trip.find({ userId })
      .sort({ createdAt: -1 })
      .select("-transcript") // Exclude transcript for performance
      .lean();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          trips,
          count: trips.length,
        },
        "Trips retrieved successfully"
      )
    );
  } catch (error) {
    console.error("❌ Error fetching user trips:", error);
    throw new ApiError(500, "Failed to fetch trips", [error.message]);
  }
});

// Get trip details with proper error handling
export const getTripDetails = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  if (!tripId) {
    throw new ApiError(400, "Trip ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  try {
    const trip = await Trip.findOne({ _id: tripId, userId }).lean();

    if (!trip) {
      throw new ApiError(404, "Trip not found or access denied");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, { trip }, "Trip details retrieved successfully")
      );
  } catch (error) {
    console.error("❌ Error fetching trip details:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to fetch trip details", [error.message]);
  }
});

// Debug trip with proper error handling
export const debugTrip = asyncHandler(async (req, res) => {
  const { callId } = req.params;

  if (!callId) {
    throw new ApiError(400, "Call ID is required");
  }

  try {
    // Get data from both database and VAPI
    const [trip, call] = await Promise.all([
      Trip.findOne({ callId }).lean(),
      vapi.calls.get(callId),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          database: trip,
          vapi: {
            id: call?.id,
            status: call?.status,
            transcript: call?.transcript,
            duration: call?.duration,
          },
          sync: {
            tripExists: !!trip,
            callExists: !!call,
            statusMatch: trip?.callStatus === call?.status,
            transcriptMatch: !!trip?.transcript && !!call?.transcript,
          },
        },
        "Debug data retrieved successfully"
      )
    );
  } catch (error) {
    console.error("❌ Debug error:", error);
    throw new ApiError(500, "Debug operation failed", [error.message]);
  }
});

// Auto fetch transcript with improved error handling
export const autoFetchTranscript = async (callId) => {
  const delays = [30, 60, 120]; // 30s, 1m, 2m

  for (const delay of delays) {
    setTimeout(async () => {
      try {
        const call = await vapi.calls.get(callId);

        if (call?.status === "ended" && call?.transcript) {
          console.log(
            `🔍 Processing transcript with Gemini for call ${callId}...`
          );

          const geminiData = await processTranscriptWithGemini(call.transcript);

          await Trip.findOneAndUpdate(
            { callId },
            {
              transcript: call.transcript,
              callStatus: call.status,
              callDuration: call.duration || 0,
              tripDetails: {
                destination: geminiData.destination,
                startDate: geminiData.startDate
                  ? new Date(geminiData.startDate)
                  : null,
                endDate: geminiData.endDate
                  ? new Date(geminiData.endDate)
                  : null,
                budget: geminiData.budget,
                travelers: geminiData.travelers,
                preferences: geminiData.preferences || [],
                activities: geminiData.activities || [],
              },
              aiInsights: {
                keyPoints: geminiData.keyPoints || [],
                tripSummary: geminiData.tripSummary || "",
                processedAt: new Date(),
              },
            }
          );

          console.log(
            `✅ Transcript auto-saved with AI insights for call ${callId}`
          );
          return;
        } else {
          console.log(
            `⏳ Call ${callId} status: ${call?.status}, waiting for transcript...`
          );
        }
      } catch (error) {
        console.error(`❌ Auto-fetch error for call ${callId}:`, error.message);
      }
    }, delay * 1000);
  }
};

// Background transcript polling with improved error handling
export const startTranscriptPolling = () => {
  console.log("🔄 Starting background transcript polling...");

  setInterval(async () => {
    try {
      // Find trips that need transcript processing
      const pendingTrips = await Trip.find({
        $and: [
          { $or: [{ transcript: "" }, { transcript: { $exists: false } }] },
          { createdAt: { $lt: new Date(Date.now() - 30000) } }, // Older than 30s
          { createdAt: { $gt: new Date(Date.now() - 600000) } }, // Newer than 10m
          { callStatus: { $ne: "ended" } }, // Not already processed
        ],
      }).limit(10); // Process max 10 at a time

      if (pendingTrips.length > 0) {
        console.log(
          `📋 Found ${pendingTrips.length} pending transcripts to check`
        );
      }

      for (const trip of pendingTrips) {
        try {
          const call = await vapi.calls.get(trip.callId);

          if (call?.status === "ended" && call?.transcript) {
            console.log(
              `🔍 Background job processing transcript with Gemini for ${trip.callId}...`
            );

            const geminiData = await processTranscriptWithGemini(
              call.transcript
            );

            await Trip.findByIdAndUpdate(trip._id, {
              transcript: call.transcript,
              callStatus: call.status,
              callDuration: call.duration || 0,
              tripDetails: {
                destination: geminiData.destination,
                startDate: geminiData.startDate
                  ? new Date(geminiData.startDate)
                  : null,
                endDate: geminiData.endDate
                  ? new Date(geminiData.endDate)
                  : null,
                budget: geminiData.budget,
                travelers: geminiData.travelers,
                preferences: geminiData.preferences || [],
                activities: geminiData.activities || [],
              },
              aiInsights: {
                keyPoints: geminiData.keyPoints || [],
                tripSummary: geminiData.tripSummary || "",
                processedAt: new Date(),
              },
            });

            console.log(
              `✅ Background job saved transcript with AI insights for ${trip.callId}`
            );
          } else {
            // Update call status even if no transcript yet
            if (call && call.status !== trip.callStatus) {
              await Trip.findByIdAndUpdate(trip._id, {
                callStatus: call.status,
                callDuration: call.duration || 0,
              });
            }
          }
        } catch (error) {
          console.error(
            `❌ Failed to fetch transcript for ${trip.callId}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.error("❌ Background polling error:", error.message);
    }
  }, 60000); // Run every minute
};

// Get trip insights with proper error handling
export const getTripInsights = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  if (!tripId) {
    throw new ApiError(400, "Trip ID is required");
  }

  if (!userId) {
    throw new ApiError(401, "User authentication required");
  }

  try {
    const trip = await Trip.findOne({ _id: tripId, userId })
      .select("tripDetails aiInsights callDuration createdAt callStatus")
      .lean();

    if (!trip) {
      throw new ApiError(404, "Trip not found or access denied");
    }

    // Calculate additional insights
    const insights = {
      tripDetails: trip.tripDetails || {},
      aiInsights: trip.aiInsights || {},
      callDuration: trip.callDuration || 0,
      createdAt: trip.createdAt,
      callStatus: trip.callStatus,
      processingStatus: {
        hasTranscript: !!trip.transcript,
        hasAiInsights: !!(trip.aiInsights && trip.aiInsights.processedAt),
        isComplete: trip.callStatus === "ended",
      },
    };

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { insights },
          "Trip insights retrieved successfully"
        )
      );
  } catch (error) {
    console.error("❌ Error fetching trip insights:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Failed to fetch trip insights", [error.message]);
  }
});
