import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);

  // 🔥 Load events from Firebase Database
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(
          "https://praba-events-default-rtdb.firebaseio.com/events.json"
        );
        const data = await res.json();

        if (data) {
          const formatted = Object.keys(data).map((id) => ({
            id,
            ...data[id],
          }));
          setEvents(formatted);
        }
      } catch (err) {
        console.error("Error loading events:", err);
      }
    }

    loadEvents();
  }, []);

  return (
    <div className="page-section fade-in">
      
      {/* PAGE TITLE */}
      <h2 className="section-title">Our Events</h2>
      <p className="section-sub">
        Explore our premium event services and book your special day.
      </p>

      {/* EVENTS GRID */}
      <div className="event-container">
        {events.map((event) => (
          <div className="event-card zoom-in" key={event.id}>
            
            <img src={event.image} alt={event.title} className="event-img" />

            <div className="event-content">
              <h3>{event.title}</h3>

              <p className="event-price">₹ {event.price}</p>

              <Link to="/booking" state={{ event }}>
                <button className="book-btn glow">Book Now</button>
              </Link>
            </div>
          </div>
        ))}

        {/* Show shimmer if no data yet */}
        {events.length === 0 && (
          <>
            <div className="event-card shimmer"></div>
            <div className="event-card shimmer"></div>
            <div className="event-card shimmer"></div>
          </>
        )}
      </div>
    </div>
  );
}

export default Events;
