import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="fade-in">

      {/* ============================
          HERO SECTION
      ============================ */}
      <section className="page-section" style={{ paddingTop: "100px" }}>
        <div className="container">

          <div className="main-hero">

            {/* LEFT TEXT */}
            <div className="hero-left slide-up">
              <h1
                style={{
                  fontSize: "44px",
                  fontWeight: "700",
                  color: "#00eaff",
                  marginBottom: "12px",
                  fontFamily: "Times New Roman",
                }}
              >
                Make Your Events Memorable 🎉
              </h1>

              <p
                style={{
                  fontSize: "1.1rem",
                  opacity: 0.85,
                  maxWidth: "540px",
                  lineHeight: "1.55",
                }}
              >
                We bring your dream event to life with creativity, passion and
                precision. From weddings to corporate events, we deliver the
                experience you imagine.
              </p>

              <Link to="/events" className="btn glow mt-24">
                Explore Events
              </Link>
            </div>

            {/* RIGHT SLIDER */}
            <div className="hero-right fade-in">
              <div className="flip-slider-container">
                <div className="flip-track" id="flip-track">
                  {/* Replace images as needed */}
                  {[1, 2, 3, 4].map((n) => (
                    <div className="flip-card" key={n}>
                      <div className="flip-inner">
                        <div className="flip-front">
                          <img
                            src={`https://picsum.photos/seed/${n}/500/300`}
                            alt="event"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className="flip-back">
                          <h3>Premium Event</h3>
                          <p style={{ marginTop: 6 }}>Make it unforgettable</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================
          OUR SERVICES PREVIEW
      ============================ */}
      <section className="page-section">
        <h2 className="section-title">Our Services</h2>
        <p className="section-sub">
          From planning to execution, we offer everything for your perfect event.
        </p>

        <div className="services-grid fade-in" style={{ marginTop: "30px" }}>
          <div className="service-card zoom-in">
            <i className="fa-solid fa-champagne-glasses service-icon"></i>
            <h3 className="service-title">Wedding Planning</h3>
            <p className="service-desc">
              Beautiful, memorable and stress-free weddings handled with love.
            </p>
          </div>

          <div className="service-card zoom-in">
            <i className="fa-solid fa-music service-icon"></i>
            <h3 className="service-title">DJ & Music Setup</h3>
            <p className="service-desc">
              Professional sound systems and DJs for all occasions.
            </p>
          </div>

          <div className="service-card zoom-in">
            <i className="fa-solid fa-cake-candles service-icon"></i>
            <h3 className="service-title">Birthday Events</h3>
            <p className="service-desc">
              Celebrate birthdays with unique themes & joyful arrangements.
            </p>
          </div>
        </div>

        <Link to="/services" className="btn glow mt-24">
          View All Services
        </Link>
      </section>

      {/* ============================
          EVENT HIGHLIGHTS
      ============================ */}
      <section className="page-section">
        <h2 className="section-title">Event Highlights</h2>
        <p className="section-sub">
          A glimpse of our best creations — crafted with passion & precision.
        </p>

        <div className="event-container fade-in">
          {[1, 2, 3].map((n) => (
            <div className="event-card zoom-in" key={n}>
              <img
                src={`https://picsum.photos/seed/highlight${n}/500/300`}
                className="event-img"
                alt="highlight"
              />
              <div className="event-content">
                <h3 className="event-title">Premium Event #{n}</h3>
                <p className="event-price">Starting ₹9,999</p>
                <Link to="/events" className="btn glow mt-8">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================
          ABOUT PREVIEW
      ============================ */}
      <section className="page-section">
        <h2 className="section-title">Why Choose Us?</h2>

        <div className="about-section slide-up">
          <p className="about-text">
            Praba Events is known for delivering premium, customized and
            unforgettable events. With years of experience, we bring the best
            creativity and professionalism together.
          </p>

          <Link to="/about" className="btn glow mt-24">
            Know More
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
