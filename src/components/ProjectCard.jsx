import { Link } from "react-router-dom";

function CardContent({ project, eager }) {
  return (
    <>
      <div className="project-image-frame">
        <img
          draggable={false}
          className="project-image"
          src={project.thumbnail}
          alt={project.thumbnailAlt}
          width={project.thumbnailWidth}
          height={project.thumbnailHeight}
          decoding="async"
          loading={eager ? "eager" : "lazy"}
        />
        {project.upcoming && <span className="project-tbd-label">UPCOMING</span>}
      </div>
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-type">{project.type}</span>
      </div>
    </>
  );
}

export default function ProjectCard({ project, eager = false }) {
  if (project.upcoming) {
    return (
      <article className="project-card is-tbd" data-testid="project-card" aria-disabled="true" aria-label={`${project.title} 프로젝트, 상세 준비 중`}>
        <CardContent project={project} eager={eager} />
      </article>
    );
  }

  return (
    <Link className="project-card" data-testid="project-card" to={`/projects/${project.slug}`} aria-label={`${project.title} 프로젝트 보기`}>
      <CardContent project={project} eager={eager} />
    </Link>
  );
}
