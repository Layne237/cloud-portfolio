import Layout from '../components/layout/Layout.jsx'
import About from '../components/sections/About.jsx'
import Contact from '../components/sections/Contact.jsx'
import Experience from '../components/sections/Experience.jsx'
import Hero from '../components/sections/Hero.jsx'
import Projects from '../components/sections/Projects.jsx'
import TechStack from '../components/sections/TechStack.jsx'

function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Experience />
      <Contact />
    </Layout>
  )
}

export default Home
