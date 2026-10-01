import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { posts } from "../data/posts";
import { useProjectTransition } from "./ProjectTransition";
import "./HomeGalleryRail.css";

export default function HomeGalleryRail() {
  const viewport = useRef(null);
  const group = useRef(null);
  const paused = useRef(false);
  const { startProjectTransition } = useProjectTransition();
  const ordered = [...projects.filter(p => !p.upcoming), ...projects.filter(p => p.upcoming)];
  const entries = [];
  ordered.forEach((project, index) => {
    entries.push({ project });
    if ((index + 1) % 3 === 0 && posts[(index + 1) / 3 - 1]) entries.push({ post: posts[(index + 1) / 3 - 1] });
  });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let previous = 0;
    let position = viewport.current.scrollLeft;
    const tick = time => {
      const elapsed = previous ? Math.min(time - previous, 50) : 0;
      previous = time;
      const node = viewport.current;
      const width = group.current.getBoundingClientRect().width;
      if (!reduced.matches && !paused.current && !document.hidden && !node.contains(document.activeElement) && width > 0) {
        position += elapsed * .024;
        if (position >= width) position -= width;
        node.scrollLeft = position;
      } else position = node.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const card = ({ project, post }, duplicate) => {
    if (post) return <Link className="home-rail-card home-rail-note" to={`/blog/${post.slug}`} key={`note-${post.slug}`} tabIndex={duplicate ? -1 : undefined}>
      <span className="home-rail-note-label">Notes{post.isExample ? " · 예시 글" : ""}</span>
      <h2>{post.title}</h2><span className="home-rail-note-bottom">글 읽기 <span aria-hidden="true">↗</span></span>
    </Link>;
    const contents = <><div data-project-frame style={{ width: "100%", height: "100%" }}><img src={project.galleryThumbnail ?? project.thumbnail} alt="" width="1200" height="900" draggable={false} /></div><span className="home-rail-project-title">{project.cardTitle ?? project.title}{project.upcoming && <small>Coming soon</small>}</span></>;
    return project.upcoming ? <article className="home-rail-card home-rail-project" key={project.slug}>{contents}</article> : <Link className="home-rail-card home-rail-project" to={`/projects/${project.slug}`} aria-label={project.cardTitle ?? project.title} key={project.slug} tabIndex={duplicate ? -1 : undefined} onClick={event => startProjectTransition(event, project)}>{contents}</Link>;
  };
  return <section className="home-rail" aria-label="프로젝트와 노트" ref={viewport} onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }} onTouchStart={() => { paused.current = true; }} onTouchEnd={() => { paused.current = false; }}>
    <div className="home-rail-track">
      <div className="home-rail-group" ref={group}>{entries.map(entry => card(entry, false))}</div>
      <div className="home-rail-group" aria-hidden="true">{entries.map(entry => card(entry, true))}</div>
    </div>
  </section>;
}
