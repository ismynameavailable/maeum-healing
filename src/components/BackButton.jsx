// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";

export default function BackButton({ to = -1 }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 100,
      }}
    >
      <button
        onClick={() => navigate(to)}
        style={{
          background: "rgba(0,0,0,0.6)", // ✅ 반투명 검정 배경
          color: "white", // ✅ 흰색 글자
          border: "none",
          padding: "8px 12px",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        ← 뒤로가기
      </button>
    </div>
  );
}
