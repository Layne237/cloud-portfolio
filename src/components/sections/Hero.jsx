import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } },
}

export default function Hero() {
  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="inline-block mb-4 px-4 py-1 rounded-full glass text-sm text-cyan-400">
            ✨ Welcome to my digital space
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">SONG MARTIN<br />ARIEL EUDES</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-slate-300 mb-4">
            Full-Stack Developer | CS Engineering Student | Cloud Engineer
          </motion.p>

          <motion.p variants={fadeUp} className="text-slate-400 max-w-2xl mx-auto mb-8">
            I design cloud-first web applications that blend scalable engineering with polished user experiences. 
            My work is rooted in modern full-stack architecture, responsive interfaces, and secure deployments.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => scrollTo('projects')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:scale-105 transition-transform duration-300"
            >
              View Projects
            </button>
            <a
              href="https://github.com/Layne237"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full glass text-white font-semibold hover:scale-105 transition-transform duration-300 flex items-center gap-2"
            >
              <FaGithub /> GitHub
            </a>
            <button
              onClick={() => scrollTo('contact')}
              className="px-6 py-3 rounded-full border border-cyan-500 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition-all duration-300"
            >
              Contact Me
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
