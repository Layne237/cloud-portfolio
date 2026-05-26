import AnimatedSection from '../ui/AnimatedSection.jsx'
import experienceData from '../../data/experienceData.js'

function Experience() {
  return (
    <AnimatedSection id="experience">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 shadow-[0_0_40px_rgba(15,23,42,0.6)]">
        <h2 className="text-3xl font-semibold text-white">Experience</h2>
        <p className="mt-3 max-w-2xl leading-8 text-slate-300">
          A snapshot of the teams, roles, and products that shaped my practice.
        </p>

        <div className="mt-8 space-y-5">
          {experienceData.map((experience) => (
            <div key={experience.company} className="space-y-1 rounded-2xl bg-slate-900/90 p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{experience.role}</h3>
                  <p className="text-sm text-slate-400">{experience.company}</p>
                </div>
                <p className="text-sm text-cyan-300">{experience.period}</p>
              </div>
              <p className="text-slate-300">{experience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Experience
