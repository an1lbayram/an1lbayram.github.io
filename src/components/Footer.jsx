import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUp,
  Briefcase,
  Camera,
  Check,
  CodeXml,
  Copy,
  MessageCircle,
  PenTool,
  Share2,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { EASE, fadeUp, stagger, viewportOnce } from '../lib/motion'

const NAV_LINKS = [
  { href: '#about', key: 'nav-about' },
  { href: '#projects', key: 'nav-projects' },
  { href: '#timeline', key: 'timeline-title' },
  { href: '#medium', key: 'nav-medium' },
  { href: '#certificates', key: 'nav-certs' },
  { href: '#skills', key: 'nav-skills' },
  { href: '#contact', key: 'nav-contact' },
]

const SOCIALS = [
  { href: 'https://github.com/an1lbayram', label: 'GitHub', aria: 'social-github-aria', Icon: CodeXml },
  { href: 'https://medium.com/@anl1bayram', label: 'Medium', aria: 'social-medium-aria', Icon: PenTool },
  { href: 'https://www.linkedin.com/in/an1lbayram', label: 'LinkedIn', aria: 'social-linkedin-aria', Icon: Briefcase },
  { href: 'https://www.instagram.com/_an1lbayram_', label: 'Instagram', aria: 'social-instagram-aria', Icon: Camera },
]

const SHARE_LINKS = [
  {
    href: 'https://x.com/intent/post?url=https://an1lbayram-github-io.vercel.app&text=An%C4%B1l%20Bayram%20-%20Front-End%20Geli%C5%9Ftirici%20Portal%C4%B1',
    label: 'X (Twitter)',
    aria: 'social-twitter-aria',
  },
  {
    href: 'https://www.facebook.com/sharer/sharer.php?u=https://an1lbayram-github-io.vercel.app',
    label: 'Facebook',
    aria: 'social-facebook-aria',
  },
  {
    href: 'https://www.linkedin.com/sharing/share-offsite/?url=https://an1lbayram-github-io.vercel.app',
    label: 'LinkedIn',
    aria: 'social-linkedin-share-aria',
  },
]

const DM_URL =
  'https://ig.me/m/_an1lbayram_?text=Merhaba%2C%20%20Projelerinizi%20%C3%A7ok%20be%C4%9Fendim%2C%20birlikte%20%C3%A7al%C4%B1%C5%9Fmak%20i%C3%A7in%20sab%C4%B1rs%C4%B1zlan%C4%B1yorum!%20%20Sevgilerimle.%20'

const ColumnTitle = ({ children }) => (
  <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{children}</h3>
)

const Footer = () => {
  const { t } = useLanguage()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [copied, setCopied] = useState(false)
  const scrollBtnRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
      const scrollPx = document.documentElement.scrollTop
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = `${(scrollPx / winHeightPx) * 100}%`
      if (scrollBtnRef.current) scrollBtnRef.current.style.setProperty('--scroll-progress', scrolled)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => alert(t('copy-fail')))
  }, [t])

  return (
    <>
      <footer id="social" className="relative mt-8 overflow-hidden border-t border-border bg-muted/30">
        <motion.div
          className="container pb-8 pt-16"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
            {/* Marka + davet */}
            <motion.div variants={fadeUp}>
              <a href="#hero" className="font-mono text-lg font-semibold text-primary">
                &lt;Anıl Bayram/&gt;
              </a>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{t('social-title')}</p>
              <motion.a
                href={DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('social-dm-aria')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary mt-6"
              >
                <MessageCircle className="h-4 w-4" />
                {t('social-dm')}
              </motion.a>
            </motion.div>

            {/* Menü */}
            <motion.nav variants={fadeUp} aria-label={t('nav-home')}>
              <ColumnTitle>{t('nav-home')}</ColumnTitle>
              <ul className="space-y-1">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group inline-flex min-h-[2rem] items-center gap-2 py-1 text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                      {t(item.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>

            {/* Bağlantılar + paylaşım */}
            <motion.div variants={fadeUp}>
              <ColumnTitle>{t('nav-social')}</ColumnTitle>
              <ul className="space-y-1">
                {SOCIALS.map(({ href, label, aria, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(aria)}
                      className="inline-flex min-h-[2rem] items-center gap-2.5 py-1 text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <ColumnTitle>
                  <span className="inline-flex items-center gap-1.5">
                    <Share2 className="h-3 w-3" />
                    {t('social-share')}
                  </span>
                </ColumnTitle>
                <div className="flex flex-wrap gap-2">
                  {SHARE_LINKS.map(({ href, label, aria }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(aria)}
                      className="badge-chip transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {label}
                    </a>
                  ))}
                  <button
                    onClick={handleCopy}
                    aria-label={t('social-copy-aria')}
                    className="badge-chip gap-1.5 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {t('social-copy')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-6
                       text-xs text-muted-foreground sm:flex-row"
          >
            <p>
              © {new Date().getFullYear()} {t('footer-copy')}
            </p>
            <p className="font-mono">React · Vite · Tailwind CSS · Framer Motion</p>
          </motion.div>
        </motion.div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            ref={scrollBtnRef}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={t('scroll-top')}
            className="scroll-ring fixed bottom-[5.5rem] right-5 z-40 flex h-12 w-12 items-center justify-center
                       rounded-full border border-border bg-card text-foreground shadow-lg
                       hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowUp className="relative z-[2] h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default Footer
