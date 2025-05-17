import React from 'react'; 
import { useEffect, useState } from 'react'
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search?.trim()) {
        setIsLoading(true);
        api.get(`/explore/search?username=${search}`)
          .then(response => {
            setUsers(response.data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error when finding for users", error);
            setIsLoading(false);
          });
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
    <div className='bg-gray-900 text-white w-full min-h-screen p-4 md:p-6 lg:p-8'>
      <h1 className='font-bold text-3xl md:text-xl text-center mb-6'>Users List</h1>
      <div className='w-full mx-auto'>
        <div className='relative'>
          <input 
            type='text' 
            value={search} 
            className='w-full p-4 pl-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none' 
            placeholder='Search For Others You Want To Know..?' 
            onChange={(e) => setSearch(e.target.value)} 
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mt-8">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {search ? (
          <div className='p-5'>
            <div className='flex flex-col gap-4'>
              {users.length > 0 ? (
                <>
                  <div className="text-gray-300 text-sm mb-3">
                    {users.length} {users.length === 1 ? 'result' : 'results'} found
                  </div>
                  {users.map(user => (
                    <li 
                      key={user._id} 
                      onClick={() => goToProfile(user._id)}
                      className="bg-gray-800 rounded-lg p-3 flex items-center gap-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-yellow-500 list-none"
                    >
                      <div className="relative">
                        <img 
                          src={user.image.imageUrl} 
                          className="rounded-full bg-yellow-600" 
                          alt='' 
                          width={56} 
                          height={56} 
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <h1 className='text-lg font-semibold'>{user.username}</h1>
                        <p className='text-sm text-gray-400'>{user.firstname}</p>
                      </div>
                    </li>
                  ))}
                </>
              ) : (
                <div className='flex justify-center items-center h-48'>
                  <div className='flex flex-col items-center'>
                    <h1 className='text-yellow-600 font-semibold text-xl mb-2'>
                      No users found
                    </h1>
                    <p className="text-gray-400 text-center">
                      We couldn't find any users matching "{search}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='flex justify-center items-center h-64'>
            <div className='flex flex-col items-center text-center'>
              <div className="bg-gray-800 rounded-full p-6 mb-6">
                <div className="text-yellow-600 text-5xl">🔍</div>
              </div>
              <h1 className='text-yellow-600 font-semibold text-xl mb-2'>
                Search For Others You Want To Know..?
              </h1>
              <p className="text-gray-400 max-w-md">
                Enter a username above to discover and connect with other users
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;