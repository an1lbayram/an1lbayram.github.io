const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

const revealCards = () => {
  const trigger = window.innerHeight * 0.88;
  document.querySelectorAll('.card-reveal').forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) el.classList.add('revealed');
  });
};

const skillSection = document.getElementById('skills');
const skillFills = document.querySelectorAll('.progress-bar.skill-fill');
let skillsAnimated = false;

const animateSkills = () => {
  if (skillsAnimated || !skillSection) return;
  
  const skillTop = skillSection.getBoundingClientRect().top;
  const triggerPoint = window.innerHeight * 0.8;
  
  if(skillTop < triggerPoint){
    skillFills.forEach(bar => {
      bar.style.width = bar.getAttribute('data-progress');
    });
    skillsAnimated = true; 
    window.removeEventListener('scroll', animateSkills); 
  }
};

skillFills.forEach(bar => {
  const width = bar.getAttribute('data-progress');
  bar.style.width = '0%';
  bar.setAttribute('data-progress', width);
});

window.addEventListener('scroll', throttle(revealCards, 100));
window.addEventListener('load', revealCards);

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const setTheme = (mode) => {
  htmlEl.setAttribute('data-bs-theme', mode);
  const isDark = mode === 'dark';
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isDark ? '🌞' : '🌙';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç');
  }
  try { localStorage.setItem('color-mode', mode); } catch (e) {}
};

try {
  const saved = localStorage.getItem('color-mode');
  const initialMode = (saved === 'light' || saved === 'dark') ? saved : htmlEl.getAttribute('data-bs-theme');
  setTheme(initialMode);
} catch (e) {
  setTheme(htmlEl.getAttribute('data-bs-theme'));
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-bs-theme') === 'light' ? 'light' : 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  const toggleMenu = () => {
    const willOpen = !navLinks.classList.contains('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  };

  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu(); 
    }
  });

  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMenu();
      hamburger.focus();
    }
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('show');
  } else {
    scrollToTopBtn.classList.remove('show');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

const copyLinkBtn = document.getElementById('copy-link');
if (copyLinkBtn) {
  copyLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const originalText = copyLinkBtn.textContent;
      copyLinkBtn.textContent = '✓ Kopyalandı!';
      setTimeout(() => {
        copyLinkBtn.textContent = originalText;
      }, 2000);
    }).catch(err => {
      alert('Bağlantı kopyalanamadı');
    });
  });
}