import React from 'react';
import { useState } from 'react';
import api from '../services/api';
import Cookies from 'js-cookie';
const Create = () => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const UploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const clearForm = () => {
    setCaption('');
    setLocation('');
    setTags('');
    setImage(null);
    setImagePreview(null);
    // Reset the file input by creating a reference to it
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormSuccess(false);
    
    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("location", location);
    formdata.append("tags", tags);
    if (image) {
      formdata.append("image", image);
    }
    
    try {
      const token = Cookies.get('token');
      const { data } = await api.post("/create-post",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        },
      );
      console.log("post created : ", data);
      // Clear form after successful submission
      clearForm();
      setFormSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col flex-1 p-2 md:p-4 gap-3 overflow-y-auto min-h-screen max-w-6xl mx-auto pb-20'>
      <div className='rounded-lg bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg flex text-white w-full p-4 items-center justify-center gap-3 md:sticky top-0 z-10'>
        <img
          src="../imges/image-solid.svg"
          className='invert'
          width={36}
          height={36}
          alt="create" />
        <h2 className="text-center text-xl md:text-3xl font-bold">Create Post</h2>
      </div>
      
      {formSuccess && (
        <div className="w-full bg-green-600 text-white p-4 rounded-lg shadow-md mb-4 text-center animate-pulse">
          Post created successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4">
        <div className='flex flex-col w-full'>
          <div className='flex flex-col text-white gap-3 w-full'>
            <label className='font-semibold lg:text-xl flex items-center gap-2'>
              <span className="text-purple-400">Caption</span>
              <span className="text-xs text-gray-400">(Required)</span>
            </label>
            <textarea
              type="text"
              name='caption'
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder='Enter the Caption'
              className='w-full min-h-24 p-3 rounded-lg bg-gray-800 text-white border border-indigo-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200'
            />
          </div>
        </div>

        <div className='w-full'>
          <div className='flex flex-col text-white'>
            <div className='flex flex-col text-white gap-3 w-full'>
              <label className='font-semibold lg:text-xl flex items-center gap-2'>
                <span className="text-purple-400">Add Photos and Videos</span>
                <span className="text-xs text-gray-400">(Required)</span>
              </label>
              <div className='flex flex-col items-center bg-gray-800 rounded-lg p-6 border border-indigo-900 hover:border-purple-500 transition-all duration-200 shadow-lg'>
                {imagePreview ? (
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <div className="relative w-full max-w-md">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-contain rounded-lg shadow-md"
                      />
                    </div>
                    <p className="text-sm text-purple-300">{image?.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg text-white text-sm transition-colors duration-200 shadow hover:shadow-lg"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col items-center text-center gap-4 py-8 w-full'>
                    <div className="w-16 h-16 rounded-full bg-indigo-900 flex items-center justify-center p-4 shadow-inner">
                      <img
                        src='../imges/file-arrow-up-solid.svg'
                        alt='photos'
                        width={30}
                        height={30}
                        className='invert' />
                    </div>
                    <h1 className='text-white font-semibold text-lg'>
                      Upload photos and Videos Here...
                    </h1>
                    <p className='text-gray-400 text-sm'>
                      Drag And Drop Here your Photos
                    </p>
                    <label className="mt-4 w-full max-w-xs">
                      <div className="text-center text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 rounded-lg p-3 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200">
                        Choose File
                      </div>
                      <input
                        type='file'
                        placeholder='Upload Here..!'
                        onChange={UploadImage}
                        accept='image/*'
                        className='hidden'
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div className='flex flex-col text-white gap-3 w-full'>
            <label className='font-semibold lg:text-lg flex items-center gap-2'>
              <span className="text-purple-400">Add Location</span>
              <span className="text-xs text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name='location'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder='Add Your Location'
                className='w-full h-12 pl-10 rounded-lg bg-gray-800 text-white border border-indigo-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200'
              />
              <div className="absolute left-3 top-3.5 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div className='flex flex-col text-white gap-3 w-full'>
            <label className='flex font-semibold lg:text-lg items-center gap-2'>
              <span className="text-purple-400">Add Tags</span>
              <span className="text-xs text-gray-400">(Optional - e.g. #Java, #React)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name='tags'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder='Add Tags like #JavaScript, #ReactJS'
                className='w-full h-12 pl-10 rounded-lg bg-gray-800 text-white border border-indigo-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200'
              />
              <div className="absolute left-3 top-3.5 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className='text-white font-bold flex flex-row justify-end items-center gap-4 py-6 bottom-0 bg-black bg-opacity-70 backdrop-blur-sm mt-8 p-4 rounded-lg'>
          <button
            type="button"
            onClick={clearForm}
            className="text-white font-semibold bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 active:from-gray-800 active:to-black border-0 py-3 px-6 focus:outline-none rounded-lg text-base cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
          >
            Clear All
          </button>
          <button
            type='submit'
            disabled={isSubmitting || !image || !caption.trim()}
            className={`text-white font-semibold py-3 px-8 rounded-lg text-base shadow-md hover:shadow-lg transition-all duration-200
              ${isSubmitting || !image || !caption.trim()
                ? 'bg-gray-600 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;