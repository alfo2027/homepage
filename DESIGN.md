# 디자인 가이드 — 개인 포트폴리오

흰색·검정·회색 중심, Pretendard 폰트 기반의 UI/UX·프로덕트 디자이너 포트폴리오.

## 폰트

**Pretendard** (CDN)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
```

```css
font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif;
```

| 용도 | weight | size |
|------|--------|------|
| Hero (h1) | 700 | clamp(2.6rem, 8vw, 5.2rem) |
| About lead | 300 | clamp(1.4rem, 3.4vw, 2.2rem) |
| 본문 | 400 | 1rem |
| 라벨/eyebrow | 600 | 0.8rem, letter-spacing 0.24em, uppercase |

- 큰 제목은 `letter-spacing: -0.03em`으로 조이기
- 라벨류는 넓히기(대문자 + 자간)

## 컬러 (라이트 톤)

```css
:root {
  --bg:     #faf9f6;  /* 배경 - 웜 화이트 */
  --surface:#ffffff;  /* 카드 배경 */
  --fg:     #1a1917;  /* 본문 텍스트 */
  --muted:  #6b6862;  /* 보조 텍스트 */
  --accent: #2f6bff;  /* 포인트 - 블루 */
  --line:   rgba(26, 25, 23, 0.10);  /* 구분선 */
}
```

- 배경은 순백(#fff)보다 살짝 웜한 오프화이트로 눈부심 완화
- 포인트 컬러는 링크·eyebrow·강조에만 절제해서 사용
- 텍스트 대비: fg/bg 대비율 AA 이상 확보
- **Contact 섹션은 예외** — 이메일 링크에 블루를 쓰지 않고 회색(`--muted`)으로, 작게(0.95rem) 처리

## 레이아웃

- 메인 콘텐츠 폭: 화면 전체를 사용하되 좌우 여백을 `clamp(20px, 2vw, 32px)`로 유지
- 섹션은 대형 여백과 `1px solid var(--line)` 구분선으로 분리
- About·Experience는 왼쪽 번호형 라벨과 오른쪽 콘텐츠의 2열 구조
- 모바일(≤620px): 그리드 1열로 전환

## 원칙

- 여백을 콘텐츠처럼 다룬다 (빽빽하게 채우지 않기)
- 강조는 하나씩 (한 화면에 포인트 컬러 남발 금지)
- 애니메이션은 최소 — scroll-behavior smooth 정도

## 컴포넌트

- **Hero**: 왼쪽에 대형 Pretendard 제목과 검은색 pill 연락 버튼, 오른쪽에 보조 설명
- **GNB**: Hero 직후의 inline 헤더와 상단 fixed 헤더를 두 곳에 렌더링. inline 헤더는 스크롤이 1px이라도 발생하면 fade·slide로 숨김. inline 헤더의 원래 경계를 지나면 fixed 헤더가 위에서 나타남
- **Work 카드**: 데스크톱 3열 대표 이미지, 프로젝트명·연도·프로젝트 타입. 태블릿 2열, 모바일 1열. 카드 전체가 상세 페이지 링크
- **Experience**: Services 목록의 정보 위계를 활용한 이력 행. 회사·직책·기간·주요 업무 표시
- **Contact**: 둥근 모서리의 검은색 대형 영역과 흰색 pill 이메일 버튼
- **Contact**: 2단 레이아웃(텍스트 + 이미지 4:5), 모바일은 세로 stack
- **프로젝트 상세**: Quiet Editorial 스타일의 최소 내비게이션, 제목, 포트폴리오 이미지 영역, 목록·이전·다음 링크만 사용
- **상세 이미지**: 긴 이미지 1장과 분할 이미지 여러 장을 모두 지원. 원본 비율을 유지하고 화면 너비에 맞게 축소

## 결정 로그

변경 있을 때마다 최신순으로 위에 한 줄씩 추가.

- GNB 버그 수정: inline 하단 네비게이션은 `scrollY > 0`에서 즉시 숨기고, fixed 상단 네비게이션의 표시 시점은 기존 경계 기준을 유지
- GNB 전환: Hero 아래 inline 헤더와 상단 fixed 헤더를 분리 렌더링하고 `IntersectionObserver`로 표시를 전환. fixed 헤더는 상단 slide·fade 애니메이션 사용
- Hero·GNB: 연락 버튼을 대형 제목 아래로 이동하고 우측에는 보조 텍스트만 배치. GNB는 Hero 직후에서 스크롤 시 상단 sticky
- 메인 재설계: Small Studio 레퍼런스의 대형 타이포·넓은 여백·번호형 섹션 문법을 포트폴리오에 적용하고 Services를 Experience로 변환. 폰트는 Pretendard 유지
- 프로젝트 카드: 레퍼런스처럼 데스크톱 3열 그리드를 사용하고 각 카드에 프로젝트명·연도·프로젝트 타입을 표시
- 정보 구조: 채용 담당자를 위한 UI/UX·프로덕트 디자이너 포트폴리오로, 소개·프로젝트 카드를 갖춘 홈과 피그마 통이미지를 보여주는 최소한의 상세 페이지로 확정
- 스타일: 프로젝트 상세는 Quiet Editorial의 여백·정보 위계를 채택하고 별도의 문제·과정·성과 섹션은 두지 않음

- 레퍼런스 탐색: 기존 페이지는 유지하고 `concepts.html` + 독립 상세 예시 3종(미니멀 에디토리얼 / 볼드 에이전시 / 몰입형 브랜드 스토리)을 선택용 프로토타입으로 추가
- 컬러: Contact 이메일은 블루 대신 회색·작게 / SNS 링크 제거 / 옆에 이미지 추가
- 컬러: 포인트 컬러 코럴 → **블루(#2f6bff)**
- 폰트: **Pretendard** 채택, 밝은(라이트) 톤 확정
