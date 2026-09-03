import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Contact from "../components/Contact";
import Experience from "../components/Experience";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import SiteNavigation from "../components/SiteNavigation";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "윤미래 Product Designer";
    const section = location.state?.section;
    if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
  }, [location.state]);

  return (
    <>
      <main id="top" className="page">
        <SiteNavigation />
        <Hero />
        <Projects />
        <Experience />
        <Contact />
        <footer className="footer"><a href="#top">Top</a></footer>
      </main>
    </>
  );
}
