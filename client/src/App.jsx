import React from 'react'
import LandingPage from './components/LandingPage'
import SigninPage from './components/SigninPage'
import SignupPage from './components/SignupPage'
import { Route, Routes , Router } from 'react-router-dom'
import ProfilePage from './components/ProfilePage'
import CommunityPage from './components/CommunityPage'
import UserProfile from './components/UserProfile'

const App = () => {
  return (
    <>
    

   <Routes>
    <Route path='/'element={<LandingPage />}></Route>
    <Route path='/user'>
        <Route path='signin' element={<SigninPage />}></Route>
        <Route path='signup' element={<SignupPage />}></Route>
        <Route path='profile' element={<ProfilePage />}></Route>
        <Route path='profile/:username' element={<UserProfile />}></Route>
        <Route path='community' element={<CommunityPage />}></Route>
    </Route>
   </Routes>
   
      </>
  )
}

export default App
