import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';
import { useMediumFeed } from '../hooks/useMediumFeed';
import { SkeletonArticle } from './Skeleton';
// Fallback local data if feed fails
import { mediumArticles } from '../data/medium';

const ArticleCard = ({ article }) => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="col-md-6 col-lg-4" ref={ref}>
      <div className={`card h-100 shadow-sm card-reveal ${isVisible ? 'revealed' : ''}`}>
        {article.thumbnail && (
          <img 
            src={article.thumbnail} 
            className="card-img-top" 
            alt={article.title}
            style={{ height: '160px', objectFit: 'cover' }}
            loading="lazy"
          />
        )}
        <div className="card-body d-flex flex-column">
          <h3 className="h5 card-title line-clamp-2">{article.titleKey ? t(article.titleKey) : article.title}</h3>
          
          {article.pubDate && (
             <p className="text-muted small mb-2">{article.pubDate}</p>
          )}

          <p className="card-text text-secondary line-clamp-3">
            {article.descKey ? t(article.descKey) : article.description}
          </p>
          
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary mt-auto"
          >
            {t('btn-read')}
          </a>
        </div>
      </div>
    </div>
  );
};

const Medium = () => {
  const { t, language } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const { articles: feedArticles, loading } = useMediumFeed();

  // If we have API data, filter by language if possible, else just show all.
  // If API fails or is empty, fallback to local data.
  let displayArticles = [];
  
  if (!loading && feedArticles && feedArticles.length > 0) {
    displayArticles = feedArticles.slice(0, 6); // Show latest 6
  } else if (!loading) {
    displayArticles = mediumArticles.filter(article => article.lang === (language === 'tr' ? 'TR' : 'EN'));
  }

  return (
    <section id="medium" className="py-5 bg-body-tertiary" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="h3 text-primary mb-4">{t('medium-title')}</h2>
        <div className="row g-4">
          {loading ? (
             Array.from({ length: 3 }).map((_, idx) => (
              <div className="col-md-6 col-lg-4" key={`skel-med-${idx}`}>
                <SkeletonArticle />
              </div>
            ))
          ) : (
            displayArticles.map((article, index) => (
              <ArticleCard key={article.id || index} article={article} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Medium;
