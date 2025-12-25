import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Footer() {
  // Scroll AFTER navigation (important)
  const handleLinkClick = () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // Footer fade-in animation
  useEffect(() => {
    const footer = document.querySelector(".footer-animate");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) footer.classList.add("show");
      },
      { threshold: 0.2 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
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
            <a href="https://instagram.com/praba_events_paranji" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a href="https://wa.me/917094325920" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp"></i>
            </a>

            <a href="https://facebook.com/praba.raman.58" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/events" onClick={handleLinkClick}>Events</Link></li>
            <li><Link to="/services" onClick={handleLinkClick}>Services</Link></li>
            <li><Link to="/projects" onClick={handleLinkClick}>Projects</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h4>Contact Us</h4>
          <p><i className="fa-solid fa-phone"></i> &nbsp; +91 70943 25902</p>
          <p><i className="fa-solid fa-envelope"></i> &nbsp; contact@prabaevents.com</p>
          <p><i className="fa-solid fa-location-dot"></i> &nbsp; Paranji, Arakkonam, Tamil Nadu</p>
        </div>

        {/* SUBSCRIBE */}
        <div>
          <h4>Stay Connected</h4>
          <p>Sign up to receive updates on new events, offers, and exclusive packages.</p>

          <input
            type="email"
            placeholder="Enter your email"
            className="footer-input"
          />

          <button className="btn glow footer-btn">Send</button>
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
