import useReveal from "../hooks/useReveal";
import "../index.css";

function Projects() {
  useReveal();

  const projects = [
    {
      title: "Grand Wedding Celebration",
      desc: "Royal theme wedding décor with stage design, lighting, floral backdrop, and complete event coordination.",
      img: "/assets/p1.jpg",
    },
    {
      title: "Corporate Annual Meet",
      desc: "Professional stage setup, LED wall, sound system, seating arrangement, and event flow management.",
      img: "/assets/p2.jpg",
    },
    {
      title: "Kids Birthday Theme",
      desc: "Cartoon themed decoration, balloon arch, cake table décor, return gifts, and fun activities.",
      img: "/assets/p3.jpg",
    },
    {
      title: "Baby Shower Event",
      desc: "Elegant baby shower decoration with pastel theme, props, backdrop, and photography.",
      img: "/assets/p4.jpg",
    },
    {
      title: "Outdoor Reception",
      desc: "Grand outdoor reception with floral décor, stage lighting, walkway setup, and premium seating.",
      img: "/assets/p5.jpg",
    },
    {
      title: "Cultural Function",
      desc: "Traditional backdrop, lighting setup, seating, and stage decor for cultural programs.",
      img: "/assets/p6.jpg",
    },
  ];

  return (
    <div>

      {/* ⭐ PROJECTS HEADER */}
      <section className="projects-hero reveal" style={{ textAlign: "center", paddingTop: "30px" }}>
        <h1 className="section-title">Our Event Projects</h1>
        <p className="projects-subtitle">
          A showcase of beautifully designed and professionally executed events.
        </p>
      </section>

      {/* ⭐ PROJECTS GRID */}
      <section className="projects-section reveal">
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card" key={i}>
              <img src={p.img} alt={p.title} className="project-img" />

              <div className="project-info">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Projects;
