import { motion } from 'framer-motion'
import { skills, languages } from '../data/skills'
import { useLanguage } from '../context/LanguageContext'
import { EASE, fadeUp, stagger, viewportOnce } from '../lib/motion'

const SkillBar = ({ skill }) => (
  <motion.div variants={fadeUp}>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground">{skill.name}</span>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">{skill.progress}%</span>
    </div>
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-label={skill.name}
      aria-valuenow={skill.progress}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.progress}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </div>
  </motion.div>
)

const Skills = () => {
  const { t } = useLanguage()

  return (
    <>
      <section id="skills">
        <motion.div
          className="section-shell"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.h2 variants={fadeUp} className="section-title mb-8">
            {t('skills-title')}
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2 md:gap-x-10">
            {skills.map((skill) => (
              <SkillBar key={skill.id} skill={skill} />
            ))}
          </div>
        </motion.div>
      </section>

      <section id="languages">
        <motion.div
          className="section-shell pt-0"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.h2 variants={fadeUp} className="section-title mb-8 text-center">
            {t('langs-title')}
          </motion.h2>
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map((lang) => (
              <motion.div key={lang.id} variants={fadeUp} className="card-surface p-6 text-center">
                <h3 className="text-lg font-semibold">{lang.nameKey ? t(lang.nameKey) : lang.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {lang.levelKey ? t(lang.levelKey) : lang.level}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default Skills
