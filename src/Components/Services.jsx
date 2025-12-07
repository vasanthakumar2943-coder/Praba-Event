import React from "react";

function Services() {
  const services = [
    {
      id: 1,
      icon: "fa-solid fa-champagne-glasses",
      title: "Wedding Planning",
      desc: "Premium décor, stage setup, floral arrangements, lighting & complete wedding coordination."
    },
    {
      id: 2,
      icon: "fa-solid fa-music",
      title: "DJ & Music Setup",
      desc: "High-quality sound systems, professional DJs, live music & atmosphere lighting."
    },
    {
      id: 3,
      icon: "fa-solid fa-cake-candles",
      title: "Birthday Events",
      desc: "Unique themes, balloon décor, cake table setup, kids entertainment & photography."
    },
    {
      id: 4,
      icon: "fa-solid fa-building",
      title: "Corporate Events",
      desc: "Stage design, LED screens, branding backdrop, sound systems & event coordination."
    },
    {
      id: 5,
      icon: "fa-solid fa-lightbulb",
      title: "Lighting & Effects",
      desc: "Ambient lighting, spotlight arrangement, LED décor, smoke effects & more."
    },
    {
      id: 6,
      icon: "fa-solid fa-people-group",
      title: "Reception Setup",
      desc: "Elegant stage décor, floral arrangements, entrance arch, walkway lights & backdrop design."
    }
  ];

  return (
    <div className="page-section fade-in">

      {/* Page Heading */}
      <h2 className="section-title">Our Services</h2>
      <p className="section-sub">
        We offer a wide range of event services designed to make your special moments truly unforgettable.
      </p>

      {/* Services Grid */}
      <div className="services-section">
        <div className="services-grid">

          {services.map((s) => (
            <div className="service-card zoom-in" key={s.id}>
              <i className={`${s.icon} service-icon`}></i>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default Services;
