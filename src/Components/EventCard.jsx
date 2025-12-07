import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import "../index.css";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function EventCard({ id, name, price, image }) {
  const [showModal, setShowModal] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const adminNumber = "91XXXXXXXXXX";

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookings"));
        const filtered = snapshot.docs
          .map((doc) => doc.data())
          .filter((b) => b.eventId === id)
          .map((b) => new Date(b.date));

        setBookedDates(filtered);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      }
      setLoading(false);
    };

    loadBookings();
  }, [id]);

  const disableDates = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;

    return bookedDates.some((d) => d.toDateString() === date.toDateString());
  };

  const handleContinue = () => {
    if (!selectedDate) {
      toast.warn("Please select a date!");
      return;
    }
    setShowForm(true);
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
        eventId: id,
        event: name,
        date: selectedDate.toISOString().split("T")[0],
        customerName: customer.name,
        phone: cleanPhone,
        confirmed: false,
        timestamp: Date.now(),
      });

      toast.success("Booking Sent 🎉 Admin will confirm soon.");

      const msg = `📩 New Booking Request\n\nEvent: ${name}\nDate: ${
        selectedDate.toISOString().split("T")[0]
      }\nName: ${customer.name}\nPhone: ${cleanPhone}`;

      window.open(
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      setShowModal(false);
      setShowForm(false);
      setCustomer({ name: "", phone: "" });
      setSelectedDate(null);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking failed");
    }
  };

  return (
    <>
      {/* EVENT CARD */}
      <div className="event-card zoom-in fade-in">
        {loading ? (
          <div className="shimmer"></div>
        ) : (
          <>
            <img src={image} alt={name} className="event-img" />

            <div className="event-content">
              <h3>{name}</h3>
              <p className="event-price">₹ {price}</p>

              <button className="book-btn glow" onClick={() => setShowModal(true)}>
                Book Now
              </button>
            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-box fade-in">

            {/* Close Button */}
            <button
              className="close-btn"
              onClick={() => {
                setShowModal(false);
                setShowForm(false);
                setSelectedDate(null);
              }}
            >
              ✖
            </button>

            {/* STEP 1 — SELECT DATE */}
            {!showForm ? (
              <>
                <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Select Date</h3>

                <div className="calendar-glass-wrapper zoom-in">
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
                <h3 style={{ textAlign: "center" }}>Enter Your Details</h3>

                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />

                <div
                  className="phone-field"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    width="26"
                    height="26"
                    alt="WhatsApp"
                  />

                  <input
                    type="tel"
                    className="form-input"
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
      )}
    </>
  );
}

export default EventCard;
