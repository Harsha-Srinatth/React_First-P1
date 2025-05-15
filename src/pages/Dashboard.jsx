import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Bottombar from '../components/Bottombar';

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full dark bg-black text-white">
      {/* The Sidebar component now handles its own visibility */}
      <Sidebar />
      
      {/* Main Content Container */}
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Mobile Header - only visible on mobile/tablet */}
        <div className="lg:hidden p-4 dark bg-black">
          <Header />
        </div>
        
        {/* Main Content Area */}
        <section className="flex flex-1 overflow-y-auto pb-20 p-4 mt-2 dark bg-black">
          <Outlet />
        </section>
        
        {/* Mobile Footer - only visible on mobile */}
        <footer className="md:hidden w-full h-19">
          <Bottombar />
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;