import { experiences } from "../data/experience";

export default function Experience() {
  return (
    <section className="editorial" id="experience">
      <div className="indexed-label"><h2 className="section-label">Experience</h2></div>
      <div className="editorial-content">
        <div className="experience-list">
          {experiences.map((experience) => (
            <details className="experience-item" key={experience.company}>
              <summary className="experience-summary">
                <span className="experience-company">{experience.company}</span>
                <span className="experience-period">{experience.period}</span>
                <span className="experience-description">{experience.description}</span>
                <span className="experience-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="experience-details">
                {experience.projects.map((project) => (
                  <section className="experience-project" key={project.title}>
                    <h3>{project.title}</h3>
                    <ul>{project.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  </section>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
