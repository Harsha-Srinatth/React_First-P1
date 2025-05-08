import React from 'react';
import { useLocation , useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import api from '../services/api'

const ShowFollowing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId } = location.state?.userId;

    const [following , setFollowing ] = useState([]);

    useEffect(() => {
        if(!userId){
            console.warn("No user ID in location state " );
            navigate("/login");
        }
        const fetchData = async() => {
            const res = api.get(`/following-list/${userId}`);
            setFollowing(res.data.following);
        };
        fetchData();
    },[userId])

    return(
        <div>
            <div className='text-white'>
               <h1 className='text-white font-semibold'>
                     Your Following List..!
                </h1> 
            
            {following.map((user)=> {
                <li key={user._id} >
                <div className='flex flex-row gap-3 text-white'>
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