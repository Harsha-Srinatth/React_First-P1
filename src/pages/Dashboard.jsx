import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Bottombar from '../components/Bottombar';


const Dashboard = () => {
  
  return (
    <div className={`flex h-screen flex-col md:flex-row ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
      {/* Sidebar - changes colors based on theme */}
      <aside className={`hidden lg:block lg:w-64 lg:relative h-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <Sidebar />
      </aside>
      
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Mobile Header */}
        <div className={`lg:hidden p-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <Header />
        </div>
        
        {/* Main Content Area */}
        <section className={`flex flex-1 h-full overflow-y-scroll pb-20 p-4 mt-2 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
          <Outlet />
        </section>
        
        {/* Mobile Footer */}
        <footer className="md:hidden w-full h-19">
          <Bottombar />
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;