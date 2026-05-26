import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(options = { threshold: 0.2 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      options,
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return { ref, visible }
}
