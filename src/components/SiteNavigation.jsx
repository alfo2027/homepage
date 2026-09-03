import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const sections = [
  ["about", "About"],
  ["projects", "Projects"],
  ["experience", "Experience"],
];

function SectionLink({ section, children }) {
  const location = useLocation();

  const handleClick = (event) => {
    if (location.pathname === "/") {
      event.preventDefault();
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Link to="/" state={{ section }} onClick={handleClick}>
      {children}
    </Link>
  );
}

function NavigationContent() {
  return (
    <>
      <div className="nav-links">
        {sections.map(([section, label]) => (
          <SectionLink key={section} section={section}>{label}</SectionLink>
        ))}
      </div>
      <div className="nav-contact">
        <SectionLink section="contact">Contact</SectionLink>
      </div>
    </>
  );
}

export default function SiteNavigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <nav
        className={`site-nav nav-fixed${scrolled ? " is-visible" : ""}`}
        aria-label="주요 메뉴"
        aria-hidden={!scrolled}
        inert={scrolled ? undefined : ""}
      >
        <NavigationContent />
      </nav>
      <nav
        className={`site-nav nav-inline${scrolled ? " is-hidden" : ""}`}
        aria-label="주요 메뉴"
        aria-hidden={scrolled}
        inert={scrolled ? "" : undefined}
      >
        <NavigationContent />
      </nav>
    </>
  );
}
