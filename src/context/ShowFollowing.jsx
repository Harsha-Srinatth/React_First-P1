import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';

const ShowFollowing = () => {
    const location = useLocation();
    const { userId } = location.state || {};

    const [following , setFollowing ] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const res = api.get(`/following-list/${userId}`);
            setFollowing(res.data.following);
        };
        fetchData();
    },[userId])

    return(
        <div>
            <div>
               <h1>
                     Your Following List..!
                </h1> 
            
            {following.map((user)=> {
                <li key={user._id} >
                <div className='flex flex-row gap-3'>
                  <img src={ `https://backend-folder-hdib.onrender.com/uploads/${user.image}` } className='flex flex-row bg-yellow-600 rounded-full' alt='' width={56} height={56} />
                  <div className='flex flex-col gap-2'>
                    <h1 className='text-lg text-2rem font-semibold '>{user.username}</h1>
                    <p className='text-sm text-3rem'>{user.firstname}</p>
                  </div>
                </div>
              </li>
            })}
            </div>
        </div>
    )
};

export default ShowFollowing;