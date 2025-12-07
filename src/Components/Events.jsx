import { useEffect, useState } from "react";
import EventCard from "./EventCard.jsx";
import "../index.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Events from Firestore
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
