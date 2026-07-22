import React, { useState, useEffect, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded components
const About = React.lazy(() => import('./components/About'));
const Projects = React.lazy(() => import('./components/Projects'));
const Timeline = React.lazy(() => import('./components/Timeline'));
const Medium = React.lazy(() => import('./components/Medium'));
const Certificates = React.lazy(() => import('./components/Certificates'));
const Skills = React.lazy(() => import('./components/Skills'));
const Contact = React.lazy(() => import('./components/Contact'));
const Footer = React.lazy(() => import('./components/Footer'));

// Full page loader fallback for suspense
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center py-5 my-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  const [theme, setTheme] = useState('dark');
  const { t } = useLanguage();

  useEffect(() => {
    const savedTheme = localStorage.getItem('color-mode');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('color-mode', newTheme);
  };

  return (
    <ErrorBoundary>
      <Navbar />
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
      
      <button 
        className="toggle-theme" 
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t('theme-light') : t('theme-dark')}
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
