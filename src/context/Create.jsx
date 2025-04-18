import React from 'react';
//import PostForm from '../pages/PostForm';
import { useState } from 'react';
import api from '../services/api';

const Create = () =>{

  const [caption , setCaption] = useState('');
  const [location ,setLocation] = useState('');
  const [tags,setTags] = useState('');
  const [image,setImage] = useState(null);
  const UploadImage = (e) => {
     setImage(e.target.files[0]);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("caption",caption); 
    formdata.append("location",location);
    formdata.append("tags",tags);
    formdata.append("image",image);
    try{
    const token = localStorage.getItem('token');
    console.log(token)
    const { data } = await api.post("/create-post",
     formdata,
     {
     headers:{
         Authorization: `Bearer ${token}`,
         "Content-Type": "multipart/form-data"
      }},
   );
   console.log("Token being sent", `Bearer ${token}`)
   console.log("post created : ",data);
    }catch(error){
     console.error(error);
    }
};
    return(
    <div className='flex flex-col flex-1 p-2 gap-3 overflow-autoflex min-h-screen'>
        <div className=' rounded-lg bg-stone-950 flex text-white w-full p-4 lg:items-center lg:justify-center'>
             <img 
                src=""
                width={36}
                height={36}
                alt="create" />
             <h2 className="text-center text-xl md:text-3xl font-bold ">Create Post</h2>
         </div> 
          <form onSubmit={handleSubmit} action="/create-post" method="POST">
            
            <div className='flex flex-col w-full'>

              <div className='flex flex-col text-white gap-8 w-full max-w-5xl'>
                  <label className='mt-3 font-semibold lg:text-xl'>Caption</label>
                  <textarea type="text" 
                  name='caption'
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder='Enter the Caption' className=' w-full h-30 items-center flex justify-center cursor-pointer'/>
              </div>
            </div>
          
          <div className='w-full mt-4'>
            <div className='flex flex-col text-white'>
             <div className='flex flex-col text-white gap-8 w-full max-w-5xl'>
                <label className='mt-3 font-semibold lg:text-xl'>Add Photos and Videos</label>
                <div className='flex flex-col items-center text-black gap-4'>
                   <img src='' alt='photos' 
                   width={36}
                   height={36}
                   className='' />
                   <h1 className='text-white font-semibold'>
                     Upload photos and Videos Here...
                   </h1>
                   <p className='text-stone-800 text-sm'>
                     Drag And Drop Here your Photos
                   </p>
                   <input 
                   type='file'
                   onChange={UploadImage}
                   accept='image/*'
                   className='text-white text-xl font-semibold  bg-gradient-to-r from-stone-500 to-gray-950 border-0 py-1 px-4  hover:from-stone-600 hover:to-black
                      focus:outline-none rounded text-base mt-4 md:mt-0 cursor-pointer'
                    />
                </div> 
           </div>
        </div>
           </div>

           <div className='flex flex-col w-full'>
              <div className='flex flex-col text-white gap-8 w-full max-w-5xl'>
                  <label className='mt-3 font-semibold lg:text-lg'>Add Location</label>
                  <input type="text"
                   name='location'
                   value={location}
                   onChange={(e) => setLocation(e.target.value)}
                   placeholder='Add Your Location' className=' w-full h-10 pl-3 flex items-center justify-center cursor-pointer'/>
              </div>
            </div>

            <div className='flex flex-col w-full'>
              <div className='flex flex-col text-white gap-8 w-full max-w-5xl'>
                  <label className='mt-3 flex  font-semibold lg:text-lg'>Add Tags (#Java , #React)</label>
                  <input type="text" 
                  name='tags'
                  value = {tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder='Add Your Location' className=' w-full h-10 pl-3 flex items-center justify-center cursor-pointer'/>
              </div>
            </div>
            <div className='text-white font-bold flex flex-row position-end justify-end items-center gap-5 h-20 p-5'>
              <button className="text-white text-xl font-semibold  bg-gradient-to-r from-stone-500 to-gray-950 border-0 py-1 px-4  hover:from-stone-600 hover:to-black
                focus:outline-none rounded text-base mt-4 md:mt-0 cursor-pointer" >
                Clear
              </button>
              <button type='submit' className="text-white text-xl font-semibold  bg-gradient-to-r from-purple-500 to-blue-500 border-0 py-1 px-4  hover:from-purple-600 hover: to-blue-600
                focus:outline-none focus:ring focus:ring-purple-300
                rounded text-base mt-4 md:mt-0 cursor-pointer" >
                Submit
              </button>
            </div>
          </form>
    </div>
    )
}
export default Create;