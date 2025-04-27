import React from 'react';
import { useState ,useEffect} from 'react';
import api from '../services/api';
const UpdateUserProfile = () => {
    const [username,setUsername] = useState('');
    const [firstname,setFirstname] = useState('');
    const user = {username , firstname};
    const token = localStorage.getItem('token');
    const [profile,setProfile] = useState('');
    
        const UploadProfile  = (e) => {
            setProfile(e.target.files[0]);
        }
    
         const handleProfileSubmit = async (e) => {
            e.preventDefault();
            const formdata = new FormData();
            formdata.append("profilePhoto",profile);
            try{
                const token = localStorage.getItem('token');
                const { data } = await api.post("/upload-profile-img",
                formdata,
             {
             headers:{
                 Authorization: `Bearer ${token}`,
                 "Content-Type": "multipart/form-data"
              }},
           );
           console.log("Token being sent", `Bearer ${token}`)
           console.log("Uploaded profile pic : ",data);
            }catch(error){
             console.error(error);
        }
        };
    
        const handleSubmit = async(e) => {
        e.preventDefault();
        await api.put('/Update/your/details', user,{
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        console.log(user)
        alert('User upadated..!');
    }


    return(
        <div className='flex w-full justify-center'>
            <div className='flex flex-center items-center'>
                <div className='flex gap-4'>
                    <div className='flex border-1 rounded-lg focus-ring bg-stone-950 shadow-xl px-6 py-8'>
                        <form className='flex gap-4 flex-col w-full' onSubmit={handleSubmit}>
                            <div className='flex flex-col justify-center items-center gap-3'>
                                <label className='text-white text-center'>Change Your Profile Pic..!</label>
                                <img 
                                src= "../imges/circle-user-solid.svg "
                                width={86}
                                height={86}
                                alt='profile'
                                className='invert rounded-full'/>
                                {/* <button className='text-white text-lg focus-ring bg-blue-700 rounded-lg px-2'>
                                    Edit
                                </button> */}
                                <form onSubmit={handleProfileSubmit} action="/upload-profile-img" method="POST">
                                    <input 
                                    type='file'
                                    placeholder='Upload Here..!'
                                    onChange={UploadProfile}
                                    accept='profilePhoto/*'
                                    className='text-white font-semibold  bg-gradient-to-r from-stone-500 to-gray-950 border-0
                                        focus:outline-none rounded p-1 mt-4 cursor-pointer '
                                    />
                                    <button className='text-white bg-blue-650' type='submit'>
                                        Upload Your Image
                                    </button>

                                 </form>
                            </div>

                            <div className='mt-3 md:text-lg'>
                                <label className='text-white text-semibold text-start mt-3'>Change Your UserName</label>
                                <input type='text' name='username'  onChange={(e) => setUsername(e.target.value)} className='px-2 my-3 border-1 border-white focus-ring w-full text-white rounded-sm py-1' placeholder='New Username'/>
                                <label className='text-white text-semibold my-3 text-start '>Change Your Name</label>
                                <input type='text' name='firstname'  onChange={(e) => setFirstname(e.target.value)} className='px-2 my-3 border-1 border-white focus-ring w-full text-white rounded-sm py-1' placeholder='New Name'/> 
                            </div>
                            <div className='flex justify-end m-1'>
                                <button className='text-white font-semibold px-2 py-1 rounded-lg bg-blue-600'> Submit </button>  
                            </div>    
                                              
                        </form>
                    </div>
                   
                </div>

            </div>
           
        </div>
    )
}
export default UpdateUserProfile;