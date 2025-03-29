import express from 'express';
import cloudinary from '../config/cloudinary.js';
import upload from '../config/multer.js';
import Video from '../models/video.schema.js';

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "videos",
        });

        // Use the file's original name as the title
        const newVideo = new Video({
            title: req.file.originalname,
            url: result.secure_url,
        });

        await newVideo.save();

        res.json({ message: "Video uploaded successfully", url: result.secure_url });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



router.get("/videos", async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
