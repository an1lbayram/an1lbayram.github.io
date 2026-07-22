# Anıl Bayram - Portfolio Website

Kişisel portföy web sitesi. React + Vite ile geliştirilmiş, PWA destekli, çok dilli (TR/EN) modern bir single-page application.

## 🚀 Teknolojiler

- **React 18** + **Vite 8** — Hızlı geliştirme ve build
- **Bootstrap 5** (CDN) — Responsive tasarım
- **vite-plugin-pwa** — PWA ve offline destek
- **Vercel Analytics** — Sayfa görüntüleme ve ziyaretçi analizi
- **Web3Forms API** — İletişim formu

## 📁 Dosya Yapısı

```
Anıl_Bayram/
├── index.html                    # Ana HTML (SEO meta, OG tags, LD+JSON)
├── vite.config.js                # Vite + PWA konfigürasyonu
├── vercel.json                   # Vercel güvenlik header'ları (CSP vb.)
├── package.json
├── public/
│   ├── icons/A.ico               # Favicon
│   ├── images/                   # Profil fotoğrafları (light/dark)
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.jsx                  # Giriş noktası (PWA register, providers)
│   ├── App.jsx                   # Ana uygulama (tema, Analytics)
│   ├── index.css                 # Global stiller
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Medium.jsx
│   │   ├── Certificates.jsx
│   │   ├── Skills.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   └── LanguageContext.jsx    # Çoklu dil desteği (TR/EN)
│   ├── data/
│   │   ├── projects.js
│   │   ├── medium.js
│   │   ├── certificates.js
│   │   └── skills.js
│   ├── hooks/
│   │   └── useIntersectionObserver.js
│   └── utils/
│       └── translations.js       # Tüm çeviri anahtarları
├── .well-known/
│   └── security.txt
└── .github/workflows/
    └── deploy.yml                # GitHub Pages otomatik deploy
```

## 🔧 Özellikler

- **Çoklu Dil**: Türkçe / İngilizce tam destek
- **Dark/Light Mode**: localStorage ile kalıcı tema seçimi
- **PWA**: Offline destek, installable app
- **İletişim Formu**: Web3Forms API ile çalışan form
- **SEO**: Open Graph, Twitter Card, JSON-LD Schema, Sitemap
- **Erişilebilirlik**: ARIA labels, keyboard navigation, prefers-reduced-motion
- **Güvenlik**: CSP, X-Frame-Options, XSS Protection (vercel.json)
- **Animasyonlar**: IntersectionObserver ile scroll tetiklemeli animasyonlar

## 📊 Deployment

- **Vercel**: Ana deployment platformu (otomatik)
- **GitHub Pages**: `.github/workflows/deploy.yml` ile otomatik deploy

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

---

**Son güncelleme**: 22 Temmuz 2026
**Version**: 3.0
