// Import necessary modules
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Database connection function
const connect = async () => {
  try {
    // Set up event listeners before connecting
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Database connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });

    // Connect to the database
    await mongoose.connect(process.env.MONGO_URL || "");
  } catch (error) {
    console.error("Error in connecting with database:", error);
    process.exit(1);
  }
};

// Database disconnection function
const disconnect = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed gracefully");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
    throw error;
  }
};

export default connect;
export { connect as connectDB, disconnect as disconnectDB };
