import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton"; // ✅ 추가
function Main({ user }) {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden z-10">
      {/* 뒤로가기 버튼 */}
      <BackButton to="/Login" />

      {/* 상단 텍스트 */}
      <div className="mt-[20vh] text-center text-white">
        <motion.h2
          className="text-xl mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {user.nickname}님, 반가워요.
        </motion.h2>
        <motion.h1
          className="text-2xl font-bold mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          오늘은 어떤 마음으로 오셨나요?
        </motion.h1>
      </div>

      {/* 버튼들 */}
      {showButtons && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-6 space-y-4 w-full max-w-xs mx-auto"
        >
          {[
            { label: "감정 기록", path: "/write" },
            { label: "AI 상담", path: "/chat" },
            { label: "감성 콘텐츠", path: "/contents" },
            { label: "지난 기록", path: "/history" },
          ].map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className="w-full py-3 bg-white text-black rounded shadow hover:scale-105 hover:bg-green-200 transition"
            >
              {btn.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Main;
