import express from "express";
import { uploadVideo as uploadVideoMiddleware} from "../config/multer.js";
import { uploadVideo as uploadVideoController, getVideos } from "../controllers/video.controller.js";

const router = express.Router();

// POST /api/videos/upload - Upload video
router.post("/upload", uploadVideoMiddleware.single("file"), uploadVideoController);

// GET /api/videos - Retrieve videos with optional query parameters
router.get("/", getVideos);

export default router;
