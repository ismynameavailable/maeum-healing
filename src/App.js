import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Write from "./pages/Write";
import History from "./pages/History";
import Main from "./pages/Main";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 인트로 시작 화면 */}
        <Route path="/" element={<Intro />} />

        {/* 로그인, 기록, 히스토리 */}
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/write" element={<Write user={user} />} />
        <Route path="/history" element={<History user={user} />} />
        <Route path="/main" element={<Main user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
