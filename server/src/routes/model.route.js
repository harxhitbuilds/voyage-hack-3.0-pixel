import Router from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getModels } from "../controllers/model.controller.js";

const router = Router();

router.get("/", authenticate, getModels);

export default router;
