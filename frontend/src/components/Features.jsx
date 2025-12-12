import { FileText, Search, Scale, Lightbulb } from 'lucide-react'

const Features = ({ onFeatureClick }) => {
  const features = [
    {
      id: 'express-draft',
      title: 'Express Draft',
      description: 'AI-powered generation of legal drafts: fast, clean, compliant.',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      id: 'clause-check',
      title: 'Clause Check',
      description: 'Extract & interpret complex clauses instantly.',
      icon: Search,
      gradient: 'from-green-500 to-green-700'
    },
    {
      id: 'case-miner',
      title: 'Case Miner',
      description: 'Retrieve relevant precedents & case summaries.',
      icon: Scale,
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      id: 'legal-mind',
      title: 'Legal Mind',
      description: 'Deep legal reasoning assistant.',
      icon: Lightbulb,
      gradient: 'from-orange-500 to-orange-700'
    }
  ]

  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            The Brain Behind the Brief
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Four powerful AI tools designed to transform your legal practice
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                onClick={() => onFeatureClick(feature)}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer card-hover group relative overflow-hidden"
              >
                {/* Gold glow effect on hover */}
                <div className="absolute inset-0 border-2 border-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-subheading font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 text-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Try it now →
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features


