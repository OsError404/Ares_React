import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.roles.includes('ADMIN');

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed left-0 right-0 top-0 z-50 backdrop-blur-md"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-background-paper/70 shadow-sm" />
        
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-xl font-bold text-transparent"
            >
              Sistema de Gestión de Audiencias
            </motion.h1>
          </div>

          {user && (
            <div className="flex items-center space-x-6">
              {user.roles.includes('NOTIFICATIONS') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative text-secondary-600 hover:text-secondary-900"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-xs text-white">
                    3
                  </span>
                </motion.button>
              )}

              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin')}
                  className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm font-medium">Configuración</span>
                </motion.button>
              )}

              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-secondary-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-secondary-500">
                      {user.roles.join(', ')}
                    </span>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 rounded-lg bg-background-subtle px-3 py-2 text-sm font-medium text-secondary-700 shadow-sm transition-all hover:bg-background-paper hover:shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};