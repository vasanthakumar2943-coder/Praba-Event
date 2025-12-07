import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../index.css";

// Firebase
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pin, setPin] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [bookingCount, setBookingCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Theme handling
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Check login
  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    setLoggedIn(auth === "true");
  }, []);

  // 🔥 Fetch booking count from Firestore
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const snap = await getDocs(collection(db, "bookings"));
        setBookingCount(snap.size);
      } catch (err) {}
    };

    loadBookings();
    const id = setInterval(loadBookings, 10000);
    return () => clearInterval(id);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // 🔥 Admin Login using Firestore
  const handleAdminLogin = async () => {
    try {
      const ref = doc(db, "settings", "admin");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const correctPin = snap.data().pin;

        if (pin === correctPin) {
          localStorage.setItem("admin-auth", "true");
          setLoggedIn(true);
          toast.success("Welcome Admin 🔐");
          setShowLoginModal(false);
          navigate("/admin");
        } else {
          toast.error("Incorrect PIN ❌");
        }
      } else {
        toast.error("Admin PIN not found ⚠️");
      }
    } catch (error) {
      toast.error("Login failed ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setLoggedIn(false);
    toast.info("Logged out");
    navigate("/");
  };

  const menuItems = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Events", link: "/events" },
    { label: "Services", link: "/services" },
    { label: "Projects", link: "/projects" },
    { label: "Contact", link: "/contact" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">Praba Event's</div>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          {menuItems.map((item) => (
            <li key={item.link}>
              <Link
                to={item.link}
                className={`nav-link ${
                  location.pathname === item.link ? "active" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Admin Dashboard bell */}
          {loggedIn && (
            <li>
              <Link
                to="/admin"
                className="nav-link notif-icon"
                onClick={() => setMenuOpen(false)}
              >
                🔔
                {bookingCount > 0 && (
                  <span className="badge">{bookingCount}</span>
                )}
              </Link>
            </li>
          )}

          {/* Theme toggle */}
          <li>
            <button className="icon-btn" onClick={toggleTheme}>
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
          </li>

          {/* Admin login/logout */}
          <li>
            <button
              className="icon-btn"
              onClick={() =>
                loggedIn ? handleLogout() : setShowLoginModal(true)
              }
            >
              {loggedIn ? "🔓" : "👑"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-box fade-in">
            <button className="close-btn" onClick={() => setShowLoginModal(false)}>
              ✖
            </button>
            <h3>Admin Login</h3>

            <input
              type="password"
              placeholder="Enter Admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="form-control"
            />

            <button className="confirm-btn" onClick={handleAdminLogin}>
              Login ✔
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
