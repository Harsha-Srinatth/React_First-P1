import React from 'react';
import api from '../services/api';
import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Likes from './Likes';
import Comments from './Comments';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/post');
        console.log("raw response", res);
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const toggleComments = (postId) => {
    setActiveComments(activeComments === postId ? null : postId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-2 max-w-xl mx-auto w-full">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="mb-6 relative">
            {/* Main Post Card */}
            <div className="bg-black shadow-lg rounded-lg overflow-hidden border border-gray-800">
              {/* User Info */}
              <div className="flex items-center px-4 py-3">
                {post.user.imageUrl && (
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    src={post.user.imageUrl}
                    alt="Profile"
                  />
                )}
                <div className="ml-3">
                  <p className="text-white font-semibold">{post.user.username || "User"}</p>
                  <p className="text-gray-500 text-xs flex items-center">
                    <span>2 hours ago</span>
                    {post.location && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{post.location}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Post Caption */}
              {post.caption && (
                <div className="px-4 py-2 text-white">
                  <p>{post.caption}</p>
                </div>
              )}

              {/* Post Image */}
              {post.imageUrl && (
                <div className="w-full">
                  <img
                    className="w-full object-cover"
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
              <div className="px-4 py-3 flex justify-between items-center">
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
                <div className="w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="relative w-full">
                    <button 
                      onClick={() => setActiveComments(null)}
                      className="absolute -top-10 right-0 text-white hover:text-gray-300"
                    >
                      <X size={24} />
                    </button>
                    
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
        <div className="bg-black bg-opacity-80 rounded-lg border border-gray-800 p-8 text-center text-white">
          <p className="text-xl">No posts available</p>
          <p className="text-gray-400 mt-2">Check back later for new content</p>
        </div>
      )}
    </div>
  );
};

export default Posts;