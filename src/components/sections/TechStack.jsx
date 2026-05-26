import { motion } from 'framer-motion'
import TechBadge from '../ui/TechBadge.jsx'
import techStackData from '../../data/techStackData.js'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.16,
    },
  },
}

const categoryVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

function TechStack() {
  return (
    <motion.section
      id="tech-stack"
      className="mb-12 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-8 lg:p-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Stagger children lets badges and category panels animate sequentially for a polished entrance effect. */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Tech Stack</h2>
          <p className="mt-3 max-w-2xl leading-8 text-slate-300">
            Technologies powering modern full-stack development, cloud engineering, and deployable production systems.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {techStackData.map((category) => (
          <motion.div key={category.category} variants={categoryVariants} className="group rounded-[1.75rem] border border-white/10 bg-slate-900/85 p-6 shadow-[0_0_60px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">
                <span className="relative inline-flex pb-2">
                  {category.category}
                  <span className="absolute left-0 bottom-0 h-0.5 w-16 origin-left scale-x-75 rounded-full bg-cyan-400 transition duration-500 group-hover:scale-x-100" />
                </span>
              </h3>
              <p className="text-sm text-slate-400">{category.summary}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {category.items.map((tech) => (
                <TechBadge key={tech.name} tech={tech} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default TechStack
