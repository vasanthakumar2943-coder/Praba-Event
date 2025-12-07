import { useState } from "react";
import { toast } from "react-toastify";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function AdminLogin({ onLogin }) {
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
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Admin Login</h3>
        <input
          type="password"
          maxLength="4"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;
