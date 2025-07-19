import React, { use } from 'react'
import LandingPage from './components/LandingPage'
import SigninPage from './components/SigninPage'
import SignupPage from './components/SignupPage'
import { Route, Routes , Router } from 'react-router-dom'
import ProfilePage from './components/ProfilePage'
import CommunityPage from './components/CommunityPage'
import UserProfile from './components/UserProfile'

import { envApi } from './components/getEnvironment'
import MovieReviewsPage from './components/MovieReviewPage'




const App = () => {

  const [currUser, setCurrUser] = React.useState(null);
  
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://${envApi}/user/checkLogin`, {
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
        console.log("at app.jsx" ,data);
        setCurrUser(data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
      
      fetchUser();
    
}, []);


  return (
    <>
    

   <Routes>
    <Route path='/'element={<LandingPage />}></Route>
    <Route path='review' element ={<MovieReviewsPage/>}></Route>
    <Route path='community' element={<CommunityPage />}></Route>
    <Route path='/user'>
        <Route path='signin' element={<SigninPage />}></Route>
        <Route path='signup' element={<SignupPage />}></Route>
        <Route path='profile' element={<ProfilePage  currUser={currUser} />}></Route>
        <Route path='profile/:username' element={<UserProfile currUser={currUser} />}></Route>
    </Route>
   </Routes>
   
      </>
  )
}

export default App
