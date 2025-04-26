import express from "express";
import upload from "../config/multer.js";
import { uploadVideo, getVideos } from "../controllers/video.controller.js";

const router = express.Router();

// POST /api/videos/upload - Upload video
router.post("/upload", upload.single("file"), uploadVideo);

// GET /api/videos - Retrieve videos with optional query parameters
router.get("/", getVideos);

export default router;
