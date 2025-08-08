import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Cookies from 'js-cookie';  
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [activeTab, setActiveTab] = useState('posts');
  const [image, setImage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [userId, setUserId] = useState('');

  // Determine if the profile viewed is the current user's profile
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const token = Cookies.get('token');
        const currentUserId = Cookies.get('userid');
        setUserId(currentUserId);
        
        if (currentUserId) {
          // If viewing your own profile
          if (window.location.pathname === '/profile') {
            setIsCurrentUser(true);
          } else {
            // Check if viewing someone else's profile
            const urlParams = new URLSearchParams(window.location.search);
            const profileId = urlParams.get('id');
            
            if (profileId && profileId !== currentUserId) {
              setIsCurrentUser(false);
              // The follow status will be fetched with the user details
            } else {
              setIsCurrentUser(true);
            }
          }
        }
      } catch (err) {
        console.error("Error checking current user:", err);
      }
    };
    
    checkCurrentUser();
  }, []);

  // Fetch user profile details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) return;
        
        // Endpoint might change based on whether viewing own profile or another user's
        const endpoint = isCurrentUser ? '/getDetails' : `/user/${window.location.search.split('=')[1]}`;
        
        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          setDetails(res.data);
          setFollowers(res.data.followersCount || 0);
          setFollowing(res.data.followingCount || 0);
          setImage(res.data.image?.userImage || '');
        }
      } catch (err) {
        console.error("Error fetching profile details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [isCurrentUser]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      setFollowLoading(true);
      const token = Cookies.get('token');
      const profileId = window.location.search.split('=')[1];
      
      if (!profileId || !token) return;

      const endpoint = isFollowing ? `/unfollow/${profileId}` : `/follow/${profileId}`;
      const res = await api.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state with response data
      if (res.data.followersCount !== undefined) {
        setFollowers(res.data.followersCount);
      } else if (res.data.FollowersCount !== undefined) {
        setFollowers(res.data.FollowersCount);
      } else {
        setFollowers(isFollowing ? followers - 1 : followers + 1);
      }
      
      setIsFollowing(!isFollowing);
      
      // Refresh user data to ensure consistency
      const userRes = await api.get(`/user/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (userRes.data) {
        setDetails(prev => ({
          ...prev,
          followers: userRes.data.followers || prev.followers,
          following: userRes.data.following || prev.following
        }));
        setFollowers(userRes.data.FollowersCount || followers);
        setFollowing(userRes.data.FollowingCount || following);
        setIsFollowing(userRes.data.isFollowing);
      }
    } catch (err) {
      console.error("Error toggling follow status:", err);
    } finally {
      setFollowLoading(false);
    }
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4 bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-blue-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 text-gray-100 overflow-y-auto pb-16 md:pb-0 min-h-screen">
      {/* Cover photo with gradient overlay */}
      <div className="h-40 sm:h-48 md:h-60 bg-gradient-to-r from-blue-900 to-purple-900 relative w-full overflow-hidden">
        {details.coverImage ? (
          <>
            <img 
              src={details.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-70"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-900 opacity-90"></div>
        )}
      </div>
      
      {/* Profile section */}
      <div className="relative bg-gray-800 -mt-10 md:-mt-16 z-10 border-t border-gray-700 shadow-xl rounded-t-2xl">
        <div className="px-4 md:px-6 lg:px-8 pb-3 pt-0">
          {/* Profile header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end">
            {/* Profile image */}
            <div className="flex-shrink-0 -mt-16 sm:-mt-20 md:-mt-24 mb-4 sm:mb-0">
              <div className="rounded-full border-4 border-gray-800 shadow-lg h-28 w-28 md:h-36 md:w-36 overflow-hidden relative group">
              {image ? (
                  <img
                    src={image}
                    alt= "profile"
                    className="w-full h-full object-cover rounded-full transition-all duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl md:text-3xl transition-all duration-300 rounded-full">
                    {details.fullname[0]}
                  </div>
                )}
                {isCurrentUser && (
                  <Link to='/upload-profile-img' className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="bg-blue-600 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Username, bio and actions */}
            <div className="flex flex-col sm:flex-row flex-1 items-center sm:items-end justify-between sm:ml-6 w-full">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {details.username}
                </h1>
                {details.fullname && (
                  <p className="text-sm md:text-base text-gray-400 mt-1">
                    {details.fullname}
                  </p>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-3">
                {isCurrentUser ? (
                  <Link 
                    to='/user/edit/profile' 
                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow font-semibold transition-all duration-200 flex items-center space-x-2 border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-5 py-2 rounded-full shadow font-semibold transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isFollowing 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                    }`}
                  >
                    {followLoading ? (
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {isFollowing ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          )}
                        </svg>
                        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                      </>
                    )}
                  </button>
                )}
                
                {!isCurrentUser && (
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition border border-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats - Classic look */}
          <div className="flex items-center space-x-8 mt-4 text-gray-300 border-t border-b border-gray-700 py-4 px-3">
            <div className="flex items-center space-x-2">
              <Link to={`/list-followers/${details.userid}`} className="text-lg hover:text-blue-400 transition-colors">
                Followers :
              </Link>
              <span className="text-lg font-medium">{followers}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <Link to={`/list-following/${details.userid}`} className="text-lg hover:text-blue-400 transition-colors">
                Following :
              </Link>
              <span className="text-lg font-medium">{following}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">Posts :</span>
              <span className="text-lg font-medium">0</span>
            </div>
          </div>

          {/* Bio (remains below stats) */}
          {details.bio ? (
            <div className="mt-6 text-gray-100 bg-gray-800 rounded-lg p-5 border border-gray-700">
              <p className="text-base text-gray-300 leading-relaxed whitespace-pre-line">{details.bio}</p>
            </div>
          ) : (
            <div className="mt-6 flex items-center justify-center">
              <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 border-2 border-dashed border-blue-400 flex flex-col items-center shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-white font-bold text-lg md:text-xl mb-1">Add your bio here</p>
                <p className="text-blue-100 text-sm md:text-base text-center">Let others know more about you! Click edit profile to add a bio.</p>
                {isCurrentUser && (
                  <Link to='/user/edit/profile' className="mt-4 px-5 py-2 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition-all duration-200">Add Bio..</Link>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="border-t border-gray-700 sticky top-0 bg-gray-800 z-10 shadow-lg mt-6">
          <div className="flex justify-around">
            <button
              className={`flex-1 py-3 md:py-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                activeTab === 'posts' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('posts')}
            >
              Posts
            </button>
            <button
              className={`flex-1 py-3 md:py-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                activeTab === 'media' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('media')}
            >
              Media
            </button>
            <button
              className={`flex-1 py-3 md:py-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                activeTab === 'likes' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('likes')}
            >
              Likes
            </button>
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="bg-gray-900 p-4 md:p-6 lg:p-8">
        {activeTab === 'posts' && (
          <div className="py-8 md:py-12 text-center">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto border border-gray-700 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-medium text-base md:text-lg text-gray-300">No posts yet</p>
              <p className="text-sm md:text-base mt-2 text-gray-400">When {isCurrentUser ? 'you share' : 'this user shares'} posts, they'll appear here.</p>
              
              {isCurrentUser && (
                <button className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  Create Post
                </button>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'media' && (
          <div className="py-8 md:py-12 text-center">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto border border-gray-700 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-base md:text-lg text-gray-300">No media found</p>
              <p className="text-sm md:text-base mt-2 text-gray-400">Photos and videos shared by {isCurrentUser ? 'you' : 'this user'} will appear here.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'likes' && (
          <div className="py-8 md:py-12 text-center">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto border border-gray-700 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="font-medium text-base md:text-lg text-gray-300">No likes yet</p>
              <p className="text-sm md:text-base mt-2 text-gray-400">Posts {isCurrentUser ? 'you have' : 'this user has'} liked will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;