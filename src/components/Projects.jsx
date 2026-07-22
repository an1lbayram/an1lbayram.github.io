import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { projects } from '../data/projects';
import { useLanguage } from '../context/LanguageContext';
import { useGitHubStats } from '../hooks/useGitHubStats';
import { SkeletonCard } from './Skeleton';

const ProjectCard = ({ project, stats }) => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="col-md-6 col-lg-4" ref={ref}>
      <div className={`card h-100 shadow-sm card-reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="card-body d-flex flex-column">
          <h3 className="h5 card-title d-flex justify-content-between align-items-center">
            {project.title}
            {stats && (
              <span className="badge bg-light text-dark border font-monospace" style={{fontSize: '0.75rem'}}>
                ⭐ {stats.stars}
              </span>
            )}
          </h3>
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
              className="btn btn-primary mt-auto d-flex justify-content-between align-items-center"
            >
              <span>{t('btn-github')}</span>
              {stats && stats.forks > 0 && (
                <span className="small opacity-75">🍴 {stats.forks}</span>
              )}
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
  const { stats, loading } = useGitHubStats();

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
          {loading ? (
            // Show 3 skeleton cards while loading
            Array.from({ length: 3 }).map((_, idx) => (
              <div className="col-md-6 col-lg-4" key={`skel-${idx}`}>
                <SkeletonCard />
              </div>
            ))
          ) : (
            filteredProjects.map((project) => {
              const repoName = project.url ? project.url.split('/').pop() : null;
              const projectStats = stats && repoName ? stats[repoName] : null;
              
              return (
                <ProjectCard key={project.id} project={project} stats={projectStats} />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
