import React from 'react';
import { useState ,useEffect} from 'react';
import api from '../services/api';


const Likes = (props)=> {
    const {postId , initialLikesCount , initiallyLiked} = props;

    const [likesCount , setLikesCount] = useState(initialLikesCount);
    const [ liked , setLiked] = useState(initiallyLiked);

    const handleLike = async(req,res) => {
        try{
            const token = localStorage.getItem('token');
            const res = await api.post(`/${postId}/like`,{},
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                 }},
            );
          
            setLikesCount(res.data.likesCount);
            setLiked(res.data.likedByUser);

            console.log(res.data.likedByUser);
            console.log(res.data.likesCount);
            
        }
       
        catch(error){
            return 
            console.error(error);
        }
    };
    useEffect(() => {
        console.log("Updated Likes Count ", likesCount);
    
     },[likesCount])

    return (
        <>
          <button onClick= {handleLike} className='cursor-pointer'>
                { liked ? 'Unlike' : 'Like' } {likesCount}
          </button>
        </>
    )
};
export default Likes;