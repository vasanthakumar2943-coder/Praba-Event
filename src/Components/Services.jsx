import useReveal from "../hooks/useReveal";
import "../index.css";

function Services() {
  useReveal();

  const services = [
    {
      id: 1,
      title: "Stage Decorations",
      desc: "Elegant stage decorations with flowers, LED backdrops and theme-based designs for weddings and events.",
      price: "Starting from ₹12,000",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRut64Uhx-yGfz7UiC9RMzjdJmo5CqLGrZSUg&s",
    },
    {
      id: 2,
      title: "Teddy Costume",
      desc: "Cute teddy mascot costume for birthday parties, kids events and surprise celebrations.",
      price: "Starting from ₹3,500",
      image:
        "https://i.pinimg.com/736x/f1/78/11/f1781129d81f070470a4e8715370cbfa.jpg",
    },
    {
      id: 3,
      title: "Lights",
      desc: "Professional event lighting with LED lights, decorative focus lights and stage illumination.",
      price: "Starting from ₹6,000",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCGRVy92fqhPHeSo4LkPcWhq_JpEzJzjyi7w&s",
    },
    {
      id: 4,
      title: "Popcorn",
      desc: "Live popcorn stall with machine, fresh popcorn and operator for parties and functions.",
      price: "Starting from ₹2,500",
      image:
        "https://tenthouz.com/wp-content/uploads/2024/07/DALL%C2%B7E-2024-07-21-19.40.16-A-classic-popcorn-machine-cart-set-up-for-a-party.-The-cart-is-bright-red-with-a-traditional-design-featuring-a-glass-enclosure-showcasing-freshly-po.webp",
    },
    {
      id: 5,
      title: "Cotton Candy",
      desc: "Colorful cotton candy stall with multiple flavors, perfect for kids birthday events.",
      price: "Starting from ₹2,000",
      image:
        "https://www.kinghigher.com/wp-content/uploads/2025/06/cotton-candy-machine-event-pink-model.jpg",
    },
    {
      id: 6,
      title: "Catering",
      desc: "Quality catering service with veg and non-veg menus, hygienic food preparation and staff.",
      price: "Starting from ₹180 per plate",
      image:
        "https://tiimg.tistatic.com/fp/1/791/catering-services-737.jpg",
    },
  ];

  return (
    <main>
      {/* ⭐ SERVICES HEADER */}
      <section
        className="services-hero reveal page-section"
        style={{ textAlign: "center", paddingTop: "30px" }}
        aria-labelledby="services-heading"
      >
        <h1 className="section-title" id="services-heading">
          Our Services
        </h1>
        <p className="services-subtitle">
          Complete event solutions under one roof
        </p>
      </section>

      {/* ⭐ SERVICES GRID */}
      <section className="services-section reveal" aria-label="Service Categories">
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              {/* IMAGE */}
              <img
                src={service.image}
                alt={service.title}
                className="service-img"
              />

              <h3 className="service-title">{service.title}</h3>

              <p className="service-desc">{service.desc}</p>

              <p className="service-price">{service.price}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;
