import React from 'react';
import {useState } from 'react';
import api from '../services/api';
import imageCompression from 'browser-image-compression';

const AddProfile = () => {
     const [profile,setProfile] = useState('');
        
            const UploadProfile  = (e) => {
                setProfile(e.target.files[0]);
            }
             // Compression options
            const options = {
                maxSizeMB: 1,              // Max file size in MB (smaller than your 2MB requirement)
                maxWidthOrHeight: 800,     // Resize large images (maintains aspect ratio)
                useWebWorker: true,        // Use web worker for better UI performance
                fileType: profile.type   // Maintain the original file type
            };
    
        
             const handleProfileSubmit = async (e) => {
                e.preventDefault();
                 const compressedFile = await imageCompression(profile , options);
                 console.log('Compressed image size:', compressedFile.size / 1024 / 1024, 'MB');
                const formdata = new FormData();
                formdata.append("profilePhoto",compressedFile );
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
                    const result = await response.json();
    
                    if (response.ok) {
                    console.log('Upload successful:', result);
                    // Update UI or notify user
                    } else {
                    console.error('Upload failed:', result);
                    // Show error to user
                    }
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
                    name="profilePhoto"
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