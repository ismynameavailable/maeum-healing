// Contents.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const emotionKeywordMap = {
  기쁨: "기분 좋아지는 힐링 음악",
  슬픔: "위로가 되는 음악",
  분노: "스트레스 해소 음악",
  불안: "불안 해소 명상",
  무기력: "에너지 회복 음악",
};

function FloatingCloud({ texture, position, scale }) {
  const cloudRef = useRef();
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.8,
  });
  const sprite = new THREE.Sprite(spriteMaterial);

  useEffect(() => {
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(...position);
    cloudRef.current.add(sprite);
  }, [position, scale, texture]);

  useFrame((state) => {
    if (cloudRef.current) {
      const t = state.clock.getElapsedTime();
      cloudRef.current.position.y =
        position[1] + Math.sin(t + position[0]) * 0.3;
    }
  });

  return <group ref={cloudRef} />;
}

function generateNonOverlappingPositions(count, minDistance) {
  const positions = [];

  while (positions.length < count) {
    const pos = [
      Math.random() * 20 - 10, // x
      Math.random() * 6 - 3, // y
      Math.random() * 15 + 10, // z
    ];

    const tooClose = positions.some(
      (p) =>
        Math.sqrt(
          Math.pow(p[0] - pos[0], 2) +
            Math.pow(p[1] - pos[1], 2) +
            Math.pow(p[2] - pos[2], 2)
        ) < minDistance
    );

    if (!tooClose) {
      positions.push(pos);
    }
  }

  return positions;
}

export default function Contents({ user }) {
  const texture = useMemo(
    () => new THREE.TextureLoader().load("/cloud.png"),
    []
  );
  const [videoIds, setVideoIds] = useState([]);

  useEffect(() => {
    const fetchLatestEntry = async () => {
      console.log("✅ 현재 user 상태:", user);
      if (!user || !user.userId) return;

      const entriesRef = collection(db, "users", user.userId, "entries");
      const q = query(entriesRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const latest = snapshot.docs[0].data();
        console.log("📝 최신 일기:", latest);
        const emotionLabel = latest.emotion?.label;
        const keyword = emotionKeywordMap[emotionLabel] || "힐링 음악";
        console.log("🔍 검색 키워드:", keyword);
        fetchYoutubeVideos(keyword);
      }
    };

    const fetchYoutubeVideos = async (keyword) => {
      const API_KEY = "AIzaSyCIy2tw8CqP88_CWIHl1as65koT1lHlcuo";
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          keyword
        )}&type=video&maxResults=3&key=${API_KEY}`
      );
      const data = await res.json();
      const ids = data.items.map((item) => item.id.videoId);
      console.log("🎥 받아온 유튜브 영상 ID:", ids);
      setVideoIds(ids);
    };

    fetchLatestEntry();
  }, [user]);

  const cloudCount = 50;
  const clouds = Array.from({ length: cloudCount }, (_, i) => {
    const x = Math.random() * 30 - 15;
    const y = Math.random() * 10 - 5;
    const z = Math.random() * 30 - 15;
    const scale = Math.random() * 4 + 4;
    return (
      <FloatingCloud
        key={i}
        texture={texture}
        position={[x, y, z]}
        scale={scale}
      />
    );
  });

  const videoPositions = generateNonOverlappingPositions(videoIds.length, 8);

  const videos = videoIds.map((id, i) => {
    const [x, y, z] = videoPositions[i];
    return (
      <Html key={id} position={[x, y, z]} transform occlude>
        <iframe
          width="300"
          height="200"
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-presentation"
        />
      </Html>
    );
  });

  return (
    <div
      className="w-full h-screen"
      style={{
        backgroundImage: 'url("/sky.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 30 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls minDistance={2} maxDistance={300} />
        {clouds}
        {videos}
      </Canvas>
    </div>
  );
}
