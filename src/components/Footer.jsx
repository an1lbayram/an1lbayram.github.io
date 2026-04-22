import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Footer = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copyText, setCopyText] = useState('Bağlantıyı Kopyala');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyText('✓ Kopyalandı!');
      setTimeout(() => setCopyText('Bağlantıyı Kopyala'), 2000);
    }).catch(() => alert('Bağlantı kopyalanamadı'));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section id="social" className="py-5 text-center" ref={ref}>
        <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <h2 className="h3 text-primary mb-4">Sosyal Bağlantılarım</h2>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <a className="btn btn-primary" href="https://github.com/an1lbayram" target="_blank" rel="noopener noreferrer" aria-label="GitHub profilimi ziyaret et">GitHub</a>
            <a className="btn btn-primary" href="https://medium.com/@anl1bayram" target="_blank" rel="noopener noreferrer" aria-label="Medium yazılarımı oku">Medium</a>
            <a className="btn btn-primary" href="https://www.linkedin.com/in/an1lbayram" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profilimi görüntüle">LinkedIn</a>
            <a className="btn btn-primary" href="https://www.instagram.com/anl_bayram" target="_blank" rel="noopener noreferrer" aria-label="Instagram profilimi ziyaret et">Instagram</a>
            <a className="btn btn-primary" href="https://ig.me/m/anl_bayram?text=Merhaba%2C%20%20Projelerinizi%20%C3%A7ok%20be%C4%9Fendim%2C%20birlikte%20%C3%A7al%C4%B1%C5%9Fmak%20i%C3%A7in%20sab%C4%B1rs%C4%B1zlan%C4%B1yorum!%20%20Sevgilerimle.%20" target="_blank" rel="noopener noreferrer" aria-label="Instagram'dan direkt mesaj gönder">DM Gönder</a>
            <a className="btn btn-primary" href="https://dijital.link/an1lbayram" target="_blank" rel="noopener noreferrer" aria-label="Tüm sosyal bağlantılarım">Tüm Bağlantılar</a>
          </div>
          <div className="mt-4">
            <h3 className="h5 text-secondary mb-3">Sayfayı Paylaş</h3>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <a href="https://twitter.com/intent/tweet?url=https://an1lbayram.github.io&text=Anıl%20Bayram%20-%20Front-End%20Geliştirici%20Portalı" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" aria-label="Twitter'da paylaş">Twitter</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=https://an1lbayram.github.io" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" aria-label="Facebook'ta paylaş">Facebook</a>
              <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://an1lbayram.github.io" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" aria-label="LinkedIn'de paylaş">LinkedIn</a>
              <button className="btn btn-sm btn-outline-primary" onClick={handleCopy} aria-label="Bağlantıyı kopyala">{copyText}</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-3 border-top text-center text-secondary">
        © {new Date().getFullYear()} Anıl Bayram - Tüm hakları saklıdır.
      </footer>

      {showScrollTop && (
        <button
          className="scroll-to-top show"
          onClick={scrollToTop}
          aria-label="Sayfanın Başına Git"
        >
          ▲
        </button>
      )}
    </>
  );
};

export default Footer;
