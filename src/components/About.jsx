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
            <p className="lead text-secondary" style={{ lineHeight: '1.8' }}>
              {t('about-desc')}
            </p>

            <div className="mt-5">
              <h3 className="h4 text-primary mb-4">{t('about-personal')}</h3>
              <div className="row g-3">
                <div className="col-12">
                  <h4 className="h6 fw-bold mb-2 text-white">🎓 {t('about-edu')}</h4>
                  <ul className="list-unstyled text-secondary small mb-3">
                    <li className="mb-1">{t('edu-1')}</li>
                    <li className="mb-1">{t('edu-2')}</li>
                    <li className="mb-1">{t('edu-3')}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h4 className="h6 fw-bold mb-2 text-white">🚗 {t('about-license')}</h4>
                  <p className="text-secondary small mb-3">M, A1, B1, B, F</p>
                </div>
                <div className="col-md-6">
                  <h4 className="h6 fw-bold mb-2 text-white">🎂 {t('about-dob')}</h4>
                  <p className="text-secondary small mb-3">13.01.1999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
