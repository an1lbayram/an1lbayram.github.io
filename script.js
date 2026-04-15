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

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const charCount = document.getElementById('char-count');
const messageInput = document.getElementById('contact-message');

// Character counter
if (messageInput && charCount) {
  messageInput.addEventListener('input', () => {
    const length = messageInput.value.length;
    charCount.textContent = length;
    
    if (length > 1900) {
      charCount.classList.add('text-warning');
    } else {
      charCount.classList.remove('text-warning');
    }
  });
}

// Input sanitization helper
const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Form validation and submission
if (contactForm) {
  const formInputs = contactForm.querySelectorAll('input, textarea');
  
  // Real-time validation
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        if (input.checkValidity()) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
      }
    });
    
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
        if (input.checkValidity()) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
      }
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    formInputs.forEach(input => {
      if (!input.checkValidity()) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        isValid = false;
      } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
      }
    });
    
    if (!isValid) {
      const firstInvalid = contactForm.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Botcheck (Honeypot) validation
    const botcheck = document.getElementById('botcheck');
    if (botcheck && botcheck.checked) {
      return; // Eğer bot doldurduysa formu gizlice reddet
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const buttonText = submitBtn.querySelector('.button-text');
    const buttonLoader = submitBtn.querySelector('.button-loader');
    
    buttonText.classList.add('d-none');
    buttonLoader.classList.remove('d-none');
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(contactForm);
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        contactForm.reset();
        formInputs.forEach(input => {
          input.classList.remove('is-valid', 'is-invalid');
        });
        if (charCount) charCount.textContent = '0';
        
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success mt-3';
        successMsg.innerHTML = '<strong>Başarılı!</strong> Mesajınız başarıyla gönderildi.';
        contactForm.parentElement.insertBefore(successMsg, contactForm.nextSibling);
        
        setTimeout(() => successMsg.remove(), 5000);
      } else {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger mt-3';
        errorMsg.innerHTML = '<strong>Hata!</strong> ' + (data.message || 'Mesaj gönderilemedi.');
        contactForm.parentElement.insertBefore(errorMsg, contactForm.nextSibling);
        setTimeout(() => errorMsg.remove(), 5000);
      }
    } catch (error) {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'alert alert-danger mt-3';
      errorMsg.innerHTML = '<strong>Hata!</strong> Ağ hatası oluştu, lütfen daha sonra tekrar deneyin.';
      contactForm.parentElement.insertBefore(errorMsg, contactForm.nextSibling);
      setTimeout(() => errorMsg.remove(), 5000);
    } finally {
      buttonText.classList.remove('d-none');
      buttonLoader.classList.add('d-none');
      submitBtn.disabled = false;
    }
  });
}