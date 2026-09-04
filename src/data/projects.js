const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const galleryAsset = (number, image = 1) =>
  asset(`assets/project-${String(number).padStart(2, "0")}/project-${String(number).padStart(2, "0")}-${String(image).padStart(2, "0")}.avif`);

const imageSet = (number, title, dimensions) =>
  dimensions.map(([width, height], index) => ({
    src: asset(
      `assets/project-${String(number).padStart(2, "0")}/project-${String(number).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}.avif`,
    ),
    alt:
      index === 0
        ? `${title} 프로젝트 표지`
        : `${title} 프로젝트 상세 화면 ${index + 1}`,
    width,
    height,
  }));

export const projects = [
  {
    slug: "ai-agent",
    company: "bloomingbit",
    title: "AI 에이전트",
    type: "AI Agent, 커뮤니티",
    thumbnail: asset("assets/project-12/project-12-thumb.avif"),
    thumbnailAlt: "AI 에이전트 연결 경험 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 735,
    upcoming: true,
  },
  {
    slug: "analyst",
    company: "bloomingbit",
    title: "크립토 뉴스 분석 AI 애널리스트",
    type: "Crypto, AI, 콘텐츠 UX 개편",
    thumbnail: asset("assets/project-01/project-01-thumb.avif"),
    thumbnailAlt: "크립토 뉴스 분석 AI 애널리스트 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 773,
    galleryThumbnail: galleryAsset(1, 2),
    detailLabel: "크립토 뉴스 분석 AI 애널리스트 포트폴리오",
    intro: {
      headline: "크립토 시장을 더 빠르게 이해하는 AI 애널리스트",
      headlineLines: ["크립토 시장을 더 빠르게", "이해하는 AI 애널리스트"],
      description: "블루밍비트는 한국경제신문이 운영하는 크립토 뉴스·데이터 플랫폼으로, 개인 투자자와 전문 트레이더에게 시장 정보를 제공합니다. 빠르게 쏟아지는 크립토 뉴스 속에서 사용자가 핵심 흐름과 투자 관점을 놓치지 않도록 AI 분석 경험을 설계했습니다. 초단기·중기·장기 관점을 구조화하고 분석 정확도를 함께 시각화해, 복잡한 정보를 더 빠르게 이해하고 다음 행동으로 연결할 수 있도록 개선했습니다.",
    },
    images: imageSet(1, "AI 애널리스트", [
      [3334, 2147], [3334, 1875], [3334, 1875], [3334, 1067],
      [3334, 3774], [3334, 1723], [3334, 3787], [3334, 3904], [3334, 2027],
    ]),
  },
  {
    slug: "bloomingbit-alpha",
    company: "bloomingbit",
    title: "블루밍비트 알파",
    type: "LLM Search, B2B Crypto Terminal",
    thumbnail: asset("assets/project-02/project-02-thumb.avif"),
    thumbnailAlt: "블루밍비트 알파 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    galleryThumbnail: galleryAsset(2, 3),
    detailLabel: "블루밍비트 알파 포트폴리오",
    intro: {
      headline: "전문가의 리서치를 확장하는 AI 크립토 터미널",
      headlineLines: ["전문가의 리서치를 확장하는", "AI 크립토 터미널"],
      description: "블루밍비트 알파는 기관과 프로 트레이더를 위한 B2B 크립토 데이터 터미널입니다. 시장 데이터와 리서치 자료를 한곳에서 탐색하고 빠르게 판단할 수 있도록 서비스 전반의 정보 구조와 인터페이스를 설계했습니다. 특히 LLM 기반 리서치 코파일럿 STAT AI의 검색과 대화 흐름을 구축해, 복잡한 질문도 자연어로 탐색하고 필요한 근거까지 이어서 확인할 수 있도록 했습니다.",
    },
    images: imageSet(2, "블루밍비트 알파", [
      [3334, 1875], [3334, 856], [3334, 2704], [3334, 1875], [3334, 952],
      [3334, 2486], [3334, 3664], [3334, 2867], [3334, 2304], [3334, 4232], [3334, 1691],
    ]),
  },
  {
    slug: "plan-purchase",
    company: "tradlinx",
    title: "플랜 구매 경험 개선",
    type: "B2B SaaS, 결제 프로세스",
    thumbnail: asset("assets/project-03/project-03-thumb.avif"),
    thumbnailAlt: "플랜 구매 경험 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    galleryThumbnail: galleryAsset(3, 5),
    detailLabel: "플랜 구매 경험 개선 포트폴리오",
    intro: {
      headline: "선택의 부담을 줄이고 전환으로 이어지는 구매 경험",
      headlineLines: ["선택의 부담을 줄이고", "전환으로 이어지는 구매 경험"],
      description: "트레드링스는 글로벌 수출입 공급망과 물류 업무를 지원하는 B2B SaaS 기업입니다. 사용자가 서비스 플랜의 차이를 쉽게 이해하고 자신에게 맞는 상품을 선택할 수 있도록 구매 흐름과 주요 화면을 정비했습니다. 이탈 가능성이 높은 지점에는 안내 모달과 프로모션 요소를 배치하고, 비교부터 결제까지의 정보 위계를 단순화해 구매 결정을 자연스럽게 이어갈 수 있도록 개선했습니다.",
    },
    images: imageSet(3, "플랜 구매 경험 개선", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "shipment-report",
    company: "tradlinx",
    title: "정기 선적 리포트",
    type: "B2B2B 솔루션, 이메일 자동화, 리포트 시스템",
    thumbnail: asset("assets/project-04/project-04-thumb.avif"),
    thumbnailAlt: "정기 선적 리포트 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    galleryThumbnail: galleryAsset(4, 5),
    detailLabel: "정기 선적 리포트 포트폴리오",
    intro: {
      headline: "복잡한 선적 현황을 먼저 전달하는 정기 리포트",
      headlineLines: ["복잡한 선적 현황을 먼저 전달하는", "정기 리포트"],
      description: "트레드링스의 물류 데이터를 정기적으로 받아보는 B2B2B 리포트 기능을 설계했습니다. 서로 다른 권한과 목적을 가진 두 유형의 사용자가 수신자와 발송 조건을 명확하게 관리할 수 있도록 설정 모달과 관리 페이지의 흐름을 구조화했습니다. 이메일에서도 핵심 선적 현황을 빠르게 파악할 수 있도록 정보의 우선순위와 리포트 UI를 정리해, 서비스에 접속하지 않아도 필요한 변화를 놓치지 않도록 했습니다.",
    },
    images: imageSet(4, "정기 선적 리포트", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "design-system",
    company: "tradlinx",
    title: "디자인 시스템 공통화",
    type: "디자인 시스템, 컴포넌트 라이브러리",
    thumbnail: asset("assets/project-05/project-05-thumb.avif"),
    thumbnailAlt: "디자인 시스템 공통화 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    galleryThumbnail: galleryAsset(5, 5),
    detailLabel: "디자인 시스템 공통화 포트폴리오",
    intro: {
      headline: "다국어 제품을 일관되게 확장하는 디자인 시스템",
      headlineLines: ["다국어 제품을 일관되게 확장하는", "디자인 시스템"],
      description: "여러 물류 제품과 국문·영문 화면을 함께 운영하는 트레드링스의 디자인 기반을 정비했습니다. 컬러와 타이포그래피 등 Foundation 영역을 베리어블 토큰으로 재구성하고, 반복되는 UI를 공통 컴포넌트와 가이드라인으로 규격화했습니다. 텍스트 베리어블을 활용한 언어 전환 구조까지 연결해 화면별 중복 작업을 줄이고, 디자이너와 개발자가 같은 기준으로 더 빠르게 제품을 확장할 수 있도록 했습니다.",
    },
    images: imageSet(5, "디자인 시스템 공통화", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "schedule-demo",
    company: "tradlinx",
    title: "스케줄 데모 이용률 증대",
    type: "그로스 디자인, 프로모션 UX",
    thumbnail: asset("assets/project-06/project-06-thumb.avif"),
    thumbnailAlt: "스케줄 데모 이용률 증대 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    galleryThumbnail: galleryAsset(6, 1),
    detailLabel: "스케줄 데모 이용률 증대 포트폴리오",
    intro: {
      headline: "필요한 순간 자연스럽게 발견되는 컨설팅 데모",
      headlineLines: ["필요한 순간 자연스럽게 발견되는", "컨설팅 데모"],
      description: "트레드링스의 Free 플랜 사용자가 스케줄 컨설팅 데모의 가치를 더 쉽게 발견하고 신청하도록 접점을 개선했습니다. 기능을 탐색하는 흐름을 방해하지 않으면서도 데모의 존재와 이점을 분명히 전달할 수 있도록 버튼 호버 이미지와 LNB 광고 영역을 제안했습니다. 제한된 화면 안에서 메시지와 시각 요소의 우선순위를 조정해, 사용자의 관심이 자연스럽게 신청 행동으로 이어지도록 설계했습니다.",
    },
    images: imageSet(6, "스케줄 데모 이용률 증대", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "dever-partners",
    company: "dever",
    title: "디버 파트너스 앱 리디자인",
    type: "Logistics, 앱 디자인, UX 개편",
    thumbnail: asset("assets/project-07/project-07-thumb.avif"),
    thumbnailAlt: "디버 파트너스 앱 리디자인 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    galleryThumbnail: galleryAsset(7, 4),
    detailLabel: "디버 파트너스 앱 리디자인 포트폴리오",
    intro: {
      headline: "배송 기사의 실제 업무 흐름에서 다시 만든 파트너스 앱",
      headlineLines: ["배송 기사의 실제 업무 흐름에서 다시 만든", "파트너스 앱"],
      description: "디버 파트너스는 퀵서비스 배송 기사가 배차와 배송 업무를 수행하는 iOS·Android 앱입니다. 현업 사용자를 대상으로 진행한 설문을 바탕으로 자주 쓰는 정보와 행동을 재정의하고, 메인 화면과 주요 업무 흐름을 2.0 버전으로 개편했습니다. 이동 중에도 상태를 빠르게 파악하고 다음 업무를 놓치지 않도록 정보 위계를 단순화했으며, 회원가입 과정도 함께 정비해 첫 진입부터 실제 배송 수행까지 일관된 경험을 만들었습니다.",
    },
    images: imageSet(7, "디버 파트너스 앱 리디자인", Array(7).fill([3334,1876])),
  },
  {
    slug: "dever-order-web",
    company: "dever",
    title: "디버 주문 웹 UX 개선",
    type: "주문·결제 프로세스, 반응형 웹",
    thumbnail: asset("assets/project-08/project-08-thumb.avif"),
    thumbnailAlt: "디버 주문 웹 UX 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    galleryThumbnail: galleryAsset(8, 3),
    detailLabel: "디버 주문 웹 UX 개선 포트폴리오",
    intro: {
      headline: "데이터로 다시 설계한 더 빠르고 명확한 배송 주문",
      headlineLines: ["데이터로 다시 설계한", "더 빠르고 명확한 배송 주문"],
      description: "디버는 퀵서비스 주문부터 배차와 배송 관리까지 연결하는 스마트 물류 플랫폼입니다. Google Analytics에서 확인한 이용 흐름을 바탕으로 주문 과정의 복잡한 단계와 이탈 지점을 살피고, 주문용 웹 2.0의 정보 구조와 UI를 새롭게 설계했습니다. 다양한 화면 크기에서도 입력과 확인 과정이 명확하게 이어지도록 반응형 경험을 정리하고, 공통 디자인 시스템과 QA를 통해 서비스 전반의 일관성도 함께 높였습니다.",
    },
    images: imageSet(8, "디버 주문 웹 UX 개선", Array(7).fill([3334,1876])),
  },
  {
    slug: "dever-alimtalk",
    company: "dever",
    title: "디버 배송 알림톡 UX 개선",
    type: "알림톡 프로세스, 웹뷰",
    thumbnail: asset("assets/project-09/project-09-thumb.avif"),
    thumbnailAlt: "디버 배송 알림톡 UX 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    galleryThumbnail: galleryAsset(9, 3),
    detailLabel: "디버 배송 알림톡 UX 개선 포트폴리오",
    intro: {
      headline: "메시지 안에서 배송 흐름을 끝까지 이어주는 경험",
      headlineLines: ["메시지 안에서 배송 흐름을", "끝까지 이어주는 경험"],
      description: "배송 과정에서 고객이 받는 알림톡과 연결 웹뷰의 사용 경험을 개선했습니다. 작은 메시지 화면에서도 현재 배송 상태와 필요한 행동이 먼저 보이도록 콘텐츠 순서를 정리하고, 알림에서 상세 확인 화면으로 넘어가는 흐름을 간결하게 구성했습니다. 발송 상황과 사용자 상태에 따라 달라지는 화면을 일관된 규칙으로 설계해, 고객이 별도의 설명 없이도 배송 정보를 이해하고 다음 단계로 이동할 수 있도록 했습니다.",
    },
    images: imageSet(9, "디버 배송 알림톡 UX 개선", Array(7).fill([3334,1876])),
  },
  {
    slug: "dever-signup",
    company: "dever",
    title: "디버 회원가입 프로세스 개선",
    type: "회원가입·온보딩 프로세스",
    thumbnail: asset("assets/project-10/project-10-thumb.avif"),
    thumbnailAlt: "디버 회원가입 프로세스 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    galleryThumbnail: galleryAsset(10, 1),
    detailLabel: "디버 회원가입 프로세스 개선 포트폴리오",
    intro: {
      headline: "첫 가입의 망설임을 줄이는 단계별 온보딩",
      headlineLines: ["첫 가입의 망설임을 줄이는", "단계별 온보딩"],
      description: "디버 주문 서비스를 처음 이용하는 사용자가 필요한 정보를 이해하고 가입을 마칠 수 있도록 회원가입 프로세스를 개편했습니다. 기존 이용 데이터와 주문 흐름을 함께 살펴 입력 항목과 단계의 우선순위를 다시 정리하고, 각 단계에서 필요한 안내와 오류 상태를 명확하게 설계했습니다. 가입 이후 주문 경험으로 자연스럽게 연결되도록 화면과 정책을 일관된 구조로 다듬어 초기 진입 과정의 부담을 줄였습니다.",
    },
    images: imageSet(10, "디버 회원가입 프로세스 개선", Array(7).fill([3334,1876])),
  },
  {
    slug: "graphic-visual",
    company: "independent",
    title: "그래픽 디자인 & 3D 비주얼",
    type: "광고 배너, 마케팅 그래픽, 3D 비주얼",
    thumbnail: asset("assets/project-11/project-11-thumb.avif"),
    thumbnailAlt: "그래픽 디자인과 3D 비주얼 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    galleryThumbnail: galleryAsset(11, 4),
    detailLabel: "그래픽 디자인과 3D 비주얼 포트폴리오",
    intro: {
      headline: "브랜드의 인상을 확장하는 그래픽과 3D 비주얼",
      headlineLines: ["브랜드의 인상을 확장하는", "그래픽과 3D 비주얼"],
      description: "서비스와 캠페인의 성격에 맞춰 광고 배너, 소셜 콘텐츠, 마케팅 그래픽과 3D 비주얼을 제작했습니다. 전달해야 할 메시지를 중심으로 형태와 색상, 질감의 규칙을 세우고 각 채널과 화면 크기에 맞게 시각 언어를 확장했습니다. 정적인 그래픽뿐 아니라 캐릭터와 모션, 입체 오브젝트 등 다양한 표현 방식을 활용해 제품의 기능과 브랜드 분위기를 쉽고 인상적으로 전달했습니다.",
    },
    images: imageSet(11, "그래픽 디자인과 3D 비주얼", Array(4).fill([3334,1873])),
  },
];

export const detailProjects = projects.filter(({ upcoming }) => !upcoming);

export const getProjectBySlug = (slug) =>
  detailProjects.find((project) => project.slug === slug);

export const getRelatedProjects = (slug, limit = 4) => {
  const current = getProjectBySlug(slug);
  if (!current) return [];

  const candidates = detailProjects.filter(({ slug: candidateSlug }) => candidateSlug !== slug);
  const sameCompany = candidates.filter(({ company }) => company === current.company);
  const remaining = candidates.filter(({ company }) => company !== current.company);

  return [...sameCompany, ...remaining].slice(0, limit);
};
