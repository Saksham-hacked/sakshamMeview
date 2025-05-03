import React, { useState,useEffect } from 'react';
// import { envApi } from './getEnvironment';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { envApi } from './getEnvironment';
import {
  Star,
  User as UserIcon,
  List,
  Plus,
  
  Ticket,
  
  Edit,
 
  ArrowRight,
  Clapperboard,
  Camera,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from './SearchBar';

export default function ProfilePage({currUser}) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [userData,setUserData] = useState(null);
  const [movieData,setMovieData] = useState(null);
  const [reviewDialogDisplay, setReviewDialogDisplay] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [rating, setRating] = useState(null);
  const [review, setReview] = useState('');
  const [spoiler, setSpoiler] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  
  

    useEffect(() => {
    // Fetch user data from the server (replace with your API call)
    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://${envApi}/user/`,{
                method: 'GET',
                credentials: 'include',
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
            console.log("userData",userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    const fetchMovies = async () => {
      try {
        const apiKey = '952fd5ce73dcd68d8702dc0aa5fcc3cb';
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_original_language=hi&with_genres=53&region=IN&release_date.gte=2020-01-01&vote_average.gte=7&sort_by=popularity.desc
`;
        
        fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log("movie data",data);
            setMovieData(data);
            // data.results contains an array of movie objects.
            // Use these to populate your movie review platform.
          }).catch(error => {
            console.error('Error fetching movies:', error);
          });
          
        
      } catch (error) {
          console.error('Error fetching movies data:', error);
      }
  };

   //fetching user reviews
  
    
  
  
  
  fetchUserData();
  // console.log("userData  in useffect",userData);
  fetchMovies();
  
    }, []);

    useEffect(() => {
      const getUserReviews = async () => {
        try {
          const response = await fetch(`http://${envApi}/review/userReview/${userData._id}`, {
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
    
          
        } catch (error) {
          console.error('Error fetching user reviews:', error);
        }
      };
      if (userData) {
        getUserReviews();
      }
    }, [userData]);

    if (!userData) {
    return <div>Loading...</div>;
    }

    console.log("hello world",userData);


    const handleReviewSubmit = async () => {
      try {
        const response = await fetch(`http://${envApi}/review/add`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movieId: selectedMovie.id,
            rating: rating,
            userId: userData._id,
            reviewText: review,
            spoiler,
            movieTitle: selectedMovie.title,
            moviePoster: selectedMovie.poster_path,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Review submitted:', data);
        // Reset the form fields
        setRating(null);
        setReview('');
        setSpoiler(false);
        setSelectedMovie(null);


        setReviewDialogDisplay(false);
        alert("Review submitted successfully!");
        window.location.reload();
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }


    async  function  getMovieById(id){
      try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=952fd5ce73dcd68d8702dc0aa5fcc3cb`);
          const data = await response.json();
          setSelectedMovie(data);
          setOpen(false);
          // setQuery('');
          setSuggestions([]);
      } catch (error) {
          console.error('Error fetching movie details:', error);
      }
    }


    

   

    
        

        
  



  // Mock data
  const user = {
    username: "FilmFanatic22",
    avatar: null,
    stats: { reviews: 42, followers: 156, following: 89 },
  };
  const topLists = [
    { id: 1, title: "Best Sci‑Fi Films", posters: Array(5).fill("/placeholder.svg") },
    { id: 2, title: "Classic Noir Movies", posters: Array(5).fill("/placeholder.svg") },
    { id: 3, title: "Favorite Comedies", posters: Array(5).fill("/placeholder.svg") },
  ];
  
  const connections = {
    followers: Array(8).fill({ username: "MovieBuff" }),
    following: Array(8).fill({ username: "CinemaExpert" }),
  };

  const handleAvatarUpload = e => console.log("Upload:", e.target.files[0]);

  const renderStars = (rating) => {
    // Normalize the rating to a 5-star scale
    const starsOutOfFive = rating / 2;
    const full = Math.floor(starsOutOfFive);
    const half = starsOutOfFive % 1 !== 0;
  
    return (
      <div className="flex">
        {[...Array(full)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-200 text-yellow-200" />
        ))}
        {half && <Star key="half" className="w-4 h-4 text-yellow-200 fill-yellow-200/50" />}
        {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-black fill-black " />
        ))}
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar currUser={currUser} />
      <div className="container mx-auto px-4 pt-24 pb-32">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="w-28 h-28 border-2 border-black">
              <AvatarImage src={userData.profilePic} alt={user.username} />
              <AvatarFallback className="bg-crate-dark text-crate-gold text-2xl">
                {userData.username}
              </AvatarFallback>
            </Avatar>
            
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{userData.username}</h1>
             
            </div>
            <div className="flex justify-center md:justify-start space-x-6">
              <div className="text-center">
                <p className="text-xl font-semibold">{userReviews.length}</p>
                <p className="text-sm text-[#E0E0E0]/60">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">{userData.followers.length}</p>
                <p className="text-sm text-[#E0E0E0]/60">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold">{userData.following.length}</p>
                <p className="text-sm text-[#E0E0E0]/60">Following</p>
              </div>
            </div>
          </div>
          <div>
            <Button onClick={() => setReviewDialogDisplay(true)} className="bg-crate-gold text-white hover:bg-yellow-500/90 flex items-center">
              <Edit className="mr-2 h-4 w-4" /> write a review
            </Button>
          </div>
        </div>

        {reviewDialogDisplay && (
  <div className="fixed inset-0 flex  items-center justify-center bg-black/70 z-50">
    <Dialog open={reviewDialogDisplay} onOpenChange={setReviewDialogDisplay}>
      <DialogContent>
        <DialogHeader>Write a Review</DialogHeader>
        <div className="mb-4 flex flex-col gap-4 ">
          <Label htmlFor="movie" className="text-crate-cream">Movie</Label>
          <SearchBar  setSelectedMovie={setSelectedMovie} />
          {console.log("selected movie",selectedMovie)}
        </div>
        <div className="mb-4 flex flex-col gap-4">
          <Label htmlFor="rating" className="text-crate-cream">Rating</Label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
            <Input
              onChange={e => setRating(e.target.value)}
              
              
              value={rating}
              id="rating"
              type="number"
              min="0"
              max="10"
              step="1"
              placeholder="Enter rating (0-10)"
              className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
              required
            />
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-4">
          <Label htmlFor="review" className="text-crate-cream">Review</Label> 
          <div className="relative">
            {/* <Chat className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" /> */}
            <Textarea
              onChange={e =>{ 
                
                setReview(e.target.value)}}
              value={review}
              id="review"
              placeholder="Enter your review"
              className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
              rows="4"
              required
            />
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-4">
          <Label htmlFor="spoiler" className="text-crate-cream">Spoiler Alert</Label>
          <div className="relative">
            <input
              onChange={e => setSpoiler(e.target.checked)}
              id="spoiler"
              type="checkbox" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold"
            />
            
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setReviewDialogDisplay(false)} className="bg-yellow-400 text-white hover:bg-yellow-500/90 flex items-center">
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} className="bg-yellow-400 text-white hover:bg-yellow-500/90 flex items-center ml-2">
            <Plus className="mr-2 h-4 w-4" /> Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
)}
        

        {/* Top Lists */}
        <Card className="bg-[#1A1A1A] border-crate-gold/20 mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <List className="mr-2 h-5 w-5 text-crate-gold" /> Your Top 5 Lists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topLists.map(list => (
                <div key={list.id} className="bg-[#242424] rounded-lg overflow-hidden hover:ring-1 hover:ring-crate-gold/50 transition">
                  <div className="grid grid-cols-5 gap-0.5">
                    {list.posters.map((p,i)=><img key={i} src={p} className="w-full aspect-[2/3] object-cover" />)}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium truncate">{list.title}</h3>
                  </div>
                </div>
              ))}
              <div className="bg-[#242424] rounded-lg border-dashed border-[#E0E0E0]/30 flex items-center justify-center h-48 hover:border-crate-gold/50 transition cursor-pointer">
                <Plus className="h-8 w-8 text-crate-gold mb-2" />
                <p className="text-[#E0E0E0]/80">Create New List</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews & Connections Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 bg-[#1E1E1E]">
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-crate-gold/20 data-[state=active]:text-crate-gold"
            >
              <Star className="mr-2 h-4 w-4" /> Reviews
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="data-[state=active]:bg-crate-gold/20 data-[state=active]:text-crate-gold"
            >
              <UserIcon className="mr-2 h-4 w-4" /> Connections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <Card className="bg-[#1A1A1A] border-crate-gold/20 mb-8">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center">
                  <Star className="mr-2 h-5 w-5 text-crate-gold" /> Your Reviews
                </CardTitle>
                <Button onClick={() => setReviewDialogDisplay(true)} className="bg-crate-gold text-black hover:bg-crate-gold/90 flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Write a Review
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 overflow-y-scroll max-h-[200px] md:max-h-[400px]">
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections">
            <Card className="bg-[#1A1A1A] border-crate-gold/20">
              <CardHeader><CardTitle>Connections</CardTitle></CardHeader>
              <CardContent className="space-y-8">
                {['Followers','Following'].map((section,idx)=>{
                  const arr = section==='Followers' ? connections.followers : connections.following;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[#E0E0E0]/80 font-medium">
                          {section} ({arr.length})
                        </h3>
                        <Button variant="link" className="text-crate-gold p-0">View All</Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {arr.slice(0,8).map((u,i)=>(
                          <div key={i} className="text-center">
                            <Avatar className="mx-auto w-12 h-12 border border-crate-gold/30">
                              <AvatarFallback className="bg-crate-dark text-xs">
                                {u.username.slice(0,2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs mt-1 truncate text-[#E0E0E0]/80">
                              {u.username}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}



// {reviewDialogDisplay && (
//   <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
//     <Dialog open={reviewDialogDisplay} onOpenChange={setReviewDialogDisplay}>
//       <DialogContent>
//         <DialogHeader>Write a Review</DialogHeader>
//         <div className="mb-4">
//           <Label htmlFor="movie" className="text-crate-cream">Movie</Label>
//           <SearchBar setSelectedMovie={setSelectedMovie} />
//           {console.log("selected movie",selectedMovie)}
//         </div>
//         <div className="mb-4">
//           <Label htmlFor="rating" className="text-crate-cream">Rating</Label>
//           <div className="relative">
//             <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" />
//             <Input
//               id="rating"
//               type="number"
//               min="0"
//               max="10"
//               step="0.1"
//               placeholder="Enter rating (0-10)"
//               className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
//               required
//             />
//           </div>
//         </div>
//         <div className="mb-4">
//           <Label htmlFor="review" className="text-crate-cream">Review</Label> 
//           <div className="relative">
//             {/* <Chat className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold" /> */}
//             <Textarea
//               id="review"
//               placeholder="Enter your review"
//               className="pl-10 bg-crate-darker border-crate-gold/20 text-crate-cream"
//               rows="4"
//               required
//             />
//           </div>
//         </div>
//         <div className="mb-4">
//           <Label htmlFor="spoiler" className="text-crate-cream">Spoiler Alert</Label>
//           <div className="relative">
//             <input
//               id="spoiler"
//               type="checkbox" 
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-crate-gold"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <Button onClick={() => setReviewDialogDisplay(false)} className="bg-crate-gold text-white hover:bg-yellow-500/90 flex items-center">
//             Cancel
//           </Button>
//           <Button className="bg-crate-gold text-white hover:bg-yellow-500/90 flex items-center ml-2">
//             <Plus className="mr-2 h-4 w-4" /> Submit Review
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   </div>
// )}


