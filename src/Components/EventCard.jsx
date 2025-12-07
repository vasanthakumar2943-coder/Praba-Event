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

  // 🔥 ADMIN WHATSAPP NUMBER HERE
  const adminNumber = "91XXXXXXXXXX"; // CHANGE THIS TO ADMIN NUMBER

  // Load booked dates from Firestore
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

  // -------------------------------
  // SAVE BOOKING + SEND ADMIN NOTICE
  // -------------------------------
  const handleBooking = async () => {
    if (!customer.name || !customer.phone) {
      toast.warn("Enter your details!");
      return;
    }

    // ✅ Validate 10-digit phone
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

      // ----------------------------
      // SEND WHATSAPP NOTIFICATION TO ADMIN
      // ----------------------------
      const msg = `📩 New Booking Request

Event: ${name}
Date: ${selectedDate.toISOString().split("T")[0]}
Name: ${customer.name}
Phone: ${cleanPhone}

Please open Admin Panel to confirm.`;

      window.open(
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      // Reset states
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
      {/* EVENT CARD with animations */}
      <div className="event-card reveal zoom-in">

        {/* SHIMMER LOADING */}
        {loading ? (
          <div className="shimmer"></div>
        ) : (
          <>
            <img src={image} alt={name} className="event-img" />

            <div className="event-content">
              <h3>{name}</h3>
              <p className="event-price">₹ {price}</p>

              {/* Glow Button */}
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

            {/* Step 1: Select Date */}
            {!showForm ? (
              <>
                <h3>Select Date</h3>
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
                <button className="confirm-btn glow" onClick={handleContinue}>
                  Continue →
                </button>
              </>
            ) : (
              <>
                {/* Step 2: Customer Info */}
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

                {/* PHONE FIELD WITH WHATSAPP ICON */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    width="28"
                    height="28"
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
      )}
    </>
  );
}

export default EventCard;
