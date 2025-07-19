import React from 'react';
import { ArrowRight, Film, Star, MessageSquare, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigate, useNavigate } from 'react-router-dom';
// import { Navigate } from 'react-router-dom';



const HeroSection = () => {

  const navigate  = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 bg-gradient-to-b from-transparent to-gray  overflow-hidden">
      {/* Movie background with darker overlay */}
      <div className="absolute inset-0 bg-[url('../public/images/hero_background1.jpg')] bg-cover bg-center   bg-gradient-to-b from-transparent to-gray-800  "></div>
      <div className="absolute inset-0 bg-gradient-to-b from-crate-darker/90 to-crate-dark/95"></div>
      
      {/* Film grain effect */}
      {/* <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div> */}
      
      {/* Film reel animation effect */}
 
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block ">
            <div className="flex items-center justify-center bg-crate-accent/20 rounded-full p-4">
              <Film className="h-12 w-12 text-crate-accent" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-4 leading-tight text-crate-cream">
            Your Movie Universe, <br />
            <span className="text-gradient text-[#951b1b]">One Review at a Time</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover films, follow top reviewers, and join live discussions with our vibrant community of movie enthusiasts.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button onClick={() =>navigate('/user/signup')} className="btn-primary bg-red-600 text-lg group ">
              <Star className="mr-2 h-5 w-5" />
              Sign Up Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button onClick={() =>navigate('/review')} className="btn-secondary bg-red-600 text-lg">
              <Film className="mr-2 h-5 w-5" />
              Browse Reviews
            </Button>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="glass-card p-6 text-center hover-scale">
              <Star className="h-8 w-8 text-yellow-400 mb-3 mx-auto" />
              <h3 className="text-white font-medium mb-1">Honest Ratings</h3>
              <p className="text-white/60 text-sm">From cinephiles who share your taste</p>
            </div>
            
            <div className="glass-card p-6 text-center hover-scale">
              <MessageSquare className="h-8 w-8  text-yellow-400 mb-3 mx-auto" />
              <h3 className="text-white font-medium mb-1">Live Discussions coming soon</h3>
              <p className="text-white/60 text-sm">Chat about new releases in real-time</p>
             
            </div>
            
           
          </div>
        </div>
      </div>
      
      
    </section>
  );
};

export default HeroSection;