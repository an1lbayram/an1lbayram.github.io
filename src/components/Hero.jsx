import { FileDown } from 'lucide-react'
import { Hero as Hero21 } from '@/components/ui/hero-1'
import { useLanguage } from '../context/LanguageContext'
import TypeWriter from './TypeWriter'

const Hero = () => {
  const { t } = useLanguage()

  return (
    <Hero21
      eyebrow={t('hero-role')}
      title="ANIL BAYRAM"
      subtitle={<TypeWriter text={t('hero-tagline')} delay={45} />}
      ctaLabel={t('hero-btn')}
      ctaHref="#projects"
      secondaryCtaLabel={t('hero-cv-btn')}
      secondaryCtaHref="#cv"
      secondaryCtaIcon={FileDown}
    />
  )
}

export default Hero
