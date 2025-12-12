import { useState, useEffect } from 'react'
import { Menu, X, LogOut } from 'lucide-react'

const Header = ({ onSignInClick, isAuthenticated, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToPlatform = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">J</span>
          </div>
          <span className="text-2xl font-heading font-bold text-primary">Justifi</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={scrollToPlatform}
            className="text-secondary hover:text-primary font-medium transition-colors"
          >
            Platform
          </button>
          
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={onSignInClick}
              className="btn-primary"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <button
            onClick={scrollToPlatform}
            className="block w-full text-left text-secondary hover:text-primary font-medium py-2"
          >
            Platform
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => {
                onLogout()
                setIsMobileMenuOpen(false)
              }}
              className="flex items-center space-x-2 w-full text-left text-secondary hover:text-primary py-2"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onSignInClick()
                setIsMobileMenuOpen(false)
              }}
              className="btn-primary w-full"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Header


