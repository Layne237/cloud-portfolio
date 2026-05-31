import AnimatedSection from '../ui/AnimatedSection'
import experienceData from '../../data/experienceData'

export default function Experience() {
  return (
    <AnimatedSection id="experience">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-gradient">Engineering Journey</span>
        </h2>
        <div className="space-y-8">
          {experienceData.map((exp, idx) => (
            <div key={idx} className="glass p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <h3 className="text-xl font-semibold text-cyan-400">{exp.title}</h3>
                <span className="text-slate-400 text-sm">{exp.period}</span>
              </div>
              <p className="text-slate-300">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
