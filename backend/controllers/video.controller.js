import Video from "../models/videoLesson.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Upload a video file to Cloudinary and save a Video document.
 */
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { description, word, level, lessonNumber, termNumber } = req.body;

    // Validate level
    const validLevels = ["basic", "intermediate", "advanced"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ error: "Invalid level provided" });
    }

    // Ensure lessonNumber is a valid number
    if (isNaN(lessonNumber)) {
      return res.status(400).json({ error: "Invalid lesson number" });
    }

    // Folder path: videos/basic/lesson1
    const folderPath = `videos/${level}/lesson${lessonNumber}`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: folderPath,
      transformation: [
        {width: 1000, crop: "scale"},
        {quality: "auto"},
        {fetch_format: "auto"}
      ]
    });

    const newVideo = new Video({
      videoUrl: result.secure_url,
      publicId: result.public_id,
      word,
      description,
      level,
      lessonNumber: Number(lessonNumber),
      termNumber: Number(termNumber),
    });

    await newVideo.save();
    res.json({ message: "Video uploaded successfully", videoUrl: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieve videos with optional filters (level, lessonNumber, termNumber)
 */
export const getVideos = async (req, res) => {
  try {
    const { level, lessonNumber, termNumber } = req.query;
    const filter = {};
    if (level) filter.level = level;
    if (lessonNumber) filter.lessonNumber = Number(lessonNumber);
    if (termNumber) filter.termNumber = Number(termNumber);

    const videos = await Video.find(filter);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
