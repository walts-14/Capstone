import React, { useState } from "react";

const VideoUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadVideo = async () => {
        if (!selectedFile) {
            alert("Please select a video file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile); // ✅ Ensure the file is included

        try {
            const response = await fetch("http://localhost:5000/api/upload", { // ✅ Use backend API
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Uploaded Video:", data);

            if (data.url) {
                setVideoUrl(data.url); // ✅ Store video URL
            }
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <div>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button onClick={uploadVideo}>Upload Video</button>
            {videoUrl && (
                <div>
                    <p>Uploaded Video:</p>
                    <video controls width="400">
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}
        </div>
    );
};

export default VideoUploader;
