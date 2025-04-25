

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Check, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { envApi } from './getEnvironment';
import  { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';




const mockUsers = [
  { id: '1', name: 'Jane Cooper', username: '@janecooper', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', isFollowing: false },
  { id: '2', name: 'Wade Warren', username: '@wadewarren', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', isFollowing: true },
  { id: '3', name: 'Esther Howard', username: '@estherhoward', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', isFollowing: false },
];

const topReviewers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Film Expert",
    reviewCount: 156,
    quote: "Passionate about analyzing cinematography and storytelling elements.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4"
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Movie Critic",
    reviewCount: 142,
    quote: "Dedicated to uncovering hidden gems in independent cinema.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5"
  },
  {
    id: 3,
    name: "David Chen",
    role: "Film Enthusiast",
    reviewCount: 128,
    quote: "Bringing fresh perspectives to classic and contemporary films.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6"
  }
];

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleFollow = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

 

  const handleSearch = useRef(
    debounce(async (query) => {
      setSearchQuery(query);
      if (!query) {
        
        return;
      }
      
      try {
        
        const url = `http://${envApi}/user/search?query=${query}`;
        console.log("this is url",url);
  
        const res = await fetch(url);
        console.log("this is res",res);
        
        const response = await res.json();
        console.log("this is response",response);
        setUsers(response.data);
        // setSuggestions(movies.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching  users:', error);
      }
    }, 300)
  ).current;

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Search and Users Section */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-6">Community</h1>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-zinc-900 border-zinc-800"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 overflow-y-auto bg-zinc-900 rounded-lg border border-zinc-800"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profilePic} />
                      <AvatarFallback>{user.username}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{user.username}</h3>
                      {/* <p className="text-sm text-gray-400">{user.username}</p> */}
                    </div>
                  </div>
                  <Button variant="default" onClick={()=>{navigate(`/user/profile/${user.username}`)}}  className="flex items-center bg-yellow-600 hover:bg-yellow-500 space-x-2">
                    visit profile
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Reviewers Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Top Reviewers</h2>
            <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto ">
              {topReviewers.map((reviewer) => (
                <Card key={reviewer.id} className="bg-zinc-900    border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={reviewer.avatar} />
                        <AvatarFallback>{reviewer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{reviewer.name}</h3>
                          <p className="text-sm text-gray-400">{reviewer.role}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(reviewer.rating)].map((_, i) => (
                            <Star 
                              key={i}
                              className="h-4 w-4 fill-yellow-500 text-yellow-500"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-300 ">{reviewer.quote.length > 50 ? reviewer.quote.slice(0, 50) + '...' : reviewer.quote}</p>
                        <p className="text-sm text-gray-400">{reviewer.reviewCount} reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;



// MovieSearchBar.jsx




        


  