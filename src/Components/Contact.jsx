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

        {/* 1️⃣ PHONE */}
        <div className="contact-card zoom-in">
          <FaPhoneAlt size={28} color="#00eaff" style={{ marginBottom: "10px" }} />
          <h3 style={{ marginBottom: "6px" }}>Call Us</h3>

          <p className="contact-info">+91 98765 43210</p>

          <a href="tel:+919876543210" className="contact-btn">
            Call Now
          </a>
        </div>

        {/* 2️⃣ WHATSAPP */}
        <div className="contact-card zoom-in">
          <FaWhatsapp size={32} color="#25D366" style={{ marginBottom: "10px" }} />
          <h3 style={{ marginBottom: "6px" }}>Chat on WhatsApp</h3>

          <p className="contact-info">Available 24/7</p>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
          >
            Message Now
          </a>
        </div>

        {/* 3️⃣ EMAIL */}
        <div className="contact-card zoom-in">
          <FaEnvelope size={32} color="#00eaff" style={{ marginBottom: "10px" }} />
          <h3 style={{ marginBottom: "6px" }}>Email</h3>

          <p className="contact-info">contact@prabaevents.com</p>

          <a href="mailto:contact@prabaevents.com" className="contact-btn">
            Send Email
          </a>
        </div>

        {/* 4️⃣ LOCATION */}
        <div className="contact-card zoom-in">
          <FaMapMarkerAlt size={32} color="#ff4d4d" style={{ marginBottom: "10px" }} />
          <h3 style={{ marginBottom: "6px" }}>Location</h3>

          <p className="contact-info">Coimbatore, Tamil Nadu</p>

          <a href="#map" className="contact-btn">
            View Map
          </a>
        </div>

      </div>

      {/* CONTACT FORM */}
      <form className="contact-form slide-up" onSubmit={handleSubmit}>

        <input
          type="text"
          className="form-input"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />

        <input
          type="tel"
          className="form-input"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          required
        />

        <textarea
          className="form-textarea"
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
        />

        <button className="contact-btn glow" type="submit">
          Send Message
        </button>
      </form>

      {/* MAP */}
      <div id="map" className="map-container mt-24">
        <iframe
          title="map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15674.456!2d76.967!3d11.001!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba857faaa...">
        </iframe>
      </div>

    </div>
  );
}

export default Contact;
