import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SHA256 from "crypto-js/sha256";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Login({ onLogin }) {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!nickname || !password) {
      alert("닉네임과 비밀번호를 입력해주세요.");
      return;
    }

    const userId = SHA256(nickname + password).toString();
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        nickname,
        createdAt: new Date(),
      });
    }

    onLogin({ userId, nickname });
    navigate("/main");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center text-center px-4">
      <div className="bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-md z-10">
        <h1 className="text-2xl font-bold text-green-800 mb-4">마음쉼터</h1>
        <p className="text-sm text-gray-600 mb-6">
          닉네임과 비밀번호를 입력해주세요.
        </p>

        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mb-3 px-4 py-2 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
        />
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white px-6 py-2 rounded w-full hover:bg-green-600 transition"
        >
          시작하기
        </button>

        <p className="text-xs text-gray-400 mt-4">
          * 처음이라면 자동으로 등록됩니다.
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-sm text-white hover:underline z-20"
      >
        ◀ 뒤로가기
      </button>
    </div>
  );
}

export default Login;
