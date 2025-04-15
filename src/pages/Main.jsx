import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Main({ user }) {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center px-4 relative">
      {/* ✅ 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-sm text-gray-500 hover:underline z-50"
      >
        ◀ 뒤로가기
      </button>

      {/* 상단 고정된 텍스트 */}
      <div className="mt-[20vh] text-center">
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

      {/* 버튼은 따로 밑에 등장 */}
      {showButtons && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-6 space-y-4 w-full max-w-xs"
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
              className="w-full py-3 bg-white rounded shadow hover:scale-105 hover:bg-green-200 transition"
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
