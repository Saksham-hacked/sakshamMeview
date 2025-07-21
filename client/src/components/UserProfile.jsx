
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, List, User as UserIcon, X } from 'lucide-react'; // Added X icon
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; 
// import { envApi } from './getEnvironment';
import getEnvironment from './getEnvironment';

export default function UserProfile({ currUser }) {
  const navigate = useNavigate();
  const { username } = useParams();

  const [userdata, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [loading, setLoading] = useState(true);

  // New state for the list dialog
  const [listDialogDisplay, setListDialogDisplay] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const envApi = getEnvironment();


  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${envApi}/user/${username}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setUserData(data.data);
        console.log("User data fetched:", data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  // Fetch user reviews when userdata is available
  useEffect(() => {
    const getUserReviews = async () => {
      if (userdata) {
        try {
          const response = await fetch(`${envApi}/review/userReview/${userdata._id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setUserReviews(data.data);
        } catch (error) {
          console.error('Error fetching user reviews:', error);
        }
      }
    };
    getUserReviews();
  }, [userdata]);

  // Fetch user top lists when userdata is available
  useEffect(() => {
    const getUserLists = async () => {
      if (userdata) {
        try {
          const response = await fetch(`${envApi}/topfive/user/${userdata._id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setUserLists(data.data);
        } catch (error) {
          console.error('Error fetching user lists:', error);
        }
      }
    };
    getUserLists();
  }, [userdata]);


  const handleFollow = async () => {
    if (!currUser && !userdata) {
      alert('You must be logged in to follow this user.');
      navigate("/user/signin");
      return;
    }

    try {
      const response = await fetch(`${envApi}/user/follow/`, {
        method: 'POST',
        body: JSON.stringify({ targetUserId: userdata._id }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      // Update state without reloading the page
      setUserData(prevUserData => ({
        ...prevUserData,
        followers: [...prevUserData.followers, currUser]
      }));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    if (!currUser && !userdata) {
      alert('You must be logged in to unfollow this user.');
      navigate("/user/signin");
      return;
    }

    try {
      const response = await fetch(`${envApi}/user/unfollow/`, {
        method: 'POST',
        body: JSON.stringify({ targetUserId: userdata._id }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      // Update state without reloading the page
      setUserData(prevUserData => ({
        ...prevUserData,
        followers: prevUserData.followers.filter(follower => follower._id !== currUser._id)
      }));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const renderStars = (rating) => {
    const starsOutOfFive = rating / 2;
    const full = Math.floor(starsOutOfFive);
    const half = starsOutOfFive % 1 !== 0;

    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (half) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-400/50" />);
    }
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-slate-700 fill-slate-700" />);
    }
    return <div className="flex">{stars}</div>;
  };
  
  // New handler for opening the list dialog
  const handleListClick = (list) => {
    setSelectedList(list);
    setListDialogDisplay(true);
  };
  
  // New handler for closing the list dialog
  const handleCloseListDialog = () => {
    setListDialogDisplay(false);
    setSelectedList(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div>Loading...</div>
      </div>
    );
  }

  if (!userdata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }
  if(!currUser && !userdata) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <h1 className="text-2xl font-bold">You must be logged in to view this profile</h1>
      </div>
    );
  }
  console.log("Current user:", currUser);
  console.log("User data:", userdata);

  // const isFollowing = userdata.followers.includes(currUser?._id);
  const isFollowing = userdata.followers.some(follower => follower._id === currUser?._id);
  const isCurrentUserProfile = currUser?._id === userdata._id;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <Navbar currUser={currUser} />

      <div className="container mx-auto px-4 py-8 md:py-12 lg:px-8 max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row mt-20 items-center md:items-start gap-8 mb-12 border-b border-gray-800 pb-8">
          {/* Avatar */}
          <div className="w-28 h-28 lg:w-40 lg:h-40 rounded-full border-2 border-yellow-400/50 flex-shrink-0 overflow-hidden flex items-center justify-center bg-zinc-800 text-yellow-400 text-3xl">
            {userdata.profilePic ? (
              <img src={userdata.profilePic} alt={userdata.username} className="w-full h-full object-cover" />
            ) : (
              <span>{userdata.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-2 tracking-wide text-yellow-400">{userdata.username}</h1>
            <p className="text-md text-gray-400 mb-6">A movie fan on a mission.</p>
            <div className="flex justify-center md:justify-start space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{userReviews.length}</p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{userdata.followers.length}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{userdata.following.length}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>
            {/* Follow/Unfollow Button */}
            {!isCurrentUserProfile && (
              <div className="mt-8 flex justify-center md:justify-start">
                {isFollowing ? (
                  <button
                    onClick={handleUnfollow}
                    className="bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors rounded-full px-6 py-3 shadow-lg flex items-center"
                  >
                    <UserIcon className="mr-2 h-4 w-4" /> Following
                  </button>
                ) : (
                  <button
                    onClick={handleFollow}
                    className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-colors rounded-full px-6 py-3 shadow-lg flex items-center"
                  >
                    <UserIcon className="mr-2 h-4 w-4" /> Follow
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Top Lists */}
        <section className="mb-12">
          <div className="bg-zinc-900 border border-yellow-400/20 shadow-xl rounded-2xl">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold flex items-center text-yellow-400">
                <List className="mr-2 h-6 w-6" /> Top Lists
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userLists?.length > 0 ? (
                  userLists.map(list => (
                    <div
                      key={list._id}
                      onClick={() => handleListClick(list)} // Added onClick handler
                      className="group bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-yellow-400/50 transition-all duration-300"
                    >
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
                    <p>{userdata.username} hasn't created any lists yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews & Connections Tabs */}
        <div className="mb-12">
          <div className="grid grid-cols-2 bg-zinc-900 border border-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3 px-4 rounded-lg text-gray-400 font-medium transition-colors ${activeTab === 'reviews' ? 'bg-yellow-400/20 text-yellow-400' : ''}`}
            >
              <Star className="mr-2 h-4 w-4 inline-block" /> Reviews
            </button>
            <button
              onClick={() => setActiveTab("connections")}
              className={`py-3 px-4 rounded-lg text-gray-400 font-medium transition-colors ${activeTab === 'connections' ? 'bg-yellow-400/20 text-yellow-400' : ''}`}
            >
              <UserIcon className="mr-2 h-4 w-4 inline-block" /> Connections
            </button>
          </div>

          {/* Reviews Content */}
          {activeTab === "reviews" && (
            <div className="bg-zinc-900 border border-yellow-400/20 shadow-xl rounded-2xl">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-2xl font-bold flex items-center text-yellow-400">
                  <Star className="mr-2 h-6 w-6" /> Reviews by {userdata.username}
                </h2>
              </div>
              <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                {userReviews.length > 0 ? (
                  userReviews.map(r => (
                    <div
                      key={r._id}
                      className="flex items-start gap-4 p-4 bg-zinc-800 rounded-xl hover:ring-2 hover:ring-yellow-400/30 transition-all duration-300"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${r.moviePoster}`}
                        alt={r.movieTitle}
                        className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-100 text-lg">{r.movieTitle}</h3>
                          {renderStars(r.rating)}
                        </div>
                        <p className="text-gray-400 text-sm">{r.reviewText}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>{userdata.username} hasn't written any reviews yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connections Content */}
          {activeTab === "connections" && (
            <div className="bg-zinc-900 border border-yellow-400/20 shadow-xl rounded-2xl">
              <div className="p-6 space-y-8">
                {['Followers', 'Following'].map((section) => {
                  const arr = section === 'Followers' ? userdata.followers : userdata.following;
                  return (
                    <div key={section}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-300">
                          {section} ({arr.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {arr.length > 0 ? (
                          arr.map((u, i) => (
                            <div key={i} className="text-center flex flex-col items-center">
                              <div onClick={() => navigate(`/user/profile/${u.username}`)} className="w-16 h-16 rounded-full border-2 border-yellow-400/30 flex items-center justify-center bg-zinc-800 text-lg text-yellow-400">
                                {u.profilePic ? (
                                  <img src={u.profilePic} alt={u.username} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  <span>{u.username?.charAt(0).toUpperCase()}</span>
                                )}
                              </div>
                              <p className="text-sm mt-2 truncate max-w-full font-medium text-gray-400">
                                {u.username}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="lg:col-span-6 text-center text-gray-500">
                            <p>{userdata.username} has no {section.toLowerCase()} yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Top List Dialog */}
      {listDialogDisplay && selectedList && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-zinc-900 border border-gray-800 text-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-yellow-400">{selectedList.title}</h3>
              <button onClick={handleCloseListDialog} className="text-gray-400 hover:text-gray-200 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {selectedList.movies.map(movie => (
                <div key={movie.movieId} className="flex items-center gap-4 p-2 bg-zinc-800 rounded-md">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.moviePoster}`}
                    alt={movie.movieTitle}
                    className="w-16 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  <span className="flex-1 text-lg font-medium truncate text-gray-200">{movie.movieTitle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}