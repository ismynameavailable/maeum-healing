import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Intro() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden z-10">
      {/* ✅ 검정 반투명 오버레이 (영상은 SharedVideo에서 제공됨) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10" />

      {/* ✅ 콘텐츠 (글자 + 버튼) */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.h1
          className="text-3xl font-bold mb-4 drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          마음쉼터에 오신 것을 환영합니다.
        </motion.h1>

        <motion.p
          className="text-lg mb-10 drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          당신의 마음을 천천히 들여다보는 공간
        </motion.p>

        <motion.button
          onClick={() => navigate("/login")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-white text-green-700 font-semibold rounded-full shadow hover:bg-green-200 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          시작하기
        </motion.button>
      </div>
    </div>
  );
}

export default Intro;
