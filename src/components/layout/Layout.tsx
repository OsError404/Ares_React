import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-background">
      <AnimatePresence mode="wait">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      </AnimatePresence>

      <div className="flex flex-1 flex-col">
        <Topbar />
        
        <motion.main
          className={`flex-1 overflow-x-hidden overflow-y-auto bg-background transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-64' : 'ml-20'
          } mt-16 p-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          key={location.pathname}
        >
          <div className="container mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default Layout;