import React from 'react';
import api from '../services/api';
import { useState , useEffect} from 'react'
import Likes from './Likes';
import Comments from './Comments'
  
  const Posts = ()=>{
        const [post, setPost] = useState([]);
      
      useEffect(() => {
        
          api.get('/post',post)
          .then(responce => setPost(responce.data))
          .catch(error => console.error("Error when finding for users",error));
          console.log(post);
        
      },[]);
       
    return(
    <>
   
<div className='flex flex-col flex-1 p-2'>
  
    
  { post.map(post => (
           <li key={post.id}>
    <div className='grid grid-col-1 gap-1'>
    <div className="max-w-xl min-w-sm mx-auto bg-black shadow-md rounded-lg overflow-hidden my-3">
        {/* User Info */}
        <div className="flex items-center px-4 py-3">
        <img
          className="w-10 h-10 rounded-full"
          src={ `https://backend-folder-hdib.onrender.com/uploads/${post.userId.image}` }
          alt="Profile"
        />
        <div className="ml-3">
          <p className="text-white font-semibold">{post.caption}</p>
          <p className="text-gray-500 text-sm">2 hours ago</p>
        </div>
      </div>

      {/* Post Image */}
      <img
        className="w-full h-96 object-cover rounded-lg"
        src= { `https://backend-folder-hdib.onrender.com/${post.image}` }
        alt="Post"
        width={96}
        height={77}
      />
        <div className='text-white'>
          <p>{post.tags}</p>
          <p>{post.location}</p>
        </div>
      {/* Engagement Options */}
      <div className="px-4 py-3">
        <div className="flex justify-between text-white">
          <div className="flex gap-4">
            <div className='flex flex-start'>
                <Likes postId={post._id}
                  initialLikesCount = {post.likes.length}
                  initiallyLiked = {post.likedByUser}
                />
             </div> 
            
            <div className="flex items-center flex-col mt-3">
               <Comments  postId= {post._id} Count={post.comments.length} comment={post.comments} userId ={post.userId} />
             </div>
          </div>
        </div>
      </div>
    </div>
</div>

         </li>
        ))}
</div>

   
    
   
    </>
  )
};
export default Posts;
