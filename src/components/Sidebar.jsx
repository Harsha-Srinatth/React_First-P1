import React, { useEffect, useState } from 'react';
import { SidebarLinks } from '../constance/Links';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  // Separate states
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await api.get('/all-Details/C-U', {
          headers: {
            Authorization:` Bearer ${token} `
          }
        });

        const userInfo = res.data?.doc;
        const profileImg = res.data?.image;

        if (userInfo) {
          setFirstname(userInfo.firstname || 'Guest');
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
    <div className="h-full flex flex-col justify-between w-64 bg-black">
      {/* Logo */}
      <div className="flex justify-center items-center mb-8 pt-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-12 h-12 text-white p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-4 px-2">
          {SidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.route}>
                <NavLink
                  to={link.route}
                  className={`relative flex items-center p-2 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'hover:bg-neutral-800'}`}
                >
                  <img
                    src={link.imageURL}
                    alt={link.label}
                    className={`w-7 h-7 mr-3 transition-all duration-300 ${isActive ? 'filter brightness-0 invert' : 'group-hover:scale-110'}`}
                  />
                  <span className="text-base font-medium text-gray-300">{link.label}</span>
                  {isActive && (
                    <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l"></span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile & Logout */}
      <div className="flex flex-col space-y-4 mt-auto mb-6 px-3">
        <Link to="/upload-profile-img" className="flex items-center group p-3 rounded-xl hover:bg-neutral-800 bg-black space-x-4">
          {isLoading ? (
            <div className="w-16 h-16 rounded-full bg-neutral-700 animate-pulse mr-3"></div>
          ) : (
            <>
              <div className="relative">
                <img
                  src={image}
                  alt="profile"
                  className="rounded-full w-16 h-16 border-2 border-transparent group-hover:border-blue-400 object-cover transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-white truncate">{firstname}</h1>
                <p className="text-sm text-gray-400 truncate">@{username}</p>
              </div>
            </>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className="group flex items-center p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-red-500 hover:bg-opacity-20 transition-all duration-300"
          title="Logout"
        >
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
          <span className="text-base">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;