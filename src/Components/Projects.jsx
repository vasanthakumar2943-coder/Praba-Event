import React from "react";

function Projects() {
  const projectList = [
    {
      id: 1,
      title: "Wedding Decoration",
      desc: "Premium floral stage decor, lighting, and elegant arrangements.",
      img: "https://picsum.photos/seed/project1/800/500"
    },
    {
      id: 2,
      title: "Corporate Event Setup",
      desc: "Professional stage, sound system, branding walls & LED backdrop.",
      img: "https://picsum.photos/seed/project2/800/500"
    },
    {
      id: 3,
      title: "Birthday Theme Decor",
      desc: "Creative theme decorations, balloons, cake table setup & more.",
      img: "https://picsum.photos/seed/project3/800/500"
    },
    {
      id: 4,
      title: "Outdoor Event Lighting",
      desc: "Powerful ambient lighting for receptions & open-air events.",
      img: "https://picsum.photos/seed/project4/800/500"
    },
    {
      id: 5,
      title: "Cultural Stage Setup",
      desc: "Traditional stage design, lighting, seating & arrangements.",
      img: "https://picsum.photos/seed/project5/800/500"
    },
    {
      id: 6,
      title: "Grand Opening Decoration",
      desc: "Premium ribbon-cutting stage, backdrop, flowers & signage.",
      img: "https://picsum.photos/seed/project6/800/500"
    }
  ];

  return (
    <div className="page-section fade-in">

      {/* Title */}
      <h2 className="section-title">Our Projects</h2>
      <p className="section-sub">
        A showcase of our finest event works — crafted with passion & perfection.
      </p>

      {/* Project Grid */}
      <div className="projects-section">
        <div className="projects-grid">

          {projectList.map((p) => (
            <div className="project-card zoom-in" key={p.id}>
              <img src={p.img} alt={p.title} className="project-img" />

              <div className="project-info">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}

export default Projects;
