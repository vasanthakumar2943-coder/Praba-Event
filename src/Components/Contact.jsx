import React, { useState } from "react";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div className="page-section fade-in">

      {/* TITLE */}
      <h2 className="section-title">Contact Us</h2>
      <p className="section-sub">
        We are here to make your event memorable. Reach us anytime!
      </p>

      {/* CONTACT GRID */}
      <div className="contact-grid mt-24">

        {/* PHONE */}
        <div className="contact-card zoom-in">
          <FaPhoneAlt size={28} color="#00eaff" style={{ marginBottom: "10px" }} />
          <h3>Call Us</h3>
          <p className="contact-info">+91 98765 43210</p>
          <a href="tel:+919876543210" className="btn glow">Call Now</a>
        </div>

        {/* WHATSAPP */}
        <div className="contact-card zoom-in">
          <FaWhatsapp size={32} color="#25D366" style={{ marginBottom: "10px" }} />
          <h3>Chat on WhatsApp</h3>
          <p className="contact-info">Available 24/7</p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="btn glow"
          >
            Message Now
          </a>
        </div>

        {/* EMAIL */}
        <div className="contact-card zoom-in">
          <FaEnvelope size={32} color="#00eaff" style={{ marginBottom: "10px" }} />
          <h3>Email</h3>
          <p className="contact-info">contact@prabaevents.com</p>
          <a href="mailto:contact@prabaevents.com" className="btn glow">
            Send Email
          </a>
        </div>

        {/* LOCATION */}
        <div className="contact-card zoom-in">
          <FaMapMarkerAlt size={32} color="#ff4d4d" style={{ marginBottom: "10px" }} />
          <h3>Location</h3>
          <p className="contact-info">Coimbatore, Tamil Nadu</p>
          <a href="#" className="btn glow">View Location</a>
        </div>
      </div>

      {/* CONTACT FORM */}
      <form className="contact-form slide-up" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="tel"
          className="form-input"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <textarea
          className="form-input"
          placeholder="Your Message"
          rows="4"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />

        <button className="btn glow" type="submit" style={{ marginTop: "16px" }}>
          Send Message
        </button>
      </form>

    </div>
  );
}

export default Contact;
