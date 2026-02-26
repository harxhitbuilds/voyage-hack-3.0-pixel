import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    profile: { type: String },
    hometown: { type: String },
    onBoarded: { type: Boolean, default: false },

    travelPreferences: {
      travelStyle: [{ type: String }],
      budgetRange: [{ type: String }],
      groupSize: [{ type: String }],
      tripDuration: [{ type: String }],
      travelFrequency: [{ type: String }],
      accommodationType: [{ type: String }],
      transportationPreference: [{ type: String }],
    },

    trips: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
      },
    ],

    visitedMonuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ThreeDModel",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
