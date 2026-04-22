import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Medium from './components/Medium';
import Certificates from './components/Certificates';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState('dark');

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
    <>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Medium />
      <Certificates />
      <Skills />
      <Contact />
      <Footer />
      
      <button 
        className="toggle-theme" 
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
    </>
  );
}

export default App;
