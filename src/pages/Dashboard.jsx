import React from 'react';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Bottombar from '../components/Bottombar'
import { Outlet } from 'react-router-dom'
const Dashboard =() =>{

  return( 
   <div className='flex h-screen flex-col md:flex-row bg-black'>
        <aside className='hidden lg:block lg:w-64 lg:relative h-full bg-gray-800'>
            <Sidebar />
        </aside>

        <div className='flex flex-1 flex-col  min-h-screen bg-black'>
              <div className=' lg:hidden p-4 bg-black'>
                  <Header/>
              </div >
            
            
              <section className ="flex flex-1 h-full overflow-y-scroll pb-20 p-4 mt-2">
                <Outlet />
              </section>
              <footer className='md:hidden w-full h-19'>
                <Bottombar />
              </footer>
                
        </div> 
   </div>
   
          
  
     
    );
};
export default Dashboard;