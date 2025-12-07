import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useLocation } from "react-router-dom";

const location = useLocation();
const event = location.state?.event;


function Booking() {
  const [date, setDate] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });

  // Sample booked dates (disable them)
  const bookedDates = ["2025-01-14", "2025-01-20"];

  const tileDisabled = ({ date }) => {
    const d = date.toISOString().split("T")[0];
    return bookedDates.includes(d);
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!date) return alert("Please select a date");

    alert(
      `Booking Submitted:\nName: ${form.name}\nPhone: ${form.phone}\nDate: ${date.toDateString()}`
    );

    setForm({ name: "", phone: "" });
    setDate(null);
  };

  return (
    <div className="page-section fade-in">
      
      <h2 className="section-title">Book Your Event</h2>
      <p className="section-sub">Choose a date and enter your details below</p>

      <div
        className="glass-card slide-up"
        style={{ maxWidth: "500px", margin: "auto", marginTop: "25px" }}
      >
        {/* Calendar */}
        <div className="calendar-glass-wrapper zoom-in">
          <Calendar
            onChange={setDate}
            value={date}
            tileDisabled={tileDisabled}
            className="react-calendar"
          />
        </div>

        {/* Show Selected Date */}
        {date && (
          <p
            style={{
              textAlign: "center",
              color: "#00eaff",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Selected: {date.toDateString()}
          </p>
        )}

        {/* Form */}
        <form className="contact-form" onSubmit={submitForm}>
          <input
            type="text"
            placeholder="Your Name"
            className="form-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="form-input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <button className="contact-btn glow" type="submit">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
