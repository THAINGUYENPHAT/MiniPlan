import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Toaster } from "react-hot-toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";


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
