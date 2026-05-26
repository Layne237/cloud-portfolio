import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: 'easeOut',
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gray-900/70 p-6 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl sm:p-10">
      {/* Glassmorphism uses a translucent background + backdrop-blur to create a frosted panel effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_20%)]" />
      <motion.div
        className="relative rounded-[1.75rem] border border-white/10 bg-white/10 p-6 shadow-[0_0_120px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:p-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Variants group related animation states to keep motion logic reusable and easier to maintain. */}
        <motion.p
          className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-300/90"
          variants={itemVariants}
        >
          Full-Stack Developer | CS Engineering Student | Cloud Engineer
        </motion.p>

        <motion.h1
          className="text-4xl font-semibold text-white sm:text-5xl lg:text-6xl"
          variants={itemVariants}
        >
          SONG MARTIN ARIEL EUDES
        </motion.h1>

        <motion.p
          className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg"
          variants={itemVariants}
        >
          I design cloud-first web applications that blend scalable engineering with polished user experiences. My work is rooted in modern full-stack architecture, responsive interfaces, and secure cloud deployments for brands that want to move fast with confidence.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          variants={itemVariants}
        >
          <a
            href="#projects"
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white transition sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-70 blur-sm transition duration-500 group-hover:opacity-100" />
            <span className="relative z-10 rounded-full bg-slate-950/90 px-6 py-3 transition duration-300 group-hover:bg-slate-900/95">
              View Projects
            </span>
          </a>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-white transition sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-0 transition duration-500 group-hover:opacity-80" />
            <span className="relative z-10">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-white transition sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-0 transition duration-500 group-hover:opacity-80" />
            <span className="relative z-10">LinkedIn</span>
          </a>

          <a
            href="#contact"
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-white transition sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-0 transition duration-500 group-hover:opacity-80" />
            <span className="relative z-10">Contact Me</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
