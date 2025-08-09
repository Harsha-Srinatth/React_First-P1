import React from 'react';
import api from '../services/api';
import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Likes from './Likes';
import Comments from './Comments';
import DynamicAspectImage from '../components/DynamicAspectImage';
import Avatar from '../components/Avatar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState(null);
  const userid = Cookies.get('userid')?.replace(/^"|"$/g,'')  ;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/post');
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

  const goToProfile = (userId) => {
    navigate(`/user/${userId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-2 max-w-xl mx-auto w-full pt-20 pb-24">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.postId} className="mb-6 relative">
            {/* Main Post Card */}
            <div className="bg-black shadow-lg rounded-lg overflow-hidden border border-gray-800">
              {/* User Info */}
              <div className="flex items-center px-4 py-3">
                <Avatar
                  imageUrl={post.user?.imageUrl}
                  name={post.username}
                  className="w-10 h-10 cursor-pointer"
                  onClick={() => goToProfile(post.userid)}
                  alt="Profile"
                />
                <div className="ml-3">
                  <p className="text-white font-semibold cursor-pointer"  onClick= {() => goToProfile(post.userid)}>{post.username}</p>
                  <p className="text-gray-500 text-xs flex items-center">
                    <span> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}</span>
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
                  <p className="cursor-pointer">{post.caption}</p>
                </div>
              )}

              {/* Post Image */}
              {post.imageUrl && (
                <DynamicAspectImage src={post.imageUrl} alt="Post" />
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
                    postId={post.postId}
                    initialLikesCount={post.likes?.length || 0}
                    initiallyLiked={post.likes.includes(userid)}
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
                <div className="w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="relative w-full">
                    <button 
                      onClick={() => setActiveComments(null)}
                      className="absolute -top-10 right-0 text-white hover:text-gray-300"
                    >
                     
                    </button>
                    
                    <Comments
                      postId={post.postId}
                      Count={post.comments?.length || 0}
                      comment={post.comments}
                      userId={post.userid}
                      userid = {userid}
                      onClose={() => setActiveComments(null)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-black bg-opacity-80 rounded-lg border border-gray-800 p-8 mt- text-center text-white">
          <p className="text-xl">No posts available</p>
          <p className="text-gray-400 mt-2">Check back later for new content</p>
        </div>
      )}
    </div>
  );
};

export default Posts;