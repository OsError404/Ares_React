import React, { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Filter, Download } from 'lucide-react';
import { api } from '../../lib/api';
import { CalendarFilters } from './CalendarFilters';
import type { Hearing } from '../../types/hearing';

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

const statusColors = {
  pendiente: 'bg-yellow-100 border-yellow-400 text-yellow-800',
  en_curso: 'bg-green-100 border-green-400 text-green-800',
  finalizada: 'bg-blue-100 border-blue-400 text-blue-800',
  cancelada: 'bg-red-100 border-red-400 text-red-800',
};

export const HearingCalendar = () => {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: '',
    conciliator: '',
    room: '',
  });

  const { data: hearings, isLoading } = useQuery({
    queryKey: ['hearings', filters],
    queryFn: async () => {
      const { data } = await api.get('/hearings', { params: filters });
      return data;
    },
  });

  const handleEventClick = useCallback((event: Hearing) => {
    // Implementar vista detallada de la audiencia
    console.log('Event clicked:', event);
  }, []);

  const eventStyleGetter = useCallback((event: Hearing) => {
    return {
      className: `border-l-4 p-2 ${statusColors[event.status]}`,
    };
  }, []);

  const handleExportCalendar = () => {
    // Implementar exportación del calendario
    console.log('Exporting calendar...');
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Calendario de Audiencias
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilters({})}
            className="flex items-center space-x-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </button>
          <button
            onClick={handleExportCalendar}
            className="flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <CalendarFilters filters={filters} onFilterChange={setFilters} />

      <div className="h-[600px] rounded-lg border bg-white p-4 shadow">
        <Calendar
          localizer={localizer}
          events={hearings}
          startAccessor="startDate"
          endAccessor="endDate"
          titleAccessor="caseNumber"
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
            agenda: 'Agenda',
          }}
          culture="es"
        />
      </div>
    </motion.div>
  );
};