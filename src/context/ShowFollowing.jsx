import React from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import api from '../services/api'

const ShowFollowing = () => {

    const navigate = useNavigate();
    const { userId } = useParams();
    console.log(userId,"user Id from params");

    const [following , setFollowing ] = useState([]);
    const [loading ,setLoading] = useState('');

    useEffect(() => {
        setLoading(true);
        if(!userId){
            console.warn("No user ID in location state " );
            navigate("/login");
            return;
        }
        const fetchData = async() => {
            try{
                const res = await api.get(`/following-list/${userId}`);
                console.log("Api responce object :", res);
                console.log("Full Api responce:" , res.data);
                if(res && res.data){
                     if(Array.isArray(res.data)){
                    setFollowing(res.data);
                        console.log("setting following data from aray responce ",res.data)
                    }else if( res.data.following && Array.isArray(res.data.following)){
                        setFollowing(res.data.following);
                        console.log("setting following data from res.data.following",res.data.following)
                    }else{
                        console.warn("Following data is not an Array:",res.data);
                        setFollowing([]);
                    }
                }else{
                    console.log("No data in rwsponce");
                    setFollowing([]);
                }
                 
            }catch(error){
                console.error(error);
                setFollowing([]);
            }finally{
                setLoading(false);
            }
           
        };
        fetchData();
    },[userId, navigate]);

    if(loading) {
        return (
        <div className="flex items-center justify-center h-full w-full p-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
        );
    }
    return(
    <div className='text-white w-full' action="/explore">

      <h1 className='flex flex-center font-bold text-3xl md:text-xl'>Following List</h1>
      <div className='flex flex-col'>
        {/* <input type='text' value={search} className='w-full p-2 mt-1' placeholder='Search For Others You Want To Know..?' onChange={(e) => setSearch(e.target.value)} /> */}
        {following && following.length > 0 ? (
          <div className='flex flex-start p-5'>
            <div className='flex flex-col gap-4 '>
              {following.map(user => (
                <li key={user._id} >
                  <div className='flex flex-row gap-3'>
                    <img src={ user.image } className='flex flex-row bg-yellow-600 rounded-full' alt='' width={56} height={56} />
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
                No Following users
              </h1>
            </div>

          </div>
        )

        }


      </div>
    </div>
    )
};

export default ShowFollowing;