import React from 'react';


import { Link} from 'react-router-dom';
import { useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
 


const Profile = () => {
     const [userId,setUserId] = useState('');
     const [details, setDetails] = useState([]);
     const [followers ,setFollowers] = useState('');
     const [following ,setFollowing] = useState('');
      const [loading, setLoading] = useState(true);
     const [activeTab, setActiveTab] = useState('posts');

      useEffect(() => {
            const token = localStorage.getItem('token');
            console.log(token);
            if(token){
              const decoded = jwtDecode(token);
              setUserId(decoded.userId);
              console.log(decoded.userId);
            }
         },[]);

         useEffect(() => {
            const fetchDetails = async() => {
                try{
                    if(userId){
                        const res = await api.get('/getDetails',{
                            params:{ userId }
                        });
                         setDetails(res.data.details);
                         console.log(res.data.details);
                         setFollowers(res.data.FollowersCount);
                         setFollowing(res.data.FollowingCount);
                    }else{
                        console.log("no userId available, skkiping api call")
                    }
                }catch(err){
                    console.log(err);
                }
            }
            fetchDetails();
         },[userId]);
    

           
           
              return (
                // Content container - optimized for sidebar and outlet pattern
                <div className="w-full bg-gray-50 overflow-y-auto pb-16 md:pb-0">
                  {/* Cover photo - responsive height */}
                  <div className="h-32 sm:h-36 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative w-full">
                    {details.coverImage && (
                      <img 
                        src={`http://localhost:5000${details.coverImage}`}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Profile section */}
                  <div className="relative bg-white shadow-sm -mt-10 md:-mt-14 z-10">
                    <div className="px-4 md:px-6 lg:px-8 pb-3 pt-0">
                      {/* Profile header */}
                      <div className="flex items-center">
                        {/* Profile image */}
                        <div className="flex-shrink-0 -mt-8 md:-mt-12">
                          <img 
                            className="rounded-full border-4 border-white shadow-md h-20 w-20 md:h-28 md:w-28 object-cover bg-gray-200"
                            src={ `http://localhost:5000${details.image}` }
                            alt={details.username}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                        
                        {/* Username and follow button */}
                        <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center justify-between ml-3 md:ml-5">
                          <div>
                            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">{details.username}</h1>
                            {details.firstname && (
                              <p className="text-sm md:text-base text-gray-600">{details.firstname} </p>
                            )}
                          </div>
                          <Link to='/user/edit/profile' className='font-3rem text-white  cursor-pointer'>
                            Edit Profile
                         </Link>
    
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex gap-6 md:gap-10 mt-4 border-b border-gray-100 pb-3">
                        <div className="text-center">
                          <span className="block font-bold text-gray-800 text-base md:text-lg">0</span>
                          <span className="text-xs md:text-sm text-gray-500">Posts</span>
                        </div>
                        <div className="text-center">
                          <span className="block font-bold text-gray-800 text-base md:text-lg">{followers || 0}</span>
                          <Link to="/list-followers" className="text-xs md:text-sm text-gray-500 cursor-pointer">Followers</Link>
                        </div>
                        <div className="text-center">
                          <span className="block font-bold text-gray-800 text-base md:text-lg">{following || 0}</span>
                          <Link to="/list-following" className="text-xs md:text-sm text-gray-500 cursor-pointer">Following</Link >
                        </div>
                      </div>
                      
                      {/* Bio */}
                      <div className="mt-3 text-gray-700">
                        <p className="text-sm md:text-base whitespace-pre-line">{details.bio || "No bio available."}</p>
                      </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="border-t border-gray-100 sticky top-0 bg-white z-10 shadow-sm">
                      <div className="flex justify-around">
                        <button
                          className={`flex-1 py-2 md:py-3 font-medium text-xs md:text-sm ${activeTab === 'posts' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                          onClick={() => setActiveTab('posts')}
                        >
                          Posts
                        </button>
                        <button
                          className={`flex-1 py-2 md:py-3 font-medium text-xs md:text-sm ${activeTab === 'media' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                          onClick={() => setActiveTab('media')}
                        >
                          Media
                        </button>
                        <button
                          className={`flex-1 py-2 md:py-3 font-medium text-xs md:text-sm ${activeTab === 'likes' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                          onClick={() => setActiveTab('likes')}
                        >
                          Likes
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <div className="bg-white p-3 md:p-5 lg:p-6">
                    {activeTab === 'posts' && (
                      <div className="py-6 md:py-10 text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-300 mb-2 md:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="font-medium text-sm md:text-base">No posts yet</p>
                        <p className="text-xs md:text-sm mt-1">When this user shares posts, they'll appear here.</p>
                      </div>
                    )}
                    
                    {activeTab === 'media' && (
                      <div className="py-6 md:py-10 text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-300 mb-2 md:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="font-medium text-sm md:text-base">No media found</p>
                        <p className="text-xs md:text-sm mt-1">Photos and videos will appear here.</p>
                      </div>
                    )}
                    
                    {activeTab === 'likes' && (
                      <div className="py-6 md:py-10 text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-300 mb-2 md:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p className="font-medium text-sm md:text-base">No likes yet</p>
                        <p className="text-xs md:text-sm mt-1">Posts this user has liked will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            };
    
export default Profile;