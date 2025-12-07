import useReveal from "../hooks/useReveal";
import "../index.css";

function Contact() {
  useReveal();

  return (
    <div>

      {/* ⭐ CONTACT HEADER */}
      <section className="contact-hero reveal" style={{ textAlign: "center", paddingTop: "30px" }}>
        <h1 className="section-title">Contact Us</h1>
        <p className="contact-subtitle">
          We’re here to help you plan the perfect event. Reach out anytime!
        </p>
      </section>

      {/* ⭐ CONTACT DETAILS */}
      <section className="contact-section reveal">
        <div className="contact-grid">

          {/* Contact Card 1 */}
          <div className="contact-card">
            <h3>📞 Phone</h3>
            <p className="contact-info">+91 98765 43210</p>
            <button
              className="contact-btn"
              onClick={() => (window.location.href = 'tel:+919876543210')}
            >
              Call Now
            </button>
          </div>

          {/* Contact Card 2 */}
          <div className="contact-card">
            <h3>💬 WhatsApp</h3>
            <p className="contact-info">Chat with us for quick support</p>
            <button
              className="contact-btn"
              onClick={() => (window.location.href = 'https://wa.me/919876543210')}
            >
              Message on WhatsApp
            </button>
          </div>

          {/* Contact Card 3 */}
          <div className="contact-card">
            <h3>📍 Location</h3>
            <p className="contact-info">Tamil Nadu, India</p>
            <button
              className="contact-btn"
              onClick={() => (window.location.href = 'https://maps.google.com')}
            >
              View on Map
            </button>
          </div>

        </div>
      </section>

      {/* ⭐ CONTACT FORM */}
      <section className="contact-section reveal">
        <h2 className="section-heading" style={{ textAlign: "center" }}>Send Us a Message</h2>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" className="form-input" />
          <input type="email" placeholder="Your Email" className="form-input" />
          <input type="text" placeholder="Phone Number" className="form-input" />
          <textarea placeholder="Your Message" className="form-textarea"></textarea>

          <button type="button" className="confirm-btn glow">
            Send Message
          </button>
        </form>
      </section>

      {/* ⭐ MAP SECTION (Optional, Clean UI) */}
      <section className="contact-map reveal">
        <h2 className="section-heading" style={{ textAlign: "center" }}>Find Us</h2>

        <div className="map-container">
          <iframe
            title="location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3..."
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

    </div>
  );
}

export default Contact;
