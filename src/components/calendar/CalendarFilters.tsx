import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface CalendarFiltersProps {
  filters: any;
  onFilterChange: (filters: any) => void;
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-lg border bg-white p-4 shadow"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          type="date"
          label="Fecha Inicio"
          name="startDate"
          value={filters.startDate || ''}
          onChange={handleChange}
        />

        <Input
          type="date"
          label="Fecha Fin"
          name="endDate"
          value={filters.endDate || ''}
          onChange={handleChange}
        />

        <Select
          label="Estado"
          name="status"
          value={filters.status}
          onChange={handleChange}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_curso">En Curso</option>
          <option value="finalizada">Finalizada</option>
          <option value="cancelada">Cancelada</option>
        </Select>

        <Select
          label="Conciliador"
          name="conciliator"
          value={filters.conciliator}
          onChange={handleChange}
        >
          <option value="">Todos los conciliadores</option>
          {/* Agregar opciones de conciliadores */}
        </Select>

        <Select
          label="Sala"
          name="room"
          value={filters.room}
          onChange={handleChange}
        >
          <option value="">Todas las salas</option>
          {/* Agregar opciones de salas */}
        </Select>
      </div>
    </motion.div>
  );
};