const strengths = [
  {
    title: "데이터 중심 서비스 & LLM AI 검색 구축 경험",
    copy: "고밀도 금융·물류 데이터의 정보 구조를 직관적으로 설계하고, LLM 기반 대화형 AI 검색 및 리서치 인터페이스를 구축한 경험이 있습니다.",
  },
  {
    title: "글로벌 서비스 및 다국어 시스템 대응 경험",
    copy: "텍스트 베리어블(Variables) 기반으로 다국어 언어 변환 시스템을 구축하고, 다국어 대응을 고려한 유연한 디자인을 합니다.",
  },
  {
    title: "디자인 시스템 구축 및 AI 기반 생산성 향상",
    copy: "컴포넌트와 베리어블 토큰을 체계화하여 시스템을 구축하고, Figma MCP 및 Claude AI를 연동한 디자인 QA와 코드 자동화 등 AI 도구를 활용해 협업과 디자인 생산성을 높입니다.",
  },
];

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
