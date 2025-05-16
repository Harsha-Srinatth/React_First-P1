import React from 'react';
import { useState } from 'react';
import api from '../services/api';

const Create = () => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("location", location);
    formdata.append("tags", tags);
    if (image) {
      formdata.append("image", image);
    }
    
    try {
      const token = localStorage.getItem('token');
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
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col flex-1 p-2 md:p-4 gap-3 overflow-hidden min-h-screen max-w-6xl mx-auto'>
      <div className='rounded-lg bg-stone-950 flex text-white w-full p-4 items-center justify-center gap-3'>
        <img
          src="../imges/image-solid.svg"
          className='invert'
          width={36}
          height={36}
          alt="create" />
        <h2 className="text-center text-xl md:text-3xl font-bold">Create Post</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full space-y-6 mt-4">
        <div className='flex flex-col w-full'>
          <div className='flex flex-col text-white gap-3 w-full'>
            <label className='font-semibold lg:text-xl'>Caption</label>
            <textarea
              type="text"
              name='caption'
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder='Enter the Caption'
              className='w-full min-h-24 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500'
            />
          </div>
        </div>

        <div className='w-full'>
          <div className='flex flex-col text-white'>
            <div className='flex flex-col text-white gap-3 w-full'>
              <label className='font-semibold lg:text-xl'>Add Photos and Videos</label>
              <div className='flex flex-col items-center bg-gray-800 rounded-lg p-6 border border-gray-700'>
                {imagePreview ? (
                  <div className="flex flex-col items-center space-y-4 w-full">
                    <div className="relative w-full max-w-md">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto max-h-64 object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-300">{image?.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col items-center text-center gap-4 py-8'>
                    <img
                      src='../imges/file-arrow-up-solid.svg'
                      alt='photos'
                      width={30}
                      height={30}
                      className='invert' />
                    <h1 className='text-white font-semibold'>
                      Upload photos and Videos Here...
                    </h1>
                    <p className='text-gray-400 text-sm'>
                      Drag And Drop Here your Photos
                    </p>
                    <input
                      type='file'
                      placeholder='Upload Here..!'
                      onChange={UploadImage}
                      accept='image/*'
                      className='text-white font-semibold bg-gradient-to-r from-stone-500 to-gray-950 border-0
                      focus:outline-none rounded p-2 mt-2 cursor-pointer w-full max-w-xs'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div className='flex flex-col text-white gap-3 w-full'>
            <label className='font-semibold lg:text-lg'>Add Location</label>
            <input
              type="text"
              name='location'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='Add Your Location'
              className='w-full h-12 px-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500'
            />
          </div>
        </div>

        <div className='flex flex-col w-full'>
          <div className='flex flex-col text-white gap-3 w-full'>
            <label className='flex font-semibold lg:text-lg'>Add Tags (#Java, #React)</label>
            <input
              type="text"
              name='tags'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder='Add Tags like #JavaScript, #ReactJS'
              className='w-full h-12 px-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500'
            />
          </div>
        </div>

        <div className='text-white font-bold flex flex-row justify-end items-center gap-3 h-20 py-4'>
          <button
            type="button"
            onClick={clearForm}
            className="text-white font-semibold bg-gradient-to-r from-stone-600 to-gray-950 border-0 py-2 px-6 hover:from-stone-700 hover:to-black
              focus:outline-none rounded text-base cursor-pointer"
          >
            Clear
          </button>
          <button
            type='submit'
            disabled={isSubmitting || !image}
            className={`text-white font-semibold py-2 px-6 rounded text-base
              ${isSubmitting || !image
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer'
              }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;