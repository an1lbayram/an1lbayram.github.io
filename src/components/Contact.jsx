import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import useRateLimit from '../hooks/useRateLimit'
import Toast from './Toast'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

const Contact = () => {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [captchaToken, setCaptchaToken] = useState('')
  const [errors, setErrors] = useState({})
  const captchaRef = useRef(null)

  const { checkRateLimit } = useRateLimit(3, 5)

  const handleMessageChange = (e) => setCharCount(e.target.value.length)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target

    if (!form.checkValidity()) {
      e.stopPropagation()
      const nextErrors = {}
      Array.from(form.elements).forEach((el) => {
        if (el.name && !el.validity.valid) nextErrors[el.name] = true
      })
      setErrors(nextErrors)
      return
    }
    setErrors({})

    if (!checkRateLimit()) {
      setStatus('error')
      setMessage(t('contact-rate-limit') || 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.')
      return
    }

    if (!captchaToken) {
      setStatus('error')
      setMessage('Lütfen robot olmadığınızı doğrulayın.')
      return
    }

    setIsLoading(true)
    setStatus(null)
    setMessage('')

    const formData = new FormData(form)
    formData.delete('g-recaptcha-response')
    formData.set('h-captcha-response', captchaToken)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(t('contact-success'))
        form.reset()
        setCharCount(0)
        setCaptchaToken('')
        captchaRef.current?.resetCaptcha()
      } else {
        setStatus('error')
        setMessage(data.message || t('contact-error'))
      }
    } catch (error) {
      setStatus('error')
      setMessage(t('contact-network-error'))
    } finally {
      setIsLoading(false)
    }
  }

  const errorText = 'mt-1.5 text-xs font-medium text-destructive'

  return (
    <section id="contact">
      <motion.div
        className="section-shell"
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <motion.h2 variants={fadeUp} className="section-title mb-3">
            {t('contact-title')}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground">
            {t('contact-desc')}
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10"
        >
          <form className="contact-form" noValidate onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_ACCESS_KEY} />
            <input type="hidden" name="subject" value="Portfolyo İletişim Formu" />
            <input type="hidden" name="from_name" value="Anıl Bayram Portfolio" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
                  {t('contact-name')}
                </label>
                <input
                  type="text"
                  className="field"
                  id="contact-name"
                  name="name"
                  placeholder={t('contact-name-ph')}
                  required
                  minLength="2"
                />
                {errors.name && <p className={errorText}>{t('contact-name-err')}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
                  {t('contact-email')}
                </label>
                <input
                  type="email"
                  className="field"
                  id="contact-email"
                  name="email"
                  placeholder={t('contact-email-ph')}
                  required
                />
                {errors.email && <p className={errorText}>{t('contact-email-err')}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium">
                  {t('contact-subject')}
                </label>
                <input
                  type="text"
                  className="field"
                  id="contact-subject"
                  name="subject_line"
                  placeholder={t('contact-subject-ph')}
                  required
                  minLength="3"
                />
                {errors.subject_line && <p className={errorText}>{t('contact-subject-err')}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
                  {t('contact-msg')}
                </label>
                <textarea
                  className="field resize-y"
                  id="contact-message"
                  name="message"
                  rows="6"
                  placeholder={t('contact-msg-ph')}
                  required
                  minLength="10"
                  maxLength="2000"
                  onChange={handleMessageChange}
                />
                {errors.message && <p className={errorText}>{t('contact-msg-err')}</p>}
                <p className="mt-2 text-right text-xs text-muted-foreground">
                  <span className={charCount > 1900 ? 'font-semibold text-destructive' : 'tabular-nums'}>
                    {charCount}
                  </span>{' '}
                  / 2000 {t('contact-char')}
                </p>
              </div>

              <div className="flex justify-center sm:col-span-2">
                <HCaptcha
                  sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken('')}
                  ref={captchaRef}
                />
              </div>

              <div className="flex justify-center sm:col-span-2">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.03 }}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                  className="btn-primary btn-lg px-10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('contact-sending')}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t('contact-send')}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>

          <div className="mt-10 border-t border-border pt-8 text-center">
            <p className="mb-2 text-sm text-muted-foreground">{t('contact-or')}</p>
            <a
              href="mailto:anilbayram48@gmail.com?subject=Proje%20Ortakl%C4%B1%C4%9F%C4%B1%20Hakk%C4%B1nda&body=Merhaba%20An%C4%B1l%20Bey!%0A%0ASizinle%20bir%20proje%20ortakl%C4%B1%C4%9F%C4%B1%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum.%0A%0ASayg%C4%B1lar%C4%B1mla.%0A%0A%0A(Bu%20mail%20https%3A%2F%2Fan1lbayram-github-io.vercel.app%20sitesi%20%C3%BCzerinden%20g%C3%B6nderilmi%C5%9Ftir.)"
              className="text-lg font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              anilbayram48@gmail.com
            </a>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {status && <Toast message={message} type={status} onClose={() => setStatus(null)} />}
      </AnimatePresence>
    </section>
  )
}

export default Contact
