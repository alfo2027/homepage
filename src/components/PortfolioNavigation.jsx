import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DotLogo from "./DotLogo";
import { usePortfolioTheme } from "./PortfolioTheme";
import "../concepts/hanssen.css";

export default function PortfolioNavigation({ navCompact, menuOpen, setMenuOpen }) {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    const reveal = () => {
      firstFrame = requestAnimationFrame(() => {
        // Allow native scroll restoration and its scroll event to settle first.
        secondFrame = requestAnimationFrame(() => setReady(true));
      });
    };
    if (document.readyState === "complete") reveal();
    else window.addEventListener("load", reveal, { once: true });
    return () => {
      window.removeEventListener("load", reveal);
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);
  const { dark, toggleTheme } = usePortfolioTheme();
  const menuButton = useRef(null);
  const closeButton = useRef(null);
  const previousMenuOpen = useRef(false);
  const isWork = pathname === "/work" || pathname.startsWith("/projects/");
  const isAbout = pathname === "/about";
  const isBlog = pathname.startsWith("/blog");
  useEffect(() => { setMenuOpen(false); }, [pathname, setMenuOpen]);
  useEffect(() => {
    if (menuOpen) closeButton.current?.focus();
    else if (previousMenuOpen.current) menuButton.current?.focus();
    previousMenuOpen.current = menuOpen;
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const returnHome = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    closeMenu();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  const links = <>
    <Link to="/work" aria-current={isWork || pathname === "/" ? "page" : undefined}>Work</Link>
    <Link to="/about" aria-current={isAbout ? "page" : undefined}>About</Link>
    <Link to="/blog" aria-current={isBlog ? "page" : undefined}>Notes</Link>
  </>;

  return <>
    <header className="h-navigation" data-compact={navCompact} data-ready={ready} inert={menuOpen || undefined}>
      <div className="h-nav-inner">
        <div className="h-nav-backdrop" aria-hidden="true" />
        <Link to="/" className="h-brand" onClick={returnHome} aria-label="윤미래 홈"><DotLogo key={pathname} playOnEnter /></Link>
        <nav className="h-desktop-nav" aria-label="주 메뉴">{links}</nav>
        <div className="h-nav-actions">
          <span className="h-nav-balance" aria-hidden="true" />
          <button type="button" className="h-theme-toggle" aria-label={dark ? "라이트 모드" : "다크 모드"} aria-pressed={dark} onClick={toggleTheme}>
            <span className="h-theme-dot" aria-hidden="true" />
          </button>
          <button ref={menuButton} type="button" className="h-menu-trigger" aria-label="메뉴 열기" aria-expanded={menuOpen} aria-controls="h-site-menu" onClick={() => setMenuOpen(true)}>Menu</button>
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
      <div className="h-menu-top"><Link to="/" className="h-brand" onClick={returnHome} aria-label="윤미래 홈"><DotLogo /></Link><button type="button" ref={closeButton} onClick={closeMenu} aria-label="메뉴 닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 5 14 14M5 19 19 5" /></svg></button></div>
      <nav aria-label="모바일 메뉴" onClick={(event) => { if (event.target.closest("a")) closeMenu(); }}>{links}
      <button type="button" className="h-menu-theme-toggle" aria-label={dark ? "라이트 모드" : "다크 모드"} aria-pressed={dark} onClick={toggleTheme}>
        <span className="h-menu-theme-dot" aria-hidden="true" />
      </button>
      </nav>
    </div>
  </>;
}
