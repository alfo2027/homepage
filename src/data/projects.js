const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

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
    title: "크립토 뉴스 분석 AI 애널리스트",
    type: "Crypto, AI, 콘텐츠 UX 개편",
    thumbnail: asset("assets/project-01/project-01-thumb.avif"),
    thumbnailAlt: "크립토 뉴스 분석 AI 애널리스트 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 773,
    detailLabel: "크립토 뉴스 분석 AI 애널리스트 포트폴리오",
    images: imageSet(1, "AI 애널리스트", [
      [3334, 2147], [3334, 1875], [3334, 1875], [3334, 1067],
      [3334, 3774], [3334, 1723], [3334, 3787], [3334, 3904], [3334, 2027],
    ]),
  },
  {
    slug: "bloomingbit-alpha",
    title: "블루밍비트 알파",
    type: "LLM Search, B2B Crypto Terminal",
    thumbnail: asset("assets/project-02/project-02-thumb.avif"),
    thumbnailAlt: "블루밍비트 알파 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    detailLabel: "블루밍비트 알파 포트폴리오",
    images: imageSet(2, "블루밍비트 알파", [
      [3334, 1875], [3334, 856], [3334, 2704], [3334, 1875], [3334, 952],
      [3334, 2486], [3334, 3664], [3334, 2867], [3334, 2304], [3334, 4232], [3334, 1691],
    ]),
  },
  {
    slug: "plan-purchase",
    title: "플랜 구매 경험 개선",
    type: "B2B SaaS, 결제 프로세스",
    thumbnail: asset("assets/project-03/project-03-thumb.avif"),
    thumbnailAlt: "플랜 구매 경험 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    detailLabel: "플랜 구매 경험 개선 포트폴리오",
    images: imageSet(3, "플랜 구매 경험 개선", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "shipment-report",
    title: "정기 선적 리포트",
    type: "B2B2B 솔루션, 이메일 자동화, 리포트 시스템",
    thumbnail: asset("assets/project-04/project-04-thumb.avif"),
    thumbnailAlt: "정기 선적 리포트 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    detailLabel: "정기 선적 리포트 포트폴리오",
    images: imageSet(4, "정기 선적 리포트", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "design-system",
    title: "디자인 시스템 공통화",
    type: "디자인 시스템, 컴포넌트 라이브러리",
    thumbnail: asset("assets/project-05/project-05-thumb.avif"),
    thumbnailAlt: "디자인 시스템 공통화 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    detailLabel: "디자인 시스템 공통화 포트폴리오",
    images: imageSet(5, "디자인 시스템 공통화", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "schedule-demo",
    title: "스케줄 데모 이용률 증대",
    type: "그로스 디자인, 프로모션 UX",
    thumbnail: asset("assets/project-06/project-06-thumb.avif"),
    thumbnailAlt: "스케줄 데모 이용률 증대 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    detailLabel: "스케줄 데모 이용률 증대 포트폴리오",
    images: imageSet(6, "스케줄 데모 이용률 증대", [[3334,1873],[3334,1872],[3334,1872],[3334,1872],[3334,1872],[3334,1872]]),
  },
  {
    slug: "dever-partners",
    title: "디버 파트너스 앱 리디자인",
    type: "Logistics, 앱 디자인, UX 개편",
    thumbnail: asset("assets/project-07/project-07-thumb.avif"),
    thumbnailAlt: "디버 파트너스 앱 리디자인 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    detailLabel: "디버 파트너스 앱 리디자인 포트폴리오",
    images: imageSet(7, "디버 파트너스 앱 리디자인", Array(7).fill([3334,1876])),
  },
  {
    slug: "dever-order-web",
    title: "디버 주문 웹 UX 개선",
    type: "주문·결제 프로세스, 반응형 웹",
    thumbnail: asset("assets/project-08/project-08-thumb.avif"),
    thumbnailAlt: "디버 주문 웹 UX 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    detailLabel: "디버 주문 웹 UX 개선 포트폴리오",
    images: imageSet(8, "디버 주문 웹 UX 개선", Array(7).fill([3334,1876])),
  },
  {
    slug: "dever-alimtalk",
    title: "디버 배송 알림톡 UX 개선",
    type: "알림톡 프로세스, 웹뷰",
    thumbnail: asset("assets/project-09/project-09-thumb.avif"),
    thumbnailAlt: "디버 배송 알림톡 UX 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    detailLabel: "디버 배송 알림톡 UX 개선 포트폴리오",
    images: imageSet(9, "디버 배송 알림톡 UX 개선", Array(7).fill([3334,1876])),
  },
  {
    slug: "dever-signup",
    title: "디버 회원가입 프로세스 개선",
    type: "회원가입·온보딩 프로세스",
    thumbnail: asset("assets/project-10/project-10-thumb.avif"),
    thumbnailAlt: "디버 회원가입 프로세스 개선 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 675,
    detailLabel: "디버 회원가입 프로세스 개선 포트폴리오",
    images: imageSet(10, "디버 회원가입 프로세스 개선", Array(7).fill([3334,1876])),
  },
  {
    slug: "graphic-visual",
    title: "그래픽 디자인 & 3D 비주얼",
    type: "광고 배너, 마케팅 그래픽, 3D 비주얼",
    thumbnail: asset("assets/project-11/project-11-thumb.avif"),
    thumbnailAlt: "그래픽 디자인과 3D 비주얼 프로젝트 표지",
    thumbnailWidth: 1200,
    thumbnailHeight: 674,
    detailLabel: "그래픽 디자인과 3D 비주얼 포트폴리오",
    images: imageSet(11, "그래픽 디자인과 3D 비주얼", Array(4).fill([3334,1873])),
  },
];

export const detailProjects = projects.filter(({ upcoming }) => !upcoming);

export const getProjectBySlug = (slug) =>
  detailProjects.find((project) => project.slug === slug);
