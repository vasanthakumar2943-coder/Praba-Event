import { useState } from "react";
import { toast } from "react-toastify";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import useReveal from "../hooks/useReveal";

function AdminLogin({ onLogin }) {
  useReveal(); // animation (no logic change)

  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    try {
      const adminRef = doc(db, "settings", "admin");
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const correctPin = adminSnap.data().pin;

        if (correctPin === pin) {
          localStorage.setItem("adminAuth", "true");
          toast.success("Login Successful 🎉");
          onLogin();
        } else {
          toast.error("Incorrect PIN ❌");
        }
      } else {
        toast.error("Admin PIN not set in Firestore ⚠️");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed ❌");
    }
  };

  return (
    <div className="modal-overlay reveal">
      <div className="modal-box admin-login-box">
        <h3 className="admin-title">Admin Login</h3>

        <input
          type="password"
          maxLength="4"
          className="admin-input"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button className="admin-login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
