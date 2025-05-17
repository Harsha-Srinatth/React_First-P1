import React from 'react';
import { useState, useRef, useEffect } from 'react';

const UpdateUserProfile = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
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

  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
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
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Example fetch API usage instead of the imported api service
      const response = await fetch('/upload-profile-img', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }
      
      const data = await response.json();
      console.log("Uploaded profile pic:", data);
      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!username && !firstname) {
      setError('Please fill at least one field to update');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const user = { username, firstname };
      
      // Only include fields that have values
      const userData = Object.fromEntries(
        Object.entries(user).filter(([_, value]) => value !== '')
      );

      // Example fetch API usage
      const response = await fetch('/Update/your/details', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setUploadSuccess(true);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full max-w-md mx-auto p-6 min-h-screen bg-gray-900 rounded-lg">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-purple-800 px-6 py-4">
          <h1 className="text-xl font-bold text-white text-center">Update Your Profile</h1>
        </div>

        <div className="px-6 py-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="relative w-32 h-32 mb-4 cursor-pointer group"
              onClick={handleProfileClick}
            >
              <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center overflow-hidden
                ${previewUrl ? 'border-blue-500' : 'border-gray-600 border-dashed'}`}
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
                  </div>
                )}
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">Change photo</span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">Click on the circle to select a profile picture</p>
            
            <input
              ref={fileInputRef}
              type="file"
              name="profilePhoto"
              onChange={uploadProfile}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={handleProfileSubmit}
              disabled={!profile || isUploading}
              className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors w-full
                ${!profile || isUploading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                }`}
            >
              {isUploading ? 'Uploading...' : 'Upload Profile Picture'}
            </button>
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-700 my-6"></div>
          
          {/* Form Inputs */}
          <div className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm mb-4 text-center">
                {error}
              </div>
            )}
            
            {/* Success message */}
            {uploadSuccess && (
              <div className="text-green-400 text-sm mb-4 text-center">
                Profile updated successfully!
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="New Username" 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-300 text-sm font-medium">Name</label>
              <input 
                type="text" 
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)} 
                placeholder="New Name" 
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
              />
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className={`w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md
                          hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 
                          transition-all duration-300 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isUploading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;