import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
