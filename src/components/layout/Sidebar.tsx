import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarPlus, ListChecks, Bell, LineChart, ChevronLeft, ChevronRight, Settings, Archive } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    path: '/solicitar',
    icon: CalendarPlus,
    label: 'Solicitar audiencias',
    roles: ['REQUESTS', 'ADMIN'],
  },
  {
    path: '/solicitadas',
    icon: ListChecks,
    label: 'Audiencias solicitadas',
    roles: ['REQUESTS', 'ADMIN', 'CONCILIATOR'],
  },
  {
    path: '/notificaciones',
    icon: Bell,
    label: 'Notificación de Audiencias',
    roles: ['NOTIFICATIONS', 'ADMIN'],
  },
  {
    path: '/archivo',
    icon: Archive,
    label: 'Archivo',
    roles: ['ARCHIVE', 'ADMIN'],
  },
  {
    path: '/seguimiento',
    icon: LineChart,
    label: 'Control Y seguimiento',
    roles: ['ADMIN', 'CONCILIATOR'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.some(role => user?.roles.includes(role))
  );

  const isAdmin = user?.roles.includes('ADMIN');

  return (
    <motion.aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white shadow-lg transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4">
          {isOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-primary"
            >
              Sistema de Agendamiento Ares
            </motion.h1>
          )}
          <button
            onClick={onToggle}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  "hover:bg-primary-50 hover:text-primary",
                  isActive
                    ? "bg-primary-100 text-primary"
                    : "text-gray-700",
                  !isOpen && "justify-center"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-3"
                >
                  {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors mt-4",
                  "hover:bg-primary-50 hover:text-primary",
                  isActive
                    ? "bg-primary-100 text-primary"
                    : "text-gray-700",
                  !isOpen && "justify-center",
                  "border-t border-gray-200 pt-4"
                )
              }
            >
              <Settings className="h-5 w-5" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-3"
                >
                  Configuración
                </motion.span>
              )}
            </NavLink>
          )}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;