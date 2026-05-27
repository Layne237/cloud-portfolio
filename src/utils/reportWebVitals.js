import { getCLS, getFID, getLCP } from 'web-vitals'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const endpoint = `${API_BASE.replace(/\/$/, '')}/metrics`

const sendMetric = async (metric) => {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      credentials: 'omit',
    })
  } catch (error) {
    console.warn('Failed to report web vital metric:', error)
  }
}

const reportMetric = (metric) => {
  const body = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    pageUrl: window.location.pathname,
  }
  sendMetric(body)
}

const reportPageLoadTime = () => {
  if (!window.performance || !window.performance.timing) {
    return
  }

  const timing = window.performance.timing
  const pageLoad = timing.loadEventEnd - timing.navigationStart
  if (typeof pageLoad === 'number' && pageLoad > 0) {
    sendMetric({
      name: 'PageLoadTime',
      value: pageLoad,
      id: 'page-load-time',
      rating: 'good',
      pageUrl: window.location.pathname,
    })
  }
}

export default function reportWebVitals() {
  if (!endpoint) {
    return
  }

  getCLS(reportMetric)
  getFID(reportMetric)
  getLCP(reportMetric)

  window.addEventListener('load', () => {
    window.setTimeout(reportPageLoadTime, 200)
  })
}
