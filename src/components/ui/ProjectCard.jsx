import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="glass rounded-2xl overflow-hidden group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gradient">{project.title}</h3>
        <p className="text-slate-400 text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map(tech => (
            <span key={tech} className="text-xs px-2 py-1 rounded-full glass text-slate-300">{tech}</span>
          ))}
        </div>
        <div className="flex gap-4">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
            <FaGithub size={20} />
          </a>
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
            <FaExternalLinkAlt size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
