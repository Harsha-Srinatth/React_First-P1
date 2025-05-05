import React from "react";
import './Main.css';
import Example from './pages/Register'
import { BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
 import Login from './pages/Login'
import  Dashboard from './pages/Dashboard';
import Home from './context/Home'
import Explore from './context/Explore'
import Create from './context/Create';
import YourPosts from './context/YourPosts';
import Profile from './components/Profile';
import UpdateUserProfile from './components/UpdateUserProfile';
import ShowProfile from './context/ShowProfile';
import AddProfile from './components/AddProfile';
//import Likes from './context/Likes'
//import { useEffect,useState } from 'react';
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to = '/login' />;
 
};
// const CombinedComponent = () => {
//   return(
//     <div className='flex bg-black'>
//       <Dashboard/>
//       <Home/>
//     </div>
//   )
// }

const  App = () => {
 
  return (
   <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
     
        <Routes>

          <Route path='/register' element={<Example />} />
           <Route path ='/login' element={<Login/>}/>
           <Route path="*" element={<Navigate to="/login" />}/>
         
         
           <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}>
             <Route index element={<Home/>} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/create-post" element={<Create/>} /> 
              <Route path="/upload-profile-img" element={<AddProfile />} />
              <Route path="/user/posts" element = {<YourPosts/>} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/edit/profile"  element={ <UpdateUserProfile />}/>
              <Route path="/user/:userId" element={<ShowProfile />}/>       
          </Route>
          
                
        </Routes> 
      
    
   </div>
   
  )
}

export default App
