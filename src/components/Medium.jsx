import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useMediumFeed } from '../hooks/useMediumFeed'
import { SkeletonArticle } from './Skeleton'
import { mediumArticles } from '../data/medium'
import { fadeUp, reveal, stagger, viewportOnce } from '../lib/motion'

const ArticleCard = ({ article }) => {
  const { t } = useLanguage()

  return (
    <motion.article {...reveal()} className="card-surface flex flex-col overflow-hidden">
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
          {article.titleKey ? t(article.titleKey) : article.title}
        </h3>
        {article.pubDate && (
          <p className="mt-1 text-xs text-muted-foreground">{article.pubDate}</p>
        )}
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          {article.descKey ? t(article.descKey) : article.description}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-6 self-start"
        >
          {t('btn-read')}
        </a>
      </div>
    </motion.article>
  )
}

const Medium = () => {
  const { t, language } = useLanguage()
  const { articles: feedArticles, loading } = useMediumFeed()

  let displayArticles = []
  if (!loading && feedArticles && feedArticles.length > 0) {
    displayArticles = feedArticles.slice(0, 6)
  } else if (!loading) {
    displayArticles = mediumArticles.filter(
      (article) => article.lang === (language === 'tr' ? 'TR' : 'EN')
    )
  }

  return (
    <section id="medium" className="bg-muted/40">
      <motion.div
        className="section-shell"
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.h2 variants={fadeUp} className="section-title mb-8">
          {t('medium-title')}
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => <SkeletonArticle key={`skel-med-${idx}`} />)
            : displayArticles.map((article, index) => (
                <ArticleCard key={article.id || index} article={article} />
              ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Medium
