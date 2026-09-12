import { experiences } from "../data/experience";

const strengths = [
  {
    title: "복잡한 정보에서 중요한 흐름을 찾습니다",
    copy: "금융·물류 데이터처럼 정보가 많고 낯설게 느껴질 수 있는 화면을 설계해왔습니다. 사용자가 무엇부터 살펴봐야 할지 알 수 있도록 정보의 순서와 강조점을 정리하고, 필요할 때 세부 내용을 찾아볼 수 있도록 구성했습니다. 많은 정보를 다루는 작업에서도 사용자가 이해하고 선택하는 흐름을 중요하게 생각합니다.",
  },
  {
    title: "서비스의 성격과 사용자에 맞는 표현을 설계합니다",
    copy: "서비스의 목적과 사용자의 상황에 따라 어울리는 언어와 시각적 표현을 고민합니다. 정확한 정보 전달이 중요한 서비스에서는 명확하고 신뢰감 있게, 일상에서 만나는 서비스에서는 편안한 문구로 다듬고 캐릭터와 그래픽 요소로 친근함을 담습니다.",
  },
  {
    title: "제품의 확장과 팀의 협업을 돕는 체계를 만듭니다",
    copy: "여러 제품과 언어에 공통으로 사용할 수 있는 컴포넌트와 디자인 기준을 정리합니다. 함께 일하는 사람들이 같은 기준을 바탕으로 작업하고, 반복되는 수정을 줄일 수 있는 구조를 고민합니다. 최근에는 AI를 활용한 디자인 QA 자동화와 컴포넌트 퍼블리싱 자동화를 테스트하며 디자인을 구현하고 검토하는 과정에서도 반복 작업을 줄일 방법을 탐색하고 있습니다.",
  },
  {
    title: "모호한 요구를 자연스러운 실제 흐름으로 구체화합니다",
    copy: "서비스 목표와 요구사항을 바탕으로, 사용자가 이를 처음 만나고 활용하기까지의 과정을 구체화합니다. 어떤 안내가 필요하고, 무엇을 선택한 뒤 어디로 이어져야 하는지 살펴보며 서비스가 제공하려는 가치가 실제 사용 과정에서도 전달될 수 있도록 고민합니다.",
  },
  {
    title: "결과를 확인하고 개선합니다",
    copy: "출시 이후에는 이용 지표와 고객 문의를 살펴보며 예상과 실제 사용 사이의 차이를 확인합니다. 기능을 발견하기 어렵거나 다음 단계로 넘어가지 못하는 흐름에서는 정보가 보이는 위치와 안내 방식, 필요한 행동을 살피며 경험을 다듬어갑니다.",
  },
];

export default function CaiExperiencePanel() {
  return (
    <div className="cai-experience" data-testid="cai-experience">
      <div className="cai-experience-intro">
        <section className="cai-experience-intro-block">
          <h2 className="cai-experience-intro-title">복잡한 경험을 명확하게 만들고, 사용자의 선택과 행동을 돕습니다</h2>
          <p className="cai-experience-intro-copy">
            서비스마다 다른 사용자의 목적과 상황을 살피며, 제품을 쉽게 이해하고 자연스럽게 이용할 수 있는 흐름을 고민합니다.
          </p>
        </section>
        <div className="cai-experience-links">
          <a href="https://my.surfit.io/w/948478686" target="_blank" rel="noopener noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
          <a href="mailto:alfo2027@naver.com">
            alfo2027@naver.com <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <section className="cai-experience-strengths" aria-labelledby="cai-strengths-title">
        <h2 id="cai-strengths-title">이런 강점과 경험이 있습니다</h2>
        <div className="cai-experience-strength-grid">
          {strengths.map((strength) => (
            <article className="cai-experience-strength" key={strength.title}>
              <h3>{strength.title}</h3>
              <p>{strength.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cai-career" aria-label="경력 상세">
        <h2>Experience</h2>
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
    </div>
  );
}
