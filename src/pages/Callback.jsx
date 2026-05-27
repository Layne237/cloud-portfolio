import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const parseHash = (hash) => {
  const trimmed = hash.startsWith('#') ? hash.substring(1) : hash
  return Object.fromEntries(new URLSearchParams(trimmed))
}

function Callback() {
  const { setSession } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const authResult = parseHash(location.hash || window.location.hash || '')
    const { access_token: accessToken, id_token: idToken, expires_in: expiresIn, error: authError, error_description } = authResult

    if (authError) {
      setError(error_description || authError)
      return
    }

    if (!accessToken || !idToken) {
      setError('Invalid Cognito callback response. Missing tokens.')
      return
    }

    setSession({ accessToken, idToken, expiresIn })
    navigate('/admin', { replace: true })
  }, [location.hash, navigate, setSession])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-12 sm:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-[0_0_40px_rgba(15,23,42,0.6)]">
          <h1 className="text-3xl font-semibold text-white">Signing in</h1>
          {error ? (
            <p className="mt-4 text-rose-400">{error}</p>
          ) : (
            <p className="mt-4 text-slate-300">Processing your authentication response. You will be redirected automatically.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Callback
