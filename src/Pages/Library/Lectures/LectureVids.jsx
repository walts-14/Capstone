import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const VideoLecture = () => {
    const { title } = useParams();
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                console.log("Fetching lecture for:", title);
                const response = await axios.get(`/api/lecture/${title}`);
                console.log("Fetched Data:", response.data);
                setLecture(response.data);
            } catch (error) {
                console.error("Error fetching lecture:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchLecture();
    }, [title]);

    // Convert Google Drive link to embeddable viewer URL
    const getDirectDriveLink = (url) => {
        console.log("Original URL:", url);
        const match = url?.match(/file\/d\/(.+?)\//);
        const convertedUrl = match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
        console.log("Converted URL:", convertedUrl);
        return convertedUrl;
    };



    if (loading) return <div>Loading...</div>;
    if (!lecture) return <div>Lecture not found</div>;

    return (
        <div className="video-player">
            <iframe
                src={getDirectDriveLink(lecture.url)}
                width="100%"
                height="190px"
                allow="autoplay"
                frameBorder="0"
            ></iframe>


            <h2 className="text-white text-center">{lecture.title}</h2>
            <p className="text-white">{lecture.description}</p>
        </div>
    );
};

export default VideoLecture;
