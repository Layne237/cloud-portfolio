function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-center sm:px-8 sm:flex-row sm:items-center sm:justify-between">
        <p>Built with React, Vite, TailwindCSS, and Framer Motion.</p>
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} Cloud Portfolio</p>
      </div>
    </footer>
  )
}

export default Footer
