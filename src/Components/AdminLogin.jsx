import { useState } from "react";
import { toast } from "react-toastify";

function AdminLogin({ onLogin }) {
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    fetch("http://localhost:8080/admin")
      .then(res => res.json())
      .then(data => {
        if (data.pin === pin) {
          localStorage.setItem("adminAuth", "true");
          toast.success("Login Successful 🎉");
          onLogin();
        } else {
          toast.error("Incorrect PIN ❌");
        }
      });
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
