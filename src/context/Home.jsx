import React from 'react';
import api from '../services/api';
import { useState , useEffect} from 'react'
import Likes from './Likes';
import Comments from './Comments'
  
  const Posts = ()=>{
        const [post, setPost] = useState([]);
        const [loading,setLoading] = useState('');
      
      useEffect(() => {
        setLoading(true);
        try{
            const fetchData = async() => {
            const res = await api.get('/post');
            console.log("raw responce",res);
            setPost(res.data);      
               };
            fetchData();
        }catch(error){
          console.log(error);
        }finally{
          setLoading(false);
        }
      },[]);

       if(loading) {
          return (
            <div className="flex items-center justify-center h-full w-full p-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          );
        }
    return(
    <>
   
<div className='flex flex-col flex-1 p-2'>
  
    {post.length>0 ? (
      post.map((post) => (
          <li key={post._id}>
    <div className='grid grid-col-1 gap-1'>
    <div className="max-w-xl min-w-sm mx-auto bg-black shadow-md rounded-lg overflow-hidden my-3">
        {/* User Info */}
        <div className="flex items-center px-4 py-3">
     {post.user.imageUrl && ( <img
          className="w-10 h-10 rounded-full"
          src={ post.user.imageUrl }
          alt="Profile"
        />
      )}
        <div className="ml-3">
          <p className="text-white font-semibold">{post.caption}</p>
          <p className="text-gray-500 text-sm">2 hours ago</p>
        </div>
      </div>

      {/* Post Image */}
      { post.imageUrl && <img
        className="w-full h-96 object-cover rounded-lg"
        src= { post.imageUrl }
        alt="Post"
        width={96}
        height={77}
      /> }
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
        ))
    ) : (
      <div className='text-white text-center'>
        <p className='text-xl'>No posts available </p>
      </div>
    )}
  
</div>

   
    
   
    </>
  )
};
export default Posts;
