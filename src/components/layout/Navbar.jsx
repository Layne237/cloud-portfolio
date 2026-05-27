import { useState } from 'react'
import { motion } from 'framer-motion'

const navLinks = ['Home', 'About', 'Tech Stack', 'Projects', 'Experience', 'Contact']

function Navbar() {
  const [menuOpen] = useState(false)

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <a href="#home" className="text-xl font-semibold tracking-tight text-cyan-300">
          Cloud Portfolio
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link}
            </a>
          ))}
          <a
            href="/admin/login"
            className="rounded-full border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400 hover:text-white"
          >
            Admin
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
    </motion.header>
  )
}

export default Navbar
