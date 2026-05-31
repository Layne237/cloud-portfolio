import { useState } from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import ProjectCard from '../ui/ProjectCard'
import projectsData from '../../data/projectsData'

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const categories = ['all', ...new Set(projectsData.map(p => p.category))]

  const filteredProjects = filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter)

  return (
    <AnimatedSection id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-gradient">Featured Projects</span>
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Work samples that showcase responsive layout, motion, and component-driven UI.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full capitalize transition-all duration-300 ${filter === cat ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white' : 'glass text-slate-300 hover:text-cyan-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
