import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import "../index.css";

import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function EventCard({ id, name, price, image }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);

  const adminNumber = "917094325920";

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

  const handleBooking = async () => {
    if (!customer.name || !customer.phone) {
      toast.warn("Enter your details!");
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.warn("Enter valid WhatsApp number!");
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

      toast.success("Booking Sent 🎉");

      const msg = `📩 New Booking\nEvent: ${name}\nDate: ${
        selectedDate.toISOString().split("T")[0]
      }\nName: ${customer.name}\nPhone: ${cleanPhone}`;

      window.open(
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      // Reset
      setShowCalendar(false);
      setShowForm(false);
      setSelectedDate(null);
      setCustomer({ name: "", phone: "" });
    } catch (error) {
      console.error(error);
      toast.error("Booking failed");
    }
  };

  return (
    <div className="event-card reveal zoom-in" style={{ position: "relative" }}>
      <img src={image} alt={name} className="event-img" />

      <div className="event-content">
        <h3>{name}</h3>
        <p className="event-price">₹ {price}</p>

        <button
          className="book-btn glow"
          onClick={() => {
            setShowCalendar(!showCalendar);
            setShowForm(false);
          }}
        >
          Book Now
        </button>
      </div>

      {/* POPUP CALENDAR ON CARD */}
      {showCalendar && (
        <div className="calendar-popup-on-card fade-in">
          <button
            className="close-mini"
            onClick={() => {
              setShowCalendar(false);
              setShowForm(false);
            }}
          >
            ✖
          </button>

          {!showForm ? (
            <>
              <h3>Select Date</h3>

              <div className="calendar-glass-wrapper">
                {loading ? (
                  <p>Loading…</p>
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
              <h3>Enter Details</h3>

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
      )}
    </div>
  );
}

export default EventCard;
