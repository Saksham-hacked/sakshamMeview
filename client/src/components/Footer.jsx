
import React from 'react';
import { Film, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-crate-darker py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="h-8 w-8 text-crate-accent" />
              <span className="text-white font-montserrat font-bold text-xl">FilmCrate</span>
            </div>
            <p className="text-white/60 mb-6">
              Your social destination for movie reviews, discussions, and connections.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-crate-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-crate-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-crate-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Copyright</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} FilmCrate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;