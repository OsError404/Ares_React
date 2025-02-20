```tsx
import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import { api } from '../../lib/api';
import { RoomFilters } from './RoomFilters';
import { RoomLegend } from './RoomLegend';
import { RoomDetailsModal } from './RoomDetailsModal';
import type { Room, RoomEvent } from '../../types/room';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const views = {
  month: true,
  week: true,
  day: true,
};

export const RoomCalendar = () => {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<RoomEvent | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    room: '',
    user: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms', filters],
    queryFn: async () => {
      const { data } = await api.get('/rooms', { params: filters });
      return data;
    },
  });

  const { data: events = [] } = useQuery({
    queryKey: ['room-events', date, view],
    queryFn: async () => {
      const start = format(date, 'yyyy-MM-dd');
      const { data } = await api.get('/room-events', { 
        params: { start, view: view.toLowerCase() } 
      });
      return data;
    },
  });

  const handleEventClick = useCallback((event: RoomEvent) => {
    setSelectedEvent(event);
  }, []);

  const eventStyleGetter = useCallback((event: RoomEvent) => {
    const style = {
      className: 'rounded-lg border shadow-sm p-2',
      style: {
        backgroundColor: event.room.status === 'ocupada' ? '#FEE2E2' : '#DCFCE7',
        borderColor: event.room.status === 'ocupada' ? '#EF4444' : '#22C55E',
        color: event.room.status === 'ocupada' ? '#991B1B' : '#166534',
      },
    };
    return style;
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const availableRooms = rooms.filter((room: Room) => room.status === 'disponible').length;
  const totalRooms = rooms.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Calendario de Salas
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {availableRooms} de {totalRooms} salas disponibles
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar sala o usuario..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <RoomFilters
          filters={filters}
          onFilterChange={setFilters}
          rooms={rooms}
        />
      )}

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <RoomLegend />
        
        <div className="mt-6 h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={views}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleEventClick}
            eventPropGetter={eventStyleGetter}
            messages={{
              today: 'Hoy',
              previous: 'Anterior',
              next: 'Siguiente',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              noEventsInRange: 'No hay reservas en este período',
            }}
            culture="es"
          />
        </div>
      </div>

      <RoomDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </motion.div>
  );
};
```