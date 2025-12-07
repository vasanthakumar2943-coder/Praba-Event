import "../index.css";

function Footer() {
  return (
    <footer className="footer glass-footer reveal">
      <div className="footer-content">

        {/* BRAND */}
        <div className="footer-section">
          <h2 className="footer-logo">Praba Events</h2>
          <p className="footer-text">
            Creating unforgettable moments with creativity & passion.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>

          <p className="footer-contact">
            📍 Tamil Nadu, India
          </p>
          <p className="footer-contact">
            📞 +91 98765 43210
          </p>
          <p className="footer-contact">
            ✉️ prabaeventsofficial@gmail.com
          </p>

          <div className="footer-social">
            <a href="tel:+919876543210" className="footer-icon">📞</a>
            <a href="https://wa.me/919876543210" target="_blank" className="footer-icon">💬</a>
            <a href="https://instagram.com" target="_blank" className="footer-icon">📸</a>
            <a href="mailto:prabaeventsofficial@gmail.com" className="footer-icon">✉️</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Praba Events — All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
