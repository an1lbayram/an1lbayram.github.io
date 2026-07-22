import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copyText, setCopyText] = useState(t('social-copy'));

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Calculate scroll progress
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
      
      const scrollBtn = document.getElementById('scrollProgressBtn');
      if (scrollBtn) {
        scrollBtn.style.setProperty('--scroll-progress', scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyText("✓ " + t("social-copy"));
      setTimeout(() => setCopyText(t("social-copy")), 2000);
    }).catch(() => alert(t('copy-fail')));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section id="social" className="py-5 text-center" ref={ref}>
        <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <h2 className="h3 text-primary mb-4">{t("social-title")}</h2>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <a className="btn btn-primary" href="https://github.com/an1lbayram" target="_blank" rel="noopener noreferrer" aria-label={t('social-github-aria')}>GitHub</a>
            <a className="btn btn-primary" href="https://medium.com/@anl1bayram" target="_blank" rel="noopener noreferrer" aria-label={t('social-medium-aria')}>Medium</a>
            <a className="btn btn-primary" href="https://www.linkedin.com/in/an1lbayram" target="_blank" rel="noopener noreferrer" aria-label={t('social-linkedin-aria')}>LinkedIn</a>
            <a className="btn btn-primary" href="https://www.instagram.com/_an1lbayram_" target="_blank" rel="noopener noreferrer" aria-label={t('social-instagram-aria')}>Instagram</a>
            <a className="btn btn-primary" href="https://ig.me/m/_an1lbayram_?text=Merhaba%2C%20%20Projelerinizi%20%C3%A7ok%20be%C4%9Fendim%2C%20birlikte%20%C3%A7al%C4%B1%C5%9Fmak%20i%C3%A7in%20sab%C4%B1rs%C4%B1zlan%C4%B1yorum!%20%20Sevgilerimle.%20" target="_blank" rel="noopener noreferrer" aria-label={t('social-dm-aria')}>{t('social-dm')}</a>
            <a className="btn btn-primary" href="https://dijital.link/an1lbayram" target="_blank" rel="noopener noreferrer" aria-label={t('social-all-aria')}>{t("social-all")}</a>
          </div>
          <div className="mt-4">
            <h3 className="h5 text-secondary mb-3">{t("social-share")}</h3>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <a href="https://twitter.com/intent/tweet?url=https://an1lbayram.github.io&text=Anıl%20Bayram%20-%20Front-End%20Geliştirici%20Portalı" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" aria-label={t('social-twitter-aria')}>Twitter</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=https://an1lbayram.github.io" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" aria-label={t('social-facebook-aria')}>Facebook</a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://an1lbayram.github.io" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" aria-label={t('social-linkedin-share-aria')}>LinkedIn</a>
              <button className="btn btn-sm btn-outline-primary" onClick={handleCopy} aria-label={t('social-copy-aria')}>{copyText}</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-3 border-top text-center text-secondary">
        © {new Date().getFullYear()} {t('footer-copy')}
      </footer>

      <button
        id="scrollProgressBtn"
        className={`scroll-to-top ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label={t('scroll-top')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{position: 'relative', zIndex: 2}}>
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    </>
  );
};

export default Footer;
