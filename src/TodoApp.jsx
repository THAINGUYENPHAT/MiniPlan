import { serverTimestamp } from "firebase/firestore"; // đưa dòng này lên đầu, cùng nhóm import

import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import toast from "react-hot-toast";

import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

function TodoApp({ user }) {
  const [todayOpen, setTodayOpen] = useState(true);
  const [weekOpen, setWeekOpen] = useState(true);
  const [showFilters, setShowFilters] = useState(false);


  const [priorityFilter, setPriorityFilter] = useState("all");

  const [input, setInput] = useState("");
  const [deadlineAlertShown, setDeadlineAlertShown] = useState(false);

  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState(2);
  const [filter, setFilter] = useState("all");
  const [todos, setTodos] = useState([]);
  const [notifiedIds, setNotifiedIds] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const todosRef = collection(db, "todos");

  useEffect(() => {
  if (!user) return;

  const q = query(
    todosRef,
    where("userId", "==", user.uid), // truy vấn đúng user
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 👉 THÊM 2 DÒNG SAU:
    console.log("✅ user.uid:", user.uid);
    console.log("📦 Dữ liệu Firestore trả về:", items);

    setTodos(items);
  });

  return () => unsubscribe();
}, [user?.uid]);

useEffect(() => {
  // Mỗi lần đăng nhập lại thì cho phép hiển thị lại thông báo
  setDeadlineAlertShown(false);
}, [user?.uid]);


