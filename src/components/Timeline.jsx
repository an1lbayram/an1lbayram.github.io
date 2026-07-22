import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';
import { useGitHubStats } from '../hooks/useGitHubStats';
import { projects } from '../data/projects';

const Timeline = () => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const { stats } = useGitHubStats();

  // Combine local project data with GitHub stats to order by creation date
  const timelineItems = projects
    .filter(p => !p.isPrivate && p.url && p.url.includes('github.com'))
    .map(p => {
      const repoName = p.url.split('/').pop();
      const repoStats = stats ? stats[repoName] : null;
      
      // Default to 2024 if can't find in stats
      const date = repoStats ? new Date(repoStats.created_at) : new Date('2024-01-01');
      
      return {
        ...p,
        repoStats,
        date,
        year: date.getFullYear(),
        month: date.toLocaleString('default', { month: 'short' })
      };
    })
    .sort((a, b) => b.date - a.date); // Sort newest first

  return (
    <section id="timeline" className="py-5 bg-body-tertiary" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="h3 text-primary mb-5 text-center">{t('timeline-title') || 'Development Timeline'}</h2>
        
        <div className="timeline-container">
          {timelineItems.map((item, index) => (
            <div key={item.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-dot"></div>
              <div className="timeline-content card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="h5 text-primary mb-0">{item.title}</h3>
                    <span className="badge bg-secondary">
                      {item.month} {item.year}
                    </span>
                  </div>
                  <p className="text-secondary mb-3 small">
                    {item.descKey ? t(item.descKey) : item.description}
                  </p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {item.tags && item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className={`badge ${tag.class} rounded-pill`} style={{fontSize: '0.7rem'}}>
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                    {t('btn-github')} {item.repoStats && `(⭐ ${item.repoStats.stars})`}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
