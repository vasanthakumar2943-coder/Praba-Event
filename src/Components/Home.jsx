import { useEffect, useState, useRef } from "react";
import useReveal from "../hooks/useReveal";
import "../index.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Home() {
  useReveal();

  const [sliderImages, setSliderImages] = useState([]);
  const sliderRef = useRef(null);

  // Confetti effect
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

  // Load slider images from Firestore
  useEffect(() => {
    const loadImages = async () => {
      try {
        const snap = await getDocs(collection(db, "events"));
        const imgs = snap.docs.map((d) => d.data().image);
        setSliderImages(imgs);
      } catch (err) {
        console.error("Slider fetch error:", err);
      }
    };
    loadImages();
  }, []);

  // Auto-slide flip cards
  useEffect(() => {
    if (sliderImages.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % sliderImages.length;
      sliderRef.current.style.transform = `translateX(-${index * 280}px)`;
    }, 3000);

    return () => clearInterval(interval);
  }, [sliderImages]);

  return (
    <div>

      {/* ⭐ 1. WELCOME NOTE */}
      <section className="hero reveal" style={{ paddingTop: "20px" }}>
        <h1 className="text-pop">Welcome to Praba Event's</h1>
        <p className="text-pop" style={{ animationDelay: "0.3s" }}>
          Making your celebrations unforgettable 🎉
        </p>
      </section>

      {/* ⭐ 2. FLIP-CARD STYLE SLIDER */}
      <section className="flip-section fade-in">
        <h2 className="section-title">Event Highlights</h2>

        <div className="flip-slider-container">
          <div className="flip-slider-track" ref={sliderRef}>
            {sliderImages.map((img, i) => (
              <div className="flip-card" key={i}>
                <div className="flip-inner">
                  <div className="flip-front">
                    <img src={img} alt="event" />
                  </div>
                  <div className="flip-back">
                    <h3>Praba Events</h3>
                    <p>Best Moments Captured</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ 3. USER DASHBOARD */}
      <section
        className="page-section fade-in"
        style={{ paddingTop: "30px", textAlign: "center" }}
      >
        <h2 className="section-title">User Dashboard</h2>

        <button
          className="confirm-btn glow"
          onClick={() => (window.location.href = "/history")}
          style={{ marginBottom: "20px" }}
        >
          View Booking History 📜
        </button>
      </section>

      {/* ⭐ 4. UPDATED GALLERY LAYOUT */}
      <section className="gallery-section reveal">
        <h2 className="section-title">Our Event Gallery</h2>

        <div className="gallery-masonry">
          <img src="/assets/g1.jpg" className="masonry-img" />
          <img src="/assets/g2.jpg" className="masonry-img tall" />
          <img src="/assets/g3.jpg" className="masonry-img wide" />
          <img src="/assets/g1.jpg" className="masonry-img" />
        </div>
      </section>
    </div>
  );
}

export default Home;
