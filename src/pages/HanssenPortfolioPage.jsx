import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import InteractiveOrb from "../components/InteractiveOrb";
import DotLogo from "../components/DotLogo";
import HomeGalleryRail from "../components/HomeGalleryRail";
import FeaturedWork from "../components/FeaturedWork";
import BlogPanel from "../components/BlogPanel";
import CaiExperiencePanel from "../components/CaiExperiencePanel";
import { posts } from "../data/posts";
import { projects } from "../data/projects";
import { useProjectTransition } from "../components/ProjectTransition";
import { usePortfolioTheme } from "../components/PortfolioTheme";
import "../concepts/cai.css";
import "../concepts/hanssen.css";

const companyNames = { bloomingbit: "Bloomingbit", tradlinx: "TRADLINX", dever: "Dever", independent: "Independent" };

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function HanssenPortfolioPage() {
  const { pathname } = useLocation();
  const { slug } = useParams();
  const { dark, toggleTheme } = usePortfolioTheme();
  const { startProjectTransition } = useProjectTransition();
  const [navCompact, setNavCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const closeButton = useRef(null);
  const previousMenuOpen = useRef(false);
  const scroller = useRef(null);
  const isHome = pathname === "/";
  const dogProgress = useRef(0);
  const isAbout = pathname === "/about";
  const isBlog = pathname.startsWith("/blog");
  const isWork = pathname === "/work";
  const isGallery = isHome || isWork;
  const orderedProjects = [...projects.filter((project) => !project.upcoming), ...projects.filter((project) => project.upcoming)];

  useEffect(() => {
    setMenuOpen(false);
    setNavCompact(false);
    if (scroller.current) scroller.current.scrollTop = 0;
    if (!isBlog) document.title = `${isAbout ? "About — " : isWork ? "Work — " : ""}윤미래 Product Designer`;
  }, [pathname, isAbout, isBlog, isWork]);

  useEffect(() => {
    if (menuOpen) closeButton.current?.focus();
    else if (previousMenuOpen.current) menuButton.current?.focus();
    previousMenuOpen.current = menuOpen;
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setNavCompact(window.scrollY > 32 || (scroller.current?.scrollTop ?? 0) > 32);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handlePanelScroll = (event) => {
    if (!isWork) setNavCompact(event.currentTarget.scrollTop > 32);
  };

  const closeMenu = () => setMenuOpen(false);
  const links = <>
    <Link to="/work" aria-current={isWork || pathname === "/" ? "page" : undefined}>Work</Link>
    <Link to="/about" aria-current={isAbout ? "page" : undefined}>About</Link>
    <Link to="/blog" aria-current={isBlog ? "page" : undefined}>Notes</Link>
  </>;

  return <main className={`h-shell${isGallery ? " h-home" : ""}${isHome ? " h-home-columns h-home-slider" : ""}`} data-testid="hanssen-portfolio">
    <header className="h-navigation" data-compact={navCompact} inert={menuOpen || undefined}>
      <div className="h-nav-inner">
        <div className="h-nav-backdrop" aria-hidden="true" />
        <Link to="/" className="h-brand" aria-label="윤미래 홈"><DotLogo /></Link>
        <nav className="h-desktop-nav" aria-label="주 메뉴">{links}</nav>
        <div className="h-nav-actions">
          <span className="h-nav-balance" aria-hidden="true" />
          <button type="button" className="h-theme-toggle" aria-label={dark ? "라이트 모드" : "다크 모드"} aria-pressed={dark} onClick={toggleTheme}>
            <span className="h-theme-dot" aria-hidden="true" />
          </button>
          <button ref={menuButton} type="button" className="h-menu-trigger" aria-label="메뉴 열기" aria-expanded={menuOpen} aria-controls="h-site-menu" onClick={() => setMenuOpen(true)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h18M3 12h18M3 20h18" /></svg></button>
        </div>
      </div>
    </header>
    <div id="h-site-menu" className="h-menu-overlay" data-open={menuOpen} inert={!menuOpen || undefined} aria-hidden={!menuOpen || undefined} role={menuOpen ? "dialog" : undefined} aria-modal={menuOpen ? true : undefined} aria-label="사이트 메뉴" onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); closeMenu(); }
      if (event.key === "Tab") {
        const focusable = [...event.currentTarget.querySelectorAll("a,button")];
        const first = focusable[0]; const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
      <div className="h-menu-top"><Link to="/" className="h-brand" onClick={closeMenu} aria-label="윤미래 홈"><DotLogo /></Link><button type="button" ref={closeButton} onClick={closeMenu} aria-label="메뉴 닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 5 14 14M5 19 19 5" /></svg></button></div>
      <nav aria-label="모바일 메뉴" onClick={(event) => { if (event.target.closest("a")) closeMenu(); }}><Link to="/">Home</Link>{links}</nav>
      <p>윤미래 · Product Designer<br /><a href="mailto:alfo2027@naver.com">alfo2027@naver.com</a></p>
    </div>
    <div className="h-layout" inert={menuOpen || undefined}>
      {isHome && <>
        <header className="h-slider-intro">
          <h1>복잡한 경험을 명확하게 만들고,<br />사용자의 선택과 행동을 돕습니다</h1>
          <p>윤미래 · Product Designer</p>
        </header>
        <HomeGalleryRail />
      </>}
      {!isGallery && <aside className="h-showcase"><FeaturedWork /></aside>}
      {!isHome && <section className="h-content" tabIndex={isHome ? 0 : undefined} ref={scroller} onScroll={handlePanelScroll} aria-label={isAbout ? "소개 및 경력" : isBlog ? "블로그" : "프로젝트와 소개"}>

        {!isHome && !isWork && !isBlog && <div className="h-intro-grid">
          <Link to="/about" className="h-profile h-panel" aria-label="윤미래 소개">
            <div className="h-profile-heading"><span className="h-avatar" aria-hidden="true">y.</span><div><h1>윤미래</h1><p>Product Designer</p></div><Arrow /></div>
            <p className="h-profile-copy">복잡한 정보를 이해하기 쉽게, 낯선 기능을 자연스럽게 사용자의 다음 행동을 생각하며 명확하고 편안한 경험을 만듭니다</p>
          </Link>
          <div className="h-quick-links">
            <Link to="/work"><span>프로젝트</span><span className="h-link-detail">{projects.length} <Arrow /></span></Link>
            <Link to="/about"><span>소개와 경력</span><Arrow /></Link>
            <Link to="/blog"><span>생각과 기록</span><Arrow /></Link>
            <a href="https://my.surfit.io/w/948478686" target="_blank" rel="noopener noreferrer"><span>이력서</span><Arrow /></a>
            <a className="h-contact-link" href="mailto:alfo2027@naver.com"><span>Contact Me</span><span aria-hidden="true">↗</span></a>
          </div>
        </div>}
        {isBlog ? <div className="h-blog h-panel"><BlogPanel key={pathname} slug={slug} /></div> : isAbout ? <div className="h-about h-panel">
          <div className="h-about-dog"><InteractiveOrb dark={dark} progressRef={dogProgress} /></div>
          <header><h2>About me</h2><p>충분히 들여다본 뒤,<br />꼭 필요한 것을 담습니다.</p><span>책과 전시, 감도 높은 공간과 물건들에서 새로운 영감을 얻습니다. 작고 감각적인 것들을 발견해 채우는 즐거움만큼, 깨끗하게 비워진 공간도 좋아합니다.</span></header>
          <CaiExperiencePanel />
        </div> : <>
          {isHome && <header className="h-apple-work-heading"><h2>사용자의 문제를 더 나은 경험으로</h2><Link to="/work">모든 작업 보기 ↗</Link></header>}
          <div className="h-project-list"><div className="h-project-grid">{orderedProjects.map((project, index) => {
            const contents = <><div className="h-work-image" data-project-frame><img src={project.galleryThumbnail ?? project.thumbnail} alt="" width={1200} height={900} loading={isHome && index < 2 ? "eager" : "lazy"} draggable={false} />{project.upcoming ? <span className="h-upcoming">Coming soon<span className="h-work-overlay-footer"><span>{project.type}</span></span></span> : <div className="h-work-overlay">
              <span className="h-work-hover-title">{project.title}</span>
              <span className="h-work-meta">{project.type}</span>
            </div>}</div><span className="h-work-caption-meta"><span className="h-work-company">{companyNames[project.company] ?? project.company}</span>{project.year && <span className="h-work-date">{project.year}</span>}</span><span className="h-work-label">{project.cardTitle ?? project.title}</span></>;
            return project.upcoming ? <article className="h-project-card is-upcoming" key={project.slug}>{contents}</article> : <Link className="h-project-card" key={project.slug} to={`/projects/${project.slug}`} aria-label={project.cardTitle ?? project.title} onClick={(event) => startProjectTransition(event, project)}>{contents}</Link>;
          })}</div></div>
        </>}
        {!isGallery && <footer className="h-footer h-panel"><div><strong>함께 이야기해요</strong><a href="mailto:alfo2027@naver.com">alfo2027@naver.com <Arrow /></a></div><span>© {new Date().getFullYear()} Yoon Mirae</span><Link to="/about">About me <Arrow /></Link></footer>}
      </section>}


    </div>
  </main>;
}
