import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    // Prevent running on SSR / before DOM ready
    if (typeof window === "undefined") return;
    if (!document) return;

    const items = document.querySelectorAll(".reveal");
    if (!items || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target); // prevent repeated calls
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => {
      if (el) observer.observe(el); // SAFE CHECK
    });

    return () => observer.disconnect();
  }, []);
}
