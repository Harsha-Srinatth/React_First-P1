import React, { useEffect, useState } from 'react';
import { SidebarLinks } from '../constance/Links';
import { NavLink, useLocation, Link, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  
  const [userData, setUserData] = useState({
    firstname: '',
    username: '',
    image: '/default-avatar.png' // Default image
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-blue-500 text-white shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar - Desktop (always visible) & Mobile (conditionally visible) */}
      <div 
        className={`fixed z-30 md:translate-x-0 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-neutral-950 md:relative md:flex flex-col w-64 h-screen overflow-y-auto shadow-lg`}
      >
        {/* Logo and Welcome */}
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-lg font-bold text-white">
              Welcome {userData.firstname}!
            </span>
          </div>

          {/* User Profile */}
          <div className="flex gap-4 items-center py-2">
            <Link to="/upload-profile-img" className="relative group">
              {isLoading ? (
                <div className="w-12 h-12 rounded-full bg-neutral-700 animate-pulse"></div>
              ) : (
                <img 
                  src={userData.image} 
                  alt="profile" 
                  className="rounded-full w-12 h-12 border-2 border-transparent group-hover:border-blue-400 transition-all duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </Link>
            <div className="flex flex-col text-white">
              <p className="font-semibold">
                {userData.firstname}
              </p>
              <p className="text-sm text-gray-400">
                @{userData.username}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 flex-grow">
          <ul className="space-y-1">
            {SidebarLinks.map((link) => {
              const isActive = pathname === link.route;
              return (
                <li key={link.route}>
                  <NavLink 
                    to={link.route}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
                      ${isActive 
                        ? 'bg-blue-500 text-white font-semibold' 
                        : 'text-gray-300 hover:bg-blue-400 hover:text-white'}`
                    }
                  >
                    <img 
                      src={link.imageURL}
                      alt=""
                      className={`w-6 h-6 ${isActive ? 'invert' : 'group-hover:invert'}`} 
                    />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-neutral-800">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 py-2.5 px-4 rounded-lg text-white font-medium hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 shadow-md"
          >
            Logout
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="p-6 h-screen overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
};

export default Sidebar;