import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { mediumArticles } from '../data/medium';

const MediumCard = ({ article }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="col-md-6 col-lg-4" ref={ref}>
      <div className={`card h-100 shadow-sm card-reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="card-body">
          <h3 className="h5 card-title">{article.title}</h3>
          <p className="card-text text-secondary">{article.description}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-auto"
          >
            Yazıya Git ({article.lang})
          </a>
        </div>
      </div>
    </div>
  );
};

const Medium = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="medium" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="h3 text-primary mb-4">Medium Yazılarım</h2>
        <div className="row g-4">
          {mediumArticles.map((article) => (
            <MediumCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Medium;
