import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmzUB_ECCE5rbQ1Rj1fbin3NSoh3-8-Xc",
  authDomain: "gov-e-a6087.firebaseapp.com",
  projectId: "gov-e-a6087",
  storageBucket: "gov-e-a6087.firebasestorage.app",
  messagingSenderId: "381666375877",
  appId: "1:381666375877:web:cc22495eab30628d5d58ac",
  measurementId: "G-9KS6YRJBCN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
