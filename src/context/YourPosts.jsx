import React from 'react';
import api from '../services/api';
import { useState, useEffect } from 'react';
import Likes from './Likes';
import { Link } from 'react-router-dom'
import Comments from './Comments';
import { MessageCircle, Trash2, X } from 'lucide-react'; // Added Trash2 and X icons
import Cookies from 'js-cookie';  
import DynamicAspectImage from '../components/DynamicAspectImage';
const YourPosts = () => {
  const [userposts, setUserposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState(null); // Added missing state
  const userid = Cookies.get('userid')?.replace(/^"|"$/g, '');
  useEffect(() => {
    const fetchUserPosts = async() => {
      try {
        const token = Cookies.get('token');
        const res = await api.get('/user/posts/user_posts', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setUserposts(res.data);
      } catch(error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, []);
  
  const deletePost = async(postId) => {
    if(!postId) {
      console.error("postID is Undefined");
      return;
    }
    
    try {
      // Optimistically update UI first
      setUserposts(prevPosts => prevPosts.filter(post => post.postId !== postId));
      
      // Then make API call
      await api.delete(`/user/posts/user_posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch(error) {
      console.error("Error deleting post:", error);
      // If deletion fails, revert the UI change by fetching posts again
      const res = await api.get('/user/posts/user_posts', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setUserposts(res.data);
    }
  };

  const toggleComments = (postId) => {
    setActiveComments(activeComments === postId ? null : postId);
  };

  if(loading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col flex-1 p-4 max-w-xl mx-auto w-full bg-gray-900 min-h-screen pt-20 pb-24">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Posts</h2>
      
      {userposts.length > 0 ? (
        userposts.map((post) => (
          <div key={post.postId} className="mb-8 relative">
            {/* Main Post Card */}
            <div className="bg-black shadow-xl rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300">
              {/* User Info and Delete Button */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center">
                  {post.user?.imageUrl && (
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                      src={`https://backend-folder-hdib.onrender.com/uploads/${post.user.imageUrl}`}
                      alt="Profile"
                    />
                  )}
                  <div className="ml-3">
                    <p className="text-white font-semibold">{post.userId?.username || "User"}</p>
                    <p className="text-gray-400 text-xs flex items-center">
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}</span>
                      {post.location && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{post.location}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Delete Button */}
                <button 
                  onClick={() => deletePost(post.postId)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800"
                  aria-label="Delete post"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              {/* Post Caption */}
              {post.caption && (
                <div className="px-4 py-3 text-white">
                  <p className="leading-relaxed">{post.caption}</p>
                </div>
              )}
              
              {/* Post Image */}
             <DynamicAspectImage src={`https://backend-folder-hdib.onrender.com/uploads/${post.imageUrl}`} alt="Post" />
             
              
              {/* Tags */}
              {post.tags && (
                <div className="px-4 pt-3 text-blue-400 text-sm">
                  <p>{post.tags}</p>
                </div>
              )}
              
              {/* Engagement Options */}
              <div className="px-4 py-4 flex justify-between items-center border-t border-gray-800 mt-2">
                <div className="flex gap-6">
                  {/* Likes */}
                  <Likes
                    postId={post.postId}
                    initialLikesCount={post.likes?.length || 0}
                    initiallyLiked={post.likedByUser}
                  />
                  
                  {/* Comments Button */}
                  <button 
                    className="flex items-center gap-1 text-white focus:outline-none"
                    onClick={() => toggleComments(post.postId)}
                  >
                    <MessageCircle 
                      className={`transition-colors duration-300 ${
                        activeComments === post.postId ? 'text-purple-500' : 'text-white hover:text-purple-300'
                      }`} 
                      size={20} 
                    />
                    <span className="ml-1 text-sm">{post.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Separate Comments Modal */}
            {activeComments === post.postId && (
              <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-gray-900 rounded-xl border border-gray-700">
                  <div className="relative w-full p-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-white font-semibold">Comments</h3>
                    <button 
                      onClick={() => setActiveComments(null)}
                      className="text-gray-400 hover:text-white p-1"
                      aria-label="Close comments"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-4 overflow-y-auto">
                    <Comments
                      postId={post.postId}
                      Count={post.comments?.length || 0}
                      comment={post.comments}
                      userId={post.userid}
                      userid={userid}
                      onClose={() => setActiveComments(null)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-black bg-opacity-80 rounded-lg border border-gray-800 p-8 text-center text-white my-8 shadow-lg transform transition-transform hover:scale-105 duration-300">
          <p className="text-xl font-semibold">No posts available</p>
          <p className="text-gray-400 mt-2 mb-8">Create Your First Post</p>
          <Link to="/create-post" className=" px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium transition-colors duration-300">
            Create Post
          </Link>
        </div>
      )}
    </div>
  );
};

export default YourPosts;