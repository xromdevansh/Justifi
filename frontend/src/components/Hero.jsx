import { Scale } from 'lucide-react'

const Hero = () => {
  const scrollToAskJustifi = () => {
    const askSection = document.getElementById('ask-justifi')
    if (askSection) {
      askSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/20 opacity-95"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
        <div className="mb-6 flex justify-center">
          <Scale size={80} className="text-accent mb-4" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
          Your AI Legal Partner,
          <br />
          <span className="text-accent">Reimagined</span>
        </h1>
        
        <p className="text-2xl md:text-3xl font-subheading font-semibold mb-4 text-accent/90">
          Smarter Research. Faster Answers.
        </p>
        
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          With Justifi, get precise legal insights, draft with confidence, and make smarter decisions — all in seconds.
        </p>
        
        <button
          onClick={scrollToAskJustifi}
          className="btn-accent text-lg px-12 py-4 text-primary shadow-2xl"
        >
          JUSTIFI IT!
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero


