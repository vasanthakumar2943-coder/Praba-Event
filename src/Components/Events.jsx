import { useEffect, useState } from "react";
import EventCard from "./EventCard.jsx";
import "../index.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-section fade-in">
        <h2 className="section-title">Events</h2>
        <p>Loading events...</p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="page-section fade-in">
        <h2 className="section-title">Events</h2>
        <p>No events found.</p>
      </div>
    );
  }

  return (
    <div className="event-container fade-in">
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
  );
}

export default Events;
