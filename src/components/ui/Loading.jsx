import { motion } from 'framer-motion'

// Loading is a small reusable component that gives users feedback while the
// app initializes. It is separate from the page content so we keep UI concerns
// separated and avoid cluttering the main application component.
function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white">
      <motion.div
        className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/90 px-8 py-10 text-center shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <motion.div
          className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
        />
        <div>
          <h1 className="text-2xl font-semibold">Loading portfolio</h1>
          <p className="mt-2 text-sm text-slate-300">
            Preparing your cloud engineering showcase for the best experience.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Loading
