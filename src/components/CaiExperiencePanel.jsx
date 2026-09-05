import { experiences } from "../data/experience";

export default function CaiExperiencePanel() {
  return (
    <div className="cai-experience" data-testid="cai-experience">
      <div className="cai-experience-intro">
        <section className="cai-experience-intro-block">
          <h2 className="cai-experience-intro-title">복잡함을 이해하기 쉬운 경험으로 바꿉니다.</h2>
          <p className="cai-experience-intro-copy">
            고밀도 금융·물류 데이터의 정보 구조를 직관적으로 설계하고, LLM 기반 대화형 AI 검색 및 리서치 인터페이스를 구축한 경험이 있습니다. 사용자가 자연스럽게 활용할 수 있는 경험을 고민합니다.
          </p>
        </section>
        <section className="cai-experience-intro-block">
          <h2 className="cai-experience-intro-title">제품과 협업이 함께 확장되는 체계를 만듭니다.</h2>
          <p className="cai-experience-intro-copy">
            다국어 환경에 유연하게 대응할 수 있는 일관되고 유연한 디자인 시스템을 설계하고, AI 도구를 활용해 제품의 일관성과 협업 생산성을 높입니다.
          </p>
        </section>
      </div>

      <section className="cai-career" aria-label="경력 상세">
        {experiences.map((experience) => (
          <details className="cai-career-item" key={experience.company}>
            <summary className="cai-career-summary">
              <div className="cai-career-heading">
                <div className="cai-career-title-row">
                  <h3>{experience.company}</h3>
                  <p className="cai-career-period">{experience.period.replace(/\s*~\s*/, " - ")}</p>
                  <svg className="cai-career-chevron" viewBox="0 0 12 7" aria-hidden="true">
                    <path d="M1 1.25 6 5.75 11 1.25" />
                  </svg>
                </div>
                <p className="cai-career-description">{experience.description}</p>
              </div>
            </summary>
            <div className="cai-career-projects">
              {experience.projects.map((project) => (
                <section key={project.title}>
                  <h4>{project.title}</h4>
                  <ul>{project.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              ))}
            </div>
          </details>
        ))}
      </section>

      <footer className="cai-experience-footer">
        <a href="https://my.surfit.io/w/948478686" target="_blank" rel="noopener noreferrer">Resume</a>
        <a href="mailto:alfo2027@naver.com">alfo2027@naver.com</a>
      </footer>
    </div>
  );
}
