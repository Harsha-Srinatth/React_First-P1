import React from 'react';
import { useState ,useEffect} from 'react';
import api from '../services/api';
const Comments = (props) => {
  const { postId , Count , comment ,userId } = props;
  const [text, setText] = useState();
  const [count, setCount] = useState(props.Count);
  const [comments, setComments] = useState([comment]);
  const [showComments,setShowComments] = useState(false);
  
 

    const handleComment = async(e) => {
      e.preventDefault();
      try{
        const data = { text };
        const token = localStorage.getItem('token');
        const res = await api.post(`/${postId}/comment`, data ,
            {
                headers:{
                    Authorization: `Bearer ${token}`
             }},
        );
        console.log(res.data);
        setCount(res.data.count);

      
      }catch(error){
        console.error(error);
      }
    };
   
    const handleShowComments = async(postId) => {
      console.log("handleShowcomments trigged")
        try{
          const res = await api.get(`/${postId}/comments`);
          setComments(res.data);

        }catch(error){
          console.error(error)
        }
    };

    const deleteComment = async(commentId) => {
      if(!commentId){
         console.error("commetnID is Undefined");
         return;
      }
       try{
        const token = localStorage.getItem('token');
        const res = await api.delete(`/comments/${commentId}`,{
          data: {
            postId,
          },
        }, {
          headers:{
              Authorization: `Bearer ${token}`
       }});
        setCount(res.data.count);
        console.log(res.data);
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        
       // setCount(prevCount => prevCount - 1);

       }catch(error){
        console.error(error)
       }
    };

    useEffect(() => {
      console.log(count);
    },[count]);


    return (
        <>

        <button onClick={()=>{
            handleShowComments(postId),
            setShowComments(prev => !prev)
          }}>
            {showComments ? "Hide Comments" : "View Comments" }
         </button>

          {showComments &&  (
              comments.map((comment , index) => 
                <div key={index} className='mt-2 p-2'>
                  <strong> {comment.user?.username || "User"}:</strong>
                  <p className='flex items-center gap-2 text-lg justify-between '>
                     {comment.text}

                     <button onClick={()=>{
                    deleteComment(comment._id)
                   }}>Delete</button>
                  </p>
               
                 

                </div>
          ))}
           
                          
              <div>
                <form method='POST' onSubmit={handleComment}>
                <input type="text" name="text" value={ text } placeholder='Add a Comment Here....'  onChange={(e) => setText(e.target.value)}/>

                   <div>
                        <button className="text-white text-xl font-semibold  bg-gradient-to-r from-purple-500 to-blue-500 border-0 py-1 px-4  hover:from-purple-600 hover: to-blue-600
                              focus:outline-none focus:ring focus:ring-purple-300
                              active:bg-blue-700 rounded text-base mt-4 md:mt-0" type="submit" >
                                  Submit
                         </button>
                   </div>
                 </form>
                      <span>{count !== undefined ? count : 0}</span>
              </div>


        
      
         
        </>
    )
};
export default Comments;