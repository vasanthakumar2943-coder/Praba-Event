// Firebase core
import { initializeApp } from "firebase/app";

// Firestore Database
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtlZjMar-MzR-Ly22OCI3a8qfd7ih0cCo",
  authDomain: "praba-events.firebaseapp.com",
  projectId: "praba-events",
  storageBucket: "praba-events.firebasestorage.app",
  messagingSenderId: "443665480458",
  appId: "1:443665480458:web:2d1f8872cd8092ca058f3",
  measurementId: "G-SGV7JWTY8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);
