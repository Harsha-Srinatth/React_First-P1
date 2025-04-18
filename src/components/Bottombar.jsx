import React from 'react';
import { BottombarLinks } from '../constance/Links'
import { Link ,useLocation } from 'react-router-dom'
const Bottombar = ()=> {
         const location = useLocation();
         const {pathname} = location;

    return (
     
        <div className='md:hidden fixed bottom-0 left-0 w-full text-white flex justify-around bg-gray-950 p-2'>
            {BottombarLinks.map((link)=>{
                const isActive = pathname === link.route;
                    return(
                        < >
                        <div className='rounded-xl h-15 text-white '>

                        <Link to={link.route}
                             key= {link.label}
                            className={`${isActive && "bg-blue-400 rounded-[10px]"} flex flex-col gap-1 p-2 transition`} >
                                <img src={link.imageURL}
                                // alt={link.label} 
                                width ={16}
                                height={16}
                                className={`${isActive && "invert-white"}`} />
                                <p className='text-light-2 tiny-medium'>{link.label}</p>
                            </Link>

                        </div>
                            
                          
                          
                           
                            </> 
                        )
                    })}
        
        </div>

     
       
       
       
    )
};
export default Bottombar;