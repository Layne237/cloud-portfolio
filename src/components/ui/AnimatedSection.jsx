import { motion } from 'framer-motion'

export default function AnimatedSection({ id, children }) {
  return (
    <section id={id} className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        {children}
      </motion.div>
    </section>
  )
}
