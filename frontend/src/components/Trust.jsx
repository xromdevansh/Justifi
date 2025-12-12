import { Quote, Star } from 'lucide-react'

const Trust = () => {
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Senior Partner, Mitchell & Associates',
      content: 'Justifi has transformed how we handle research and drafting. What used to take hours now takes minutes, and the quality is exceptional.',
      rating: 5
    },
    {
      name: 'David Chen',
      role: 'Corporate Counsel, Tech Innovations Inc.',
      content: 'The Clause Check feature is a game-changer. It instantly identifies potential issues and provides comprehensive analysis.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Litigation Attorney',
      content: 'Case Miner helps me find the most relevant precedents faster than any traditional database. Highly recommended!',
      rating: 5
    }
  ]

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Trusted by Legal Professionals
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Join thousands of legal professionals who rely on Justifi for their daily practice
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <Quote className="text-accent mb-4" size={32} />
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-accent fill-accent" size={20} />
                ))}
              </div>
              <p className="text-secondary mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="text-sm text-secondary">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Client Logos Section (Placeholder) */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <p className="text-center text-secondary mb-6 font-semibold">
            Trusted by leading law firms and legal departments
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Law Firm A', 'Legal Corp', 'Justice Partners', 'Counsel Group'].map((name, i) => (
              <div
                key={i}
                className="px-6 py-3 border-2 border-gray-200 rounded-lg text-secondary font-semibold"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Trust


