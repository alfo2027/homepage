import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProjectTransitionContext = createContext(null);
const NAVIGATION_DELAY = 280;
const IMAGE_WAIT_TIMEOUT = 900;

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectTransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const timersRef = useRef([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);
  useEffect(() => setIsTransitioning(false), [location.pathname]);

  const wait = useCallback((duration) => new Promise((resolve) => {
    const timer = window.setTimeout(resolve, duration);
    timersRef.current.push(timer);
  }), []);

  const preloadImage = useCallback((src) => {
    if (!src) return Promise.resolve();

    const image = new Image();
    image.src = src;

    const decoded = typeof image.decode === "function"
      ? image.decode().catch(() => undefined)
      : new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });

    return Promise.race([decoded, wait(IMAGE_WAIT_TIMEOUT)]);
  }, [wait]);

  const startProjectTransition = useCallback(async (event, project) => {
    if (event.defaultPrevented || !isPlainLeftClick(event) || isTransitioning) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    setIsTransitioning(true);
    await Promise.all([
      wait(NAVIGATION_DELAY),
      preloadImage(project.images?.[0]?.src),
    ]);
    navigate(`/projects/${project.slug}`, { state: { projectTransition: true } });
  }, [isTransitioning, navigate, preloadImage, wait]);

  const value = useMemo(
    () => ({ isTransitioning, startProjectTransition }),
    [isTransitioning, startProjectTransition],
  );

  return (
    <ProjectTransitionContext.Provider value={value}>
      {children}
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  const context = useContext(ProjectTransitionContext);
  if (!context) throw new Error("useProjectTransition must be used within ProjectTransitionProvider");
  return context;
}
