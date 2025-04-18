  
  import React from 'react';
  import {useEffect, useState} from 'react'
  //import {useNavigate} from 'react-router-dom'
  import api from '../services/api';
  
  const Users = ()=>{
      const [users, setUsers] = useState([]);
    
    useEffect(() => {
      
        api.get('/explore',users)
        .then(responce => setUsers(responce.data))
        .catch(error => console.error("Error when finding for users",error))
    },[]);
   
     
    return( 
      <div className='text-white w-full' action ="/explore">
           
           <h1 className='flex flex-center font-bold text-3xl md:text-xl'>Users List</h1>
           <div className='flex'>
               <input type='text' className='w-full p-2 mt-1' placeholder='Search For Others You Want To Know..?'/>
           </div>
         
         <div className='flex flex-center flex-col '>

            <div className='flex flex-col gap-4 justify-center items-center'>
                    { users.map(user => (
                    <li key={user.id}>
                        {user.firstname}
                    
                    <p>{user.email}</p>
                    </li>
                    ))}
            </div>

         </div>
           
    
      </div>
      
      );
    
    
    }
    export default Users;