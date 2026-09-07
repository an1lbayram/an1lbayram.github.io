import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { projects } from '../data/projects'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

const Timeline = () => {
  const { t } = useLanguage()

  const timelineItems = projects
    .map((p) => {
      const date = new Date(p.customDate)
      return {
        ...p,
        date,
        year: date.getFullYear(),
        month: date.toLocaleString('default', { month: 'short' }),
      }
    })
    .sort((a, b) => b.date - a.date)

  return (
    <section id="timeline" className="bg-muted/40">
      <motion.div
        className="section-shell"
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.h2 variants={fadeUp} className="section-title mb-10 text-center">
          {t('timeline-title') || 'Development Timeline'}
        </motion.h2>

        <div className="timeline-container">
          {timelineItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="timeline-dot" />
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <h3 className="min-w-0 break-words text-base font-semibold text-primary">{item.title}</h3>
                  <span className="badge-chip shrink-0 whitespace-nowrap tabular-nums">
                    {item.month} {item.year}
                  </span>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  {item.descKey ? t(item.descKey) : item.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {item.tags &&
                    item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="badge-chip text-[0.7rem]">
                        {tag.name}
                      </span>
                    ))}
                </div>
                {item.isPrivate ? (
                  <span className="badge-chip">{t('btn-private')}</span>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline btn-sm"
                  >
                    {t('btn-github')}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Timeline
