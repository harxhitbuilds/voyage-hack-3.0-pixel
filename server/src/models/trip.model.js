import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callId: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    transcript: {
      type: String,
      default: "",
    },
    callStatus: {
      type: String,
      enum: ["queued", "ringing", "in-progress", "forwarding", "ended"],
      default: "queued",
    },
    callDuration: {
      type: Number,
      default: 0,
    },
    tripDetails: {
      destination: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      budget: { type: String },
      travelers: { type: Number },
      preferences: [{ type: String }],
      activities: [{ type: String }],
    },
    aiInsights: {
      keyPoints: [{ type: String }],
      tripSummary: { type: String },
      processedAt: { type: Date },
    },
    itinerary: [
      {
        day: { type: Number },
        title: { type: String },
        activities: [{ type: String }],
        estimatedCost: { type: String },
        tips: { type: String },
      },
    ],
    assistantId: { type: String },
    phoneNumberId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
