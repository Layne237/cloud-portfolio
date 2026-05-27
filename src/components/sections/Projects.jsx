import { useEffect, useState } from 'react'
import AnimatedSection from '../ui/AnimatedSection.jsx'
import ProjectCard from '../ui/ProjectCard.jsx'
import projectsData from '../../data/projectsData.js'

const PROJECTS_API_URL =
  import.meta.env.VITE_PROJECTS_API_URL || `${import.meta.env.VITE_API_BASE_URL || ''}/projects`

function Projects() {
  const [projects, setProjects] = useState(projectsData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!import.meta.env.VITE_PROJECTS_API_URL && !import.meta.env.VITE_API_BASE_URL) {
      return
    }

    const loadProjects = async () => {
      setLoading(true)
      try {
        const response = await fetch(PROJECTS_API_URL)
        if (!response.ok) {
          throw new Error('Unable to load project data.')
        }

        const body = await response.json()
        if (Array.isArray(body.projects) && body.projects.length > 0) {
          setProjects(body.projects)
        }
      } catch (error) {
        console.warn('Project API load failed, using static data.', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

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
          {loading && <span className="text-sm text-cyan-300">Refreshing project data…</span>}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Projects
