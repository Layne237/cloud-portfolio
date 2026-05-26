import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import About from '../sections/About.jsx'
import TechStack from '../sections/TechStack.jsx'
import Projects from '../sections/Projects.jsx'
import Experience from '../sections/Experience.jsx'
import Contact from '../sections/Contact.jsx'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
        {children}
        <About />
        <TechStack />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
