import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../data/projects';
import { certificates } from '../data/certificates';
import { skills } from '../data/skills';
import '../cv.css';

const CV = ({ onClose }) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  // Sort projects by customDate descending
  const sortedProjects = [...projects].sort((a, b) => new Date(b.customDate) - new Date(a.customDate));

  return (
    <div className="cv-wrapper animate-fade-in">
      {/* Sticky Top Control Bar */}
      <div className="cv-top-bar no-print">
        <div className="cv-top-bar-title fw-bold">
          {t('cv-title')}
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary btn-sm px-3 shadow-sm d-inline-flex align-items-center gap-2" 
            onClick={handlePrint}
            aria-label={t('cv-download-btn')}
          >
            <span>{t('cv-download-btn')}</span>
          </button>
          <button 
            className="btn btn-danger btn-sm px-3 shadow-sm d-inline-flex align-items-center gap-2" 
            onClick={onClose}
            aria-label={t('cv-close-btn')}
          >
            <span>{t('cv-close-btn')}</span>
          </button>
        </div>
      </div>

      <div id="cv-container">
        {/* CV Header */}
        <div className="cv-header-content">
          <img src="/images/an1lbayram_light.png" alt="Anıl Bayram" className="cv-photo no-print" />
          <div className="cv-header-text">
            <h1 className="cv-name">ANIL BAYRAM</h1>
            <h2 className="cv-role">JR. Front-End Developer</h2>
            <div className="cv-contact">
              <span>E-Mail: anilbayram48@gmail.com</span>
              <span>GitHub: github.com/an1lbayram</span>
              <span>LinkedIn: linkedin.com/in/an1lbayram</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="cv-section">
          <h3 className="cv-section-title">{t('cv-about-title')}</h3>
          <p className="cv-text">
            {t('about-desc')}
          </p>
        </section>

        {/* Education & Personal Info */}
        <section className="cv-section">
          <h3 className="cv-section-title">{t('cv-edu-title')}</h3>
          <ul className="cv-bullet-list">
            <li>{t('edu-1')}</li>
            <li>{t('edu-2')}</li>
            <li>{t('edu-3')}</li>
            <li><span className="cv-item-title">{t('cv-known-langs')}:</span> {language === 'tr' ? 'Türkçe (Anadil), İngilizce (B2)' : 'Turkish (Native), English (B2)'}</li>
            <li><span className="cv-item-title">{t('cv-dob')}:</span> 13.01.1999</li>
            <li><span className="cv-item-title">{t('cv-license')}:</span> M, A1, B1, B, F</li>
          </ul>
        </section>

        {/* Technical Skills Section */}
        <section className="cv-section">
          <h3 className="cv-section-title">{t('cv-skills-title')}</h3>
          <ul className="cv-bullet-list">
            <li>
              <span className="cv-item-title">{language === 'tr' ? 'Diller:' : 'Languages:'}</span> JavaScript, TypeScript, Python, C#, PowerShell, HTML, CSS, Batch (CMD)
            </li>
            <li>
              <span className="cv-item-title">{language === 'tr' ? 'Kütüphaneler & Framework\'ler:' : 'Libraries & Frameworks:'}</span> React (v18, v19), Vite, Electron, Express, Bootstrap, Node.js
            </li>
            <li>
              <span className="cv-item-title">{language === 'tr' ? 'Araçlar & Teknolojiler:' : 'Tools & Technologies:'}</span> WebSockets, PWA, Git, GitHub, REST API, Web Vitals, Responsive Design
            </li>
            <li>
              <span className="cv-item-title">{language === 'tr' ? 'Öne Çıkan Yetkinlikler:' : 'Skill Highlights:'}</span> {skills.map(s => `${s.name} (%${s.progress})`).join(', ')}
            </li>
          </ul>
        </section>

        {/* Featured Projects Section */}
        <section className="cv-section">
          <h3 className="cv-section-title">{t('cv-projects-title')}</h3>
          {sortedProjects.map(project => {
            const date = new Date(project.customDate);
            const monthYear = date.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' });
            
            return (
              <div key={project.id} className="cv-item mb-3">
                <div className="d-flex justify-content-between align-items-baseline">
                  <div className="cv-item-title">{project.title}</div>
                  <div className="cv-item-subtitle">{monthYear}</div>
                </div>
                <div className="cv-item-subtitle mb-1">
                  {t('cv-tech-label')}: {project.tags?.map(tag => tag.name).join(', ')}
                </div>
                <p className="cv-item-desc">
                  {project.descKey ? t(project.descKey) : project.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Courses & Certificates Section */}
        <section className="cv-section">
          <h3 className="cv-section-title">{t('cv-certs-title')}</h3>
          <ul className="cv-bullet-list">
            {certificates.map(cert => (
              <li key={cert.id}>
                <span className="cv-item-title">{cert.title}</span> — {cert.institution} ({cert.date})
              </li>
            ))}
          </ul>
        </section>

        {/* Footer Note */}
        <footer className="cv-footer mt-3">
          <p className="cv-footer-text text-center mt-3 pt-3 border-top">
            {t('cv-footer-text')}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CV;
