import React from 'react';
import api from '../services/api';
import { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import Likes from './Likes';
import Comments from './Comments';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null);

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
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-2 max-w-xl mx-auto w-full">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="mb-6">
            <div className="bg-black shadow-md rounded-lg overflow-hidden border border-gray-800">
              {/* User Info */}
              <div className="flex items-center px-4 py-3">
                {post.user.imageUrl && (
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={post.user.imageUrl}
                    alt="Profile"
                  />
                )}
                <div className="ml-3">
                  <p className="text-white font-semibold">{post.caption}</p>
                  <p className="text-gray-500 text-sm">2 hours ago</p>
                </div>
              </div>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={post.imageUrl}
                    alt="Post"
                  />
                </div>
              )}

              {/* Tags and Location */}
              <div className="px-4 pt-3 text-gray-300 text-sm">
                {post.tags && <p className="mb-1">{post.tags}</p>}
                {post.location && (
                  <p className="flex items-center">
                    <span>📍</span>
                    <span className="ml-1">{post.location}</span>
                  </p>
                )}
              </div>

              {/* Engagement Options */}
              <div className="px-4 py-3">
                <div className="flex justify-between text-white">
                  <div className="flex gap-6">
                    <div className="flex items-center">
                      <Likes
                        postId={post._id}
                        initialLikesCount={post.likes.length}
                        initiallyLiked={post.likedByUser}
                      />
                    </div>
                    
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleComments(post._id)}
                    >
                      <MessageCircle 
                        className={`mr-2 ${expandedPost === post._id ? 'text-purple-500' : 'text-white'}`} 
                        size={20} 
                      />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments Section - Always visible but collapsible */}
              <div className={`border-t border-gray-800 px-4 py-3 ${expandedPost === post._id ? 'block' : 'hidden'}`}>
                <Comments
                  postId={post._id}
                  Count={post.comments.length}
                  comment={post.comments}
                  userId={post.userId}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-white text-center py-10 bg-black bg-opacity-80 rounded-lg border border-gray-800">
          <p className="text-xl">No posts available</p>
        </div>
      )}
    </div>
  );
};

export default Posts;