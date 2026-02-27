import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./utils/logger.js";
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URL",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "VAPI_PRIVATE_KEY",
  "VAPI_PHONE_NUMBER_ID",
  "VAPI_ASSISTANT_ID",
  "VAPI_CUSTOMER_PHONE_NUMBER",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.error(
    "💡 Please check your .env file and ensure all required variables are set."
  );
  console.error("📋 See .env.example for reference.");
  process.exit(1);
}

console.log("✅ All required environment variables are present");

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://pixel-symbiosis-skill-hackathon.onrender.com", "https://pixel-symbiosis-skill-hackathon.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

import authRouter from "./routes/auth.route.js";
import modelRouter from "./routes/model.route.js";
import vapiRouter from "./routes/vapi.route.js";
import recommendationRouter from "./routes/recommendation.route.js";
import model3dRouter from "./routes/model3d.route.js";
import { startTranscriptPolling } from "./controllers/vapi.controller.js";

// Start background transcript polling
startTranscriptPolling();

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/3dmodel", modelRouter);
app.use("/api/vapi", vapiRouter);
app.use("/api/recommendations", recommendationRouter);
app.use("/api/model3d", model3dRouter);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express server!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
