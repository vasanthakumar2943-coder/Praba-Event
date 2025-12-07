import "../index.css";
import { useState } from "react";
import { toast } from "react-toastify";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill all fields!");
      return;
    }

    const phoneNumber = `91${form.phone.replace(/\D/g, "")}`;

    const msg = `📩 New Contact Message
Name: ${form.name}
Phone: ${form.phone}
Message: ${form.message}`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    toast.success("Message sent on WhatsApp ✔");

    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="page-section fade-in">
      <h2 className="section-title">Contact Us</h2>
      <p className="contact-subtitle">We’d love to hear from you! Reach out anytime.</p>

      {/* CONTACT OPTIONS */}
      <div className="contact-section">
        <div className="contact-grid">

          {/* 📞 Phone */}
          <div className="contact-card glass-card">
            <h3>Call Us</h3>
            <p className="contact-info">Need quick assistance? Call us directly.</p>
            <a href="tel:+919876543210" className="contact-btn">
              📞 Call Now
            </a>
          </div>

          {/* 💬 WhatsApp */}
          <div className="contact-card glass-card">
            <h3>WhatsApp</h3>
            <p className="contact-info">Chat instantly with our support team.</p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              className="contact-btn"
            >
              💬 Chat Now
            </a>
          </div>

          {/* 📷 Instagram */}
          <div className="contact-card glass-card">
            <h3>Instagram</h3>
            <p className="contact-info">Follow us for event updates and work.</p>
            <a
              href="https://instagram.com/praba_events"
              target="_blank"
              className="contact-btn"
            >
              📷 Follow Us
            </a>
          </div>

        </div>

        {/* CONTACT FORM */}
        <h3 className="section-title" style={{ marginTop: "35px" }}>Send Us a Message</h3>

        <form className="contact-form glass-card" onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="form-input"
            type="tel"
            placeholder="WhatsApp Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <textarea
            className="form-textarea"
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          ></textarea>

          <button type="submit" className="contact-btn" style={{ width: "100%" }}>
            Send Message ✔
          </button>
        </form>

        {/* GOOGLE MAP */}
        <div className="map-container">
          <iframe
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.46251424675!2d77.960967!3d10.996178"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
