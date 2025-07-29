


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import getEnvironment from './getEnvironment';

import { Film, Mail, Lock, ArrowRight, Clapperboard, Loader2 } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const envApi = getEnvironment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Clear previous errors
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${envApi}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        let errorText = `HTTP ${res.status}`;
        
        // This is the solution for the HTML error page from backend
        if (contentType.includes("application/json")) {
          // Handle JSON response if backend ever sends one
          const errPayload = await res.json();
          errorText = errPayload.message || errPayload.error || JSON.stringify(errPayload);
        } else {
          // If not JSON, read the response as text and parse the message
          const text = await res.text();
          const match = text.match(/Error:\s(.*?)(?=<br>)/i);
          if (match && match[1]) {
            // Extract the message from the HTML block
            errorText = match[1].trim();
          } else {
            // Fallback for unexpected formats
            console.error("Could not parse error message from HTML:", text);
            errorText = "An unexpected error occurred. Please try again.";
          }
        }
        
        throw new Error(errorText);
      }
      
      const data = await res.json();
      console.log("Login successful:", data);

      if (data.success) {
        navigate("/user/profile");
      } else {
        setErrorMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      
      console.error("Error during login:");
      console.error("Login failed:",  error);
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <div className="fixed w-full z-50 bg-black/70 backdrop-blur-md border-b border-yellow-400/20 py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Clapperboard className="h-8 w-8 text-yellow-400" />
            <div className="flex flex-col">
              <span className="text-gray-100 font-bold text-xl">meView</span>
              <span className="text-gray-400 text-xs">Rate. Review. Discover.</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center pt-20 pb-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900/80 backdrop-blur-lg rounded-lg border border-yellow-400/20 shadow-xl shadow-yellow-400/10">
          
          <div className="text-center relative z-10">
            <Film className="mx-auto h-12 w-12 text-yellow-400" />
            <h2 className="mt-4 text-3xl font-bold text-yellow-400">Welcome Back</h2>
            <p className="mt-2 text-gray-400">Sign in to continue your cinematic journey</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
            {errorMessage && (
              <div className="bg-red-900/40 text-red-300 border border-red-800 p-3 rounded-md text-sm text-center">
                {errorMessage}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400/70" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-gray-200 focus:border-yellow-400 focus:ring-yellow-400/30 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400/70" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-gray-200 focus:border-yellow-400 focus:ring-yellow-400/30 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md transition-colors shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/user/signup" className="font-medium text-yellow-400 hover:text-yellow-500 transition-colors">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 meView All rights reserved.</p>
      </div>
    </div>
  );
};

export default SignIn;