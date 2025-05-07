import React from 'react';
import {useEffect, useState} from 'react';
import {SidebarLinks}  from '../constance/Links';
import { NavLink,useLocation,Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'



const Sidebar = ( ) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {pathname} = location;
    const [firstname, setFirstname] = useState('');
    const [username,setUsername] = useState('');
    const [image , setImage] = useState('');
    const handleLogout = () => {
    
        if(typeof window !== "undefined" && typeof localStorage !== "undefined"){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }else{
            console.error("localStorage is not available.");
        }
    };

    useEffect(() => {
        const Data = async() => {
            const token = localStorage.getItem('token');
            const res =  await api.get("/all-Details/C-U",{},
             {
                 headers:{
                     Authorization: `Bearer ${token}`
              }}
             );
            setUsername(res.data.username);
            setFirstname(res.data.firstname);
            setImage(res.data.image);         
        }
    Data();
    },[]);

    return(
    
        <div className='flex flex-col '>
            <div className='fixed hidden gap-5 bg-black md:flex flex-col w-64 h-screen p-4 bg-neutral-950'>
               <div className='flex flex-col '>
                    <a className="flex  items-center text-black md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-10 h-10 text-white p-2 bg-blue-500 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <span className="ml-3 text-lg text-white font-bold">Welcome {firstname? firstname:'Guest'} !</span>
                    </a>
               </div>
             
                    <div className="flex gap-4  items-center" > 
                        <Link to="/upload-profile-img">
                          <img src={ `https://backend-folder-hdib.onrender.com/uploads/${image}` } alt="profile" className='rounded-full w-10 h-10 bg-red-500 cursor-pointer'/>
                        </Link>
                     
                       <div className='flex flex-col text-white'>
                            <p className='body-bold '>
                                {firstname? firstname:'Guest'}
                            </p>
                            <p className='small-regular text-light-3 text-sm'>
                            @{username? username:'Guest'}
                            </p>
                        </div>
                    </div>
                 
                     <ul className='flex flex-col gap-3 text-lg'>
                           {SidebarLinks.map((link)=>{
                           const isActive = pathname === link.route;
                                return(
                                    <>
                                  
                                    <li key={link.label} className={`${isActive ? "bg-blue-400 text-black font-semibold" :"text-white" } hover:bg-blue-400 hover:text-white rounded-xl`}>
                                    <NavLink to={link.route}
                                    className='flex gap-3 items-center p-4 group hover:from-blue-300 hover:to-cyan-400' >
                                        <img src={link.imageURL}
                                        alt={link.label} 
                                        className='group-hover:invert w-8 h-8 '/>
                                        {link.label}
                                    </NavLink>
                                    </li>
                                    </> 
                                )
                           })}
                      
                     </ul>
                 
               <div className="text-white bg-stone-950 flex justify-center items-center ">
               <button className="items-center inline-flex  bg-gradient-to-r from-cyan-400 to-lime-400 border-0 py-1 px-2 focus:outline-none hover:from-cyan-500 hover:to-lime-300 text-black font-semibold rounded text-base mt-4 md:mt-0 " onClick={ handleLogout }>Logout
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
               </button>
         
               </div>
          
             </div> 
        </div>
        
    )
};
export default Sidebar;