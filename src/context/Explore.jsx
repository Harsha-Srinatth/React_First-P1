import React, { useEffect, useState } from 'react';

// Note: In your actual implementation, uncomment the following lines:
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Note: In your actual implementation, use this instead:
  // const navigate = useNavigate();
  const navigate = useNavigate();
  
  
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search?.trim()) {
        setIsLoading(true);
        await api.get(`/explore/search?username=${search}`, 
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`
            }
          }
        )
          .then(response => {
            setUsers(response.data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error when finding for users", error);
            setIsLoading(false);
          });
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
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 min-h-screen w-full p-4 md:p-8 font-sans pt-20 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-extrabold text-4xl md:text-3xl text-center mb-8 text-blue-400 tracking-wide drop-shadow-sm" style={{letterSpacing: '0.02em'}}>Users List</h1>
        <div className="w-full mx-auto mb-8">
          <div className="relative">
            <input 
              type='text' 
              value={search} 
              className='w-full p-4 pl-14 rounded-2xl bg-slate-800 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all shadow-md font-medium text-lg placeholder-gray-400 border-0' 
              placeholder='Search by username...' 
              onChange={(e) => setSearch(e.target.value)} 
              style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.18)', fontFamily: 'inherit' }}
            />
            <svg 
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-400" 
              width="24" 
              height="24" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mt-8">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {search ? (
          <div className='p-2'>
            <div className='flex flex-col gap-5'>
              {users.length > 0 ? (
                <>
                  <div className="text-blue-300 text-base mb-2 font-semibold">
                    {users.length} {users.length === 1 ? 'result' : 'results'} found
                  </div>
                  {users.map((user, idx) => {
                    const isLast = idx === users.length - 1;
                    return (
                      <li 
                        key={user.userid} 
                        onClick={() => goToProfile(user.userid)}
                        className={`bg-gradient-to-br from-slate-800 via-gray-900 to-gray-800 rounded-2xl p-5 flex items-center gap-6 cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.03] group ${!isLast ? 'mb-4' : ''}`}
                        style={{ minHeight: 90, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
                      >
                        <div className="relative">
                          {user.image?.imageUrl ? (
                            <img 
                              src={`https://backend-folder-hdib.onrender.com/uploads/${user.image?.imageUrl || 'https://via.placeholder.com/56'}`} 
                              className="rounded-full bg-slate-700 group-hover:ring-2 group-hover:ring-blue-400 transition-all shadow-inner border-0"
                              alt={user.fullname || user.username}
                              width={68} 
                              height={68} 
                              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18) inset' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/56';
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-full bg-gradient-to-br from-slate-700 via-gray-800 to-gray-900 flex items-center justify-center text-blue-200 font-bold text-2xl group-hover:ring-2 group-hover:ring-blue-400 transition-all shadow-inner border-0"
                              style={{ width: 68, height: 68, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.18) inset' }}
                            >
                              {(user.fullname?.[0] || user.username?.[0] || '?').toUpperCase()}
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 w-5 h-5 bg-cyan-400 rounded-full border-2 border-gray-900 shadow-[0_0_6px_2px_rgba(34,211,238,0.25)]"></div>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <h1 className='text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-wide' style={{letterSpacing: '0.01em'}}>{user.username}</h1>
                          <p className='text-base text-gray-300'>{user.fullname}</p>
                        </div>
                      </li>
                    );
                  })}
                </>
              ) : (
                <div className='flex justify-center items-center h-48'>
                  <div className='flex flex-col items-center'>
                    <h1 className='text-blue-400 font-bold text-2xl mb-2'>
                      No users found
                    </h1>
                    <p className="text-gray-400 text-center text-lg">
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
              <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-full p-8 mb-6 shadow-lg">
                <svg className="text-blue-400 w-14 h-14" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-3xl text-white font-extrabold mb-2">
                Find Your Network
              </h2>
              <p className="text-gray-300 text-center max-w-md text-lg">
                Enter a username above to discover and connect with other users on the platform.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;