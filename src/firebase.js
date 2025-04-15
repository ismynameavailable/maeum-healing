// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAXg2PUQBuGpZFRGz4ziQrROEN68Hvoe8o",
  authDomain: "maeum-healing.firebaseapp.com",
  projectId: "maeum-healing",
  storageBucket: "maeum-healing.firebasestorage.app",
  messagingSenderId: "521244487900",
  appId: "1:521244487900:web:f32a9df897008357928419",
  measurementId: "G-5TB21DP8KK",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
