import { useState } from 'react'
import { Linkedin, Twitter, Github } from 'lucide-react'
import api from '../utils/api'

const Footer = ({ onLoginSuccess, isAuthenticated }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        setSuccess('Login successful!')
        setTimeout(() => {
          onLoginSuccess()
          setEmail('')
          setPassword('')
        }, 1000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer id="footer" className="bg-primary text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Sign In Form */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6">
              {isAuthenticated ? 'Welcome Back!' : 'Get Started'}
            </h3>
            {!isAuthenticated ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-text bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-text bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                {error && <p className="text-red-300 text-sm">{error}</p>}
                {success && <p className="text-green-300 text-sm">{success}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <p className="text-white/80">
                You're signed in. Start using Justifi's AI tools to transform your legal practice.
              </p>
            )}
          </div>
          
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-accent rounded-lg flex items-center justify-center transition-colors"
              >
                <Github size={24} />
              </a>
            </div>
            <div className="text-white/80 space-y-2">
              <p className="font-semibold">Justifi Legal AI Platform</p>
              <p className="text-sm">
                Empowering legal professionals with AI-driven research and document automation.
              </p>
            </div>
          </div>
        </div>
        
        {/* Legal Disclaimer */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <p className="text-white/60 text-sm text-center mb-4">
            <strong className="text-white">Legal Disclaimer:</strong> Justifi is a technology platform 
            providing AI-powered legal research and document automation tools. Justifi is not a law firm 
            and does not provide legal advice. The use of Justifi's services does not create an 
            attorney-client relationship. All outputs should be reviewed by qualified legal professionals.
          </p>
          <p className="text-white/60 text-sm text-center">
            © 2025 Justifi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

