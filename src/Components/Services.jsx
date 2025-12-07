import useReveal from "../hooks/useReveal";
import "../index.css";

function Services() {
  useReveal();

  const services = [
    {
      title: "Wedding Planning",
      desc: "Beautifully organized weddings with theme décor, stage setup, catering, photography, guest management, and complete event coordination.",
      icon: "💍",
    },
    {
      title: "Birthday Decorations",
      desc: "Creative balloon themes, LED backdrops, customized props, cake table décor, and entertainment arrangements for all ages.",
      icon: "🎉",
    },
    {
      title: "Corporate Events",
      desc: "Seminars, branding events, product launches, and official gatherings with professional arrangements and premium setups.",
      icon: "🏢",
    },
    {
      title: "Catering Services",
      desc: "Delicious vegetarian and non-veg menus, live counters, buffet arrangements, and hygienic, premium-quality food service.",
      icon: "🍽️",
    },
    {
      title: "Photography & Videography",
      desc: "HD photography, cinematic videography, drone shots, candid photos, reels creation, and complete event coverage.",
      icon: "📸",
    },
    {
      title: "Stage & Lighting Setup",
      desc: "Professional event lighting, truss setup, audio systems, LED panels, themed stage designs, and premium backdrop décor.",
      icon: "🎭",
    },
  ];

  return (
    <div>

      {/* ⭐ SERVICES HEADER */}
      <section className="services-hero reveal" style={{ textAlign: "center", paddingTop: "30px" }}>
        <h1 className="section-title">Our Services</h1>
        <p className="services-subtitle">
          Premium event solutions crafted to make your celebrations extraordinary.
        </p>
      </section>

      {/* ⭐ SERVICES GRID */}
      <section className="services-section reveal">
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Services;
