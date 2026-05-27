import { useEffect, useMemo, useRef, useState } from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || ''
const HEARTBEAT_INTERVAL_MS = 30000
const RECONNECT_INITIAL_MS = 2000
const RECONNECT_MAX_MS = 30000

const parseMessage = (event) => {
  try {
    return JSON.parse(event.data)
  } catch (error) {
    console.warn('Unable to parse WebSocket message', error)
    return null
  }
}

const createStatusMessage = (count) => `
  ${count} developer${count === 1 ? '' : 's'} online now
`

export default function useWebSocket() {
  const url = useMemo(() => WS_URL, [])
  const socketRef = useRef(null)
  const heartbeatRef = useRef(null)
  const reconnectRef = useRef(null)
  const reconnectDelayRef = useRef(RECONNECT_INITIAL_MS)

  const [onlineCount, setOnlineCount] = useState(null)
  const [status, setStatus] = useState(url ? 'connecting' : 'disabled')
  const [error, setError] = useState(null)

  const cleanup = () => {
    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
    if (socketRef.current) {
      socketRef.current.onopen = null
      socketRef.current.onmessage = null
      socketRef.current.onclose = null
      socketRef.current.onerror = null
      socketRef.current.close()
      socketRef.current = null
    }
  }

  const scheduleReconnect = () => {
    if (!url || reconnectRef.current) {
      return
    }

    reconnectRef.current = window.setTimeout(() => {
      reconnectRef.current = null
      connect()
      reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 1.5, RECONNECT_MAX_MS)
    }, reconnectDelayRef.current)
  }

  const sendHeartbeat = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'sendOnlineStatus' }))
    }
  }

  const connect = () => {
    if (!url) {
      setStatus('disabled')
      return
    }

    cleanup()

    const socket = new WebSocket(url)
    socketRef.current = socket
    setStatus('connecting')
    setError(null)

    socket.onopen = () => {
      setStatus('online')
      reconnectDelayRef.current = RECONNECT_INITIAL_MS
      sendHeartbeat()
      heartbeatRef.current = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
    }

    socket.onmessage = (event) => {
      const data = parseMessage(event)
      if (data && typeof data.onlineCount === 'number') {
        setOnlineCount(data.onlineCount)
        setError(null)
      }
    }

    socket.onclose = () => {
      setStatus('offline')
      cleanup()
      scheduleReconnect()
    }

    socket.onerror = () => {
      setError('WebSocket connection error.')
      setStatus('offline')
    }
  }

  useEffect(() => {
    if (!url) {
      return undefined
    }

    connect()

    return () => {
      if (reconnectRef.current) {
        window.clearTimeout(reconnectRef.current)
        reconnectRef.current = null
      }
      cleanup()
    }
  }, [url])

  return {
    enabled: Boolean(url),
    onlineCount,
    status,
    error,
    isConnected: status === 'online',
    developersOnlineText: status === 'disabled' ? '' : onlineCount === null ? 'Connecting to live status…' : `${onlineCount} developer${onlineCount === 1 ? '' : 's'} online now`,
    connect,
    disconnect: cleanup,
  }
}
