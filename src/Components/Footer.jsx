import React from "react";
import "../index.css";

function Footer() {
  return (
    <footer className="footer fade-in">
      <div className="footer-container">

        {/* BRAND / LOGO */}
        <div className="footer-section">
          <h2 className="footer-logo">Praba Event's</h2>
          <p>Your trusted partner for unforgettable celebrations 🎉</p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 Tamil Nadu, India</p>
          <p>📞 +91 XXXXXXXXXX</p>
          <p>📧 prabaevents@gmail.com</p>

          {/* SOCIAL ICONS */}
          <div className="footer-social">
            <a href="https://wa.me/+91XXXXXXXXXX" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Praba Event's — All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
