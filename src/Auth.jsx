import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError("Lỗi: " + err.message);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!email) {
      setError("❗ Vui lòng nhập email để đặt lại mật khẩu");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError("✅ Đã gửi email khôi phục mật khẩu. Kiểm tra hộp thư!");
    } catch (err) {
      console.error("Lỗi reset mật khẩu:", err);
      setError("❌ Không gửi được email. Kiểm tra lại địa chỉ email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="max-w-md w-full bg-gray-100 p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isRegistering ? "Đăng ký tài khoản" : "Đăng nhập MiniPlan"}
        </h1>

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border rounded"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2 whitespace-pre-wrap">{error}</p>}

        <button
          onClick={handleAuth}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2"
        >
          {isRegistering ? "Đăng ký" : "Đăng nhập"}
        </button>

        {!isRegistering && (
          <p
            onClick={handleResetPassword}
            className="text-center text-sm text-blue-500 hover:underline cursor-pointer mb-2"
          >
            Quên mật khẩu?
          </p>
        )}

        <p
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-center text-blue-600 cursor-pointer text-sm"
        >
          {isRegistering
            ? "Bạn đã có tài khoản? Đăng nhập"
            : "Chưa có tài khoản? Đăng ký"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
