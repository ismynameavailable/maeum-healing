import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Write from "./pages/Write";
import History from "./pages/History";
import Main from "./pages/Main";
import SharedVideo from "./components/SharedVideo";
import Contents from "./pages/Contents";
import Chat from "./pages/Chat";

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
      {/* ✅ 영상 항상 재생 */}
      <SharedVideo />

      {/* ✅ 페이지들 영상 위에 덮음 */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/write" element={<Write user={user} />} />
          <Route path="/history" element={<History user={user} />} />
          <Route path="/main" element={<Main user={user} />} />
          <Route path="/contents" element={<Contents user={user} />} />
          <Route path="/chat" element={<Chat user={user} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
