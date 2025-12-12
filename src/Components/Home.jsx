import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";

/* ============================================================
   INLINE POPUP FOR HIGHLIGHT (CENTER FLOAT OVER IMAGE)
============================================================ */
function InlineHighlightPopup({ highlight, onClose }) {
  const eventName = highlight?.event || highlight?.title || "Event";
  const eventId = highlight?.id || eventName;

  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const adminNumber = "917094325920";

  /* LOAD BOOKINGS */
  useEffect(() => {
    let mounted = true;

    async function loadBookings() {
      try {
        const snap = await getDocs(collection(db, "bookings"));
        const list = snap.docs
          .map((d) => d.data())
          .filter((b) =>
            b.eventId
              ? b.eventId === eventId
              : b.event === eventName
          )
          .map((b) => new Date(b.date));

        if (mounted) setBookedDates(list);
      } catch (err) {
        console.error("Booking load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBookings();
    return () => (mounted = false);
  }, [eventId, eventName]);

  /* DISABLE DATES */
  const disableDates = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;

    return bookedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  /* CONTINUE TO FORM */
  const handleContinue = () => {
    if (!selectedDate) {
      toast.warn("Please select a date!");
      return;
    }
    setShowForm(true);
  };

  /* FINAL BOOKING */
  const handleBooking = async () => {
    if (!customer.name || !customer.phone) {
      toast.warn("Enter your details!");
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.warn("Enter valid 10-digit number!");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        eventId,
        event: eventName,
        date: selectedDate.toISOString().split("T")[0],
        customerName: customer.name,
        phone: cleanPhone,
        confirmed: false,
        timestamp: Date.now(),
      });

      toast.success("Booking Sent 🎉");

      const msg =
        `📩 New Booking\nEvent: ${eventName}\nDate: ${selectedDate.toISOString().split("T")[0]}\n` +
        `Name: ${customer.name}\nPhone: ${cleanPhone}`;

      window.open(
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      setShowForm(false);
      setSelectedDate(null);
      setCustomer({ name: "", phone: "" });

      onClose();
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Unable to book");
    }
  };

  return (
    <div
      className="calendar-popup-on-card"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <button className="close-mini" onClick={onClose}>
        ✖
      </button>

      {!showForm ? (
        <>
          <h3 style={{ textAlign: "center", marginBottom: 10 }}>
            Select Date
          </h3>

          <div className="calendar-glass-wrapper">
            {loading ? (
              <p>Loading…</p>
            ) : (
              <Calendar
                onClickDay={(d) => setSelectedDate(d)}
                tileDisabled={disableDates}
                tileClassName={({ date }) =>
                  bookedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  )
                    ? "booked-date"
                    : selectedDate &&
                      selectedDate.toDateString() === date.toDateString()
                    ? "selected-date"
                    : ""
                }
              />
            )}
          </div>

          <button className="confirm-btn glow" onClick={handleContinue}>
            Continue →
          </button>
        </>
      ) : (
        <>
          <h3 style={{ textAlign: "center" }}>Enter Your Details</h3>

          <input
            type="text"
            className="form-control"
            placeholder="Your Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />

          <div className="phone-field">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              width="26"
              alt=""
            />
            <input
              type="tel"
              className="form-control"
              placeholder="WhatsApp Number"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
          </div>

          <button className="confirm-btn glow" onClick={handleBooking}>
            Confirm Booking ✔
          </button>
        </>
      )}
    </div>
  );
}

/* ============================================================
                              HOME
============================================================ */
function Home() {
  const [slides, setSlides] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userBookings, setUserBookings] = useState({
    upcoming: [],
    past: [],
  });

  const [activeHighlightId, setActiveHighlightId] = useState(null);

  const trackRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const navigate = useNavigate();

  /* LOAD SLIDES */
  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "slides"));
        setSlides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  /* SLIDER ANIMATION */
  const goToSlide = (i) => {
    if (slides.length === 0) return;
    setCurrentSlide((i + slides.length) % slides.length);
  };
  useEffect(() => {
    const t = setInterval(() => goToSlide(currentSlide + 1), 3500);
    return () => clearInterval(t);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${
      currentSlide * 100
    }%)`;
  }, [currentSlide]);

  const startDrag = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
  };
  const onDrag = (e) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientX - startX.current;
    if (Math.abs(diff) > 50) {
      goToSlide(currentSlide + (diff < 0 ? 1 : -1));
      isDragging.current = false;
    }
  };

  /* GALLERY */
  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "gallery"));
        setGallery(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* HIGHLIGHTS */
  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, "highlights"));
        setHighlights(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  /* USER DASHBOARD */
  useEffect(() => {
    const phone = localStorage.getItem("userPhone")?.replace(/\D/g, "");
    const all = JSON.parse(localStorage.getItem("bookings")) || [];

    if (!phone || phone.length !== 10) return;

    const today = new Date().toISOString().split("T")[0];
    const my = all.filter((b) => b.phone === phone);

    setUserBookings({
      upcoming: my.filter((b) => b.date >= today),
      past: my.filter((b) => b.date < today),
    });
  }, []);

  const goTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="fade-in">

      {/* ================= HERO ================= */}
      <section className="page-section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="main-hero">
            <div
              className="hero-left slide-up"
              style={{ textAlign: "center" }}
            >
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

              <p className="hero-desc">
                We bring your dream event to life with creativity, passion
                and precision.
              </p>

              <button className="btn glow" onClick={() => goTo("/events")}>
                Explore Events
              </button>
            </div>
            <br />

            {/* ============= SLIDER ============= */}
            <div className="hero-right fade-in">
              <div
                className="flip-slider-container"
                onTouchStart={startDrag}
                onTouchMove={onDrag}
                onTouchEnd={() => (isDragging.current = false)}
              >
                <div className="flip-slider-track" ref={trackRef}>
                  {(slides.length
                    ? slides
                    : [
                        {
                          imageUrl:
                            "https://picsum.photos/seed/slide/600/350",
                        },
                      ]
                  ).map((slide, i) => (
                    <div className="flip-card" key={i}>
                      <div className="flip-inner">
                        <div className="flip-front">
                          <img
                            src={slide.imageUrl}
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

              <div className="slider-dots">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`dot ${
                      i === currentSlide ? "active" : ""
                    }`}
                    onClick={() => goToSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= USER DASHBOARD ================= */}
      <section className="page-section">
        <h2 className="section-title">User Dashboard</h2>
        <p className="section-sub">Your event booking details</p>

        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <button className="btn glow" onClick={() => goTo("/bookinghistory")}>
            Booking History
          </button>
        </div>

        {/* UPCOMING */}
        {userBookings.upcoming.length > 0 && (
          <>
            <h3 className="section-title" style={{ marginTop: 20 }}>
              Upcoming Bookings
            </h3>

            <div className="booking-history-container fade-in">
              {userBookings.upcoming.map((b, i) => (
                <div className="booking-card zoom-in" key={i}>
                  <h3>{b.event}</h3>
                  <p>
                    <b>Date:</b> {b.date}
                  </p>
                  <p>
                    <b>Name:</b> {b.customerName}
                  </p>
                  <p>
                    <b>Phone:</b> {b.phone}
                  </p>
                  <p className="status">
                    {b.confirmed ? "Confirmed ✔" : "Pending ⏳"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PAST */}
        {userBookings.past.length > 0 && (
          <>
            <h3 className="section-title" style={{ marginTop: 25 }}>
              Past Bookings
            </h3>

            <div className="booking-history-container fade-in">
              {userBookings.past.map((b, i) => (
                <div className="booking-card zoom-in" key={i}>
                  <h3>{b.event}</h3>
                  <p>
                    <b>Date:</b> {b.date}
                  </p>
                  <p>
                    <b>Name:</b> {b.customerName}
                  </p>
                  <p>
                    <b>Phone:</b> {b.phone}
                  </p>
                  <p className="status">
                    {b.confirmed ? "Completed ✔" : "Expired"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ================= EVENT HIGHLIGHTS (MATCH EVENTCARD STYLE) ================= */}
      <section className="page-section">
        <h2 className="section-title">Event Highlights</h2>

        <div className="event-container fade-in">
          {highlights.map((h) => {
            const title = h.title || h.event || "Premium Event";
            const img = h.imageUrl || h.imageurl;
            const price = h.price;

            return (
              <div className="event-card zoom-in" key={h.id}>
                {/* SAME IMAGE STYLE AS EVENTCARD */}
                <img src={img} className="event-img" alt={title} />

                {/* SAME CONTENT STYLE AS EVENTCARD */}
                <div className="event-content">
                  <h3>{title}</h3>

                  {price && (
                    <p className="event-price">₹ {price}</p>
                  )}

                  {h.description && (
                    <p className="event-desc">{h.description}</p>
                  )}

                  {/* BOOK BUTTON */}
                  <button
                    className="book-btn glow"
                    onClick={() =>
                      setActiveHighlightId(
                        activeHighlightId === h.id ? null : h.id
                      )
                    }
                  >
                    {h.buttonText || "Book Now"}
                  </button>

                  {/* INLINE FLOATING POPUP */}
                  {activeHighlightId === h.id && (
                    <InlineHighlightPopup
                      highlight={h}
                      onClose={() => setActiveHighlightId(null)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= GALLERY ================= */}
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
                {item.type === "video" ? (
                  <video
                    src={item.imageUrl}
                    className="masonry-img"
                    controls
                    muted
                  />
                ) : (
                  <img src={item.imageUrl} className="masonry-img" />
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ================= SERVICES ================= */}
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

        <br />
        <button
          className="btn glow mt-24"
          onClick={() => goTo("/services")}
        >
          View All Services
        </button>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="page-section">
        <h2 className="section-title">Why Choose Us?</h2>

        <div className="about-section">
          <p className="about-text">
            Praba Events delivers premium, customized experiences with years
            of expertise.
          </p>

          <button
            className="btn glow mt-24"
            onClick={() => goTo("/about")}
          >
            Know More
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
