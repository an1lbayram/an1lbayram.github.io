import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const { t } = useLanguage();

  return (
    <section id="about" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="h3 text-primary mb-3 text-center">{t('about-title')}</h2>
            <p className="lead text-secondary text-center" style={{ lineHeight: '1.8' }}>
              {t('about-desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
