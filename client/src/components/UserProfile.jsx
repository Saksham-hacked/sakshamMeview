import React from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, List, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';
import { envApi } from './getEnvironment';
import { useState } from 'react';

const UserProfile = () => {
  
  const { username } = useParams();
//   console.log("this is username",username);
  const [user, setUserData] = useState(null);


useEffect(() => {
   const fetchUser = async () => {
          try {
              const response = await fetch(`http://${envApi}/user/${username}`,{
                  method: 'GET',
                //   credentials: 'include',
                  headers: {
                  'Content-Type': 'application/json',
                  },
              }); // Adjust the endpoint as needed
              if (!response.ok) {
              throw new Error('Network response was not ok');
              }
              const data = await response.json();
              console.log(data);
              setUserData(data.data);
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };
  fetchUser();
}, []);
  // Mock data - in a real app, this would come from an API
//   const userProfile = {
//     username: username || "MovieBuff",
//     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
//     stats: {
//       reviews: 42,
//       followers: 156,
//       following: 89
//     },
//     isFollowing: false
//   };

  const topLists = [
    { id: 1, title: "Best Sci-Fi Films", posters: Array(5).fill("/placeholder.svg") },
    { id: 2, title: "Classic Noir Movies", posters: Array(5).fill("/placeholder.svg") },
  ];

  const reviews = [
    { 
      id: 1, 
      movie: "Inception", 
      rating: 4.5, 
      content: "A mind-bending journey through dreams within dreams...", 
      poster: "/placeholder.svg",
      date: "2024-03-15"
    },
    { 
      id: 2, 
      movie: "Parasite", 
      rating: 5, 
      content: "A masterful commentary on class divide with thrilling twists...", 
      poster: "/placeholder.svg",
      date: "2024-03-10"
    }
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        ))}
        {halfStar && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/50" />}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (halfStar ? 1 : 0)} className="w-4 h-4 text-yellow-500/30" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-28 h-28 border-2 border-yellow-500">
            <AvatarImage src={userdata.profilePic} alt={userdata.username} />
            <AvatarFallback className="bg-zinc-900 text-yellow-500 text-2xl">
              {userdata.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{userdata.username}</h1>
              <Button variant="outline" className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                <User className="w-4 h-4 mr-2" />
                Follow
              </Button>
            </div>
            
            <div className="flex justify-center md:justify-start space-x-6">
              <div className="text-center">
                {/* <p className="text-xl font-semibold">{userProfile.stats.reviews}</p> */}
                <p className="text-gray-400 text-sm">Reviews</p>
              </div>
              <div className="text-center">
                {/* <p className="text-xl font-semibold">{userProfile.stats.followers}</p> */}
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                {/* <p className="text-xl font-semibold">{userProfile.stats.following}</p> */}
                <p className="text-gray-400 text-sm">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lists & Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Lists */}
          <Card className="lg:col-span-3 bg-zinc-900 border-yellow-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <List className="mr-2 h-5 w-5 text-yellow-500" />
                Top Lists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topLists.map(list => (
                  <div key={list.id} className="bg-zinc-800 rounded-lg overflow-hidden hover:ring-1 hover:ring-yellow-500/50 transition-all">
                    <div className="grid grid-cols-5 gap-0.5">
                      {list.posters.map((poster, idx) => (
                        <img 
                          key={idx} 
                          src={poster} 
                          alt="Movie poster" 
                          className="w-full aspect-[2/3] object-cover"
                        />
                      ))}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium truncate">{list.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="lg:col-span-3 bg-zinc-900 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="bg-zinc-800 rounded-lg p-4 hover:ring-1 hover:ring-yellow-500/30 transition-all">
                    <div className="flex gap-4">
                      <img 
                        src={review.poster} 
                        alt={review.movie}
                        className="w-16 aspect-[2/3] object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{review.movie}</h3>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{review.content}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-400">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;