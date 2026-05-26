import AnimatedSection from '../ui/AnimatedSection.jsx'
import ProjectCard from '../ui/ProjectCard.jsx'
import projectsData from '../../data/projectsData.js'

function Projects() {
  return (
    <AnimatedSection id="projects">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 shadow-[0_0_40px_rgba(15,23,42,0.6)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Projects</h2>
            <p className="mt-3 max-w-2xl leading-8 text-slate-300">
              Work samples that showcase responsive layout, motion, and component-driven UI.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {projectsData.map((project) => (
            // Pass project object down to `ProjectCard` (props drilling one level)
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Projects
