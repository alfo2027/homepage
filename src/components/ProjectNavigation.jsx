import { Link } from "react-router-dom";

function Chevron() {
  return (
    <svg className="project-chevron project-chevron-left" aria-hidden="true" viewBox="0 0 16 16">
      <path d="M10 3.5 5.5 8l4.5 4.5" />
    </svg>
  );
}

export default function ProjectNavigation() {
  return (
    <nav className="project-nav" aria-label="상세 페이지 메뉴">
      <Link className="project-back" to="/" state={{ view: "work" }} aria-label="Projects">
        <Chevron /><span>Projects</span>
      </Link>
      <div className="project-menu">
        <Link to="/" state={{ view: "work" }}>Home</Link>
        <Link to="/" state={{ view: "experience" }}>About</Link>
      </div>
    </nav>
  );
}
