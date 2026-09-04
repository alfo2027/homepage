import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProjectNavigation from "../components/ProjectNavigation";
import { getProjectBySlug, getRelatedProjects } from "../data/projects";
import NotFoundPage from "./NotFoundPage";

export default function ProjectPage() {
  const { slug } = useParams();
  const location = useLocation();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    if (project) document.title = `윤미래 Product Designer - ${project.title}`;
  }, [project]);

  if (!project) return <NotFoundPage />;

  const relatedProjects = getRelatedProjects(project.slug);

  return (
    <main className={`project-shell${location.state?.projectTransition ? " is-transition-enter" : ""}`}>
      <ProjectNavigation />
      {project.intro && (
        <header className="project-intro">
          <h1 aria-label={project.intro.headline}>
            {(project.intro.headlineLines ?? [project.intro.headline]).map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p>{project.intro.description}</p>
        </header>
      )}
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
          />
        ))}
      </section>
      <section className="project-related" aria-labelledby="project-related-title">
        <h2 id="project-related-title">다른 프로젝트</h2>
        <nav className="project-related-grid" aria-label="다른 프로젝트 탐색">
          {relatedProjects.map((relatedProject) => (
            <Link className="project-related-card" to={`/projects/${relatedProject.slug}`} key={relatedProject.slug}>
              <span className="project-related-image">
                <img
                  draggable={false}
                  src={relatedProject.thumbnail}
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
    </main>
  );
}
