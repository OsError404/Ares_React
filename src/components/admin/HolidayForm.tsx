import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const holidaySchema = z.object({
  date: z.string()
    .min(1, 'Seleccione una fecha'),
  description: z.string()
    .min(3, 'La descripción debe tener al menos 3 caracteres'),
  recurring: z.boolean()
    .default(false),
});

type HolidayFormData = z.infer<typeof holidaySchema>;

interface HolidayFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const HolidayForm: React.FC<HolidayFormProps> = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HolidayFormData>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      recurring: false,
    },
  });

  const onSubmit = async (data: HolidayFormData) => {
    try {
      await api.post('/holidays', data);
      toast.success('Día festivo registrado exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al registrar día festivo:', error);
      toast.error('Error al registrar el día festivo');
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
          type="date"
          label="Fecha"
          {...register('date')}
          error={errors.date?.message}
        />

        <Input
          label="Descripción"
          {...register('description')}
          error={errors.description?.message}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="recurring"
            {...register('recurring')}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="recurring"
            className="text-sm text-gray-700"
          >
            Festivo recurrente (se repite cada año)
          </label>
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
            {isSubmitting ? 'Registrando...' : 'Registrar Festivo'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};