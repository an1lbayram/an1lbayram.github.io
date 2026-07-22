import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../data/projects';
import { certificates } from '../data/certificates';
import '../cv.css';

const CV = ({ onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    // We don't hide body overflow because it breaks PDF printing across multiple pages.
    // The cv-wrapper will cover the screen anyway.
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Sort projects by customDate
  const sortedProjects = [...projects].sort((a, b) => new Date(b.customDate) - new Date(a.customDate));

  return (
    <div className="cv-wrapper animate-fade-in">
      <div id="cv-container">
        <div className="cv-controls no-print">
          <button className="btn btn-primary shadow-sm" onClick={handlePrint}>
            📄 PDF Olarak İndir / Yazdır
          </button>
          <button className="btn btn-danger shadow-sm" onClick={onClose}>
            ✕ Kapat
          </button>
        </div>

        <header className="cv-header-content">
          <img src="/images/an1lbayram_light.png" alt="Anıl Bayram" className="cv-photo no-print" />
          <div className="cv-header-text">
            <h1 className="cv-name">ANIL BAYRAM</h1>
            <h2 className="cv-role">JR. Front-End Developer</h2>
            <div className="cv-contact">
              <span>✉️ anilbayram48@gmail.com</span>
              <span>🔗 github.com/an1lbayram</span>
              <span>🔗 linkedin.com/in/an1lbayram</span>
            </div>
          </div>
        </header>

        <section className="cv-section">
          <h3 className="cv-section-title">👨‍💻 Hakkımda</h3>
          <p className="cv-text" style={{ textAlign: 'center' }}>
            Yazılım dünyasına duyduğum merakı, sürekli öğrenen ve üreten bir Front-End Geliştirici kimliğine dönüştürdüm. 
            HTML, CSS, JavaScript, TypeScript ve React gibi modern web teknolojileriyle kullanıcı odaklı arayüzler tasarlarken; 
            projelerime Node.js, Express, Vite, Electron, WebSockets, Bootstrap ve PWA gibi güncel teknolojileri de entegre ediyorum. 
            Açık kaynak dünyasına katkı sağlamaktan ve Medium üzerinde teknik deneyimlerimi paylaşmaktan keyif alıyorum. 
            Sadece web arayüzleri geliştirmekle kalmıyor; Python, C#, PowerShell, Batch (CMD) ve Arduino gibi farklı disiplinlere 
            dokunarak çok yönlü bir mühendislik bakış açısı kazanmayı hedefliyorum.
          </p>
        </section>

        <section className="cv-section">
          <h3 className="cv-section-title">🎓 Eğitim & Kişisel Bilgiler</h3>
          <ul className="cv-bullet-list">
            <li><span className="cv-item-title">İstanbul Üniversitesi</span> | Bilgisayar Programcılığı (Devam Ediyor)</li>
            <li><span className="cv-item-title">Muğla Sıtkı Koçman Üniversitesi</span> | Acil Durum ve Afet Yönetimi (2020)</li>
            <li><span className="cv-item-title">Melsa Sağlık Meslek Lisesi</span> | Acil Tıp Teknisyenliği (2017)</li>
            <li><span className="cv-item-title">Bilinen Diller:</span> İngilizce B2</li>
            <li><span className="cv-item-title">Doğum Tarihi:</span> 13.01.1999</li>
            <li><span className="cv-item-title">Ehliyet:</span> M, A1, B1, B, F</li>
          </ul>
        </section>

        <section className="cv-section">
          <h3 className="cv-section-title">🛠 Teknik Beceriler & Yetkinlikler</h3>
          <ul className="cv-bullet-list">
            <li><span className="cv-item-title">Diller:</span> JavaScript, TypeScript, Python, C#, PowerShell, HTML, CSS, Batch</li>
            <li><span className="cv-item-title">Kütüphaneler & Framework'ler:</span> React (v18, v19), Vite, Electron, Express, Bootstrap, Node.js</li>
            <li><span className="cv-item-title">Araçlar & Teknolojiler:</span> WebSockets, PWA, Git, GitHub, REST API, Web Vitals, Responsive Design</li>
            <li><span className="cv-item-title">İlgi Alanları:</span> Siber Güvenlik, İşletim Sistemi Optimizasyonları, Masaüstü Uygulama Geliştirme</li>
          </ul>
        </section>

        <section className="cv-section">
          <h3 className="cv-section-title">🚀 Öne Çıkan Projeler</h3>
          {sortedProjects.map(project => {
            const date = new Date(project.customDate);
            const monthYear = `${date.toLocaleString('tr-TR', { month: 'long' })} ${date.getFullYear()}`;
            
            return (
              <div key={project.id} className="cv-item mb-3">
                <div className="d-flex justify-content-between align-items-baseline">
                  <div className="cv-item-title">{project.title}</div>
                  <div className="cv-item-subtitle">{monthYear}</div>
                </div>
                <div className="cv-item-subtitle mb-1">
                  Teknolojiler: {project.tags?.map(t => t.name).join(', ')}
                </div>
                <p className="cv-item-desc">
                  {project.descKey ? t(project.descKey) : project.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="cv-section">
          <h3 className="cv-section-title">📜 Kurslar & Sertifikalar</h3>
          <div className="cv-grid">
            <ul className="cv-bullet-list m-0">
              {certificates.slice(0, Math.ceil(certificates.length / 2)).map(cert => (
                <li key={cert.id}>{cert.title}</li>
              ))}
            </ul>
            <ul className="cv-bullet-list m-0">
              {certificates.slice(Math.ceil(certificates.length / 2)).map(cert => (
                <li key={cert.id}>{cert.title}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cv-section mt-4">
          <p className="text-center text-muted small mt-5 pt-3 border-top">
            Bu özgeçmiş otomatik olarak portföy verilerinden oluşturulmuştur. Daha fazlası için: https://an1lbayram-github-io.vercel.app/
          </p>
        </section>
      </div>
    </div>
  );
};

export default CV;
