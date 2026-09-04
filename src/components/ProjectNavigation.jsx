import { Link } from "react-router-dom";
import { usePortfolioTheme } from "./PortfolioTheme";

export default function ProjectNavigation() {
  const { dark, toggleTheme } = usePortfolioTheme();

  return (
    <nav className="project-nav" aria-label="상세 페이지 메뉴">
      <Link to="/" state={{ view: "work" }}>Home</Link>
      <Link to="/" state={{ view: "experience" }}>About</Link>
      <button
        type="button"
        className="project-theme-toggle"
        onClick={toggleTheme}
        aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      >
        <span aria-hidden="true" />
      </button>
    </nav>
  );
}
