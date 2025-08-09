import React, { useEffect, useState } from 'react';
import { SidebarLinks } from '../constance/Links';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Cookies from 'js-cookie';
import { FaCog, FaInfoCircle, FaUserPlus, FaEdit, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  // Separate states
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(pathname);
  const [isTabLoading, setIsTabLoading] = useState(false);
  
  const handleLogout = () => {
    try {
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('userid');
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
          setFullname(userInfo.fullname || 'Guest');
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

  return (
    <div className="h-full flex flex-col w-64 bg-zinc-950">
      {/* Header Section */}
      <div className="flex-shrink-0 p-3 mt-2">
        <div className="flex justify-center text-black items-center">
          <Link to="/" className='bg-white font-semibold rounded-lg text-sm px-3 py-1.5 sadow-xl hover:shadow-2xl transition-all duration-300'>
            Welcome {username} !
          </Link>
        </div>
      </div>

      {/* Navigation Section - Takes remaining space */}
      <nav className="flex-1 px-4 mt-10 ">
        <ul className="space-y-3">
          {SidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.route}>
                <NavLink
                  to={link.route}
                  onClick={() => {
                    if (activeTab !== link.route) {
                      setIsTabLoading(true);
                      setActiveTab(link.route);
                      setTimeout(() => setIsTabLoading(false), 500);
                    }
                  }}
                  className={`relative flex items-center p-3 rounded-xl transition-all duration-300 group 
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30' 
                      : 'hover:bg-neutral-800/80 hover:shadow-md hover:shadow-blue-500/20'}`}
                >
                  <div className="relative">
                    <img
                      src={link.imageURL}
                      alt={link.label}
                      className={`w-6 h-6 mr-3 transition-all duration-300 
                        ${isActive ? 'filter brightness-0 invert scale-110' : 'group-hover:scale-110'}
                        ${isTabLoading && activeTab === link.route ? 'animate-pulse' : ''}`}
                    />
                    {isTabLoading && activeTab === link.route && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <span className={`text-base font-medium text-white transition-all duration-300
                    ${isActive ? 'font-semibold' : ''}
                    ${isTabLoading && activeTab === link.route ? 'opacity-70' : ''}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-400 rounded-l animate-pulse"></span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 space-y-3">
        {/* Profile Section */}
        <Link to="/upload-profile-img" className="flex items-center group p-3 rounded-lg hover:bg-neutral-800 bg-black space-x-3 border border-neutral-700 shadow-lg">
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-neutral-700 animate-pulse mr-3"></div>
          ) : (
            <>
              <div className="relative">
                {image ? (
                  <img
                    src={ `https://backend-folder-hdib.onrender.com/uploads/${image}`}
                    alt={fullname[0]}
                    className="rounded-full w-10 h-10 border-2 border-transparent group-hover:border-blue-400 object-cover transition-all duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                      <div className="rounded-full w-10 h-10 border-2 border-transparent group-hover:border-blue-400 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-black font-bold text-lg transition-all duration-300">
                    {fullname[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <Link to="/user/profile" className="flex flex-col">
                <h1 className="text-sm font-semibold text-white truncate">{fullname}</h1>
                <p className="text-xs text-gray-300 truncate">@{username}</p>
              </Link>
            </>
          )}
        </Link>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className='flex flex-row items-center justify-center gap-2'>
            <Link to="/upload-profile-img"
              className="group flex items-center gap-2 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-blue-700 hover:bg-opacity-20 transition-all duration-300 flex-1 justify-center"
            >
              <FaUserPlus className="text-sm" />
              <span className="text-xs font-medium">Add Profile</span>
            </Link>
            <Link to="/user/edit/profile"
              className="group flex items-center gap-2 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-blue-700 hover:bg-opacity-20 transition-all duration-300 flex-1 justify-center"
            >
              <FaEdit className="text-sm" />
              <span className="text-xs font-medium">Update Details</span>
            </Link>
          </div>
          
          <div className='flex flex-row items-center justify-center gap-2'>
            <Link to="/settings"
              className="group flex gap-2 items-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-blue-700 hover:bg-opacity-20 transition-all duration-300 flex-1 justify-center"
            >
              <FaCog className="text-sm" />
              <span className="text-xs font-medium">Settings</span>
            </Link>
            <Link to="/about"
              className="group flex items-center gap-2 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-blue-700 hover:bg-opacity-20 transition-all duration-300 flex-1 justify-center"
            >
              <FaInfoCircle className="text-sm" />
              <span className="text-xs font-medium">About</span>
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="group flex items-center p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-red-500 hover:bg-opacity-20 transition-all duration-300 w-full justify-center shadow-lg border border-red-500/20 hover:border-red-500/40"
          title="Logout"
        >
          <FaSignOutAlt className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;