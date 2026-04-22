import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Hero = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="hero" className="py-5 mt-5" ref={ref}>
      <div className={`container text-center py-5 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="profile-photo-wrapper mb-4">
          <img
            src="/images/an1lbayram_night.png"
            alt="Anıl Bayram Profil Fotoğrafı (Koyu Tema)"
            className="profile-photo profile-photo--night"
            width="280"
            height="280"
            loading="lazy"
          />
          <img
            src="/images/an1lbayram_light.png"
            alt="Anıl Bayram Profil Fotoğrafı (Açık Tema)"
            className="profile-photo profile-photo--light"
            width="280"
            height="280"
            loading="lazy"
          />
        </div>
        <h1 className="display-5 fw-bold mb-2">
          Merhaba, ben <span className="text-primary">Anıl Bayram</span>
        </h1>
        <p className="lead text-secondary">Front-End Geliştirici</p>
        <a href="#projects" className="btn btn-primary btn-lg mt-3">
          Projelerimi Gör
        </a>
      </div>
    </section>
  );
};

export default Hero;
