// public/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// PASTE KUNCI FIREBASE KAMU DI SINI
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "proje...",
  projectId: "proje...",
  storageBucket: "proje...",
  messagingSenderId: "...",
  appId: "1:..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);