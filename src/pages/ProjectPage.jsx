import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PortfolioNavigation from "../components/PortfolioNavigation";
import { useProjectTransition } from "../components/ProjectTransition";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "../data/projects";
import { companyNames } from "../data/companyNames";
import EntryPagination from "../components/EntryPagination";
import NotFoundPage from "./NotFoundPage";

export default function ProjectPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { isTransitioning, registerProjectTarget } = useProjectTransition();
  const project = getProjectBySlug(slug);
  const featureFrameRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navCompact, setNavCompact] = useState(() => window.scrollY > 32);

  useLayoutEffect(() => {
    const update = () => setNavCompact(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [slug]);

  useEffect(() => {
    if (project) document.title = `윤미래 Product Designer - ${project.title}`;
  }, [project]);

  useEffect(() => {
    if (!project) return undefined;
    document.body.classList.add("is-project-detail");
    return () => document.body.classList.remove("is-project-detail");
  }, [project]);

  useEffect(() => {
    const frame = featureFrameRef.current;
    const viewport = frame?.closest(".project-images-viewport");
    const shell = frame?.closest(".project-shell");
    if (!frame || !viewport || !shell) return undefined;

    let animationFrame = 0;

    const updateFrame = () => {
      animationFrame = 0;
      const viewportWidth = viewport.clientWidth || window.innerWidth;
      const shellWidth = shell.clientWidth || viewportWidth;
      const startScale = viewportWidth > 0 ? Math.min(1, shellWidth / viewportWidth) : 1;
      const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const disableFeatureFrame = reduceMotion || window.innerWidth <= 720;
      const expansionDistance = Math.min(420, Math.max(280, window.innerHeight * 0.42));
      const progress = disableFeatureFrame ? 1 : Math.min(1, Math.max(0, window.scrollY / expansionDistance));
      const scale = startScale + (1 - startScale) * progress;
      const radius = 16 * (1 - progress);
      const borderAlpha = 0.05 * (1 - progress);
      const shadowAlpha = 0.1 * (1 - progress);

      frame.style.setProperty("--project-feature-scale", scale.toFixed(4));
      frame.style.setProperty("--project-feature-radius", `${Number(radius.toFixed(2))}px`);
      frame.style.setProperty("--project-feature-border-alpha", `${Number(borderAlpha.toFixed(3))}`);
      frame.style.setProperty("--project-feature-shadow-alpha", `${Number(shadowAlpha.toFixed(3))}`);
    };

    const scheduleUpdate = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateFrame);
    };

    updateFrame();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [project?.slug]);

  if (!project) return <NotFoundPage />;

  const relatedProjects = getRelatedProjects(project.slug);
  const { previousProject, nextProject } = getAdjacentProjects(project.slug);

  return (
    <main className={`project-shell${location.state?.projectTransition ? " is-transition-enter" : ""}${isTransitioning ? " is-transition-active" : ""}`}>
      <PortfolioNavigation navCompact={navCompact} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="project-content" inert={menuOpen || undefined}>
      {project.intro && (
        <header className="project-intro">
          <h1 aria-label={project.intro.headline}>
            {(project.intro.headlineLines ?? [project.intro.headline]).map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p>{project.intro.description}</p>
        </header>
      )}
      <div className="project-images-viewport">
        <section className="project-images" aria-label={project.detailLabel}>
          {project.images.map((image, index) => {
            const projectImage = <img
              key={image.src}
              draggable={false}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              decoding="async"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              data-project-transition-target={index === 0 ? "" : undefined}
              ref={index === 0 ? registerProjectTarget : undefined}
            />;

            return index === 0 ? (
              <div className="project-feature-frame" ref={featureFrameRef} key={image.src}>
                {projectImage}
              </div>
            ) : projectImage;
          })}
        </section>
      </div>
      <EntryPagination previous={previousProject} next={nextProject} basePath="/projects" label="이전 및 다음 프로젝트" />
      {relatedProjects.length > 0 && (
        <section className="project-related" aria-labelledby="project-related-title">
          <h2 id="project-related-title">Related Works</h2>
          <nav className="project-related-grid" aria-label="관련 프로젝트 탐색">
            {relatedProjects.map((relatedProject) => (
              <Link className="project-related-card" to={`/projects/${relatedProject.slug}`} key={relatedProject.slug}>
                <span className="project-related-image">
                  <img
                    draggable={false}
                    src={relatedProject.galleryThumbnail ?? relatedProject.thumbnail}
                    alt=""
                    width={relatedProject.thumbnailWidth}
                    height={relatedProject.thumbnailHeight}
                    loading="lazy"
                  />
                  <span className="project-related-overlay"><span>{relatedProject.title}</span><small>{relatedProject.type}</small></span>
                </span>
                <span className="project-related-meta"><span>{companyNames[relatedProject.company] ?? relatedProject.company}</span><span>{relatedProject.year}</span></span>
                <strong>{relatedProject.cardTitle ?? relatedProject.title}</strong>
              </Link>
            ))}
          </nav>
        </section>
      )}
      </div>
    </main>
  );
}
