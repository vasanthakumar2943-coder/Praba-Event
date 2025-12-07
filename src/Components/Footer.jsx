import React from "react";
import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer fade-in">
      <div className="footer-content">

        {/* Brand */}
        <div>
          <h2 className="footer-logo">Praba Event's</h2>
          <p style={{ opacity: 0.85 }}>
            Creating unforgettable moments with love, passion, and perfection.
          </p>

          <div className="footer-social" style={{ marginTop: "14px" }}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <FaInstagram />
            </a>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
            >
              <FaWhatsapp />
            </a>

            <a href="tel:+919876543210" className="footer-icon">
              <FaPhoneAlt />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="footer-heading">Contact Us</h3>

          <p className="footer-links" style={{ marginBottom: "10px" }}>
            <FaPhoneAlt style={{ marginRight: 8 }} /> +91 98765 43210
          </p>

          <p className="footer-links" style={{ marginBottom: "10px" }}>
            <FaEnvelope style={{ marginRight: 8 }} /> contact@prabaevents.com
          </p>

          <p className="footer-links" style={{ marginBottom: "10px" }}>
            <FaMapMarkerAlt style={{ marginRight: 8 }} /> Coimbatore, Tamil Nadu
          </p>
        </div>

        {/* Newsletter / Stay Connected */}
        <div>
          <h3 className="footer-heading">Stay Updated</h3>

          <p style={{ opacity: 0.85 }}>
            Get updates on new events, offers & packages.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            className="form-input"
            style={{ marginTop: "10px" }}
          />

          <button className="contact-btn glow" style={{ marginTop: "10px" }}>
            Subscribe
          </button>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Praba Event’s. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
