import React from 'react';
import api from '../services/api';
import { useState, useEffect } from 'react';
import Likes from './Likes';
import Comments from './Comments';
import { MessageCircle, Trash2, X } from 'lucide-react'; // Added Trash2 and X icons

const YourPosts = () => {
  const [userposts, setUserposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState(null); // Added missing state
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchUserPosts = async() => {
      try {
        const res = await api.get('/user/posts', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setUserposts(res.data);
        console.log("Fetched user posts", res.data);
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
      setUserposts(prevPosts => prevPosts.filter(post => post._id !== postId));
      
      // Then make API call
      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Post deleted successfully:", postId);
    } catch(error) {
      console.error("Error deleting post:", error);
      // If deletion fails, revert the UI change by fetching posts again
      const res = await api.get('/user/posts', {
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
      <div className="flex items-center justify-center h-full w-full p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col flex-1 p-4 max-w-xl mx-auto w-full bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Posts</h2>
      
      {userposts.length > 0 ? (
        userposts.map((post) => (
          <div key={post._id} className="mb-8 relative">
            {/* Main Post Card */}
            <div className="bg-black shadow-xl rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300">
              {/* User Info and Delete Button */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center">
                  {post.user?.imageUrl && (
                    <img
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                      src={post.user.imageUrl}
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
                  onClick={() => deletePost(post._id)}
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
              {post.imageUrl && (
                <div className="w-full">
                  <img
                    className="w-full object-cover transition-opacity duration-300 hover:opacity-95"
                    style={{ maxHeight: "70vh" }}
                    src={post.imageUrl}
                    alt="Post"
                  />
                </div>
              )}
              
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
                    postId={post._id}
                    initialLikesCount={post.likes?.length || 0}
                    initiallyLiked={post.likedByUser}
                  />
                  
                  {/* Comments Button */}
                  <button 
                    className="flex items-center gap-1 text-white focus:outline-none"
                    onClick={() => toggleComments(post._id)}
                  >
                    <MessageCircle 
                      className={`transition-colors duration-300 ${
                        activeComments === post._id ? 'text-purple-500' : 'text-white hover:text-purple-300'
                      }`} 
                      size={20} 
                    />
                    <span className="ml-1 text-sm">{post.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Separate Comments Modal */}
            {activeComments === post._id && (
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
                      postId={post._id}
                      Count={post.comments?.length || 0}
                      comment={post.comments}
                      userId={post.userId}
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
          <p className="text-gray-400 mt-2">Create Your First Post</p>
          <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium transition-colors duration-300">
            Create Post
          </button>
        </div>
      )}
    </div>
  );
};

export default YourPosts;