import AnimatedSection from '../ui/AnimatedSection'
import TechBadge from '../ui/TechBadge'
import techStackData from '../../data/techStackData'

export default function TechStack() {
  return (
    <AnimatedSection id="tech">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-gradient">Tech Stack</span>
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Technologies powering modern full-stack development, cloud engineering, and deployable production systems.
        </p>

        <div className="space-y-12">
          {techStackData.map((category) => (
            <div key={category.name}>
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">{category.name}</h3>
              <div className="flex flex-wrap gap-3">
                {category.items.map((tech) => (
                  <TechBadge key={tech.name} name={tech.name} icon={tech.icon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
