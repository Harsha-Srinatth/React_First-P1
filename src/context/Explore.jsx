  
  import React from 'react';
  import {useEffect, useState} from 'react'
  //import {useNavigate} from 'react-router-dom'
  import api from '../services/api';
  
  const Users = ()=>{
      const [users, setUsers] = useState([]);
      const [search,setSearch] = useState("");
    
    useEffect(() => {
      const delayDebounce = setTimeout(() => {
          if(search?.trim()){
            api.get(`/explore/search?username=${search}`)
            .then(responce => setUsers(responce.data))
            .catch(error => console.error("Error when finding for users",error))
            console.log(users);
          }else{
            setUsers([]);
          }
      }, 300);
      return () => clearTimeout(delayDebounce);
       
    },[search]);
   
     
    return( 
      <div className='text-white w-full' action ="/explore">
           
           <h1 className='flex flex-center font-bold text-3xl md:text-xl'>Users List</h1>
           <div className='flex flex-col'>
              <input type='text' className='w-full p-2 mt-1' placeholder='Search For Others You Want To Know..?' onChange={(e) => setSearch(e.target.value)}/>
              { search ? (
                       <div className='flex flex-start p-5'>
                       <div className='flex flex-col gap-4 '>
                           { users.map(user => (
                               <li key={user.id}>
                                 
                                 <div className='flex flex-row gap-3'>
                                     <img src='' className='flex flex-row bg-yellow-600 rounded-full' alt='' width={56} height={56}/>
                                   <div className='flex flex-col gap-2'>
                                     <h1 className='text-lg text-2rem font-semibold '>{user.username}</h1> 
                                     <p className='text-sm text-3rem'>{user.firstname}</p>
                                   </div>
                                   <div>
                                   <button className="text-white text-xl font-semibold  bg-gradient-to-r from-purple-500 to-blue-500 border-0 py-1 px-4  hover:from-purple-600 hover: to-blue-600
                                       focus:outline-none focus:ring focus:ring-purple-300
                                       active:bg-blue-700 rounded text-base mt-4 md:mt-0 items-center justify-center" type="submit" >
                                           Follow
                                    </button>
                                   </div>
                                 </div>
                               </li>
                           ))}
                       </div>
                  </div>
              ):(
                <div className='flex justify-center items-center h-screen'>
                  <div className='flex flex-col'>
                      <h1 className='text-yellow-600 font-semibold text-xl'>
                        Search Any Thing To find Out
                      </h1>
                  </div>
                   
                </div>
              )

              }
             
             
           </div>
         
        
           
    
      </div>
      
      );
    
    
    }
    export default Users;