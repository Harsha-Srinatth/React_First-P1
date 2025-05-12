
import React from 'react';
import { useEffect, useState } from 'react'
//import {useNavigate} from 'react-router-dom'
import api from '../services/api';
import { useNavigate } from 'react-router-dom'


const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search?.trim()) {
        api.get(`/explore/search?username=${search}`)
          .then(responce => setUsers(responce.data))
          .catch(error => console.error("Error when finding for users", error))
        console.log(users);
      } else {
        setUsers([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);

  }, [search]);

  const goToProfile = (userId) => {
    navigate(`/user/${userId}`);
  }
 

  return (
    <div className='text-white w-full' action="/explore">

      <h1 className='flex flex-center font-bold text-3xl md:text-xl'>Users List</h1>
      <div className='flex flex-col'>
        <input type='text' value={search} className='w-full p-2 mt-1' placeholder='Search For Others You Want To Know..?' onChange={(e) => setSearch(e.target.value)} />
        {search ? (
          <div className='flex flex-start p-5'>
            <div className='flex flex-col gap-4 '>
              {users.map(user => (
                // const isFollowing = 
                <li key={user._id} onClick={() => goToProfile(user._id)} >
                  <div className='flex flex-row gap-3'>
                    <img src={ user.user.imageUrl } className='flex flex-row bg-yellow-600 rounded-full' alt='' width={56} height={56} />
                    <div className='flex flex-col gap-2'>
                      <h1 className='text-lg text-2rem font-semibold '>{user.username}</h1>
                      <p className='text-sm text-3rem'>{user.firstname}</p>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </div>
        ) : (
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