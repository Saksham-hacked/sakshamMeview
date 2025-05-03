import React from 'react';
import { Film, Search, Star, Ticket, User, Popcorn, Clapperboard } from 'lucide-react';
import { Button } from "@/components/ui/button"
import SearchBar from "./SearchBar"
import { Navigate, useNavigate } from 'react-router-dom';
import { envApi } from './getEnvironment';
import { useEffect } from 'react';
import { useState } from 'react';
// import { checkLoginStatus } from '@/utils/checklogin';





const Navbar = ({currUser}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  useEffect(() => {
    if (currUser) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }
  }, [currUser]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://${envApi}/user/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setIsLoggedIn(false);
      navigate("/user/signin");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  
  
  return (
    <nav className="fixed w-full z-50 bg-black/70 backdrop-blur-md text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clapperboard className="h-8 w-8 text-yellow-400" />
          <div className="flex flex-col">
            <span className="text-crate-cream  font-montserrat font-bold text-xl">meView</span>
            <span className="text-crate-cream/50 text-xs">Rate. Review. Discover.</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-crate-cream/80 hover:text-crate-cream transition-colors flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400" />
            <span>Reviews</span>
          </a>
          <a href="#" className="text-crate-cream/80 hover:text-crate-cream transition-colors flex items-center">
            <Film className="h-4 w-4 mr-1 text-yellow-400" />
            <span>features</span>
          </a>
          
          <a href="/user/community" className="text-crate-cream/80 hover:text-cream transition-colors flex items-center">
            <Popcorn className="h-4 w-4 mr-1 text-yellow-400" />
            <span>Community</span>
          </a>
          
          <div className="ml-4 flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-crate-cream/80 hover:bg-yello-400">
              <Search className="h-5 w-5" />
              
            </Button>
            {isLoggedIn ? (
              <>
              <Button onClick={() => {navigate("/user/profile")}} className="vintage-button bg-yellow-600 hover:bg-yellow-700 flex items-center">
                <User className="h-4 w-4 mr-2" />
                {/* <span>Profile</span> */}
              </Button>
              <Button onClick={handleLogout} className="vintage-button bg-yellow-600 hover:bg-yellow-700 flex items-center">
                {/* <User className="h-4 w-4 mr-2" /> */}
                <span>logout</span>
              </Button></>
            ) : (
              <Button onClick={() => {navigate("/user/signin")}} className="vintage-button bg-yellow-600 hover:bg-yellow-700 flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>Sign in</span>
              </Button>
            )}
            {/* <Button onClick={() => {navigate("/user/signin")}} className="vintage-button bg-yellow-600 hover:bg-yellow-700 flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Sign In</span>
            </Button> */}
          </div>
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="text-crate-cream">
            <span className="sr-only">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;