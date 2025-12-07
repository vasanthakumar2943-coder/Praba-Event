import { useEffect, useState } from "react";
import "../index.css";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Home() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const eventSnap = await getDocs(collection(db, "events"));
        const eventList = eventSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGallery(eventList);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      }
    };

    loadGallery();
  }, []);

  return (
    <div className="home-page fade-in">

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Praba Event's</h1>
        <p>We make your celebrations unforgettable…</p>
      </section>

      {/* ⭐ Gallery Section */}
      <section className="gallery-section">
        <h2 className="section-title">Our Event Gallery</h2>

        <div className="gallery-grid">
          {gallery.map((ev) => (
            <img key={ev.id} src={ev.image} alt={ev.name} className="gallery-img" />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
