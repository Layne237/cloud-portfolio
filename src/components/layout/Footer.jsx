import useVisitorCounter from '../../hooks/useVisitorCounter.js'

function Footer() {
  const { count, loading, error } = useVisitorCounter()

  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-center sm:px-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>Built with React, Vite, TailwindCSS, and Framer Motion.</p>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Cloud Portfolio</p>
        </div>
        <p className={`text-sm ${error ? 'text-rose-400' : 'text-slate-400'}`}>
          {loading ? 'Loading visitor count…' : error ? 'Visitor count unavailable.' : `${count ?? 0} visitors have viewed this portfolio`}
        </p>
      </div>
    </footer>
  )
}

export default Footer
