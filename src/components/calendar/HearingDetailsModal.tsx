import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HearingDetailsModalProps {
  hearing: {
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
  };
  onClose: () => void;
}

export const HearingDetailsModal: React.FC<HearingDetailsModalProps> = ({
  hearing,
  onClose,
}) => {
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

          <h2 className="text-xl font-semibold text-gray-900">
            {hearing.title}
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Clock className="h-5 w-5" />
              <div>
                <p className="font-medium">Horario</p>
                <p className="text-sm">
                  {format(hearing.start, 'PPP p', { locale: es })} -{' '}
                  {format(hearing.end, 'p', { locale: es })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="h-5 w-5" />
              <div>
                <p className="font-medium">Ubicación</p>
                <p className="text-sm">
                  {hearing.room.name} - {hearing.room.location}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
              <Users className="h-5 w-5" />
              <div>
                <p className="font-medium">Conciliador</p>
                <p className="text-sm">{hearing.conciliator.name}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
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