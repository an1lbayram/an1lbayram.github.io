import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { projects } from '../data/projects';

const ProjectCard = ({ project }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="col-md-6 col-lg-4" ref={ref}>
      <div className={`card h-100 shadow-sm card-reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="card-body">
          <h3 className="h5 card-title">{project.title}</h3>
          <p className="card-text text-secondary">{project.description}</p>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-auto"
          >
            GitHub'da Gör
          </a>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="projects" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="h3 text-primary mb-4">Projelerim</h2>
        <div className="row g-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
