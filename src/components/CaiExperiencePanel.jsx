import { experiences } from "../data/experience";
import { strengths } from "../data/strengths";

export default function CaiExperiencePanel() {
  return (
    <div className="cai-experience" data-testid="cai-experience">
      <header className="cai-experience-header">
        <span>PROFILE / EXPERIENCE</span>
        <h2>Experience</h2>
      </header>

      <section className="cai-experience-strengths" aria-label="핵심 역량">
        {strengths.map((strength, index) => (
          <article className="cai-experience-strength" key={strength.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{strength.title}</h3>
            <p>{strength.copy}</p>
          </article>
        ))}
      </section>

      <section className="cai-career" aria-label="경력 상세">
        {experiences.map((experience) => (
          <article className="cai-career-item" key={experience.company}>
            <div className="cai-career-summary">
              <p className="cai-career-period">{experience.period}</p>
              <h3>{experience.company}</h3>
              <p>{experience.description}</p>
            </div>
            <div className="cai-career-projects">
              {experience.projects.map((project) => (
                <section key={project.title}>
                  <h4>{project.title}</h4>
                  <ul>{project.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </section>

      <footer className="cai-experience-footer">
        <a href="https://my.surfit.io/w/948478686" target="_blank" rel="noopener noreferrer">Resume ↗</a>
        <a href="mailto:alfo2027@naver.com">alfo2027@naver.com ↗</a>
      </footer>
    </div>
  );
}
