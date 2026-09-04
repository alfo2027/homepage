import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectTransitionContext = createContext(null);
const NAVIGATION_DELAY = 80;
const LAND_DURATION = 620;
const FADE_DURATION = 180;

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectTransitionProvider({ children }) {
  const navigate = useNavigate();
  const timersRef = useRef([]);
  const [overlay, setOverlay] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  const registerProjectTarget = useCallback((target) => {
    if (!target || !isTransitioning) return;
    const targetRect = target.getBoundingClientRect();

    setOverlay((current) => current && {
      ...current,
      phase: "landing",
      rect: {
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      },
    });

    timersRef.current.push(window.setTimeout(() => {
      setIsTransitioning(false);
      setOverlay((current) => current && { ...current, phase: "fading" });
      timersRef.current.push(window.setTimeout(() => setOverlay(null), FADE_DURATION));
    }, LAND_DURATION));
  }, [isTransitioning]);

  const startProjectTransition = useCallback((event, project) => {
    if (event.defaultPrevented || !isPlainLeftClick(event) || isTransitioning) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frame = event.currentTarget.querySelector(".cai-image-wrap");
    const rect = frame?.getBoundingClientRect();
    if (!frame || !rect) return;

    event.preventDefault();
    setIsTransitioning(true);
    setOverlay({
      src: project.thumbnail,
      alt: "",
      phase: "start",
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    });

    timersRef.current.push(window.setTimeout(() => {
      navigate(`/projects/${project.slug}`, { state: { projectTransition: true } });
    }, NAVIGATION_DELAY));
  }, [isTransitioning, navigate]);

  const value = useMemo(
    () => ({ isTransitioning, registerProjectTarget, startProjectTransition }),
    [isTransitioning, registerProjectTarget, startProjectTransition],
  );
  const overlayStyle = overlay?.rect;

  return (
    <ProjectTransitionContext.Provider value={value}>
      {children}
      {overlay && (
        <img
          className={`project-transition-cover is-${overlay.phase}`}
          data-testid="project-transition-cover"
          src={overlay.src}
          alt={overlay.alt}
          draggable={false}
          style={overlayStyle}
        />
      )}
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectTransition() {
  const context = useContext(ProjectTransitionContext);
  if (!context) throw new Error("useProjectTransition must be used within ProjectTransitionProvider");
  return context;
}
