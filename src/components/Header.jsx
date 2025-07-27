import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Menu } from 'lucide-react';
import Cookies from 'js-cookie';              
const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const dropdownRef = useRef(null);
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

  // Get username from token
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);  
      } catch (error) {
        console.error("Invalid token:", error);
      }
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

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== "undefined" && typeof Cookies !== "undefined") {
        Cookies.remove('token');
        Cookies.remove('user');
      navigate('/login');
    }
  };

  return (
    <header className="px-4 py-3 bg-zinc-950 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu toggle button */}
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-zinc-800"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-white" />
          </button>
          
          {/* Logo/Username section */}
          <Link to='/user/profile' className="flex items-center cursor-pointer">
            <img 
              src='../imges/circle-user-solid.svg'
              width={36}
              height={36}
              alt="User icon"
              className="invert"
            />
            <span className="ml-3 text-lg font-bold text-white truncate max-w-[200px]">
              {windowWidth > 500 ? 
                `Welcome ${username ? username : 'Guest'}!` : 
                username ? username : 'Guest'}
            </span>
          </Link>
        </div>

        {/* Dropdown Menu */}
        <div className="relative inline-block text-left">
          <button 
            className="p-2 rounded-full hover:bg-zinc-800"
            onClick={handleClick}
            aria-label="Toggle menu"
          >
            <img
              src='../imges/ellipsis-vertical-solid.svg'
              className="invert"
              width={7}
              height={5}
              alt="Menu"
            />
          </button>
          
          <div 
            ref={dropdownRef}
            className="hidden absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50 font-semibold"
          >
            <div className="py-1">
              <Link 
                to='/upload-profile-img' 
                className="block px-4 py-2 text-sm text-white hover:bg-zinc-800 rounded-t-lg"
              >
                Add Profile
              </Link>
              <Link 
                to='/settings' 
                className="block px-4 py-2 text-sm text-white hover:bg-zinc-800"
              >
                Settings
              </Link>
              <Link 
                to='/about' 
                className="block px-4 py-2 text-sm text-white hover:bg-zinc-800"
              >
                About
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-zinc-800 rounded-b-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;