import { useEffect, useState } from 'react'
import Layout from './components/layout/Layout.jsx'
import Hero from './components/sections/Hero.jsx'
import Loading from './components/ui/Loading.jsx'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Loading state improves first-render UX by avoiding a blank screen while
  // React hydrates and the initial UI is assembled.
  if (loading) {
    return <Loading />
  }

  return (
    <Layout>
      <Hero />
    </Layout>
  )
}

export default App
