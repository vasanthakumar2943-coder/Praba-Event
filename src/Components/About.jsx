import React from "react";

function About() {
  return (
    <div className="page-section fade-in">

      {/* TITLE */}
      <h2 className="section-title">About Us</h2>
      <p className="section-sub">
        Creating memorable events with passion, creativity & unmatched perfection.
      </p>

      {/* ABOUT SECTION */}
      <div className="about-section slide-up">

        <p className="about-text">
          At <strong>Praba Event’s</strong>, we believe every occasion deserves to be 
          unforgettable. With years of expertise in event management, we specialize in 
          transforming ordinary moments into extraordinary memories. Our team handles 
          everything from décor, lighting, entertainment, stage setup, venue design, 
          and complete event coordination — ensuring a seamless experience from start to finish.
        </p>

        <p className="about-text" style={{ marginTop: "14px" }}>
          Whether it’s a wedding, reception, birthday celebration, corporate event, 
          cultural program, or private gathering — we create stunning experiences 
          tailored to your vision.
        </p>
      </div>

      {/* WHY CHOOSE US */}
      <h2 className="section-title" style={{ marginTop: "40px" }}>Why Choose Us?</h2>

      <div className="why-grid fade-in">

        <div className="why-card zoom-in">
          <i
            className="fa-solid fa-star"
            style={{ fontSize: "2rem", color: "#00eaff", marginBottom: "10px" }}
          ></i>
          <h3>Professional Team</h3>
          <p style={{ opacity: 0.85, marginTop: "6px" }}>
            Experienced planners and designers dedicated to creating premium events.
          </p>
        </div>

        <div className="why-card zoom-in">
          <i
            className="fa-solid fa-wand-magic-sparkles"
            style={{ fontSize: "2rem", color: "#00eaff", marginBottom: "10px" }}
          ></i>
          <h3>Creative Designs</h3>
          <p style={{ opacity: 0.85, marginTop: "6px" }}>
            Unique décor themes crafted to match your dream and personality.
          </p>
        </div>

        <div className="why-card zoom-in">
          <i
            className="fa-solid fa-thumbs-up"
            style={{ fontSize: "2rem", color: "#00eaff", marginBottom: "10px" }}
          ></i>
          <h3>Quality Service</h3>
          <p style={{ opacity: 0.85, marginTop: "6px" }}>
            We ensure premium quality in every detail — from décor to execution.
          </p>
        </div>

        <div className="why-card zoom-in">
          <i
            className="fa-solid fa-handshake-simple"
            style={{ fontSize: "2rem", color: "#00eaff", marginBottom: "10px" }}
          ></i>
          <h3>Affordable Packages</h3>
          <p style={{ opacity: 0.85, marginTop: "6px" }}>
            Premium event experiences at budget-friendly, customizable pricing.
          </p>
        </div>

      </div>

    </div>
  );
}

export default About;
