import { useEffect, useState } from "react";
import EventCard from "./EventCard.jsx";
import "../index.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import useReveal from "../hooks/useReveal";

function Events() {
  useReveal(); // Animation trigger

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Events from Firestore (NO LOGIC CHANGES)
  const loadEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // LOADING UI
  if (loading) {
    return (
      <div className="page-section reveal">
        <h2 className="section-title">Events</h2>
        <p>Loading events...</p>
      </div>
    );
  }

  // NO EVENTS UI
  if (!events.length) {
    return (
      <div className="page-section reveal">
        <h2 className="section-title">Events</h2>
        <p>No events found.</p>
      </div>
    );
  }

  // EVENTS GRID
  return (
    <section className="events-wrapper reveal page-section fade-in">
      <h2 className="section-title" style={{ textAlign: "center", marginBottom: "20px" }}>
        Events
      </h2>

      <div className="event-container">
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
    </section>
  );
}

export default Events;
