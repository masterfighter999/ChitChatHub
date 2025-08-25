
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "chitchathub-aic5j",
  appId: "1:803075544236:web:d3ad3f69d86fb05f907b09",
  storageBucket: "chitchathub-aic5j.firebasestorage.app",
  apiKey: "AIzaSyDJEnLz8Syyr0ctY9tEtR7YSc9uJj4ySPc",
  authDomain: "chitchathub-aic5j.firebaseapp.com",
  messagingSenderId: "803075544236",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
