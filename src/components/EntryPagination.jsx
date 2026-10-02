import { Link } from "react-router-dom";

export default function EntryPagination({ previous, next, basePath, label, className = "" }) {
  return <nav className={`project-pagination ${className}`} aria-label={label}>
    <Link className="project-pagination-link" to={`${basePath}/${previous.slug}`}>
      <span className="project-pagination-label">
        <svg className="project-pagination-chevron" viewBox="0 0 8 12" aria-hidden="true"><path d="M6.5 1 1.5 6l5 5" /></svg>
        Previous
      </span>
      <strong className="project-pagination-title">{previous.cardTitle ?? previous.title}</strong>
    </Link>
    <Link className="project-pagination-link is-next" to={`${basePath}/${next.slug}`}>
      <span className="project-pagination-label">
        Next
        <svg className="project-pagination-chevron" viewBox="0 0 8 12" aria-hidden="true"><path d="m1.5 1 5 5-5 5" /></svg>
      </span>
      <strong className="project-pagination-title">{next.cardTitle ?? next.title}</strong>
    </Link>
  </nav>;
}
