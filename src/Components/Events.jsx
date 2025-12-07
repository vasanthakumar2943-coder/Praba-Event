import React, { useEffect, useState } from "react";
import EventCard from "./EventCard.jsx";
import "../index.css";
import useReveal from "../hooks/useReveal";

function Events() {
  useReveal();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const res = await fetch("http://localhost:8080/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="page-section">
      <h2 className="section-title text-pop">Our Events</h2>

      {loading ? (
        <p className="fade-in">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="fade-in">No events available</p>
      ) : (
        <div className="event-container reveal">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              id={ev.id}
              name={ev.name}
              price={ev.price}
              image={ev.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
