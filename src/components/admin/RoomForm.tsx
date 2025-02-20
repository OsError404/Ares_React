import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const roomSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  locationId: z.string()
    .min(1, 'Seleccione una sede'),
  modality: z.enum(['presencial', 'virtual'], {
    required_error: 'Seleccione una modalidad',
  }),
  startDate: z.string()
    .min(1, 'Seleccione una fecha de inicio'),
  endDate: z.string()
    .min(1, 'Seleccione una fecha de finalización'),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ onClose, onSuccess }) => {
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await api.get('/locations');
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
  });

  const onSubmit = async (data: RoomFormData) => {
    try {
      await api.post('/rooms', data);
      toast.success('Sala registrada exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al registrar sala:', error);
      toast.error('Error al registrar la sala');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre de la Sala"
          {...register('name')}
          error={errors.name?.message}
        />

        <Select
          label="Sede"
          {...register('locationId')}
          error={errors.locationId?.message}
        >
          <option value="">Seleccione una sede</option>
          {locations.map((location: any) => (
            <option key={location._id} value={location._id}>
              {location.name}
            </option>
          ))}
        </Select>

        <Select
          label="Modalidad"
          {...register('modality')}
          error={errors.modality?.message}
        >
          <option value="">Seleccione una modalidad</option>
          <option value="presencial">Presencial</option>
          <option value="virtual">Virtual</option>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Fecha de Inicio"
            {...register('startDate')}
            error={errors.startDate?.message}
          />

          <Input
            type="date"
            label="Fecha de Finalización"
            {...register('endDate')}
            error={errors.endDate?.message}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Sala'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};