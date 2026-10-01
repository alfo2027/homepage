import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";
import { useProjectTransition } from "./ProjectTransition";

const featured = ["graphic-visual", "analyst", "bloomingbit-alpha"].map(getProjectBySlug);

export default function FeaturedWork() {
  const [index, setIndex] = useState(0);
  const gesture = useRef(null);
  const swiped = useRef(false);
  const project = featured[index];
  const { startProjectTransition } = useProjectTransition();
  const move = (delta) => setIndex((current) => (current + delta + featured.length) % featured.length);

  return <section className={`h-feature h-feature--${project.slug}`} aria-label="대표 작업 슬라이드">
    <Link className="h-feature-link" to={`/projects/${project.slug}`} aria-label="선택한 프로젝트 보기" draggable={false}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => { swiped.current = false; gesture.current = { x: event.clientX, y: event.clientY }; }}
      onPointerUp={(event) => {
        if (!gesture.current) return;
        const dx = event.clientX - gesture.current.x;
        const dy = event.clientY - gesture.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped.current = true; move(dx < 0 ? 1 : -1); }
        gesture.current = null;
      }}
      onPointerCancel={() => { gesture.current = null; }}
      onClick={(event) => {
        if (swiped.current) { event.preventDefault(); swiped.current = false; return; }
        startProjectTransition(event, project);
      }}>
      <span className="h-feature-frame" data-project-frame>
        <img key={project.slug} src={project.thumbnail} alt={project.thumbnailAlt} width={1200} height={900} draggable={false} fetchPriority="high" />
      </span>
      <span className="h-feature-caption"><span>{project.company}</span><strong>{project.title}</strong></span>
      <span className="h-feature-cta">View Project <span aria-hidden="true">↗</span></span>
    </Link>
    <button className="h-slide-arrow h-slide-prev" type="button" aria-label="이전 대표 작업" onClick={() => move(-1)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 4-6 6 6 6" /></svg></button>
    <button className="h-slide-arrow h-slide-next" type="button" aria-label="다음 대표 작업" onClick={() => move(1)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 4 6 6-6 6" /></svg></button>
    <div className="h-slide-dots" role="group" aria-label="대표 작업 선택">{featured.map((item, position) => <button key={item.slug} type="button" aria-label={`대표 작업 ${position + 1}: ${item.title}`} aria-pressed={index === position} onClick={() => setIndex(position)}><span /></button>)}</div>
    <div className="h-feature-tag">Selected Work <span>{String(index + 1).padStart(2, "0")} / 03</span></div>
    <span className="h-sr-only" aria-live="polite">{project.title}</span>
  </section>;
}
