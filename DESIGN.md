# 디자인 가이드 — 개인 포트폴리오

밝은 톤 중심, Pretendard 폰트 기반의 디자이너 포트폴리오.

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

- 콘텐츠 최대 폭: `860px`, 좌우 패딩 `28px`
- 섹션 간격: 상하 `96px`, 구분선 `1px solid var(--line)`
- 모바일(≤620px): 그리드 1열로 전환

## 원칙

- 여백을 콘텐츠처럼 다룬다 (빽빽하게 채우지 않기)
- 강조는 하나씩 (한 화면에 포인트 컬러 남발 금지)
- 애니메이션은 최소 — scroll-behavior smooth 정도

## 컴포넌트

- **Work 카드**: 흰 배경, 1px 보더, radius 14px, hover 시 살짝 떠오름(translateY -4px + 그림자). 카드 전체가 상세 페이지 링크
- **Contact**: 2단 레이아웃(텍스트 + 이미지 4:5), 모바일은 세로 stack

## 결정 로그

변경 있을 때마다 최신순으로 위에 한 줄씩 추가.

- 컬러: Contact 이메일은 블루 대신 회색·작게 / SNS 링크 제거 / 옆에 이미지 추가
- 컬러: 포인트 컬러 코럴 → **블루(#2f6bff)**
- 폰트: **Pretendard** 채택, 밝은(라이트) 톤 확정
