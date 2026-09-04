import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectTransitionContext = createContext(null);
const EXPAND_DURATION = 480;
const REVEAL_DURATION = 380;

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectTransitionProvider({ children }) {
  const navigate = useNavigate();
  const timersRef = useRef([]);
  const [overlay, setOverlay] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

    requestAnimationFrame(() => setOverlay((current) => current && { ...current, phase: "expanding" }));
    timersRef.current.push(window.setTimeout(() => {
      navigate(`/projects/${project.slug}`, { state: { projectTransition: true } });
      requestAnimationFrame(() => setOverlay((current) => current && { ...current, phase: "revealing" }));
      timersRef.current.push(window.setTimeout(() => {
        setOverlay(null);
        setIsTransitioning(false);
      }, REVEAL_DURATION));
    }, EXPAND_DURATION));
  }, [isTransitioning, navigate]);

  const value = useMemo(() => ({ isTransitioning, startProjectTransition }), [isTransitioning, startProjectTransition]);
  const overlayStyle = overlay?.phase === "start"
    ? overlay.rect
    : { top: overlay?.phase === "revealing" ? "-100vh" : 0, left: 0, width: "100vw", height: "100vh" };

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
