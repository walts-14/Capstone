import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    title: String,
    url: String,
})

const Video = mongoose.model("Video", VideoSchema);
export default Video;