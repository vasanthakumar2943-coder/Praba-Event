import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import "../index.css";

function EventCard({ id, name, price, image }) {
  const [showModal, setShowModal] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);

  // Load booked dates
  useEffect(() => {
    fetch("http://localhost:8080/bookings")
      .then((res) => res.json())
      .then((data) => {
        const dates = data
          .filter((b) => b.eventId === id)
          .map((b) => new Date(b.date));
        setBookedDates(dates);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  const handleBooking = () => {
    if (!customer.name || !customer.phone) {
      toast.warn("Enter your details!");
      return;
    }

    const newBooking = {
      eventId: id,
      event: name,
      date: selectedDate.toISOString().split("T")[0],
      customerName: customer.name,
      phone: customer.phone,
    };

    fetch("http://localhost:8080/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    })
      .then(() => {
        toast.success("Booking Confirmed 🎉");
        setShowModal(false);
        setShowForm(false);
        setCustomer({ name: "", phone: "" });
        setSelectedDate(null);
      })
      .catch(() => toast.error("Booking failed"));
  };

  return (
    <>
      <div className="event-card">
        <img src={image} alt={name} className="event-img" />
        <div className="event-content">
          <h3>{name}</h3>
          <p className="event-price">₹ {price}</p>
          <button className="book-btn" onClick={() => setShowModal(true)}>
            Book Now
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
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
                <button className="confirm-btn" onClick={handleContinue}>
                  Continue →
                </button>
              </>
            ) : (
              <>
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
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone Number"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  style={{ marginTop: "10px" }}
                />
                <button
                  className="confirm-btn"
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
