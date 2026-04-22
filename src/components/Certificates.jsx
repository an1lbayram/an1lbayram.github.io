import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { certificates } from '../data/certificates';

const CertificateCard = ({ cert }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <div className="col-md-6 col-lg-4" ref={ref}>
      <div className={`card h-100 shadow-sm card-reveal ${isVisible ? 'revealed' : ''}`}>
        <div className="card-body" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '2.5rem' }}>
          <h3 className="h5 card-title">{cert.title}</h3>
          <p className="card-text text-secondary mb-1">
            <strong>Kurum:</strong> {cert.institution}
          </p>
          <p className="card-text text-secondary mb-1">
            <strong>Tarih:</strong> {cert.date}
          </p>
          {cert.credentialId && (
            <p className="card-text text-secondary mb-1">
              <strong>Yeterlilik Kimliği:</strong> {cert.credentialId}
            </p>
          )}
          {cert.url && (
            <a
              className="certificate-link"
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${cert.title} Yeterlilik Belgesi`}
            >
              Yeterlilik Belgesi
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Certificates = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="certificates" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <h2 className="h3 text-primary mb-4">Sertifikalarım</h2>
        <div className="row g-4">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
