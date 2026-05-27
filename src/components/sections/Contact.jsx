import { useMemo, useState } from 'react'
import AnimatedSection from '../ui/AnimatedSection.jsx'

const DEFAULT_API_ENDPOINT =
  import.meta.env.VITE_CONTACT_API_URL || `${import.meta.env.VITE_API_BASE_URL || ''}/contact`
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const apiUrl = useMemo(() => DEFAULT_API_ENDPOINT, [])

  const validate = () => {
    const validationErrors = {}

    if (!form.name.trim()) {
      validationErrors.name = 'Name is required.'
    }

    if (!form.email.trim()) {
      validationErrors.email = 'Email is required.'
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      validationErrors.email = 'Enter a valid email address.'
    }

    if (!form.message.trim()) {
      validationErrors.message = 'Message is required.'
    } else if (form.message.trim().length < 10) {
      validationErrors.message = 'Message should be at least 10 characters.'
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setStatus({ type: '', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send message. Please try again later.')
      }

      setStatus({ type: 'success', message: 'Message sent successfully. I will be in touch soon.' })
      setForm({ name: '', email: '', message: '' })
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.message ||
          'A server error occurred. Double-check your API endpoint and try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatedSection id="contact">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-10 shadow-[0_0_40px_rgba(15,23,42,0.6)]">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Contact</h2>
            <p className="mt-3 max-w-2xl leading-8 text-slate-300">
              Interested in working together? Send a note and I’ll reply as soon as possible.
            </p>
          </div>
          <div className="mt-6 rounded-full border border-cyan-500 bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 sm:mt-0">
            API endpoint: <span className="font-normal">{apiUrl}</span>
          </div>
        </div>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
              placeholder="Your name"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-sm text-rose-400">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-sm text-rose-400">{errors.email}</p>}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={form.message}
              onChange={handleChange('message')}
              rows={6}
              className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
              placeholder="Tell me about your project or idea."
              aria-invalid={!!errors.message}
            />
            {errors.message && <p className="text-sm text-rose-400">{errors.message}</p>}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send message'}
            </button>
            {status.message && (
              <p
                className={`text-sm ${
                  status.type === 'success' ? 'text-emerald-300' : 'text-rose-400'
                }`}
                role="status"
                aria-live="polite"
              >
                {status.message}
              </p>
            )}
          </div>
        </form>

        <div className="mt-6 rounded-2xl bg-slate-900/90 p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-200">Serverless architecture note</p>
          <p>
            The browser sends the form data to an API endpoint. A serverless Lambda function receives the request, validates it, and then either sends the email or logs the submission. This means there is no always-on server to manage.
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Contact
