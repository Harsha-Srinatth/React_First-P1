import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom'

const ShowProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState('');
  const [followers, setFollowers] = useState('');
  const [isFollowing, setIsFollowing] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUser = async() => {
      const token = localStorage.getItem('token');
      setLoading(true);
      
      try {
        const res = await api.get(`/user/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUser(res.data.user);
        setFollowing(res.data.FollowingCount);
        setFollowers(res.data.FollowersCount);
        setIsFollowing(res.data.isFollowing);
      } catch(error) {
        console.error(error);
        setIsFollowing(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);

  const handleFollowToggle = async() => {
    const token = localStorage.getItem('token');
    try {
      if(isFollowing) {
        await api.post(`/unfollow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFollowers(prev => Number(prev) - 1);
      } else {
        await api.post(`/follow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFollowers(prev => Number(prev) + 1);
      }
      setIsFollowing(!isFollowing);
    } catch(error) {
      console.error("Follow toggle error:", error);
    }
  };

  if(loading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if(!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700">User not found</h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">This profile doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    // Content container - optimized for sidebar and outlet pattern
    <div className="w-full bg-gray-50 overflow-y-auto pb-16 md:pb-0">
      {/* Cover photo - responsive height */}
      <div className="h-32 sm:h-36 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative w-full">
        {user.coverImage && (
          <img 
            src={`http://localhost:5000${user.coverImage}`}
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
                src={`http://localhost:5000${user.image}`}
                alt={user.username}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            
            {/* Username and follow button */}
            <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center justify-between ml-3 md:ml-5">
              <div>
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">{user.username}</h1>
                {user.firstname && (
                  <p className="text-sm md:text-base text-gray-600">{user.firstname} {user.lastname || ''}</p>
                )}
              </div>
              
              <button 
                className="mt-2 sm:mt-0 px-4 py-1 md:px-6 md:py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm md:text-base font-medium rounded-full hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-6 md:gap-10 mt-4 border-b border-gray-100 pb-3">
            <div className="text-center">
              <span className="block font-bold text-gray-800 text-base md:text-lg">0</span>
              <span className="text-xs md:text-sm text-gray-500 cursor-pointer">Posts</span>
            </div>
            <div className="text-center ">
              <span className="block font-bold text-gray-800 text-base md:text-lg">{followers || 0}</span>
              <Link to="/list-followers" className="text-xs md:text-sm text-gray-500 cursor-pointer">
                 Followers
              </Link>
              
            </div>
            <div className="text-center">
              <span className="block font-bold text-gray-800 text-base md:text-lg">{following || 0}</span>
              <Link to="/list-following" className="text-xs md:text-sm text-gray-500 cursor-pointer">Following</Link>
            </div>
          </div>
          
          {/* Bio */}
          <div className="mt-3 text-gray-700">
            <p className="text-sm md:text-base whitespace-pre-line">{user.bio || "No bio available."}</p>
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

export default ShowProfile;