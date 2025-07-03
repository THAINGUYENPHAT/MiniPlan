// src/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 text-gray-800">

      {/* Header */}
      <header className="flex justify-between items-center p-4 md:px-12 border-b">
        <div className="text-2xl font-bold">🎯 MiniPlan</div>
        <Link
          to="/app"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Dùng thử ngay
        </Link>
      </header>

      {/* Hero */}
      <section className="text-center py-12 px-4 md:px-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Quản lý việc học & deadline dễ dàng hơn</h1>
        <p className="text-gray-600 text-lg mb-6">
          MiniPlan giúp sinh viên theo dõi công việc, nhắc deadline và cộng tác hiệu quả.
        </p>
        <div className="flex justify-center">
  <Link
    to="/app"
    className="mt-6 px-6 py-3 rounded-full 
               bg-gradient-to-r from-pink-300 via-yellow-200 to-purple-300 
               shadow-lg text-gray-800 font-semibold text-lg tracking-wide 
               flex items-center gap-3 
               hover:shadow-2xl hover:scale-105 transition"
  >
    <span className="text-2xl">🎯</span>
    <span>Bắt đầu với MiniPlan</span>
  </Link>
</div>



      </section>

      {/* Footer */}
      

      <footer className="text-center py-6 text-gray-500 text-sm flex flex-col items-center gap-1">
  <p>© {new Date().getFullYear()} MiniPlan 🎯</p>
  <p className="italic text-gray-400">“Mỗi ngày hoàn thành một việc nhỏ là một bước gần tới ước mơ.” ✨</p>
  <p className="text-xs">Code with 💖 by Phát</p>
</footer>

    </div>
  );
}
