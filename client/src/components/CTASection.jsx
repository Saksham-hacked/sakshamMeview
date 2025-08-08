// import React from 'react';
// import { ArrowRight, Film, Star, Clapperboard } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';

// const CTASection = () => {
//   const navigate = useNavigate();
//   return (
//     <section className="py-20 relative overflow-hidden bg-zinc-950">
//       {/* Cinematic background */}
//       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
//       {/* Darker overlay for better text readability and theme consistency */}
//       <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/60 to-zinc-950/80"></div>
      
//       {/* Film strip overlay - top */}
//       <div className="absolute top-0 left-0 w-full h-12 bg-zinc-900 flex items-center justify-center border-b border-yellow-400/20">
//         {[...Array(20)].map((_, i) => (
//           <div key={`top-strip-${i}`} className="h-full aspect-square border-r border-zinc-700 flex items-center justify-center">
//             <div className="w-6 h-6 rounded-full border border-yellow-400/30"></div>
//           </div>
//         ))}
//       </div>
//       {/* Film strip overlay - bottom */}
//       <div className="absolute bottom-0 left-0 w-full h-12 bg-zinc-900 flex items-center justify-center border-t border-yellow-400/20">
//         {[...Array(20)].map((_, i) => (
//           <div key={`bottom-strip-${i}`} className="h-full aspect-square border-r border-zinc-700 flex items-center justify-center">
//             <div className="w-6 h-6 rounded-full border border-yellow-400/30"></div>
//           </div>
//         ))}
//       </div>
      
//       <div className="container mx-auto px-4 relative z-10">
//         <div className="max-w-3xl mx-auto text-center">
//           <Clapperboard className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          
//           <h2 className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6">
//             Ready to Join the Cinematic Conversation?
//           </h2>
          
//           <p className="text-gray-300 mb-10 text-lg">
//             Create your account today and join community of movie enthusiasts. 
//             Share your ratings, discover new films, and connect with other cinephiles.
//           </p>
          
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
//             <Button onClick={() =>navigate('/user/signup')} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md px-8 py-6 text-lg group shadow-lg transition-all duration-300 hover:shadow-yellow-400/30">
//               <Star className="mr-2 h-5 w-5" />
//               Create Your Movie Profile
//               <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
//             </Button>
//           </div>
          
//           {/* Responsive grid for statistics */}
//           <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//             <div className="bg-zinc-800/50 rounded-lg p-4 backdrop-blur-sm border border-zinc-700 shadow-md">
//               {/* <div className="text-2xl font-bold text-yellow-400">10K+</div> */}
//               <div className="text-gray-400 text-sm">Films Reviewes</div>
//             </div>
//             <div className="bg-zinc-800/50 rounded-lg p-4 backdrop-blur-sm border border-zinc-700 shadow-md">
//               {/* <div className="text-2xl font-bold text-yellow-400">50K+</div> */}
//               <div className="text-gray-400 text-sm">Interact with cinefiles</div>
//             </div>
//             <div className="bg-zinc-800/50 rounded-lg p-4 backdrop-blur-sm border border-zinc-700 shadow-md">
//               {/* <div className="text-2xl font-bold text-yellow-400">100+</div> */}
//               <div className="text-gray-400 text-sm">Get Recommendations</div>
//             </div>
//           </div>
          
//           {/* Movie quotes */}
//           <div className="my-12 py-6 px-4 bg-zinc-800/50 backdrop-blur-md rounded-lg border border-zinc-700 shadow-md">
//             <p className="italic text-gray-200 text-xl">"Cinema is a matter of what's in the frame and what's out."</p>
//             <p className="text-gray-400 mt-2">— Martin Scorsese</p>
//           </div>
          
//           <p className="mt-6 text-gray-500 text-sm">
//             No credit card required. Start your film journey today.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CTASection;
import React from 'react';
import { ArrowRight, Star, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // New animation for the continuous film reel effect
  const reelVariants = {
    animate: {
      x: ['0%', '-100%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 25, // Adjust duration for speed
          ease: 'linear',
        },
      },
    },
  };

  const filmStripContent = (
    <div className="flex items-center h-full">
      {[...Array(30)].map((_, i) => (
        <div key={i} className="h-full w-[4rem] flex-shrink-0 border-r border-zinc-700 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border border-yellow-400/30"></div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-20 relative overflow-hidden bg-zinc-950">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
      {/* Darker overlay for better text readability and theme consistency */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/60 to-zinc-950/80"></div>
      
      {/* Film strip overlay - top */}
      <div className="absolute top-0 left-0 w-full h-12 bg-zinc-900 overflow-hidden border-b border-yellow-400/20">
        <motion.div
          className="flex"
          variants={reelVariants}
          animate="animate"
        >
          {filmStripContent}
          {filmStripContent} {/* Duplicated content for a seamless loop */}
        </motion.div>
      </div>

      {/* Film strip overlay - bottom */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-zinc-900 overflow-hidden border-t border-yellow-400/20">
        <motion.div
          className="flex"
          variants={reelVariants}
          animate="animate"
        >
          {filmStripContent}
          {filmStripContent} {/* Duplicated content for a seamless loop */}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <Clapperboard className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6"
            variants={itemVariants}
          >
            Ready to Join the Cinematic Conversation?
          </motion.h2>

          <motion.p
            className="text-gray-300 mb-10 text-lg"
            variants={itemVariants}
          >
            Create your account today and join community of movie enthusiasts.
            Share your ratings, discover new films, and connect with other cinephiles.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
            variants={itemVariants}
          >
            <Button
              onClick={() => navigate('/user/signup')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md px-8 py-6 text-lg group shadow-lg transition-all duration-300 hover:shadow-yellow-400/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="mr-2 h-5 w-5" />
              Create Your Movie Profile
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Responsive grid for statistics */}
          <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              className="bg-zinc-800/50 rounded-lg p-4 backdrop-blur-sm border border-zinc-700 shadow-md"
              variants={itemVariants}
            >
              <div className="text-2xl font-bold text-yellow-400">10K+</div>
              <div className="text-gray-400 text-sm">Films Reviewed</div>
            </motion.div>
            <motion.div
              className="bg-zinc-800/50 rounded-lg p-4 backdrop-blur-sm border border-zinc-700 shadow-md"
              variants={itemVariants}
            >
              <div className="text-2xl font-bold text-yellow-400">50K+</div>
              <div className="text-gray-400 text-sm">Cinephiles Interacted</div>
            </motion.div>
            <motion.div
              className="bg-zinc-800/50 rounded-lg p-4 backdrop-blur-sm border border-zinc-700 shadow-md"
              variants={itemVariants}
            >
              <div className="text-2xl font-bold text-yellow-400">100+</div>
              <div className="text-gray-400 text-sm">Personalized Recommendations</div>
            </motion.div>
          </div>

          {/* Movie quotes */}
          <motion.div
            className="my-12 py-6 px-4 bg-zinc-800/50 backdrop-blur-md rounded-lg border border-zinc-700 shadow-md"
            variants={itemVariants}
          >
            <p className="italic text-gray-200 text-xl">"Cinema is a matter of what's in the frame and what's out."</p>
            <p className="text-gray-400 mt-2">— Martin Scorsese</p>
          </motion.div>

          <motion.p
            className="mt-6 text-gray-500 text-sm"
            variants={itemVariants}
          >
            No credit card required. Start your film journey today.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;