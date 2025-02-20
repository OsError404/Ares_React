import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, MapPin, Clock } from 'lucide-react';
import { api } from '../../lib/api';

interface CurrentHearing {
  id: string;
  type: string;
  startTime: string;
  room: {
    name: string;
    location: string;
  };
  conciliator: {
    name: string;
  };
  participants: {
    name: string;
    role: string;
  }[];
}

export const CurrentHearingsCalendar = () => {
  const { data: hearings = [], isLoading } = useQuery({
    queryKey: ['current-hearings'],
    queryFn: async () => {
      const { data } = await api.get('/hearing-requests/current');
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {hearings.map((hearing: CurrentHearing) => (
          <motion.div
            key={hearing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Audiencia de {hearing.type}
              </h3>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                En curso
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center text-gray-600">
                <Clock className="mr-2 h-5 w-5" />
                <span>
                  Inicio: {format(new Date(hearing.startTime), 'p', { locale: es })}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="mr-2 h-5 w-5" />
                <span>
                  {hearing.room.name} - {hearing.room.location}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <Users className="mr-2 h-5 w-5" />
                <span>Conciliador: {hearing.conciliator.name}</span>
              </div>

              <div className="mt-4">
                <h4 className="mb-2 font-medium text-gray-700">Participantes:</h4>
                <div className="space-y-1">
                  {hearing.participants.map((participant, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {participant.name} - {participant.role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {hearings.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-gray-300 p-6 text-center">
            <p className="text-gray-500">
              No hay audiencias en curso en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};