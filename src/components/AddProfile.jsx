import React from 'react';
import {useState } from 'react';
import api from '../services/api'

const AddProfile = () => {
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
        

    return(
        <div>
            <h1>adf profile</h1>
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
    )
};

export default AddProfile;