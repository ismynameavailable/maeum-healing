import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const emotionOptions = [
  { label: "기쁨", emoji: "😊" },
  { label: "슬픔", emoji: "😢" },
  { label: "분노", emoji: "😡" },
  { label: "불안", emoji: "😰" },
  { label: "무기력", emoji: "😵‍💫" },
];

function History({ user }) {
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editEmotion, setEditEmotion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    if (!user || !user.userId) return;

    const entriesRef = collection(db, "users", user.userId, "entries");
    const q = query(entriesRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEntries(data);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("정말 삭제하시겠어요?");
    if (!ok) return;

    const ref = doc(db, "users", user.userId, "entries", id);
    await deleteDoc(ref);
    fetchEntries();
  };

  const handleEdit = (id, text, emotion) => {
    setEditId(id);
    setEditText(text);
    setEditEmotion(emotion);
  };

  const handleSave = async () => {
    const ref = doc(db, "users", user.userId, "entries", editId);
    await updateDoc(ref, {
      text: editText,
      emotion: editEmotion,
    });
    setEditId(null);
    setEditText("");
    setEditEmotion(null);
    fetchEntries();
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/*  배경 영상 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/sea.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        ref={(video) => {
          if (video) video.playbackRate = 0.7; //  속도 조절
        }}
      />

      {/*  실제 콘텐츠 */}
      <div className="relative z-20 py-10 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* 뒤로가기 */}
          <BackButton to="/main" />

          <h1 className="text-2xl font-bold text-center mb-6 text-white">
            감정 기록 히스토리
          </h1>

          <div className="space-y-4">
            {entries.length === 0 && (
              <p className="text-center text-gray-500">기록이 아직 없습니다.</p>
            )}

            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow p-4 border-l-4 border-green-400"
              >
                <div className="flex justify-between mb-2 text-sm text-gray-500">
                  <span>
                    {new Date(entry.timestamp?.seconds * 1000).toLocaleString()}
                  </span>
                  <span>
                    {entry.emotion?.emoji || ""} {entry.emotion?.label || ""}
                  </span>
                </div>

                {editId === entry.id ? (
                  <>
                    <textarea
                      rows="3"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full border p-2 rounded mb-2"
                    />
                    <div className="flex flex-wrap gap-2 mb-2">
                      {emotionOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setEditEmotion(opt)}
                          className={`px-3 py-1 border rounded-full ${
                            editEmotion?.label === opt.label
                              ? "bg-green-400 text-white font-bold"
                              : "bg-white hover:bg-green-100"
                          }`}
                        >
                          {opt.emoji} {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleSave}
                        className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-gray-600 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 whitespace-pre-line mb-2">
                      {entry.text}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() =>
                          handleEdit(entry.id, entry.text, entry.emotion)
                        }
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ✏ 수정
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        🗑 삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
