import AnimatedSection from '../ui/AnimatedSection'

export default function About() {
  return (
    <AnimatedSection id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-gradient">About Me</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-slate-300">
            <p>
              I am a <span className="text-cyan-400">Computer Science Engineering student</span> building modern full-stack solutions 
              with a strong cloud engineering focus. My journey blends resilient backend architecture, polished frontend experiences, 
              and AWS-powered deployments for applications designed to scale.
            </p>
            <p>
              I bring technical discipline to every project, combining engineering best practices with a user-first mindset 
              to deliver software that feels professional, fast, and future-ready.
            </p>
            <div className="glass p-6 rounded-2xl mt-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">🎯 Current Learning</h3>
              <p className="text-slate-300">AWS Cloud Engineering — expanding expertise with infrastructure as code, secure deployments, and scalable application architecture.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur-2xl opacity-30"></div>
            <div className="relative glass rounded-2xl p-6 text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center text-5xl font-bold text-white">
                A
              </div>
              <p className="mt-4 text-slate-300">Computer Science Engineering • Cloud Enthusiast • Full-Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
