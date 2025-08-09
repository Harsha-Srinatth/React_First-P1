import React from 'react';
import { useState, useRef, useEffect } from 'react';
import api from '../services/api'
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const UpdateUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    fullname: '',
    bio: ''
  });
  const [originalUserDetails, setOriginalUserDetails] = useState({
    username: '',
    fullname: '',
    bio: ''
  });

  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await api.get('/all-Details/C-U', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const profileImg = response.data?.image;
        const userInfo = response.data?._doc;
        
        const populated = {
          username: userInfo.username || '',
          fullname: userInfo.fullname || '',
          bio: userInfo.bio || ''
        };
        setUserDetails(populated);
        setOriginalUserDetails(profileImg);
        setPreviewUrl(profileImg);
      } catch (error) {
        console.error('Error fetching user image:', error);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserImage();
  }, []);

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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Check if any changes were made (image OR any text field differs from original)
    const trim = (v) => (v ?? '').trim();
    const hasTextChange =
      trim(userDetails.username) !== trim(originalUserDetails.username) ||
      trim(userDetails.fullname) !== trim(originalUserDetails.fullname) ||
      trim(userDetails.bio) !== trim(originalUserDetails.bio);

    const hasChanges = Boolean(profile) || hasTextChange;
    
    if (!hasChanges) {
      const msg = 'No changes detected. Please update at least one field.';
      setError(msg);
      Swal.fire({ icon: 'info', title: 'Nothing to update', text: msg });
      return;
    }

    // Field validations similar to Register page (only validate fields that changed)
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (trim(userDetails.username) !== trim(originalUserDetails.username)) {
      if (trim(userDetails.username) && !specialCharRegex.test(userDetails.username)) {
        const msg = 'Username must contain at least one special character.';
        setError(msg);
        Swal.fire({ icon: 'error', title: 'Invalid Username', text: msg });
        return;
      }
    }
    if (trim(userDetails.fullname) !== trim(originalUserDetails.fullname)) {
      if (trim(userDetails.fullname) && userDetails.fullname[0] !== userDetails.fullname[0]?.toUpperCase()) {
        const msg = 'Fullname must start with an uppercase letter.';
        setError(msg);
        Swal.fire({ icon: 'error', title: 'Invalid Fullname', text: msg });
        return;
      }
    }

    try {
      setIsUploading(true);
      setError('');
      
      const formData = new FormData();
      
      // Only append the image if a new one was selected
      if (profile) {
        const compressedFile = await compressImage(profile);
        formData.append("profilePhoto", compressedFile);
      }
      
      // Only append fields that have values
      if (userDetails.fullname) formData.append('fullname', userDetails.fullname);
      if (userDetails.username) formData.append('username', userDetails.username);
      if (userDetails.bio) formData.append('bio', userDetails.bio);
      
      const token = Cookies.get('token');
      const response = await api.put('/Update/your/details', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (!response || response.status < 200 || response.status >= 300) {
        const message = response?.data?.message || 'Failed to update profile';
        throw new Error(message);
      }
      
      setUploadSuccess(true);
      setError('');
      setOriginalUserDetails({
        username: trim(userDetails.username),
        fullname: trim(userDetails.fullname),
        bio: trim(userDetails.bio)
      });
      Swal.fire({ icon: 'success', title: 'Updated successfully', showConfirmButton: false, timer: 1500 });
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || error?.message || 'Failed to update profile. Please try again.';
      setError(message);
      Swal.fire({ icon: 'error', title: 'Update failed', text: message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-start justify-center p-4 md:p-6 lg:p-8 w-full overflow-y-auto pt-20 pb-24 md:pb-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
          <h1 className="text-2xl font-bold text-white text-center">Update Your Profile</h1>
          <p className="text-blue-100 text-center mt-2">Edit your personal information and profile picture</p>
        </div>

        <div className="px-6 py-8">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">Profile updated successfully!</p>
            </div>
          )}

          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="relative w-32 h-32 mb-4 cursor-pointer group"
              onClick={handleProfileClick}
            >
              <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-lg
                ${previewUrl ? 'border-blue-500' : 'border-gray-300 border-black'}`}
              >
                {previewUrl ? (
                  <img 
                    src= { previewUrl}
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
            
            <p className="text-gray-600 text-sm mb-4 text-center">Click on the circle to select a profile picture</p>
            
            <input
              ref={fileInputRef}
              type="file"
              name="profilePhoto"
              onChange={uploadProfile}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>
          
          {/* Form Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">Username</label>
              <input 
                type="text" 
                value={userDetails.username}
                onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })} 
                placeholder={isLoading ? "Loading..." : "Enter new username"} 
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                          ${isLoading ? 'cursor-wait opacity-75' : 'hover:border-gray-300'}`}
              />
              {!isLoading && userDetails.username && (
                <p className="text-xs text-gray-500 mt-1">Current username: {userDetails.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">Full Name</label>
              <input 
                type="text" 
                value={userDetails.fullname}
                onChange={(e) => setUserDetails({ ...userDetails, fullname: e.target.value })} 
                placeholder={isLoading ? "Loading..." : "Enter new name"}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                          ${isLoading ? 'cursor-wait opacity-75' : 'hover:border-gray-300'}`}
              />
              {!isLoading && userDetails.fullname && (
                <p className="text-xs text-gray-500 mt-1">Current name: {userDetails.fullname}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold">Bio</label>
              <textarea 
                value={userDetails.bio}
                onChange={(e) => setUserDetails({ ...userDetails, bio: e.target.value })} 
                placeholder={isLoading ? "Loading..." : "Tell us about yourself..."} 
                rows="4"
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200
                          ${isLoading ? 'cursor-wait opacity-75' : 'hover:border-gray-300'}`}
              />
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isUploading || isLoading}
                className={`w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg
                          hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                          transition-all duration-300 transform hover:scale-105 ${isUploading || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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