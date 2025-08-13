import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

function Login() {
  const [user, setUser] = useState(null);

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Hàm đăng nhập Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Đăng nhập Google thành công!");
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      alert("Đăng nhập Google thất bại!");
    }
  };

  // Nếu đã đăng nhập → tự động vào
  if (user) {
    return (
      <div>
        <h1>Xin chào, {user.displayName}</h1>
        <img src={user.photoURL} alt="avatar" style={{ width: 50, borderRadius: "50%" }} />
      </div>
    );
  }

  // Nếu chưa đăng nhập → hiện nút
  return (
    <div>
      <h1>Đăng nhập MiniPlan</h1>
      <button onClick={handleGoogleLogin}>
        Đăng nhập với Google
      </button>
    </div>
  );
}

export default Login;
