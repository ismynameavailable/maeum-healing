import { useEffect, useRef } from "react";

function SharedVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    // 재생 속도 조절 (선택)
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src="/background.mp4"
      autoPlay
      muted
      loop
      playsInline
      className="fixed top-0 left-0 w-full h-full object-cover brightness-50 z-0"
    />
  );
}

export default SharedVideo;
