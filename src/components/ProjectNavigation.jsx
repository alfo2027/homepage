import { useEffect, useState } from "react";
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
    <Link className="project-back" to="/" state={{ section: "projects" }} aria-label="목록으로">
      <Chevron /><span>목록으로</span>
    </Link>
  );
}

export { Chevron };

export default function ProjectNavigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <nav className={`project-nav project-nav-fixed${scrolled ? " is-visible" : ""}`} aria-label="프로젝트 목록으로" aria-hidden={!scrolled} inert={scrolled ? undefined : ""}><ListLink /></nav>
      <nav className={`project-nav project-nav-inline${scrolled ? " is-hidden" : ""}`} aria-label="프로젝트 목록으로" aria-hidden={scrolled} inert={scrolled ? "" : undefined}><ListLink /></nav>
    </>
  );
}
