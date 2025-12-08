import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

function Home() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userBookings, setUserBookings] = useState({ upcoming: [], past: [] });

  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("admin") === "true";

  /* ============================
        AUTO SLIDER
  ============================ */
  useEffect(() => {
    const track = document.getElementById("flipTrack");
    if (!track) return;

    let index = 0;
    const cards = Array.from(track.children);
    const total = cards.length;

    const autoSlide = setInterval(() => {
      index++;
      track.style.transform = `translateX(-${index * 320}px)`;

      if (index >= total / 2) {
        setTimeout(() => {
          track.style.transition = "none";
          index = 0;
          track.style.transform = "translateX(0px)";
          setTimeout(() => {
            track.style.transition = "transform 0.6s ease";
          }, 60);
        }, 600);
      }
    }, 2500);

    return () => clearInterval(autoSlide);
  }, []);

  /* ============================
        LOAD GALLERY IMAGES
  ============================ */
  useEffect(() => {
    async function loadGallery() {
      try {
        const snap = await getDocs(collection(db, "gallery"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setGallery(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  /* ============================
        DELETE GALLERY IMAGE
  ============================ */
  const deleteGalleryItem = async (id, url) => {
    if (!isAdmin) return alert("Only admin can delete images.");
    if (!window.confirm("Delete this image?")) return;

    try {
      await deleteObject(ref(storage, url));
      await deleteDoc(doc(db, "gallery", id));
      setGallery((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ============================
        USER DASHBOARD LOGIC
        (MATCHES BookingHistory.jsx)
  ============================ */
  useEffect(() => {
    const phone = localStorage.getItem("userPhone")?.replace(/\D/g, "");
    const all = JSON.parse(localStorage.getItem("bookings")) || [];

    if (!phone || phone.length !== 10) {
      setUserBookings({ upcoming: [], past: [] });
      return;
    }

    const filtered = all.filter((b) => b.phone === phone);
    const today = new Date().toISOString().split("T")[0];

    const upcoming = filtered.filter((b) => b.date >= today);
    const past = filtered.filter((b) => b.date < today);

    setUserBookings({ upcoming, past });
  }, []);

  /* ============================
        REDIRECT + SCROLL TOP
  ============================ */
  const goTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="fade-in">

      {/* ============================
          HERO SECTION
      ============================ */}
      <section className="page-section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="main-hero">

            {/* LEFT TEXT */}
            <div className="hero-left slide-up" style={{ textAlign: "center", width: "100%" }}>
              <h1
                style={{
                  fontSize: "44px",
                  fontWeight: "700",
                  color: "#00eaff",
                  marginBottom: "12px",
                  fontFamily: "Times New Roman"
                }}
              >
                Make Your Events Memorable 🎉
              </h1>

              <p className="hero-desc">
                We bring your dream event to life with creativity, passion and precision.
              </p>

              <button className="btn glow" onClick={() => goTo("/events")}>
                Explore Events
              </button>
            </div>

            {/* SLIDER */}
            <div className="hero-right fade-in">
              <div className="flip-slider-container">
                <div className="flip-slider-track" id="flipTrack">
                  {[1,2,3,4,1,2,3,4].map((n, i) => (
                    <div className="flip-card" key={i}>
                      <div className="flip-inner">
                        <div className="flip-front">
                          <img
                            src={`https://picsum.photos/seed/${n}/500/300`}
                            alt="event"
                            className="slider-img"
                          />
                        </div>
                        <div className="flip-back">
                          <h3>Premium Event</h3>
                          <p>Make it unforgettable</p>
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
          USER DASHBOARD (Updated)
      ============================ */}
      <section className="page-section">
        <h2 className="section-title">User Dashboard</h2>
        <p className="section-sub">Your event booking details</p>

        {/* Booking History Button */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button className="btn glow" onClick={() => goTo("/bookinghistory")}>
            Booking History
          </button>
        </div>

        {/* Nothing */}
        {userBookings.upcoming.length === 0 &&
         userBookings.past.length === 0 && (
          <p className="text-muted" style={{ textAlign: "center" }}>
            No bookings found for your number.
          </p>
        )}

        {/* UPCOMING BOOKINGS */}
        {userBookings.upcoming.length > 0 && (
          <>
            <h3 className="section-title" style={{ marginTop: "20px" }}>
              Upcoming Bookings
            </h3>

            <div className="booking-history-container fade-in">
              {userBookings.upcoming.map((b, index) => (
                <div className="booking-card zoom-in" key={index}>
                  <h3>{b.event}</h3>
                  <p><b>Date:</b> {b.date}</p>
                  <p><b>Name:</b> {b.customerName}</p>
                  <p><b>Phone:</b> {b.phone}</p>
                  <p className="status">{b.confirmed ? "Confirmed ✔" : "Pending ⏳"}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAST BOOKINGS */}
        {userBookings.past.length > 0 && (
          <>
            <h3 className="section-title" style={{ marginTop: "25px" }}>
              Past Bookings
            </h3>

            <div className="booking-history-container fade-in">
              {userBookings.past.map((b, index) => (
                <div className="booking-card zoom-in" key={index}>
                  <h3>{b.event}</h3>
                  <p><b>Date:</b> {b.date}</p>
                  <p><b>Name:</b> {b.customerName}</p>
                  <p><b>Phone:</b> {b.phone}</p>
                  <p className="status">
                    {b.confirmed ? "Completed ✔" : "Expired"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ============================
          SERVICES
      ============================ */}
      <section className="page-section">
        <h2 className="section-title">Our Services</h2>
        <p className="section-sub">From planning to execution.</p>

        <div className="services-grid fade-in">
          <div className="service-card zoom-in">
            <i className="fa-solid fa-champagne-glasses service-icon"></i>
            <h3>Wedding Planning</h3>
            <p>Stress-free premium weddings.</p>
          </div>

          <div className="service-card zoom-in">
            <i className="fa-solid fa-music service-icon"></i>
            <h3>DJ & Music Setup</h3>
            <p>High-quality audio experience.</p>
          </div>

          <div className="service-card zoom-in">
            <i className="fa-solid fa-cake-candles service-icon"></i>
            <h3>Birthday Events</h3>
            <p>Creative theme arrangements.</p>
          </div>
        </div>

        <button className="btn glow mt-24" onClick={() => goTo("/services")}>
          View All Services
        </button>
      </section>

      {/* ============================
          HIGHLIGHTS
      ============================ */}
      <section className="page-section">
        <h2 className="section-title">Event Highlights</h2>

        <div className="event-container fade-in">
          {[1,2,3].map((n) => (
            <div className="event-card zoom-in" key={n}>
              <img
                src={`https://picsum.photos/seed/highlight${n}/500/300`}
                className="event-img"
                alt="highlight"
              />
              <div className="event-content">
                <h3>Premium Event #{n}</h3>
                <p className="event-price">Starting ₹9,999</p>
                <button className="btn glow mt-8" onClick={() => goTo("/events")}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================
          EVENT GALLERY (Button Removed)
      ============================ */}
      <section className="gallery-section page-section">
        <h2 className="section-title">Event Gallery</h2>

        <div className="gallery-masonry fade-in">
          {loading ? (
            <>
              <div className="shimmer"></div>
              <div className="shimmer"></div>
              <div className="shimmer"></div>
            </>
          ) : (
            gallery.map((item) => (
              <div key={item.id} className="gallery-item-wrapper">
                <img src={item.imageUrl} className="masonry-img" alt="gallery" />

                {isAdmin && (
                  <button
                    className="delete-btn"
                    onClick={() => deleteGalleryItem(item.id, item.imageUrl)}
                  >
                    🗑
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ============================
          ABOUT PREVIEW
      ============================ */}
      <section className="page-section">
        <h2 className="section-title">Why Choose Us?</h2>

        <div className="about-section">
          <p className="about-text">
            Praba Events delivers premium, customized experiences with years of expertise.
          </p>

          <button className="btn glow mt-24" onClick={() => goTo("/about")}>
            Know More
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
