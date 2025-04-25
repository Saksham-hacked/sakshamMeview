import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { envApi } from './getEnvironment';

import { Film, User, Mail, Lock, ArrowRight, Clapperboard } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sign in attempt with:', { email, password });
    
    const res= await fetch(`http://${envApi}/user/login`, {
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
    console.log(res);
    if (!res.ok) {
      // try to parse JSON error payload, fallback to text
      const contentType = res.headers.get("content-type") || "";
      const errPayload = contentType.includes("application/json")
        ? await res.json()
        : await res.text();
      console.error("Server error payload:", errPayload);
      throw new Error(errPayload.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    console.log("this is data",data);

    if (data.success) {
      console.log("Login successful:", data);
      // Redirect to the profile page or any other page
      navigate("/user/profile");
    } else {
      console.error("Login failed:", data.message);
      // Handle login failure (e.g., show an error message)
    }

    

  };

  return (
    <div className="min-h-screen bg-crate-dark flex flex-col">
      <div className="fixed w-full z-50 bg-black/70 backdrop-blur-md border-b border-crate-gold/20 py-4">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <Clapperboard className="h-8 w-8 text-crate-gold" />
            <div className="flex flex-col">
              <span className="text-crate-cream font-montserrat font-bold text-xl">FilmCrate</span>
              <span className="text-crate-cream/50 text-xs">Rate. Review. Discover.</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="w-full max-w-md p-8 space-y-8 bg-crate-light/90 backdrop-blur-lg rounded-lg border border-crate-gold/20 relative overflow-hidden">
          {/* Film grain overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-30 mix-blend-overlay pointer-events-none"></div>
          
          <div className="text-center relative z-10">
            <Film className="mx-auto h-12 w-12 text-crate-gold" />
            <h2 className="mt-4 text-2xl font-montserrat font-bold text-crate-cream">Welcome Back</h2>
            <p className="mt-2 text-crate-cream/70">Sign in to continue your cinematic journey</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-crate-cream">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-crate-cream">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
                    required
                  />
                </div>
              </div>
            </div>

           

            <Button type="submit" className="w-full bg-crate-gold hover:bg-crate-gold/90 text-black">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="text-center text-sm text-crate-cream/70">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-crate-gold hover:text-crate-gold/80">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="py-6 text-center text-crate-cream/50 text-sm">
        <p>© 2025 FilmCrate. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SignIn;