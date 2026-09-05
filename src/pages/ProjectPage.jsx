import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProjectNavigation from "../components/ProjectNavigation";
import { useProjectTransition } from "../components/ProjectTransition";
import { getAdjacentProjects, getProjectBySlug, getRelatedProjects } from "../data/projects";
import NotFoundPage from "./NotFoundPage";

export default function ProjectPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { isTransitioning, registerProjectTarget } = useProjectTransition();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    if (project) document.title = `윤미래 Product Designer - ${project.title}`;
  }, [project]);

  if (!project) return <NotFoundPage />;

  const relatedProjects = getRelatedProjects(project.slug);
  const { previousProject, nextProject } = getAdjacentProjects(project.slug);

  return (
    <main className={`project-shell${location.state?.projectTransition ? " is-transition-enter" : ""}${isTransitioning ? " is-transition-active" : ""}`}>
      <ProjectNavigation />
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
          {project.images.map((image, index) => (
            <img
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
            />
          ))}
        </section>
      </div>
      <nav className="project-pagination" aria-label="이전 및 다음 프로젝트">
        <Link className="project-pagination-link" to={`/projects/${previousProject.slug}`}>
          <span className="project-pagination-label">
            <svg className="project-pagination-chevron" viewBox="0 0 8 12" aria-hidden="true"><path d="M6.5 1 1.5 6l5 5" /></svg>
            Previous
          </span>
          <strong className="project-pagination-title">{previousProject.title}</strong>
        </Link>
        <Link className="project-pagination-link is-next" to={`/projects/${nextProject.slug}`}>
          <span className="project-pagination-label">
            Next
            <svg className="project-pagination-chevron" viewBox="0 0 8 12" aria-hidden="true"><path d="m1.5 1 5 5-5 5" /></svg>
          </span>
          <strong className="project-pagination-title">{nextProject.title}</strong>
        </Link>
      </nav>
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
                </span>
                <strong>{relatedProject.title}</strong>
                <span>{relatedProject.type}</span>
              </Link>
            ))}
          </nav>
        </section>
      )}
    </main>
  );
}
