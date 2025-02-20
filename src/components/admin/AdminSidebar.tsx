import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Building2, MapPin, Calendar, FileSignature, DoorOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

const menuItems = [
  {
    path: '/admin/usuarios',
    icon: Users,
    label: 'Gestión de Usuarios',
  },
  {
    path: '/admin/empresas',
    icon: Building2,
    label: 'Gestión de Empresas',
  },
  {
    path: '/admin/sedes',
    icon: MapPin,
    label: 'Sedes',
  },
  {
    path: '/admin/salas',
    icon: DoorOpen,
    label: 'Salas',
  },
  {
    path: '/admin/festivos',
    icon: Calendar,
    label: 'Días Festivos',
  },
  {
    path: '/admin/firmas',
    icon: FileSignature,
    label: 'Firmas Digitales',
  },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-background-paper shadow-md">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Panel de Administración</h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-primary-50 hover:text-primary",
                  isActive
                    ? "bg-primary-100 text-primary"
                    : "text-gray-700"
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;