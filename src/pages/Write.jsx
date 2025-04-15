import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const emotions = [
  { emoji: "🙂", label: "기쁨" },
  { emoji: "😢", label: "슬픔" },
  { emoji: "😡", label: "분노" },
  { emoji: "😰", label: "불안" },
  { emoji: "😵‍💫", label: "무기력" },
];

function Write({ user }) {
  const [emotion, setEmotion] = useState(null);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!emotion?.label || !text.trim()) {
      alert("감정과 내용을 모두 입력해주세요.");
      return;
    }

    if (!user || !user.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const today = new Date().toISOString();
    const entryRef = doc(db, "users", user.userId, "entries", today);

    await setDoc(entryRef, {
      emotion,
      text,
      nickname: user.nickname,
      timestamp: serverTimestamp(),
    });

    alert("오늘 하루 수고 많았어요 🌿");

    setEmotion(null);
    setText("");
    navigate("/history");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-green-200 p-4 text-center text-xl font-semibold">
        마음쉼터 | 감정 기록하기
      </header>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10 bg-green-50 relative">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-sm text-gray-500 hover:underline"
        >
          ◀ 뒤로가기
        </button>

        {/* 메인 컨텐츠 */}
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-medium mb-4 text-center">
            오늘 하루, 어떤 감정을 느끼셨나요?
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {emotions.map((e) => (
              <button
                key={e.label}
                onClick={() => setEmotion(e)}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  emotion?.label === e.label
                    ? "bg-green-400 text-white font-bold"
                    : "bg-white hover:bg-green-100"
                }`}
              >
                {e.emoji} {e.label}
              </button>
            ))}
          </div>

          <textarea
            rows="5"
            placeholder="오늘 있었던 일이나 느낀 감정을 자유롭게 적어보세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border rounded mb-4 text-sm resize-none"
          />

          <div className="text-center">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              기록 저장하기
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-green-100 text-center text-xs py-3">
        © 2025 마음쉼터. 모든 마음은 소중합니다.
      </footer>
    </div>
  );
}

export default Write;
