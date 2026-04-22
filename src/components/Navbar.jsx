import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    <header>
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
            <li><a href="#hero" onClick={closeMenu}>Ana Sayfa</a></li>
            <li><a href="#about" onClick={closeMenu}>Hakkımda</a></li>
            <li><a href="#projects" onClick={closeMenu}>Projeler</a></li>
            <li><a href="#medium" onClick={closeMenu}>Medium</a></li>
            <li><a href="#certificates" onClick={closeMenu}>Sertifikalar</a></li>
            <li><a href="#skills" onClick={closeMenu}>Beceriler</a></li>
            <li><a href="#contact" onClick={closeMenu}>İletişim</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
