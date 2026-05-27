import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

function Login() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [auth.isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12 sm:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-[0_0_40px_rgba(15,23,42,0.6)]">
          <h1 className="text-3xl font-semibold text-white">Admin login</h1>
          <p className="mt-3 text-slate-300">
            Sign in using the Cognito Hosted UI to manage submissions, analytics, and project content.
          </p>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={auth.signIn}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Continue with Cognito
            </button>

            <div className="rounded-2xl bg-slate-800 p-4 text-sm text-slate-300">
              <p className="font-semibold text-slate-100">Setup notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
                <li>Use `VITE_COGNITO_DOMAIN` and `VITE_COGNITO_CLIENT_ID` in your build env.</li>
                <li>Ensure the callback URL includes `/admin/callback`.</li>
                <li>Use the admin dashboard only after sign-in.</li>
              </ul>
            </div>

            {auth.authError && <p className="text-sm text-rose-400">{auth.authError}</p>}

            <p className="text-sm text-slate-400">
              If you do not have access, return to the <Link to="/" className="text-cyan-300 underline">public portfolio</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
