import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { mediumArticles } from '../data/medium';
import { useLanguage } from '../context/LanguageContext';

const MediumCard = ({ article }) => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="col-md-6 col-lg-4" ref={ref}>
      <div className={`card h-100 shadow-sm card-reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="card-body d-flex flex-column">
          <h3 className="h5 card-title">{article.titleKey ? t(article.titleKey) : article.title}</h3>
          <p className="card-text text-secondary">{article.descKey ? t(article.descKey) : article.description}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-auto"
          >
            {article.lang === 'TR' ? t('med-dyn-21') : t('med-dyn-22')}
          </a>
        </div>
      </div>
    </div>
  );
};

const Medium = () => {
  const { t, language } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const filteredArticles = mediumArticles.filter(article => article.lang === (language === 'tr' ? 'TR' : 'EN'));

  return (
    <section id="medium" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="h3 text-primary mb-4">{t('medium-title')}</h2>
        <div className="row g-4">
          {filteredArticles.map((article) => (
            <MediumCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Medium;
