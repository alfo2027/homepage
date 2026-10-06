import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const RELOAD_SCROLL_KEY = "portfolio-reload-scroll";

export default function ScrollToTop() {
  const { pathname, key } = useLocation();
  const previousLocation = useRef({ pathname, key });

  useLayoutEffect(() => {
    // Restore only this URL on reload; ordinary route changes still start at the top.
    try {
      const saved = JSON.parse(sessionStorage.getItem(RELOAD_SCROLL_KEY) || "null");
      if (performance.getEntriesByType("navigation")[0]?.type === "reload" &&
          saved?.url === window.location.href && Number.isFinite(saved.y)) {
        window.scrollTo({ top: saved.y, left: 0, behavior: "instant" });
      }
    } catch {
      // Native restoration remains available when storage is blocked.
    }
    const savePosition = () => {
      try {
        sessionStorage.setItem(RELOAD_SCROLL_KEY, JSON.stringify({ url: window.location.href, y: window.scrollY }));
      } catch {}
    };
    window.addEventListener("pagehide", savePosition);
    return () => window.removeEventListener("pagehide", savePosition);
  }, []);

  useLayoutEffect(() => {
    if (previousLocation.current.pathname === pathname && previousLocation.current.key === key) return;
    previousLocation.current = { pathname, key };
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, key]);
  return null;
}
