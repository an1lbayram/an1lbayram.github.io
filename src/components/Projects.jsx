import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, CodeXml, GitFork, Lock, Star } from 'lucide-react'
import { projects } from '../data/projects'
import { useLanguage } from '../context/LanguageContext'
import { useGitHubStats } from '../hooks/useGitHubStats'
import { SkeletonCard } from './Skeleton'
import { fadeUp, reveal, stagger, viewportOnce } from '../lib/motion'

const FILTERS = [
  { id: 'all', key: 'filter-all' },
  { id: 'web', key: 'filter-web' },
  { id: 'desktop', key: 'filter-desktop' },
  { id: 'security', key: 'filter-security' },
]

const ProjectCard = ({ project, stats, featured }) => {
  const { t } = useLanguage()

  return (
    <motion.article
      {...reveal()}
      layout
      data-testid="project-card"
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6
                  transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg
                  ${featured ? 'md:col-span-2' : ''}`}
    >
      {/* Üst kenarda hover ile açılan vurgu çizgisi */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary
                   via-primary/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug">{project.title}</h3>
        {stats && (
          <span className="badge-chip shrink-0 gap-1 font-mono tabular-nums">
            <Star className="h-3 w-3" />
            {stats.stars}
          </span>
        )}
      </div>

      <p className={`text-sm leading-6 text-muted-foreground ${featured ? 'max-w-2xl' : ''}`}>
        {project.descKey ? t(project.descKey) : project.description}
      </p>

      <div className="my-5 flex flex-wrap gap-1.5">
        {project.tags &&
          project.tags.map((tag, idx) => (
            <span key={idx} className="badge-chip font-mono text-[0.7rem]">
              {tag.name}
            </span>
          ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        {project.isPrivate ? (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            {t('btn-private')}
          </span>
        ) : (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="-my-1 inline-flex min-h-[2rem] items-center gap-2 py-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            <CodeXml className="h-4 w-4" />
            {t('btn-github')}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}

        {stats && stats.forks > 0 && (
          <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-muted-foreground">
            <GitFork className="h-3 w-3" />
            {stats.forks}
          </span>
        )}
      </div>
    </motion.article>
  )
}

const Projects = () => {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const { stats, loading } = useGitHubStats()

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true
    return project.category && project.category.includes(activeFilter)
  })

  return (
    <section id="projects">
      <motion.div
        className="section-shell"
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.h2 variants={fadeUp} className="section-title">
            {t('projects-title')}
          </motion.h2>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors
                    ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-filter-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {t(filter.key)}
                </button>
              )
            })}
          </motion.div>
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={`skel-${idx}`} />)
            : filteredProjects.map((project, index) => {
                const repoName = project.url ? project.url.split('/').pop() : null
                const projectStats = stats && repoName ? stats[repoName] : null
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    stats={projectStats}
                    featured={index === 0 && activeFilter === 'all'}
                  />
                )
              })}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Projects
