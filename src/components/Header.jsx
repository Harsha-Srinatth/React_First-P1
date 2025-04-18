import React from 'react';
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'

const Header =() =>{
  const navigate = useNavigate();
  
  const [firstname, setFirstname] = useState('');
  useEffect(() => {
   const token = localStorage.getItem('token');
   if(token){
     const decoded = jwtDecode(token);
     setFirstname(decoded.firstname);
   }
},[]);
  
    const handleLogout = () => {
      
      if(typeof window !== "undefined" && typeof localStorage !== "undefined"){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }else{
        console.error("localStorage is not available.");
      }
    };
    return( 
 
    <div >     
        <header className="  text-gray-600 text-center">
          <div className="flex flex-wrap  items-center md:flex-row  justify-between">
            <a className="flex  items-center text-black md:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-3 text-lg font-bold">Welcome {firstname? firstname:'Guest'} !</span>
            </a>
            <button className="items-center inline-flex  bg-gradient-to-r from-cyan-400 to-lime-400 border-0 py-1 px-2 focus:outline-none hover:from-cyan-500 hover:to-lime-300 text-black font-semibold rounded text-base mt-4 md:mt-0 " onClick={handleLogout }>Logout
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
            </button>
         
          </div>
        </header>
      
    </div> 
  
    );
};
export default Header;