import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { skills, languages } from '../data/skills';

const Skills = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !animated) {
      setAnimated(true);
    }
  }, [isVisible, animated]);

  return (
    <>
      <section id="skills" className="py-5" ref={ref}>
        <div className={`container ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <h2 className="h3 text-primary mb-4">Yetkinliklerim / Teknik Becerilerim</h2>
          <div className="row g-4">
            {skills.map((skill) => (
              <div className="col-md-6" key={skill.id}>
                <div className="mb-2 fw-semibold">{skill.name}</div>
                <div
                  className="progress"
                  role="progressbar"
                  aria-label={skill.name}
                  aria-valuenow={skill.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className={`progress-bar ${skill.colorClass} skill-fill`}
                    style={{ width: animated ? `${skill.progress}%` : '0%' }}
                  >
                    {skill.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="languages" className="py-5">
        <div className="container">
          <h2 className="h3 text-primary mb-4 text-center">Diller</h2>
          <div className="row justify-content-center">
            {languages.map((lang) => (
              <div className="col-md-6 col-lg-4" key={lang.id}>
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h5 card-title mb-2">{lang.name}</h3>
                    <p className="text-secondary mb-0">{lang.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Skills;
