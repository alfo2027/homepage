import { strengths } from "../data/strengths";

export default function Hero() {
  return (
    <section className="hero" id="about">
      <div className="hero-layout">
        <h1>안녕하세요.<br />디자이너 윤미래입니다.</h1>
        <div className="hero-side">
          <p className="hero-introduction">
            <span className="hero-introduction-line">새로운 기술이나 기능을 탐구하는 것을 좋아합니다.</span>
            <span className="hero-introduction-line">최근에는 더 효율적으로 일하는 방법을 함께 고민하고 있습니다.</span>
          </p>
          <a className="hero-resume-link" href="https://my.surfit.io/w/948478686" target="_blank" rel="noopener noreferrer" aria-label="이력서 새 탭에서 보기">
            Resume <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="hero-strengths">
        {strengths.map((strength, index) => (
          <article className="hero-strength" key={strength.title}>
            <span className="hero-strength-number">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="hero-strength-title">{strength.title}</h3>
            <p className="hero-strength-copy">{strength.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
