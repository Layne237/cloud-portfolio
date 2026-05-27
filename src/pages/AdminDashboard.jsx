import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const SUBMISSIONS_ENDPOINT = `${API_BASE_URL}/admin/submissions`
const ANALYTICS_ENDPOINT = `${API_BASE_URL}/admin/analytics`
const PROJECTS_ENDPOINT = `${API_BASE_URL}/admin/projects`

function AdminDashboard() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [projectsJson, setProjectsJson] = useState('')
  const [projectsPayload, setProjectsPayload] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${auth.session?.accessToken}` }),
    [auth.session],
  )

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/admin/login', { replace: true })
      return
    }

    const loadDashboard = async () => {
      setLoading(true)
      setMessage('')

      try {
        const [submissionsRes, analyticsRes, projectsRes] = await Promise.all([
          fetch(SUBMISSIONS_ENDPOINT, { headers: authHeader }),
          fetch(ANALYTICS_ENDPOINT, { headers: authHeader }),
          fetch(PROJECTS_ENDPOINT),
        ])

        if (submissionsRes.ok) {
          const { submissions: items } = await submissionsRes.json()
          setSubmissions(items || [])
        }

        if (analyticsRes.ok) {
          const payload = await analyticsRes.json()
          setAnalytics(payload)
        }

        if (projectsRes.ok) {
          const payload = await projectsRes.json()
          setProjectsPayload(Array.isArray(payload.projects) ? payload.projects : [])
          setProjectsJson(JSON.stringify(payload.projects || [], null, 2))
        }
      } catch (error) {
        console.error('Admin dashboard error:', error)
        setMessage('Unable to load admin data. Check your API endpoint and authentication.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [auth.isAuthenticated, authHeader, navigate])

  const saveProjects = async () => {
    setSaving(true)
    setMessage('')
    try {
      const projects = JSON.parse(projectsJson)
      const response = await fetch(PROJECTS_ENDPOINT, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify({ projects }),
      })

      if (!response.ok) {
        const errorBody = await response.json()
        throw new Error(errorBody.message || 'Unable to save project data.')
      }

      setMessage('Project data saved successfully.')
      setProjectsPayload(projects)
    } catch (error) {
      console.error('Save projects error:', error)
      setMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  const clearSession = () => {
    auth.signOut()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Admin Dashboard</h1>
            <p className="mt-2 max-w-3xl text-slate-300">
              View submissions, analytics, and update public project content without redeploying.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearSession}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-rose-500 bg-rose-500/10 p-4 text-sm text-rose-200">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Contact submissions</h2>
            <p className="mt-2 text-sm text-slate-400">Submissions are stored in DynamoDB and only visible to authenticated admins.</p>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                        {loading ? 'Loading submissions…' : 'No submissions available.'}
                      </td>
                    </tr>
                  ) : (
                    submissions.map((submission) => (
                      <tr key={submission.id} className="border-t border-slate-800">
                        <td className="px-4 py-3 text-slate-100">{submission.name}</td>
                        <td className="px-4 py-3 text-slate-300">{submission.email}</td>
                        <td className="px-4 py-3 text-slate-300 max-w-[24rem] truncate">{submission.message}</td>
                        <td className="px-4 py-3 text-slate-400">{new Date(submission.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-2xl font-semibold text-white">Visitor analytics</h2>
            <p className="mt-2 text-sm text-slate-400">This data is sourced from the `PageViews` DynamoDB table.</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm text-slate-400">Total page views</p>
                <p className="mt-2 text-4xl font-semibold text-white">{analytics?.count ?? '--'}</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-sm text-slate-400">Last updated</p>
                <p className="mt-2 text-base text-slate-200">{analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleString() : '--'}</p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Project content editor</h2>
              <p className="mt-2 text-sm text-slate-400">
                Update the portfolio project list without redeploying. Save JSON to persist it in DynamoDB.
              </p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={saveProjects}
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save project content'}
            </button>
          </div>

          <textarea
            value={projectsJson}
            onChange={(event) => setProjectsJson(event.target.value)}
            rows={18}
            className="mt-5 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-200">JSON format notes</p>
            <p className="mt-2 leading-6">
              Provide an array of objects with `title`, `category`, `description`, `tech`, `github`, `demo`, and `image` fields.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
