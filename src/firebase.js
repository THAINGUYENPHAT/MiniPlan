// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { auth, db, messaging };
