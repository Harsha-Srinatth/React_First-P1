import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Cookies from 'js-cookie';   
import api from '../services/api';
import { FaUserPlus, FaCog, FaInfoCircle, FaSignOutAlt, FaEdit } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [image,setImage] = useState('')
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fullname ,setFullname] = useState('')
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


  // Handle dropdown menu toggle
  const handleClick = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle('hidden');
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          !event.target.closest('button[aria-label="Toggle menu"]')) {
        dropdownRef.current.classList.add('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await api.get('/all-Details/C-U', {
          headers: {
             Authorization: `Bearer ${token}`
          }
        });
        const userInfo = res.data?._doc;
        const profileImg = res.data?.image;

        if (userInfo) {
          setFullname(userInfo.fullname || 'guest');
          setUsername(userInfo.username || 'guest');
          setImage(profileImg);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <header className="px-4 py-3 bg-zinc-950 text-white">
        <div className="flex items-center justify-center h-16">
          <span>Loading...</span>
        </div>
      </header>
    );
  }

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== "undefined" && typeof Cookies !== "undefined") {
        Cookies.remove('token');
        Cookies.remove('user');
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 px-4 py-3 bg-zinc-950 text-white z-50 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 ml-2">
          
          {/* Logo/Username section */}
          <Link to='/user/profile' className="flex items-center cursor-pointer">
            {image ? (
              <img
                src={image}
                width={36}
                height={36}
                alt="User icon"
                className="invert rounded-full object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-300 text-black font-bold text-lg"
                aria-label="Profile initial"
                title={fullname ? fullname : 'Guest'}
              >
                {fullname ? fullname[0] : 'G'}
              </div>
            )}
            <span className="ml-3 text-lg font-bold text-white truncate max-w-[200px]">
              {windowWidth > 500
                ? `Welcome ${username ? username : 'Guest'}!`
                : username ? username : 'Guest'}
            </span>
          </Link>
        </div>

        {/* Dropdown Menu */}
        <div className="relative inline-block text-left">
          <button 
            className="p-2 rounded-full hover:bg-zinc-800 transition-all duration-200 hover:scale-105"
            onClick={handleClick}
            aria-label="Toggle menu"
          >
            <Menu size={20} className="text-white hover:text-blue-400 transition-colors duration-200" />
          </button>
          
          <div 
            ref={dropdownRef}
            className="hidden absolute right-0 mt-3 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 font-semibold backdrop-blur-sm"
          >
            <div className="py-2">
              <Link 
                to='/upload-profile-img' 
                className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-200 group"
              >
                <FaUserPlus className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Add Profile</span>
              </Link>
              
              <div className="border-t border-zinc-700 my-1"></div>
              
              <Link 
                to='/user/edit/profile' 
                className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-200 group"
              >
                <FaEdit className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Update Details</span>
              </Link>
              
              <div className="border-t border-zinc-700 my-1"></div>
              
              <Link 
                to='/settings' 
                className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-200 group"
              >
                <FaCog className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Settings</span>
              </Link>
              
              <div className="border-t border-zinc-700 my-1"></div>
              
              <Link 
                to='/about' 
                className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-200 group"
              >
                <FaInfoCircle className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">About</span>
              </Link>
              
              <div className="border-t border-zinc-700 my-1"></div>
              
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 hover:text-white transition-all duration-200 group"
              >
                <FaSignOutAlt className="text-lg group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;