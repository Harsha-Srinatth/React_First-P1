import React from 'react';
import {useEffect, useState} from 'react'
import {useNavigate , Link} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import { useRef } from 'react';
const Header =() =>{
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  useEffect(() => {
   const token = localStorage.getItem('token');
   if(token){
     const decoded = jwtDecode(token);
     setUsername(decoded.username);
   }
},[]);
      const dropdownRef = useRef(null);
      const handleClick = () => {
        dropdownRef.current.classList.toggle('hidden');
      }
   
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
 
    <div className='' >     
        <header className="text-gray-600 bg-zinc-950 text-center">
          <div className="flex flex-wrap  items-center md:flex-row justify-between">
            <Link to='/user/profile' className="flex items-center md:mb-0 cursor-pointer">
              <img src='../imges/circle-user-solid.svg'
              width={36}
              height={36}
              className='invert' />
              <span className="ml-3 text-lg text-white font-bold">Welcome {username? username:'Guest'} !</span>
            </Link>
            <div className='relative inline-block text-left'>
                <button className="text-base md:mt-0 cursor-pointer mr-2 rounded-full" onClick={handleClick }>
                  <img 
                  src='../imges/ellipsis-vertical-solid.svg'
                  className='invert '
                  width={7}
                  height={5}
                  />
                </button>

                <div ref={dropdownRef} 
                   className='hidden absolute right-0 mt-2 w-40 bg-black border rounded-lg shadow-lg z-50 font-semibold'>
                  <a href='' className='block px-4 py-2 text-sm text-white'>Settings</a>
                  <a href='' className='block px-4 py-2 text-sm text-white'>About</a>
                  <a onClick={handleLogout} className='block px-4 py-2 text-sm text-white cursor-pointer'>Logout</a>
               </div>
         
            </div>
          
          </div>
        </header>
      
    </div> 
  
    );
};
export default Header;