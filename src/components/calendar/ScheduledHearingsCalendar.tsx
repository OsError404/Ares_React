import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { HearingDetailsModal } from './HearingDetailsModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es },
});

interface ScheduledHearing {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  room: {
    name: string;
    location: string;
  };
  conciliator: {
    name: string;
  };
}

export const ScheduledHearingsCalendar = () => {
  const [selectedHearing, setSelectedHearing] = useState<ScheduledHearing | null>(null);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  const { data: hearings = [], isLoading } = useQuery({
    queryKey: ['scheduled-hearings', date, view],
    queryFn: async () => {
      const { data } = await api.get('/hearing-requests/scheduled', {
        params: {
          start: format(date, 'yyyy-MM-dd'),
          view: view.toLowerCase(),
        },
      });
      return data.map((hearing: any) => ({
        ...hearing,
        start: new Date(hearing.start),
        end: new Date(hearing.end),
      }));
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  const eventStyleGetter = (event: ScheduledHearing) => ({
    className: 'rounded-lg border shadow-sm',
    style: {
      backgroundColor: '#EFF6FF',
      borderColor: '#3B82F6',
      color: '#1E40AF',
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={hearings}
            startAccessor="start"
            endAccessor="end"
            views={{
              month: true,
              week: true,
              day: true,
            }}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={(event) => setSelectedHearing(event as ScheduledHearing)}
            eventPropGetter={eventStyleGetter}
            messages={{
              today: 'Hoy',
              previous: 'Anterior',
              next: 'Siguiente',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              noEventsInRange: 'No hay audiencias programadas en este período',
            }}
            culture="es"
            defaultView={Views.WEEK}
            min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
            max={new Date(0, 0, 0, 18, 0, 0)} // 6:00 PM
            timeslots={2}
            step={30}
          />
        </div>
      </div>

      {selectedHearing && (
        <HearingDetailsModal
          hearing={selectedHearing}
          onClose={() => setSelectedHearing(null)}
        />
      )}
    </div>
  );
};