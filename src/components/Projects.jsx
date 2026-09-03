import ProjectCard from "./ProjectCard";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="section-top"><h2 className="section-label">Projects</h2></div>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} eager={index < 4} />
        ))}
      </div>
    </section>
  );
}
