import { Link } from "react-router-dom";

export default function ProjectNavigation() {
  return (
    <nav className="project-nav" aria-label="상세 페이지 메뉴">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
