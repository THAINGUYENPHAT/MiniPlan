// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBl7K6FRMpFfz2agHgYMTtVEDO4jYKShkM",
  authDomain: "miniplan-c5a98.firebaseapp.com",
  projectId: "miniplan-c5a98",
  storageBucket: "miniplan-c5a98.appspot.com",
  messagingSenderId: "949099112960",
  appId: "1:949099112960:web:6b0aac7ffb067d25dac6e5",
  measurementId: "G-18K9EZK1GK"
};

// Khởi tạo app Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Firestore
const db = getFirestore(app);

// Messaging (chỉ chạy nếu trình duyệt hỗ trợ Notification)
let messaging = null;
if (typeof window !== "undefined" && "Notification" in window) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn("Không thể khởi tạo Messaging:", err);
  }
}

export { auth, googleProvider, facebookProvider, db, messaging };
