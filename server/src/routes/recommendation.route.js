import express from "express";
import { getPersonalizedRecommendations, getTrendingRecommendations } from "../controllers/recommendation.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/personalized", authenticate, getPersonalizedRecommendations);
router.get("/trending", authenticate, getTrendingRecommendations);

export default router;
