import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';
import TypeWriter from './TypeWriter';

const Hero = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const { t } = useLanguage();

  return (
    <section id="hero" className="py-5 mt-5" ref={ref}>
      <div className={`container text-center py-5 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="profile-photo-wrapper mb-4">
          <img
            src="/images/an1lbayram_night.png"
            alt={t('med-dyn-0')}
            className="profile-photo profile-photo--night"
            width="280"
            height="280"
            loading="eager"
          />
          <img
            src="/images/an1lbayram_light.png"
            alt={t('med-dyn-1')}
            className="profile-photo profile-photo--light"
            width="280"
            height="280"
            loading="eager"
          />
        </div>
        <h1 className="display-5 fw-bold mb-2" dangerouslySetInnerHTML={{ __html: t('hero-hello') }}></h1>
        <h2 className="h4 text-secondary mb-4">
          <TypeWriter text={t('hero-role')} delay={100} />
        </h2>
        <div className="d-flex justify-content-center gap-3">
          <a href="#about" className="btn btn-primary btn-lg px-4" aria-label={t('hero-btn')}>
            {t('hero-btn')}
          </a>
          <a href="/Anil_Bayram_CV.pdf" download="Anil_Bayram_CV.pdf" className="btn btn-outline-primary btn-lg px-4" aria-label={t('hero-cv-btn')}>
            {t('hero-cv-btn') || 'CV İndir'}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
