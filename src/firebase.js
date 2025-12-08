// Firebase core
import { initializeApp } from "firebase/app";

// Firestore Database
import { getFirestore } from "firebase/firestore";

// ⬇️ NEW: Firebase Storage (for gallery image uploads)
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtlZjMar-MzR-Ly22OCI3a8qfd7ih0cCo",
  authDomain: "praba-events.firebaseapp.com",
  projectId: "praba-events",
  storageBucket: "praba-events.appspot.com",
  messagingSenderId: "443665480458",
  appId: "1:443665480458:web:2d1f8872cd8092ca058f3",
  measurementId: "G-SGV7JWTY8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);

// ⬇️ NEW: Export Storage instance for uploading/deleting images
export const storage = getStorage(app);
