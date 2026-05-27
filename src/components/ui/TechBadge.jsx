import { motion } from 'framer-motion'
import { getIconComponent } from '../../utils/iconMap.js'

function TechBadge({ tech, variants }) {
  // Get the actual React Icon component based on the tech's iconName.
  // This allows us to render real SVG icons instead of emojis.
  const IconComponent = getIconComponent(tech.name)

  return (
    <motion.div
      className="group flex items-start gap-3 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-400/30"
      variants={variants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl text-cyan-300 shadow-inner shadow-cyan-500/10">
        {IconComponent ? <IconComponent size={24} /> : <span>⚙️</span>}
      </div>
      <div>
        <p className="font-semibold text-white">{tech.name}</p>
        <p className="mt-1 text-sm text-slate-400">{tech.description}</p>
      </div>
    </motion.div>
  )
}

export default TechBadge
