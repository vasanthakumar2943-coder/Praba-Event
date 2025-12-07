import useReveal from "../hooks/useReveal";
import "../index.css";

function About() {
  useReveal();

  return (
    <div>

      {/* ⭐ ABOUT HERO SECTION */}
      <section className="about-hero reveal" style={{ textAlign: "center", paddingTop: "40px" }}>
        <h1 className="section-title">About Praba Events</h1>
        <p className="about-subtitle">
          Crafting unforgettable experiences with passion, creativity, and precision.
        </p>
      </section>

      {/* ⭐ WHO WE ARE */}
      <section className="about-section reveal">
        <h2 className="section-heading">Who We Are</h2>
        <p className="about-text">
          Praba Events is a professional event management company dedicated to delivering
          beautifully planned and flawlessly executed events. From intimate celebrations
          to large-scale functions, we blend creativity with perfection to turn your
          moments into memories.  
        </p>
        <p className="about-text">
          Our team combines years of experience with innovative ideas, ensuring that every
          client receives a unique and customized experience. Whether it's a wedding,
          birthday, corporate meet, or cultural program — we bring your vision to life with
          passion and commitment.
        </p>
      </section>

      {/* ⭐ OUR MISSION & VALUES */}
      <section className="about-section reveal">
        <h2 className="section-heading">Our Mission</h2>
        <p className="about-text">
          To deliver exceptional event experiences through seamless planning, creative designs,
          and world-class execution — making every celebration memorable and stress-free.
        </p>

        <h2 className="section-heading" style={{ marginTop: "25px" }}>
          Our Core Values
        </h2>
        <ul className="about-list">
          <li>🎯 **Professionalism** – Every event is handled with expert precision.</li>
          <li>💡 **Creativity** – Unique ideas tailored to each client’s style.</li>
          <li>🤝 **Commitment** – We deliver what we promise, beyond expectations.</li>
          <li>✨ **Quality** – From décor to service, excellence in every detail.</li>
          <li>📅 **Timeliness** – On-time planning, on-time execution. Always.</li>
        </ul>
      </section>

      {/* ⭐ WHY CHOOSE US */}
      <section className="about-section reveal">
        <h2 className="section-heading">Why Choose Praba Events?</h2>

        <div className="why-grid">
          <div className="why-card">
            <h3>Experienced Team</h3>
            <p>Our professionals handle every event with skill and precision.</p>
          </div>
          <div className="why-card">
            <h3>End-to-End Service</h3>
            <p>We manage décor, planning, coordination, and execution — smoothly.</p>
          </div>
          <div className="why-card">
            <h3>Affordable Packages</h3>
            <p>Premium quality events at budget-friendly prices.</p>
          </div>
          <div className="why-card">
            <h3>Creative Concepts</h3>
            <p>Unique themes and ideas crafted specially for your occasion.</p>
          </div>
        </div>
      </section>

      {/* ⭐ OUR COMMITMENT */}
      <section className="about-section reveal" style={{ textAlign: "center" }}>
        <h2 className="section-heading">Our Commitment to You</h2>
        <p className="about-text">
          At Praba Events, your celebration is our responsibility.
          We ensure a stress-free experience, flawless execution,
          and unforgettable memories — every single time.
        </p>
      </section>

    </div>
  );
}

export default About;
