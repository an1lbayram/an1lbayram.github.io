import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Check form validity
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    
    // Botcheck
    const botcheck = form.elements.namedItem('botcheck');
    if (botcheck && botcheck.checked) {
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(t('contact-success'));
        form.reset();
        setCharCount(0);
        form.classList.remove('was-validated');
      } else {
        setStatus('error');
        setMessage(data.message || t('contact-error'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('contact-network-error'));
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="h3 text-primary mb-3 text-center">{t('contact-title')}</h2>
            <p className="text-secondary text-center mb-4">
              {t('contact-desc')}
            </p>

            <form id="contact-form" className="contact-form needs-validation" noValidate onSubmit={handleSubmit}>
              <input type="hidden" name="access_key" value="cf4f69bd-a28d-448c-aef3-edd7c46da5ad" />
              <input type="checkbox" name="botcheck" id="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="mb-3">
                <label htmlFor="contact-name" className="form-label">{t('contact-name')} <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="contact-name" name="name" placeholder={t('contact-name-ph')} required minLength="2" maxLength="100" />
                <div className="invalid-feedback">{t('contact-name-err')}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="contact-email" className="form-label">{t('contact-email')} <span className="text-danger">*</span></label>
                <input type="email" className="form-control" id="contact-email" name="email" placeholder={t('contact-email-ph')} required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                <div className="invalid-feedback">{t('contact-email-err')}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="contact-subject" className="form-label">{t('contact-subject')} <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="contact-subject" name="subject" placeholder={t('contact-subject-ph')} required minLength="3" maxLength="200" />
                <div className="invalid-feedback">{t('contact-subject-err')}</div>
              </div>

              <div className="mb-4">
                <label htmlFor="contact-message" className="form-label">{t('contact-msg')} <span className="text-danger">*</span></label>
                <textarea className="form-control" id="contact-message" name="message" rows="6" placeholder={t('contact-msg-ph')} required minLength="10" maxLength="2000" onChange={handleMessageChange}></textarea>
                <div className="invalid-feedback">{t('contact-msg-err')}</div>
                <div className="form-text text-end">
                  <span className={charCount > 1900 ? 'text-warning' : ''}>{charCount}</span> / 2000 {t('contact-char')}
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg px-5" disabled={isLoading}>
                  {!isLoading ? (
                    <span>{t('contact-send')}</span>
                  ) : (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {t('contact-sending')}
                    </>
                  )}
                </button>
              </div>
            </form>

            {status === 'success' && (
              <div className="alert alert-success mt-3 text-center">
                <strong>{t('contact-success-label')}</strong> {message}
              </div>
            )}
            {status === 'error' && (
              <div className="alert alert-danger mt-3 text-center">
                <strong>{t('contact-error-label')}</strong> {message}
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-secondary mb-2">{t('contact-or')}</p>
              <p><a className="link-primary text-decoration-none" href="mailto:anilbayram48@gmail.com?subject=Proje%20Ortakl%C4%B1%C4%9F%C4%B1%20Hakk%C4%B1nda&body=Merhaba%20An%C4%B1l%20Bey!%0A%0ASizinle%20bir%20proje%20ortakl%C4%B1%C4%9F%C4%B1%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum.%0A%0ASayg%C4%B1lar%C4%B1mla.%0A%0A%0Ahttps%3A%2F%2Fan1lbayram-github-io.vercel.app%2F">anilbayram48@gmail.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
