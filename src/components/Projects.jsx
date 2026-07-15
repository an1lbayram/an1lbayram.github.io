import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { projects } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';

const ProjectCard = ({ project }) => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="col-md-6 col-lg-4" ref={ref}>
      <div className={`card h-100 shadow-sm card-reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="card-body d-flex flex-column">
          <h3 className="h5 card-title">{project.title}</h3>
          <p className="card-text text-secondary">
            {project.descKey ? t(project.descKey) : project.description}
          </p>
          <div className="mb-3 d-flex flex-wrap gap-2">
            {project.tags && project.tags.map((tag, idx) => (
              <span key={idx} className={`badge ${tag.class}`}>{tag.name}</span>
            ))}
          </div>
          {project.isPrivate ? (
            <button className="btn btn-secondary mt-auto" disabled>
              {t('btn-private')}
            </button>
          ) : (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-auto"
            >
              {t('btn-github')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'all') return true;
    if (project.category && project.category.includes(activeFilter)) return true;
    return false;
  });

  return (
    <section id="projects" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="h3 text-primary mb-4">{t('projects-title')}</h2>
        
        <div className="filter-btn-group mb-4 text-center">
          <button 
            className={`btn btn-outline-primary filter-btn ${activeFilter === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('all')}
          >
            {t('filter-all')}
          </button>
          <button 
            className={`btn btn-outline-primary filter-btn ${activeFilter === 'web' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('web')}
          >
            {t('filter-web')}
          </button>
          <button 
            className={`btn btn-outline-primary filter-btn ${activeFilter === 'desktop' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('desktop')}
          >
            {t('filter-desktop')}
          </button>
          <button 
            className={`btn btn-outline-primary filter-btn ${activeFilter === 'security' ? 'active' : ''}`} 
            onClick={() => setActiveFilter('security')}
          >
            {t('filter-security')}
          </button>
        </div>

        <div className="row g-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
