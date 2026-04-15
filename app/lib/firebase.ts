import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBYY5HBKGN0T_oAa1umSE_fEfFAB-xhEV4",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "eliteroutes-64237.firebaseapp.com",
  databaseURL:
    env.VITE_FIREBASE_DATABASE_URL ||
    "https://eliteroutes-64237-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "eliteroutes-64237",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "eliteroutes-64237.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1023641397743",
  appId: env.VITE_FIREBASE_APP_ID || "1:1023641397743:web:8b388d33eacbded37eae1a",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
