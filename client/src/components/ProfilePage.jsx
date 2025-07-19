

import React, { useState, useEffect } from "react";
import {
  Star,
  User as UserIcon,
  List,
  Plus,
  Edit,
  X,
  Trash2, // Added Trash2 icon for deletion
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "./SearchBar";
import { envApi } from "./getEnvironment";

export default function ProfilePage({ currUser }) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [userData, setUserData] = useState(null);
  const [reviewDialogDisplay, setReviewDialogDisplay] = useState(false);
  const [createListDialogDisplay, setCreateListDialogDisplay] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for creating a new list
  const [listTitle, setListTitle] = useState("");
  const [listMovies, setListMovies] = useState([]);
  const [userLists, setUserLists] = useState([]);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://${envApi}/user/`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch user reviews when userData is available
  useEffect(() => {
    const getUserReviews = async () => {
      if (userData) {
        try {
          const response = await fetch(
            `http://${envApi}/review/userReview/${userData._id}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setUserReviews(data.data);
        } catch (error) {
          console.error("Error fetching user reviews:", error);
        }
      }
    };
    getUserReviews();
  }, [userData]);

  // Fetch user top lists when userData is available
  useEffect(() => {
    const getUserLists = async () => {
      if (userData) {
        try {
          const response = await fetch(
            `http://${envApi}/topfive/user/${userData._id}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("User Lists:", data);
          setUserLists(data.data);
        } catch (error) {
          console.error("Error fetching user lists:", error);
        }
      }
    };
    getUserLists();
  }, [userData]);

  // Function to handle review submission
  const handleReviewSubmit = async () => {
    if (!selectedMovie || !rating || !review) {
      alert("Please select a movie, a rating, and write a review.");
      return;
    }

    try {
      const response = await fetch(`http://${envApi}/review/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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
        throw new Error("Network response was not ok");
      }
      setRating("");
      setReview("");
      setSpoiler(false);
      setSelectedMovie(null);
      setReviewDialogDisplay(false);
      alert("Review submitted successfully!");
      // Optionally, refresh user reviews
      const updatedReviewsResponse = await fetch(
        `http://${envApi}/review/userReview/${userData._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const updatedReviewsData = await updatedReviewsResponse.json();
      setUserReviews(updatedReviewsData.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  // Function to handle review deletion
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await fetch(
          `http://${envApi}/review/delete/${reviewId}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setUserReviews((prevReviews) =>
          prevReviews.filter((r) => r._id !== reviewId)
        );
        alert("Review deleted successfully!");
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review.");
      }
    }
  };

  // Function to add a selected movie to the list
  const handleAddMovieToList = (movie) => {
    if (movie) {
      // Check if the movie is already in the list to avoid duplicates
      const isDuplicate = listMovies.some((item) => item.movieId === movie.id);
      if (listMovies.length >= 5) {
        alert("You cannot add more than 5 movies to your list.");
        return;
      }
      if (!isDuplicate) {
        setListMovies((prevMovies) => [
          ...prevMovies,
          {
            movieId: movie.id,
            movieTitle: movie.title,
            moviePoster: movie.poster_path,
          },
        ]);
        // Reset selected movie after adding
        setSelectedMovie(null);
      } else {
        alert("This movie is already in your list.");
      }
    }
  };

  // Function to remove a movie from the list
  const handleRemoveMovie = (movieId) => {
    setListMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.movieId !== movieId)
    );
  };

  // Function to handle list creation submission
  const handleCreateListSubmit = async () => {
    if (!listTitle.trim()) {
      alert("Please enter a title for your list.");
      return;
    }
    if (listMovies.length === 0) {
      alert("Please add at least one movie to your list.");
      return;
    }

    try {
      const response = await fetch(`http://${envApi}/topfive/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData._id,
          title: listTitle,
          movies: listMovies,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("List submitted successfully:", data);

      // Close the dialog and reset state
      setCreateListDialogDisplay(false);
      setListTitle("");
      setListMovies([]);
      alert("List created successfully!");

      // Optionally, refresh user lists
      const updatedListsResponse = await fetch(
        `http://${envApi}/topfive/user/${userData._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const updatedListsData = await updatedListsResponse.json();
      setUserLists(updatedListsData.data);
      console.log("Updated User Lists:", updatedListsData.data);
    } catch (error) {
      console.error("Error submitting list:", error);
      alert("Failed to create list.");
    }
  };

  // Function to handle list deletion
  const handleDeleteList = async (e, listId) => {
    e.stopPropagation(); // Prevents the card click from firing

    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        const response = await fetch(
          `http://${envApi}/topfive/${listId}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setUserLists((prevLists) =>
          prevLists.filter((list) => list._id !== listId)
        );
        alert("List deleted successfully!");
        // Optionally, refresh user lists
        const updatedListsResponse = await fetch(
          `http://${envApi}/topfive/user/${userData._id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const updatedListsData = await updatedListsResponse.json();
        setUserLists(updatedListsData.data);
        console.log(
          "Updated User Lists after deletion:",
          updatedListsData.data
        )
      } catch (error) {
        console.error("Error deleting list:", error);
        alert("Failed to delete list.");
      }
    }
  };

  const renderStars = (rating) => {
    const starsOutOfFive = rating / 2;
    const full = Math.floor(starsOutOfFive);
    const half = starsOutOfFive % 1 !== 0;

    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }
    if (half) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 text-yellow-400 fill-yellow-400/50"
        />
      );
    }
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-slate-700 fill-slate-700"
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (!currUser || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <Navbar currUser={currUser} />

      <div className="container mx-auto px-4 py-8 md:py-12 lg:px-8 max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row mt-20 items-center md:items-start gap-8 mb-12 border-b border-gray-800 pb-8">
          {/* Avatar */}
          <div className="w-28 h-28 lg:w-40 lg:h-40 rounded-full border-2 border-yellow-400/50 flex-shrink-0 overflow-hidden flex items-center justify-center bg-zinc-800 text-yellow-400 text-3xl">
            {userData.profilePic ? (
              <img
                src={userData.profilePic}
                alt={userData.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userData.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-2 tracking-wide text-yellow-400">
              {userData.username}
            </h1>
            <p className="text-md text-gray-400 mb-6">
              Welcome back, {userData.username}!
            </p>
            <div className="flex justify-center md:justify-start space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {userReviews.length}
                </p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {userData.followers.length}
                </p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {userData.following.length}
                </p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center md:justify-start">
              <button
                onClick={() => setReviewDialogDisplay(true)}
                className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors rounded-full px-6 py-3 shadow-lg flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" /> Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Top Lists */}
        <section className="mb-12">
          <div className="bg-zinc-900 border border-yellow-400/20 shadow-xl rounded-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold flex items-center text-yellow-400">
                <List className="mr-2 h-6 w-6" /> Your Top Lists
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userLists?.length > 0 ? (
                  userLists.map((list) => (
                    <div
                      key={list._id}
                      className="group bg-zinc-800 rounded-lg overflow-hidden relative hover:ring-2 hover:ring-yellow-400/50 transition-all duration-300"
                    >
                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteList(e, list._id)}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-red-400 rounded-full hover:bg-red-500/80 hover:text-white transition-colors z-10"
                        title="Delete List"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="grid grid-cols-5 gap-0.5">
                        {list.movies.map((p, i) => (
                          <img
                            key={i}
                            src={`https://image.tmdb.org/t/p/w92/${p.moviePoster}`}
                            alt={`Poster ${i}`}
                            className="w-full aspect-[2/3] object-cover"
                          />
                        ))}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg truncate text-gray-200 group-hover:text-yellow-400 transition-colors">
                          {list.title}
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="lg:col-span-4 text-center py-10 text-gray-500">
                    <p>You haven't created any lists yet.</p>
                  </div>
                )}
                {/* Button to open the new list creation dialog */}
                <div
                  onClick={() => setCreateListDialogDisplay(true)}
                  className="bg-zinc-800 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center min-h-[150px] md:h-full cursor-pointer hover:border-yellow-400/70 transition-colors duration-300"
                >
                  <Plus className="h-8 w-8 text-yellow-400 mb-2" />
                  <p className="text-sm font-medium text-gray-400">
                    Create New List
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews & Connections Tabs */}
        <div className="mb-12">
          <div className="grid grid-cols-2 bg-zinc-900 border border-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3 px-4 rounded-lg text-gray-400 font-medium transition-colors ${
                activeTab === "reviews"
                  ? "bg-yellow-400/20 text-yellow-400"
                  : ""
              }`}
            >
              <Star className="mr-2 h-4 w-4 inline-block" /> Reviews
            </button>
            <button
              onClick={() => setActiveTab("connections")}
              className={`py-3 px-4 rounded-lg text-gray-400 font-medium transition-colors ${
                activeTab === "connections"
                  ? "bg-yellow-400/20 text-yellow-400"
                  : ""
              }`}
            >
              <UserIcon className="mr-2 h-4 w-4 inline-block" /> Connections
            </button>
          </div>

          {/* Reviews Content */}
          {activeTab === "reviews" && (
            <div className="bg-zinc-900 border border-yellow-400/20 shadow-xl rounded-2xl">
              <div className="p-6 flex flex-row items-center justify-between border-b border-gray-800">
                <h2 className="text-2xl font-bold flex items-center text-yellow-400">
                  <Star className="mr-2 h-6 w-6" /> Your Reviews
                </h2>
                <button
                  onClick={() => setReviewDialogDisplay(true)}
                  className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors rounded-full px-4 py-2 flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" /> Write a Review
                </button>
              </div>
              <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                {userReviews.length > 0 ? (
                  userReviews.map((r) => (
                    <div
                      key={r._id}
                      className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-zinc-800 rounded-xl shadow-md hover:ring-2 hover:ring-yellow-400/30 transition-all duration-300"
                    >
                      {/* Movie Poster */}
                      <img
                        src={`https://image.tmdb.org/t/p/w92${r.moviePoster}`}
                        alt={r.movieTitle}
                        className="w-20 h-30 sm:w-16 sm:h-24 object-cover rounded-lg flex-shrink-0"
                      />

                      {/* Content area */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-gray-100 text-lg truncate max-w-[60%]">
                            {r.movieTitle}
                          </h3>
                          <div className="flex items-center gap-2">
                            {renderStars(r.rating)}
                            <button
                              onClick={() => handleDeleteReview(r._id)}
                              className="p-2 bg-black/40 text-red-400 rounded-full hover:bg-red-500/80 hover:text-white transition-colors ml-1"
                              title="Delete Review"
                              aria-label="Delete Review"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        {/* Review text */}
                        <p className="text-gray-400 text-sm max-h-24 overflow-y-auto leading-relaxed">
                          {r.reviewText}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>
                      You haven't written any reviews yet. Start by writing one!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connections Content */}
          {activeTab === "connections" && (
            <div className="bg-zinc-900 border border-yellow-400/20 shadow-xl rounded-2xl">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-yellow-400">
                  Connections
                </h2>
              </div>
              <div className="p-6 space-y-8">
                {["Followers", "Following"].map((section) => {
                  const arr =
                    section === "Followers"
                      ? userData.followers
                      : userData.following;
                  return (
                    <div key={section}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-300">
                          {section} ({arr.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {arr.map((u, i) => (
                          <div
                            key={i}
                            className="text-center flex flex-col items-center"
                          >
                            <div className="w-16 h-16 rounded-full border-2 border-yellow-400/30 flex items-center justify-center bg-zinc-800 text-lg text-yellow-400">
                              {u.profilePic ? (
                                <img
                                  src={u.profilePic}
                                  alt={u.username}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <span>
                                  {u.username.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-2 truncate max-w-full font-medium text-gray-400">
                              {u.username}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Dialog */}
      {reviewDialogDisplay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-zinc-900 border border-gray-800 text-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-2xl font-bold text-yellow-400">
                Write a Review
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="movie" className="text-gray-400 mb-2 block">
                  Movie
                </label>
                <SearchBar setSelectedMovie={setSelectedMovie} />
              </div>
              <div>
                <label htmlFor="rating" className="text-gray-400 mb-2 block">
                  Rating
                </label>
                <input
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                  id="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="1"
                  placeholder="Enter rating (0-10)"
                  className="w-full bg-zinc-800 text-white border-gray-700 rounded-md p-2 focus:ring-1 focus:ring-yellow-400/50"
                  required
                />
              </div>
              <div>
                <label htmlFor="review" className="text-gray-400 mb-2 block">
                  Review
                </label>
                <textarea
                  onChange={(e) => setReview(e.target.value)}
                  value={review}
                  id="review"
                  placeholder="Enter your review here..."
                  className="w-full bg-zinc-800 text-white border-gray-700 rounded-md p-2 min-h-[120px] focus:ring-1 focus:ring-yellow-400/50"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  onChange={(e) => setSpoiler(e.target.checked)}
                  checked={spoiler}
                  id="spoiler"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-400 rounded focus:ring-yellow-400 bg-zinc-800 border-gray-700"
                />
                <label htmlFor="spoiler" className="text-gray-400">
                  Contains Spoilers
                </label>
              </div>
            </div>
            <div className="p-6 flex justify-end gap-2">
              <button
                onClick={() => setReviewDialogDisplay(false)}
                className="bg-gray-700 text-white hover:bg-gray-600 transition-colors rounded-md px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="bg-yellow-400 text-black hover:bg-yellow-500 transition-colors rounded-md px-4 py-2"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New List Dialog */}
      {createListDialogDisplay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-zinc-900 border border-gray-800 text-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-2xl font-bold text-yellow-400">
                Create New List
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="listTitle" className="text-gray-400 mb-2 block">
                  List Title
                </label>
                <input
                  onChange={(e) => setListTitle(e.target.value)}
                  value={listTitle}
                  id="listTitle"
                  type="text"
                  placeholder="e.g., My Favorite Films of 2024"
                  className="w-full bg-zinc-800 text-white border-gray-700 rounded-md p-2 focus:ring-1 focus:ring-yellow-400/50"
                  required
                />
              </div>
              <div>
                <SearchBar setSelectedMovie={handleAddMovieToList} />
              </div>

              {/* Movie List Preview */}
              {listMovies.length > 0 && (
                <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                  <h4 className="font-semibold text-gray-300">
                    Movies in this list:
                  </h4>
                  {listMovies.map((movie) => (
                    <div
                      key={movie.movieId}
                      className="flex items-center gap-4 p-2 bg-zinc-800 rounded-md"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.moviePoster}`}
                        alt={movie.movieTitle}
                        className="w-12 h-18 object-cover rounded-md flex-shrink-0"
                      />
                      <span className="flex-1 text-sm font-medium truncate text-gray-200">
                        {movie.movieTitle}
                      </span>
                      <button
                        onClick={() => handleRemoveMovie(movie.movieId)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 flex justify-end gap-2">
              <button
                onClick={() => setCreateListDialogDisplay(false)}
                className="bg-gray-700 text-white hover:bg-gray-600 transition-colors rounded-md px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateListSubmit}
                className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors rounded-md px-4 py-2"
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
