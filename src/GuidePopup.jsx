// src/components/GuidePopup.jsx
import { useState, useEffect } from "react";

export default function GuidePopup() {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenGuide");
    if (!hasSeen) {
      setShowGuide(true);
    }
  }, []);

  const closeGuide = () => {
    localStorage.setItem("hasSeenGuide", "true");
    setShowGuide(false);
  };

  if (!showGuide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">📌 Hướng dẫn sử dụng</h2>
        <ul className="space-y-2 text-gray-700">
          <li>1️⃣ Nhập tên công việc vào ô ở trên.</li>
          <li>2️⃣ Bấm <b>⚙ Thuộc tính</b> để chọn ngày & mức ưu tiên.</li>
          <li>3️⃣ Nhấn <b>+ Thêm công việc</b> để lưu.</li>
          <li>4️⃣ Hoàn thành thì tick ✅ vào công việc.</li>
        </ul>
        <button
          onClick={closeGuide}
          className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
}
