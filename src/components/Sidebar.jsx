import React, { useEffect, useState } from 'react';
import { SidebarLinks } from '../constance/Links';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  
  const [userData, setUserData] = useState({
    firstname: '',
    username: '',
    image: '/default-avatar.png'
  });
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

        const res = await api.get("/all-Details/C-U", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data?.details) {
          setUserData({
            firstname: res.data.details.firstname || 'Guest',
            username: res.data.details.username || 'guest',
            image: res.data.image || '/default-avatar.png'
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Instagram-style sidebar (optimized for your Dashboard layout)
  return (
    <div className="h-full flex flex-col justify-between">
      {/* Logo at the top */}
      <div className="flex justify-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>

      {/* Navigation Icons */}
      <nav className="flex-grow flex flex-col items-center">
        <ul className="space-y-6 w-full">
          {SidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.route} className="flex justify-center">
                <NavLink 
                  to={link.route}
                  className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 group w-12 h-12`}
                >
                  <span className={`absolute inset-0 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-transparent group-hover:bg-neutral-800'}`}></span>
                  <img 
                    src={link.imageURL}
                    alt={link.label}
                    title={link.label}
                    className={`relative w-6 h-6 transition-all duration-300 ${isActive ? 'filter brightness-0 invert' : 'group-hover:scale-110'}`} 
                  />
                  {isActive && (
                    <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l"></span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout at the bottom */}
      <div className="flex flex-col items-center space-y-5 mt-auto">
        <Link to="/upload-profile-img" className="relative group">
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-neutral-700 animate-pulse"></div>
          ) : (
            <div className="relative">
              <img 
                src={userData.image} 
                alt="profile" 
                className="rounded-full w-10 h-10 border-2 border-transparent group-hover:border-blue-400 transition-all duration-300 object-cover"
              />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
          )}
        </Link>

        <button 
          onClick={handleLogout} 
          className="group relative p-2.5 rounded-xl text-neutral-400 hover:text-white transition-all duration-300"
          title="Logout"
        >
          <span className="absolute inset-0 rounded-xl bg-transparent group-hover:bg-red-500 group-hover:bg-opacity-20 transition-all duration-300"></span>
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="relative w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;