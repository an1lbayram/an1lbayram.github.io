import { useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useLanguage } from '../context/LanguageContext';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import useRateLimit from '../hooks/useRateLimit';
import Toast from './Toast';

const Contact = () => {
  const { t } = useLanguage();
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef(null);
  
  const { checkRateLimit } = useRateLimit(3, 5); // Max 3 submissions in 5 minutes

  const handleMessageChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    if (!checkRateLimit()) {
      setStatus('error');
      setMessage(t('contact-rate-limit') || 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.');
      return;
    }

    if (!captchaToken) {
      setStatus('error');
      setMessage('Lütfen robot olmadığınızı doğrulayın.');
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setMessage('');

    const formData = new FormData(form);
    // Explicitly add captcha token
    formData.set('h-captcha-response', captchaToken);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(t('contact-success'));
        form.reset();
        setCharCount(0);
        form.classList.remove('was-validated');
        setCaptchaToken('');
        captchaRef.current?.resetCaptcha();
      } else {
        setStatus('error');
        setMessage(data.message || t('contact-error'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('contact-network-error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-5" ref={ref}>
      <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-5">
            <h2 className="h3 text-primary mb-3">{t('contact-title')}</h2>
            <p className="text-secondary">{t('contact-desc')}</p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <form className="contact-form needs-validation" noValidate onSubmit={handleSubmit}>
                  <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_ACCESS_KEY} />
                  <input type="hidden" name="subject" value="Portfolyo İletişim Formu" />
                  <input type="hidden" name="from_name" value="Anıl Bayram Portfolio" />
                  
                  {/* Honeypot Spam Protection */}
                  <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="contact-name" className="form-label fw-medium">{t('contact-name')}</label>
                        <input type="text" className="form-control" id="contact-name" name="name" placeholder={t('contact-name-ph')} required minLength="2" />
                        <div className="invalid-feedback">{t('contact-name-err')}</div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="contact-email" className="form-label fw-medium">{t('contact-email')}</label>
                        <input type="email" className="form-control" id="contact-email" name="email" placeholder={t('contact-email-ph')} required />
                        <div className="invalid-feedback">{t('contact-email-err')}</div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="contact-subject" className="form-label fw-medium">{t('contact-subject')}</label>
                        <input type="text" className="form-control" id="contact-subject" name="subject_line" placeholder={t('contact-subject-ph')} required minLength="3" />
                        <div className="invalid-feedback">{t('contact-subject-err')}</div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="contact-message" className="form-label fw-medium">{t('contact-msg')}</label>
                        <textarea className="form-control" id="contact-message" name="message" rows="6" placeholder={t('contact-msg-ph')} required minLength="10" maxLength="2000" onChange={handleMessageChange}></textarea>
                        <div className="invalid-feedback">{t('contact-msg-err')}</div>
                        <div className="form-text text-end">
                          <span className={charCount > 1900 ? 'text-warning' : ''}>{charCount}</span> / 2000 {t('contact-char')}
                        </div>
                      </div>
                    </div>

                    {/* hCaptcha Widget - Web3Forms spam koruması */}
                    <div className="col-12 mt-3 d-flex justify-content-center">
                      <HCaptcha
                        sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                        onVerify={(token) => setCaptchaToken(token)}
                        onExpire={() => setCaptchaToken('')}
                        ref={captchaRef}
                      />
                    </div>

                    <div className="col-12 text-center mt-4">
                      <button type="submit" className="btn btn-primary btn-lg px-5" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {t('contact-sending')}
                          </>
                        ) : (
                          t('contact-send')
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="text-center mt-5 pt-4 border-top">
                  <p className="text-secondary mb-2">{t('contact-or')}</p>
                  <a href="mailto:anilbayram48@gmail.com?subject=Proje%20Ortakl%C4%B1%C4%9F%C4%B1%20Hakk%C4%B1nda&body=Merhaba%20An%C4%B1l%20Bey!%0A%0ASizinle%20bir%20proje%20ortakl%C4%B1%C4%9F%C4%B1%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum.%0A%0ASayg%C4%B1lar%C4%B1mla.%0A%0A%0A(Bu%20mail%20https%3A%2F%2Fan1lbayram-github-io.vercel.app%20sitesi%20%C3%BCzerinden%20g%C3%B6nderilmi%C5%9Ftir.)" className="h5 text-primary text-decoration-none">anilbayram48@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {status && (
        <Toast 
          message={message} 
          type={status} 
          onClose={() => setStatus(null)} 
        />
      )}
    </section>
  );
};

export default Contact;
