import { Link } from "react-router-dom";

function Chevron({ direction = "left" }) {
  return (
    <svg className={`project-chevron project-chevron-${direction}`} aria-hidden="true" viewBox="0 0 16 16">
      <path d={direction === "left" ? "M10 3.5 5.5 8l4.5 4.5" : "m6 3.5 4.5 4.5L6 12.5"} />
    </svg>
  );
}

function ListLink() {
  return (
    <Link className="project-back" to="/" state={{ view: "work" }} aria-label="Projects">
      <Chevron /><span>Projects</span>
    </Link>
  );
}

function NavigationContent() {
  return (
    <>
      <ListLink />
      <div className="project-menu">
        <Link to="/" state={{ view: "work" }}>Home</Link>
        <Link to="/" state={{ view: "experience" }}>Experience</Link>
      </div>
    </>
  );
}

export { Chevron };

export default function ProjectNavigation() {
  return (
    <nav className="project-nav" aria-label="상세 페이지 메뉴"><NavigationContent /></nav>
  );
}
