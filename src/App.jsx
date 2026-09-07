import React, { useState, useEffect, Suspense } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { Loader2, Moon, Sun } from 'lucide-react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useLanguage } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ErrorBoundary from './components/ErrorBoundary'

const About = React.lazy(() => import('./components/About'))
const Projects = React.lazy(() => import('./components/Projects'))
const Timeline = React.lazy(() => import('./components/Timeline'))
const Medium = React.lazy(() => import('./components/Medium'))
const Certificates = React.lazy(() => import('./components/Certificates'))
const Skills = React.lazy(() => import('./components/Skills'))
const Contact = React.lazy(() => import('./components/Contact'))
const Footer = React.lazy(() => import('./components/Footer'))
const CV = React.lazy(() => import('./components/CV'))

const applyTheme = (mode) => {
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.setAttribute('data-bs-theme', mode)
}

const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="sr-only">Loading...</span>
  </div>
)

function App() {
  const [theme, setTheme] = useState('dark')
  const [showCV, setShowCV] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    if (window.location.hash === '#cv') setShowCV(true)

    const handleHashChange = () => setShowCV(window.location.hash === '#cv')
    window.addEventListener('hashchange', handleHashChange)

    const savedTheme = localStorage.getItem('color-mode') || 'dark'
    setTheme(savedTheme)
    applyTheme(savedTheme)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('color-mode', newTheme)
  }

  return (
    <MotionConfig reducedMotion="user">
    <ErrorBoundary>
      {showCV ? (
        <Suspense fallback={<PageLoader />}>
          <CV
            onClose={() => {
              setShowCV(false)
              window.location.hash = ''
            }}
          />
        </Suspense>
      ) : (
        <>
          <Navbar />
          <main>
            <Hero />
            <Suspense fallback={<PageLoader />}>
              <About />
              <Projects />
              <Timeline />
              <Medium />
              <Certificates />
              <Skills />
              <Contact />
              <Footer />
            </Suspense>
          </main>

          <motion.button
            whileHover={{ scale: 1.08, rotate: 12 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full
                       bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme-light') : t('theme-dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.button>
        </>
      )}
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
    </MotionConfig>
  )
}

export default App
