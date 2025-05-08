import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import BackButton from "../components/BackButton";

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
      emotion: {
        emoji: emotion.emoji,
        label: emotion.label,
      },
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
    <div className="relative min-h-screen overflow-hidden">
      {/*  배경 영상 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/sea.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        ref={(video) => {
          if (video) video.playbackRate = 0.7;
        }}
      />

      {/*  실제 콘텐츠 */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-10 relative">
          {/* 뒤로가기 버튼 */}
          <div className="w-full max-w-xl mb-4 mt-4">
            <BackButton to="/main" />
          </div>

          <div className="max-w-xl w-full bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-medium mb-4 text-center text-gray-800">
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
      </div>
    </div>
  );
}

export default Write;
