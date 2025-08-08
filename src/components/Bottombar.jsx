import React from 'react';
import { BottombarLinks } from '../constance/Links';
import { Link, useLocation } from 'react-router-dom';

const Bottombar = () => {
  const location = useLocation();
  const { pathname } = location;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 text-white flex justify-around bg-gray-900 px-2 py-2 rounded-t-xl shadow-lg border-t border-gray-800 z-50">
      <div className="w-full flex justify-around items-center">
        {BottombarLinks.map((link) => {
          const isActive = pathname === link.route;
          
          return (
            <Link
              key={link.label}
              to={link.route}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 
                rounded-lg transition-all duration-200 
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}
              `}
            >
              <div className={`
                flex items-center justify-center 
                ${isActive ? 'text-white' : 'text-gray-400'}
              `}>
                <img 
                  src={link.imageURL}
                  alt=""
                  width={isActive ? 22 : 20}
                  height={isActive ? 22 : 20}
                  className={`
                    transition-all duration-200
                    ${isActive ? 'invert opacity-100' : 'opacity-70'}
                  `}
                />
              </div>
              
              <p className={`
                text-xs font-medium transition-all duration-200
                ${isActive ? 'text-white' : 'text-gray-400'}
              `}>
                {link.label}
              </p>
            </Link>
          );
        })}
      </div>
      
      {/* Center Button (Optional) */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <Link 
          to="/create-post" 
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg shadow-blue-500/30 border-4 border-gray-900 hover:scale-110 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Bottombar;