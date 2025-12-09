import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";

/* ============================
   HIGHLIGHT BOOKING MODAL
   (same flow as EventCard)
============================ */
function HighlightBookingModal({ highlight, onClose }) {
  const eventName = highlight?.event || highlight?.title || "Event";
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const adminNumber = "91XXXXXXXXXX"; // same as EventCard

  // Load existing bookings for this event (by name)
  useEffect(() => {
    if (!highlight) return;

    const loadBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookings"));
        const filtered = snapshot.docs
          .map((doc) => doc.data())
          .filter((b) => b.event === eventName)
          .map((b) => new Date(b.date));

        setBookedDates(filtered);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [highlight, eventName]);

  const disableDates = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;

    return bookedDates.some(
      (d) => d.toDateString() === date.toDateString()
    );
  };

  const handleContinue = () => {
    if (!selectedDate) {
      toast.warn("Please select a date!");
      return;
    }
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedDate(null);
    setCustomer({ name: "", phone: "" });
    onClose();
  };

  const handleBooking = async () => {
    if (!customer.name || !customer.phone) {
      toast.warn("Enter your details!");
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.warn("Enter a valid 10-digit WhatsApp number!");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        eventId: highlight.id || eventName, // link using highlight id or name
        event: eventName,
        date: selectedDate.toISOString().split("T")[0],
        customerName: customer.name,
        phone: cleanPhone,
        confirmed: false,
        timestamp: Date.now(),
      });

      toast.success("Booking Sent 🎉 Admin will confirm soon.");

      const msg = `📩 New Booking Request\n\nEvent: ${eventName}\nDate: ${
        selectedDate.toISOString().split("T")[0]
      }\nName: ${customer.name}\nPhone: ${cleanPhone}\n\nPlease open Admin Panel to confirm.`;

      window.open(
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      handleClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed");
    }
  };

  if (!highlight) return null;

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-box glass-box fade-in">
        <button className="close-btn" onClick={handleClose}>
          ✖
        </button>

        {/* STEP 1 — CALENDAR */}
        {!showForm ? (
          <>
            <h3>Select Date</h3>

            <div className="calendar-glass-wrapper">
              {loading ? (
                <p>Loading calendar...</p>
              ) : (
                <Calendar
                  onClickDay={(d) => setSelectedDate(d)}
                  tileDisabled={disableDates}
                  tileClassName={({ date }) =>
                    bookedDates.some(
                      (b) => b.toDateString() === date.toDateString()
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
            {/* STEP 2 — USER FORM */}
            <h3>Enter Your Details</h3>

            <input
              type="text"
              className="form-control"
              placeholder="Your Name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              style={{ marginTop: "10px" }}
            />

            <div className="phone-field">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                width="26"
                height="26"
                alt="WhatsApp"
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

            <button
              className="confirm-btn glow"
              style={{ marginTop: "10px" }}
              onClick={handleBooking}
            >
              Confirm Booking ✔
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================
            HOME
============================ */
function Home() {
  const [slides, setSlides] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState({ upcoming: [], past: [] });
  const [activeHighlight, setActiveHighlight] = useState(null);

  const trackRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const navigate = useNavigate();

  /* SLIDER IMAGES */
  useEffect(() => {
    async function loadSlides() {
      try {
        const snap = await getDocs(collection(db, "slides"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSlides(list);
      } catch (err) {
        console.error("Slide Load Error:", err);
      }
    }
    loadSlides();
  }, []);

  const goToSlide = (index) => {
    if (slides.length === 0) return;
    const total = slides.length;
    setCurrentSlide((index + total) % total);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || slides.length === 0) return;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }, [currentSlide, slides]);

  useEffect(() => {
    if (slides.length === 0) return;
    const auto = setInterval(() => goToSlide(currentSlide + 1), 3500);
    return () => clearInterval(auto);
  }, [currentSlide, slides]);

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
  const endDrag = () => {
    isDragging.current = false;
  };

  /* GALLERY */
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

  /* HIGHLIGHTS */
  useEffect(() => {
    async function loadHighlights() {
      try {
        const snap = await getDocs(collection(db, "highlights"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setHighlights(list);
      } catch (err) {
        console.error("Highlight load error:", err);
      }
    }
    loadHighlights();
  }, []);

  /* USER DASHBOARD */
  useEffect(() => {
    const phone = localStorage.getItem("userPhone")?.replace(/\D/g, "");
    const all = JSON.parse(localStorage.getItem("bookings")) || [];

    if (!phone || phone.length !== 10) {
      setUserBookings({ upcoming: [], past: [] });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const filtered = all.filter((b) => b.phone === phone);

    setUserBookings({
      upcoming: filtered.filter((b) => b.date >= today),
      past: filtered.filter((b) => b.date < today),
    });
  }, []);

  const goTo = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="fade-in">
      {/* HERO */}
      <section className="page-section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="main-hero">
            <div className="hero-left slide-up" style={{ textAlign: "center" }}>
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
                We bring your dream event to life with creativity, passion and
                precision.
              </p>
              <button className="btn glow" onClick={() => goTo("/events")}>
                Explore Events
              </button>
            </div><br />

            {/* SLIDER */}
            <div className="hero-right fade-in">
              <div
                className="flip-slider-container"
                onTouchStart={startDrag}
                onTouchMove={onDrag}
                onTouchEnd={endDrag}
              >
                <div className="flip-slider-track" ref={trackRef}>
                  {(slides.length
                    ? slides
                    : [{ imageUrl: "https://picsum.photos/seed/slide/600/350" }]
                  ).map((slide, i) => (
                    <div className="flip-card" key={i}>
                      <div className="flip-inner">
                        <div className="flip-front">
                          <img src={slide.imageUrl} className="slider-img" />
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
                    className={`dot ${i === currentSlide ? "active" : ""}`}
                    onClick={() => goToSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USER DASHBOARD */}
      <section className="page-section">
        <h2 className="section-title">User Dashboard</h2>
        <p className="section-sub">Your event booking details</p>

        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <button className="btn glow" onClick={() => goTo("/bookinghistory")}>
            Booking History
          </button>
        </div>

        {userBookings.upcoming.length === 0 &&
          userBookings.past.length === 0 && (
            <p className="text-muted" style={{ textAlign: "center" }}>
              No bookings found for your number.
            </p>
          )}

        {userBookings.upcoming.length > 0 && (
          <>
            <h3 className="section-title" style={{ marginTop: "20px" }}>
              Upcoming Bookings
            </h3>
            <div className="booking-history-container fade-in">
              {userBookings.upcoming.map((b, index) => (
                <div className="booking-card zoom-in" key={index}>
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

        {userBookings.past.length > 0 && (
          <>
            <h3 className="section-title" style={{ marginTop: "25px" }}>
              Past Bookings
            </h3>
            <div className="booking-history-container fade-in">
              {userBookings.past.map((b, index) => (
                <div className="booking-card zoom-in" key={index}>
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


      {/* EVENT HIGHLIGHTS */}
      <section className="page-section">
        <h2 className="section-title">Event Highlights</h2>

        <div className="event-container fade-in">
          {highlights.length > 0 &&
            highlights.map((h) => {
              const title = h.title || h.event || "Premium Event";
              const img = h.imageUrl || h.imageurl;
              const price = h.price;

              return (
                <div
                  className="event-card event-card-overlay zoom-in"
                  key={h.id}
                >
                  <div className="event-img-wrap">
                    <img
                      src={img}
                      className="event-img"
                      alt={title}
                    />
                    <div className="event-overlay">
                      <h3>{title}</h3>
                      {price && (
                        <p className="event-price">{price}</p>
                      )}
                      {h.description && (
                        <p className="event-desc">{h.description}</p>
                      )}

                      <button
                        className="btn glow mt-8"
                        onClick={() => setActiveHighlight(h)}
                      >
                        {h.buttonText || "Book Now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Fallback if no highlights in DB */}
          {highlights.length === 0 &&
            [1, 2, 3].map((n) => {
              const dummy = {
                event: `Premium Event #${n}`,
                price: "₹9,999",
                imageUrl: `https://picsum.photos/seed/highlight${n}/600/350`,
              };
              return (
                <div
                  className="event-card event-card-overlay zoom-in"
                  key={n}
                >
                  <div className="event-img-wrap">
                    <img
                      src={dummy.imageUrl}
                      className="event-img"
                      alt={dummy.event}
                    />
                    <div className="event-overlay">
                      <h3>{dummy.event}</h3>
                      <p className="event-price">{dummy.price}</p>
                      <p className="event-desc">
                        Beautifully planned & executed celebration.
                      </p>
                      <button
                        className="btn glow mt-8"
                        onClick={() => setActiveHighlight(dummy)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* GALLERY */}
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


      {/* SERVICES */}
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
        </div> <br></br>

        <button className="btn glow mt-24" onClick={() => goTo("/services")}>
          View All Services
        </button>
      </section>


      {/* ABOUT PREVIEW */}
      <section className="page-section">
        <h2 className="section-title">Why Choose Us?</h2>

        <div className="about-section">
          <p className="about-text">
            Praba Events delivers premium, customized experiences with years of
            expertise.
          </p>

          <button className="btn glow mt-24" onClick={() => goTo("/about")}>
            Know More
          </button>
        </div>
      </section>


      {/* HIGHLIGHT BOOKING MODAL (shown when user clicks Book Now) */}
      {activeHighlight && (
        <HighlightBookingModal
          highlight={activeHighlight}
          onClose={() => setActiveHighlight(null)}
        />
      )}
    </div>
  );
}

export default Home;
