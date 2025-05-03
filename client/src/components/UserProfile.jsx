import React from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, List, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';
import { envApi } from './getEnvironment';
import { useState } from 'react';
// import { checkLoginStatus } from '@/utils/checklogin';

const UserProfile = ({currUser}) => {
  const navigate = useNavigate();
  
  const { username } = useParams();
  
  const [userdata, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userReviews, setUserReviews] = useState([]);





  console.log("currUser",currUser);

  useEffect(() => {
    if (currUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [currUser]);
  




  
 

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

  console.log("userdata",userdata);

 useEffect(() => {
      const getUserReviews = async () => {
        try {
          const response = await fetch(`http://${envApi}/review/userReview/${userdata._id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('User reviews:', data);
    
          setUserReviews(data.data); 
          console.log("userReviews",userReviews);
    
          
        } catch (error) {
          console.error('Error fetching user reviews:', error);
        }
      };
      if (userdata) {
        getUserReviews();
      }
    }, [userdata]);

    if (!userdata) {
      return <div>Loading...</div>; 
    }
    



const handleFollow = async () => {
    //check if user is logged in
    if (!isLoggedIn) {
      alert('You must be logged in to follow this user.');
      navigate("/user/signin")
      return;
    }

  try {
    const response= await fetch(`http://${envApi}/user/follow/`, {
      method: 'POST',
      body: JSON.stringify({ targetUserId:userdata._id }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      // navigate("/user/signin")
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    window.location.reload();
    

  } catch (error) {
    console.error('Error following user:', error);
  }
};

  const handleUnfollow = async () => {
    //check if user is logged in
    if (!isLoggedIn) {
      alert('You must be logged in to unfollow this user.');
      navigate("/user/signin")
      return;
    }

    try {
      const response= await fetch(`http://${envApi}/user/unfollow/`, {
        method: 'POST',
        body: JSON.stringify({ targetUserId:userdata._id }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        // navigate("/user/signin")
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      window.location.reload();

    } catch (error) {
      console.error('Error unfollowing user:', error);  
        }
    }





  // Mock data - in a real app, this would come from an API
  const userProfile = {
    username: username || "MovieBuff",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    stats: {
      reviews: 42,
      followers: 156,
      following: 89
    },
    isFollowing: false
  };

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
    rating=rating/2;
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
      <Navbar currUser={currUser} />
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
              {userdata?.followers.includes(currUser?._id) ?
              <Button variant="outline" onClick={handleUnfollow} className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
              <User className="w-4 h-4 mr-2" />
              Following
            </Button>:<Button variant="outline" onClick={handleFollow} className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                <User className="w-4 h-4 mr-2" />
                Follow
              </Button>}
              {/* <Button variant="outline" onClick={handleFollow} className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                <User className="w-4 h-4 mr-2" />
                Follow
              </Button> */}
            </div>
            
            <div className="flex justify-center md:justify-start space-x-6">
              <div className="text-center">
                <p className="text-xl font-semibold">{userReviews.length}</p>
                <p className="text-gray-400 text-sm">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">{userdata.followers.length}</p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">{userdata.following.length}</p>
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
              <div className="space-y-6  overflow-y-scroll max-h-[200px] md:max-h-[400px]">
              {userReviews.map(r=>(
                  <div key={r.movieId} className="bg-[#242424] rounded-lg p-4 hover:ring-1 hover:ring-crate-gold/30 transition">
                    <div className="flex flex-col gap-4 md:flex">
                      <img src={`https://image.tmdb.org/t/p/w92${r.moviePoster}`} alt={r.movieTitle} className="w-16 aspect-[2/3] object-cover rounded" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold">{r.movieTitle}</h3>
                          {renderStars(r.rating)}
                        </div>
                        <p className="text-[#E0E0E0]/80 text-sm line-clamp-2">{r.reviewText}</p>
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