

import React from 'react';
import { Star, Users, ThumbsUp, MessageSquare, Film, Ticket, Tv, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="bg-zinc-900/80 backdrop-blur-lg border border-yellow-400/20 shadow-xl shadow-yellow-400/10 h-full relative transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <CardHeader>
        <div className="p-4 rounded-full w-16 h-16 flex items-center justify-center bg-yellow-400/10 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      title: "Rate & Review Films",
      description: "Share your thoughts on the latest blockbusters, indie gems, and classic masterpieces with detailed ratings and reviews."
    },
    {
      icon: <Film className="h-8 w-8 text-yellow-400" />,
      title: "Recommend Movies",
      description: "Create and share custom watchlists for any genre or occasion. Never miss a must-watch film with recommendations from critics and friends."
    },
    {
      icon: <Users className="h-8 w-8 text-yellow-400" />,
      title: "Follow Critics & Friends",
      description: "Connect with professional critics and friends with similar taste. Build your network and never miss reviews from people you trust."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-yellow-400" />,
      title: "Film Discussion Forums (coming soon)",
      description: "Dive deep into theories, interpretations, and analysis in our dedicated movie forums. Discuss plot twists and endings with fellow cinephiles."
    }
  ];

  return (
    <section id="features" className="py-20 bg-zinc-950 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="text-yellow-400">The Ultimate Movie Platform</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            FilmCrate is more than just reviews. It's a complete cinematic experience designed for true movie lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;