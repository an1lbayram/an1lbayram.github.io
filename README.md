# 🚀 Anıl Bayram - Personal Portfolio Website

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![PWA](https://img.shields.io/badge/PWA-Ready-success?logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green)

Anıl Bayram'ın kişisel web sitesi ve dijital portföyü. **React 18** ve **Vite 8** ile geliştirilmiş, **PWA** destekli, çok dilli (Türkçe / İngilizce), modern ve yüksek performanslı tek sayfa uygulaması (Single Page Application).

---

## ✨ Özellikler

- 🌐 **Çoklu Dil Desteği:** Türkçe ve İngilizce dilleri arasında anında geçiş.
- 🌙 **Karanlık / Aydınlık Mod (Dark & Light Mode):** Tercihe göre otomatik kaydolan tema seçimi.
- 📱 **PWA (Progressive Web App):** İnternetsiz (offline) çalışabilme ve cihazlara yüklenebilme özelliği.
- 📬 **Canlı İletişim Formu:** Web3Forms API entegrasyonu ile çalışan hızlı iletişim formu.
- 📈 **Ziyaretçi Analizi:** Vercel Analytics entegrasyonu.
- 🎨 **Responsive & Modern UI:** Bootstrap 5 ve özel CSS animasyonları ile tüm cihazlarla %100 uyumlu.
- 🔍 **Gelişmiş SEO:** Open Graph tags, Twitter Card, JSON-LD Schema, Sitemap.xml ve robots.txt yapılandırması.

---

## 💻 Sistem Gereksinimleri

Uygulamayı çalıştırmadan önce sisteminizde aşağıdaki yazılımların kurulu olması gerekir:

1. **Node.js** (v18.0.0 veya üzeri): [Node.js İndir](https://nodejs.org/)
2. **Git**: [Git İndir](https://git-scm.com/)

---

## 🚀 Kurulum ve Çalıştırma

### ⚡ Tek Satırda Kurulum (Hızlı Başlangıç)

Terminalinizi veya PowerShell'i açıp aşağıdaki komutu yapıştırarak projeyi anında indirip çalıştırabilirsiniz:

```bash
git clone https://github.com/an1lbayram/an1lbayram.github.io.git && cd an1lbayram.github.io && npm install && npm run dev
```

---

### 📋 Adım Adım Kurulum (Hiç Bilmeyenler İçin)

Projeyi ilk defa çalıştırıyorsanız sırasıyla aşağıdaki adımları takip edebilirsiniz:

#### 1️⃣ Terminal / Komut Satırını Açın
- **Windows:** Başlat menüsüne `cmd` veya `PowerShell` yazıp açın.
- **Mac / Linux:** Terminal uygulamasını açın.

#### 2️⃣ Projeyi Bilgisayarınıza İndirin (Klonlayın)
Aşağıdaki komutu yazıp **Enter** tuşuna basın:
```bash
git clone https://github.com/an1lbayram/an1lbayram.github.io.git
```

#### 3️⃣ Proje Klasörüne Girin
Komut satırında indirdiğiniz projenin içine geçin:
```bash
cd an1lbayram.github.io
```

#### 4️⃣ Bağımlılıkları (Gerekli Paketleri) Yükleyin
Projenin ihtiyaç duyduğu kütüphaneleri indirmek için:
```bash
npm install
```

#### 5️⃣ Uygulamayı Başlatın
Geliştirici sunucusunu ayağa kaldırmak için:
```bash
npm run dev
```

#### 6️⃣ Tarayıcıda Görüntüleyin
Komut satırında ekrana gelen adrese (genellikle `http://localhost:5173`) tarayıcınızdan girerek portföyü inceleyebilirsiniz!

---

## 🛠️ Diğer Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme (development) sunucusunu başlatır. |
| `npm run build` | Üretim (production) için optimize edilmiş `dist/` paketini oluşturur. |
| `npm run preview` | Oluşturulan `dist/` derlemesini yerelde önizler. |

---

## 📂 Proje Yapısı

```text
Anıl_Bayram/
├── index.html                    # Ana HTML (SEO meta, OG tags, Schema)
├── vite.config.js                # Vite ve PWA konfigürasyonu
├── package.json                  # Proje bağımlılıkları ve scriptler
├── public/                       # Statik dosyalar (Görseller, favicon, sitemap)
├── src/
│   ├── main.jsx                  # Giriş noktası (Providers, PWA kaydı)
│   ├── App.jsx                   # Ana bileşen
│   ├── index.css                 # Global stiller
│   ├── components/               # UI bileşenleri (Navbar, Hero, Projects, Contact...)
│   ├── context/                  # Language Context (Dil desteği)
│   ├── data/                     # Proje, deneyim ve yetenek verileri
│   └── utils/                    # Dil çeviri tabloları
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

**Geliştirici:** [Anıl Bayram](https://github.com/an1lbayram)
