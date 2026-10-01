import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectTransitionContext = createContext(null);
const NAVIGATION_DELAY = 140;
const DETAIL_ENTER_DURATION = 560;

function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectTransitionProvider({ children }) {
  const navigate = useNavigate();
  const timersRef = useRef([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  const registerProjectTarget = useCallback(() => {}, []);

  const startProjectTransition = useCallback((event, project) => {
    if (event.defaultPrevented || !isPlainLeftClick(event) || isTransitioning) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    event.preventDefault();
    event.currentTarget.classList.add("is-project-opening");
    setIsTransitioning(true);

    timersRef.current.push(window.setTimeout(() => {
      navigate(`/projects/${project.slug}`, { state: { projectTransition: true } });
      timersRef.current.push(window.setTimeout(() => setIsTransitioning(false), DETAIL_ENTER_DURATION));
    }, NAVIGATION_DELAY));
  }, [isTransitioning, navigate]);

  const value = useMemo(
    () => ({ isTransitioning, registerProjectTarget, startProjectTransition }),
    [isTransitioning, registerProjectTarget, startProjectTransition],
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
