import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin } from 'lucide-react';
import { api } from '../../lib/api';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { cn } from '../../utils/cn';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  rooms: Room[];
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  status: 'disponible' | 'ocupada' | 'mantenimiento';
}

interface ApproveHearingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (locationId: string, roomId: string) => Promise<void>;
  hearingDateTime: string;
}

export const ApproveHearingModal: React.FC<ApproveHearingModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  hearingDateTime,
}) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', hearingDateTime],
    queryFn: async () => {
      const { data } = await api.get('/locations', {
        params: { hearingDateTime }
      });
      return data;
    },
  });

  const filteredLocations = locations.filter((location: Location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async () => {
    if (selectedLocation && selectedRoom) {
      await onApprove(selectedLocation, selectedRoom);
      onClose();
    }
  };

  const availableRooms = selectedLocation
    ? locations.find((l: Location) => l.id === selectedLocation)?.rooms.filter(
        (room: Room) => room.status === 'disponible'
      ) || []
    : [];

  if (!isOpen) return null;

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
          className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900">
            Asignar Sala para la Audiencia
          </h2>

          <div className="mt-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por sede o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium text-gray-700">Sedes Disponibles</h3>
                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200">
                  {filteredLocations.map((location: Location) => (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocation(location.id)}
                      className={cn(
                        "w-full border-b border-gray-200 p-4 text-left transition-colors hover:bg-gray-50",
                        selectedLocation === location.id && "bg-primary-50"
                      )}
                    >
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        {location.city}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium text-gray-700">Salas Disponibles</h3>
                <Select
                  label=""
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  disabled={!selectedLocation}
                >
                  <option value="">Seleccione una sala</option>
                  {availableRooms.map((room: Room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} - Capacidad: {room.capacity}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleApprove}
              disabled={!selectedLocation || !selectedRoom}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              Aprobar y Asignar Sala
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};