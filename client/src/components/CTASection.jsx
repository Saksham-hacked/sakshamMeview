import React from 'react';
import { ArrowRight, Film, Star, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-crate-accent/20 to-crate-secondary/20"></div>
      
      {/* Film strip overlay */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black/80 flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-full aspect-square border-r border-white/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-white/20"></div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-black/80 flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="h-full aspect-square border-r border-white/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border border-white/20"></div>
          </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Clapperboard className="h-16 w-16 text-crate-accent mx-auto mb-6" />
          
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">
            <span className="text-gradient">Ready to Join the Cinematic Conversation?</span>
          </h2>
          
          <p className="text-white/80 mb-10 text-lg">
            Create your account today and join thousands of movie enthusiasts. 
            Share your ratings, discover new films, and connect with other cinephiles.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button className="btn-primary text-lg group px-8 py-6">
              <Star className="mr-2 h-5 w-5" />
              Create Your Movie Profile
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="max-w-xl mx-auto grid grid-cols-3 gap-4 mb-8">
            <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-crate-accent">10K+</div>
              <div className="text-white/70 text-sm">Films Reviewed</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-crate-accent">50K+</div>
              <div className="text-white/70 text-sm">Active Users</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-crate-accent">100+</div>
              <div className="text-white/70 text-sm">New Reviews Daily</div>
            </div>
          </div>
          
          {/* Movie quotes */}
          <div className="my-12 py-6 px-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
            <p className="italic text-white/90 text-xl">"Cinema is a matter of what's in the frame and what's out."</p>
            <p className="text-white/60 mt-2">— Martin Scorsese</p>
          </div>
          
          <p className="mt-6 text-white/60 text-sm">
            No credit card required. Start your film journey today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;