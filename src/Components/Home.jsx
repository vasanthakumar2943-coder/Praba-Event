import { useEffect, useState, useRef } from "react";
import useReveal from "../hooks/useReveal";
import "../index.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Home() {
  useReveal(); // scroll animations

  const [sliderImages, setSliderImages] = useState([]);

  // Auto-slide reference
  const sliderRef = useRef(null);

  // CONFETTI ANIMATION
  useEffect(() => {
    const randomColor = () => {
      const colors = ["#ff3d7f", "#00e1ff", "#ffd93d", "#69ff6b"];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    for (let i = 0; i < 25; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.setProperty("--conf-left", Math.random() * 100 + "%");
      piece.style.setProperty("--conf-color", randomColor());
      piece.style.setProperty("--conf-speed", 3 + Math.random() * 4 + "s");
      document.body.appendChild(piece);
    }
  }, []);

  // 🔥 Fetch slider images from Firestore event list
  useEffect(() => {
    const loadImages = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const imgs = snap.docs.map((d) => d.data().image);

        setSliderImages(imgs);
      } catch (err) {
        console.error("Failed to load slider images:", err);
      }
    };

    loadImages();
  }, []);

  // 🔁 Auto slider animation every 3 seconds
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || sliderImages.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % sliderImages.length;
      slider.scrollTo({
        left: index * 260, // moves horizontally
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderImages]);

  return (
    <div>

      {/* ⭐ AUTO-SLIDING EVENT BANNER FROM FIRESTORE */}
      <section className="slider-section fade-in">
        <h2 className="section-title" style={{ marginBottom: "15px" }}>
          Event Highlights
        </h2>

        <div className="event-slider" ref={sliderRef}>
          {sliderImages.length > 0 ? (
            sliderImages.map((img, i) => (
              <div className="slide" key={i}>
                <img src={img} alt="Event Slide" className="slide-img" />
              </div>
            ))
          ) : (
            <p>Loading images...</p>
          )}
        </div>
      </section>

      {/* ⭐ USER DASHBOARD */}
      <section
        className="page-section fade-in"
        style={{ paddingTop: "30px", textAlign: "center" }}
      >
        <h2 className="section-title">User Dashboard</h2>

        <button
          className="confirm-btn glow"
          style={{ marginBottom: "20px" }}
          onClick={() => (window.location.href = "/history")}
        >
          View Booking History 📜
        </button>
      </section>

      {/* HERO SECTION */}
      <section className="hero reveal">
        <h1 className="text-pop">Welcome to Praba Event's</h1>
        <p className="text-pop" style={{ animationDelay: "0.3s" }}>
          Making your celebrations unforgettable 🎉
        </p>
      </section>

      {/* GALLERY */}
      <section className="gallery-section reveal">
        <h2 className="section-title reveal">Our Event Gallery</h2>

        <div className="gallery-grid">
          <div className="slide-up reveal">
            <img src="/assets/g1.jpg" className="gallery-img" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