useEffect(() => {
  if (deadlineAlertShown || todos.length === 0) return;

  const now = new Date();
  const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);

  const upcomingTodos = todos.filter((todo) => {
    if (!todo.deadline || todo.done) return false;
    const deadlineDate = todo.deadline.toDate();
    return deadlineDate > now && deadlineDate <= in30Minutes;
  });

  if (upcomingTodos.length > 0) {
    toast(
      `⏰ ${upcomingTodos.length} việc sắp đến hạn ròi kìa:\n${upcomingTodos
        .map((t) => "👉 " + t.text)
        .join("\n")}`
    );
  }

  setDeadlineAlertShown(true);
}, [todos, deadlineAlertShown]);




  const todosToday = todos
    .filter((todo) => {
      if (!todo.deadline) return false;
      const deadlineDate = todo.deadline.toDate();
      const today = new Date();
      return (
        deadlineDate.getDate() === today.getDate() &&
        deadlineDate.getMonth() === today.getMonth() &&
        deadlineDate.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const handleAdd = async () => {
  if (!input.trim()) return alert("❌ Bạn chưa nhập nội dung công việc");

  try {
    await addDoc(todosRef, {
      text: input.trim(),
      userId: user.uid,
      createdAt: serverTimestamp(), // dùng đúng timestamp
      done: false,
      deadline: deadline ? new Date(deadline) : null,
      priority,
    });

    toast.success("✅ Đã thêm việc mới vào MiniPlan!");

    setInput("");
    setDeadline("");
    setPriority(2);
  } catch (error) {
    console.error("🔥 Lỗi khi thêm công việc:", error);
    alert("❌ Lỗi khi thêm công việc");
  }
};


  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    const docRef = doc(db, "todos", id);
    await updateDoc(docRef, {
      text: editText.trim(),
    });
    setEditId(null);
    setEditText("");
  };

  const toggleDone = async (todo) => {
    const ref = doc(db, "todos", todo.id);
    await updateDoc(ref, {
      done: !todo.done,
    });
  };


  const todosThisWeek = todos
  .filter((todo) => {
    if (!todo.deadline) return false;
    const now = new Date();
    const deadlineDate = todo.deadline.toDate();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    return deadlineDate >= now && deadlineDate <= nextWeek;
  })
  .sort((a, b) => (b.priority || 0) - (a.priority || 0));


  return (
  <div className="min-h-screen p-4 bg-gradient-to-br from-pink-50 to-blue-50 text-black relative">
    
    <div className="relative mb-4">
  

  <div className="flex flex-col items-center gap-2 mb-4">


  <h1 className="text-4xl font-bold text-center text-blue-600">
  Chào mừng đến với MiniPlan 🎯
</h1>




</div>
</div>


      <p className="text-center text-gray-600 mb-6">
        MiniPlan là ứng dụng giúp bạn lập kế hoạch mỗi ngày, hoàn thành mục tiêu dễ dàng và theo dõi tiến độ công việc.
      </p>

  <button
  onClick={() => {
    signOut(auth).then(() => {
      window.location.href = "/";
    });
  }}
  className="bg-white border border-gray-300 px-3 py-1 rounded-xl text-gray-700 shadow hover:bg-gray-100 hover:text-blue-600 transition fixed top-4 right-4 z-50"
>
  ← Trang chủ
</button>



   <div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-md border border-gray-200 mb-4">
  <h3
    className="text-lg font-bold mb-2 cursor-pointer flex justify-between items-center"
    onClick={() => setTodayOpen(!todayOpen)}
  >
    📅 Việc cần làm hôm nay
    <span className="ml-2">{todayOpen ? "▲" : "▼"}</span>
  </h3>

  <div
    className={`overflow-hidden transition-all duration-300 ${
      todayOpen ? "max-h-[1000px]" : "max-h-0"
    }`}
  >
    {todosToday.filter((todo) => !todo.done).length === 0 ? (
      <p className="text-gray-600">Không có công việc nào hạn hôm nay 🎉</p>
    ) : (
      <ul className="space-y-1">
        {todosToday
          .filter((todo) => !todo.done)
          .map((todo) => (
            <li key={todo.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo)}
                className="cursor-pointer"
              />
              <span>
                {todo.text}
                {todo.priority === 3 && " 🔴"}
                {todo.priority === 2 && " 🟡"}
                {todo.priority === 1 && " ⚪"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {todo.deadline &&
                new Date(todo.deadline.seconds * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>

            </li>
          ))}
      </ul>
    )}
  </div>
</div>




<div className="bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-md border border-gray-200 mb-4">
  <h3
    className="text-lg font-bold mb-2 cursor-pointer flex justify-between items-center"
    onClick={() => setWeekOpen(!weekOpen)}
  >
    🗓️ Mục tiêu tuần này!
    <span className="ml-2">{weekOpen ? "▲" : "▼"}</span>
  </h3>

  <div
    className={`overflow-hidden transition-all duration-300 ${
      weekOpen ? "max-h-[1000px]" : "max-h-0"
    }`}
  >
    {todosThisWeek.length === 0 ? (
      <p className="text-gray-600">Không có việc nào trong tuần này ✌️</p>
    ) : (
      <ul className="space-y-1">
        {todosThisWeek.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(todo)}
              className="cursor-pointer"
            />
            <span>
              {todo.text}
              {todo.priority === 3 && " 🔴"}
              {todo.priority === 2 && " 🟡"}
              {todo.priority === 1 && " ⚪"}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {todo.deadline &&
              new Date(todo.deadline.seconds * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </span>

          </li>
        ))}
      </ul>
    )}
  </div>
</div>





      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="border p-2 rounded w-full sm:flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập việc cần làm..."
        />

        <div className="relative w-full sm:w-60">
  <input
    type="datetime-local"
    value={deadline}
    onChange={(e) => setDeadline(e.target.value)}
    className="border p-2 rounded w-full pr-10 appearance-none"
  />
<span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none block sm:hidden">

    📅
  </span>
</div>




        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="border p-2 rounded w-full sm:w-40"
        >
          <option value={1}>⚪ Thấp</option>
          <option value={2}>🟡 Vừa</option>
          <option value={3}>🔴 Cao</option>
        </select>

        <button
  type="button"
  onClick={handleAdd}
  className="z-50 relative bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition transform hover:scale-105 active:scale-95"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  Thêm công việc
</button>




      </div>

      {/* Nút toggle hiện/ẩn filter */}
<button
  onClick={() => setShowFilters(!showFilters)}
  className="bg-gray-300 px-3 py-2 rounded mb-2 hover:bg-gray-400 transition"
>
  🔍 Bộ lọc {showFilters ? "▲" : "▼"}
</button>

{/* Bộ lọc, ẩn khi showFilters = false */}
<div
  className={`overflow-hidden transition-all duration-300 ${
    showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
  <div className="flex flex-col sm:flex-row gap-2 mb-4">
    <button
      onClick={() => setFilter("all")}
      className={`px-3 py-2 rounded w-full sm:w-auto ${
        filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      📋 Tất cả
    </button>
    <button
      onClick={() => setFilter("notdone")}
      className={`px-3 py-2 rounded w-full sm:w-auto ${
        filter === "notdone" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      🕓 Chưa làm
    </button>
    <button
      onClick={() => setFilter("done")}
      className={`px-3 py-2 rounded w-full sm:w-auto ${
        filter === "done" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      ✅ Hoàn thành
    </button>
  </div>

  <div className="flex flex-col sm:flex-row gap-2 mb-4">
    <button
      onClick={() => setPriorityFilter("all")}
      className={`px-3 py-2 rounded w-full sm:w-auto ${
        priorityFilter === "all" ? "bg-purple-500 text-white" : "bg-gray-200"
      }`}
    >
      🔍 Tất cả ưu tiên
    </button>
    <button
      onClick={() => setPriorityFilter("3")}
      className={`px-3 py-2 rounded w-full sm:w-auto ${
        priorityFilter === "3" ? "bg-red-500 text-white" : "bg-gray-200"
      }`}
    >
      🔴 Cao
    </button>
    <button
      onClick={() => setPriorityFilter("2")}
      className={`px-3 py-2 rounded w-full sm:w-auto ${
        priorityFilter === "2" ? "bg-yellow-500 text-white" : "bg-gray-200"
      }`}
    >
      🟡 Vừa
    </button>
    <button
      onClick={() => setPriorityFilter("1")}
      className={`px-3 py-2 rounded w-full sm:w-auto ${
        priorityFilter === "1" ? "bg-gray-400 text-white" : "bg-gray-200"
      }`}
    >
      ⚪ Thấp
    </button>
  </div>
</div>

{/* Todo list, filter vẫn áp dụng như cũ */}
<ul className="space-y-2">
  {todos
    .filter((todo) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "done"
          ? todo.done
          : !todo.done;

      const matchPriority =
        priorityFilter === "all"
          ? true
          : String(todo.priority) === String(priorityFilter);

      return matchFilter && matchPriority;
    })
    .map((todo) => (
      <li
        key={todo.id}
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-100 px-4 py-3 rounded text-base transition-all duration-300 ease-in-out hover:scale-[1.02] ${
          todo.done ? "opacity-50 line-through" : ""
        }`}
      >
        <div className="flex-1">
          <p>
            {todo.text}
            {todo.priority === 3 && " 🔴"}
            {todo.priority === 2 && " 🟡"}
            {todo.priority === 1 && " ⚪"}
          </p>
          {todo.deadline && (
            <p className="text-sm text-gray-500">
              ⏰ {new Date(todo.deadline.seconds * 1000).toLocaleString("vi-VN")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleDone(todo)}
            className="text-sm bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
          >
            {todo.done ? "↩️ Hoàn tác" : "✅ Hoàn thành"}
          </button>
          <button
            onClick={() => handleEdit(todo)}
            className="text-sm bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded"
          >
            ✏️ Sửa
          </button>
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-sm bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
          >
            🗑️ Xoá
          </button>
        </div>

        {editId === todo.id && (
          <div className="mt-2 w-full">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="border p-1 rounded w-full"
            />
            <button
              onClick={() => handleUpdate(todo.id)}
              className="mt-1 bg-green-500 text-white px-2 py-1 rounded"
            >
              💾 Lưu
            </button>
          </div>
        )}
      </li>
    ))}
</ul>






      <footer className="text-center text-gray-400 text-sm mt-10">
        © 2025 MiniPlan. Đạt mục tiêu dễ dàng mỗi ngày - sáng lập bởi Nguyên Phát
      </footer>
    </div>
  );
}

export default TodoApp;