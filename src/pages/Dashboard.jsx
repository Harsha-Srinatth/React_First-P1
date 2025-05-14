import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Bottombar from '../components/Bottombar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen flex-col md:flex-row bg-black text-white">
      {/* Sidebar - for larger screens */}
      <aside className="hidden lg:block lg:w-64 lg:relative h-full bg-zinc-900">
        <Sidebar />
      </aside>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <aside className="fixed top-0 left-0 h-full w-64 z-30 lg:hidden bg-zinc-900">
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}
      
      <div className="flex flex-1 flex-col min-h-screen">
        {/* Header */}
        <div className="bg-zinc-950">
          <Header toggleSidebar={toggleSidebar} />
        </div>
        
        {/* Main Content Area */}
        <section className="flex flex-1 h-full overflow-y-auto pb-20 p-4 mt-2 bg-black">
          <Outlet />
        </section>
        
        {/* Mobile Footer */}
        <footer className="md:hidden w-full h-19 fixed bottom-0 left-0 right-0 z-10">
          <Bottombar />
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;