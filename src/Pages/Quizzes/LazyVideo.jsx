import React, { useRef, useState, useEffect } from "react";

function LazyVideo({ src, width = 200, height = 150, poster }) {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '100px' } // start loading a bit before fully in view
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      width={width}
      height={height}
      className="rounded-2 mb-1"
      poster={poster}
      // only preload metadata by default; we’ll switch to auto once visible
      preload={inView ? "auto" : "metadata"}
      autoPlay={inView}
      muted
      loop
      playsInline
    >
      {inView && <source src={src} type="video/mp4" />}
      Your browser does not support the video tag.
    </video>
  );
}

export default LazyVideo;