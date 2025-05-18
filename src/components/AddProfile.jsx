import React from 'react';
import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const AddProfile = () => {
  const [profile, setProfile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const uploadProfile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    setProfile(file);
    setError('');
    setUploadSuccess(false);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Function to compress the image using canvas
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Calculate new dimensions to maintain aspect ratio
          let width = img.width;
          let height = img.height;
          const maxDim = 800;
          
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get compressed image as blob
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            }));
          }, file.type, 0.7); // 0.7 quality (compression level)
        };
      };
    });
  };

  const handleProfileSubmit = async () => {
    if (!profile) {
      setError('Please select an image first');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      // Compress the image
      const compressedFile = await compressImage(profile);
      console.log('Compressed image size:', compressedFile.size / 1024 / 1024, 'MB');
      
      const formData = new FormData();
      formData.append("profilePhoto", compressedFile);
      
      // Get token from localStorage (assuming you still need this)
      const token = localStorage.getItem('token');
      
      // Example fetch API usage instead of the imported api service
      const response = await  api.post('/upload-profile-img', formData, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
           "Content-Type": "multipart/form-data"
          // Note: Don't set Content-Type when using FormData, browser will set it automatically with boundary
        },
      });
      
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }
      setUploadSuccess(true);
    } catch (error) {
       setUploadSuccess(true);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 bg-gray-950 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-white mb-6">Profile Photo</h1>
      
      {/* Profile photo circle */}
      <div 
        className="relative w-40 h-40 mb-6 cursor-pointer group"
        onClick={handleProfileClick}
      >
        <div className={`w-40 h-40 rounded-full border-2 flex items-center justify-center overflow-hidden
          ${previewUrl ? 'border-blue-500' : 'border-gray-300 border-dashed'}`}
        >
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Click to select photo</p>
            </div>
          )}
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium">Change photo</span>
        </div>
      </div>

      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          name="profilePhoto"
          onChange={uploadProfile}
          accept="image/*"
          className="hidden"
        />
        
        {/* Error message */}
        {/* {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
          </div>
        )} */}
        
        {/* Success message */}
        {uploadSuccess && (
          <div className="text-green-500 text-sm mb-4 text-center">
            Profile photo uploaded successfully!
          </div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={handleProfileSubmit}
            disabled={!profile || isUploading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors
              ${!profile || isUploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              }`}
          >
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProfile;