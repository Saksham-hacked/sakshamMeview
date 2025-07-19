import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { envApi } from './getEnvironment';
import { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [topReviewers, setTopReviewers] = useState([]);
  const navigate = useNavigate();

  const handleSearch = useRef(
    debounce(async (query) => {
      setSearchQuery(query);
      if (!query) return;
      try {
        const url = `http://${envApi}/user/search?query=${query}`;
        const res = await fetch(url);
        const response = await res.json();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }, 300)
  ).current;

  useEffect(() => {
    handleSearch(searchQuery);
    // eslint-disable-next-line
  }, [searchQuery]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://${envApi}/user/`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setUserData(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTopReviewers = async () => {
      try {
        const response = await fetch(`http://${envApi}/review/topReviewers`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setTopReviewers(data.data);
      } catch (error) {
        console.error('Error fetching top reviewers:', error);
      }
    };
    fetchTopReviewers();
  }, []);

  const renderUserAvatar = (user) => {
    return (
      <Avatar className="h-14 w-14 border border-zinc-700">
        <AvatarImage 
        // className={"object-contain h-full w-full rounded-full"}
          src={user.profilePic} 
          // src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user._id}`} 
          alt={`${user.username}'s avatar`}
          onError={(e) => {
            // Fallback to a high-quality SVG avatar if the primary image fails
            e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`;
          }}
        />
        <AvatarFallback className="bg-zinc-800 text-yellow-400 font-semibold text-xl">
          {user.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 font-sans">
      <Navbar currUser={userData} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">

          {/* Search and Users Section */}
          <section className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl text-yellow-400 font-bold mb-4">Community</h1>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-gray-100 focus:ring-2 focus:ring-yellow-500 transition"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-4">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800 shadow-sm transition hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      {renderUserAvatar(user)}
                      <div>
                        <h3 className="font-semibold text-gray-100">{user.username}</h3>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => navigate(`/user/profile/${user.username}`)}
                      className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-500 active:scale-95 transition"
                    >
                      Visit Profile
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  {searchQuery ? "No users found matching your search." : "Start typing to find users."}
                </p>
              )}
            </div>
          </section>

          {/* Top Reviewers Section */}
          <section className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Top Reviewers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {topReviewers.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No top reviewers to display.</p>
              ) : (
                topReviewers.map((review) => (
                  <Card key={review.user._id} className="bg-zinc-900 border-zinc-800 shadow-lg transition hover:shadow-yellow-800/30">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {renderUserAvatar(review.user)}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-100">{review.user.username}</h3>
                          <p className="text-sm text-gray-300">
                            {review.user.bio && review.user.bio.length > 50
                              ? review.user.bio.slice(0, 50) + '...'
                              : review.user.bio}
                          </p>
                          <p className="text-xs text-gray-400">
                            <span className="font-bold text-yellow-400">{review.totalReviews}</span> reviews
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CommunityPage;



// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Search } from 'lucide-react';
// import { Card, CardContent } from "@/components/ui/card";
// import { envApi } from './getEnvironment';
// import { useState, useRef, useEffect } from 'react';
// import debounce from 'lodash.debounce';
// import { useNavigate } from 'react-router-dom';
// import Navbar from "./Navbar";

// const CommunityPage = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [topReviewers, setTopReviewers] = useState([]);
//   const navigate = useNavigate();

//   const handleSearch = useRef(
//     debounce(async (query) => {
//       setSearchQuery(query);
//       if (!query) return;
//       try {
//         const url = `http://${envApi}/user/search?query=${query}`;
//         const res = await fetch(url);
//         const response = await res.json();
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     }, 300)
//   ).current;

//   useEffect(() => {
//     handleSearch(searchQuery);
//     // eslint-disable-next-line
//   }, [searchQuery]);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`http://${envApi}/user/`, {
//           method: 'GET',
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         setUserData(data.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchTopReviewers = async () => {
//       try {
//         const response = await fetch(`http://${envApi}/review/topReviewers`, {
//           method: 'GET',
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         if (!response.ok) throw new Error('Network response was not ok');
//         const data = await response.json();
//         setTopReviewers(data.data);
//       } catch (error) {
//         console.error('Error fetching top reviewers:', error);
//       }
//     };
//     fetchTopReviewers();
//   }, []);

//   return (
//     <div className="min-h-screen bg-zinc-950 text-gray-100">
//       <Navbar currUser={userData} />
//       <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">

//           {/* Search and Users Section */}
//           <section className="lg:col-span-2 space-y-6">
//             <div>
//               <h1 className="text-3xl text-yellow-400 font-bold mb-4">Community</h1>
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder="Search users..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 focus:ring-2 focus:ring-yellow-500 transition"
//                 />
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               </div>
//             </div>
//             <div className="space-y-4">
//               {users.length > 0 ? (
//                 users.map((user) => (
//                   <div
//                     key={user._id}
//                     className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800 shadow-sm transition hover:scale-[1.02]"
//                   >
//                     <div className="flex items-center space-x-4 w-full sm:w-auto">
//                       <Avatar className="h-12 w-12 rounded-full overflow-hidden bg-zinc-800 aspect-square">
//                         {/* For best quality, use SVG avatars from API when possible */}
//                         <AvatarImage
//                           src={user.profilePic}
//                           alt={user.username}
//                           className="w-full h-full object-cover"
//                         />
//                         <AvatarFallback>
//                           {user.username.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <h3 className="font-semibold">{user.username}</h3>
//                       </div>
//                     </div>
//                     <Button
//                       variant="default"
//                       onClick={() => navigate(`/user/profile/${user.username}`)}
//                       className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-500 active:scale-95 transition"
//                     >
//                       Visit Profile
//                     </Button>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400">No users found.</p>
//               )}
//             </div>
//           </section>

//           {/* Top Reviewers Section */}
//           <section className="lg:col-span-1">
//             <h2 className="text-2xl font-bold mb-4">Top Reviewers</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
//               {topReviewers.map((review) => (
//                 <Card key={review.user._id} className="bg-zinc-900 border-zinc-800 shadow-lg transition hover:shadow-yellow-800/30">
//                   <CardContent className="p-4">
//                     <div className="flex items-start space-x-4">
//                       <Avatar className="h-14 w-14 rounded-full overflow-hidden bg-zinc-800 aspect-square">
//                         <AvatarImage
//                           src={review.user.profilePic}
//                           alt={review.user.username}
//                           className="w-full h-full object-cover"
//                         />
//                         <AvatarFallback>
//                           {review.user.username.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="space-y-2">
//                         <h3 className="font-semibold">{review.user.username}</h3>
//                         <p className="text-sm text-gray-300">
//                           {review.user.bio && review.user.bio.length > 50
//                             ? review.user.bio.slice(0, 50) + '...'
//                             : review.user.bio}
//                         </p>
//                         <p className="text-xs text-gray-400">{review.totalReviews} reviews</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </section>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommunityPage;
