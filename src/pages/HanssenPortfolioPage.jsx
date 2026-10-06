import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PortfolioNavigation from "../components/PortfolioNavigation";
import FeaturedWork from "../components/FeaturedWork";
import NoteList from "../components/NoteList";
import BlogPanel from "../components/BlogPanel";
import CaiExperiencePanel from "../components/CaiExperiencePanel";
import { posts } from "../data/posts";
import { projects } from "../data/projects";
import { useProjectTransition } from "../components/ProjectTransition";
import "../concepts/cai.css";
import "../concepts/hanssen.css";

import { companyNames } from "../data/companyNames";

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function HanssenPortfolioPage() {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const { startProjectTransition } = useProjectTransition();
  const [navCompact, setNavCompact] = useState(() => window.scrollY > 32);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const scroller = useRef(null);
  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const isBlog = pathname.startsWith("/blog");
  const isNotesIndex = pathname === "/blog";
  const isWork = pathname === "/work";
  const isGallery = isHome || isWork;
  const orderedProjects = [...projects.filter((project) => !project.upcoming), ...projects.filter((project) => project.upcoming)];

  useEffect(() => {
    setMenuOpen(false);
    setProjectsExpanded(false);
    if (scroller.current) scroller.current.scrollTop = 0;
    if (isNotesIndex) document.title = "Notes — 윤미래";
    if (!isBlog) document.title = `${isAbout ? "About — " : isWork ? "Work — " : ""}윤미래 Product Designer`;
  }, [pathname, isAbout, isBlog, isWork, isNotesIndex]);

  useLayoutEffect(() => {
    const handleScroll = () => setNavCompact(window.scrollY > 32 || (scroller.current?.scrollTop ?? 0) > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handlePanelScroll = (event) => {
    if (!isWork) setNavCompact(event.currentTarget.scrollTop > 32);
  };

  return <main className={`h-shell${isGallery ? " h-home" : ""}${isWork ? " h-work-page" : ""}${isHome ? " h-home-columns h-home-fixed-intro" : ""}${isAbout ? " h-about-centered" : ""}${isNotesIndex ? " h-notes-index" : ""}${isBlog && !isNotesIndex ? " h-note-detail" : ""}`} data-testid="hanssen-portfolio">
    <PortfolioNavigation navCompact={navCompact} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <div className="h-layout" inert={menuOpen || undefined}>
      {isHome && <aside className="h-fixed-introduction" aria-label="윤미래 소개">
        <div className="h-restored-info">
          <h1 className="h-intro-name">ria.yoon</h1>
          <p className="h-intro-role">product designer</p>
          <h2 className="h-intro-tagline">복잡함을 명확하게</h2>
          <p>뉴스·커뮤니티, AI 기반 서비스, SaaS 대시보드와 물류 플랫폼에서 제품을 설계해왔습니다.</p>
          <p>사용자의 목적과 상황을 살피며, 제품을 쉽게 이해하고 자연스럽게 이용할 수 있는 흐름을 고민합니다.</p>
          <Link className="h-feed-more h-intro-more" to="/about" aria-label="소개 더 보기"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><path d="M8 2v12M2 8h12" /></svg></Link>
        </div>
        <nav className="h-sidebar-links" aria-label="이력서와 연락처">
          <a href="https://my.surfit.io/w/948478686" target="_blank" rel="noopener noreferrer">Resume</a>
          <a href="mailto:alfo2027@naver.com">Contact</a>
        </nav>
      </aside>}
      {!isGallery && !isAbout && !isBlog && <aside className="h-showcase"><FeaturedWork /></aside>}
      <section className="h-content" tabIndex={isHome ? 0 : undefined} ref={scroller} onScroll={handlePanelScroll} aria-label={isAbout ? "소개 및 경력" : isBlog ? "블로그" : "프로젝트와 소개"}>

        {isNotesIndex ? <section className="h-notes-page" aria-labelledby="notes-page-title">
          <h1 id="notes-page-title">Notes</h1>
          <NoteList posts={posts} headingTag="h2" />
        </section> : isBlog ? <div className="h-blog h-panel"><BlogPanel key={pathname} slug={slug} /></div> : isAbout ? <div className="h-about h-panel">
          <section className="h-about-profile" aria-label="디자이너 소개">
            <div className="h-about-photo-column">
              <img draggable={false} decoding="async" className="h-about-photo" src={`${import.meta.env.BASE_URL}assets/about/ria-photo.avif`} alt="강가 풍경을 바라보는 리아" width="660" height="880" />
              <nav className="h-about-actions" aria-label="이력서와 메일">
                <a href="https://my.surfit.io/w/948478686" target="_blank" rel="noopener noreferrer">Resume</a>
                <a href="mailto:alfo2027@naver.com">alfo2027@naver.com</a>
              </nav>
            </div>
            <div className="h-about-statement-copy">
              <p>뉴스·커뮤니티, AI 기반 서비스, SaaS 대시보드와 물류 플랫폼에서 웹과 모바일 앱을 설계했습니다.<br />콘텐츠를 탐색하는 서비스부터 전문적인 데이터와 복잡한 업무 흐름을 다루는 제품까지 경험하며, 낯선 도메인의 핵심을 파악하고 사용자가 이해하기 쉬운 구조로 풀어내는 데 강점을 갖췄습니다. 제품의 목표와 사용자의 니즈를 함께 고려해 명확한 경험을 전달하는 디자인을 합니다.</p>
            </div>
          </section>
          <section className="h-about-statement">
            <p>책과 전시, 감도 높은 공간과 물건들에서<br />
              새로운 영감을 얻습니다.<br />
              작고 감각적인 것들을 발견해 채우는 즐거움만큼,<br />
              깨끗하게 비워진 공간도 좋아합니다.<br />
              디자인도 그렇습니다. 충분히 들여다본 뒤<br />
              꼭 필요한 것만 담아 편안한 경험을 만들려 합니다.</p>
          </section>
          <CaiExperiencePanel showIntro={false} showStrengths={false} />
        </div> : <>
          {isHome && <header className="h-feed-heading">
            <h2>Work</h2>
            <Link className="h-feed-more" to="/work" aria-label="모든 작업 보기"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><path d="M8 2v12M2 8h12" /></svg></Link>
          </header>}
          <div className="h-project-list" data-expanded={isHome ? projectsExpanded : undefined}><div className="h-project-grid" id="portfolio-projects">{orderedProjects.map((project, index) => {
            const contents = <><div className="h-work-image" data-project-frame><img src={project.galleryThumbnail ?? project.thumbnail} alt="" width={1200} height={900} loading={isHome && index < 2 ? "eager" : "lazy"} draggable={false} />{project.upcoming ? <div className="h-work-overlay h-work-overlay--upcoming"><span className="h-work-hover-title">Coming soon</span><span className="h-work-meta">{project.type}</span></div> : <div className="h-work-overlay">
              <span className="h-work-hover-title">{project.title}</span>
              <span className="h-work-meta">{project.type}</span>
            </div>}</div><span className="h-work-caption-meta"><span className="h-work-company">{companyNames[project.company] ?? project.company}</span>{project.year && <span className="h-work-date">{project.year}</span>}</span><span className="h-work-label">{project.cardTitle ?? project.title}</span></>;
            return project.upcoming ? <article className="h-project-card is-upcoming" key={project.slug}>{contents}</article> : <Link className="h-project-card" key={project.slug} to={`/projects/${project.slug}`} aria-label={project.cardTitle ?? project.title} onClick={(event) => startProjectTransition(event, project)}>{contents}</Link>;
          })}</div>
          {isHome && !projectsExpanded && orderedProjects.length > 4 && <button type="button" className="h-projects-expand" aria-expanded={projectsExpanded} aria-controls="portfolio-projects" onClick={() => setProjectsExpanded(true)}>
            More
          </button>}
          </div>
        </>}
        {isHome && <section className="h-home-notes" aria-labelledby="home-notes-title">
          <div className="h-feed-heading"><h2 id="home-notes-title">Notes</h2><Link className="h-feed-more" to="/blog" aria-label="모든 글 보기"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true"><path d="M8 2v12M2 8h12" /></svg></Link></div>
          <NoteList posts={posts.slice(0, 3)} />
        </section>}
        {!isGallery && !isAbout && !isBlog && <footer className="h-footer h-panel"><div><strong>함께 이야기해요</strong><a href="mailto:alfo2027@naver.com">alfo2027@naver.com <Arrow /></a></div><span>© {new Date().getFullYear()} Yoon Mirae</span><Link to="/about">About me <Arrow /></Link></footer>}
      </section>


    </div>
  </main>;
}
