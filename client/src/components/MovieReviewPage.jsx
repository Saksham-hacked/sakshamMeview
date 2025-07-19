

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import { envApi } from './getEnvironment';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Send, Star } from 'lucide-react';

const MovieReviewsPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieReviews, setMovieReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://${envApi}/user/`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch movie reviews
  useEffect(() => {
    const fetchMovieReviews = async () => {
      if (!selectedMovie?.id) return setMovieReviews([]);
      setLoadingReviews(true);
      try {
        const response = await fetch(`http://${envApi}/review/${selectedMovie.id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // CRITICAL FIX: Ensure likes and dislikes are arrays to prevent the TypeError.
        // This is a temporary frontend fix. The backend should be updated to return these as arrays.
        const safeReviews = (data.data || []).map(review => ({
          ...review,
          likes: Array.isArray(review.likes) ? review.likes : [],
          dislikes: Array.isArray(review.dislikes) ? review.dislikes : []
        }));
        setMovieReviews(safeReviews);
        console.log("Fetched reviews:", safeReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchMovieReviews();
  }, [selectedMovie]);

  // Render star ratings
  const renderStars = (rating) => {
    const starsOutOfFive = rating / 2;
    const full = Math.floor(starsOutOfFive);
    const half = starsOutOfFive % 1 !== 0;
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    }
    if (half) stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-400/50" />);
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-slate-600 fill-slate-700" />);
    }
    return <div className="flex">{stars}</div>;
  };

  // Render user avatar
  const renderUserAvatar = (user) => {
    if (!user) return null;
    return (
      <Avatar className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 aspect-square border border-zinc-700">
        <AvatarImage
          src={user.profilePic}
          alt={user.username}
          className="object-cover w-full h-full"
          onError={(e) =>
            (e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id || user.username}`)
          }
        />
        <AvatarFallback className="bg-zinc-800 text-yellow-400 font-semibold text-lg">
          {user.username?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    );
  };
  
  const handleLike = async (reviewId) => {
    console.log("handleLike called with reviewId:", reviewId);
    if (!userData) {
      alert("Please log in to like a review.");
      return;
    }

    const userId = userData._id;
    
    // Optimistically update the state
    setMovieReviews(prevReviews => prevReviews.map(review => {
      if (review._id === reviewId) {
        const newLikes = Array.isArray(review.likes) ? [...review.likes] : [];
        const newDislikes = Array.isArray(review.dislikes) ? [...review.dislikes] : [];
        
        const dislikeIndex = newDislikes.indexOf(userId);
        if (dislikeIndex > -1) {
          newDislikes.splice(dislikeIndex, 1);
        }

        const likeIndex = newLikes.indexOf(userId);
        if (likeIndex > -1) {
          newLikes.splice(likeIndex, 1);
        } else {
          newLikes.push(userId);
        }

        return { ...review, likes: newLikes, dislikes: newDislikes };
      }
      return review;
    }));

    console.log("Optimistically updated likes for reviewId:", reviewId, "New likes:", movieReviews.find(r => r._id === reviewId)?.likes);

    try {
      const response = await fetch(`http://${envApi}/review/like/${reviewId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      response.json().then(data => {
        console.log("Like response data:", data);
      });
    } catch (error) {
      console.error('Error liking/un-liking review:', error);
      alert('Failed to update like status. Please try again.');
      // Revert the state change on error
      setMovieReviews(prevReviews => prevReviews.map(review => {
        if (review._id === reviewId) {
          const newLikes = Array.isArray(review.likes) ? [...review.likes] : [];
          const newDislikes = Array.isArray(review.dislikes) ? [...review.dislikes] : [];
          
          const dislikeIndex = newDislikes.indexOf(userId);
          if (dislikeIndex > -1) {
            newDislikes.splice(dislikeIndex, 1);
          } else {
            newDislikes.push(userId);
          }
          
          const likeIndex = newLikes.indexOf(userId);
          if (likeIndex > -1) {
            newLikes.splice(likeIndex, 1);
          } else {
            newLikes.push(userId);
          }

          return { ...review, likes: newLikes, dislikes: newDislikes };
        }
        return review;
      }));
    }
  };

  const handleDislike = async (reviewId) => {
    if (!userData) {
      alert("Please log in to dislike a review.");
      return;
    }

    const userId = userData._id;

    // Optimistically update the state
    setMovieReviews(prevReviews => prevReviews.map(review => {
      if (review._id === reviewId) {
        const newLikes = Array.isArray(review.likes) ? [...review.likes] : [];
        const newDislikes = Array.isArray(review.dislikes) ? [...review.dislikes] : [];

        const likeIndex = newLikes.indexOf(userId);
        if (likeIndex > -1) {
          newLikes.splice(likeIndex, 1);
        }

        const dislikeIndex = newDislikes.indexOf(userId);
        if (dislikeIndex > -1) {
          newDislikes.splice(dislikeIndex, 1);
        } else {
          newDislikes.push(userId);
        }

        return { ...review, likes: newLikes, dislikes: newDislikes };
      }
      return review;
    }));

    try {
      const response = await fetch(`http://${envApi}/review/dislike/${reviewId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error disliking/un-disliking review:', error);
      alert('Failed to update dislike status. Please try again.');
      // Revert the state change on error
      setMovieReviews(prevReviews => prevReviews.map(review => {
        if (review._id === reviewId) {
          const newLikes = Array.isArray(review.likes) ? [...review.likes] : [];
          const newDislikes = Array.isArray(review.dislikes) ? [...review.dislikes] : [];

          const likeIndex = newLikes.indexOf(userId);
          if (likeIndex > -1) {
            newLikes.splice(likeIndex, 1);
          } else {
            newLikes.push(userId);
          }
          
          const dislikeIndex = newDislikes.indexOf(userId);
          if (dislikeIndex > -1) {
            newDislikes.splice(dislikeIndex, 1);
          } else {
            newDislikes.push(userId);
          }

          return { ...review, likes: newLikes, dislikes: newDislikes };
        }
        return review;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100">
      <Navbar currUser={userData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mt-20 text-yellow-400 mb-12">Movie Reviews</h1>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Search + Movie Info */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-200">Search Movie</h2>
              <SearchBar setSelectedMovie={setSelectedMovie} />
            </div>

            {selectedMovie && (
              <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800 shadow-md space-y-4">
                <div className="flex gap-4 items-start">
                  <img
                    src={`https://image.tmdb.org/t/p/w185${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-28 h-40 object-cover rounded-md border border-zinc-700"
                    onError={(e) =>
                      (e.currentTarget.src = "https://placehold.co/92x138/333/eee?text=No+Image")
                    }
                  />
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-yellow-400">{selectedMovie.title}</h3>
                    {selectedMovie.release_date && (
                      <p className="text-sm text-gray-400">
                        Released: {selectedMovie.release_date.slice(0, 4)}
                      </p>
                    )}
                    <p className="text-sm text-gray-300 mt-2 line-clamp-4">
                      {selectedMovie.overview}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Reviews */}
          <div className="space-y-6">
            <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800 shadow-md">
              <h2 className="text-xl font-bold text-gray-200 mb-4">
                {selectedMovie ? `Reviews for "${selectedMovie.title}"` : "Reviews"}
              </h2>

              {loadingReviews ? (
                <p className="text-gray-400 text-center">Loading reviews...</p>
              ) : selectedMovie && movieReviews.length === 0 ? (
                <p className="text-gray-400 text-center">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {movieReviews.map((review) => {
                    const likedByUser = Array.isArray(review.likes) && userData && review.likes.includes(userData._id);
                    const dislikedByUser = Array.isArray(review.dislikes) && userData && review.dislikes.includes(userData._id);
                    
                    return (
                      <Card
                        key={review._id}
                        className="bg-zinc-800 border border-zinc-700 shadow-sm transition hover:shadow-yellow-900/20"
                      >
                        <CardContent className="p-4 flex flex-col gap-3">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            {renderUserAvatar(review.userId)}
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                <h4 className="font-semibold text-gray-200 text-lg">
                                  {review.userId?.username || 'Anonymous'}
                                </h4>
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                {review.spoiler && <span className="text-red-400 font-semibold">Spoiler: </span>}
                                {review.reviewText}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Minimalist Actions Row */}
                          <div className="flex items-center gap-3 mt-2">
                            {/* Dislike Button */}
                            <button
                              aria-label="Dislike"
                              className={`flex items-center transition ${dislikedByUser ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                              onClick={() => handleDislike(review._id)}
                              type="button"
                            >
                              <ArrowDown className="w-5 h-5 mr-1" />
                              <span className="text-xs font-semibold">{(review.dislikes) ? review.dislikes.length : 0}</span>
                            </button>

                            {/* Like Button */}
                            <button
                              aria-label="Like"
                              className={`flex items-center transition ${likedByUser ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
                              onClick={() => handleLike(review._id)}
                              type="button"
                            >
                              <ArrowUp className="w-5 h-5 mr-1" />
                              <span className="text-xs font-semibold">{Array.isArray(review.likes) ? review.likes.length : 0}</span>
                            </button>

                            {/* Inline Comment */}
                            <input
                              type="text"
                              placeholder="Comment"
                              className="flex-1 min-w-0 bg-transparent border-b border-zinc-700 px-2 py-1 text-sm text-gray-200 outline-none focus:border-yellow-500 transition"
                              style={{ maxWidth: "200px" }}
                            />

                            {/* Submit Comment */}
                            <button
                              aria-label="Submit comment"
                              className="ml-1 text-gray-400 hover:text-yellow-400 transition"
                              onClick={() => alert(`Comment submitted for review: ${review._id}`)}
                              type="button"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieReviewsPage;


