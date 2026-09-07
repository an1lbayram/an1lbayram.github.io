import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import InstallButton from './InstallButton'
import { EASE } from '../lib/motion'

const NAV_ITEMS = [
  { href: '#hero', id: 'hero', key: 'nav-home' },
  { href: '#about', id: 'about', key: 'nav-about' },
  { href: '#projects', id: 'projects', key: 'nav-projects' },
  { href: '#medium', id: 'medium', key: 'nav-medium' },
  { href: '#certificates', id: 'certificates', key: 'nav-certs' },
  { href: '#skills', id: 'skills', key: 'nav-skills' },
  { href: '#contact', id: 'contact', key: 'nav-contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('hero')
  const { language, toggleLanguage, t } = useLanguage()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Görünürdeki bölümü izle — aktif bağlantı buna göre işaretlenir.
  // Bölümler React.lazy ile sonradan mount olduğu için mount anında kurulan bir
  // IntersectionObserver onları hiç yakalayamıyordu; bu yüzden kaydırma anında
  // ölçüm yapan bir yaklaşım kullanılıyor.
  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      // Ekranin ust ucte birine gelen bolum "okunuyor" sayilir; boylece
      // birkac piksel kaydirmada menu bir sonraki bolume atlamaz.
      const marker = window.innerHeight * 0.3
      let current = NAV_ITEMS[0].id

      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= marker) current = id
      }

      // Sayfanin en altindaysak son bolum aktif sayilir
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
      if (atBottom) current = NAV_ITEMS[NAV_ITEMS.length - 1].id

      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Lazy bölümler mount oldukça yeniden ölç
    const settle = setTimeout(measure, 1200)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearTimeout(settle)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md"
    >
      <nav className="container flex items-center justify-between gap-4 py-4">
        <a href="#hero" className="group relative font-mono text-base font-medium tracking-tight text-primary">
          &lt;Anıl Bayram/&gt;
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-x-100" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative block rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${isActive ? 'text-primary' : 'text-foreground/75 hover:text-foreground'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {t(item.key)}
                </a>
              </li>
            )
          })}
          <li>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={toggleLanguage}
              className="btn-outline btn-sm ml-2 font-mono font-semibold"
            >
              {language === 'tr' ? 'EN' : 'TR'}
            </motion.button>
          </li>
          <li>
            <InstallButton />
          </li>
        </ul>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden"
          aria-label="Menüyü Aç/Kapat"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="block h-0.5 w-6 rounded-full bg-foreground"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-6 rounded-full bg-foreground"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="block h-0.5 w-6 rounded-full bg-foreground"
          />
        </button>
      </nav>

      {/* Okuma ilerlemesi */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary"
        aria-hidden="true"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-border bg-background/95 md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
              className="container flex flex-col gap-1 py-4"
            >
              {NAV_ITEMS.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                >
                  <a
                    href={item.href}
                    onClick={closeMenu}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                      ${active === item.id ? 'bg-primary/10 text-primary' : 'text-foreground/85 hover:bg-muted'}`}
                  >
                    {t(item.key)}
                  </a>
                </motion.li>
              ))}
              <li className="pt-2">
                <button onClick={toggleLanguage} className="btn-outline btn-sm w-full font-mono font-semibold">
                  {language === 'tr' ? 'EN' : 'TR'}
                </button>
              </li>
              <li>
                <InstallButton className="w-full justify-center" />
              </li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
