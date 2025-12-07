import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBell, FaSun, FaMoon, FaLock } from "react-icons/fa";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Close menu on route change
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("hashchange", closeMenu);
    return () => window.removeEventListener("hashchange", closeMenu);
  }, []);

  // Theme toggle
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">

        {/* LEFT: LOGO */}
        <div className="nav-logo">Praba Event's</div>

        {/* DESKTOP LINKS */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" className="nav-link">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link">About</NavLink>
          </li>
          <li>
            <NavLink to="/events" className="nav-link">Events</NavLink>
          </li>
          <li>
            <NavLink to="/services" className="nav-link">Services</NavLink>
          </li>
          <li>
            <NavLink to="/projects" className="nav-link">Projects</NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav-link">Contact</NavLink>
          </li>
        </ul>

        {/* ICONS ON NAVBAR */}
        <div className="nav-icons">
          <button className="icon-btn"><FaBell /></button>

          <button
            className="icon-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          <NavLink to="/admin">
            <button className="icon-btn"><FaLock /></button>
          </NavLink>
        </div>

        {/* HAMBURGER BUTTON */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

      </nav>

      {/* MOBILE SIDE PANEL */}
      <div className={`mobile-panel ${menuOpen ? "open" : ""}`}>
        <div className="menu">

          <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>

          <NavLink to="/events" className="nav-link" onClick={() => setMenuOpen(false)}>
            Events
          </NavLink>

          <NavLink to="/services" className="nav-link" onClick={() => setMenuOpen(false)}>
            Services
          </NavLink>

          <NavLink to="/projects" className="nav-link" onClick={() => setMenuOpen(false)}>
            Projects
          </NavLink>

          <NavLink to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>

          <div style={{ marginTop: "18px", display: "flex", gap: "14px" }}>
            <button className="icon-btn"><FaBell /></button>

            <button
              className="icon-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
              <button className="icon-btn"><FaLock /></button>
            </NavLink>
          </div>

        </div>
      </div>
    </>
  );
}

export default Navbar;
