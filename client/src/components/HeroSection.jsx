// import React from 'react';
// import { ArrowRight, Film, Star, MessageSquare, Play } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Navigate, useNavigate } from 'react-router-dom';
// // import { Navigate } from 'react-router-dom';



// const HeroSection = () => {

//   const navigate  = useNavigate();
//   return (
//     <section className="relative min-h-screen flex items-center justify-center pt-16 bg-gradient-to-b from-transparent to-gray  overflow-hidden">
//       {/* Movie background with darker overlay */}
//       <div className="absolute inset-0 bg-[url('../public/images/hero_background1.jpg')] bg-cover bg-center   bg-gradient-to-b from-transparent to-gray-800  "></div>
//       <div className="absolute inset-0 bg-gradient-to-b from-crate-darker/90 to-crate-dark/95"></div>
      
//       {/* Film grain effect */}
//       {/* <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div> */}
      
//       {/* Film reel animation effect */}
 
      
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="mb-6 inline-block ">
//             <div className="flex items-center justify-center bg-crate-accent/20 rounded-full p-4">
//               <Film className="h-12 w-12 text-crate-accent" />
//             </div>
//           </div>
          
//           <h1 className="text-4xl md:text-6xl font-montserrat font-bold mb-4 leading-tight text-crate-cream">
//             Your Movie Universe, <br />
//             <span className="text-gradient text-[#951b1b]">One Review at a Time</span>
//           </h1>
          
//           <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
//             Discover films, follow top reviewers, and join live discussions with our vibrant community of movie enthusiasts.
//           </p>
          
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
//             <Button onClick={() =>navigate('/user/signup')} className="btn-primary bg-red-600 text-lg group ">
//               <Star className="mr-2 h-5 w-5" />
//               Sign Up Free
//               <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
//             </Button>
            
//             <Button onClick={() =>navigate('/review')} className="btn-secondary bg-red-600 text-lg">
//               <Film className="mr-2 h-5 w-5" />
//               Browse Reviews
//             </Button>
            
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
//             <div className="glass-card p-6 text-center hover-scale">
//               <Star className="h-8 w-8 text-yellow-400 mb-3 mx-auto" />
//               <h3 className="text-white font-medium mb-1">Honest Ratings</h3>
//               <p className="text-white/60 text-sm">From cinephiles who share your taste</p>
//             </div>
            
//             <div className="glass-card p-6 text-center hover-scale">
//               <MessageSquare className="h-8 w-8  text-yellow-400 mb-3 mx-auto" />
//               <h3 className="text-white font-medium mb-1">Live Discussions coming soon</h3>
//               <p className="text-white/60 text-sm">Chat about new releases in real-time</p>
             
//             </div>
            
           
//           </div>
//         </div>
//       </div>
      
      
//     </section>
//   );
// };

// export default HeroSection;


import React, { useRef } from 'react';
import { ArrowRight, Film, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();

  // Mouse-based parallax effect for the cards
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(5px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 70 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 bg-black overflow-hidden">
      {/* Background image with cinematic gradient overlay */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-[url('../public/images/hero_background1.jpg')] bg-cover bg-center"
          animate={{ scale: [1, 1.05, 1], rotate: [0, -0.5, 0.5, 0] }}
          transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/95 backdrop-blur-sm" />
      </div>

      {/* Subtle grain effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      ></motion.div>

      {/* Main content */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Icon */}
          <motion.div
            className="mb-6 inline-block"
            variants={fadeUp}
            whileHover={{ scale: 1.1, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="flex items-center justify-center bg-crate-accent/30 rounded-full p-5 shadow-lg shadow-red-500/20">
              <Film className="h-12 w-12 text-crate-accent" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold font-montserrat mb-4 leading-tight text-white drop-shadow-lg"
            variants={fadeUp}
          >
            Your Movie Universe,<br />
            <motion.span
              className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
            >
              One Review at a Time
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            variants={fadeUp}
          >
            Discover films, follow top reviewers, and join live discussions with a vibrant community of movie enthusiasts.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-14"
            variants={fadeUp}
          >
            <Button
              onClick={() => navigate('/user/signup')}
              className="btn-primary bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-lg px-6 py-5 rounded-xl shadow-lg group transition-all duration-300"
            >
              <Star className="mr-2 h-5 w-5" />
              Sign Up Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={() => navigate('/review')}
              className="btn-secondary bg-white/10 hover:bg-white/20 text-lg px-6 py-5 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
            >
              <Film className="mr-2 h-5 w-5" />
              Browse Reviews
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="glass-card p-6 text-center rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ rotateX, rotateY }}
            >
              <Star className="h-8 w-8 text-yellow-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold text-lg mb-1">Honest Ratings</h3>
              <p className="text-white/60 text-sm">From cinephiles who share your taste</p>
            </motion.div>

            <motion.div
              className="glass-card p-6 text-center rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ rotateX, rotateY }}
            >
              <MessageSquare className="h-8 w-8 text-yellow-400 mb-3 mx-auto" />
              <h3 className="text-white font-semibold text-lg mb-1">Live Discussions</h3>
              <p className="text-white/60 text-sm">Chat about new releases in real-time</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;