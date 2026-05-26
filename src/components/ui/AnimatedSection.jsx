import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js'

function AnimatedSection({ id, children }) {
  const { ref, visible } = useScrollAnimation({ threshold: 0.15 })

  const animationProps = useMemo(
    () => ({
      initial: { opacity: 0, y: 30 },
      animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
      transition: { duration: 0.7, ease: 'easeOut' },
    }),
    [visible],
  )

  return (
    <motion.section id={id} ref={ref} {...animationProps} className="mb-10">
      {children}
    </motion.section>
  )
}

export default AnimatedSection
