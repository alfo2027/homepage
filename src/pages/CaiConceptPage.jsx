import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/projects";
import InteractiveOrb from "../components/InteractiveOrb";
import CustomCursor from "../components/CustomCursor";
import RiveThemeToggle from "../components/RiveThemeToggle";
import "../concepts/cai.css";

gsap.registerPlugin(ScrollTrigger);

export default function CaiConceptPage() {
  const [dark, setDark] = useState(false);
  const pageRef = useRef(null);
  const scrollRef = useRef(null);
  const progressFillRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [activeProject, setActiveProject] = useState(0);

  useLayoutEffect(() => {
    document.title = "윤미래 Product Designer — Concept 02";

    const updateProgress = () => {
      const scroller = scrollRef.current;
      if (!scroller) return;
      const availableScroll = scroller.scrollHeight - scroller.clientHeight;
      const progress = availableScroll > 0 ? scroller.scrollTop / availableScroll : 0;
      scrollProgressRef.current = progress;
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleY(${progress})`;
        progressFillRef.current.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
      }
    };

    const scroller = scrollRef.current;
    scroller?.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => scroller?.removeEventListener("scroll", updateProgress);
    }

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray(".cai-project");
      cards.forEach((card, index) => {
        gsap.fromTo(card.querySelector(".cai-image-wrap"), { autoAlpha: 0, y: 52 }, {
          autoAlpha: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            scroller: scrollRef.current,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });

        ScrollTrigger.create({
          trigger: card,
          scroller: scrollRef.current,
          start: "center 64%",
          end: "center 36%",
          toggleClass: "is-active",
          onEnter: () => setActiveProject(index),
          onEnterBack: () => setActiveProject(index),
        });
      });

      [
        [".cai-project:nth-child(odd)", 76],
        [".cai-project:nth-child(even)", -76],
      ].forEach(([selector, y]) => {
        gsap.to(selector, {
          y,
          ease: "none",
          scrollTrigger: {
            trigger: ".cai-project-grid",
            scroller: scrollRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });
      });

    }, pageRef);

    return () => {
      scroller?.removeEventListener("scroll", updateProgress);
      context.revert();
    };
  }, []);

  return (
    <main ref={pageRef} className={`cai-concept${dark ? " is-dark" : ""}`} data-testid="cai-concept">
      <CustomCursor />
      <aside className="cai-side cai-side-left">
        <div className="cai-side-top">
          <a href="#cai-grid" className="cai-home" data-cursor="link">Home</a>
          <nav className="cai-side-menu" aria-label="두 번째 콘셉트 메뉴">
            <a href="#cai-grid" aria-current="page" data-cursor="link">Work</a>
            <Link to="/" state={{ section: "about" }} data-cursor="link">About</Link>
            <Link to="/" state={{ section: "experience" }} data-cursor="link">Experience</Link>
          </nav>
          <div className="cai-profile">
            <h1>윤미래</h1>
            <p>새로운 기술이나 기능을 탐구하는 것을 좋아합니다.<br />최근에는 더 효율적으로 일하는 방법을 함께 고민하고 있습니다.</p>
          </div>
          <InteractiveOrb dark={dark} progressRef={scrollProgressRef} />
        </div>
        <div className="cai-side-bottom">
          <RiveThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
          <p>{String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
        </div>
        <div className="cai-scroll-progress" role="progressbar" aria-label="프로젝트 스크롤 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <span ref={progressFillRef} className="cai-scroll-progress-fill" style={{ transform: "scaleY(0)" }} />
        </div>
      </aside>

      <section ref={scrollRef} className="cai-grid-scroll" id="cai-grid" aria-label="프로젝트 세로 목록">
        <div className="cai-project-grid has-scroll-rhythm">
          {projects.map((project, index) => {
            const card = (
              <>
                <div className="cai-image-wrap">
                  <img draggable={false} src={project.thumbnail} alt={project.thumbnailAlt} width={project.thumbnailWidth} height={project.thumbnailHeight} loading={index < 4 ? "eager" : "lazy"} />
                  {project.upcoming && <span>UPCOMING</span>}
                </div>
                <div className="cai-project-copy">
                  <h2>{project.title}</h2>
                  <p>{project.type}</p>
                </div>
              </>
            );
            return project.upcoming ? (
              <article className="cai-project is-upcoming" data-testid="cai-project" key={project.slug}>{card}</article>
            ) : (
              <Link className="cai-project" data-cursor="project" data-testid="cai-project" key={project.slug} to={`/projects/${project.slug}`}>{card}</Link>
            );
          })}
        </div>
      </section>

    </main>
  );
}
