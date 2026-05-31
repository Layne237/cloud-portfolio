import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© {currentYear} Song Martin Ariel Eudes. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="https://github.com/Layne237" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
              <FaGithub size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
              <FaLinkedin size={20} />
            </a>
            <a href="mailto:hello@example.com" className="text-slate-400 hover:text-cyan-400 transition-colors">
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
