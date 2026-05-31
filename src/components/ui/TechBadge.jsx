import { motion } from 'framer-motion'

export default function TechBadge({ name, icon }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-slate-300 text-sm hover:text-cyan-400 transition-all duration-300"
    >
      <span className="text-lg">{icon}</span>
      <span>{name}</span>
    </motion.span>
  )
}
