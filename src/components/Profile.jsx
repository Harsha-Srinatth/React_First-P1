import React from 'react';

import {  TabLinkes } from '../constance/Tabs';
import { NavLink,useLocation,Link} from 'react-router-dom';
 


const Profile = () => {
     const location = useLocation();
     const { pathname } = location;
    
    return(
        <div className='flex flex-col h-screen w-full'>
            <div className='flex flex-row h-1/2 w-full items-center p-4 bg-gray-500'>
                <div className='flex flex-shrink-0 bg-stone-200 w-1/3 justify-center'>
                    <img 
                        className='rounded-full bg-yellow-600'
                        width={150}
                        height={150}
                        src='../imges/circle-user-solid.svg'
                        alt='userProfile'/>

                </div>
                   
                <div className='flex flex-col ml-8 bg-gray-950 h-2/3 gap-4 flex-1 p-5'>
                    <div className='flex felx-row gap-4  '>
                         <h1 className='text-start text-2xl font-bold text-white'>User Username</h1>
                         <Link to='/user/edit/profile' className='font-3rem text-white  cursor-pointer'>
                            Edit Profile
                         </Link>
                    </div>
                   
                    <div className='flex flex-row gap-2 text-white text-lg font-6rem'>
                        <span>0</span>
                        <p>Posts</p>
                        <span>0</span>
                        <p>follwers</p>
                        <span>0</span>
                        <p>following</p>
                    </div>
                    
                    <p className='text-white text-lg'>  User first name</p>
                    <div className='flex flex-row text-white text-md'>
                        <p>
                            Bio .
                            jahqfol
                            dnjxhvli
                        </p>
                    </div>
                </div>
            </div>

           <div className='flex bg-gray-700 w-full justify-center border-t border-gray-300'>
                <div className='flex space-x-10 text-sm text-gray-500 p-2'>
                    { TabLinkes.map((tab) => {
                       const isActive = pathname === tab.route;
                         return(

                            <li key={tab.label} className={`${isActive ? "bg-blue-400 text-black font-semibold" :"text-white" } hover:bg-blue-400 hover:text-white rounded-xl`}>
                                <NavLink to={tab.route}
                                 className='flex gap-3 items-center' >
                                    <img src={tab.imageURL}
                                    alt={tab.label} 
                                    className='group-hover:invert w-5 h-5'/>
                                    <p className='text-white font-semibold '> {tab.label}</p>
                                </NavLink>
                            </li>
                        )
                    })}
                </div>
            </div>
        </div>
    
    )
}

export default Profile;