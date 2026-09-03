import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Chevron } from "../components/ProjectNavigation";
import ProjectNavigation from "../components/ProjectNavigation";
import { detailProjects, getProjectBySlug } from "../data/projects";
import NotFoundPage from "./NotFoundPage";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    if (project) document.title = `윤미래 Product Designer — ${project.title}`;
  }, [project]);

  if (!project) return <NotFoundPage />;

  const currentIndex = detailProjects.indexOf(project);
  const previous = detailProjects[(currentIndex - 1 + detailProjects.length) % detailProjects.length];
  const next = detailProjects[(currentIndex + 1) % detailProjects.length];

  return (
    <main className="project-shell">
      <ProjectNavigation />
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
      <nav className="project-pagination" aria-label="프로젝트 탐색">
        <Link className="project-pagination-link" to={`/projects/${previous.slug}`} aria-label={`이전 ${previous.title}`}>
          <span className="project-pagination-label"><Chevron />이전</span>
          <strong className="project-pagination-title">{previous.title}</strong>
        </Link>
        <Link className="project-pagination-link is-next" to={`/projects/${next.slug}`} aria-label={`다음 ${next.title}`}>
          <strong className="project-pagination-title">{next.title}</strong>
          <span className="project-pagination-label">다음<Chevron direction="right" /></span>
        </Link>
      </nav>
    </main>
  );
}
