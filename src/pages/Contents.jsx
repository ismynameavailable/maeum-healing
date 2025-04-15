// Contents.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const emotionKeywordMap = {
  기쁨: "기분 좋아지는 음악",
  슬픔: "위로가 되는 음악",
  분노: "스트레스 해소 음악",
  불안: "불안 해소 명상",
  무기력: "힘이 나는 음악",
};

function FloatingCloud({ texture, position, scale }) {
  const cloudRef = useRef();

  useEffect(() => {
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(...position);
    cloudRef.current.add(sprite);
  }, [texture, position, scale]);

  useFrame((state) => {
    if (cloudRef.current) {
      const t = state.clock.getElapsedTime();
      cloudRef.current.position.y =
        position[1] + Math.sin(t + position[0]) * 0.3;
    }
  });

  return <group ref={cloudRef} />;
}

function PinkCube({ position, videoId, title }) {
  const meshRef = useRef();
  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    setShowInfo(true);
  };

  const openYoutube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <group position={position} ref={meshRef} onClick={handleClick}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="pink" />
      </mesh>
      {showInfo && (
        <Html distanceFactor={10} position={[0, 1.5, 0]}>
          <div
            style={{
              background: "white",
              padding: "10px 14px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              textAlign: "center",
              minWidth: "180px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "6px" }}>{title}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openYoutube();
              }}
              style={{
                background:
                  "linear-gradient(to right,rgb(65, 185, 255),rgb(28, 129, 244))",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ▶ 영상 보기
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Contents({ user }) {
  const texture = useMemo(
    () => new THREE.TextureLoader().load("/cloud.png"),
    []
  );
  const [showMessage, setShowMessage] = useState(true);
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchLatestEntry = async () => {
      if (!user || !user.userId) return;
      const entriesRef = collection(db, "users", user.userId, "entries");
      const q = query(entriesRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data();
        const emotionLabel = latest.emotion?.label;
        const keyword = emotionKeywordMap[emotionLabel] || "힐링 음악";
        fetchYoutubeVideos(keyword);
      }
    };

    const fetchYoutubeVideos = async (keyword) => {
      const API_KEY = "AIzaSyCIy2tw8CqP88_CWIHl1as65koT1lHlcuo"; // 🔑 실제 API 키 입력 필요
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          keyword
        )}&type=video&maxResults=5&key=${API_KEY}`
      );
      const data = await res.json();
      const videos = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
      }));
      setVideoData(videos);
    };

    fetchLatestEntry();
  }, [user]);

  const cloudCount = 50;
  const cloudPositions = useMemo(() => {
    return Array.from({ length: cloudCount }, () => {
      const x = Math.random() * 30 - 15;
      const y = Math.random() * 10 - 5;
      const z = Math.random() * 30 - 15;
      return { x, y, z, scale: Math.random() * 6 + 8 };
    });
  }, [cloudCount]);

  const clouds = cloudPositions.map((pos, i) => (
    <FloatingCloud
      key={i}
      texture={texture}
      position={[pos.x, pos.y, pos.z]}
      scale={pos.scale}
    />
  ));

  const shuffled = [...cloudPositions].sort(() => Math.random() - 0.5);
  const cubes = videoData.map((video, i) => (
    <PinkCube
      key={video.id}
      position={[shuffled[i].x, shuffled[i].y, shuffled[i].z]}
      videoId={video.id}
      title={video.title}
    />
  ));

  return (
    <div
      className="w-full h-screen relative"
      style={{
        backgroundImage: 'url("/sky.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {showMessage && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "10px",
            padding: "12px 24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 100,
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          구름 속에 숨은 음악 큐브 5개를 찾아 클릭해보세요!
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
        {" "}
        {/* 🔭 카메라를 구름 중심에 배치 */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls minDistance={10} maxDistance={300} />
        {clouds}
        {cubes}
      </Canvas>
    </div>
  );
}
