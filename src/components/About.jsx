import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { fadeUp, scaleIn, stagger, viewportOnce } from '../lib/motion'

const About = () => {
  const { t } = useLanguage()

  return (
    <section id="about">
      <motion.div
        className="section-shell"
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[220px_1fr] md:gap-14">
          <motion.div
            variants={scaleIn}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.4 }}
            className="relative mx-auto h-[200px] w-[200px] md:h-[220px] md:w-[220px]"
          >
            <img
              src="/images/an1lbayram_night_440.webp"
              alt={t('med-dyn-0')}
              className="profile-photo profile-photo--night"
              width="220"
              height="220"
              loading="eager"
            />
            <img
              src="/images/an1lbayram_light_440.webp"
              alt={t('med-dyn-1')}
              className="profile-photo profile-photo--light"
              width="220"
              height="220"
              loading="eager"
            />
          </motion.div>

          <div className="text-center md:text-left">
            <motion.h2 variants={fadeUp} className="section-title mb-4">
              {t('about-title')}
            </motion.h2>
            <motion.p variants={fadeUp} className="max-w-[68ch] text-base leading-8 text-muted-foreground">
              {t('about-desc')}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default About
