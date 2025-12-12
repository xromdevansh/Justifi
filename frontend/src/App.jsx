import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import AskJustifi from './components/AskJustifi'
import Features from './components/Features'
import Confidentiality from './components/Confidentiality'
import Trust from './components/Trust'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import FeatureModal from './components/FeatureModal'

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isFeatureOpen, setIsFeatureOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleFeatureClick = (feature) => {
    if (isAuthenticated) {
      setSelectedFeature(feature)
      setIsFeatureOpen(true)
    } else {
      setIsLoginOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setIsLoginOpen(false)
  }

  return (
    <div className="min-h-screen">
      <Header 
        onSignInClick={() => setIsLoginOpen(true)} 
        isAuthenticated={isAuthenticated}
        onLogout={() => setIsAuthenticated(false)}
      />
      <Hero />
      <AskJustifi />
      <Features onFeatureClick={handleFeatureClick} />
      <Confidentiality />
      <Trust />
      <Footer 
        onLoginSuccess={handleLoginSuccess}
        isAuthenticated={isAuthenticated}
      />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <FeatureModal
        isOpen={isFeatureOpen}
        onClose={() => setIsFeatureOpen(false)}
        feature={selectedFeature}
      />
    </div>
  )
}

export default App


