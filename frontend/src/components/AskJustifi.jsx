import { FileText, Clock, Layers, Brain } from 'lucide-react'

const AskJustifi = () => {
  return (
    <section id="ask-justifi" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
              Ask Justifi
            </h2>
            <p className="text-lg text-secondary mb-8 leading-relaxed">
              Modern legal professionals face unprecedented challenges. Manual research is time-consuming, 
              information is scattered across multiple sources, and drafting documents is repetitive. 
              Justifi leverages cutting-edge AI to accelerate your workflow and empower you to focus on 
              what truly matters — winning cases and serving clients.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <Clock className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-text mb-1">Manual research is slow</h3>
                  <p className="text-secondary">Hours spent searching through case law and precedents</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Layers className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-text mb-1">Information is fragmented</h3>
                  <p className="text-secondary">Data scattered across multiple databases and platforms</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <FileText className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-text mb-1">Drafting is repetitive</h3>
                  <p className="text-secondary">Templates and boilerplate consume valuable time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Brain className="text-accent mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-text mb-1">AI can accelerate workflows</h3>
                  <p className="text-secondary">Smart automation that understands legal context</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                const footer = document.getElementById('footer')
                if (footer) {
                  footer.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="btn-primary"
            >
              Get in Touch
            </button>
          </div>
          
          {/* Right Image/Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-8 space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Brain className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">AI Legal Assistant</h3>
                    <p className="text-sm text-secondary">Powered by Gemini AI</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-background p-4 rounded-lg">
                    <p className="text-sm text-secondary mb-2">Legal Query:</p>
                    <p className="text-text">"Analyze the contract clause regarding termination..."</p>
                  </div>
                  
                  <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                    <p className="text-sm text-secondary mb-2">AI Response:</p>
                    <p className="text-text">Providing comprehensive legal analysis...</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AskJustifi


