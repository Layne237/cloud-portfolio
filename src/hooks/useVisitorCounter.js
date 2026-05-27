import { useEffect, useState } from 'react'

// Visitor counter hook for the portfolio footer.
// Fetches the current total from the serverless API endpoint on mount.
export default function useVisitorCounter() {
  const apiUrl = import.meta.env.VITE_VISITOR_API_URL || '/api/visitor-count'
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchVisitorCount = async () => {
      try {
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!response.ok || data.status === 'error') {
          throw new Error(data.message || 'Unable to load visitor count.')
        }

        if (isMounted) {
          setCount(typeof data.count === 'number' ? data.count : null)
          setError('')
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Unable to load visitor count.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchVisitorCount()

    return () => {
      isMounted = false
    }
  }, [apiUrl])

  return { count, loading, error, apiUrl }
}
