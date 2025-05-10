import React from 'react';
import api from '../services/api';
import { useState , useEffect } from 'react'
import Likes from './Likes';
import Comments from './Comments'
  

const YourPosts = ()=> {

    const [userposts, setUserposts ] = useState([]);
    const [loading,setLoading] = useState(true);
    const token = localStorage.getItem('token')
              useEffect(() => {
                const fetchUserPosts = async()=> {
                   try{
                       const res = await api.get('/user/posts',{
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                          })
                        setUserposts(res.data)
                        console.log("Fetched user posts",res.data);
                      }catch(error){
                        console.error(error)
                      }finally{
                        setLoading(false);
                      }
                }
                fetchUserPosts();     
                
               },[]);
    
        const deletePost = async(postId) => {
          setLoading(true);
            if(!postId){
               console.error("postID is Undefined");
               return;
            }
             try{
              const token = localStorage.getItem('token');
              const res = await api.delete(`/posts/${postId}`, {
                headers:{
                    Authorization: `Bearer ${token}`
             }});
             }catch(error){
              console.error(error);
             }finally{
              setLoading(false);
             }
          };

          if(loading) {
          return (
              <div className="flex items-center justify-center h-full w-full p-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            );
          }
    return (
     <>
         { userposts.length > 0 ? (
          <div className='flex flex-col flex-1 p-2'>    
              { userposts.map(post => (
                <li key={post._id}>
                  <div className='grid grid-col-1 gap-1'>
                  <div className="max-w-xl min-w-sm mx-auto bg-black shadow-md rounded-lg overflow-hidden my-3">
                      {/* User Info */}
                      <div className="flex items-center justify-between px-4 py-3">
                        {post.user.imageUrl && ( <img
                            className="w-10 h-10 rounded-full"
                            src={ post.user.imageUrl }
                            alt="Profile"
                          />
                         )}
                         <p>{post.user.username}</p>
                        <div className="ml-3">
                          <p className="text-white font-semibold">{post.caption}</p>
                          <p className="text-gray-500 text-sm">2 hours ago</p>
                        </div>
                        <div className=''>
                          <img src='/imges/ellipsis-vertical-solid.svg' alt='deletePost'
                          className='invert' 
                          width={16}
                          height={16}
                          onClick={() => deletePost(post._id)} />
                        </div>
                      </div>

                      {/* Post Image */}
                      <img
                        className="w-full h-96 object-cover rounded-lg"
                        src= { post.imageUrl } // Replace with actual post image URL
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
        </div> ) : (
           
           <div className='flex flex-2 p-2 text-white'>
            <h1 calssName='text-5xl font-semibold text-blue-600'>
              There is no Posts You have...  , Create Your First Post
            </h1>
           </div>
           
           )} ;
         

    </>
    )
};
export default YourPosts;