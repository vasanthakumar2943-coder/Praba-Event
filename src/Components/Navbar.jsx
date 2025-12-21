import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../index.css";

import adminLogo from "../assets/images/admin.png";

import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pin, setPin] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [bookingCount, setBookingCount] = useState(0);

  /* 🔐 logo click counter */
  const [adminClicks, setAdminClicks] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  /* =======================
     THEME
  ======================= */
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* =======================
     ADMIN LOGIN CHECK
  ======================= */
  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    setLoggedIn(auth === "true");
  }, []);

  /* =======================
     BOOKING COUNT
  ======================= */
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const snap = await getDocs(collection(db, "bookings"));
        setBookingCount(snap.size);
      } catch {}
    };

    loadBookings();
    const id = setInterval(loadBookings, 10000);
    return () => clearInterval(id);
  }, [location.pathname]);

  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");

  /* =======================
     LOGO → 5 CLICKS → PIN POPUP
  ======================= */
  const handleAdminLogoClick = () => {
    setAdminClicks((prev) => {
      const next = prev + 1;

      if (next >= 5) {
        setShowLoginModal(true); // ✅ OLD LOGIC
        return 0;
      }

      return next;
    });

    // reset click count if user pauses
    setTimeout(() => {
      setAdminClicks(0);
    }, 2000);
  };

  /* =======================
     ADMIN LOGIN (UNCHANGED)
  ======================= */
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
    } catch {
      toast.error("Login failed ❌");
    }
  };

  /* =======================
     LOGOUT
  ======================= */
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

    { label: "Contact", link: "/contact" },
  ];

  return (
    <>
      <nav className="glass-nav navbar reveal">

        {/* LEFT SIDE */}
        <div className="nav-left">
          {/* ADMIN LOGO (SECRET) */}
          <img
            src={adminLogo}
            alt="Admin"
            className="admin-logo-btn"
            onClick={handleAdminLogoClick}
          />


          <div className="nav-logo">Praba Event's</div>
        </div>

        {/* HAMBURGER */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* MENU */}
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

          {/* ADMIN DASHBOARD */}
          {loggedIn && (
            <li>
              <Link
                to="/admin"
                className="nav-link notif-icon"
                onClick={() => setMenuOpen(false)}
              >
                <span className="icon-bell">🔔</span>
                {bookingCount > 0 && (
                  <span className="badge glass-badge">
                    {bookingCount}
                  </span>
                )}
              </Link>
            </li>
          )}

          {/* THEME TOGGLE */}
          <li>
            <button
              className="icon-btn glass-btn"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
          </li>

          {/* LOGOUT ONLY (NO CROWN) */}
          {loggedIn && (
            <li>
              <button
                className="icon-btn glass-btn"
                onClick={handleLogout}
              >
                🔓
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-box glass-box fade-in">
            <button
              className="close-btn"
              onClick={() => setShowLoginModal(false)}
            >
              ✖
            </button>

            <h3>Admin Login</h3>

            <input
              type="password"
              className="form-control"
              placeholder="Enter Admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <button
              className="confirm-btn glow"
              onClick={handleAdminLogin}
            >
              Login ✔
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
