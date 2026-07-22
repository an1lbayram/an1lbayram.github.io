import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header">
      <nav className="custom-nav">
        <div className="nav-inner">
          <a href="#hero" className="brand">&lt;Anıl Bayram/&gt;</a>

          <div
            className="hamburger"
            aria-label="Menüyü Aç/Kapat"
            aria-expanded={isOpen}
            role="button"
            tabIndex="0"
            onClick={toggleMenu}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
              }
            }}
          >
            <div style={isOpen ? { transform: 'rotate(45deg) translate(5px, 5px)' } : {}}></div>
            <div style={isOpen ? { opacity: 0 } : {}}></div>
            <div style={isOpen ? { transform: 'rotate(-45deg) translate(6px, -6px)' } : {}}></div>
          </div>

          <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
            <li><a href="#hero" onClick={closeMenu}>{t('nav-home')}</a></li>
            <li><a href="#about" onClick={closeMenu}>{t('nav-about')}</a></li>
            <li><a href="#projects" onClick={closeMenu}>{t('nav-projects')}</a></li>
            <li><a href="#medium" onClick={closeMenu}>{t('nav-medium')}</a></li>
            <li><a href="#certificates" onClick={closeMenu}>{t('nav-certs')}</a></li>
            <li><a href="#skills" onClick={closeMenu}>{t('nav-skills')}</a></li>
            <li><a href="#contact" onClick={closeMenu}>{t('nav-contact')}</a></li>
            <li>
              <button 
                onClick={toggleLanguage} 
                className="btn btn-sm btn-outline-primary ms-lg-3 mt-2 mt-lg-0" 
                style={{ fontWeight: 600, padding: '4px 12px', borderRadius: '6px' }}
              >
                {language === 'tr' ? 'EN | TR' : 'TR | EN'}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
