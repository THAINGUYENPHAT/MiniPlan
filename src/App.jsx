import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getToken, onMessage } from "firebase/messaging";
import { Toaster } from "react-hot-toast";

import { auth, messaging } from "./firebase";
import Auth from "./Auth";
import TodoApp from "./TodoApp";
import LandingPage from "./LandingPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;
    auth.currentUser.getIdToken().catch(() => {
      console.warn("❌ Token lỗi, đăng xuất...");
      signOut(auth);
    });
  }, []);

  useEffect(() => {
    getToken(messaging, {
      vapidKey: "BOuTkXYpT5zCUKAmNcFJGACWtTC5jYQmCR5A_qn0y6U2gv24rUEokiaVgdHQGPp_d7RROYxxjUtIi3OPrJUZimU",
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log("📱 FCM Token:", currentToken);
        } else {
          console.warn("Không lấy được token.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy token: ", err);
      });

    onMessage(messaging, (payload) => {
      console.log("🔔 Thông báo nhận được:", payload);
      alert(payload.notification?.title || "Thông báo mới");
    });
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Đang tải dữ liệu...</p>;
  }

  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1500,
          style: {
            borderRadius: '12px',
            background: '#fef3c7',
            color: '#92400e',
            fontWeight: 'bold',
            padding: '16px',
            fontSize: '16px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={user ? <TodoApp user={user} /> : <LandingPage />} />
        <Route path="/app" element={user ? <TodoApp user={user} /> : <Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
