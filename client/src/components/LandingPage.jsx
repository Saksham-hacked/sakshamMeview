import React from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection' 
import FeaturesSection from './FeaturesSection'
import CTASection from './CTASection'
import Footer from './Footer'


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-crate-dark flex flex-col">
    <Navbar />
    <main>
      
      <HeroSection />
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      <CTASection />
    </main>
    <Footer />
  </div>
  )
}

export default LandingPage
