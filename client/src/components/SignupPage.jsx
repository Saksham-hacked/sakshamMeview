


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Film, User, Mail, Lock, Ticket, ArrowRight, Clapperboard, Camera } from 'lucide-react';
// import { envApi } from './getEnvironment';

// const SignUp = () => {
//   const [name, setName]           = useState('');
//   const [email, setEmail]         = useState('');
//   const [password, setPassword]   = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [error, setError]         = useState('');
//   const navigate = useNavigate();

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!imageFile) {
//       setError('Please choose a profile image.');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('username', name);
//       formData.append('email', email);
//       formData.append('password', password);
//       formData.append('profilePic', imageFile);

//       const res = await fetch(`http://${envApi}/user/register`, {
//         method: 'POST',
//         body: formData,
//         credentials: 'include',
//       });
//       console.log(res);

//       if (!res.ok) {
//         const text = await res.text(); // get raw response
//         const match = text.match(/Error:\s(.*?)<br>/i);
//         // console.log("this is match",match);
//         if (match) {
//           setError(match[1]);
//           return;
//         }



//         console.error("Server returned error:", text);
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
      
//       const data = await res.json();
//       console.log("this is data",data);

//       if (data.status !== 201) {
//         throw new Error(data.message || 'Failed to create account');
//       }

//       navigate('/user/signin');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-crate-dark flex flex-col">
//       {/* Fixed Navbar */}
//       <div className="fixed w-full z-50 bg-black/70 backdrop-blur-md border-b border-crate-gold/20 py-4">
//         <div className="container mx-auto">
//           <Link to="/" className="flex items-center space-x-2">
//             <Clapperboard className="h-8 w-8 text-crate-gold" />
//             <div className="flex flex-col">
//               <span className="text-crate-cream font-montserrat font-bold text-xl">meView</span>
//               <span className="text-crate-cream/50 text-xs">Rate. Review. Discover.</span>
//             </div>
//           </Link>
//         </div>
//       </div>

//       {/* Form Container */}
//       <div className="flex-1 flex items-center justify-center pt-20">
//         <div className="w-full max-w-md p-8 space-y-8 bg-crate-light/90 backdrop-blur-lg rounded-lg border border-crate-gold/20 relative overflow-hidden">
//           {/* Grain Overlay */}
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-30 mix-blend-overlay pointer-events-none"></div>

//           {/* Title */}
//           <div className="text-center relative z-10">
//             <Ticket className="mx-auto h-12 w-12 text-crate-gold" />
//             <h2 className="mt-4 text-2xl font-montserrat font-bold text-crate-cream">Join meview</h2>
//             <p className="mt-2 text-crate-cream/70">Create an account to start your film journey</p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="text-red-500 text-sm text-center relative z-10">{error}</div>
//           )}

//           {/* Sign Up Form */}
//           <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
//             <div className="space-y-4">

//               {/* Profile Image Upload */}
//               <div className="space-y-2">
//                 <Label htmlFor="profileImage" className="text-crate-cream">Profile Image</Label>
//                 <div className="relative flex items-center">
//                   <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
//                   <Input
//                     id="profileImage"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Full Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="name" className="text-crate-cream">Full Name</Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
//                   <Input
//                     id="name"
//                     type="text"
//                     value={name}
//                     onChange={e => setName(e.target.value)}
//                     placeholder="Enter your full name"
//                     className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-crate-cream">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
//                   <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-crate-cream">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
//                   <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     placeholder="Create a password"
//                     className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
//                     required
//                   />
//                 </div>
//               </div>

//             </div>

//             {/* Submit */}
//             <Button type="submit" className="w-full bg-crate-gold hover:bg-crate-gold/90 text-black flex justify-center items-center">
//               Create Account <ArrowRight className="ml-2 h-4 w-4" />
//             </Button>

//             <p className="text-center text-sm text-crate-cream/70">
//               Already have an account?{' '}
//               <Link to="/signin" className="font-medium text-crate-gold hover:text-crate-gold/80">
//                 Sign in
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="py-6 text-center text-crate-cream/50 text-sm">
//         © 2025 meView. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default SignUp;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, User, Mail, Lock, Ticket, ArrowRight, Clapperboard, Camera } from 'lucide-react';
import { envApi } from './getEnvironment';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please choose a profile image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('profilePic', imageFile);

      const res = await fetch(`http://${envApi}/user/register`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      console.log(res);

      if (!res.ok) {
        const text = await res.text();
        const match = text.match(/Error:\s(.*?)<br>/i);
        if (match) {
          setError(match[1]);
          return;
        }

        console.error("Server returned error:", text);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("this is data", data);

      if (data.status !== 201) {
        throw new Error(data.message || 'Failed to create account');
      }

      navigate('/user/signin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      {/* Fixed Navbar */}
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

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center pt-20 pb-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900/80 backdrop-blur-lg rounded-lg border border-yellow-400/20 shadow-xl shadow-yellow-400/10">

          {/* Title */}
          <div className="text-center relative z-10">
            <Ticket className="mx-auto h-12 w-12 text-yellow-400" />
            <h2 className="mt-4 text-3xl font-bold text-yellow-400">Join meView</h2>
            <p className="mt-2 text-gray-400">Create an account to start your film journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center relative z-10 bg-red-900/20 py-2 rounded-md">{error}</div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
            <div className="space-y-4">

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="profileImage" className="text-gray-300">Profile Image</Label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400/70" />
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="pl-10 bg-zinc-800 border-zinc-700 text-gray-200  file:text-yellow-400 file:border-none file:hover:bg-yellow-500 file:transition-colors file:cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">UserName</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400/70" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter username"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-gray-200 focus:border-yellow-400 focus:ring-yellow-400/30 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400/70" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-gray-200 focus:border-yellow-400 focus:ring-yellow-400/30 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400/70" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-gray-200 focus:border-yellow-400 focus:ring-yellow-400/30 transition-colors"
                    required
                  />
                </div>
              </div>

            </div>

            {/* Submit */}
            <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold flex justify-center items-center">
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/user/signin" className="font-medium text-yellow-400 hover:text-yellow-500 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © 2025 meView. All rights reserved.
      </footer>
    </div>
  );
};

export default SignUp;