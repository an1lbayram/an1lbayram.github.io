import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Contact = () => {
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
        setMessage('Mesajınız başarıyla gönderildi.');
        form.reset();
        setCharCount(0);
        form.classList.remove('was-validated');
      } else {
        setStatus('error');
        setMessage(data.message || 'Mesaj gönderilemedi.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Ağ hatası oluştu, lütfen daha sonra tekrar deneyin.');
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
            <h2 className="h3 text-primary mb-3 text-center">İletişim</h2>
            <p className="text-secondary text-center mb-4">
              Benimle iletişime geçmek için aşağıdaki formu doldurabilirsiniz.
            </p>

            <form id="contact-form" className="contact-form needs-validation" noValidate onSubmit={handleSubmit}>
              <input type="hidden" name="access_key" value="cf4f69bd-a28d-448c-aef3-edd7c46da5ad" />
              <input type="checkbox" name="botcheck" id="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="mb-3">
                <label htmlFor="contact-name" className="form-label">İsim <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="contact-name" name="name" placeholder="Adınız Soyadınız" required minLength="2" maxLength="100" />
                <div className="invalid-feedback">Lütfen isminizi girin (en az 2 karakter).</div>
              </div>

              <div className="mb-3">
                <label htmlFor="contact-email" className="form-label">E-posta <span className="text-danger">*</span></label>
                <input type="email" className="form-control" id="contact-email" name="email" placeholder="ornek@email.com" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                <div className="invalid-feedback">Lütfen geçerli bir e-posta adresi girin.</div>
              </div>

              <div className="mb-3">
                <label htmlFor="contact-subject" className="form-label">Konu <span className="text-danger">*</span></label>
                <input type="text" className="form-control" id="contact-subject" name="subject" placeholder="Mesajınızın konusu" required minLength="3" maxLength="200" />
                <div className="invalid-feedback">Lütfen bir konu başlığı girin (en az 3 karakter).</div>
              </div>

              <div className="mb-4">
                <label htmlFor="contact-message" className="form-label">Mesaj <span className="text-danger">*</span></label>
                <textarea className="form-control" id="contact-message" name="message" rows="6" placeholder="Mesajınızı buraya yazın..." required minLength="10" maxLength="2000" onChange={handleMessageChange}></textarea>
                <div className="invalid-feedback">Lütfen mesajınızı girin (en az 10 karakter).</div>
                <div className="form-text text-end">
                  <span className={charCount > 1900 ? 'text-warning' : ''}>{charCount}</span> / 2000 karakter
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg px-5" disabled={isLoading}>
                  {!isLoading ? (
                    <span>Gönder</span>
                  ) : (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Gönderiliyor...
                    </>
                  )}
                </button>
              </div>
            </form>

            {status === 'success' && (
              <div className="alert alert-success mt-3 text-center">
                <strong>Başarılı!</strong> {message}
              </div>
            )}
            {status === 'error' && (
              <div className="alert alert-danger mt-3 text-center">
                <strong>Hata!</strong> {message}
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-secondary mb-2">veya doğrudan e-posta gönderin:</p>
              <p><a className="link-primary text-decoration-none" href="mailto:anilbayram48@gmail.com">anilbayram48@gmail.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
