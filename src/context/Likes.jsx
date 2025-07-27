import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '../services/api';

const Likes = ({ postId, initialLikesCount, initiallyLiked }) => {
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [liked, setLiked] = useState(initiallyLiked || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const res = await api.post(`/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setLikesCount(res.data.likesCount);
      setLiked(res.data.likedByUser);
      
      console.log(res.data.likedByUser);
      console.log(res.data.likesCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated Likes Count ", likesCount);
  }, [likesCount]);

  return (
    <button 
      onClick={handleLike} 
      disabled={isLoading}
      className="flex items-center gap-1 focus:outline-none"
    >
      <Heart 
        className={`transition-all duration-300 transform ${
          isLoading ? 'animate-pulse' : ''
        } ${
          liked 
            ? 'fill-red-500 text-red-500 scale-110' 
            : 'text-white hover:scale-110'
        }`} 
        size={20} 
      />
      <span className="ml-1 text-sm">{likesCount}</span>
    </button>
  );
};

export default Likes;