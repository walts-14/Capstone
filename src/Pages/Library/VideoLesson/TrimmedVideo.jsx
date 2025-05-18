import React, { useRef, useState } from "react";

export default function TrimmedVideo({ src, width, height, start = .5, end = 5, playbackRate = 1.3 }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    // set speed
    v.playbackRate = playbackRate;
    v.defaultPlaybackRate = playbackRate;
    // jump to start
    v.currentTime = start;
  };

  const handleSeeked = () => {
    // once we've seeked, show & play
    setReady(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    // if we've reached (or passed) the cut‑off, loop back
    if (v.currentTime >= end) {
      v.currentTime = start;
      v.play().catch(() => {});
    }
  };

  return (
    <video
      ref={videoRef}
      key={src}
      width={width}
      height={height}
      preload="auto"
      muted
      autoPlay
      loop
      // note: remove native loop, we loop manually here
      onLoadedMetadata={handleLoadedMetadata}
      onSeeked={handleSeeked}
      onTimeUpdate={handleTimeUpdate}
      // hide until ready to avoid a flash of un‑trimmed content
      style={{ visibility: ready ? "visible" : "hidden" }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
