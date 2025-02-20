```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Select } from '../ui/Select';
import type { Room } from '../../types/room';

interface RoomFiltersProps {
  filters: {
    status: string;
    room: string;
    user: string;
  };
  onFilterChange: (filters: any) => void;
  rooms: Room[];
}

export const RoomFilters: React.FC<RoomFiltersProps> = ({
  filters,
  onFilterChange,
  rooms,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-lg border bg-white p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select
          label="Estado"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="ocupada">Ocupada</option>
          <option value="mantenimiento">En mantenimiento</option>
        </Select>

        <Select
          label="Sala"
          name="room"
          value={filters.room}
          onChange={handleChange}
        >
          <option value="">Todas las salas</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </Select>

        <Select
          label="Usuario asignado"
          name="user"
          value={filters.user}
          onChange={handleChange}
        >
          <option value="">Todos los usuarios</option>
          {/* Add user options dynamically */}
        </Select>
      </div>
    </motion.div>
  );
};
```