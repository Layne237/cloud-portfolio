import { motion } from 'framer-motion'
import { IMAGES } from '../../constants/imageUrls.js'

// ProjectCard: presentational component that receives a `project` prop and
// renders a glassmorphic card with hover interactions. We keep this focused
// on visual concerns; parent components provide data (separation of concerns).
// Props drilling: `Projects` maps data -> passes `project` into `ProjectCard`.
function ProjectCard({ project }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  // Using a 3D flip effect: the container preserves 3D so children rotate cleanly.
  return (
    <motion.div
      className="relative perspective-1000"
      variants={cardVariants}
    >
      <motion.div
        className="relative transform-style-preserve-3d rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(14,165,233,0.06)] transition-transform duration-500"
        whileHover={{ scale: 1.02 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div style={{ backfaceVisibility: 'hidden' }} className="rounded-xl overflow-hidden">
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            {/* Use S3 image URL from project data or fall back to the shared S3 constant map */}
            <img src={project.imageUrl || IMAGES[project.id]} alt={project.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="mt-4 px-1">
            <h4 className="text-lg font-semibold text-white">{project.title}</h4>
            <p className="mt-2 text-sm text-slate-300">{project.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(project.technologies || project.tech || []).map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-white transition shadow-sm hover:scale-105 hover:shadow-[0_10px_30px_rgba(56,189,248,0.12)]"
              >
                GitHub
              </a>
              <a
                href={project.liveLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:scale-105 hover:brightness-110"
              >
                Live Demo
              </a>
            </div>
          </div>
        </div>

        {/* Back face (optional flip content) */}
        <div
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
          className="absolute inset-0 mt-0 rounded-xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4"
        >
          <div className="h-48 w-full rounded-lg bg-slate-800/60" />
          <div className="mt-4">
            <h5 className="text-lg font-semibold text-white">{project.title} — Details</h5>
            <p className="mt-2 text-sm text-slate-300">More details, challenges, and notes about the implementation can live here.</p>
            <div className="mt-4 text-sm text-slate-400">Category: {project.category}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectCard

