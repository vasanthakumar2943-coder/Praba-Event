import React, { useEffect, useState } from "react";
import "../index.css";
import { db } from "../firebase";

import { collection, getDocs } from "firebase/firestore";

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Load gallery items */
  useEffect(() => {
    async function fetchGallery() {
      try {
        const snap = await getDocs(collection(db, "gallery"));
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGallery(data);
      } catch (err) {
        console.error("Gallery load error:", err);
      } finally {
        setLoading(false);
      }
    }
    

    fetchGallery();
  }, []);

  return (
     <section className="events-wrapper reveal page-section fade-in">
      <h2
        className="section-title"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Gallery
      </h2>


      <div className="gallery-masonry  fade-in">
        {loading ? (
          <>
            <div className="shimmer"></div>
            <div className="shimmer"></div>
            <div className="shimmer"></div>
          </>
        ) : (
          gallery.map((item) => (
            <div key={item.id} className="gallery-item-wrapper">
              {item.type === "video" ? (
                <video
                  src={item.imageUrl}
                  className="masonry-img"
                  controls
                  muted
                />
              ) : (
                <img
                  src={item.imageUrl}
                  className="masonry-img"
                  alt="Event"
                />
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
