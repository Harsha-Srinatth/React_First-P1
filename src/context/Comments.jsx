import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Send, Trash2 } from 'lucide-react';

const Comments = ({ postId, Count, comment, userId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [count, setCount] = useState(Count || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/${postId}/comments`);
        setComments(res.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        // If API call fails, fallback to provided comments
        setComments(Array.isArray(comment) ? comment : []);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
  }, [postId, comment]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text?.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/${postId}/comment`, 
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update comments and count
      setComments(prev => [...prev, res.data.comment || res.data]);
      setCount(res.data.count || count + 1);
      setText(''); // Clear input
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!commentId) {
      console.error("commentId is undefined");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await api.delete(`/comments/${commentId}`, {
        data: { postId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      setCount(res.data.count || count - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="mb-4 max-h-72 overflow-y-auto">
          {comments.map((comment, index) => (
            <div key={comment._id || index} className="mb-3 bg-gray-800 bg-opacity-50 p-3 rounded-lg border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-purple-300 text-sm font-medium mb-1">
                    {comment.user?.username || "User"}
                  </p>
                  <p className="text-white">{comment.text}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                  </p>
                </div>
                {comment.user?._id === userId && (
                  <button 
                    onClick={() => deleteComment(comment._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-300 my-6 bg-gray-800 bg-opacity-30 p-4 rounded-lg border border-gray-700">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}

      <form onSubmit={handleComment} className="mt-4">
        <div className="flex mb-2">
          <input
            type="text"
            value={text || ''}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment here..."
            className="flex-1 bg-gray-800 text-white rounded-l-lg py-2 px-4 border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30"
          />
          <button
            type="submit"
            disabled={isSubmitting || !text?.trim()}
            className={`px-6 flex items-center justify-center rounded-r-lg ${
              isSubmitting || !text?.trim() 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>
      
      <div className="flex justify-center mt-1">
        <span className="text-gray-300 text-sm">{count} comments</span>
      </div>
    </div>
  );
};

export default Comments;