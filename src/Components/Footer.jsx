import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Footer() {
  // Scroll page to top on quick link click
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Footer fade-in animation
  useEffect(() => {
    const footer = document.querySelector(".footer-animate");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) footer.classList.add("show");
      },
      { threshold: 0.2 }
    );
    observer.observe(footer);
  }, []);

  return (
    <footer className="footer glass-footer footer-animate">
      <div className="footer-content">

        {/* BRAND */}
        <div>
          <h3 className="footer-logo">Praba Event's</h3>
          <p>
            Crafting unforgettable experiences with elegance, passion, and perfection.
          </p>

          {/* SOCIAL ICONS */}
          <div className="footer-social">

            {/* Instagram */}
            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>

          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/" onClick={scrollTop}>Home</Link></li>
            <li><Link to="/events" onClick={scrollTop}>Events</Link></li>
            <li><Link to="/services" onClick={scrollTop}>Services</Link></li>
            <li><Link to="/projects" onClick={scrollTop}>Projects</Link></li>
            <li><Link to="/contact" onClick={scrollTop}>Contact</Link></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h4>Contact Us</h4>

          <p><i className="fa-solid fa-phone"></i> &nbsp; +91 98765 43210</p>
          <p><i className="fa-solid fa-envelope"></i> &nbsp; contact@prabaevents.com</p>
          <p><i className="fa-solid fa-location-dot"></i> &nbsp; Coimbatore, Tamil Nadu</p>
        </div>

        {/* SUBSCRIBE SECTION */}
        <div>
          <h4>Stay Connected</h4>
          <p>Sign up to receive updates on new events, offers, and exclusive packages.</p>

          <input
            type="email"
            placeholder="Enter your email"
            className="footer-input"
          />

          <button className="btn glow footer-btn">
            Send
          </button>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        © 2025 Praba Event’s. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;
