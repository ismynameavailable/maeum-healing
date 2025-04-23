import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import BackButton from "../components/BackButton"; // ✅ 추가

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { Typewriter } from "react-simple-typewriter";

function Chat({ user }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestEmotion = async () => {
      console.log("유저 정보:", user);
      if (!user?.userId) return;

      const entriesRef = collection(db, "users", user.userId, "entries");
      const q = query(entriesRef, orderBy("timestamp", "desc"), limit(1));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestEntry = querySnapshot.docs[0].data();
          console.log("Firestore에서 가져온 감정:", latestEntry.emotion?.label);
          setEmotion(latestEntry.emotion?.label || "중립");
        } else {
          console.log("Firestore에 감정 기록 없음");
          setEmotion("중립");
        }
      } catch (error) {
        console.error("Firestore에서 감정 가져오기 실패:", error);
        setEmotion("중립");
      }
    };

    fetchLatestEmotion();
  }, [user]);

  const systemMessage = {
    role: "system",
    content: `
당신은 감정 상담만을 전문으로 하는 AI입니다.
현재 사용자는 "${emotion || "중립"}" 감정을 느끼고 있습니다.

다음 지침을 반드시 따르세요:
1. 반드시 첫 문장은 감정("${emotion}")에 대한 공감과 위로로 시작하세요.
2. 사용자가 단순히 "안녕"이라고 해도 해당 감정에 맞는 공감의 인사로 반응하세요.
3. 음식, 유머, 지식 등 상담 외 주제는 정중히 거절하세요.

지금부터 당신은 이 감정 기반 상담 지침을 절대적으로 따르는 AI입니다.
    `,
  };

  const sendMessage = async () => {
    if (!input.trim() || !emotion) return;

    console.log("GPT에 전달되는 감정:", emotion);

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [systemMessage, ...newMessages],
        }),
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message;
      if (reply) {
        setMessages((prev) => [...prev, reply]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "죄송해요. 응답을 받지 못했어요." },
        ]);
      }
    } catch (error) {
      console.error("GPT 응답 실패:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "오류가 발생했어요. 나중에 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && user?.userId) {
      const saveHistory = async () => {
        const chatRef = doc(db, "chatHistory", `${user.userId}_${Date.now()}`);
        await setDoc(chatRef, {
          userId: user.userId,
          emotion: emotion || "중립",
          messages: messages,
          createdAt: serverTimestamp(),
        });
      };
      saveHistory();
    }
  }, [messages]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        color: "white",
        zIndex: 2,
        position: "relative",
      }}
    >
      <BackButton to="/main" />

      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "20px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "800px",
        }}
      >
        <h2>🧠 마음 챗봇</h2>
        <p
          style={{ fontSize: "0.75rem", color: "#ccc", marginBottom: "0.5rem" }}
        >
          이 상담은 최근 감정 기록을 바탕으로 진행됩니다.
        </p>
        {emotion === null && (
          <p style={{ color: "white", marginBottom: 20 }}>
            감정을 불러오는 중입니다...
          </p>
        )}

        <div style={{ minHeight: "200px", marginBottom: "20px" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  backgroundColor: msg.role === "user" ? "#dcf8c6" : "#eeeeee",
                  color: "#333",
                  whiteSpace: "pre-wrap",
                }}
              >
                <strong style={{ display: "block", marginBottom: "4px" }}>
                  {msg.role === "user" ? "" : "AI 상담사"}
                </strong>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius: "16px",
                  backgroundColor: "#eeeeee",
                  color: "#333",
                }}
              >
                <strong style={{ display: "block", marginBottom: "4px" }}>
                  AI 상담사
                </strong>
                <Typewriter words={["입력중..."]} loop={false} cursor />
              </div>
            </div>
          )}
        </div>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="마음 속 이야기를 입력해주세요..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              color: "black",
              backgroundColor: "white",
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "12px 20px",
              borderRadius: "8px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
