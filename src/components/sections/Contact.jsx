import AnimatedSection from '../ui/AnimatedSection.jsx'

function Contact() {
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
          <a
            href="mailto:hello@cloudportfolio.dev"
            className="mt-6 inline-flex rounded-full border border-cyan-500 bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 sm:mt-0"
          >
            hello@cloudportfolio.dev
          </a>
        </div>
        <div className="mt-8 rounded-2xl bg-slate-900/90 p-6">
          <p className="text-slate-300">This section is a placeholder for your contact form or scheduling link.</p>
        </div>
      </div>
    </AnimatedSection>
  )
}

export default Contact
