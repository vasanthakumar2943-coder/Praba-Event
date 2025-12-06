import { useEffect, useState } from "react";
import "../index.css";

function Home() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/events")
      .then(res => res.json())
      .then(data => setGallery(data));
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
