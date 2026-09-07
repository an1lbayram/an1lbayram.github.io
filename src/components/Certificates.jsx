import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { certificates } from '../data/certificates'
import { useLanguage } from '../context/LanguageContext'
import { fadeUp, reveal, stagger, viewportOnce } from '../lib/motion'

const CertificateCard = ({ cert }) => {
  const { t } = useLanguage()
  const title = cert.titleKey ? t(cert.titleKey) : cert.title

  return (
    <motion.div {...reveal()} className="card-surface relative flex flex-col gap-1.5 p-6 pt-12">
      {cert.url && (
        <a
          className="absolute right-4 top-4 inline-flex min-h-[2rem] items-center gap-1.5 rounded-full border
                     border-border bg-muted px-3 py-1.5 text-xs font-semibold text-primary transition-colors
                     hover:border-primary/40 hover:bg-primary/10"
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} ${t('cert-link')}`}
        >
          <ExternalLink className="h-3 w-3" />
          {t('cert-link')}
        </a>
      )}
      <h3 className="text-lg font-semibold leading-snug">{title}</h3>
      <p className="text-sm text-muted-foreground">
        <strong className="font-medium text-foreground/80">{t('cert-inst')}</strong> {cert.institution}
      </p>
      <p className="text-sm text-muted-foreground">
        <strong className="font-medium text-foreground/80">{t('cert-date')}</strong> {cert.date}
      </p>
      {cert.credentialId && (
        <p className="break-all text-sm text-muted-foreground">
          <strong className="font-medium text-foreground/80">{t('cert-id')}</strong> {cert.credentialId}
        </p>
      )}
    </motion.div>
  )
}

const VISIBLE_COUNT = 6

const Certificates = () => {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? certificates : certificates.slice(0, VISIBLE_COUNT)
  const hiddenCount = certificates.length - VISIBLE_COUNT

  return (
    <section id="certificates">
      <motion.div
        className="section-shell"
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.h2 variants={fadeUp} className="section-title mb-8">
          {t('certs-title')}
        </motion.h2>
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </motion.div>

        {hiddenCount > 0 && (
          <motion.div variants={fadeUp} className="mt-10 flex justify-center">
            <button onClick={() => setExpanded((v) => !v)} className="btn-ghost">
              {expanded ? t('certs-less') : `${t('certs-more')} (+${hiddenCount})`}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default Certificates
