import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../index.css";

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

  // Booking notification count
  useEffect(() => {
    const fetchBookings = () => {
      fetch("http://localhost:8080/bookings")
        .then((res) => res.json())
        .then((data) => setBookingCount(data.length))
        .catch(() => {});
    };
    fetchBookings();
    const id = setInterval(fetchBookings, 10000);
    return () => clearInterval(id);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleAdminLogin = () => {
    fetch("http://localhost:8080/admin")
      .then((res) => res.json())
      .then((data) => {
        if (pin === data.pin) {
          localStorage.setItem("admin-auth", "true");
          setLoggedIn(true);
          toast.success("Welcome Admin 🔐");
          setShowLoginModal(false);
          setPin("");
          navigate("/admin");
        } else {
          toast.error("Incorrect PIN ❌");
        }
      })
      .catch(() => toast.error("Server error"));
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

          {/* Admin Dashboard bell with booking count */}
          {loggedIn && (
            <li>
              <Link
                to="/admin"
                className="nav-link notif-icon"
                title="Admin Dashboard"
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
            <button
              className="icon-btn"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
          </li>

          {/* Admin login/logout icon */}
          <li>
            <button
              className="icon-btn"
              title={loggedIn ? "Logout" : "Admin Login"}
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
            <button
              className="close-btn"
              onClick={() => setShowLoginModal(false)}
            >
              ✖
            </button>
            <h3>Admin Login</h3>

            <input
              type="password"
              placeholder="Enter Admin PIN"
              className="form-control"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{ margin: "15px 0" }}
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
