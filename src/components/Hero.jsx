import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';

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
            loading="lazy"
          />
          <img
            src="/images/an1lbayram_light.png"
            alt={t('med-dyn-1')}
            className="profile-photo profile-photo--light"
            width="280"
            height="280"
            loading="lazy"
          />
        </div>
        <h1 className="display-5 fw-bold mb-2" dangerouslySetInnerHTML={{ __html: t('hero-hello') }}></h1>
        <p className="lead text-secondary">{t('hero-role')}</p>
      </div>
    </section>
  );
};

export default Hero;
