import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';

const ShowProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState('');
  const [followers, setFollowers] = useState('');
  const [isFollowing, setIsFollowing] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [image,setImage] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [activeTab, setActiveTab] = useState('posts');


  useEffect(() => {
    const fetchUser = async() => {
      const token = Cookies.get('token');
      const currentUserIdFromCookie = Cookies.get('userid')?.replace(/^"|"$/g,'');
      setCurrentUserId(currentUserIdFromCookie);
      
      // Check if viewing own profile
      if (currentUserIdFromCookie === userId) {
        setIsCurrentUser(true);
      } else {
        setIsCurrentUser(false);
      }
      
      setLoading(true);
      
      try {
        const res = await api.get(`/user/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });     
        setUser(res.data);
        setFollowing(res.data.FollowingCount);
        setFollowers(res.data.FollowersCount);
        setIsFollowing(res.data.isFollowing);
        if (res.data.image?.userImage) {
          setImage(res.data.image.userImage);
        }else{
          setImage('');
        }
        
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
    const token = Cookies.get('token');
    try {
      if(isFollowing) {
        const res = await api.post(`/unfollow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Update local state with response data
        if (res.data.followersCount !== undefined) {
          setFollowers(res.data.followersCount);
        } else {
          setFollowers(prev => Number(prev) - 1);
        }
      } else {
        const res = await api.post(`/follow/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Update local state with response data
        if (res.data.FollowersCount !== undefined) {
          setFollowers(res.data.FollowersCount);
        } else {
          setFollowers(prev => Number(prev) + 1);
        }
      }
      setIsFollowing(!isFollowing);
      
      // Refresh user data to ensure consistency
      const userRes = await api.get(`/user/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(userRes.data);
      setFollowing(userRes.data.FollowingCount);
      setFollowers(userRes.data.FollowersCount);
      setIsFollowing(userRes.data.isFollowing);
    } catch(error) {
      console.error("Follow toggle error:", error);
    }
  };



  // Fetch followers list
  const fetchFollowers = async () => {
    setFollowersLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await api.get(`/followers-list/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data && Array.isArray(res.data)) {
        setFollowersList(res.data);
      } else if (res.data && res.data.followers && Array.isArray(res.data.followers)) {
        setFollowersList(res.data.followers);
      } else {
        setFollowersList([]);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      setFollowersList([]);
    } finally {
      setFollowersLoading(false);
    }
  };

  // Fetch following list
  const fetchFollowing = async () => {
    setFollowingLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await api.get(`/following-list/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data && Array.isArray(res.data)) {
        setFollowingList(res.data);
      } else if (res.data && res.data.following && Array.isArray(res.data.following)) {
        setFollowingList(res.data.following);
      } else {
        setFollowingList([]);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
      setFollowingList([]);
    } finally {
      setFollowingLoading(false);
    }
  };

  // Handle follow user from list
  const handleFollowUser = async (userToFollow) => {
    const token = Cookies.get('token');
    try {
      setFollowLoading(prev => ({ ...prev, [userToFollow.userId]: true }));
      const res = await api.post(`/follow/${userToFollow.userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.status === 200) {
        // Update the user's isFollowing status in the list
        const updateList = list => list.map(user => 
          user.userId === userToFollow.userId 
            ? { ...user, isFollowing: true }
            : user
        );
        
        setFollowersList(updateList);
        setFollowingList(updateList);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userToFollow.userId]: false }));
    }
  };

  if(loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 opacity-20"></div>
        </div>
      </div>
    );
  }

  if(!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600">This profile doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen overflow-y-auto pb-16 md:pb-0">
      {/* Enhanced Cover Photo */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
        {user.coverImage && (
          <img 
            src={`${user.coverImage}`}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      {/* Enhanced Profile Section */}
      <div className="relative bg-white shadow-2xl rounded-t-3xl -mt-8 md:-mt-12 z-10 border border-gray-100">
        <div className="px-6 md:px-8 lg:px-10 pb-6 pt-0">
          {/* Enhanced Profile Header */}
          <div className="flex items-center">
            {/* Enhanced Profile Image */}
            <div className="flex-shrink-0 -mt-12 md:-mt-16 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 relative">
                {image ? (
                  <img
                    src= {image }
                    alt="profile"
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl transition-all duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-3xl md:text-4xl lg:text-5xl transition-all duration-300 hover:scale-105">
                    {user.fullname[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-3 border-white rounded-full shadow-lg"></div>
              </div>
            </div>
            
            {/* Enhanced Username and Follow Button */}
            <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center justify-between ml-4 md:ml-6">
              <div className="flex-1">
                <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{user.username}</h1>
                {user.fullname && (
                  <p className="text-sm md:text-lg text-gray-600 font-medium">{user.fullname}</p>
                )}
              </div>
              
              {!isCurrentUser ? (
                <button 
                  className={`mt-3 sm:mt-0 px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base font-semibold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                    isFollowing 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white focus:ring-red-300 shadow-lg' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white focus:ring-blue-300 shadow-lg'
                  }`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              ) : (
                <Link 
                  to="/user/edit/profile"
                  className="mt-3 sm:mt-0 px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm md:text-base font-semibold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-lg"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="flex gap-8 md:gap-12 mt-6 border-b border-gray-200 pb-4">
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <span className="block font-bold text-gray-800 text-lg md:text-xl group-hover:text-blue-600 transition-colors">0</span>
              <span className="text-xs md:text-sm text-gray-500 font-medium">Posts</span>
            </div>
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <span className="block font-bold text-gray-800 text-lg md:text-xl group-hover:text-purple-600 transition-colors">{followers || 0}</span>
              <Link to={`/list-followers/${userId}`} className="text-xs md:text-sm text-gray-500 font-medium hover:text-purple-600 transition-colors">
                 Followers
              </Link>
            </div>
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <span className="block font-bold text-gray-800 text-lg md:text-xl group-hover:text-pink-600 transition-colors">{following || 0}</span>
              <Link to={`/list-following/${userId}`} className="text-xs md:text-sm text-gray-500 font-medium hover:text-pink-600 transition-colors">Following</Link>
            </div>
          </div>
          
          {/* Enhanced Bio */}
          <div className="mt-4 text-gray-700">
            <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">{user.bio || "No bio available."}</p>
          </div>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="border-t border-gray-200 sticky top-0 bg-white z-10 shadow-sm backdrop-blur-sm bg-white/95">
          <div className="flex justify-around">
            {[
              { id: 'posts', label: 'Posts', icon: '📝' },
              { id: 'media', label: 'Media', icon: '📷' },
              { id: 'likes', label: 'Likes', icon: '❤️' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`flex-1 py-3 md:py-4 font-medium text-xs md:text-sm transition-all duration-300 relative group ${
                  activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="flex items-center justify-center gap-1">
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Content Area */}
      <div className="bg-white p-4 md:p-6 lg:p-8">
        {activeTab === 'posts' && (
          <div className="py-12 md:py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
              <p className="text-gray-500 text-sm md:text-base">When this user shares posts, they'll appear here.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'media' && (
          <div className="py-12 md:py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No media found</h3>
              <p className="text-gray-500 text-sm md:text-base">Photos and videos will appear here.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'likes' && (
          <div className="py-12 md:py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No likes yet</h3>
              <p className="text-gray-500 text-sm md:text-base">Posts this user has liked will appear here.</p>
            </div>
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="space-y-3">
            {followersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 opacity-20"></div>
                </div>
              </div>
            ) : followersList.length > 0 ? (
              followersList.map(user => (
                <div key={user.userId} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <Link to={`/profile/${user.userId}`} className="flex items-center gap-4 flex-1 group">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        className="w-12 h-12 rounded-full object-cover border-3 border-gray-200 shadow-md group-hover:border-blue-300 transition-all duration-300" 
                        alt={user.fullname || 'profile'} 
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg border-3 border-gray-200 shadow-md group-hover:border-blue-300 transition-all duration-300">
                        {user.fullname?.[0] || '?'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{user.username}</h3>
                      <p className="text-sm text-gray-500">{user.fullname}</p>
                    </div>
                  </Link>
                  {isCurrentUser && user.userId !== currentUserId && !user.isFollowing && (
                    <button
                      onClick={() => handleFollowUser(user)}
                      disabled={followLoading[user.userId]}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-2 shadow-md"
                    >
                      {followLoading[user.userId] ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No followers yet</h3>
                  <p className="text-gray-500 text-sm md:text-base">When people follow you, they'll appear here.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="space-y-3">
            {followingLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 opacity-20"></div>
                </div>
              </div>
            ) : followingList.length > 0 ? (
              followingList.map(user => (
                <div key={user.userId} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <Link to={`/profile/${user.userId}`} className="flex items-center gap-4 flex-1 group">
                    {user.image ? (
                      <img 
                        src={user.image} 
                        className="w-12 h-12 rounded-full object-cover border-3 border-gray-200 shadow-md group-hover:border-purple-300 transition-all duration-300" 
                        alt={user.fullname || 'profile'} 
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg border-3 border-gray-200 shadow-md group-hover:border-purple-300 transition-all duration-300">
                        {user.fullname?.[0] || '?'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">{user.username}</h3>
                      <p className="text-sm text-gray-500">{user.fullname}</p>
                    </div>
                  </Link>
                  {isCurrentUser && user.userId !== currentUserId && !user.isFollowing && (
                    <button
                      onClick={() => handleFollowUser(user)}
                      disabled={followLoading[user.userId]}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-2 shadow-md"
                    >
                      {followLoading[user.userId] ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Not following anyone yet</h3>
                  <p className="text-gray-500 text-sm md:text-base">When you follow people, they'll appear here.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowProfile;