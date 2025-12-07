import "../index.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="glass-footer fade-in">
      <div className="footer-content">

        {/* BRAND */}
        <div>
          <h2 className="footer-logo">Praba Event's</h2>
          <p className="footer-text">
            We transform your special moments into unforgettable memories.
            Professional event planning, decorations & photography services.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/history">Booking History</Link></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h3 className="footer-heading">Contact</h3>
          <p className="footer-contact">📞 +91 98765 43210</p>
          <p className="footer-contact">📩 prabaevents@gmail.com</p>
          <p className="footer-contact">📍 Tamil Nadu, India</p>

          {/* SOCIAL ICONS */}
          <div className="footer-social">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              className="footer-icon"
            >
              💬
            </a>

            <a
              href="https://instagram.com/praba_events"
              target="_blank"
              className="footer-icon"
            >
              📷
            </a>

            <a
              href="mailto:prabaevents@gmail.com"
              className="footer-icon"
            >
              ✉️
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Praba Event's — All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
