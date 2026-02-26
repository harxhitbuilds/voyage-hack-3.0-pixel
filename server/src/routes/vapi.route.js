import Router from "express";
import {
  createOutboundCall,
  getCallTranscript,
  handleVapiWebhook,
  getUserTrips,
  getTripDetails,
  getTripInsights,
  debugTrip,
  streamCallStatus,
} from "../controllers/vapi.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();

// Call management
router.post("/call", authenticate, createOutboundCall);
router.get("/transcript/:callId", authenticate, getCallTranscript);

// Trip management
router.get("/trips", authenticate, getUserTrips);
router.get("/trip/:tripId", authenticate, getTripDetails);
router.get("/insights/:tripId", authenticate, getTripInsights);

// Live status stream (SSE)
router.get("/status/:callId/stream", authenticate, streamCallStatus);

// Debug endpoint
router.get("/debug/:callId", authenticate, debugTrip);

// Webhook (no auth needed - Vapi will call this)
router.post("/webhook", handleVapiWebhook);

export default router;
