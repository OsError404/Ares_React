```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { RoomEvent } from '../../types/room';

interface RoomDetailsModalProps {
  event: RoomEvent | null;
  onClose: () => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  event,
  onClose,
}) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {event.room.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Código: {event.room.id}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Clock className="h-5 w-5" />
              <div>
                <p className="font-medium">Horario</p>
                <p className="text-sm">
                  {format(event.start, 'PPP p', { locale: es })} -{' '}
                  {format(event.end, 'p', { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <Users className="h-5 w-5" />
              <div>
                <p className="font-medium">Capacidad</p>
                <p className="text-sm">{event.room.capacity} personas</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="h-5 w-5" />
              <div>
                <p className="font-medium">Ubicación</p>
                <p className="text-sm">{event.room.location}</p>
              </div>
            </div>

            {event.user && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="font-medium text-gray-700">Reservado por</p>
                <p className="text-sm text-gray-600">{event.user.name}</p>
                <p className="text-sm text-gray-500">{event.user.email}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
```