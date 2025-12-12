import { Shield, Lock, Eye, CheckCircle } from 'lucide-react'

const Confidentiality = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Encrypted Storage',
      description: 'All your data is encrypted at rest and in transit'
    },
    {
      icon: Eye,
      title: 'No Data Sharing',
      description: 'We never share your information with third parties'
    },
    {
      icon: Shield,
      title: 'Privacy-First Architecture',
      description: 'Built with security and confidentiality as core principles'
    },
    {
      icon: CheckCircle,
      title: 'Legal Compliance',
      description: 'Fully compliant with legal industry security standards'
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
            <Shield className="text-white" size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Confidentiality You Can Count On
          </h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
            Justifi is built with a secure, privacy-first architecture. Your legal work is protected 
            with enterprise-grade security measures and controlled AI pipelines.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-accent" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-heading font-bold text-primary mb-4">
              Secure AI Processing
            </h3>
            <p className="text-secondary leading-relaxed mb-6">
              All interactions with our AI systems are processed through secure, controlled pipelines. 
              Your queries and documents are handled with the highest level of confidentiality. 
              We use safe AI practices and ensure that all data remains within secure boundaries, 
              giving you peace of mind while working with sensitive legal information.
            </p>
            <div className="flex items-center justify-center space-x-2 text-accent">
              <CheckCircle size={20} />
              <span className="font-semibold">Bank-Level Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Confidentiality


