import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/projects";
import InteractiveOrb from "../components/InteractiveOrb";
import CaiExperiencePanel from "../components/CaiExperiencePanel";
import CustomCursor from "../components/CustomCursor";
import "../concepts/cai.css";

gsap.registerPlugin(ScrollTrigger);

export default function CaiConceptPage() {
  const [dark, setDark] = useState(false);
  const pageRef = useRef(null);
  const scrollRef = useRef(null);
  const progressFillRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const [activeView, setActiveView] = useState("work");

  const scrollHome = (event) => {
    event.preventDefault();
    setActiveView("work");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollRef.current?.scrollTo?.({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  useLayoutEffect(() => {
    document.title = "윤미래 Product Designer";

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

    const isMobileLayout = window.matchMedia("(max-width: 640px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobileLayout || prefersReducedMotion) {
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
          <nav className="cai-side-menu" aria-label="두 번째 콘셉트 메뉴">
            <a href="#cai-grid" className="cai-home" data-cursor="link" onClick={scrollHome}>Home</a>
            <button type="button" data-cursor="link" className={activeView === "experience" ? "is-active" : ""} aria-current={activeView === "experience" ? "page" : undefined} onClick={() => { setActiveView("experience"); scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" }); }}>About</button>
            <button
              type="button"
              className="cai-theme-toggle"
              data-cursor="link"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              <span aria-hidden="true" />
            </button>
          </nav>
        </div>
        <div className="cai-profile">
          <h1>YOON</h1>
          <div className="cai-profile-copy">
            <p>책과 전시, 감도 높은 공간과 물건들에서 새로운 영감을 얻습니다.</p>
            <p>작고 감각적인 것들을 발견해 채우는 즐거움만큼, 깨끗하게 비워진 공간도 좋아합니다.</p>
            <p>디자인도 그렇습니다. 충분히 들여다본 뒤 꼭 필요한 것만 담아 편안한 경험을 만들려 합니다.</p>
          </div>
          <a className="cai-profile-email" href="mailto:alfo2027@naver.com" data-cursor="link">alfo2027@naver.com <span aria-hidden="true">↗</span></a>
        </div>
        <div className="cai-side-bottom">
          <InteractiveOrb dark={dark} progressRef={scrollProgressRef} />
        </div>
        <div className="cai-scroll-progress" role="progressbar" aria-label="프로젝트 스크롤 진행률" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <span ref={progressFillRef} className="cai-scroll-progress-fill" style={{ transform: "scaleY(0)" }} />
        </div>
      </aside>

      <section ref={scrollRef} className="cai-grid-scroll" id="cai-grid" aria-label="프로젝트 세로 목록">
        {activeView === "experience" ? <CaiExperiencePanel /> : <div className="cai-project-grid is-gallery-index">
          {projects.map((project, index) => {
            const card = (
              <>
                <div className="cai-image-wrap">
                  <img draggable={false} src={project.galleryThumbnail ?? project.thumbnail} alt={project.thumbnailAlt} width={project.thumbnailWidth} height={project.thumbnailHeight} loading={index < 4 ? "eager" : "lazy"} />
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
        </div>}
      </section>

    </main>
  );
}
