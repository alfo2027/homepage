import { useEffect } from "react";
import { Link } from "react-router-dom";
import { experiences } from "../data/experience";
import { projects } from "../data/projects";
import "../concepts/colabs.css";

const strengths = [
  ["Data to clarity", "복잡한 금융·물류 데이터를 빠르게 판단할 수 있는 제품 경험으로 정리합니다."],
  ["AI, made useful", "LLM 검색과 AI 에이전트를 실제 탐색과 업무 흐름에 연결합니다."],
  ["Systems that scale", "다국어 디자인 시스템과 AI 도구로 제품과 협업 방식을 함께 확장합니다."],
];

export default function ColabsConceptPage() {
  useEffect(() => {
    document.title = "Portfolio_Yoon — Concept 01";
  }, []);

  return (
    <main className="co-concept" data-testid="colabs-concept" id="concept-top">
      <header className="co-nav">
        <span className="co-nav-mark">YM®</span>
        <nav aria-label="콘셉트 페이지 메뉴">
          <a href="#concept-work">Projects</a>
          <a href="#concept-about">About</a>
          <a href="#concept-experience">Experience</a>
        </nav>
        <a className="co-contact-pill" href="mailto:alfo2027@naver.com">Contact ↗</a>
      </header>

      <section className="co-hero">
        <div className="co-kicker"><span /> Product designer · Seoul</div>
        <h1>안녕하세요.<br />디자이너 윤미래입니다.</h1>
        <div className="co-hero-bottom">
          <p>새로운 기술이나 기능을 탐구하는 것을 좋아합니다.<br />최근에는 더 효율적으로 일하는 방법을 함께 고민하고 있습니다.</p>
          <a href="#concept-work" aria-label="프로젝트 섹션으로 이동">Selected work <span>↓</span></a>
        </div>
      </section>

      <div className="co-marquee" aria-hidden="true">
        <div>PRODUCT DESIGN · AI EXPERIENCE · DESIGN SYSTEM · PRODUCT DESIGN · AI EXPERIENCE · DESIGN SYSTEM ·</div>
      </div>

      <section className="co-projects" id="concept-work">
        <div className="co-section-head">
          <p>Selected projects</p>
          <h2>제품의 복잡함을<br />명료한 경험으로.</h2>
          <span>12 projects</span>
        </div>
        <div className="co-project-grid">
          {projects.map((project, index) => {
            const content = (
              <>
                <div className="co-project-media">
                  <img draggable={false} src={project.thumbnail} alt={project.thumbnailAlt} width={project.thumbnailWidth} height={project.thumbnailHeight} loading={index < 3 ? "eager" : "lazy"} />
                  <span className="co-project-index">{String(index + 1).padStart(2, "0")}</span>
                  {project.upcoming && <span className="co-upcoming">UPCOMING</span>}
                </div>
                <div className="co-project-meta">
                  <h3>{project.title}</h3>
                  <p>{project.type}</p>
                  {!project.upcoming && <span aria-hidden="true">↗</span>}
                </div>
              </>
            );
            return project.upcoming ? (
              <article className="co-project-card is-upcoming" data-testid="concept-project" key={project.slug}>{content}</article>
            ) : (
              <Link className="co-project-card" data-testid="concept-project" key={project.slug} to={`/projects/${project.slug}`}>{content}</Link>
            );
          })}
        </div>
      </section>

      <section className="co-about" id="concept-about">
        <div className="co-about-intro">
          <p>What I bring</p>
          <h2>기술이 가능하게 하는 것과<br />사람에게 필요한 것 사이를<br />디자인합니다.</h2>
          <a href="https://my.surfit.io/w/948478686" target="_blank" rel="noreferrer">Resume ↗</a>
        </div>
        <ol className="co-strength-list">
          {strengths.map(([title, copy], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="co-experience" id="concept-experience">
        <div className="co-section-head is-dark">
          <p>Experience</p>
          <h2>다양한 도메인에서<br />쌓아온 제품 경험.</h2>
          <span>2020 — 2026</span>
        </div>
        <div className="co-experience-list">
          {experiences.map((experience) => (
            <details data-testid="concept-experience" key={experience.company}>
              <summary>
                <span>{experience.company}</span>
                <span>{experience.period}</span>
                <span className="co-experience-toggle">+</span>
              </summary>
              <div className="co-experience-body">
                <p>{experience.description}</p>
                <div>
                  {experience.projects.map((project) => (
                    <section key={project.title}>
                      <h3>{project.title}</h3>
                      {project.items.map((item) => <p key={item}>{item}</p>)}
                    </section>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer className="co-footer">
        <p>함께 만들 프로젝트가 있다면,<br /><a href="mailto:alfo2027@naver.com">이야기를 들려주세요. ↗</a></p>
        <div><a href="tel:01057045376">010.5704.5376</a><a href="#concept-top">Back to top ↑</a></div>
        <Link className="co-back-original" to="/" aria-label="기존 디자인으로 돌아가기">Original design ←</Link>
      </footer>
    </main>
  );
}
