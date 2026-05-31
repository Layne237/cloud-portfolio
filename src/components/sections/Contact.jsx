import { useState } from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setStatus('Message sent! (Demo mode)')
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <AnimatedSection id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          <span className="text-gradient">Get In Touch</span>
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Interested in working together? Send a message and I'll reply as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition-transform duration-300"
            >
              Send Message
            </button>
            {status && <p className="text-cyan-400 text-center">{status}</p>}
          </form>

          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Connect with me</h3>
              <div className="space-y-4">
                <a href="https://github.com/Layne237" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors">
                  <FaGithub size={24} /> github.com/Layne237
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors">
                  <FaLinkedin size={24} /> LinkedIn (in/songmartin)
                </a>
                <a href="mailto:hello@example.com" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors">
                  <FaEnvelope size={24} /> hello@example.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
