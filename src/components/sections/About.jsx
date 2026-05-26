import { motion } from 'framer-motion'

function About() {
  return (
    <motion.section
      id="about"
      className="mb-12 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:p-8 lg:p-10"
      // whileInView triggers animation when the section scrolls into view
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 40 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* The whileInView pattern animates content when it enters the viewport,
          making scroll-based reveals feel natural and reducing off-screen work. */}
      <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-[0_0_60px_rgba(14,165,233,0.14)]">
          <motion.div
            className="absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),_transparent_20%)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative flex h-full flex-col items-center justify-center rounded-[1.4rem] border border-white/5 bg-slate-950/90 p-8 text-center">
            <div className="mb-6 inline-flex h-36 w-36 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-900/90 text-xl font-semibold text-cyan-300 shadow-[0_0_40px_rgba(56,189,248,0.18)]">
              Image
            </div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Profile</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Creative Cloud Engineer</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
              Placeholder for a future hero portrait or branded avatar.
            </p>
          </div>
        </div>

        <div>
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">About Me</h2>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              I am a Computer Science Engineering student building modern full-stack solutions with a strong cloud engineering focus. My journey blends resilient backend architecture, polished frontend experiences, and AWS-powered deployments for applications designed to scale.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
              I bring technical discipline to every project, combining engineering best practices with a user-first mindset to deliver software that feels professional, fast, and future-ready.
            </p>
          </motion.div>

          <motion.div
            className="mt-8 rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-6 text-slate-200 shadow-[0_0_40px_rgba(14,165,233,0.16)]"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Current Learning</p>
            <p className="mt-3 text-xl font-semibold text-white">AWS Cloud Engineering</p>
            <p className="mt-2 text-slate-400">
              Expanding cloud expertise with infrastructure as code, secure deployments, and scalable application architecture in AWS.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default About
