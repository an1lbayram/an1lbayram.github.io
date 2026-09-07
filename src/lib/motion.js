// Ortak Framer Motion ayarları — tüm animasyonlar buradan beslenir.
export const EASE = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
})

export const viewportOnce = { once: true, amount: 0.15 }

/**
 * Ebeveyn variant agacina bagli OLMAYAN giris animasyonu.
 * Filtreleme, "tumunu goster" veya async veri yuklemesi sonrasi mount olan
 * kartlar ebeveynin variant durumunu miras aldigi icin opacity:0'da takili
 * kaliyordu; bu yardimci her ogeyi kendi basina canlandirir.
 */
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.45, ease: EASE, delay },
})
