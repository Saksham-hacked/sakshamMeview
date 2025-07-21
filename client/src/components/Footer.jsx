import React from 'react';
import { Clapperboard, Film, Lightbulb, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 py-16 text-gray-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">

          {/* Logo & Tagline */}
          <div className="flex flex-col items-center mb-8">
            <Clapperboard className="h-12 w-12 text-yellow-400 mb-4 animate-pulse" />
            <span className="text-gray-100 font-bold text-3xl">meView</span>
            <p className="mt-2 max-w-sm text-gray-400">
              Your cinematic journey begins here. Rate, review, and connect with fellow movie lovers.
            </p>
          </div>

          {/* Social Media Links */}
          {/* <div className="flex space-x-6 mb-12">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
          </div> */}
          
          {/* Fun Facts Section */}
          <div className="mb-12 border-t border-zinc-800 pt-10">
            <h3 className="flex items-center justify-center text-gray-300 font-semibold mb-4">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
              Did You Know?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-sm">
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-yellow-400/10 shadow-lg transition-transform hover:scale-105">
                <p className="text-gray-300">The "Wilhelm Scream" has been used in over 400 films and TV shows.</p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-yellow-400/10 shadow-lg transition-transform hover:scale-105">
                <p className="text-gray-300">The longest film ever made is an experimental piece lasting 857 hours.</p>
              </div>
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-yellow-400/10 shadow-lg transition-transform hover:scale-105">
                <p className="text-gray-300">Film projection in early cinemas was so loud, it often drowned out the dialogue.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} meView. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;